// Comprehensive medicinal plant data for AYUSH systems
export const plants = [
  {
    id: 1,
    name: "Tulsi",
    botanicalName: "Ocimum sanctum",
    commonNames: ["Holy Basil", "Sacred Basil", "Queen of Herbs"],
    image: "/images/plants/tulsi.png",
    ayushSystem: ["Ayurveda", "Siddha"],
    category: "Adaptogen",
    region: "Indian Subcontinent",
    partUsed: ["Leaves", "Seeds", "Roots"],
    medicinalProperties: ["Anti-inflammatory", "Antioxidant", "Antimicrobial", "Adaptogenic"],
    therapeuticUses: [
      "Respiratory disorders",
      "Stress relief",
      "Immune support",
      "Digestive health",
      "Skin conditions"
    ],
    precautions: [
      "May interact with blood-thinning medications",
      "Consult doctor during pregnancy",
      "May lower blood sugar levels"
    ],
    description: "Tulsi, often called the 'Queen of Herbs,' is revered in Ayurveda for its remarkable healing properties. This sacred plant has been used for thousands of years to promote overall health and longevity.",
    healthThemes: ["immunity", "stress", "digestion"],
    doshaEffect: "Balances Kapha and Vata"
  },
  {
    id: 2,
    name: "Ashwagandha",
    botanicalName: "Withania somnifera",
    commonNames: ["Indian Ginseng", "Winter Cherry"],
    image: "/images/plants/ashwagandha.png",
    ayushSystem: ["Ayurveda"],
    category: "Adaptogen",
    region: "India, Middle East, Africa",
    partUsed: ["Roots", "Leaves"],
    medicinalProperties: ["Adaptogenic", "Anti-stress", "Immunomodulatory", "Rejuvenating"],
    therapeuticUses: [
      "Stress and anxiety",
      "Energy and vitality",
      "Cognitive function",
      "Sleep support",
      "Athletic performance"
    ],
    precautions: [
      "Avoid during pregnancy",
      "May interact with thyroid medications",
      "Start with low doses"
    ],
    description: "Ashwagandha is one of the most important herbs in Ayurveda. Known as a powerful adaptogen, it helps the body manage stress and promotes mental clarity and physical strength.",
    healthThemes: ["stress", "energy", "sleep"],
    doshaEffect: "Balances Vata and Kapha"
  },
  {
    id: 3,
    name: "Neem",
    botanicalName: "Azadirachta indica",
    commonNames: ["Indian Lilac", "Margosa"],
    image: "/images/plants/neem.png",
    ayushSystem: ["Ayurveda", "Unani", "Siddha"],
    category: "Antimicrobial",
    region: "Indian Subcontinent",
    partUsed: ["Leaves", "Bark", "Seeds", "Oil"],
    medicinalProperties: ["Antibacterial", "Antifungal", "Antiviral", "Blood purifier"],
    therapeuticUses: [
      "Skin disorders",
      "Dental health",
      "Blood purification",
      "Diabetes management",
      "Wound healing"
    ],
    precautions: [
      "Not recommended during pregnancy",
      "May cause allergic reactions in some",
      "Avoid excessive internal use"
    ],
    description: "Neem is called the 'Village Pharmacy' in India due to its numerous medicinal applications. Every part of this remarkable tree has therapeutic value.",
    healthThemes: ["skin", "immunity", "detox"],
    doshaEffect: "Balances Pitta and Kapha"
  },
  {
    id: 4,
    name: "Basil",
    botanicalName: "Ocimum basilicum",
    commonNames: ["Sweet Basil", "Italian Basil"],
    image: "/images/plants/basil.png",
    ayushSystem: ["Ayurveda"],
    category: "Digestive Herb",
    region: "Tropical Asia",
    partUsed: ["Leaves", "Seeds"],
    medicinalProperties: [
      "Antioxidant",
      "Anti-inflammatory",
      "Carminative",
      "Antibacterial"
    ],
    therapeuticUses: [
      "Digestive discomfort",
      "Loss of appetite",
      "Mild cough and cold",
      "Stress reduction",
      "Inflammation relief"
    ],
    precautions: [
      "Excess consumption may affect blood clotting",
      "Use cautiously during pregnancy",
      "Essential oil should not be ingested directly"
    ],
    description: "Basil is a fragrant culinary and medicinal herb used traditionally to support digestion and respiratory health. It is milder than Tulsi but still offers notable therapeutic benefits.",
    healthThemes: ["digestion", "respiratory", "inflammation"],
    doshaEffect: "Balances Kapha; mild effect on Vata and Pitta"
  },
  {
    id: 5,
    name: "Lavender",
    botanicalName: "Lavandula angustifolia",
    commonNames: ["True Lavender", "English Lavender"],
    image: "/images/plants/lavender.png",
    ayushSystem: ["Aromatherapy", "Ayurveda (modern use)"],
    category: "Nervine",
    region: "Mediterranean region",
    partUsed: ["Flowers", "Essential Oil"],
    medicinalProperties: [
      "Calming",
      "Antiseptic",
      "Anti-anxiety",
      "Sleep-inducing",
      "Anti-inflammatory"
    ],
    therapeuticUses: [
      "Anxiety and stress",
      "Insomnia",
      "Headaches",
      "Minor burns and cuts",
      "Skin irritation"
    ],
    precautions: [
      "Essential oil must be diluted before skin use",
      "Avoid ingestion without professional guidance",
      "May cause drowsiness"
    ],
    description: "Lavender is widely valued for its calming aroma and therapeutic effects on the nervous system. It is commonly used in aromatherapy, skincare, and stress management practices.",
    healthThemes: ["stress", "sleep", "mental health"],
    doshaEffect: "Balances Vata and Pitta"
  },
  {
    id: 6,
    name: "Aloe Vera",
    botanicalName: "Aloe vera (L.) Burm.f.",
    commonNames: ["Ghritkumari", "True Aloe", "Burn Plant"],
    image: "/images/plants/aloevera.png",
    ayushSystem: ["Ayurveda", "Unani", "Siddha"],
    category: "Rejuvenative",
    region: "Arabian Peninsula, now cultivated worldwide",
    partUsed: ["Leaf Gel", "Latex"],
    medicinalProperties: [
      "Anti-inflammatory",
      "Wound healing",
      "Antibacterial",
      "Moisturizing",
      "Digestive support"
    ],
    therapeuticUses: [
      "Burns and wound healing",
      "Skin hydration",
      "Constipation (latex use, limited)",
      "Gastric ulcers",
      "Hair and scalp care"
    ],
    precautions: [
      "Oral latex use may cause cramps and diarrhea",
      "Avoid during pregnancy",
      "Prolonged oral use may affect electrolytes"
    ],
    description: "Aloe Vera is a well-known medicinal succulent valued for its soothing gel. It is extensively used in traditional medicine and modern skincare for its healing and cooling properties.",
    healthThemes: ["skin", "digestion", "healing"],
    doshaEffect: "Balances Pitta; may aggravate Vata if overused"
  }, {
    id: 7,
    name: "Turmeric",
    botanicalName: "Curcuma longa",
    commonNames: ["Haldi", "Golden Spice"],
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800",
    ayushSystem: ["Ayurveda", "Siddha", "Unani"],
    category: "Anti-inflammatory",
    region: "South Asia",
    partUsed: ["Rhizome"],
    medicinalProperties: ["Anti-inflammatory", "Antioxidant", "Antimicrobial", "Hepatoprotective"],
    therapeuticUses: [
      "Joint health",
      "Skin care",
      "Digestive support",
      "Immune boosting",
      "Wound healing"
    ],
    precautions: [
      "May interact with blood thinners",
      "High doses may cause digestive issues",
      "Consult doctor if on medications"
    ],
    description: "Turmeric, the golden spice, has been used in traditional medicine for over 4,000 years. Its active compound curcumin is renowned for its powerful anti-inflammatory effects.",
    healthThemes: ["immunity", "digestion", "skin"],
    doshaEffect: "Balances all three Doshas"
  },
  {
    id: 8,
    name: "Brahmi",
    botanicalName: "Bacopa monnieri",
    commonNames: ["Water Hyssop", "Herb of Grace"],
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800",
    ayushSystem: ["Ayurveda"],
    category: "Nootropic",
    region: "Wetlands of India",
    partUsed: ["Whole plant"],
    medicinalProperties: ["Cognitive enhancer", "Anxiolytic", "Antioxidant", "Neuroprotective"],
    therapeuticUses: [
      "Memory enhancement",
      "Focus and concentration",
      "Anxiety relief",
      "Cognitive disorders",
      "Mental clarity"
    ],
    precautions: [
      "May cause digestive upset initially",
      "Consult doctor if on sedatives",
      "Start with low doses"
    ],
    description: "Brahmi is the premier brain tonic in Ayurveda. Named after Lord Brahma, the creator, this herb has been used for centuries to enhance memory, learning, and concentration.",
    healthThemes: ["mental", "stress", "focus"],
    doshaEffect: "Balances Vata, Pitta, and Kapha"
  },
  {
    id: 9,
    name: "Amla",
    botanicalName: "Phyllanthus emblica",
    commonNames: ["Indian Gooseberry", "Amalaki"],
    image: "https://images.unsplash.com/photo-1590005354167-6da97870c757?w=800",
    ayushSystem: ["Ayurveda", "Unani", "Siddha"],
    category: "Rasayana",
    region: "Indian Subcontinent",
    partUsed: ["Fruit"],
    medicinalProperties: ["Antioxidant", "Vitamin C rich", "Rejuvenating", "Digestive"],
    therapeuticUses: [
      "Immune support",
      "Hair health",
      "Digestive health",
      "Anti-aging",
      "Eye health"
    ],
    precautions: [
      "May enhance effects of blood thinners",
      "Moderate consumption during pregnancy",
      "May lower blood sugar"
    ],
    description: "Amla is one of the three fruits in the famous Triphala formula. It contains one of the highest concentrations of vitamin C found in nature and is revered as a powerful rejuvenator.",
    healthThemes: ["immunity", "digestion", "hair"],
    doshaEffect: "Balances all three Doshas"
  },
  {
    id: 10,
    name: "Giloy",
    botanicalName: "Tinospora cordifolia",
    commonNames: ["Guduchi", "Heart-leaved Moonseed"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    ayushSystem: ["Ayurveda"],
    category: "Immunomodulator",
    region: "Tropical India",
    partUsed: ["Stem", "Leaves"],
    medicinalProperties: ["Immunomodulatory", "Anti-pyretic", "Anti-inflammatory", "Hepatoprotective"],
    therapeuticUses: [
      "Fever management",
      "Immune enhancement",
      "Chronic fever",
      "Liver support",
      "Allergies"
    ],
    precautions: [
      "Consult doctor for autoimmune conditions",
      "May lower blood sugar",
      "Avoid excessive long-term use"
    ],
    description: "Giloy, known as 'Amrita' or nectar of immortality, is a powerful immunomodulator. It has gained recognition for its ability to strengthen the immune system naturally.",
    healthThemes: ["immunity", "fever", "detox"],
    doshaEffect: "Balances Vata, Pitta, and Kapha"
  },
  {
    id: 11,
    name: "Shatavari",
    botanicalName: "Asparagus racemosus",
    commonNames: ["Wild Asparagus", "Queen of Herbs"],
    image: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=800",
    ayushSystem: ["Ayurveda"],
    category: "Rasayana",
    region: "India, Himalayas",
    partUsed: ["Root"],
    medicinalProperties: ["Adaptogenic", "Rejuvenating", "Galactagogue", "Demulcent"],
    therapeuticUses: [
      "Women's health",
      "Hormonal balance",
      "Digestive health",
      "Reproductive health",
      "Lactation support"
    ],
    precautions: [
      "Avoid with estrogen-sensitive conditions",
      "Consult doctor during pregnancy",
      "May interact with diuretics"
    ],
    description: "Shatavari translates to 'she who possesses 100 husbands,' indicating its rejuvenating properties. It is the premier female reproductive tonic in Ayurveda.",
    healthThemes: ["womens-health", "hormones", "digestion"],
    doshaEffect: "Balances Vata and Pitta"
  },
  {
    id: 12,
    name: "Manjistha",
    botanicalName: "Rubia cordifolia",
    commonNames: ["Indian Madder"],
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800",
    ayushSystem: ["Ayurveda"],
    category: "Blood Purifier",
    region: "Himalayas, India",
    partUsed: ["Root"],
    medicinalProperties: ["Blood purifier", "Anti-inflammatory", "Lymphatic cleanser", "Skin tonic"],
    therapeuticUses: [
      "Skin disorders",
      "Blood purification",
      "Lymphatic drainage",
      "Menstrual issues",
      "Wound healing"
    ],
    precautions: [
      "May increase menstrual flow",
      "Consult doctor during pregnancy",
      "May stain urine red (harmless)"
    ],
    description: "Manjistha is the best blood-purifying herb in Ayurveda. It supports the lymphatic system and promotes clear, radiant skin by detoxifying the blood.",
    healthThemes: ["skin", "detox", "womens-health"],
    doshaEffect: "Balances Pitta and Kapha"
  },
  {
    id: 13,
    name: "Triphala",
    botanicalName: "Amalaki + Bibhitaki + Haritaki",
    commonNames: ["Three Fruits"],
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800",
    ayushSystem: ["Ayurveda"],
    category: "Rasayana",
    region: "India",
    partUsed: ["Fruits (combination)"],
    medicinalProperties: ["Digestive", "Detoxifying", "Rejuvenating", "Antioxidant"],
    therapeuticUses: [
      "Digestive health",
      "Gentle detoxification",
      "Eye health",
      "Weight management",
      "Colon cleansing"
    ],
    precautions: [
      "Start with low doses",
      "May cause loose stools initially",
      "Avoid during pregnancy"
    ],
    description: "Triphala is the most famous Ayurvedic formula, combining three fruits. It is a gentle yet effective cleanser and rejuvenator, suitable for long-term use.",
    healthThemes: ["digestion", "detox", "eyes"],
    doshaEffect: "Balances all three Doshas"
  },
  {
    id: 14,
    name: "Licorice",
    botanicalName: "Glycyrrhiza glabra",
    commonNames: ["Mulethi", "Yashtimadhu"],
    image: "https://images.unsplash.com/photo-1558618555-0f5c3d31fe8f?w=800",
    ayushSystem: ["Ayurveda", "Unani", "Siddha"],
    category: "Demulcent",
    region: "Mediterranean, Asia",
    partUsed: ["Root"],
    medicinalProperties: ["Demulcent", "Expectorant", "Anti-inflammatory", "Adrenal support"],
    therapeuticUses: [
      "Respiratory health",
      "Digestive soothing",
      "Throat care",
      "Adrenal fatigue",
      "Skin health"
    ],
    precautions: [
      "Avoid in hypertension",
      "Not for prolonged high-dose use",
      "May interact with medications"
    ],
    description: "Licorice root is 50 times sweeter than sugar and is one of the most widely used herbs in Ayurveda. It soothes and protects mucous membranes throughout the body.",
    healthThemes: ["respiratory", "digestion", "stress"],
    doshaEffect: "Balances Vata and Pitta"
  },
  {
    id: 15,
    name: "Ginger",
    botanicalName: "Zingiber officinale",
    commonNames: ["Adrak", "Shunthi (dried)"],
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800",
    ayushSystem: ["Ayurveda", "Unani", "Siddha"],
    category: "Digestive",
    region: "Southeast Asia",
    partUsed: ["Rhizome"],
    medicinalProperties: ["Digestive", "Anti-nausea", "Circulatory", "Anti-inflammatory"],
    therapeuticUses: [
      "Digestive support",
      "Nausea relief",
      "Cold and flu",
      "Joint health",
      "Circulation"
    ],
    precautions: [
      "May thin blood in high doses",
      "Use cautiously with gallstones",
      "Moderate during pregnancy"
    ],
    description: "Ginger is called 'Vishwabheshaj' - the universal medicine. Fresh ginger is used for digestive issues while dried ginger has more warming and penetrating properties.",
    healthThemes: ["digestion", "immunity", "circulation"],
    doshaEffect: "Balances Vata and Kapha"
  },
  {
    id: 16,
    name: "Gudmar",
    botanicalName: "Gymnema sylvestre",
    commonNames: ["Sugar Destroyer", "Meshashringi"],
    image: "https://images.unsplash.com/photo-1515586838455-8f8f940d6853?w=800",
    ayushSystem: ["Ayurveda"],
    category: "Metabolic",
    region: "Central and Southern India",
    partUsed: ["Leaves"],
    medicinalProperties: ["Anti-diabetic", "Sugar craving reducer", "Metabolic regulator"],
    therapeuticUses: [
      "Blood sugar management",
      "Sugar cravings",
      "Weight management",
      "Metabolic health",
      "Pancreatic support"
    ],
    precautions: [
      "Monitor blood sugar closely",
      "May enhance diabetes medications",
      "Consult doctor before use"
    ],
    description: "Gudmar literally means 'destroyer of sugar.' When chewed, its leaves temporarily block the taste of sweetness, and it has remarkable effects on blood sugar regulation.",
    healthThemes: ["diabetes", "weight", "metabolism"],
    doshaEffect: "Balances Kapha"
  },
  {
    id: 17,
    name: "Arjuna",
    botanicalName: "Terminalia arjuna",
    commonNames: ["Arjun Tree"],
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800",
    ayushSystem: ["Ayurveda"],
    category: "Cardiotonic",
    region: "India",
    partUsed: ["Bark"],
    medicinalProperties: ["Cardioprotective", "Antioxidant", "Hypotensive", "Strengthening"],
    therapeuticUses: [
      "Heart health",
      "Blood pressure",
      "Cholesterol management",
      "Circulation",
      "Cardiac strength"
    ],
    precautions: [
      "Monitor if on heart medications",
      "May lower blood pressure",
      "Consult cardiologist"
    ],
    description: "Named after the legendary warrior Arjuna, this tree bark is the premier heart tonic in Ayurveda. It strengthens the heart muscle and supports healthy cardiovascular function.",
    healthThemes: ["heart", "circulation", "blood-pressure"],
    doshaEffect: "Balances Kapha and Pitta"
  },
  {
    id: 18,
    name: "Shankhpushpi",
    botanicalName: "Convolvulus pluricaulis",
    commonNames: ["Morning Glory"],
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800",
    ayushSystem: ["Ayurveda"],
    category: "Nootropic",
    region: "India",
    partUsed: ["Whole plant"],
    medicinalProperties: ["Brain tonic", "Calming", "Memory enhancer", "Anxiolytic"],
    therapeuticUses: [
      "Memory and learning",
      "Anxiety relief",
      "Sleep support",
      "Mental fatigue",
      "Concentration"
    ],
    precautions: [
      "May cause drowsiness",
      "Avoid with sedatives",
      "Start with low doses"
    ],
    description: "Shankhpushpi is a renowned brain tonic whose flowers resemble a conch shell (shankh). It is traditionally used to enhance memory, intellect, and learning capacity.",
    healthThemes: ["mental", "stress", "sleep"],
    doshaEffect: "Balances Pitta"
  },
  {
    id: 19,
    name: "Moringa",
    botanicalName: "Moringa oleifera",
    commonNames: ["Drumstick Tree", "Miracle Tree"],
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800",
    ayushSystem: ["Ayurveda", "Siddha"],
    category: "Nutritive",
    region: "India, Africa",
    partUsed: ["Leaves", "Seeds", "Pods"],
    medicinalProperties: ["Nutritive", "Antioxidant", "Anti-inflammatory", "Antimicrobial"],
    therapeuticUses: [
      "Nutritional supplement",
      "Energy support",
      "Lactation support",
      "Blood sugar balance",
      "Anti-aging"
    ],
    precautions: [
      "May lower blood pressure",
      "Root bark should be avoided during pregnancy",
      "Monitor blood sugar"
    ],
    description: "Moringa is called the 'Miracle Tree' because almost every part is useful. Its leaves contain more nutrients gram-for-gram than most other plants.",
    healthThemes: ["nutrition", "energy", "immunity"],
    doshaEffect: "Balances Kapha and Vata"
  },

];

// Health themes for guided tours
export const healthThemes = [
  {
    id: "immunity",
    name: "Immunity Boosters",
    icon: "🛡️",
    description: "Strengthen your natural defenses with these powerful herbs",
    color: "from-emerald-500 to-green-600",
    plants: [1, 4, 6, 7, 12, 16]
  },
  {
    id: "digestion",
    name: "Digestive Health",
    icon: "🍃",
    description: "Support healthy digestion and gut wellness",
    color: "from-lime-500 to-emerald-600",
    plants: [1, 4, 6, 10, 11, 12]
  },
  {
    id: "stress",
    name: "Stress Relief",
    icon: "🧘",
    description: "Calm your mind and manage stress naturally",
    color: "from-teal-500 to-cyan-600",
    plants: [1, 2, 5, 11, 15]
  },
  {
    id: "energy",
    name: "Energy & Vitality",
    icon: "💪",
    description: "Boost your energy and enhance vitality",
    color: "from-yellow-500 to-orange-500",
    plants: [2, 6, 12, 16]
  },
  {
    id: "sleep",
    name: "Sleep & Relaxation",
    icon: "🌙",
    description: "Promote restful sleep and deep relaxation",
    color: "from-indigo-500 to-purple-600",
    plants: [2, 5, 15]
  },
  {
    id: "skin",
    name: "Skin & Beauty",
    icon: "✨",
    description: "Natural herbs for radiant skin and beauty",
    color: "from-pink-500 to-rose-600",
    plants: [3, 4, 6, 9]
  },
  {
    id: "mental",
    name: "Mental Clarity",
    icon: "🧠",
    description: "Enhance focus, memory, and cognitive function",
    color: "from-violet-500 to-purple-600",
    plants: [2, 5, 15]
  },
  {
    id: "heart",
    name: "Heart Health",
    icon: "❤️",
    description: "Support cardiovascular health naturally",
    color: "from-red-500 to-rose-600",
    plants: [14, 12]
  }
];

// AYUSH Systems information
export const ayushSystems = [
  {
    id: "ayurveda",
    name: "Ayurveda",
    fullName: "Science of Life",
    origin: "India (~5000 years old)",
    description: "Ancient Indian system based on balancing body's doshas (Vata, Pitta, Kapha)",
    icon: "🕉️"
  },
  {
    id: "yoga",
    name: "Yoga & Naturopathy",
    fullName: "Union of Mind, Body, Spirit",
    origin: "India (~5000 years old)",
    description: "Combines physical postures, breathing, and meditation with natural healing",
    icon: "🧘‍♀️"
  },
  {
    id: "unani",
    name: "Unani",
    fullName: "Greco-Arabic Medicine",
    origin: "Greece, Persia (~2500 years old)",
    description: "Based on four humors theory, emphasizes balance of body fluids",
    icon: "🌿"
  },
  {
    id: "siddha",
    name: "Siddha",
    fullName: "Tamil Traditional Medicine",
    origin: "South India (~5000 years old)",
    description: "One of the oldest medical systems, uses herbs, minerals, and metals",
    icon: "🔱"
  },
  {
    id: "homeopathy",
    name: "Homeopathy",
    fullName: "Like Cures Like",
    origin: "Germany (~200 years old)",
    description: "Uses highly diluted substances to trigger body's natural healing",
    icon: "💧"
  }
];

// Filter options
export const filterOptions = {
  ayushSystems: ["Ayurveda", "Siddha", "Unani", "Yoga", "Homeopathy"],
  categories: ["Adaptogen", "Antimicrobial", "Anti-inflammatory", "Nootropic", "Rasayana", "Digestive", "Cardiotonic", "Immunomodulator", "Blood Purifier", "Metabolic", "Nutritive", "Demulcent"],
  regions: ["Indian Subcontinent", "South Asia", "Himalayas", "Central India", "South India", "Mediterranean", "Southeast Asia"],
  partsUsed: ["Leaves", "Roots", "Seeds", "Bark", "Fruit", "Whole plant", "Rhizome", "Flowers", "Oil"],
  healthThemes: ["Immunity", "Digestion", "Stress Relief", "Energy", "Sleep", "Skin", "Mental Health", "Heart Health", "Women's Health", "Detox"]
};
