import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  // Signal to hold the current theme
  theme = signal<Theme>('light');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Load from local storage
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        this.theme.set(savedTheme);
      } else {
        // Default to dark as requested
        this.theme.set('light');
      }

      // Apply theme whenever it changes
      effect(() => {
        const currentTheme = this.theme();
        localStorage.setItem('theme', currentTheme);
        this.applyTheme(currentTheme);
      });
    }
  }

  toggleTheme() {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  setTheme(newTheme: Theme) {
    this.theme.set(newTheme);
  }

  private applyTheme(theme: Theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
