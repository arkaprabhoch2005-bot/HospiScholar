export interface StudyNote {
  id: string;
  slug: string;
  title: string;
  subject: string;
  semester: number;
  readTime: string;
  category: string;
  author: string;
  summary: string;
  tags: string[];
  lastUpdated: string;
  content: {
    introduction: string;
    sections: {
      heading: string;
      body: string;
      bulletPoints?: string[];
      callout?: string;
    }[];
    table?: {
      caption: string;
      headers: string[];
      rows: string[][];
    };
    examTips?: string[];
  };
}

export const studyNotes: StudyNote[] = [
  {
    id: "classical-french-menu-structure-17-courses",
    slug: "classical-french-menu-structure-17-courses",
    title: "Classical French Menu Structure & 17 Courses",
    subject: "F&B Service Foundation I & II",
    semester: 1,
    readTime: "8 min read",
    category: "Food & Beverage Service",
    author: "Chef Auguste Escoffier Academic Archive / HospiScholar Editorial",
    summary: "Comprehensive guide to the 17 courses of the Classical French Menu sequence developed by Escoffier, including French nomenclature, course descriptions, classical examples, cover layouts, and wine pairing rules.",
    tags: ["French Menu", "Escoffier", "17 Courses", "F&B Service", "Menu Planning", "Culinary Arts"],
    lastUpdated: "2026 Curriculum Standard",
    content: {
      introduction: "The Classical French Menu (Menu Classique Français) was formalized in the late 19th and early 20th centuries, most prominently organized by Auguste Escoffier. It established a harmonious sequence of dining where flavors, textures, temperatures, and culinary weights progress logically from light appetizers to substantial roasts, followed by palette cleansers and sweet finales.",
      sections: [
        {
          heading: "1. The Sequential Architecture of the 17 Courses",
          body: "In a formal 17-course banquet, dishes are served sequentially so each course prepares the palate for the next. While modern degustation menus typically compress this into 5 to 7 courses, hotel management students must master the exact French nomenclature and sequential order:",
          bulletPoints: [
            "1. Hors-d'œuvre (Appetizer / Starters): Stimulates appetite with acidic, salty, or delicate flavors (Caviar, Oysters, Pâté de foie gras, Canapés).",
            "2. Potage (Soup): Clear (Consommé Brunoise/Julienne) or thick (Velouté, Purée, Cream). Usually consommé is served for classical banquets.",
            "3. Œufs (Eggs): Light egg preparation (Omelette aux fines herbes, Œuf poché Florentine). Never served on luncheon menus if followed by fish.",
            "4. Farineux (Pasta / Rice / Farinaceous): Starchy dish such as Gnocchi Parisienne, Risotto aux champignons, or Ravioli.",
            "5. Poisson (Fish): Poached, steamed, or grilled delicate fish (Sole meunière, Saumon poché sauce Hollandaise) served with boiled potatoes.",
            "6. Entrée (First Meat Course): Small, boneless, garnished meat course served with rich sauces (Tournedos Rossini, Sweetbreads, Vol-au-vent).",
            "7. Relevé (Main Joint / Removes): Large joints of butcher's meat (Roast saddle of lamb, Sirloin of beef) carved at the guéridon table.",
            "8. Sorbet (Palate Cleanser): Iced citrus water or champagne sorbet with Russian cigarettes (Sorbet au Champagne) to cleanse palate and aid digestion.",
            "9. Rôti (Roast / Game Birds): Roasted game or poultry (Pheasant, Partridge, Duckling, Roast capon) accompanied by light jus and watercress.",
            "10. Légumes (Vegetables): High-end vegetables served as an independent course (Asparagus with sauce mousseline, Artichokes hollandaise).",
            "11. Salades (Salad): Refreshing dressed greens (Salade de saison, Endive & walnut salad) with light vinaigrette.",
            "12. Buffet Froid (Cold Buffet): Cold cuts, galantines, ballotines, and terrines displayed on mirror platters.",
            "13. Entremets de Sucre (Sweets / Dessert): Warm soufflés, crêpes Suzette, Charlotte Russe, or Bavaroise.",
            "14. Savoureux (Savory): Savory hot bites to cut sweet aftertaste (Angels on horseback, Welsh rarebit, Canapé Diane).",
            "15. Fromage (Cheese): Board of regional French artisanal cheeses (Camembert, Brie, Roquefort, Comté) served with crackers and celery.",
            "16. Dessert (Fresh Fruits & Nuts): Freshly peeled fruits, grapes, walnuts, and almonds served on silver compotiers.",
            "17. Boissons (Beverages / Coffee & Digestifs): Demitasse of dark French roast coffee, cognac, Armagnac, or liqueurs."
          ]
        },
        {
          heading: "2. Cover Layout & Silverware Service Protocol",
          body: "For classical banquets, silverware is laid strictly from the outside in (à la carte or table d'hôte cover). Cutlery for a maximum of three courses is placed on the table initially; subsequent specialized pieces are laid just before the respective course is presented.",
          callout: "Exam Golden Rule: A sorbet course is served in a sorbet coupe with a teaspoon or ice cream spoon. It marks the divider between the lighter first half and the heavier roast courses."
        },
        {
          heading: "3. Abbreviated Modern Degustation Sequences",
          body: "In modern luxury five-star operations, the 17-course sequence is adapted into 5-course, 7-course, or 11-course tasting menus while preserving Escoffier's harmonic progression:",
          bulletPoints: [
            "5-Course Standard: Potage → Poisson → Entrée/Relevé → Entremets → Boissons",
            "7-Course Gala Banquet: Hors d'œuvre → Potage → Poisson → Sorbet → Relevé → Entremets → Boissons",
            "11-Course Prestige Menu: Hors d'œuvre → Potage → Poisson → Entrée → Sorbet → Rôti → Légumes → Salade → Fromage → Entremets → Boissons"
          ]
        }
      ],
      table: {
        caption: "Escoffier 17-Course Sequential Reference Chart",
        headers: ["Course #", "French Nomenclature", "English Equivalent", "Classical Example", "Standard Beverage Pairing"],
        rows: [
          ["1", "Hors-d'œuvre", "Appetizer", "Huitres fraîches (Oysters)", "Champagne Brut"],
          ["2", "Potage", "Soup", "Consommé Célestine", "Dry Amontillado Sherry"],
          ["3", "Œufs", "Egg Dish", "Œufs brouillés aux truffes", "Chablis Premier Cru"],
          ["4", "Farineux", "Farinaceous/Pasta", "Gnocchi à la Romaine", "Soave Classico"],
          ["5", "Poisson", "Fish", "Filet de Sole Bonne Femme", "Puligny-Montrachet"],
          ["6", "Entrée", "First Meat", "Tournedos Chasseur", "Pomerol / Pinot Noir"],
          ["7", "Relevé", "Main Joint", "Selle d'Agneau Rôtie", "Pauillac / Cabernet Sauvignon"],
          ["8", "Sorbet", "Palate Cleanser", "Sorbet au Citron Vert", "Vodka / Champagne Splash"],
          ["9", "Rôti", "Roast Game/Poultry", "Faisan Rôti au Jus", "Côte-Rôtie / Syrah"],
          ["10", "Légumes", "Vegetable", "Asperges Vertes Sauce Mousseline", "Dry Riesling"],
          ["11", "Salades", "Salad", "Salade Composée de Saison", "Water / Light Rosé"],
          ["12", "Buffet Froid", "Cold Buffet", "Pâté en Croûte de Canard", "Beaujolais Cru"],
          ["13", "Entremets", "Sweet Desserts", "Soufflé au Grand Marnier", "Sauternes"],
          ["14", "Savoureux", "Savory Dish", "Welsh Rarebit", "Dark Ale or Ruby Port"],
          ["15", "Fromage", "Cheese Course", "Plateau de Fromages Affinés", "Vintage Port or Full Red"],
          ["16", "Dessert", "Fruits & Nuts", "Corbeille de Fruits Frais", "Muscat de Beaumes-de-Venise"],
          ["17", "Boissons", "Coffee & Liqueurs", "Café Noir & Cognac XO", "Cognac / Armagnac"]
        ]
      },
      examTips: [
        "In NCHMCT exams, always state courses in their exact French spelling (with correct accents when required).",
        "Explain the critical functional difference between an Entrée (served from the kitchen plated, with sauce) and a Relevé (large butcher joint, carved tableside).",
        "Sorbet is strictly NOT a dessert; its role in course 8 is physiological palate stimulation and degreasing."
      ]
    }
  },
  {
    id: "five-mother-sauces-french-cuisine",
    slug: "five-mother-sauces-french-cuisine",
    title: "The 5 Mother Sauces of Classical French Cuisine",
    subject: "Food Production Foundation I & II",
    semester: 1,
    readTime: "7 min read",
    category: "Culinary Arts & Food Production",
    author: "Chef Antonin Carême & Auguste Escoffier Systematics",
    summary: "Detailed breakdown of the 5 Classical French Mother Sauces (Béchamel, Velouté, Espagnole, Tomato, and Hollandaise), roux ratios, liquid bases, cooking times, and key secondary derivatives.",
    tags: ["Mother Sauces", "Roux", "Food Production", "Béchamel", "Hollandaise", "Culinary"],
    lastUpdated: "2026 Curriculum Standard",
    content: {
      introduction: "Originally codified by Marie-Antoine Carême in the 19th century and later refined by Auguste Escoffier, the French Mother Sauces (Grandes Sauces) form the cornerstone of classical and modern Western culinary arts.",
      sections: [
        {
          heading: "1. The 5 Classical Pillars",
          body: "A mother sauce consists of a liquid base combined with a thickening agent (most commonly a roux, or an egg yolk emulsion in the case of Hollandaise):",
          bulletPoints: [
            "Béchamel: White roux (equal parts butter & flour cooked without browning) + Scalded milk + Onion piqué (onion studded with bay leaf and cloves).",
            "Velouté: Blond roux + White stock (veal, chicken, or fish stock). Silky texture with subtle aroma.",
            "Espagnole (Brown Sauce): Brown roux + Roasted veal stock + Mirepoix + Roasted tomato purée, simmered slowly and reduced.",
            "Sauce Tomate: Classical French tomato sauce with salt pork/bacon, mirepoix, white veal stock, and crushed tomatoes, simmered for 2 hours.",
            "Hollandaise: Warm emulsion of clarified butter into egg yolks, seasoned with lemon juice, white peppercorns, and a splash of cold water."
          ]
        },
        {
          heading: "2. Secondary Sauces (Derivatives)",
          body: "By infusing unique flavor additions, herbs, or fortified wines into each mother sauce, hundreds of derivative small sauces are created:",
          bulletPoints: [
            "Derivatives of Béchamel: Mornay (gruyère & parmesan), Soubise (sweated onions), Nantua (crayfish butter & cream), Cheddar cheese sauce.",
            "Derivatives of Velouté: Suprême (chicken velouté + cream + butter), Allemande (veal velouté + egg yolk liaison), Bercy (fish velouté + shallots + white wine + parsley).",
            "Derivatives of Espagnole: Demi-glace (equal parts espagnole & brown veal stock, reduced by half), Bordelaise (red wine + shallots + bone marrow), Robert (white wine + shallots + mustard), Chasseur (mushrooms + shallots + white wine + tomatoes).",
            "Derivatives of Hollandaise: Béarnaise (shallot, tarragon & chervil reduction), Maltaise (blood orange zest & juice), Mousseline/Chantilly (folded whipped cream), Choron (béarnaise + tomato paste)."
          ]
        }
      ],
      examTips: [
        "Remember the standard roux ratio: 1:1 by weight (50g clarified butter to 50g all-purpose flour).",
        "Hollandaise is a warm emulsion sauce, highly prone to curdling if heated above 65°C."
      ]
    }
  },
  {
    id: "front-office-guest-cycle-night-audit",
    slug: "front-office-guest-cycle-night-audit",
    title: "Front Office Guest Cycle & Night Audit Operations",
    subject: "Front Office Operations I & II",
    semester: 2,
    readTime: "9 min read",
    category: "Front Office Management",
    author: "Hospitality Management Faculty / HospiScholar",
    summary: "Complete operational breakdown of the 4 stages of the hotel guest cycle, key formulas (ADR, RevPAR, Occupancy %), guest folio management, and step-by-step night audit procedures.",
    tags: ["Front Office", "Guest Cycle", "Night Audit", "ADR", "RevPAR", "Folio"],
    lastUpdated: "2026 Curriculum Standard",
    content: {
      introduction: "The Front Office is the operational nerve center of a hotel. The guest cycle tracks every touchpoint between the hotel and the guest, divided into four distinct sequential phases: Pre-Arrival, Arrival, Occupancy, and Departure.",
      sections: [
        {
          heading: "1. The 4 Phases of the Guest Cycle",
          body: "Each stage involves specific documentation and property management system (PMS) accounting entries:",
          bulletPoints: [
            "Phase 1: Pre-Arrival: Reservation inquiries, guaranteed vs non-guaranteed bookings, CRS/GDS channel management, pre-registration of VIPs.",
            "Phase 2: Arrival (Check-in): Meet & greet, verification of identity/passport (C-Form in India), credit card pre-authorization, room assignment, key card issuance, and opening the guest master folio.",
            "Phase 3: Occupancy: In-house charge postings (restaurant, minibar, spa, laundry), telephone handling, safe deposit, complaint resolution, room moves.",
            "Phase 4: Departure (Check-out): Folio review, final settlement (cash, card, city ledger corporate billing), key card return, luggage assistance, feedback collection, updating PMS room status to 'Vacant Dirty'."
          ]
        },
        {
          heading: "2. Key Hotel Performance Formulas",
          body: "Every front office student must calculate these metrics without error in university exams:",
          bulletPoints: [
            "Occupancy % = (Total Rooms Sold / Total Available Rooms for Sale) × 100",
            "Average Daily Rate (ADR) = Total Room Revenue / Total Rooms Sold",
            "Revenue Per Available Room (RevPAR) = Total Room Revenue / Total Available Rooms = ADR × Occupancy %",
            "Double Occupancy % = (Total Guests - Total Rooms Sold) / Total Rooms Sold × 100"
          ]
        },
        {
          heading: "3. The Night Audit Protocol",
          body: "Conducted between 11:30 PM and 4:30 AM by the night auditor, this critical audit balances the hotel's financial accounts:",
          bulletPoints: [
            "Step 1: Complete outstanding daily postings and department charge reconciliations.",
            "Step 2: Reconcile room status discrepancies between Housekeeping and Front Desk reports.",
            "Step 3: Post room and tax charges automatically to all active guest folios.",
            "Step 4: Roll the business day forward on the Property Management System (PMS).",
            "Step 5: Generate managerial daily reports: Trial Balance, High Balance Report, and Flash Revenue Summary."
          ]
        }
      ],
      examTips: [
        "In numerical problems, be careful not to include out-of-order (OOO) rooms in rooms available for sale.",
        "Differentiate clearly between Guest Folio (individual guest), Master Folio (corporate group), and Non-Guest Folio (walk-in fitness/dining patron)."
      ]
    }
  },
  {
    id: "housekeeping-room-cleaning-sop",
    slug: "housekeeping-room-cleaning-sop",
    title: "16-Step Guest Room Cleaning & Inspection SOP",
    subject: "Accommodation Operations I",
    semester: 1,
    readTime: "6 min read",
    category: "Housekeeping",
    author: "Executive Housekeeper Standards Board",
    summary: "Standard Operating Procedure for servicing departure and occupied guest rooms, bed-making mitered corner technique, sanitary color-coding, and key control.",
    tags: ["Housekeeping", "Room Cleaning", "SOP", "Bed Making", "Hygiene"],
    lastUpdated: "2026 Curriculum Standard",
    content: {
      introduction: "Housekeeping is responsible for creating a pristine, sanitary, and aesthetically pleasing environment that directly drives hotel guest satisfaction scores.",
      sections: [
        {
          heading: "1. Sequence of Servicing Guest Rooms",
          body: "Guest rooms must be serviced in strict priority order: 1. Guest requests ('Please Make Up My Room'), 2. VIP rooms, 3. Checkout/Departure rooms, 4. Stayover/Occupied rooms, 5. Vacant rooms for routine dusting.",
          bulletPoints: [
            "Entry Protocol: Knock firmly 3 times with knuckles, announce 'Housekeeping', wait 10 seconds, repeat. Never enter a room with 'Do Not Disturb' (DND) without following senior security escalation.",
            "Ventilation & Stripping: Draw curtains, open windows if allowed, strip soiled bed linens and towels carefully without letting them touch the floor.",
            "Bed Making: Inspect mattress pad, lay bottom sheet, top sheet, and duvet with precision mitered corners (hospital corners) at 45 degrees.",
            "Bathroom Sanitation: Apply toilet cleaner and descaler; use color-coded microfiber cloths (Red: WC/Urinal, Yellow: Basin/Countertop, Blue: Mirrors/Glass, Green: General dusting).",
            "Replenishment: Replenish luxury amenities (shampoo, dental kit, body wash, bath mat, sewing kit, stationery).",
            "Vacuuming: Vacuum backwards from the balcony/window towards the entrance door."
          ]
        }
      ]
    }
  }
];
