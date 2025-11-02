import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../lib/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="background-pattern"></div>
      
      <div class="auth-card">
        <div class="card-glow"></div>
        
        <div class="auth-header">
          <div class="logo-container">
            <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="4" width="24" height="24" rx="5" fill="url(#grad1)"/>
              <path d="M12 10h8v2h-8zm0 5h8v2h-8zm0 5h5v2h-5z" fill="white" opacity="0.95"/>
              <defs>
                <linearGradient id="grad1" x1="4" y1="4" x2="28" y2="28">
                  <stop offset="0%" stop-color="#1e293b"/>
                  <stop offset="100%" stop-color="#0f172a"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>WorkTracker</h1>
          <p>Streamline your workflow and boost productivity</p>
        </div>

        <div class="auth-tabs">
          <button
            class="tab"
            [class.active]="!isSignUp"
            (click)="isSignUp = false">
            <span>Sign In</span>
          </button>
          <button
            class="tab"
            [class.active]="isSignUp"
            (click)="isSignUp = true">
            <span>Sign Up</span>
          </button>
          <div class="tab-indicator" [class.sign-up]="isSignUp"></div>
        </div>

        <form (ngSubmit)="handleSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                type="email"
                id="email"
                [(ngModel)]="email"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type="password"
                id="password"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div class="error-message" *ngIf="error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ error }}</span>
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading">
            <span class="btn-content">
              <svg *ngIf="loading" class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
              </svg>
              <span>{{ loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In') }}</span>
            </span>
          </button>

          <div class="auth-footer" *ngIf="!isSignUp">
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>
        </form>
      </div>

      <div class="auth-info">
        <p>Trusted by professionals worldwide</p>
      </div>
    </div>
  `,
  styles: [`
    * {
      box-sizing: border-box;
    }

    .auth-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(to bottom right, #f8fafc 0%, #e2e8f0 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .background-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(circle at 20% 30%, rgba(15, 23, 42, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(15, 23, 42, 0.03) 0%, transparent 50%);
      pointer-events: none;
    }

    .auth-card {
      background: white;
      border-radius: 20px;
      box-shadow: 
        0 0 0 1px rgba(15, 23, 42, 0.05),
        0 20px 60px -15px rgba(15, 23, 42, 0.15),
        0 30px 60px -30px rgba(15, 23, 42, 0.25);
      padding: 3rem;
      width: 100%;
      max-width: 440px;
      position: relative;
      z-index: 1;
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .card-glow {
      position: absolute;
      inset: -2px;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0.05));
      border-radius: 20px;
      z-index: -1;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .auth-card:hover .card-glow {
      opacity: 1;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .logo-container {
      display: inline-block;
      margin-bottom: 1.25rem;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    .auth-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.75rem 0;
      letter-spacing: -0.025em;
    }

    .auth-header p {
      color: #64748b;
      margin: 0;
      font-size: 0.9375rem;
      font-weight: 400;
    }

    .auth-tabs {
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-bottom: 2.5rem;
      background: #f1f5f9;
      padding: 0.375rem;
      border-radius: 12px;
    }

    .tab {
      position: relative;
      padding: 0.875rem;
      background: transparent;
      border: none;
      border-radius: 10px;
      color: #64748b;
      font-weight: 600;
      font-size: 0.9375rem;
      cursor: pointer;
      transition: color 0.3s ease;
      z-index: 1;
    }

    .tab span {
      position: relative;
      z-index: 2;
    }

    .tab.active {
      color: #0f172a;
    }

    .tab-indicator {
      position: absolute;
      top: 0.375rem;
      left: 0.375rem;
      width: calc(50% - 0.25rem);
      height: calc(100% - 0.75rem);
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .tab-indicator.sign-up {
      transform: translateX(calc(100% + 0.5rem));
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1e293b;
      letter-spacing: -0.01em;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      color: #94a3b8;
      pointer-events: none;
      transition: color 0.2s;
    }

    .input-wrapper:focus-within .input-icon {
      color: #475569;
    }

    .form-group input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      font-size: 0.9375rem;
      color: #0f172a;
      background: #fafafa;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .form-group input::placeholder {
      color: #94a3b8;
    }

    .form-group input:focus {
      outline: none;
      border-color: #0f172a;
      background: white;
      box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.05);
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #fef2f2;
      border: 1.5px solid #fecaca;
      border-radius: 12px;
      color: #991b1b;
      font-size: 0.875rem;
      animation: shake 0.4s ease;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px); }
      75% { transform: translateX(8px); }
    }

    .error-message svg {
      flex-shrink: 0;
    }

    .btn-submit {
      padding: 1rem;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border: none;
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.2);
      position: relative;
      overflow: hidden;
    }

    .btn-submit::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .btn-submit:hover:not(:disabled)::before {
      opacity: 1;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.3);
    }

    .btn-submit:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.625rem;
    }

    .spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .auth-footer {
      text-align: center;
      margin-top: 0.5rem;
    }

    .forgot-link {
      color: #475569;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      transition: color 0.2s;
    }

    .forgot-link:hover {
      color: #0f172a;
    }

    .auth-info {
      margin-top: 2rem;
      text-align: center;
      z-index: 1;
    }

    .auth-info p {
      color: #64748b;
      font-size: 0.875rem;
      font-weight: 500;
      margin: 0;
    }

    @media (max-width: 640px) {
      .auth-card {
        padding: 2rem;
      }

      .auth-header h1 {
        font-size: 1.75rem;
      }
    }
  `]
})
export class AuthComponent {
  isSignUp = false;
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService) {}

  async handleSubmit() {
    this.error = '';
    this.loading = true;

    try {
      if (this.isSignUp) {
        await this.authService.signUp(this.email, this.password);
      } else {
        await this.authService.signIn(this.email, this.password);
      }
    } catch (error: any) {
      this.error = error.message || 'An error occurred. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}