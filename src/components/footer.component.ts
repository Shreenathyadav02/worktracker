import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <footer class="footer" [class.scrolled]="isScrolled">
      <div class="footer-content">
        <!-- Brand Section -->
        <div class="footer-section">
          <div class="brand">
            <div class="logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"/>
              </svg>
            </div>
            <div class="brand-info">
              <span class="brand-name">WorkTracker</span>
              <span class="brand-tagline">Track your work efficiently</span>
            </div>
          </div>
          <p class="footer-description">
            Streamline your workflow with powerful tracking and analytics tools. Built with cutting-edge technology for modern teams.
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.337-3.369-1.337-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022.798-.223 1.654-.334 2.504-.337.85.003 1.706.114 2.504.337 1.909-1.291 2.747-1.022 2.747-1.022.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.335-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Product Links -->
        <div class="footer-section">
          <h3 class="section-title">Product</h3>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Features</a></li>
            <li><a href="#" class="footer-link">Pricing</a></li>
            <li><a href="#" class="footer-link">Changelog</a></li>
            <li><a href="#" class="footer-link">Roadmap</a></li>
            <li><a href="#" class="footer-link">API</a></li>
          </ul>
        </div>

        <!-- Support Links -->
        <div class="footer-section">
          <h3 class="section-title">Support</h3>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Documentation</a></li>
            <li><a href="#" class="footer-link">Help Center</a></li>
            <li><a href="#" class="footer-link">Community</a></li>
            <li><a href="#" class="footer-link">Contact</a></li>
            <li><a href="#" class="footer-link">Status</a></li>
          </ul>
        </div>

        <!-- Company Links -->
        <div class="footer-section">
          <h3 class="section-title">Company</h3>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">About</a></li>
            <li><a href="#" class="footer-link">Blog</a></li>
            <li><a href="#" class="footer-link">Careers</a></li>
            <li><a href="#" class="footer-link">Press</a></li>
            <li><a href="#" class="footer-link">Partners</a></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div class="footer-section">
          <h3 class="section-title">Stay Updated</h3>
          <p class="newsletter-text">Get the latest features and updates delivered to your inbox</p>
          <div class="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              class="newsletter-input"
              [(ngModel)]="email"
              (keyup.enter)="subscribeNewsletter()"
            >
            <button class="newsletter-btn" (click)="subscribeNewsletter()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
          <div *ngIf="newsletterMessage" class="newsletter-message" [class.success]="newsletterSuccess">
            {{ newsletterMessage }}
          </div>
          <div class="newsletter-stats">
            <span class="stats-text">Join {{subscriberCount}}+ subscribers</span>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <div class="copyright">
            <span>© {{ currentYear }} WorkTracker. All rights reserved.</span>
          </div>
          
          <!-- Developer Credit -->
          <div class="developer-credit">
            <span class="credit-text">
              Designed & Developed with 
              <span class="heart">❤️</span> by 
              <a href="https://github.com/shreenathpyadav" target="_blank" class="developer-link">
                Shreenath P Yadav
              </a>
            </span>
          </div>

          <div class="footer-bottom-right">
            <div class="legal-links">
              <a href="#" class="legal-link">Privacy Policy</a>
              <a href="#" class="legal-link">Terms of Service</a>
              <a href="#" class="legal-link">Cookie Policy</a>
              <a href="#" class="legal-link">GDPR</a>
            </div>
            <div class="version">
              <span class="version-text">v{{ appVersion }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll to Top Button -->
      <button class="scroll-top" (click)="scrollToTop()" [class.visible]="isScrolled">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
      </button>
    </footer>
  `,
  styles: [`
    .footer {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: #cbd5e1;
      position: relative;
      margin-top: auto;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer.scrolled {
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
    }

    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
      gap: 3rem;
      padding: 3rem 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .footer-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      display: block;
    }

    .brand-tagline {
      font-size: 0.875rem;
      color: #94a3b8;
      display: block;
    }

    .footer-description {
      color: #94a3b8;
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0;
    }

    .social-links {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .social-link {
      color: #94a3b8;
      transition: all 0.3s ease;
      padding: 0.5rem;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
    }

    .social-link:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .section-title {
      color: white;
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .footer-link {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.875rem;
      transition: all 0.3s ease;
      padding: 0.25rem 0;
    }

    .footer-link:hover {
      color: white;
      transform: translateX(4px);
    }

    .newsletter-text {
      color: #94a3b8;
      font-size: 0.875rem;
      margin: 0 0 1rem 0;
    }

    .newsletter-form {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .newsletter-input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #475569;
      border-radius: 8px;
      background: #1e293b;
      color: white;
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }

    .newsletter-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .newsletter-input::placeholder {
      color: #64748b;
    }

    .newsletter-btn {
      padding: 0.75rem;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .newsletter-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .newsletter-message {
      font-size: 0.75rem;
      padding: 0.5rem;
      border-radius: 4px;
      text-align: center;
    }

    .newsletter-message.success {
      background: rgba(34, 197, 94, 0.1);
      color: #4ade80;
    }

    .newsletter-message:not(.success) {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
    }

    .newsletter-stats {
      margin-top: 0.5rem;
    }

    .stats-text {
      font-size: 0.75rem;
      color: #64748b;
    }

    .footer-bottom {
      border-top: 1px solid #475569;
      padding: 1.5rem 2rem;
      background: rgba(15, 23, 42, 0.5);
    }

    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
      gap: 1rem;
    }

    .copyright {
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .developer-credit {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .credit-text {
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .heart {
      color: #ef4444;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    .developer-link {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .developer-link:hover {
      color: #60a5fa;
      text-decoration: underline;
    }

    .footer-bottom-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .legal-links {
      display: flex;
      gap: 1.5rem;
    }

    .legal-link {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.3s ease;
    }

    .legal-link:hover {
      color: white;
    }

    .version {
      color: #64748b;
      font-size: 0.75rem;
      font-family: monospace;
    }

    .scroll-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      opacity: 0;
      visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
    }

    .scroll-top.visible {
      opacity: 1;
      visibility: visible;
    }

    .scroll-top:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }

    @media (max-width: 1024px) {
      .footer-content {
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
      
      .footer-bottom-content {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
      
      .footer-bottom-right {
        align-items: center;
      }
    }

    @media (max-width: 768px) {
      .footer {
        position: relative;
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 2rem 1rem;
      }

      .legal-links {
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
      }

      .scroll-top {
        bottom: 1rem;
        right: 1rem;
        width: 40px;
        height: 40px;
      }
    }

    @media (max-width: 480px) {
      .footer-content {
        padding: 1.5rem 1rem;
      }

      .footer-bottom {
        padding: 1rem;
      }
      
      .developer-credit {
        flex-direction: column;
        gap: 0.25rem;
      }
    }
  `]
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  appVersion = '1.2.0';
  isScrolled = false;
  email = '';
  newsletterMessage = '';
  newsletterSuccess = false;
  subscriberCount = 1250;

  ngOnInit() {
    this.setupScrollListener();
  }

  setupScrollListener() {
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 100;
    });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  subscribeNewsletter() {
    if (!this.email || !this.isValidEmail(this.email)) {
      this.newsletterMessage = 'Please enter a valid email address';
      this.newsletterSuccess = false;
      return;
    }

    // Simulate API call
    this.newsletterMessage = 'Thank you for subscribing! Welcome to our community.';
    this.newsletterSuccess = true;
    this.subscriberCount++;
    
    // Reset form after 3 seconds
    setTimeout(() => {
      this.email = '';
      this.newsletterMessage = '';
    }, 3000);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}