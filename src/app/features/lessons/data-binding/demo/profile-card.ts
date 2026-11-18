import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Component THẬT chạy trong khung "Kết quả live".
 * Giữ đồng bộ với PROFILE_CARD_TS / PROFILE_CARD_HTML trong data-binding.content.ts.
 */
@Component({
  selector: 'app-profile-card',
  imports: [FormsModule],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.css',
})
export class ProfileCard {
  name = signal('Mai');
  avatarUrl = signal('avatars/cat.svg');
  likes = signal(0);
  nickname = signal('Mai Mít');

  like() {
    this.likes.update((n) => n + 1);
  }
}
