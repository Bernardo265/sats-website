import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from '../pages/Contact';

describe('Contact Component', () => {
  test('renders contact form', () => {
    render(<Contact />);
    
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  test('renders contact information', () => {
    render(<Contact />);
    
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('support@safesats.com')).toBeInTheDocument();
    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('123 Blockchain Street')).toBeInTheDocument();
  });

  test('form validation works', async () => {
    const user = userEvent.setup();
    render(<Contact />);
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    // Try to submit empty form
    await user.click(submitButton);
    
    // Check that required fields are validated by the browser
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const subjectSelect = screen.getByLabelText(/subject/i);
    const messageTextarea = screen.getByLabelText(/message/i);
    
    expect(nameInput).toBeRequired();
    expect(emailInput).toBeRequired();
    expect(subjectSelect).toBeRequired();
    expect(messageTextarea).toBeRequired();
  });

  test('form submission works', async () => {
    const user = userEvent.setup();
    render(<Contact />);
    
    // Fill out the form
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.selectOptions(screen.getByLabelText(/subject/i), 'general');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);
    
    // Check for loading state
    expect(screen.getByText('Sending...')).toBeInTheDocument();
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/thank you! your message has been sent successfully/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check that form is cleared
    expect(screen.getByLabelText(/full name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email address/i)).toHaveValue('');
    expect(screen.getByLabelText(/message/i)).toHaveValue('');
  });

  test('form fields update correctly', async () => {
    const user = userEvent.setup();
    render(<Contact />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const messageTextarea = screen.getByLabelText(/message/i);
    
    await user.type(nameInput, 'Jane Smith');
    await user.type(emailInput, 'jane@example.com');
    await user.type(messageTextarea, 'Hello SafeSats team!');
    
    expect(nameInput).toHaveValue('Jane Smith');
    expect(emailInput).toHaveValue('jane@example.com');
    expect(messageTextarea).toHaveValue('Hello SafeSats team!');
  });

  test('subject dropdown has correct options', () => {
    render(<Contact />);
    
    const subjectSelect = screen.getByLabelText(/subject/i);
    const options = screen.getAllByRole('option');
    
    expect(options).toHaveLength(6); // Including the default "Select a subject" option
    expect(screen.getByRole('option', { name: 'General Inquiry' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Technical Support' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Account Issues' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Partnership' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Feedback' })).toBeInTheDocument();
  });
});
