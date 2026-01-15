// Configuration Management for SafeSats
class Config {
  constructor() {
    this.environment = process.env.REACT_APP_ENVIRONMENT || 'development';
    this.isDevelopment = this.environment === 'development';
    this.isProduction = this.environment === 'production';
  }

  // Airtel Money Configuration
  get airtelMoney() {
    return {
      baseUrl: process.env.REACT_APP_AIRTEL_API_BASE_URL || 'https://openapiuat.airtel.africa',
      clientId: process.env.REACT_APP_AIRTEL_CLIENT_ID || 'demo_client_id',
      clientSecret: process.env.REACT_APP_AIRTEL_CLIENT_SECRET || 'demo_client_secret',
      enabled: process.env.REACT_APP_ENABLE_AIRTEL_MONEY === 'true'
    };
  }

  // Paychangu Configuration
  get paychangu() {
    return {
      baseUrl: process.env.REACT_APP_PAYCHANGU_BASE_URL || 'https://api.paychangu.com',
      publicKey: process.env.REACT_APP_PAYCHANGU_PUBLIC_KEY || 'demo_public_key',
      secretKey: process.env.REACT_APP_PAYCHANGU_SECRET_KEY || 'demo_secret_key',
      enabled: process.env.REACT_APP_ENABLE_PAYCHANGU === 'true'
    };
  }

  // SafeSats API Configuration
  get api() {
    return {
      baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
      key: process.env.REACT_APP_API_KEY || 'dev_api_key',
      timeout: 30000 // 30 seconds
    };
  }

  // Bitcoin Configuration
  get bitcoin() {
    return {
      network: process.env.REACT_APP_BITCOIN_NETWORK || 'testnet',
      apiUrl: process.env.REACT_APP_BITCOIN_API_URL || 'https://api.coingecko.com/api/v3',
      confirmationBlocks: this.isDevelopment ? 1 : 3,
      priceUpdateInterval: 60000 // 1 minute
    };
  }

  // Payment Configuration
  get payment() {
    return {
      minAmount: parseInt(process.env.REACT_APP_MIN_PURCHASE_AMOUNT) || 5000,
      maxAmount: parseInt(process.env.REACT_APP_MAX_PURCHASE_AMOUNT) || 2000000,
      defaultCurrency: process.env.REACT_APP_DEFAULT_CURRENCY || 'USD',
      supportedCurrencies: ['MWK', 'USD'],
      fees: {
        airtelMoney: 0.02, // 2%
        mukuru: 0.015, // 1.5%
        mastercard: 0.035 // 3.5%
      }
    };
  }

  // Feature Flags
  get features() {
    return {
      airtelMoney: process.env.REACT_APP_ENABLE_AIRTEL_MONEY === 'true',
      mukuru: process.env.REACT_APP_ENABLE_MUKURU === 'true',
      mastercard: process.env.REACT_APP_ENABLE_MASTERCARD === 'true',
      paychangu: process.env.REACT_APP_ENABLE_PAYCHANGU === 'true',
      analytics: !this.isDevelopment,
      errorReporting: !this.isDevelopment
    };
  }

  // Security Configuration
  get security() {
    return {
      sessionTimeout: parseInt(process.env.REACT_APP_SESSION_TIMEOUT) || 3600000, // 1 hour
      maxLoginAttempts: parseInt(process.env.REACT_APP_MAX_LOGIN_ATTEMPTS) || 5,
      tokenRefreshThreshold: 300000, // 5 minutes
      encryptionEnabled: this.isProduction
    };
  }

  // UI Configuration
  get ui() {
    return {
      theme: process.env.REACT_APP_THEME || 'dark',
      language: process.env.REACT_APP_LANGUAGE || 'en',
      timezone: process.env.REACT_APP_TIMEZONE || 'Africa/Blantyre',
      toastDuration: 5000,
      loadingTimeout: 30000,
      pollingInterval: 5000
    };
  }

  // Application Information
  get app() {
    return {
      name: process.env.REACT_APP_APP_NAME || 'SafeSats',
      version: process.env.REACT_APP_APP_VERSION || '1.0.0',
      environment: this.environment,
      buildDate: process.env.REACT_APP_BUILD_DATE || new Date().toISOString(),
      supportEmail: 'support@safesats.mw',
      websiteUrl: 'https://safesats.mw'
    };
  }

  // Analytics Configuration
  get analytics() {
    return {
      googleAnalyticsId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
      sentryDsn: process.env.REACT_APP_SENTRY_DSN,
      enabled: this.features.analytics
    };
  }

  // Validation Methods
  validateAirtelConfig() {
    const config = this.airtelMoney;
    const errors = [];

    if (!config.clientId || config.clientId === 'demo_client_id') {
      errors.push('Airtel Money Client ID is not configured');
    }

    if (!config.clientSecret || config.clientSecret === 'demo_client_secret') {
      errors.push('Airtel Money Client Secret is not configured');
    }

    if (!config.baseUrl) {
      errors.push('Airtel Money API Base URL is not configured');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateApiConfig() {
    const config = this.api;
    const errors = [];

    if (!config.baseUrl) {
      errors.push('API Base URL is not configured');
    }

    if (!config.key || config.key === 'dev_api_key') {
      errors.push('API Key is not configured');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get all configuration for debugging
  getAll() {
    return {
      environment: this.environment,
      airtelMoney: this.airtelMoney,
      paychangu: this.paychangu,
      api: this.api,
      bitcoin: this.bitcoin,
      payment: this.payment,
      features: this.features,
      security: this.security,
      ui: this.ui,
      app: this.app,
      analytics: this.analytics
    };
  }

  // Log configuration (without sensitive data)
  logConfig() {
    if (this.isDevelopment) {
      const safeConfig = {
        ...this.getAll(),
        airtelMoney: {
          ...this.airtelMoney,
          clientSecret: '***HIDDEN***'
        },
        paychangu: {
          ...this.paychangu,
          secretKey: '***HIDDEN***'
        },
        api: {
          ...this.api,
          key: '***HIDDEN***'
        }
      };
      
      console.log('SafeSats Configuration:', safeConfig);
    }
  }

  // Check if all required configurations are set
  isConfigured() {
    const airtelValidation = this.validateAirtelConfig();
    const apiValidation = this.validateApiConfig();

    return {
      isValid: airtelValidation.isValid && apiValidation.isValid,
      errors: [...airtelValidation.errors, ...apiValidation.errors]
    };
  }
}

// Export singleton instance
const config = new Config();

// Log configuration in development
if (config.isDevelopment) {
  config.logConfig();
}

export default config;
