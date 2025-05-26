import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Local storage'dan token'ı al
    const token = localStorage.getItem('token');

    // Eğer token varsa, request headers'a ekle
    if (token) {
      const clonedRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(clonedRequest);
    }

    // Token yoksa orijinal request'i gönder
    return next.handle(request);
  }
} 