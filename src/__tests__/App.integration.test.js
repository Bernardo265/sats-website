import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
});

describe('App Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('complete navigation flow works', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Should start on home page
    expect(screen.getByText(/The SafeSats Way to/)).toBeInTheDocument();
    
    // Navigate to About page
    await user.click(screen.getByText('About'));
    await waitFor(() => {
      expect(screen.getByText(/About SafeSats/)).toBeInTheDocument();
    });
    
    // Navigate to Blog page
    await user.click(screen.getByText('Blog'));
    await waitFor(() => {
      expect(screen.getByText(/SafeSats Blog/)).toBeInTheDocument();
    });
    
    // Navigate to Contact page
    await user.click(screen.getByText('Contact'));
    await waitFor(() => {
      expect(screen.getByText(/Get in Touch/)).toBeInTheDocument();
    });
    
    // Navigate to Help page
    await user.click(screen.getByText('Help'));
    await waitFor(() => {
      expect(screen.getByText(/Help Center/)).toBeInTheDocument();
    });
    
    // Navigate back to Home
    await user.click(screen.getByText('Home'));
    await waitFor(() => {
      expect(screen.getByText(/The SafeSats Way to/)).toBeInTheDocument();
    });
  });

  test('blog post navigation works', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Navigate to blog
    await user.click(screen.getByText('Blog'));
    await waitFor(() => {
      expect(screen.getByText(/SafeSats Blog/)).toBeInTheDocument();
    });
    
    // Click on a blog post
    const readMoreLinks = screen.getAllByText(/read more/i);
    if (readMoreLinks.length > 0) {
      await user.click(readMoreLinks[0]);
      
      // Should navigate to individual blog post
      await waitFor(() => {
        expect(screen.getByText(/Back to Blog/)).toBeInTheDocument();
      });
      
      // Navigate back to blog
      await user.click(screen.getByText(/Back to Blog/));
      await waitFor(() => {
        expect(screen.getByText(/SafeSats Blog/)).toBeInTheDocument();
      });
    }
  });

  test('newsletter signup flow works', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Find newsletter signup form (should be on home page)
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const subscribeButton = screen.getByText(/subscribe now/i);
    
    // Fill out and submit newsletter form
    await user.type(emailInput, 'test@example.com');
    await user.click(subscribeButton);
    
    // Should show loading state
    expect(screen.getByText(/subscribing/i)).toBeInTheDocument();
    
    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/thank you for subscribing/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Email input should be cleared
    expect(emailInput).toHaveValue('');
  });

  test('contact form submission flow works', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Navigate to contact page
    await user.click(screen.getByText('Contact'));
    await waitFor(() => {
      expect(screen.getByText(/Get in Touch/)).toBeInTheDocument();
    });
    
    // Fill out contact form
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.selectOptions(screen.getByLabelText(/subject/i), 'general');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // Should show loading state
    expect(screen.getByText('Sending...')).toBeInTheDocument();
    
    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/thank you! your message has been sent successfully/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('mobile menu works', async () => {
    const user = userEvent.setup();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    render(<App />);
    
    // Mobile menu should not be visible initially
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    
    // Click mobile menu button
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    await user.click(mobileMenuButton);
    
    // Mobile menu should be visible
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    
    // Click on a navigation item in mobile menu
    const mobileAboutLink = screen.getAllByText('About').find(link => 
      link.closest('[data-testid="mobile-menu"]')
    );
    
    if (mobileAboutLink) {
      await user.click(mobileAboutLink);
      
      // Should navigate to About page and close mobile menu
      await waitFor(() => {
        expect(screen.getByText(/About SafeSats/)).toBeInTheDocument();
        expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      });
    }
  });

  test('footer links work', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Test footer navigation links
    const footerAboutLink = screen.getAllByText('About Us').find(link => 
      link.closest('footer')
    );
    
    if (footerAboutLink) {
      await user.click(footerAboutLink);
      await waitFor(() => {
        expect(screen.getByText(/About SafeSats/)).toBeInTheDocument();
      });
    }
    
    // Test privacy policy link
    await user.click(screen.getByText('Privacy Policy'));
    await waitFor(() => {
      expect(screen.getByText(/Privacy Policy/)).toBeInTheDocument();
    });
    
    // Test terms of service link
    await user.click(screen.getByText('Terms of Service'));
    await waitFor(() => {
      expect(screen.getByText(/Terms of Service/)).toBeInTheDocument();
    });
  });

  test('CTA buttons work', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Test "Get Started Today" button
    const getStartedButton = screen.getByText('Get Started Today');
    await user.click(getStartedButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Get in Touch/)).toBeInTheDocument();
    });
    
    // Navigate back to home
    await user.click(screen.getByText('Home'));
    await waitFor(() => {
      expect(screen.getByText(/The SafeSats Way to/)).toBeInTheDocument();
    });
    
    // Test "Learn More" button
    const learnMoreButton = screen.getByText('Learn More');
    await user.click(learnMoreButton);
    
    await waitFor(() => {
      expect(screen.getByText(/About SafeSats/)).toBeInTheDocument();
    });
  });
});
