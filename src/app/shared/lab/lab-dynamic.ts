import { NgComponentOutlet } from '@angular/common';
import { createComponent, inputBinding, outputBinding, twoWayBinding, EnvironmentInjector } from '@angular/core';

/** Globals cho bài luyện Component động: NgComponentOutlet, createComponent và binding API (inputBinding…). */
export function dynamicExtras(): Record<string, unknown> {
  return { NgComponentOutlet, createComponent, inputBinding, outputBinding, twoWayBinding, EnvironmentInjector };
}
