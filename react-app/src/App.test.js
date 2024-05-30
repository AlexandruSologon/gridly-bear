/**
 * @jest-environment jsdom
 */
//
import { TextEncoder, TextDecoder } from 'util'
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from './App';
  jest.mock('react-leaflet', () => jest.fn());
  jest.mock('firebase-functions', () => jest.fn());

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
