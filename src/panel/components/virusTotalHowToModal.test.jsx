import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import VirusTotalHowToModal from './VirusTotalHowToModal'; // adjust path as needed

// Mock the vscode API
const mockPostMessage = jest.fn();
const mockVscode = { postMessage: mockPostMessage };

describe('VirusTotalHowToModal', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockPostMessage.mockReset();
  });

  test('renders nothing when modalOpen is false', () => {
    const { container } = render(
      <VirusTotalHowToModal
        modalOpen={false}
        setModalOpen={jest.fn()}
        vscode={mockVscode}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders modal when modalOpen is true', () => {
    render(
      <VirusTotalHowToModal
        modalOpen={true}
        setModalOpen={jest.fn()}
        vscode={mockVscode}
      />
    );
    expect(
      screen.getByText(/You need an API key to use VirusTotal/i)
    ).toBeInTheDocument();
  });

  test('navigates through steps when Continue button is clicked', async () => {
    render(
      <VirusTotalHowToModal
        modalOpen={true}
        setModalOpen={jest.fn()}
        vscode={mockVscode}
      />
    );

    // First step should be visible
    expect(
      screen.getByText(/You need an API key to use VirusTotal/i)
    ).toBeInTheDocument();

    // Click continue
    fireEvent.click(screen.getByText('Continue'));

    // Second step should be visible
    expect(
      screen.getByText(/Once you've verified your account/i)
    ).toBeInTheDocument();

    // Click continue again
    fireEvent.click(screen.getByText('Continue'));

    // Third step should be visible
    expect(
      screen.getByText(/Submit your VirusTotal API Key/i)
    ).toBeInTheDocument();
  });

  test('navigates back when Back button is clicked', () => {
    render(
      <VirusTotalHowToModal
        modalOpen={true}
        setModalOpen={jest.fn()}
        vscode={mockVscode}
      />
    );

    // Navigate to second step
    fireEvent.click(screen.getByText('Continue'));
    expect(
      screen.getByText(/Once you've verified your account/i)
    ).toBeInTheDocument();

    // Click back
    fireEvent.click(screen.getByText('Back'));

    // First step should be visible again
    expect(
      screen.getByText(/You need an API key to use VirusTotal/i)
    ).toBeInTheDocument();
  });

  test('submits API key and closes modal when Submit button is clicked', () => {
    const setModalOpen = jest.fn();

    render(
      <VirusTotalHowToModal
        modalOpen={true}
        setModalOpen={setModalOpen}
        vscode={mockVscode}
      />
    );

    // Navigate to the third step
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByText('Continue'));

    // Enter API key
    const apiKeyInput = screen.getByPlaceholderText('Paste your API key');
    fireEvent.change(apiKeyInput, { target: { value: 'test-api-key-123' } });

    // Click submit
    fireEvent.click(screen.getByText('Submit'));

    // Check if vscode.postMessage was called with the right parameters
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'storeApiKey',
      value: 'test-api-key-123',
    });

    // Check if modal was closed
    expect(setModalOpen).toHaveBeenCalledWith(false);
  });

  test('submits API key when Enter key is pressed in input field', () => {
    const setModalOpen = jest.fn();

    render(
      <VirusTotalHowToModal
        modalOpen={true}
        setModalOpen={setModalOpen}
        vscode={mockVscode}
      />
    );

    // Navigate to the third step
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByText('Continue'));

    // Enter API key
    const apiKeyInput = screen.getByPlaceholderText('Paste your API key');
    fireEvent.change(apiKeyInput, { target: { value: 'test-api-key-123' } });

    // Press Enter key
    fireEvent.keyDown(apiKeyInput, { key: 'Enter', code: 'Enter' });

    // Check if vscode.postMessage was called
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'storeApiKey',
      value: 'test-api-key-123',
    });

    // Check if modal was closed
    expect(setModalOpen).toHaveBeenCalledWith(false);
  });

  test('contains the expected link to VirusTotal', () => {
    render(
      <VirusTotalHowToModal
        modalOpen={true}
        setModalOpen={jest.fn()}
        vscode={mockVscode}
      />
    );

    const link = screen.getByText('HERE');
    expect(link).toHaveAttribute(
      'href',
      'https://www.virustotal.com/gui/sign-in'
    );
  });

  test('contains step indicator with three steps', () => {
    render(
      <VirusTotalHowToModal
        modalOpen={true}
        setModalOpen={jest.fn()}
        vscode={mockVscode}
      />
    );

    // Should find all three step labels
    expect(screen.getByText('Select campaign settings')).toBeInTheDocument();
    expect(screen.getByText('Get API Key')).toBeInTheDocument();
    expect(screen.getByText('Store API Key')).toBeInTheDocument();
  });
});
