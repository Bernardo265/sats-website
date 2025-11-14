// Integration Tests for Payment Flow
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import BuyBitcoin from '../../pages/BuyBitcoin';

describe('BuyBitcoin Page', () => {
  test('displays "Coming Soon" message', () => {
    render(
      <BrowserRouter>
        <BuyBitcoin />
      </BrowserRouter>
    );

    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(screen.getByText('We are working hard to bring you a seamless Bitcoin buying experience.')).toBeInTheDocument();
  });
});