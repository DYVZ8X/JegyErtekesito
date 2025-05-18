import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) { }

login() {
  if (this.email && this.password) {
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (data) => {
        if (data) {
          this.authService.checkAuth().subscribe();
          this.router.navigateByUrl('/events');
        }
      },
      error: (err) => {
        console.log(err);
        if (err.status === 401) {
          alert('Hibás jelszó vagy felhasználónév!');
        } else {
          alert('Bejelentkezési hiba történt.');
        }
      },
    });
  } else {
    alert("Üres mezők!");
  }
}


  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

}
