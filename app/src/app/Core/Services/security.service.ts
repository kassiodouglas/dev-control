import { Injectable, inject } from '@angular/core';

declare global {
  interface Window {
    electronAPI?: {
      config: {
        hasSecurityPassword: () => Promise<boolean>;
        setSecurityPassword: (password: string) => Promise<void>;
        verifySecurityPassword: (password: string) => Promise<boolean>;
        isSetupComplete: () => Promise<boolean>;
        updateProfile: (profile: any) => Promise<void>;
        updateIntegrations: (integrations: any) => Promise<void>;
        completeSetup: () => Promise<void>;
      };
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private electronConfig = window.electronAPI?.config;

  public async hasSecurityPassword(): Promise<boolean> {
    if (this.electronConfig) {
      return await this.electronConfig.hasSecurityPassword();
    }
    console.warn('Electron API not available, hasSecurityPassword will return false.');
    return false;
  }

  public async setSecurityPassword(password: string): Promise<void> {
    if (this.electronConfig) {
      await this.electronConfig.setSecurityPassword(password);
    } else {
      console.warn('Electron API not available, cannot set security password.');
    }
  }

  public async verifySecurityPassword(password: string): Promise<boolean> {
    if (this.electronConfig) {
      return await this.electronConfig.verifySecurityPassword(password);
    }
    console.warn('Electron API not available, verifySecurityPassword will return false.');
    return false;
  }

  public async isSetupComplete(): Promise<boolean> {
    if (this.electronConfig) {
      return await this.electronConfig.isSetupComplete();
    }
    console.warn('Electron API not available, isSetupComplete will return false.');
    return false;
  }

  public async updateProfile(profile: any): Promise<void> {
    if (this.electronConfig) {
      await this.electronConfig.updateProfile(profile);
    } else {
      console.warn('Electron API not available, cannot update profile.');
    }
  }

  public async updateIntegrations(integrations: any): Promise<void> {
    if (this.electronConfig) {
      await this.electronConfig.updateIntegrations(integrations);
    } else {
      console.warn('Electron API not available, cannot update integrations.');
    }
  }

  public async completeSetup(): Promise<void> {
    if (this.electronConfig) {
      await this.electronConfig.completeSetup();
    } else {
      console.warn('Electron API not available, cannot complete setup.');
    }
  }
}
