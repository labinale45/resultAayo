import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Addteacher from '../Addteacher';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />
}));

describe('Addteacher Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const defaultProps = {
    onClose: mockOnClose,
    onSave: mockOnSave
  };

  beforeEach(() => {
    global.fetch = jest.fn();
    global.URL.createObjectURL = jest.fn();
  });

  

  test('handles image upload correctly', async () => {
    render(<Addteacher {...defaultProps} />);

    const file = new File(['test image'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/Upload Photo/i);

    await userEvent.upload(fileInput, file);

    expect(fileInput.files[0]).toEqual(file);
  });

  

  test('closes modal when close button is clicked', () => {
    render(<Addteacher {...defaultProps} />);

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
  
  test('handles image upload and preview', async () => {
    render(<Addteacher onClose={mockOnClose} onSave={mockOnSave} />);

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const uploadInput = screen.getByLabelText(/Upload Photo/i);

    await userEvent.upload(uploadInput, file);

    expect(uploadInput.files[0]).toEqual(file);
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
  });
  
  
});
