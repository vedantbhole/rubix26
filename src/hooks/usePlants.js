import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:5001/api';

export function usePlants() {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0,
        limit: 12
    });

    const fetchPlants = useCallback(async (options = {}) => {
        const {
            page = pagination.page,
            limit = pagination.limit,
            search = '',
            ayush_system = 'all'
        } = options;

        try {
            setLoading(true);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString()
            });

            if (search) params.append('search', search);
            if (ayush_system && ayush_system !== 'all') params.append('ayush_system', ayush_system);

            const response = await fetch(`${API_URL}/plants?${params}`);
            const data = await response.json();

            if (data.success) {
                setPlants(data.data);
                setPagination({
                    page: data.page,
                    totalPages: data.totalPages,
                    total: data.total,
                    limit
                });
            } else {
                setError(data.message || 'Failed to fetch plants');
            }
        } catch (err) {
            setError(err.message || 'Network error');
            console.error('Error fetching plants:', err);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit]);

    // Initial fetch
    useEffect(() => {
        fetchPlants({ page: 1 });
    }, []);

    const goToPage = useCallback((page) => {
        if (page >= 1 && page <= pagination.totalPages) {
            fetchPlants({ page });
        }
    }, [fetchPlants, pagination.totalPages]);

    const nextPage = useCallback(() => {
        if (pagination.page < pagination.totalPages) {
            goToPage(pagination.page + 1);
        }
    }, [pagination.page, pagination.totalPages, goToPage]);

    const prevPage = useCallback(() => {
        if (pagination.page > 1) {
            goToPage(pagination.page - 1);
        }
    }, [pagination.page, goToPage]);

    return {
        plants,
        loading,
        error,
        pagination,
        fetchPlants,
        goToPage,
        nextPage,
        prevPage
    };
}
