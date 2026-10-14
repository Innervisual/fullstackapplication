import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';
const response = data => ({ ok: true, status: 200, json: async () => data });
beforeEach(() => { global.fetch = jest.fn(); });
afterEach(() => { delete global.fetch; });
test('loads, adds, completes and deletes tasks through the API', async () => {
  fetch.mockResolvedValueOnce(response([{ id: '1', text: 'Original task', completed: false }]));
  render(<App />);
  await screen.findByText('Original task');
  fetch.mockResolvedValueOnce(response({ id: '2', text: 'New task', completed: false }));
  fireEvent.change(screen.getByLabelText('New task'), { target: { value: ' New task ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add task' }));
  await screen.findByRole('button', { name: 'Delete New task' });
  expect(fetch).toHaveBeenLastCalledWith('/todos', expect.objectContaining({ method: 'POST', body: JSON.stringify({ text: 'New task' }) }));
  const row = screen.getByRole('button', { name: 'Delete New task' }).closest('li');
  fetch.mockResolvedValueOnce(response({ id: '2', text: 'New task', completed: true }));
  fireEvent.click(within(row).getByRole('button', { name: 'Complete' }));
  await within(row).findByRole('button', { name: 'Undo' });
  fetch.mockResolvedValueOnce({ ok: true, status: 204 });
  fireEvent.click(within(row).getByRole('button', { name: 'Delete New task' }));
  await waitFor(() => expect(screen.queryByRole('button', { name: 'Delete New task' })).not.toBeInTheDocument());
});
test('shows connection errors without pretending to save', async () => {
  fetch.mockRejectedValueOnce(new Error('Backend unavailable'));
  render(<App />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Backend unavailable');
});
