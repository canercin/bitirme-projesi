import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signUpForm: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userType: ['PATIENT', [Validators.required]] // Default olarak PATIENT seçili
    });
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const { userType, ...userData } = this.signUpForm.value;

      this.authService.register(userData, userType).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          // Başarılı kayıt sonrası login sayfasına yönlendir
          this.router.navigate(['/sign-in']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          this.error = error.error?.message || 'Kayıt işlemi başarısız oldu.';
        }
      });
    }
  }
}
