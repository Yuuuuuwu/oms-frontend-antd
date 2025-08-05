import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import CartPage from './index';

// Mock API
vi.mock('../../api/products', () => ({
  getProducts: vi.fn(() => Promise.resolve({
    data: [
      { id: 1, name: 'Product 1', price: 100, stock: 10, image_url: '' },
      { id: 2, name: 'Product 2', price: 200, stock: 5, image_url: '' },
    ]
  }))
}));

// Mock auth utils
vi.mock('../../utils/auth', () => ({
  getCurrentUser: vi.fn(() => ({ id: 1, role: 'customer' }))
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('CartPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders empty cart correctly', async () => {
    localStorageMock.getItem.mockReturnValue('[]');

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('您的購物車是空的')).toBeInTheDocument();
      expect(screen.getByText('前往購物')).toBeInTheDocument();
    });
  });

  test('renders cart with items correctly', async () => {
    const mockCart = [
      { id: 1, qty: 2 },
      { id: 2, qty: 1 },
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCart));

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText(/前往結帳/)).toBeInTheDocument();
    });
  });

  test('handles remove item from cart', async () => {
    const mockCart = [
      { id: 1, qty: 2 },
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCart));

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    const removeButton = screen.getByText('移除');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.getByText('您的購物車是空的')).toBeInTheDocument();
    });
  });

  test('handles checkout for authenticated users', async () => {
    const mockCart = [
      { id: 1, qty: 2 },
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCart));

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/前往結帳/)).toBeInTheDocument();
    });

    const checkoutButton = screen.getByText(/前往結帳/);
    fireEvent.click(checkoutButton);

    // 驗證 localStorage 被調用來保存結帳商品
    expect(localStorageMock.setItem).toHaveBeenCalledWith('checkout-items', expect.any(String));
  });

  test('shows empty cart when no items', async () => {
    localStorageMock.getItem.mockReturnValue('[]');

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('您的購物車是空的')).toBeInTheDocument();
      expect(screen.getByText('前往購物')).toBeInTheDocument();
    });
  });
});
