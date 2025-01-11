import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string;

  constructor(
    private router: Router, 
    private fb: FormBuilder, 
    private toastr: ToastrService,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Redirect user to dashboard if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  async login(): Promise<void> {
    if (!this.loginForm.valid) {
      this.toastr.error('Invalid form');
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      const loggedIn = await this.authService.login(email, password).toPromise();

      if (loggedIn) {
        this.toastr.success('Authentification réussie')
        this.router.navigate(['/dashboard']);
      } else {
        this.toastr.error('Email ou mot de passe invalide');
      }
    } catch (error) {
      console.error('Login failed:', error);
      this.toastr.error('Login failed');
    }
  }

  logout(): void {
    // Call logout method from AuthService to clear session
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
