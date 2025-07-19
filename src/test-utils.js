import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { CMSProvider } from '../contexts/CMSContext';

// Mock router components
const MockRouter = ({ children }) => <div data-testid="mock-router">{children}</div>;

// Custom render function that includes all necessary providers
export const renderWithProviders = (ui, options = {}) => {
  const { ...renderOptions } = options;

  const AllTheProviders = ({ children }) => {
    return (
      <HelmetProvider>
        <MockRouter>
          <CMSProvider>
            {children}
          </CMSProvider>
        </MockRouter>
      </HelmetProvider>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

// Re-export everything from testing-library/react
export * from '@testing-library/react';

// Override render method
export { renderWithProviders as render };
