import express from 'express';

const router = express.Router();

const BASE_URL = 'https://www.medicinalplants.in';

// System configuration - maps system names to their API path patterns
const SYSTEMS = {
    ayurveda: {
        name: 'Ayurveda',
        botanicalPath: 'ayurvedasearchpage/getayurvedabotanical',
        vernacularPath: 'ayurvedasearchpage/getayurvedavernacular',
    },
    siddha: {
        name: 'Siddha',
        botanicalPath: 'siddhasearchpage/getsiddhabotanical',
        vernacularPath: 'siddhasearchpage/getsiddhavernacular',
    },
    unani: {
        name: 'Unani',
        botanicalPath: 'unanisearchpage/getunanibotanical',
        vernacularPath: 'unanisearchpage/getunanivernacular',
    },
    homeopathy: {
        name: 'Homeopathy',
        botanicalPath: 'homeopathysearchpage/gethomeopathybotanical',
        vernacularPath: 'homeopathysearchpage/gethomeopathyvernacular',
    },
    folk: {
        name: 'Folk',
        botanicalPath: 'folksearchpage/getfolkbotanical',
        vernacularPath: 'folksearchpage/getfolkvernacular',
    },
    'sowa-rigpa': {
        name: 'Sowa-Rigpa',
        botanicalPath: 'tibetansearchpage/gettibetanbotanical',
        vernacularPath: 'tibetansearchpage/gettibetanvernacular',
    },
};

// Default languages for vernacular search
const DEFAULT_LANGUAGES = {
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

/**
 * GET /api/ayush/systems
 * Returns list of available AYUSH systems
 */
router.get('/systems', (req, res) => {
    const systems = Object.entries(SYSTEMS).map(([key, value]) => ({
        id: key,
        name: value.name,
    }));
    res.json({ success: true, systems });
});

/**
 * POST /api/ayush/search/botanical
 * Proxy for botanical name search across any AYUSH system
 * Body: { system: string, query: string, pageNo?: number }
 */
router.post('/search/botanical', async (req, res) => {
    try {
        const { system, query, pageNo = 0 } = req.body;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Query parameter is required'
            });
        }

        if (!system || !SYSTEMS[system]) {
            return res.status(400).json({
                success: false,
                error: `Invalid system. Valid systems are: ${Object.keys(SYSTEMS).join(', ')}`
            });
        }

        const systemConfig = SYSTEMS[system];

        // Using URLSearchParams for form data
        const params = new URLSearchParams();
        params.append('fname', query);

        const response = await fetch(
            `${BASE_URL}/${systemConfig.botanicalPath}/pageno/${pageNo}`,
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
            baseUrl: BASE_URL,
            system: systemConfig.name
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
 * POST /api/ayush/search/vernacular
 * Proxy for vernacular name search across any AYUSH system
 * Body: { system: string, query: string, languages?: object }
 */
router.post('/search/vernacular', async (req, res) => {
    try {
        const { system, query, languages = {} } = req.body;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Query parameter is required'
            });
        }

        if (!system || !SYSTEMS[system]) {
            return res.status(400).json({
                success: false,
                error: `Invalid system. Valid systems are: ${Object.keys(SYSTEMS).join(', ')}`
            });
        }

        const systemConfig = SYSTEMS[system];
        const languagesToUse = { ...DEFAULT_LANGUAGES, ...languages };

        // Using URLSearchParams for form data
        const params = new URLSearchParams();
        params.append('fname', query);

        Object.entries(languagesToUse).forEach(([key, value]) => {
            params.append(key, value);
        });

        const response = await fetch(
            `${BASE_URL}/${systemConfig.vernacularPath}`,
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
            baseUrl: BASE_URL,
            system: systemConfig.name
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
