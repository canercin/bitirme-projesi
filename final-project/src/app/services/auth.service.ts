import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";

export interface UserRequest {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
}

export interface DecodedToken {
  sub: string;        // kullanıcı adı
  role: string[];     // kullanıcı rolleri
  exp: number;        // token'ın son kullanma tarihi
  iat: number;        // token'ın oluşturulma tarihi
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private currentUser: AuthResponse | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(userData: UserRequest, userType: 'DOCTOR' | 'PATIENT'): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, { ...userData, userType }, { headers }).pipe(
      tap((response: AuthResponse) => {
        this.currentUser = response;
        localStorage.setItem('token', response.token);
        
        // Token'ı decode et ve kullanıcı bilgilerini al
        const decodedToken = this.getDecodedToken();
        if (decodedToken) {
          this.handleUserNavigation(decodedToken);
        }
      })
    );
  }

  login(loginData: UserRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log('Login request payload:', loginData);

    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, loginData, { headers }).pipe(
      tap((response: AuthResponse) => {
        console.log('Login response:', response);
        this.currentUser = response;
        localStorage.setItem('token', response.token);
        
        // Token'ı decode et ve kullanıcı bilgilerini al
        const decodedToken = this.getDecodedToken();
        if (decodedToken) {
          this.handleUserNavigation(decodedToken);
        }
      })
    );
  }

  // Token'ı decode et
  getDecodedToken(): DecodedToken | null {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        return jwtDecode<DecodedToken>(token);
      }
      return null;
    } catch (error) {
      console.error('Token decode hatası:', error);
      return null;
    }
  }

  // Kullanıcı rolüne göre yönlendirme yap
  private handleUserNavigation(decodedToken: DecodedToken): void {
    if (decodedToken.role.includes('ROLE_DOCTOR')) {
      this.router.navigate(['/users']);
    } else {
      this.router.navigate(['/test-results']);
    }
  }

  // Kullanıcı bilgilerini al
  getUserInfo(): { username: string, role: string[], firstName: string, lastName: string } | null {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      return {
        username: decodedToken.sub,
        role: decodedToken.role,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName
      };
    }
    return null;
  }

  // Token'ın geçerlilik süresini kontrol et
  isTokenValid(): boolean {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') && this.isTokenValid();
  }

  // Kullanıcı rolünü kontrol et
  hasRole(role: string): boolean {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.role.includes(role) : false;
  }
}
