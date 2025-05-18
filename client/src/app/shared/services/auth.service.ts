import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.checkAuth().subscribe({
      next: (isAuth) => this.loggedIn.next(isAuth),
      error: () => this.loggedIn.next(false)
    });
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }


  login(email: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/app/login', body, { headers, withCredentials: true }).pipe(
      tap(() => this.loggedIn.next(true))
    );
  }

  register(user: User) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post('http://localhost:5000/app/register', user, {
      headers: headers,
      withCredentials: true
    });
  }

  logout() {
    return this.http.post('http://localhost:5000/app/logout', {}, {
      withCredentials: true,
      responseType: 'text'
    }).pipe(
      tap(() => this.loggedIn.next(false))
    );
  }
  getProfile(): Observable<any> {
    return this.http.get('http://localhost:5000/app/profile', { withCredentials: true });
  }

  checkAuth() {
    return this.http.get<boolean>('http://localhost:5000/app/checkAuth', { withCredentials: true });
  }

  checkPermission(callback: (permission: string | null) => void): void {
    this.http.get<{ permission: string }>('http://localhost:5000/app/checkPermission', { withCredentials: true })
      .subscribe({
        next: (res) => callback(res.permission),
        error: () => callback(null)
      });
  }
}
