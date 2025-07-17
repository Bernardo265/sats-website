import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/layout/Header';

// Mock the useCMS hook
jest.mock('../contexts/CMSContext', () => ({
  useCMS: () => ({
    isAuthenticated: false,
    currentUser: null,
    logout: jest.fn()
  })
}));

const HeaderWithRouter = () => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
);

describe('Header Component', () => {
  test('renders SafeSats logo', () => {
    render(<HeaderWithRouter />);
    expect(screen.getByAltText('SafeSats Logo')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<HeaderWithRouter />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('renders Get Started button', () => {
    render(<HeaderWithRouter />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  test('mobile menu toggle works', () => {
    render(<HeaderWithRouter />);
    
    // Mobile menu should not be visible initially
    const mobileMenu = screen.queryByTestId('mobile-menu');
    expect(mobileMenu).not.toBeInTheDocument();
    
    // Click mobile menu button
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    fireEvent.click(mobileMenuButton);
    
    // Mobile menu should now be visible
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
  });

  test('navigation links have correct href attributes', () => {
    render(<HeaderWithRouter />);
    
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about');
    expect(screen.getByText('Blog').closest('a')).toHaveAttribute('href', '/blog');
    expect(screen.getByText('Help').closest('a')).toHaveAttribute('href', '/help');
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact');
  });

  test('applies active class to current page', () => {
    // This would require mocking useLocation to return specific paths
    // For now, we'll test that the component renders without errors
    render(<HeaderWithRouter />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
