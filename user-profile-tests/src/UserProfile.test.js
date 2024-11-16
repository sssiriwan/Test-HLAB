import { render, screen, waitFor, cleanup } from '@testing-library/react';
import UserProfile from './UserProfile';

global.fetch = jest.fn();

afterEach(() => {
  fetch.mockClear();
  cleanup();
});

test('fetches and displays user profile', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ name: 'John Doe', email: 'john.doe@example.com' }),
  });

  render(<UserProfile userId={1} />);

  await waitFor(() => {
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john.doe@example.com/i)).toBeInTheDocument();
  });

  expect(fetch).toHaveBeenCalledWith('https://api.example.com/users/1');
});


test('displays error message when fetch fails', async () => {
  fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

  render(<UserProfile userId={1} />);

  await waitFor(() => {
    expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
  });

  expect(fetch).toHaveBeenCalledWith('https://api.example.com/users/1');
});
