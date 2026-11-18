import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, inject, input } from '@angular/core';
import { HookLog } from './hook-log';

@Component({
  selector: 'app-life-buddy',
  template: `<p>👋 Mình là {{ name() }}</p>`,
})
export class LifeBuddy implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  name = input('Bíp');
  private readonly log = inject(HookLog);

  constructor() {
    this.log.add('constructor');
  }
  ngOnChanges(changes: SimpleChanges) {
    this.log.add(`ngOnChanges: name = ${changes['name']?.currentValue}`);
  }
  ngOnInit() {
    this.log.add('ngOnInit');
  }
  ngAfterViewInit() {
    this.log.add('ngAfterViewInit');
  }
  ngOnDestroy() {
    this.log.add('ngOnDestroy');
  }
}
