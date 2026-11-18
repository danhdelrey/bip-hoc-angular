import { Component, DestroyRef, inject, signal, type WritableSignal } from '@angular/core';
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject, Subscription } from 'rxjs';

type Kind = 'Subject' | 'BehaviorSubject' | 'ReplaySubject' | 'AsyncSubject';

function createSubject(kind: Kind): Subject<number> {
  switch (kind) {
    case 'Subject': return new Subject<number>(); // chỉ phát giá trị MỚI
    case 'BehaviorSubject': return new BehaviorSubject<number>(0); // luôn có giá trị hiện tại
    case 'ReplaySubject': return new ReplaySubject<number>(2); // phát lại 2 giá trị gần nhất
    case 'AsyncSubject': return new AsyncSubject<number>(); // chỉ phát giá trị cuối khi complete
  }
}

@Component({
  selector: 'app-subject-lab',
  template: `
    <select aria-label="Loại Subject" (change)="reset($any($event.target).value)">
      @for (k of kinds; track k) { <option>{{ k }}</option> }
    </select>
    <button type="button" (click)="emit()">next({{ count() + 1 }})</button>
    <button type="button" (click)="addSubscriber()">+ subscriber</button>
    <button type="button" (click)="complete()">complete()</button>
    <ul>
      @for (s of subscribers(); track s.name) {
        <li>{{ s.name }} nhận: {{ s.received().join(', ') || '—' }}</li>
      }
    </ul>
  `,
})
export class SubjectLab {
  readonly kinds: Kind[] = ['Subject', 'BehaviorSubject', 'ReplaySubject', 'AsyncSubject'];
  readonly count = signal(0);
  readonly subscribers = signal<{ name: string; received: WritableSignal<string[]> }[]>([]);
  private subject = createSubject('Subject');
  private subs = new Subscription();

  constructor() {
    inject(DestroyRef).onDestroy(() => this.subs.unsubscribe());
  }

  emit() {
    this.count.update((n) => n + 1);
    this.subject.next(this.count());
  }

  addSubscriber() {
    const received = signal<string[]>([]);
    const name = `Sub ${String.fromCharCode(65 + this.subscribers().length)}`;
    this.subs.add(
      this.subject.subscribe({
        next: (v) => received.update((r) => [...r, String(v)]),
        complete: () => received.update((r) => [...r, '|']),
      }),
    );
    this.subscribers.update((list) => [...list, { name, received }]);
  }

  complete() {
    this.subject.complete();
  }

  reset(kind: Kind) {
    this.subs.unsubscribe();
    this.subs = new Subscription();
    this.subject = createSubject(kind);
    this.count.set(0);
    this.subscribers.set([]);
  }
}
