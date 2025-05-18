import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  userData: any = null;

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data) => this.userData = data,
      error: (err) => console.error('Profil betöltési hiba:', err)
    });
  }
}
