import React from 'react';
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from "../src/app/page";
import {get5Stations, totalCount} from '@/lib/api';

// Mock the API functions
jest.mock('@/lib/api', () => ({
    get5Stations: jest.fn(),
    totalCount: jest.fn()
}));

// Mock the StationList component
jest.mock('@/components/StationList', () => {
    return function MockStationList({stations, isLoading}) {
        return <div data-testid="station-list">{isLoading ? 'Loading' : `Stations: ${stations.length}`}</div>;
    };
});

describe('Home Page Component', () => {
    const mockStations = [
        {id: 1, name: 'Station 1', genre: 'Rock'},
        {id: 2, name: 'Station 2', genre: 'Pop'},
        {id: 3, name: 'Station 3', genre: 'Jazz'},
        {id: 4, name: 'Station 4', genre: 'Classical'},
        {id: 5, name: 'Station 5', genre: 'Electronic'}
    ];

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Setup default mock implementations
        (get5Stations as jest.Mock).mockResolvedValue(mockStations);
        (totalCount as jest.Mock).mockResolvedValue(25);
    });

    test('renders initial page with stations and pagination', async () => {
        await act(async () => {
            render(<Home/>);
        });

        // Check loading state
        expect(screen.getByText('Loading')).toBeInTheDocument();

        // Wait for stations to load
        await waitFor(() => {
            expect(screen.getByText('Stations: 5')).toBeInTheDocument();
        });

        // Check header content
        expect(screen.getByText('Top 100 Radio Stations')).toBeInTheDocument();
        expect(screen.getByText('Station: 1 - 5')).toBeInTheDocument();
        expect(screen.getByText('Total: 25')).toBeInTheDocument();
    });

    test('pagination navigation works correctly', async () => {
        await act(async () => {
            render(<Home/>);
        });

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('Stations: 5')).toBeInTheDocument();
        });

        // Click next page
        await act(async () => {
            const nextButton = screen.getByText('Next');
            fireEvent.click(nextButton);
        });

        // Verify offset and page change
        expect(get5Stations).toHaveBeenCalledWith(5, 5);
        expect(screen.getByText('Station: 6 - 10')).toBeInTheDocument();
    });

    test('previous page navigation works correctly', async () => {
        await act(async () => {
            render(<Home/>);
        });

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('Stations: 5')).toBeInTheDocument();
        });

        // Set initial state to page 2
        await act(async () => {
            fireEvent.click(screen.getByText('Next'));
        });

        // Then click previous
        await act(async () => {
            const prevButton = screen.getByText('Previous');
            fireEvent.click(prevButton);
        });

        // Verify offset and page change
        expect(get5Stations).toHaveBeenCalledWith(5, 0);
        expect(screen.getByText('Station: 1 - 5')).toBeInTheDocument();
    });

    test('direct page navigation works', async () => {
        await act(async () => {
            render(<Home/>);
        });

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('Stations: 5')).toBeInTheDocument();
        });

        // Click on page 3
        await act(async () => {
            const page3 = screen.getByText('3');
            fireEvent.click(page3);
        });

        // Verify offset and page change
        expect(get5Stations).toHaveBeenCalledWith(5, 10);
        expect(screen.getByText('Station: 11 - 15')).toBeInTheDocument();
    });

    test('handles API errors gracefully', async () => {
        // Setup error mocks
        (get5Stations as jest.Mock).mockRejectedValue(new Error('Failed to fetch stations'));
        (totalCount as jest.Mock).mockRejectedValue(new Error('Failed to fetch total count'));

        // Use try-catch to handle potential unhandled promise rejections
        await act(async () => {
            render(<Home/>);
        });

        // Wait for loading state
        await waitFor(() => {
            expect(screen.getByText('Loading')).toBeInTheDocument();
        });

        // Note: You'll want to add error handling in the component to show an error state
        // This test ensures no unhandled promise rejection occurs
    });
});