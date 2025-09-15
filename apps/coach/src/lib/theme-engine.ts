import { InstituteBranding } from '@/types';

export interface ThemeConfig extends InstituteBranding {
  custom_domain?: string;
  favicon_url?: string;
  login_background_url?: string;
  dashboard_background_url?: string;
  email_header_url?: string;
  font_family?: string;
  border_radius?: 'none' | 'small' | 'medium' | 'large';
  theme_mode?: 'light' | 'dark' | 'auto';
}

export interface DynamicCSSVariables {
  '--primary': string;
  '--primary-foreground': string;
  '--secondary': string;
  '--secondary-foreground': string;
  '--accent': string;
  '--accent-foreground': string;
  '--background': string;
  '--foreground': string;
  '--muted': string;
  '--muted-foreground': string;
  '--card': string;
  '--card-foreground': string;
  '--border': string;
  '--input': string;
  '--ring': string;
  '--radius': string;
}

export class ThemeEngine {
  private static instance: ThemeEngine;
  private currentTheme: ThemeConfig | null = null;
  private cssVariables: DynamicCSSVariables | null = null;

  private constructor() {}

  public static getInstance(): ThemeEngine {
    if (!ThemeEngine.instance) {
      ThemeEngine.instance = new ThemeEngine();
    }
    return ThemeEngine.instance;
  }

  // Convert hex color to RGB values
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Generate lighter/darker variations of a color
  private adjustColor(hex: string, amount: number): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;

    const adjust = (value: number) => {
      const adjusted = value + amount;
      return Math.max(0, Math.min(255, adjusted));
    };

    const newR = adjust(rgb.r);
    const newG = adjust(rgb.g);
    const newB = adjust(rgb.b);

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  // Generate foreground color based on background color
  private getForegroundColor(backgroundColor: string): string {
    const rgb = this.hexToRgb(backgroundColor);
    if (!rgb) return '#000000';

    // Calculate luminance
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  // Generate complete CSS variables from theme config
  private generateCSSVariables(theme: ThemeConfig): DynamicCSSVariables {
    const primaryRgb = this.hexToRgb(theme.primary_color);
    const secondaryRgb = this.hexToRgb(theme.secondary_color);

    if (!primaryRgb || !secondaryRgb) {
      throw new Error('Invalid color format in theme configuration');
    }

    const radiusMap = {
      'none': '0px',
      'small': '0.25rem',
      'medium': '0.375rem',
      'large': '0.5rem',
    };

    return {
      '--primary': `${primaryRgb.r} ${primaryRgb.g} ${primaryRgb.b}`,
      '--primary-foreground': this.hexToRgb(this.getForegroundColor(theme.primary_color))!.r + ' ' +
                              this.hexToRgb(this.getForegroundColor(theme.primary_color))!.g + ' ' +
                              this.hexToRgb(this.getForegroundColor(theme.primary_color))!.b,
      '--secondary': `${secondaryRgb.r} ${secondaryRgb.g} ${secondaryRgb.b}`,
      '--secondary-foreground': this.hexToRgb(this.getForegroundColor(theme.secondary_color))!.r + ' ' +
                               this.hexToRgb(this.getForegroundColor(theme.secondary_color))!.g + ' ' +
                               this.hexToRgb(this.getForegroundColor(theme.secondary_color))!.b,
      '--accent': `${Math.round(primaryRgb.r * 0.9)} ${Math.round(primaryRgb.g * 0.9)} ${Math.round(primaryRgb.b * 0.9)}`,
      '--accent-foreground': this.hexToRgb(this.getForegroundColor(this.adjustColor(theme.primary_color, -20)))!.r + ' ' +
                            this.hexToRgb(this.getForegroundColor(this.adjustColor(theme.primary_color, -20)))!.g + ' ' +
                            this.hexToRgb(this.getForegroundColor(this.adjustColor(theme.primary_color, -20)))!.b,
      '--background': '255 255 255',
      '--foreground': '0 0 0',
      '--muted': '245 245 245',
      '--muted-foreground': '115 115 115',
      '--card': '255 255 255',
      '--card-foreground': '0 0 0',
      '--border': '229 229 229',
      '--input': '229 229 229',
      '--ring': `${primaryRgb.r} ${primaryRgb.g} ${primaryRgb.b}`,
      '--radius': radiusMap[theme.border_radius || 'medium'],
    };
  }

  // Apply theme to document
  public applyTheme(theme: ThemeConfig): void {
    this.currentTheme = theme;
    this.cssVariables = this.generateCSSVariables(theme);

    // Apply CSS variables to document root
    const root = document.documentElement;
    Object.entries(this.cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Apply font family if specified
    if (theme.font_family) {
      root.style.setProperty('--font-family', theme.font_family);
    }

    // Update favicon if provided
    if (theme.favicon_url) {
      this.updateFavicon(theme.favicon_url);
    }

    // Apply custom CSS if provided
    if (theme.custom_css) {
      this.injectCustomCSS(theme.custom_css);
    }

    // Store theme in localStorage for persistence
    localStorage.setItem('institute-theme', JSON.stringify(theme));
  }

  // Generate CSS string for server-side rendering or email templates
  public generateCSSString(theme: ThemeConfig): string {
    const variables = this.generateCSSVariables(theme);
    
    let cssString = ':root {\n';
    Object.entries(variables).forEach(([property, value]) => {
      cssString += `  ${property}: ${value};\n`;
    });
    
    if (theme.font_family) {
      cssString += `  --font-family: ${theme.font_family};\n`;
    }
    
    cssString += '}\n\n';

    // Add custom CSS if provided
    if (theme.custom_css) {
      cssString += theme.custom_css + '\n';
    }

    return cssString;
  }

  // Update favicon dynamically
  private updateFavicon(faviconUrl: string): void {
    const existingFavicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (existingFavicon) {
      existingFavicon.href = faviconUrl;
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = faviconUrl;
      document.head.appendChild(newFavicon);
    }
  }

  // Inject custom CSS
  private injectCustomCSS(customCSS: string): void {
    // Remove existing custom CSS
    const existingStyle = document.getElementById('institute-custom-css');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Add new custom CSS
    const styleElement = document.createElement('style');
    styleElement.id = 'institute-custom-css';
    styleElement.textContent = customCSS;
    document.head.appendChild(styleElement);
  }

  // Load theme from localStorage
  public loadStoredTheme(): ThemeConfig | null {
    if (typeof window === 'undefined') return null;
    
    const storedTheme = localStorage.getItem('institute-theme');
    if (storedTheme) {
      try {
        const theme = JSON.parse(storedTheme) as ThemeConfig;
        this.applyTheme(theme);
        return theme;
      } catch (error) {
        console.error('Failed to parse stored theme:', error);
        localStorage.removeItem('institute-theme');
      }
    }
    return null;
  }

  // Get current theme
  public getCurrentTheme(): ThemeConfig | null {
    return this.currentTheme;
  }

  // Generate preview CSS for onboarding
  public generatePreviewCSS(primaryColor: string, secondaryColor: string): string {
    const tempTheme: ThemeConfig = {
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      border_radius: 'medium',
    };

    return this.generateCSSString(tempTheme);
  }

  // Generate branded email template CSS
  public generateEmailCSS(theme: ThemeConfig): string {
    const primaryRgb = this.hexToRgb(theme.primary_color);
    const secondaryRgb = this.hexToRgb(theme.secondary_color);

    if (!primaryRgb || !secondaryRgb) {
      return '';
    }

    return `
      .email-header {
        background-color: ${theme.primary_color};
        color: ${this.getForegroundColor(theme.primary_color)};
        padding: 20px;
        text-align: center;
      }
      
      .email-header img {
        max-height: 60px;
        width: auto;
      }
      
      .email-button {
        background-color: ${theme.secondary_color};
        color: ${this.getForegroundColor(theme.secondary_color)};
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 4px;
        display: inline-block;
        font-weight: 500;
      }
      
      .email-accent {
        color: ${theme.secondary_color};
      }
      
      .email-footer {
        background-color: #f8f9fa;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #6c757d;
      }
    `;
  }

  // Reset to default theme
  public resetTheme(): void {
    this.currentTheme = null;
    this.cssVariables = null;

    // Remove CSS variables from document root
    const root = document.documentElement;
    const properties = [
      '--primary', '--primary-foreground', '--secondary', '--secondary-foreground',
      '--accent', '--accent-foreground', '--background', '--foreground',
      '--muted', '--muted-foreground', '--card', '--card-foreground',
      '--border', '--input', '--ring', '--radius', '--font-family'
    ];

    properties.forEach(property => {
      root.style.removeProperty(property);
    });

    // Remove custom CSS
    const customStyle = document.getElementById('institute-custom-css');
    if (customStyle) {
      customStyle.remove();
    }

    // Clear localStorage
    localStorage.removeItem('institute-theme');
  }

  // Validate theme configuration
  public validateTheme(theme: Partial<ThemeConfig>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (theme.primary_color && !this.hexToRgb(theme.primary_color)) {
      errors.push('Invalid primary color format');
    }

    if (theme.secondary_color && !this.hexToRgb(theme.secondary_color)) {
      errors.push('Invalid secondary color format');
    }

    if (theme.border_radius && !['none', 'small', 'medium', 'large'].includes(theme.border_radius)) {
      errors.push('Invalid border radius value');
    }

    if (theme.theme_mode && !['light', 'dark', 'auto'].includes(theme.theme_mode)) {
      errors.push('Invalid theme mode value');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Generate color palette from primary color
  public generateColorPalette(primaryColor: string): {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    complementary: string;
    triadic1: string;
    triadic2: string;
  } {
    const rgb = this.hexToRgb(primaryColor);
    if (!rgb) {
      throw new Error('Invalid color format');
    }

    return {
      primary: primaryColor,
      primaryLight: this.adjustColor(primaryColor, 40),
      primaryDark: this.adjustColor(primaryColor, -40),
      complementary: this.adjustColor(primaryColor, 128), // Simplified complementary
      triadic1: this.adjustColor(primaryColor, 85),
      triadic2: this.adjustColor(primaryColor, -85),
    };
  }
}

// Export singleton instance
export const themeEngine = ThemeEngine.getInstance();

// React hook for using theme engine
export function useTheme() {
  const engine = ThemeEngine.getInstance();
  
  const applyTheme = (theme: ThemeConfig) => {
    engine.applyTheme(theme);
  };

  const getCurrentTheme = () => {
    return engine.getCurrentTheme();
  };

  const resetTheme = () => {
    engine.resetTheme();
  };

  const generatePreviewCSS = (primaryColor: string, secondaryColor: string) => {
    return engine.generatePreviewCSS(primaryColor, secondaryColor);
  };

  return {
    applyTheme,
    getCurrentTheme,
    resetTheme,
    generatePreviewCSS,
    validateTheme: engine.validateTheme.bind(engine),
    generateColorPalette: engine.generateColorPalette.bind(engine),
  };
}