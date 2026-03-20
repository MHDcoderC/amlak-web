import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

vi.mock('./modal/ModalMapSection', () => ({
  default: () => <div data-testid="mock-map-section">map</div>
}));

describe('Modal image upload flow', () => {
  it('adds selected image to gallery preview', async () => {
    const user = userEvent.setup();
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-preview');

    const { container } = render(<Modal setIsModalOpen={vi.fn()} onAdCreated={vi.fn()} />);
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeTruthy();

    const file = new File(['fake-image-content'], 'house.jpg', { type: 'image/jpeg' });
    await user.upload(input, file);

    await waitFor(() => {
      const preview = screen.getByAltText('preview-0');
      expect(preview).toBeInTheDocument();
      expect(preview).toHaveAttribute('src', 'blob:test-preview');
    });

    createObjectURLSpy.mockRestore();
  });
});
