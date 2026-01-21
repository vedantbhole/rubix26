import express from 'express';

const router = express.Router();

const BASE_URL = 'https://www.medicinalplants.in';

/**
 * POST /api/ayurveda/search/botanical
 * Proxy for botanical name search
 * Body: { query: string, pageNo?: number }
 */
router.post('/search/botanical', async (req, res) => {
    try {
        const { query, pageNo = 0 } = req.body;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Query parameter is required'
            });
        }

        // Using URLSearchParams for form data
        const params = new URLSearchParams();
        params.append('fname', query);

        const response = await fetch(
            `${BASE_URL}/ayurvedasearchpage/getayurvedabotanical/pageno/${pageNo}`,
            {
                method: 'POST',
                body: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );

        if (!response.ok) {
            throw new Error(`External API error: ${response.status}`);
        }

        const html = await response.text();

        res.json({
            success: true,
            html,
            baseUrl: BASE_URL
        });
    } catch (error) {
        console.error('Botanical search error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to search botanical names'
        });
    }
});

/**
 * POST /api/ayurveda/search/vernacular
 * Proxy for vernacular name search
 * Body: { query: string, languages?: object }
 */
router.post('/search/vernacular', async (req, res) => {
    try {
        const { query, languages = {} } = req.body;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Query parameter is required'
            });
        }

        // Default languages - all languages selected
        const defaultLanguages = {
            san: 'SK',  // Sanskrit
            hin: 'HI',  // Hindi
            eng: 'EN',  // English
            mar: 'MR',  // Marathi
            kan: 'KA',  // Kannada
            urd: 'UR',  // Urdu
            mal: 'MA',  // Malayalam
            tam: 'TA',  // Tamil
            tel: 'TE',  // Telugu
            tib: 'TI',  // Tibetan
        };

        const languagesToUse = { ...defaultLanguages, ...languages };

        // Using URLSearchParams for form data
        const params = new URLSearchParams();
        params.append('fname', query);

        Object.entries(languagesToUse).forEach(([key, value]) => {
            params.append(key, value);
        });

        const response = await fetch(
            `${BASE_URL}/ayurvedasearchpage/getayurvedavernacular`,
            {
                method: 'POST',
                body: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );

        if (!response.ok) {
            throw new Error(`External API error: ${response.status}`);
        }

        const html = await response.text();

        res.json({
            success: true,
            html,
            baseUrl: BASE_URL
        });
    } catch (error) {
        console.error('Vernacular search error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to search vernacular names'
        });
    }
});

export default router;
