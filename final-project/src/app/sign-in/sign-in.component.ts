import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Local storage'daki tüm verileri temizle
    localStorage.clear();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value
      };

      console.log('Giriş isteği gönderiliyor:', loginData);

      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('Giriş başarılı:', response);
          localStorage.setItem('token', response.token);
          
          // JWT token'ı decode et ve konsola yazdır
          const decodedToken = this.authService.getDecodedToken();
          console.log('Decode edilmiş JWT Token:', decodedToken);
          
          if (decodedToken) {
            console.log('Kullanıcı Bilgileri:');
            console.log('Kullanıcı Adı:', decodedToken.sub);
            console.log('Roller:', decodedToken.role);
            console.log('Token Oluşturulma Tarihi:', new Date(decodedToken.iat * 1000).toLocaleString());
            console.log('Token Bitiş Tarihi:', new Date(decodedToken.exp * 1000).toLocaleString());
            
            // Rolü localStorage'a kaydet
            if (decodedToken.role) {
              const roleValue = Array.isArray(decodedToken.role) ? decodedToken.role.join(',') : decodedToken.role;
              localStorage.setItem('userRole', roleValue);

              // Role göre yönlendirme
              if (roleValue.includes('DOCTOR')) {
                this.router.navigate(['/user']);
              } else if (roleValue.includes('ROLE_USER')) {
                this.router.navigate(['/examinations']);
              } else {
                console.warn('Tanımlanmamış rol:', roleValue);
                // Varsayılan yönlendirme veya hata mesajı gösterme
                this.error = 'Geçersiz kullanıcı rolü';
              }
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Giriş başarısız:', error);
          if (error.status === 401) {
            this.error = 'Kullanıcı adı veya şifre hatalı';
          } else if (error.error?.message) {
            this.error = error.error.message;
          } else {
            this.error = 'Giriş işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.';
          }
        }
      });
    }
  }
}
