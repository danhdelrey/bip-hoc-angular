import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

@Directive({ selector: '[appUnless]' })
export class Unless {
  appUnless = input.required<boolean>();
  private readonly tpl = inject(TemplateRef);
  private readonly vcr = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      this.vcr.clear();
      if (!this.appUnless()) this.vcr.createEmbeddedView(this.tpl);
    });
  }
}
