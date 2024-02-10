import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  // Angular 17 - ensure to import ProvideHttpClient in app.config.ts file
  http = inject(HttpClient);
  authService = inject(AuthService)
  router = inject(Router)

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void{
    this.http.post< { user: User }>(
      'https://api.realworld.io/api/users',
      {
        user: this.form.getRawValue(),
      }
    ).subscribe(response => {
      console.log('response',response);
      //Store a user token in local storage
      localStorage.setItem('token', response.user.token);
      this.authService.currentUserSignal.set(response.user);
      this.router.navigateByUrl('/');
    })
  }
}
