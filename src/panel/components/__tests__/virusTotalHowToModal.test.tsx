import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import VirusTotalHowToModal from '../virusTotalHowToModal'; // adjust path as needed

// Mock the vscode API
const mockPostMessage = jest.fn();
const mockVscode = { postMessage: mockPostMessage };

describe('VirusTotalHowToModal', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockPostMessage.mockReset();
  });

  test('renders nothing when modalOpen is false', async () => {
    const { container } = render(
      <VirusTotalHowToModal
        modalOpen={false}
        setModalOpen={jest.fn()}
        vscode={mockVscode}
      />
    );
    
    expect(container.firstChild).toBeNull();
  
  });

  test('renders modal when modalOpen is true', async () => {
    render(
      <VirusTotalHowToModal
        modalOpen={true}
        setModalOpen={jest.fn()}
        vscode={mockVscode}
      />
    );
    
    await waitFor(() => {
      expect(
        screen.getByText(/You need an API key to use VirusTotal/i)
      ).toBeInTheDocument();
    });
    
   
    
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
    await expect(
      screen.getByText(/You need an API key to use VirusTotal/i)
    ).toBeInTheDocument();

    // Click continue
    await userEvent.click(screen.getByText('Continue'));

    // Second step should be visible
    await waitFor(() => {
      expect(
        screen.getByText(/Once you've verified your account/i)
      ).toBeInTheDocument();
    });
    

    // Click continue again
    await userEvent.click(screen.getByText('Continue'));

    // Third step should be visible
    await waitFor(() => {
      expect(
        screen.getByText(/Submit your VirusTotal API Key/i)
      ).toBeInTheDocument();
    });
    
  });

  test('navigates back when Back button is clicked', async () => {
    render(
      <VirusTotalHowToModal
        modalOpen={true}
        setModalOpen={jest.fn()}
        vscode={mockVscode}
      />
    );

    // Navigate to second step
    await userEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      expect(
        screen.getByText(/Once you've verified your account/i)
      ).toBeInTheDocument();
    });
    

    // Click back
    await userEvent.click(screen.getByText('Back'));

    // First step should be visible again
    await waitFor(() => {
      expect(
        screen.getByText(/You need an API key to use VirusTotal/i)
      ).toBeInTheDocument();
    });
    
  });

  test('submits API key and closes modal when Submit button is clicked', async () => {
    const setModalOpen = jest.fn();

    render(
      <VirusTotalHowToModal
        modalOpen={true}
        setModalOpen={setModalOpen}
        vscode={mockVscode}
      />
    );

    // Navigate to the third step
    await userEvent.click(screen.getByText('Continue'));
    await userEvent.click(screen.getByText('Continue'));

    // Enter API key
    const apiKeyInput = screen.getByPlaceholderText('Paste your API key');
    await userEvent.type(apiKeyInput, 'test-api-key-123');

    // Click submit
    await userEvent.click(screen.getByText('Submit'));

    // Check if vscode.postMessage was called with the right parameters
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'storeApiKey',
      value: 'test-api-key-123',
    });

    // Check if modal was closed
    expect(setModalOpen).toHaveBeenCalledWith(false);
  });

  test('submits API key when Enter key is pressed in input field', async () => {
    const setModalOpen = jest.fn();

    render(
      <VirusTotalHowToModal
        modalOpen={true}
        setModalOpen={setModalOpen}
        vscode={mockVscode}
      />
    );

    // Navigate to the third step
    await userEvent.click(screen.getByText('Continue'));
    await userEvent.click(screen.getByText('Continue'));

    // Enter API key
    const apiKeyInput = screen.getByPlaceholderText('Paste your API key');
    // await userEvent.type(apiKeyInput, 'test-api-key-123');

    // Press Enter key
    await userEvent.type(apiKeyInput, 'test-api-key-123{Enter}');

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
