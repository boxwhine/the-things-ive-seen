import React from 'react';
import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import RootLayout from './layout';

// @TODO: shouldn't have to mock this
vi.mock('next/font/google', async () => ({
  Inter: vi.fn().mockImplementation(() => ({
    className: 'fooooo',
  })),
}));

// @TODO dummy test to prevent '0 tests' failure
test('Root Layout', () => {
  render(<RootLayout>Foo</RootLayout>);
  expect(screen.getByText('Foo')).toBeDefined();
});
