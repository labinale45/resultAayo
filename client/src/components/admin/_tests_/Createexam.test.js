import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Createexam from '../Createexam';

global.fetch = jest.fn(); // Mock fetch globally

describe('Createexam Component', () => {
  let alertSpy; // Declare the spy variable

  beforeEach(() => {
    fetch.mockClear();
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {}); // Spy on window.alert
  });

  afterEach(() => {
    alertSpy.mockRestore(); // Restore the original alert function
    global.fetch.mockRestore();
  });


  it('renders the form elements', () => {
    render(<Createexam onClose={() => {}} />);
    expect(screen.getByPlaceholderText('Exam Type')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Deadline Date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Deadline Time')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Result Date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Result Time')).toBeInTheDocument();
    expect(screen.getByText('C R E A T E')).toBeInTheDocument();
  });

  it('validates form submission with correct inputs', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Exam created successfully!' }),
    });

    render(<Createexam onClose={() => {}} />);

    fireEvent.input(screen.getByPlaceholderText('Exam Type'), { target: { value: 'Mid-Term Exam' } });
    fireEvent.input(screen.getByPlaceholderText('Deadline Date'), { target: { value: '2025-01-15' } });
    fireEvent.input(screen.getByPlaceholderText('Deadline Time'), { target: { value: '10:00' } });
    fireEvent.input(screen.getByPlaceholderText('Result Date'), { target: { value: '2025-01-20' } });
    fireEvent.input(screen.getByPlaceholderText('Result Time'), { target: { value: '12:00' } });

    fireEvent.click(screen.getByText('C R E A T E'));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/auth/create-exam',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examType: 'Mid-Term Exam',
          ddate: '2025-01-15',
          dtime: '10:00',
          rdate: '2025-01-20',
          rtime: '12:00',
        }),
      })
    );

    expect(alertSpy).toHaveBeenCalledWith("Exam created successfully!"); // Use the spy

  });
  
  it('does not submit the form if required fields are missing', async () => {
    render(<Createexam onClose={() => {}} />);
  
    // Leave all fields empty and click submit
    fireEvent.click(screen.getByText('C R E A T E'));
  
    // Ensure fetch is not called
    await waitFor(() => expect(fetch).not.toHaveBeenCalled());
  
    // Verify that no alert is shown
    expect(alertSpy).not.toHaveBeenCalled();
  });
  it('displays an error if the API call fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Failed to create Exam' }),
    });
  
    render(<Createexam onClose={() => {}} />);
  
    fireEvent.input(screen.getByPlaceholderText('Exam Type'), { target: { value: 'Mid-Term Exam' } });
    fireEvent.input(screen.getByPlaceholderText('Deadline Date'), { target: { value: '2025-01-15' } });
    fireEvent.input(screen.getByPlaceholderText('Deadline Time'), { target: { value: '10:00' } });
    fireEvent.input(screen.getByPlaceholderText('Result Date'), { target: { value: '2025-01-20' } });
    fireEvent.input(screen.getByPlaceholderText('Result Time'), { target: { value: '12:00' } });
  
    fireEvent.click(screen.getByText('C R E A T E'));
  
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/auth/create-exam',
      expect.any(Object)
    );
  
    // No alert should be called
    expect(alertSpy).not.toHaveBeenCalled();
  });
  it('calls onClose when the close button is clicked', () => {
    const mockOnClose = jest.fn();
    render(<Createexam onClose={mockOnClose} />);
  
    // Click the close button
    fireEvent.click(screen.getByText('×'));
  
    // Ensure onClose is called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  it('handles network errors gracefully', async () => {
    // Mock fetch to reject with a network error
    const networkError = new Error('Network Error');
    fetch.mockRejectedValueOnce(networkError);
  
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    render(<Createexam onClose={() => {}} />);
  
    // Fill out the form
    fireEvent.input(screen.getByPlaceholderText('Exam Type'), { target: { value: 'Final Exam' } });
    fireEvent.input(screen.getByPlaceholderText('Deadline Date'), { target: { value: '2025-02-15' } });
    fireEvent.input(screen.getByPlaceholderText('Deadline Time'), { target: { value: '09:00' } });
    fireEvent.input(screen.getByPlaceholderText('Result Date'), { target: { value: '2025-02-20' } });
    fireEvent.input(screen.getByPlaceholderText('Result Time'), { target: { value: '11:00' } });
  
    // Submit the form
    fireEvent.click(screen.getByText('C R E A T E'));
  
    // Wait for the fetch to be called and handle the rejection
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  
    // Check that console.error was called with the network error
    expect(consoleErrorSpy).toHaveBeenCalledWith(networkError);
  
    // Clean up the spy
    consoleErrorSpy.mockRestore();
  });
  
  

});
