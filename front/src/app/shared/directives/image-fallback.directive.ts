import { Directive, ElementRef, Input, OnInit } from "@angular/core";

@Directive({
  selector: "[appImageFallback]",
  standalone: true,
})
export class ImageFallbackDirective implements OnInit {
  @Input() appImageFallback: string = "assets/icons/icon-152x152.png";
  @Input() src: string = "";

  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngOnInit() {
    this.el.nativeElement.onerror = () => {
      this.el.nativeElement.src = this.appImageFallback;
    };
  }
}
