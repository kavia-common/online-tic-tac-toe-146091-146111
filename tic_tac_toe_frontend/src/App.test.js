import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders status and allows a move', () => {
  render(<App />);
  const status = screen.getByText(/Current Turn:/i);
  expect(status).toBeInTheDocument();

  const buttons = screen.getAllByRole('button', { name: /Square/ });
  fireEvent.click(buttons[0]); // place X
  expect(screen.getByText(/Current Turn: O/i)).toBeInTheDocument();
});
