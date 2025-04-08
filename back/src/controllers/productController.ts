import { Request, Response } from 'express';
import { db } from '../database/database';
import { Product, CreateProductDTO, UpdateProductDTO } from '../models/Product';

/**
 * Validation des données du produit
 * @param product - Données du produit à valider
 * @returns {Object} - Résultat de la validation avec isValid et errors
 */
const validateProduct = (
  product: Partial<Product>
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!product.code) errors.push('Le code du produit est requis');
  if (!product.name) errors.push('Le nom du produit est requis');
  if (product.price === undefined || product.price === null)
    errors.push('Le prix du produit est requis');
  if (product.quantity === undefined || product.quantity === null)
    errors.push('La quantité du produit est requise');

  if (
    product.price !== undefined &&
    (typeof product.price !== 'number' || product.price < 0)
  ) {
    errors.push('Le prix doit être un nombre positif');
  }

  if (
    product.quantity !== undefined &&
    (typeof product.quantity !== 'number' ||
      !Number.isInteger(product.quantity) ||
      product.quantity < 0)
  ) {
    errors.push('La quantité doit être un entier positif');
  }

  if (
    product.rating !== undefined &&
    (typeof product.rating !== 'number' ||
      product.rating < 0 ||
      product.rating > 5)
  ) {
    errors.push('La note doit être un nombre entre 0 et 5');
  }

  if (
    product.inventoryStatus &&
    !['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'].includes(product.inventoryStatus)
  ) {
    errors.push(
      "Le statut d'inventaire doit être INSTOCK, LOWSTOCK ou OUTOFSTOCK"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Conversion des données du produit pour l'insertion en base
 * @param product - Données du produit
 * @returns {Omit<Product, 'id'>} - Produit avec valeurs par défaut (sans l'ID qui sera généré par la base)
 */
const prepareProductForInsertion = (
  product: CreateProductDTO
): Omit<Product, 'id'> => {
  const timestamp = Date.now();

  return {
    ...product,
    description: product.description || '',
    image: product.image || '',
    category: product.category || 'Uncategorized',
    internalReference: product.internalReference || '',
    shellId: product.shellId || 0,
    rating: product.rating || 0,
    inventoryStatus:
      product.inventoryStatus ||
      (product.quantity > 10
        ? 'INSTOCK'
        : product.quantity > 0
        ? 'LOWSTOCK'
        : 'OUTOFSTOCK'),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

/**
 * Contrôleur pour la gestion des produits
 */
export const productController = {
  /**
   * Créer un nouveau produit
   */
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const productData: CreateProductDTO = req.body;

      const validation = validateProduct(productData);
      if (!validation.isValid) {
        res.status(400).json({
          error: 'Données invalides',
          details: validation.errors,
        });
        return;
      }

      const product = prepareProductForInsertion(productData);

      const sql = `
        INSERT INTO products (
          code, name, description, image, category, price, 
          quantity, internalReference, shellId, inventoryStatus, 
          rating, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(
        sql,
        [
          product.code,
          product.name,
          product.description,
          product.image,
          product.category,
          product.price,
          product.quantity,
          product.internalReference,
          product.shellId,
          product.inventoryStatus,
          product.rating,
          product.createdAt,
          product.updatedAt,
        ],
        function (err) {
          if (err) {
            console.error('Erreur lors de la création du produit:', err);
            res.status(500).json({
              error: 'Erreur serveur',
              message: 'Impossible de créer le produit',
            });
            return;
          }

          res.status(201).json({
            id: this.lastID,
            ...product,
          });
        }
      );
    } catch (error) {
      console.error('Erreur inattendue:', error);
      res.status(500).json({
        error: 'Erreur serveur',
        message: 'Une erreur inattendue est survenue',
      });
    }
  },

  /**
   * Récupérer tous les produits
   */
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'name',
        order = 'asc',
      } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const sql = `
        SELECT * FROM products 
        ORDER BY ${sortBy} ${order}
        LIMIT ? OFFSET ?
      `;

      const countSql = 'SELECT COUNT(*) as total FROM products';

      db.get(countSql, [], (err, countResult: any) => {
        if (err) {
          console.error('Erreur lors du comptage des produits:', err);
          res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible de récupérer les produits',
          });
          return;
        }

        db.all(sql, [Number(limit), offset], (err, rows) => {
          if (err) {
            console.error('Erreur lors de la récupération des produits:', err);
            res.status(500).json({
              error: 'Erreur serveur',
              message: 'Impossible de récupérer les produits',
            });
            return;
          }

          res.json({
            data: rows,
            pagination: {
              total: countResult.total,
              page: Number(page),
              limit: Number(limit),
              totalPages: Math.ceil(countResult.total / Number(limit)),
            },
          });
        });
      });
    } catch (error) {
      console.error('Erreur inattendue:', error);
      res.status(500).json({
        error: 'Erreur serveur',
        message: 'Une erreur inattendue est survenue',
      });
    }
  },

  /**
   * Récupérer un produit par son ID
   */
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID de produit invalide' });
        return;
      }

      const sql = 'SELECT * FROM products WHERE id = ?';

      db.get(sql, [id], (err, row) => {
        if (err) {
          console.error('Erreur lors de la récupération du produit:', err);
          res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible de récupérer le produit',
          });
          return;
        }

        if (!row) {
          res.status(404).json({ error: 'Produit non trouvé' });
          return;
        }

        res.json(row);
      });
    } catch (error) {
      console.error('Erreur inattendue:', error);
      res.status(500).json({
        error: 'Erreur serveur',
        message: 'Une erreur inattendue est survenue',
      });
    }
  },

  /**
   * Mettre à jour un produit
   */
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updates: UpdateProductDTO = req.body;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID de produit invalide' });
        return;
      }

      const checkSql = 'SELECT id FROM products WHERE id = ?';
      db.get(checkSql, [id], (err, row) => {
        if (err) {
          console.error('Erreur lors de la vérification du produit:', err);
          res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible de mettre à jour le produit',
          });
          return;
        }

        if (!row) {
          res.status(404).json({ error: 'Produit non trouvé' });
          return;
        }

        const validation = validateProduct(updates);
        if (!validation.isValid) {
          res.status(400).json({
            error: 'Données invalides',
            details: validation.errors,
          });
          return;
        }

        const timestamp = Date.now();

        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (updates.code !== undefined) {
          updateFields.push('code = ?');
          updateValues.push(updates.code);
        }

        if (updates.name !== undefined) {
          updateFields.push('name = ?');
          updateValues.push(updates.name);
        }

        if (updates.description !== undefined) {
          updateFields.push('description = ?');
          updateValues.push(updates.description);
        }

        if (updates.image !== undefined) {
          updateFields.push('image = ?');
          updateValues.push(updates.image);
        }

        if (updates.category !== undefined) {
          updateFields.push('category = ?');
          updateValues.push(updates.category);
        }

        if (updates.price !== undefined) {
          updateFields.push('price = ?');
          updateValues.push(updates.price);
        }

        if (updates.quantity !== undefined) {
          updateFields.push('quantity = ?');
          updateValues.push(updates.quantity);
        }

        if (updates.internalReference !== undefined) {
          updateFields.push('internalReference = ?');
          updateValues.push(updates.internalReference);
        }

        if (updates.shellId !== undefined) {
          updateFields.push('shellId = ?');
          updateValues.push(updates.shellId);
        }

        if (updates.inventoryStatus !== undefined) {
          updateFields.push('inventoryStatus = ?');
          updateValues.push(updates.inventoryStatus);
        }

        if (updates.rating !== undefined) {
          updateFields.push('rating = ?');
          updateValues.push(updates.rating);
        }

        updateFields.push('updatedAt = ?');
        updateValues.push(timestamp);

        updateValues.push(id);

        const sql = `
          UPDATE products 
          SET ${updateFields.join(', ')}
          WHERE id = ?
        `;

        db.run(sql, updateValues, function (err) {
          if (err) {
            console.error('Erreur lors de la mise à jour du produit:', err);
            res.status(500).json({
              error: 'Erreur serveur',
              message: 'Impossible de mettre à jour le produit',
            });
            return;
          }

          res.json({
            message: 'Produit mis à jour avec succès',
            changes: this.changes,
          });
        });
      });
    } catch (error) {
      console.error('Erreur inattendue:', error);
      res.status(500).json({
        error: 'Erreur serveur',
        message: 'Une erreur inattendue est survenue',
      });
    }
  },

  /**
   * Supprimer un produit
   */
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID de produit invalide' });
        return;
      }

      const checkSql = 'SELECT id FROM products WHERE id = ?';
      db.get(checkSql, [id], (err, row) => {
        if (err) {
          console.error('Erreur lors de la vérification du produit:', err);
          res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible de supprimer le produit',
          });
          return;
        }

        if (!row) {
          res.status(404).json({ error: 'Produit non trouvé' });
          return;
        }

        const sql = 'DELETE FROM products WHERE id = ?';

        db.run(sql, [id], function (err) {
          if (err) {
            console.error('Erreur lors de la suppression du produit:', err);
            res.status(500).json({
              error: 'Erreur serveur',
              message: 'Impossible de supprimer le produit',
            });
            return;
          }

          res.json({
            message: 'Produit supprimé avec succès',
            changes: this.changes,
          });
        });
      });
    } catch (error) {
      console.error('Erreur inattendue:', error);
      res.status(500).json({
        error: 'Erreur serveur',
        message: 'Une erreur inattendue est survenue',
      });
    }
  },
};
