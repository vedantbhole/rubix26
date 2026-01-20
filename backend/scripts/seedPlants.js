
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Plant from '../src/models/Plant.js';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        // Read JSON file
        const jsonPath = path.join(__dirname, '../../src/data/data.json');
        console.log('Reading data from:', jsonPath);

        const fileData = fs.readFileSync(jsonPath, 'utf-8');
        const plants = JSON.parse(fileData);

        for (const p of plants) {
            // Map JSON to new Schema fields
            // We use upsert based on common_name to avoid duplicates
            await Plant.findOneAndUpdate(
                { common_name: p.common_name },
                {
                    name: p.common_name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''), // Generate unique slug-like name if missing
                    jsonId: p.id,
                    common_name: p.common_name,
                    botanical_name: p.botanical_name,
                    ayush_system: p.ayush_system,
                    disease_category: p.disease_category,
                    part_used: p.part_used,
                    region: p.region,
                    medicinal_properties: p.medicinal_properties,
                    therapeutic_uses: p.therapeutic_uses,
                    precautions: p.precautions,
                    image_url: p.image_url,
                    new_url: p.new_url,

                    // Populate required legacy fields with defaults or mapped data
                    scientificName: p.botanical_name,
                    commonNames: [p.common_name],
                    description: `${p.common_name} (${p.botanical_name}) is a medicinal plant used in ${p.ayush_system}.`,
                    medicinalUses: [], // Populate if we parse therapeutic_uses into objects? For now keep array in therapeutic_uses
                    cultivationInfo: { // Default dummy or leave empty
                        soil: 'Well-drained',
                        water: 'Moderate',
                        sunlight: 'Full Sun',
                        propagation: 'Seeds/Cuttings',
                        tips: ['Consult local expert']
                    }
                },
                { upsert: true, new: true, runValidators: false } // Disable validators for strict name checks if needed
            );
        }

        console.log(`Imported ${plants.length} plants successfully!`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

importData();
