import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { environment } from '../../environments/environment';

export interface UserRequest {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}

interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl + '/auth';
  private currentUser: AuthResponse | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(request: UserRequest): Observable<any> {
    return this.http.post(`http://172.20.10.12:8080/api/patient`, request);
  }

  login(request: UserRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.currentUser = response;
          this.handleUserNavigation(this.decodeToken(response.token));
        })
      );
  }

  private decodeToken(token: string): DecodedToken | null {
    if (!token) return null;
    
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  private handleUserNavigation(decodedToken: DecodedToken | null): void {
    if (!decodedToken) {
      this.router.navigate(['/sign-in']);
      return;
    }

    console.log('Role from token:', decodedToken.role);

    if (decodedToken.role === 'ROLE_DOCTOR') {
      this.router.navigate(['/user']);
    } else if (decodedToken.role === 'ROLE_USER' || decodedToken.role === 'ROLE_PATIENT') {
      this.router.navigate(['/examinations']);
      console.log('sebuf from service');
    } else {
      // Eğer rol tanımlı değilse veya beklenmeyen bir rolse
      this.router.navigate(['/']);
    }
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']);
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') && this.isTokenValid();
  }

  hasRole(role: string): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken.role === role : false;
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decodedToken = this.decodeToken(token);
    return decodedToken?.role || null;
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const decodedToken = this.decodeToken(token);
    if (decodedToken) {
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    }
    return false;
  }

  getDecodedToken(): DecodedToken | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return this.decodeToken(token);
  }

  getUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decodedToken = this.decodeToken(token);
    if (!decodedToken) return null;

    return {
      username: decodedToken.sub,
      role: decodedToken.role
    };
  }
}
