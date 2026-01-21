import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5001/api/ayush';
const EXTERNAL_BASE_URL = 'https://www.medicinalplants.in';

// Available AYUSH systems
export const AYUSH_SYSTEMS = [
    { id: 'ayurveda', name: 'Ayurveda' },
    { id: 'siddha', name: 'Siddha' },
    { id: 'unani', name: 'Unani' },
    { id: 'homeopathy', name: 'Homeopathy' },
    { id: 'folk', name: 'Folk' },
    { id: 'sowa-rigpa', name: 'Sowa-Rigpa' },
];

/**
 * Parse HTML response from the medicinalplants.in API
 * Extracts plant results from the HTML string
 */
function parseSearchResults(html, baseUrl = EXTERNAL_BASE_URL) {
    const results = [];

    // Create a temporary DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Find all result list items
    const resultItems = doc.querySelectorAll('li.result');

    resultItems.forEach((item) => {
        const anchor = item.querySelector('a');
        if (anchor) {
            const href = anchor.getAttribute('href');
            const botanicalName = anchor.textContent.trim();

            // Extract vernacular names if present (from div inside li)
            const vernacularDiv = item.querySelector('div');
            const vernacularNames = vernacularDiv ? vernacularDiv.textContent.trim() : '';

            // Build the full URL for the external site
            const fullUrl = href.startsWith('http') ? href : `${baseUrl}/${href}`;

            results.push({
                botanicalName,
                vernacularNames,
                url: fullUrl,
            });
        }
    });

    // Extract total count from message div
    const messageDiv = doc.querySelector('.message');
    let totalCount = 0;
    if (messageDiv) {
        const match = messageDiv.textContent.match(/Total\s+(\d+)/i);
        if (match) {
            totalCount = parseInt(match[1], 10);
        }
    }

    return { results, totalCount };
}

/**
 * Hook for searching plants across AYUSH systems via backend proxy
 */
export function useAyushSearch() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    /**
     * Search for plants using vernacular names
     * @param {string} system - The AYUSH system to search (ayurveda, siddha, etc.)
     * @param {string} query - The search query
     * @param {Object} languages - Object with language codes to search
     */
    const searchVernacular = useCallback(async (system, query, languages = {}) => {
        if (!query || query.trim().length === 0) {
            setResults([]);
            setTotalCount(0);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/search/vernacular`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ system, query, languages }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to search vernacular names');
            }

            const { results: parsedResults, totalCount: count } = parseSearchResults(
                data.html,
                data.baseUrl
            );

            setResults(parsedResults);
            setTotalCount(count);
        } catch (err) {
            console.error('Vernacular search error:', err);
            setError(err.message || 'Failed to search vernacular names');
            setResults([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Search for plants using botanical names
     * @param {string} system - The AYUSH system to search (ayurveda, siddha, etc.)
     * @param {string} query - The search query
     * @param {number} pageNo - Page number for pagination (default 0)
     */
    const searchBotanical = useCallback(async (system, query, pageNo = 0) => {
        if (!query || query.trim().length === 0) {
            setResults([]);
            setTotalCount(0);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/search/botanical`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ system, query, pageNo }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to search botanical names');
            }

            const { results: parsedResults, totalCount: count } = parseSearchResults(
                data.html,
                data.baseUrl
            );

            setResults(parsedResults);
            setTotalCount(count);
        } catch (err) {
            console.error('Botanical search error:', err);
            setError(err.message || 'Failed to search botanical names');
            setResults([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Clear all search results
     */
    const clearResults = useCallback(() => {
        setResults([]);
        setTotalCount(0);
        setError(null);
    }, []);

    return {
        loading,
        error,
        results,
        totalCount,
        searchVernacular,
        searchBotanical,
        clearResults,
    };
}

export default useAyushSearch;
