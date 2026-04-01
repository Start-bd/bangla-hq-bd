export interface Business {
  id: string;
  slug: string;
  name_bn: string;
  name_en: string;
  tagline_bn: string;
  tagline_en: string;
  description_bn: string;
  description_en: string;
  category: string;
  category_bn: string;
  division: string;
  district: string;
  phone: string;
  email: string;
  website_url: string;
  facebook_url: string;
  logo_url: string;
  founded_year: number;
  employee_range: string;
  is_verified: boolean;
  is_claimed: boolean;
  is_featured: boolean;
  is_startup: boolean;
  rating_avg: number;
  rating_count: number;
  view_count: number;
  services: { name_bn: string; name_en: string; description: string }[];
  tags: string[];
}

export const categories = [
  { slug: "it-software", name_en: "IT & Software", name_bn: "তথ্যপ্রযুক্তি", icon: "💻", color: "blue-tech", count: 1240 },
  { slug: "healthcare", name_en: "Healthcare", name_bn: "স্বাস্থ্যসেবা", icon: "🏥", color: "green-bd", count: 890 },
  { slug: "education", name_en: "Education", name_bn: "শিক্ষা", icon: "📚", color: "violet", count: 1560 },
  { slug: "garments", name_en: "Garments & Textile", name_bn: "পোশাক শিল্প", icon: "🧵", color: "amber-glow", count: 2340 },
  { slug: "construction", name_en: "Construction", name_bn: "নির্মাণ", icon: "🏗️", color: "slate", count: 670 },
  { slug: "restaurant", name_en: "Restaurant & Food", name_bn: "রেস্তোরাঁ", icon: "🍽️", color: "red-hot", count: 3200 },
  { slug: "financial-services", name_en: "Financial Services", name_bn: "আর্থিক সেবা", icon: "🏦", color: "blue-tech", count: 450 },
  { slug: "real-estate", name_en: "Real Estate", name_bn: "রিয়েল এস্টেট", icon: "🏠", color: "amber-glow", count: 780 },
  { slug: "transport", name_en: "Transport & Logistics", name_bn: "পরিবহন", icon: "🚚", color: "green-bd", count: 520 },
  { slug: "agriculture", name_en: "Agriculture & Farming", name_bn: "কৃষি", icon: "🌾", color: "green-bd", count: 1100 },
];

export const divisions = [
  { name_en: "Dhaka", name_bn: "ঢাকা", count: 32000 },
  { name_en: "Chittagong", name_bn: "চট্টগ্রাম", count: 14500 },
  { name_en: "Rajshahi", name_bn: "রাজশাহী", count: 6200 },
  { name_en: "Khulna", name_bn: "খুলনা", count: 5800 },
  { name_en: "Barisal", name_bn: "বরিশাল", count: 3100 },
  { name_en: "Sylhet", name_bn: "সিলেট", count: 4700 },
  { name_en: "Rangpur", name_bn: "রংপুর", count: 4200 },
  { name_en: "Mymensingh", name_bn: "ময়মনসিংহ", count: 3800 },
];

export const businesses: Business[] = [
  {
    id: "1", slug: "grameenphone", name_bn: "গ্রামীণফোন", name_en: "Grameenphone",
    tagline_bn: "যোগাযোগে বাংলাদেশ", tagline_en: "Go Beyond",
    description_bn: "বাংলাদেশের বৃহত্তম টেলিকমিউনিকেশন কোম্পানি।", description_en: "Bangladesh's largest telecommunications company.",
    category: "it-software", category_bn: "তথ্যপ্রযুক্তি", division: "Dhaka", district: "Dhaka",
    phone: "+880-2-9882990", email: "info@grameenphone.com", website_url: "https://grameenphone.com",
    facebook_url: "https://facebook.com/grameenphone", logo_url: "",
    founded_year: 1997, employee_range: "200+", is_verified: true, is_claimed: true, is_featured: true,
    is_startup: false, rating_avg: 4.2, rating_count: 1850, view_count: 45000,
    services: [{ name_bn: "মোবাইল সেবা", name_en: "Mobile Services", description: "Prepaid and postpaid plans" }],
    tags: ["Telecom", "Mobile", "Internet"],
  },
  {
    id: "2", slug: "bkash", name_bn: "বিকাশ", name_en: "bKash",
    tagline_bn: "এগিয়ে যাওয়ার সঙ্গী", tagline_en: "Your Financial Companion",
    description_bn: "বাংলাদেশের শীর্ষস্থানীয় মোবাইল ফিন্যান্সিয়াল সার্ভিস।", description_en: "Bangladesh's leading mobile financial service.",
    category: "financial-services", category_bn: "আর্থিক সেবা", division: "Dhaka", district: "Dhaka",
    phone: "+880-2-16247", email: "info@bkash.com", website_url: "https://bkash.com",
    facebook_url: "https://facebook.com/bkaborohat", logo_url: "",
    founded_year: 2011, employee_range: "200+", is_verified: true, is_claimed: true, is_featured: true,
    is_startup: false, rating_avg: 4.0, rating_count: 3200, view_count: 62000,
    services: [{ name_bn: "মোবাইল ব্যাংকিং", name_en: "Mobile Banking", description: "Send and receive money" }],
    tags: ["Fintech", "Mobile Banking", "Payments"],
  },
  {
    id: "3", slug: "startbd", name_bn: "স্টার্টবিডি", name_en: "StartBD",
    tagline_bn: "বাংলাদেশের স্টার্টআপ ইকোসিস্টেম", tagline_en: "Bangladesh's Startup Ecosystem",
    description_bn: "বাংলাদেশের প্রযুক্তি স্টার্টআপ ইকোসিস্টেম গড়ে তোলা।", description_en: "Building Bangladesh's tech startup ecosystem.",
    category: "it-software", category_bn: "তথ্যপ্রযুক্তি", division: "Mymensingh", district: "Mymensingh",
    phone: "+880-1700000000", email: "hello@startbd.com", website_url: "https://startbd.com",
    facebook_url: "https://facebook.com/startbd", logo_url: "",
    founded_year: 2023, employee_range: "11-50", is_verified: true, is_claimed: true, is_featured: true,
    is_startup: true, rating_avg: 4.8, rating_count: 120, view_count: 8500,
    services: [
      { name_bn: "AI টুলস", name_en: "AI Tools", description: "AI-powered business solutions" },
      { name_bn: "SEO সেবা", name_en: "SEO Services", description: "Search engine optimization" },
    ],
    tags: ["Startup", "AI", "Technology"],
  },
  {
    id: "4", slug: "walton", name_bn: "ওয়ালটন", name_en: "Walton",
    tagline_bn: "বাংলাদেশের গর্ব", tagline_en: "Pride of Bangladesh",
    description_bn: "বাংলাদেশের বৃহত্তম ইলেকট্রনিক্স ও অটোমোবাইল প্রস্তুতকারক।", description_en: "Bangladesh's largest electronics and automobile manufacturer.",
    category: "it-software", category_bn: "তথ্যপ্রযুক্তি", division: "Dhaka", district: "Gazipur",
    phone: "+880-2-09666999999", email: "info@waltonbd.com", website_url: "https://waltonbd.com",
    facebook_url: "https://facebook.com/waltonbd", logo_url: "",
    founded_year: 1977, employee_range: "200+", is_verified: true, is_claimed: true, is_featured: true,
    is_startup: false, rating_avg: 4.3, rating_count: 2100, view_count: 38000,
    services: [{ name_bn: "ইলেকট্রনিক্স", name_en: "Electronics", description: "Consumer electronics" }],
    tags: ["Electronics", "Manufacturing", "Automobile"],
  },
  {
    id: "5", slug: "square-group", name_bn: "স্কয়ার গ্রুপ", name_en: "Square Group",
    tagline_bn: "জীবনের জন্য", tagline_en: "For Life",
    description_bn: "বাংলাদেশের অন্যতম বৃহৎ শিল্প গোষ্ঠী।", description_en: "One of the largest conglomerates in Bangladesh.",
    category: "healthcare", category_bn: "স্বাস্থ্যসেবা", division: "Dhaka", district: "Dhaka",
    phone: "+880-2-8833047", email: "info@squaregroup.com", website_url: "https://squaregroup.com",
    facebook_url: "https://facebook.com/squarepharma", logo_url: "",
    founded_year: 1958, employee_range: "200+", is_verified: true, is_claimed: true, is_featured: true,
    is_startup: false, rating_avg: 4.5, rating_count: 980, view_count: 28000,
    services: [{ name_bn: "ফার্মাসিউটিক্যালস", name_en: "Pharmaceuticals", description: "Medicine manufacturing" }],
    tags: ["Pharma", "Healthcare", "Consumer Goods"],
  },
  {
    id: "6", slug: "banglaseo", name_bn: "বাংলাSEO", name_en: "BanglaSEO",
    tagline_bn: "বাংলাদেশের SEO টুল", tagline_en: "SEO Tools for Bangladesh",
    description_bn: "বাংলাদেশের ব্যবসার জন্য SEO টুল এবং মার্কেটিং সমাধান।", description_en: "SEO tools and marketing solutions for Bangladeshi businesses.",
    category: "it-software", category_bn: "তথ্যপ্রযুক্তি", division: "Mymensingh", district: "Mymensingh",
    phone: "+880-1700000001", email: "hello@banglaseo.com", website_url: "https://banglaseo.com",
    facebook_url: "", logo_url: "",
    founded_year: 2024, employee_range: "1-10", is_verified: true, is_claimed: true, is_featured: false,
    is_startup: true, rating_avg: 4.6, rating_count: 45, view_count: 3200,
    services: [{ name_bn: "SEO অডিট", name_en: "SEO Audit", description: "Complete website SEO analysis" }],
    tags: ["SEO", "Marketing", "Digital"],
  },
  {
    id: "7", slug: "robi-axiata", name_bn: "রবি আজিয়াটা", name_en: "Robi Axiata",
    tagline_bn: "জয় হোক", tagline_en: "Joy of Life",
    description_bn: "বাংলাদেশের দ্বিতীয় বৃহত্তম মোবাইল অপারেটর।", description_en: "Second largest mobile operator in Bangladesh.",
    category: "it-software", category_bn: "তথ্যপ্রযুক্তি", division: "Dhaka", district: "Dhaka",
    phone: "+880-2-16222", email: "info@robi.com.bd", website_url: "https://robi.com.bd",
    facebook_url: "https://facebook.com/roaborohat", logo_url: "",
    founded_year: 1997, employee_range: "200+", is_verified: true, is_claimed: true, is_featured: false,
    is_startup: false, rating_avg: 3.9, rating_count: 1420, view_count: 31000,
    services: [{ name_bn: "মোবাইল সেবা", name_en: "Mobile Services", description: "Mobile connectivity" }],
    tags: ["Telecom", "Mobile", "Internet"],
  },
  {
    id: "8", slug: "aci-limited", name_bn: "এসিআই লিমিটেড", name_en: "ACI Limited",
    tagline_bn: "গুণমানের প্রতিশ্রুতি", tagline_en: "Commitment to Quality",
    description_bn: "কৃষি, ফার্মাসিউটিক্যালস ও ভোগ্যপণ্যের শীর্ষ কোম্পানি।", description_en: "Leading company in agriculture, pharmaceuticals, and consumer goods.",
    category: "agriculture", category_bn: "কৃষি", division: "Dhaka", district: "Dhaka",
    phone: "+880-2-8837222", email: "info@aci-bd.com", website_url: "https://aci-bd.com",
    facebook_url: "https://facebook.com/ACILimited", logo_url: "",
    founded_year: 1968, employee_range: "200+", is_verified: true, is_claimed: true, is_featured: false,
    is_startup: false, rating_avg: 4.1, rating_count: 560, view_count: 19000,
    services: [{ name_bn: "কৃষি পণ্য", name_en: "Agricultural Products", description: "Seeds, fertilizers, pesticides" }],
    tags: ["Agriculture", "Pharma", "Consumer"],
  },
  {
    id: "9", slug: "interiorofai", name_bn: "ইন্টেরিয়রঅফএআই", name_en: "InteriorOfAI",
    tagline_bn: "AI দিয়ে ইন্টেরিয়র ডিজাইন", tagline_en: "AI-Powered Interior Design",
    description_bn: "কৃত্রিম বুদ্ধিমত্তা দিয়ে ইন্টেরিয়র ডিজাইন করুন।", description_en: "Transform your spaces with AI-powered interior design.",
    category: "it-software", category_bn: "তথ্যপ্রযুক্তি", division: "Mymensingh", district: "Mymensingh",
    phone: "+880-1700000002", email: "hello@interiorofai.com", website_url: "https://interiorofai.com",
    facebook_url: "", logo_url: "",
    founded_year: 2024, employee_range: "1-10", is_verified: true, is_claimed: true, is_featured: false,
    is_startup: true, rating_avg: 4.7, rating_count: 32, view_count: 2100,
    services: [{ name_bn: "AI ইন্টেরিয়র", name_en: "AI Interior Design", description: "AI-generated room designs" }],
    tags: ["AI", "Interior Design", "SaaS"],
  },
  {
    id: "10", slug: "meetbd", name_bn: "মিটবিডি", name_en: "MeetBD",
    tagline_bn: "AI চরিত্রের সাথে কথা বলুন", tagline_en: "Chat with AI Characters",
    description_bn: "বাংলাদেশের প্রথম AI চরিত্র প্ল্যাটফর্ম।", description_en: "Bangladesh's first AI character platform.",
    category: "it-software", category_bn: "তথ্যপ্রযুক্তি", division: "Mymensingh", district: "Mymensingh",
    phone: "+880-1700000003", email: "hello@meetbd.com", website_url: "https://meetbd.com",
    facebook_url: "", logo_url: "",
    founded_year: 2024, employee_range: "1-10", is_verified: true, is_claimed: true, is_featured: false,
    is_startup: true, rating_avg: 4.5, rating_count: 67, view_count: 4300,
    services: [{ name_bn: "AI চ্যাটবট", name_en: "AI Chatbot", description: "Custom AI characters" }],
    tags: ["AI", "Chatbot", "Entertainment"],
  },
  {
    id: "11", slug: "pathao", name_bn: "পাঠাও", name_en: "Pathao",
    tagline_bn: "শহরের সব সেবা", tagline_en: "Rides, Food & More",
    description_bn: "বাংলাদেশের সবচেয়ে জনপ্রিয় রাইড শেয়ারিং ও ডেলিভারি প্ল্যাটফর্ম।", description_en: "Bangladesh's most popular ride-sharing and delivery platform.",
    category: "transport", category_bn: "পরিবহন", division: "Dhaka", district: "Dhaka",
    phone: "+880-9612-016016", email: "support@pathao.com", website_url: "https://pathao.com",
    facebook_url: "https://facebook.com/pathao", logo_url: "",
    founded_year: 2015, employee_range: "200+", is_verified: true, is_claimed: true, is_featured: true,
    is_startup: false, rating_avg: 3.8, rating_count: 5200, view_count: 72000,
    services: [
      { name_bn: "রাইড শেয়ারিং", name_en: "Ride Sharing", description: "Bike and car rides" },
      { name_bn: "ফুড ডেলিভারি", name_en: "Food Delivery", description: "Restaurant food delivery" },
    ],
    tags: ["Ride Sharing", "Food Delivery", "Logistics"],
  },
  {
    id: "12", slug: "daraz-bd", name_bn: "দারাজ", name_en: "Daraz Bangladesh",
    tagline_bn: "অনলাইনে কেনাকাটা", tagline_en: "Online Shopping Made Easy",
    description_bn: "বাংলাদেশের বৃহত্তম ই-কমার্স মার্কেটপ্লেস।", description_en: "Bangladesh's largest e-commerce marketplace.",
    category: "it-software", category_bn: "তথ্যপ্রযুক্তি", division: "Dhaka", district: "Dhaka",
    phone: "+880-9612-016016", email: "support@daraz.com.bd", website_url: "https://daraz.com.bd",
    facebook_url: "https://facebook.com/daaborohat", logo_url: "",
    founded_year: 2015, employee_range: "200+", is_verified: true, is_claimed: true, is_featured: false,
    is_startup: false, rating_avg: 3.5, rating_count: 8900, view_count: 95000,
    services: [{ name_bn: "ই-কমার্স", name_en: "E-Commerce", description: "Online marketplace" }],
    tags: ["E-Commerce", "Marketplace", "Retail"],
  },
];

export const ecosystemTools = [
  { name: "BanglaSEO", name_bn: "বাংলাSEO", tagline: "Rank higher on Google", slug: "banglaseo", url: "https://banglaseo.com", category: "SEO টুল" },
  { name: "WorkersBD", name_bn: "ওয়ার্কার্সবিডি", tagline: "Hire from 64 districts", slug: "workersbd", url: "https://workersbd.com", category: "কর্মী নিয়োগ" },
  { name: "BdAiHub", name_bn: "বিডিএআইহাব", tagline: "Join AI community", slug: "bdaihub", url: "https://bdaihub.com", category: "AI কমিউনিটি" },
  { name: "MeetBD", name_bn: "মিটবিডি", tagline: "AI for your customers", slug: "meetbd", url: "https://meetbd.com", category: "AI চরিত্র" },
];
