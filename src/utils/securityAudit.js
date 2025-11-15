/**
 * Security Audit Utility
 * Comprehensive security checks and monitoring for the SafeSats application
 */

import { supabase } from '../lib/supabase';
import { rateLimiter } from './securityValidation';

/**
 * Security Audit Class
 */
class SecurityAudit {
  constructor() {
    this.auditLog = [];
    this.securityEvents = [];
    this.isMonitoring = false;
  }

  /**
   * Run comprehensive security audit
   */
  async runSecurityAudit() {
    console.log('🔒 Running security audit...');
    const startTime = Date.now();
    const results = {
      timestamp: new Date().toISOString(),
      overall: 'secure',
      checks: {},
      vulnerabilities: [],
      recommendations: []
    };

    try {
      // 1. Authentication Security
      results.checks.authentication = await this.checkAuthenticationSecurity();
      
      // 2. Database Security (RLS)
      results.checks.database = await this.checkDatabaseSecurity();
      
      // 3. Input Validation
      results.checks.inputValidation = await this.checkInputValidation();
      
      // 4. Rate Limiting
      results.checks.rateLimiting = this.checkRateLimiting();
      
      // 5. Environment Security
      results.checks.environment = this.checkEnvironmentSecurity();
      
      // 6. Client-side Security
      results.checks.clientSide = this.checkClientSideSecurity();
      
      // Determine overall security status
      const failedChecks = Object.values(results.checks).filter(check => !check.secure);
      if (failedChecks.length > 0) {
        results.overall = failedChecks.length > 2 ? 'critical' : 'warning';
        results.vulnerabilities = failedChecks.map(check => check.issues).flat();
      }

      // Generate recommendations
      results.recommendations = this.generateRecommendations(results.checks);

      const duration = Date.now() - startTime;
      console.log(`✅ Security audit completed in ${duration}ms - Status: ${results.overall}`);
      
      // Log audit result
      this.logSecurityEvent('audit_completed', {
        status: results.overall,
        duration,
        vulnerabilities: results.vulnerabilities.length
      });
      
      return results;
    } catch (error) {
      console.error('❌ Security audit failed:', error);
      results.overall = 'error';
      results.vulnerabilities.push(`Audit failed: ${error.message}`);
      return results;
    }
  }

  /**
   * Check authentication security
   */
  async checkAuthenticationSecurity() {
    const issues = [];
    const recommendations = [];

    try {
      // Check if user is authenticated
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        issues.push('Authentication system error');
      }

      // Check session security
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Check token expiry
        const expiresAt = new Date(session.expires_at * 1000);
        const now = new Date();
        const timeToExpiry = expiresAt - now;
        
        if (timeToExpiry < 5 * 60 * 1000) { // Less than 5 minutes
          recommendations.push('Session expires soon - consider refreshing');
        }
        
        // Check if refresh token exists
        if (!session.refresh_token) {
          issues.push('Missing refresh token');
        }
      }

      return {
        secure: issues.length === 0,
        issues,
        recommendations,
        details: 'Authentication security check'
      };
    } catch (error) {
      return {
        secure: false,
        issues: [`Authentication check failed: ${error.message}`],
        recommendations: ['Review authentication configuration'],
        details: 'Authentication security check failed'
      };
    }
  }

  /**
   * Check database security (RLS policies)
   */
  async checkDatabaseSecurity() {
    const issues = [];
    const recommendations = [];

    try {
      // Test RLS by trying to access data without proper authentication
      // This is a basic check - in production, you'd want more comprehensive tests
      
      // Check if we can query without authentication (should fail)
      const { error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

      // If we can access data without auth, RLS might not be properly configured
      if (!profileError) {
        // Check if user is actually authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          issues.push('Possible RLS policy misconfiguration - data accessible without authentication');
        }
      }

      return {
        secure: issues.length === 0,
        issues,
        recommendations,
        details: 'Database security (RLS) check'
      };
    } catch (error) {
      return {
        secure: false,
        issues: [`Database security check failed: ${error.message}`],
        recommendations: ['Review RLS policies and database configuration'],
        details: 'Database security check failed'
      };
    }
  }

  /**
   * Check input validation
   */
  async checkInputValidation() {
    const issues = [];
    const recommendations = [];

    // Check if validation functions are available
    try {
      const { validateUserProfile } = await import('./securityValidation');
      
      // Test validation with malicious input
      const maliciousInput = {
        id: 'test-id',
        full_name: '<script>alert("xss")</script>',
        phone: 'javascript:alert("xss")',
        preferred_currency: 'INVALID'
      };

      const validation = validateUserProfile(maliciousInput);
      
      if (validation.isValid) {
        issues.push('Input validation may not be properly configured');
      }

      if (validation.sanitizedData.full_name.includes('<script>')) {
        issues.push('XSS protection not working properly');
      }

      return {
        secure: issues.length === 0,
        issues,
        recommendations,
        details: 'Input validation security check'
      };
    } catch (error) {
      return {
        secure: false,
        issues: [`Input validation check failed: ${error.message}`],
        recommendations: ['Ensure input validation is properly implemented'],
        details: 'Input validation check failed'
      };
    }
  }

  /**
   * Check rate limiting
   */
  checkRateLimiting() {
    const issues = [];
    const recommendations = [];

    try {
      // Test rate limiting
      const testId = 'security-audit-test';
      
      // Make multiple requests to test rate limiting
      let allowedRequests = 0;
      for (let i = 0; i < 10; i++) {
        if (rateLimiter.isAllowed(testId, 'default')) {
          allowedRequests++;
        }
      }

      if (allowedRequests >= 10) {
        issues.push('Rate limiting may not be working properly');
      }

      return {
        secure: issues.length === 0,
        issues,
        recommendations,
        details: 'Rate limiting security check'
      };
    } catch (error) {
      return {
        secure: false,
        issues: [`Rate limiting check failed: ${error.message}`],
        recommendations: ['Review rate limiting implementation'],
        details: 'Rate limiting check failed'
      };
    }
  }

  /**
   * Check environment security
   */
  checkEnvironmentSecurity() {
    const issues = [];
    const recommendations = [];

    // Check environment variables
    const requiredEnvVars = [
      'REACT_APP_SUPABASE_URL',
      'REACT_APP_SUPABASE_ANON_KEY'
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar] || process.env[envVar].includes('your-')) {
        issues.push(`Environment variable ${envVar} not properly configured`);
      }
    }

    // Check for development settings in production
    if (process.env.NODE_ENV === 'production') {
      if (process.env.REACT_APP_DEBUG_MODE === 'true') {
        issues.push('Debug mode enabled in production');
      }
    }

    // Check HTTPS usage
    if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
      issues.push('Application not served over HTTPS in production');
    }

    return {
      secure: issues.length === 0,
      issues,
      recommendations,
      details: 'Environment security check'
    };
  }

  /**
   * Check client-side security
   */
  checkClientSideSecurity() {
    const issues = [];
    const recommendations = [];

    if (typeof window !== 'undefined') {
      // Check for exposed sensitive data
      if (window.localStorage.getItem('supabase.auth.token')) {
        // This is normal for Supabase, but we should ensure it's properly managed
        recommendations.push('Ensure auth tokens are properly managed');
      }

      // Check for console warnings about security
      const originalWarn = console.warn;
      let securityWarnings = 0;
      console.warn = (...args) => {
        if (args.some(arg => typeof arg === 'string' && arg.toLowerCase().includes('security'))) {
          securityWarnings++;
        }
        originalWarn.apply(console, args);
      };

      // Restore original console.warn after a short delay
      setTimeout(() => {
        console.warn = originalWarn;
      }, 1000);
    }

    return {
      secure: issues.length === 0,
      issues,
      recommendations,
      details: 'Client-side security check'
    };
  }

  /**
   * Generate security recommendations
   */
  generateRecommendations(checks) {
    const recommendations = [];

    // Collect all recommendations from checks
    Object.values(checks).forEach(check => {
      if (check.recommendations) {
        recommendations.push(...check.recommendations);
      }
    });

    // Add general recommendations
    recommendations.push(
      'Regularly update dependencies to patch security vulnerabilities',
      'Implement proper logging and monitoring for security events',
      'Conduct regular security audits and penetration testing',
      'Ensure all user inputs are validated and sanitized',
      'Use HTTPS for all communications',
      'Implement proper session management',
      'Regular backup and disaster recovery testing'
    );

    return [...new Set(recommendations)]; // Remove duplicates
  }

  /**
   * Log security event
   */
  logSecurityEvent(eventType, details) {
    const event = {
      timestamp: new Date().toISOString(),
      type: eventType,
      details,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    this.securityEvents.push(event);
    
    // Keep only last 100 events
    if (this.securityEvents.length > 100) {
      this.securityEvents = this.securityEvents.slice(-100);
    }

    console.log(`🔒 Security event logged: ${eventType}`, details);
  }

  /**
   * Get security events
   */
  getSecurityEvents() {
    return this.securityEvents;
  }

  /**
   * Clear security events
   */
  clearSecurityEvents() {
    this.securityEvents = [];
  }
}

// Create singleton instance
const securityAudit = new SecurityAudit();

export default securityAudit;

// Export class for testing
export { SecurityAudit };

// Auto-expose in development mode
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_DEBUG_MODE === 'true') {
  window.securityAudit = securityAudit;
  console.log('Security audit exposed to window for debugging');
}
