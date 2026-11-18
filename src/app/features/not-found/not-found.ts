import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MascotSays } from '../../shared/ui/speech-bubble/speech-bubble';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MascotSays],
  template: `
    <div class="box toon toon-lg">
      <h1>404 — Lạc đường rồi!</h1>
      <app-mascot-says mood="sad" [size]="120">Bíp tìm khắp bản đồ mà không thấy trang này. Mình quay về nhà nhé?</app-mascot-says>
      <a class="btn btn-primary" routerLink="/">Về trang chủ</a>
    </div>
  `,
  styles: `
    :host { display: block; max-width: 760px; margin: 0 auto; padding: 40px 24px; }
    .box { padding: 30px; display: grid; gap: 20px; justify-items: start; }
  `,
})
export class NotFound {}
