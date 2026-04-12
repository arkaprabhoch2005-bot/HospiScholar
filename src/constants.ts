import { 
  ChefHat, Utensils, BedDouble, Briefcase, 
  FileText, Globe, ShieldCheck, Bookmark, Calendar, Compass
} from 'lucide-react';

export const semesters = [
  {
    id: 1,
    title: "Semester 1",
    subtitle: "Foundation Course",
    description: "Introduction to the core operational departments of a hotel and basic hospitality principles.",
    subjects: [
      { name: "Food Production Foundation I", icon: ChefHat, desc: "Culinary techniques, kitchen equipment knowledge, and basic food preparation methods." },
      { name: "F&B Service Foundation I", icon: Utensils, desc: "Basics of food and beverage service, service types, and terminology." },
      { name: "Front Office Operations I", icon: Briefcase, desc: "Introduction to front office operations, guest handling, and reservation systems." },
      { name: "Accommodation Operations I", icon: BedDouble, desc: "Basics of housekeeping operations, guest rooms, and cleaning standards." },
      { name: "Business Communication", icon: FileText, desc: "Development of communication skills required in the global hospitality industry." }
    ]
  },
  {
    id: 2,
    title: "Semester 2",
    subtitle: "Basic Operations",
    description: "Deeper insights into operational techniques, food science, and hotel accounting.",
    subjects: [
      { name: "Food Production Foundation II", icon: ChefHat, desc: "Soups, sauces, basic bakery, and international ingredients." },
      { name: "F&B Service Foundation II", icon: Utensils, desc: "Menu planning, advanced service techniques, and restaurant operations." },
      { name: "Hotel Accounting", icon: FileText, desc: "Introduction to basic accounting principles, journal entries, and balance sheets." },
      { name: "Environmental Studies", icon: Globe, desc: "Study of sustainable practices and environmental impact in the hospitality industry." }
    ]
  },
  {
    id: 3,
    title: "Semester 3",
    subtitle: "Core Operations",
    description: "Advanced operational training, regional cuisines, and introduction to management controls.",
    subjects: [
      { name: "Food Production Operations I", icon: ChefHat, desc: "Regional Indian cuisines, volume catering, and butchery techniques." },
      { name: "F&B Controls", icon: ShieldCheck, desc: "Techniques for controlling costs in food, beverage, and operational services." },
      { name: "Front Office Management", icon: Briefcase, desc: "Night auditing, yield management, and guest accounting procedures." },
      { name: "Food Safety & Quality", icon: ShieldCheck, desc: "HACCP principles, hygiene standards, and food microbiology." }
    ]
  },
  {
    id: 4,
    title: "Semester 4",
    subtitle: "Industrial Training",
    description: "Six months of hands-on industry exposure at a recognized 5-star hotel property.",
    subjects: [
      { name: "Core Department Internship", icon: Briefcase, desc: "Practical cross-training across Food Production, F&B, Front Office, and Housekeeping." },
      { name: "Logbook & Appraisals", icon: Bookmark, desc: "Maintaining daily task logs and receiving formal industry appraisals." }
    ]
  },
  {
    id: 5,
    title: "Semester 5",
    subtitle: "Advanced Operations & Management",
    description: "Mastering complex culinary arts, fine dining, and supervisory skills.",
    subjects: [
      { name: "Advanced Food Production", icon: ChefHat, desc: "International cuisine, advanced plating, and molecular gastronomy basics." },
      { name: "Advanced F&B Service", icon: Utensils, desc: "Managing fine dining services, food pairing, and flambé work." },
      { name: "Hospitality Sales & Marketing", icon: Compass, desc: "Sales techniques, customer acquisition, and relationship management." },
      { name: "Human Resource Management", icon: Briefcase, desc: "Staffing, training, appraisals, and labor laws in hotels." }
    ]
  },
  {
    id: 6,
    title: "Semester 6",
    subtitle: "Specialization & Strategy",
    description: "Focus on business strategy, event planning, and specialized elective paths.",
    subjects: [
      { name: "Strategic Management", icon: Compass, desc: "Advanced operational and strategic decision-making in hospitality." },
      { name: "Event Management", icon: Calendar, desc: "Planning and executing corporate events, weddings, and banquets." },
      { name: "Luxury Hospitality Management", icon: Briefcase, desc: "Management of luxury hotels, resorts, and bespoke guest services." },
      { name: "Entrepreneurship", icon: Compass, desc: "Starting and managing independent restaurants, cafes, or boutique hotels." }
    ]
  }
];

export const newsArticles = [
  {
    id: 1,
    title: "ITC Hotels' Welcomhotel brand crosses 50-property milestone",
    summary: "ITC Hotels Limited announced the milestone 50th hotel signing for the Welcomhotel brand in India with new upcoming properties in Shirdi and Bhubaneshwar, rapidly expanding their leisure footprint.",
    date: "April 12, 2026",
    category: "Expansion",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Chef Kunal Kapur brings 'Pincode' to Bengaluru",
    summary: "Conceptualised as a tribute to India's vast culinary landscape, the new restaurant draws inspiration from Kapur's journeys through small towns, bustling cities, and heritage family kitchens.",
    date: "April 12, 2026",
    category: "F&B Trends",
    imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Sayaji Hotels enters Amravati with Enrise brand",
    summary: "With 82 premium rooms, Enrise Amravati offers a comfortable yet refined stay experience, targeting the rapidly emerging tier-2 city corporate and social events demand in Maharashtra.",
    date: "April 8, 2026",
    category: "New Launch",
    imageUrl: "https://images.unsplash.com/photo-1618773928120-2c14f2998319?auto=format&fit=crop&w=800&q=80"
  }
];

export const ongoingCurrentAffairs = [
  { id: 1, topic: "Global Tourism Summit 2026", details: "Hosted in New Delhi, focusing on 'Sustainable Travel & Green Policies'. Major hotel chains signed a pact to reduce carbon footprints by 2030." },
  { id: 2, topic: "RBI Repo Rate Unchanged", details: "The Reserve Bank of India kept the repo rate steady at 6.5%, meaning loans for new hotel projects remain stable without immediate hikes." },
  { id: 3, topic: "New E-Visa Expansion", details: "The government has extended free E-Visa facilities to 15 more countries to rapidly boost inbound foreign tourist arrivals for the winter season." }
];

export const staticCurrentAffairs = [
  { id: 1, topic: "UNWTO Headquarters", details: "The United Nations World Tourism Organization (UNWTO) is headquartered in Madrid, Spain. It promotes responsible and universally accessible tourism." },
  { id: 2, topic: "World Tourism Day", details: "Celebrated globally on September 27th every year to foster awareness among the international community of the importance of tourism." },
  { id: 3, topic: "Largest Hotel Chain", details: "By number of properties and rooms, Marriott International is currently recognized as the largest hotel chain globally." }
];

export const ihmCampuses = [
  { id: 'all', name: 'Global Network (All)' },
  { id: 'mumbai', name: 'IHM Mumbai' },
  { id: 'pusa', name: 'IHM Pusa (New Delhi)' },
  { id: 'bengaluru', name: 'IHM Bengaluru' },
  { id: 'goa', name: 'IHM Goa' },
  { id: 'chennai', name: 'IHM Chennai' },
  { id: 'kolkata', name: 'IHM Kolkata' },
];

export const mockLeaderboard = [
  { id: 1, name: 'Kavya S.', campus: 'IHM Mumbai', points: 840, rank: 1 },
  { id: 2, name: 'Aman P.', campus: 'IHM Pusa', points: 720, rank: 2 },
  { id: 3, name: 'Vikram J.', campus: 'IHM Bengaluru', points: 490, rank: 3 },
  { id: 4, name: 'Priya R.', campus: 'IHM Goa', points: 410, rank: 4 },
  { id: 5, name: 'Neha K.', campus: 'IHM Chennai', points: 380, rank: 5 },
];

export const dailyQuiz = [
  { id: 1, question: "Which of the following is NOT one of the 5 French Mother Sauces?", options: ["Béchamel", "Velouté", "Hollandaise", "Mayonnaise"], correct: 3 },
  { id: 2, question: "What is the standard check-out time in most international hotels?", options: ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM"], correct: 2 },
  { id: 3, question: "In F&B service, what does 'A la carte' literally translate to?", options: ["From the menu", "Set menu", "Chef's special", "By the card"], correct: 3 }
];
