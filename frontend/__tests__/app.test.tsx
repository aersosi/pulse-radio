import React from 'react';
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from "@/app/page";
import {getStations, totalCount} from '@/lib/api';
import {Station} from "@/lib/definitions";

// Mock the API functions
jest.mock('@/lib/api', () => ({
    getStations: jest.fn(),
    totalCount: jest.fn()
}));

// Mock the StationList component
jest.mock('@/components/station/station-list', () => {
    return function MockStationList({stations, isLoading}) {
        return <div data-testid="station-list">{isLoading ? 'Loading' : `Stations: ${stations.length}`}</div>;
    };
});

describe('Home Page Component', () => {
    const mockStations = [
        {id: "1", name: 'Station 1', logo: 'no-image-available.webp', genre: 'Rock'},
        {id: "2", name: 'Station 2', logo: 'no-image-available.webp', genre: 'Pop'},
        {id: "3", name: 'Station 3', logo: 'no-image-available.webp', genre: 'Jazz'},
        {id: "4", name: 'Station 4', logo: 'no-image-available.webp', genre: 'Classical'},
        {id: "5", name: 'Station 5', logo: 'no-image-available.webp', genre: 'Electronic'}
    ];

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Setup default mock implementations
        (getStations as jest.Mock).mockResolvedValue(mockStations);
        (totalCount as jest.Mock).mockResolvedValue(25);
    });

    test('renders initial page with loading state', async () => {
        let resolvegetStations: (stations: Station[]) => void;
        let resolveTotalCount: (count: number) => void;

        (getStations as jest.Mock).mockImplementation(() => new Promise((resolve) => {
            resolvegetStations = resolve;
        }));
        (totalCount as jest.Mock).mockImplementation(() => new Promise((resolve) => {
            resolveTotalCount = resolve;
        }));

        render(<Home/>);

        // Check if the loading state is displayed
        expect(await screen.findByText(/loading radio stations/i)).toBeInTheDocument();

        // Delete Promises
        await act(async () => {
            resolvegetStations(mockStations);
            resolveTotalCount(25);
        });

        // Check if load state was deleted
        await waitFor(() => {
            expect(screen.queryByText(/loading radio stations/i)).not.toBeInTheDocument();
        });
    });

    test('renders stations after loading', async () => {
        await act(async () => {
            render(<Home/>);
        });

        // Wait for stations to load
        await waitFor(() => {
            expect(screen.getByText('Top Radio Stations')).toBeInTheDocument();
            expect(screen.getByText('Station: 1 - 5')).toBeInTheDocument();
            expect(screen.getByText('Total: 25')).toBeInTheDocument();
        });
    });

    test('pagination navigation works correctly', async () => {
        await act(async () => {
            render(<Home/>);
        });

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('Top Radio Stations')).toBeInTheDocument();
        });

        // Click next page
        await act(async () => {
            const nextButton = screen.getByText('Next');
            fireEvent.click(nextButton);
        });

        // Verify offset and page change
        await waitFor(() => {
            expect(getStations).toHaveBeenCalledWith(5, 5);
            expect(screen.getByText('Station: 6 - 10')).toBeInTheDocument();
        });
    });

    test('previous page navigation works correctly', async () => {
        await act(async () => {
            render(<Home/>);
        });

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('Top Radio Stations')).toBeInTheDocument();
        });

        // Set initial state to page 2
        await act(async () => {
            const nextButton = screen.getByText('Next');
            fireEvent.click(nextButton);
        });

        // Then click previous
        await act(async () => {
            const prevButton = screen.getByText('Previous');
            fireEvent.click(prevButton);
        });

        // Verify offset and page change
        await waitFor(() => {
            expect(getStations).toHaveBeenCalledWith(5, 0);
            expect(screen.getByText('Station: 1 - 5')).toBeInTheDocument();
        });
    });

    test('direct page navigation works', async () => {
        await act(async () => {
            render(<Home/>);
        });

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('Top Radio Stations')).toBeInTheDocument();
        });

        // Click on page 3
        await act(async () => {
            const page3 = screen.getByText('3');
            fireEvent.click(page3);
        });

        // Verify offset and page change
        await waitFor(() => {
            expect(getStations).toHaveBeenCalledWith(5, 10);
            expect(screen.getByText('Station: 11 - 15')).toBeInTheDocument();
        });
    });

    test('handles API errors gracefully', async () => {
        (getStations as jest.Mock).mockRejectedValue(new Error('Failed to fetch stations'));
        (totalCount as jest.Mock).mockRejectedValue(new Error('Failed to fetch total count'));

        render(<Home/>);

        // Check if error is displayed
        await waitFor(() => {
            expect(screen.getByText('Failed to load stations')).toBeInTheDocument();
        });
    });
});