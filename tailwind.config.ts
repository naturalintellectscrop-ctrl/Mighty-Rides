import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Surface Colors from Design Spec
        surface: {
          DEFAULT: '#121414',
          dim: '#121414',
          bright: '#38393a',
          container: {
            DEFAULT: '#1e2020',
            lowest: '#0d0e0f',
            low: '#1a1c1c',
            high: '#292a2a',
            highest: '#343535',
          },
        },
        // Text Colors
        'on-surface': {
          DEFAULT: '#e3e2e2',
          variant: '#c4c7c7',
        },
        'inverse-surface': '#e3e2e2',
        'inverse-on-surface': '#2f3131',
        // Primary Colors
        primary: {
          DEFAULT: '#c9c6c5',
          container: '#0a0a0a',
        },
        'on-primary': '#313030',
        'on-primary-container': '#7b7979',
        'primary-fixed': '#e5e2e1',
        'primary-fixed-dim': '#c9c6c5',
        // Secondary/Gold Colors
        secondary: {
          DEFAULT: '#C8952A',
          dim: '#C8952A',
          container: '#b9881c',
          fixed: '#ffdea7',
          'fixed-dim': '#f6bd50',
        },
        'on-secondary': '#412d00',
        'on-secondary-container': '#392600',
        // Tertiary Colors
        tertiary: {
          DEFAULT: '#c8c6c5',
          container: '#0a0a0a',
        },
        'on-tertiary': '#313030',
        // Outline Colors
        outline: {
          DEFAULT: '#8e9192',
          variant: '#444748',
        },
        // Error Colors
        error: {
          DEFAULT: '#ffb4ab',
          container: '#93000a',
        },
        'on-error': '#690005',
        'on-error-container': '#ffdad6',
        // Background
        background: '#121414',
        'on-background': '#e3e2e2',
        // Surface Variant
        'surface-variant': '#343535',
        'surface-tint': '#c9c6c5',
        // Brand Aliases (for backwards compatibility)
        brand: {
          midnight: '#0A0A0A',
          charcoal: '#1A1A1A',
          slate: '#2A2A2A',
          gold: '#C8952A',
          'gold-hover': '#D4A644',
          'gold-dim': '#C8952A44',
          black: '#0A0A0A',
          white: '#FFFFFF',
          silver: '#B0B0B0',
          muted: '#666666',
          surface: '#141414',
          'surface-2': '#1E1E1E',
          'surface-3': '#282828',
          border: '#222222',
          'gold-light': '#D4A84A',
          'gold-dark': '#9A7020',
          'gold-bg': '#1a1200',
          'surface-light': '#F8F6F2',
        },
        // Status Colors
        status: {
          available: '#4CAF50',
          reserved: '#FFC107',
          rented: '#F44336',
          service: '#9E9E9E',
          sold: '#607D8B',
          pending: '#B0B0B0',
          confirmed: '#2196F3',
          active: '#4CAF50',
          returned: '#9E9E9E',
          cancelled: '#F44336',
          declined: '#cc4444',
        },
        // Functional Colors
        functional: {
          success: '#2D7A2D',
          warning: '#C87A2A',
          error: '#CC4444',
          info: '#2A6BC8',
        },
      },
      fontFamily: {
        // Display: Playfair Display
        display: ['var(--font-display)', 'Playfair Display', 'Georgia', 'serif'],
        // Label: Montserrat
        label: ['var(--font-label)', 'Montserrat', 'system-ui', 'sans-serif'],
        // Body: Inter
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        // Heading alias
        heading: ['var(--font-display)', 'Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        // Display Large - 72px/84px
        'display-lg': ['72px', { lineHeight: '84px', letterSpacing: '-0.02em', fontWeight: '700' }],
        // Display Large Mobile - 44px/52px
        'display-lg-mobile': ['44px', { lineHeight: '52px', fontWeight: '700' }],
        // Headline Medium - 32px/40px
        'headline-md': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        // Subheading - 18px/24px
        'subheading': ['18px', { lineHeight: '24px', letterSpacing: '0.05em', fontWeight: '600' }],
        // Body Large - 18px/28px
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        // Body Medium - 16px/24px
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        // Button - 14px/20px
        'button': ['14px', { lineHeight: '20px', letterSpacing: '0.1em', fontWeight: '700' }],
        // Label Small - 12px/16px
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        
        // Legacy sizes
        'display-1': ['clamp(48px, 7vw, 80px)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-2': ['clamp(40px, 5vw, 64px)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-3': ['clamp(32px, 4vw, 48px)', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h1': ['clamp(44px, 5vw, 72px)', { lineHeight: '1.167', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['clamp(32px, 4vw, 48px)', { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h3': ['clamp(24px, 3vw, 32px)', { lineHeight: '1.25', fontWeight: '700' }],
        'h4': ['clamp(20px, 2.5vw, 24px)', { lineHeight: '1.4', fontWeight: '600' }],
        'eyebrow': ['12px', { lineHeight: '1', letterSpacing: '0.2em', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.75', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.7', fontWeight: '400' }],
        'cta': ['13px', { lineHeight: '1.4', letterSpacing: '0.1em', fontWeight: '600' }],
        'price': ['18px', { lineHeight: '1.2', fontWeight: '700' }],
        'price-lg': ['32px', { lineHeight: '1.1', fontWeight: '700' }],
        'caption': ['12px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption-sm': ['11px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      maxWidth: {
        'container-max': '1440px',
        'content': '1280px',
        'narrow': '960px',
      },
      spacing: {
        // From Design Spec
        'section-gap-desktop': '128px',
        'section-gap-mobile': '64px',
        'gutter': '24px',
        'margin-desktop': '80px',
        'margin-mobile': '20px',
        'container-max': '1440px',
        // Additional
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        full: '9999px',
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'fade-in': 'fadeIn 250ms ease-out',
        'fade-in-up': 'fadeInUp 600ms ease-out',
        'fade-up': 'fadeUp 400ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200, 149, 42, 0.4)' },
          '50%': { boxShadow: '0 0 0 15px rgba(200, 149, 42, 0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(200, 149, 42, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(200, 149, 42, 0.5)' },
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom, rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.95))',
        'gradient-gold': 'linear-gradient(135deg, rgba(200, 149, 42, 0.1), transparent)',
        'hero-gradient': 'linear-gradient(180deg, rgba(10, 10, 10, 0.4) 0%, rgba(10, 10, 10, 0.9) 100%)',
        'video-overlay': 'linear-gradient(0deg, rgba(10, 10, 10, 1) 0%, rgba(10, 10, 10, 0.4) 50%, rgba(10, 10, 10, 0) 100%)',
      },
      boxShadow: {
        'gold': '0 0 30px rgba(200, 149, 42, 0.2)',
        'gold-lg': '0 0 50px rgba(200, 149, 42, 0.3)',
        'card-hover': '0 12px 40px rgba(200, 149, 42, 0.2)',
        'premium': '0 20px 50px rgba(0, 0, 0, 0.5)',
        'booking-widget': '0 20px 60px rgba(0, 0, 0, 0.3)',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
    },
  },
  plugins: [],
}

export default config
