
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5001/api';

export function usePlants() {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/plants`);
                const data = await response.json();

                if (data.success) {
                    setPlants(data.data);
                } else {
                    setError(data.message || 'Failed to fetch plants');
                }
            } catch (err) {
                setError(err.message || 'Network error');
                console.error('Error fetching plants:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlants();
    }, []);

    return { plants, loading, error };
}
