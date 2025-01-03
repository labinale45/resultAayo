import { render, screen, fireEvent } from '@testing-library/react';
import Addstudent from '../Addstudent';

describe('Addstudent Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    render(<Addstudent onClose={mockOnClose} onSave={mockOnSave} />);
  });

  it('renders the student form title', () => {
    const title = screen.getByText('__A d d _S t u d e n t');
    expect(title).toBeInTheDocument();
  });

  it('renders required form fields', () => {
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText("Parent's Name")).toBeInTheDocument();
  });

  
 
  

  it('handles close button click', () => {
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
  it('displays upload photo text', () => {
    const uploadText = screen.getByText('Upload Photo');
    expect(uploadText).toBeInTheDocument();
  });
  it('renders class selection with default option', () => {
    const defaultOption = screen.getByText('Select Class');
    expect(defaultOption).toBeInTheDocument();
  });
  it('renders the close button', () => {
    const closeButton = screen.getByRole('button', { name: '×' });
    expect(closeButton).toBeInTheDocument();
  });
  it('renders all required form labels', () => {
    const requiredLabels = [
      'First Name',
      'Last Name',
      'Email',
      'Contact',
      'Address',
      'Date of Birth',
      "Parent's Name",
      'Class',
      'Gender'
    ];
    
    requiredLabels.forEach(label => {
      const labelElement = screen.getByText(label);
      expect(labelElement).toBeInTheDocument();
    });
  });
  
  it('renders the add student icon', () => {
    const icon = document.querySelector('.h-7.w-12.mr-2');
    expect(icon).toBeInTheDocument();
    expect(icon.tagName.toLowerCase()).toBe('svg');
  });
    
});
