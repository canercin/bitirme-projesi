import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/sign-in']);
      return false;
    }

    const allowedRoles = route.data['roles'] as Array<string>;
    const userRole = this.authService.getUserRole();

    if (!userRole || !allowedRoles.includes(userRole)) {
      this.router.navigate(['/']);

console.log('debug')

      return false;
    }


    return true;
  }
} 