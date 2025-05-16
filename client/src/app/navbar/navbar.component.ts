import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router,RouterModule  } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})


export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  constructor(private authService: AuthService, private router: Router) {}

ngOnInit(): void {
  this.authService.isLoggedIn$.subscribe(auth => {
    this.isLoggedIn = auth;
    if (auth) {
      this.authService.checkPermission((permission: string | null) => {
        this.isAdmin = (permission === 'admin');
      });
    }
  });
}

logout() {
    this.authService.logout().subscribe({
      next: (data) => {
        console.log(data);
        this.isAdmin=false;
        this.router.navigateByUrl('/login');
      }, error: (err) => {
        console.log(err);
      }
    })
  }

}
