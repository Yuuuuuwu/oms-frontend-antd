import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import CartPage from './index';

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

describe('CartPage Component', () => {
  test('renders cart items correctly', () => {
    const mockCart = [
      { id: 1, name: 'Product 1', price: 100, quantity: 2 },
      { id: 2, name: 'Product 2', price: 200, quantity: 1 },
    ];

    localStorage.setItem('oms-cart', JSON.stringify(mockCart));

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();
  });

  test('updates item quantity correctly', () => {
    const mockCart = [
      { id: 1, name: 'Product 1', price: 100, quantity: 2 },
    ];

    localStorage.setItem('oms-cart', JSON.stringify(mockCart));

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    const quantityInput = screen.getByLabelText('Quantity');
    fireEvent.change(quantityInput, { target: { value: '3' } });

    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
  });

  test('removes item from cart correctly', () => {
    const mockCart = [
      { id: 1, name: 'Product 1', price: 100, quantity: 2 },
    ];

    localStorage.setItem('oms-cart', JSON.stringify(mockCart));

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);

    expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
  });

  test('handles checkout for authenticated users', () => {
    const mockCart = [
      { id: 1, name: 'Product 1', price: 100, quantity: 2 },
    ];

    localStorage.setItem('oms-cart', JSON.stringify(mockCart));
    localStorage.setItem('oms-auto-checkout', 'true');

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    const checkoutButton = screen.getByText('Checkout');
    fireEvent.click(checkoutButton);

    expect(screen.getByText('Order Created')).toBeInTheDocument();
  });

  test('redirects guest users to registration page on checkout', () => {
    const mockCart = [
      { id: 1, name: 'Product 1', price: 100, quantity: 2 },
    ];

    localStorage.setItem('oms-cart', JSON.stringify(mockCart));

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    const checkoutButton = screen.getByText('Checkout');
    fireEvent.click(checkoutButton);

    expect(screen.getByText('Register')).toBeInTheDocument();
  });
});
