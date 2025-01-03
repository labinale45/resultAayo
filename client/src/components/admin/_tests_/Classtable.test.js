import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Classtable from '../Classtable';
import Createclass from '@/components/admin/Createclass';

jest.mock('@/components/admin/Createclass', () => {
  return jest.fn(() => <div>Mocked Createclass Component</div>);
});

describe('Classtable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('should render the Classtable component correctly', async () => {
    // Mock fetch responses
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ['2025', '2026'],
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { grade: '10', sections: 'A' },
        { grade: '11', sections: 'B' },
      ],
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { name: 'Math', id: 1, teacher: 'John Doe' },
        { name: 'English', id: 2, teacher: 'Jane Smith' },
      ],
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: 'Mr. A' },
        { id: 2, name: 'Mr. B' },
      ],
    });

    render(<Classtable />);

    // Test for Year, Class, Section dropdowns
    expect(screen.getByText('Select Year')).toBeInTheDocument();
    expect(screen.getByText('Select Class')).toBeInTheDocument();
    expect(screen.getByText('Select Section')).toBeInTheDocument();

    // Mock user selection
    fireEvent.change(screen.getByRole('combobox', { name: 'Select Year' }), { target: { value: '2025' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Select Class' }), { target: { value: '10' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Select Section' }), { target: { value: 'A' } });

    // Wait for subjects and teachers to be fetched
    await waitFor(() => expect(screen.getByText('Math')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Mr. A')).toBeInTheDocument());

    // Check if Createclass button works
    fireEvent.click(screen.getByText('+Create Class'));
    await waitFor(() => expect(screen.getByText('Mocked Createclass Component')).toBeInTheDocument());
  });

  it('should handle error if fetching years fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch years'));

    render(<Classtable />);

    await waitFor(() => expect(screen.getByText('Failed to fetch years. Please try again later.')).toBeInTheDocument());
  });

  it('should handle teacher selection correctly', async () => {
    render(<Classtable />);

    fireEvent.change(screen.getByRole('combobox', { name: 'Select Year' }), { target: { value: '2025' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Select Class' }), { target: { value: '10' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Select Section' }), { target: { value: 'A' } });

    await waitFor(() => expect(screen.getByText('Math')).toBeInTheDocument());

    const teacherSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(teacherSelect, { target: { value: '2' } });

    expect(teacherSelect.value).toBe('2');
  });

  it('should show table when Year, Class, and Section are selected', async () => {
    render(<Classtable />);

    fireEvent.change(screen.getByRole('combobox', { name: 'Select Year' }), { target: { value: '2025' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Select Class' }), { target: { value: '10' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Select Section' }), { target: { value: 'A' } });

    await waitFor(() => expect(screen.getByText('Math')).toBeInTheDocument());
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should show Create Class modal when clicking +Create Class button', async () => {
    render(<Classtable />);

    fireEvent.click(screen.getByText('+Create Class'));
    await waitFor(() => expect(screen.getByText('Mocked Createclass Component')).toBeInTheDocument());
  });

  it('should save teacher assignments correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => true,
    });

    render(<Classtable />);

    fireEvent.change(screen.getByRole('combobox', { name: 'Select Year' }), { target: { value: '2025' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Select Class' }), { target: { value: '10' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Select Section' }), { target: { value: 'A' } });

    await waitFor(() => expect(screen.getByText('Math')).toBeInTheDocument());

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/api/auth/assign-teacher', expect.any(Object)));
    expect(screen.getByText('Teacher assignments saved successfully')).toBeInTheDocument();
  });
});
