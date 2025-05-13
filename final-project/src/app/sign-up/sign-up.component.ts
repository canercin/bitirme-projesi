import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Lütfen tüm alanları doldurun.';
      return;
    }

    this.authService.register(this.username, this.password).subscribe(
      (response) => {
        console.log('Kayıt başarılı:', response);
        this.router.navigate(['/sign-in']);
      },
      (error) => {
        console.error('Kayıt hatası:', error);
        this.errorMessage = 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.';
      }
    );
  }
}
