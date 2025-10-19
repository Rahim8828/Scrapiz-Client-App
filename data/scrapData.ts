// Single source of truth for all scrap data
export interface ScrapItem {
  name: string;
  rate: string;
  image: number;
  description: string;
  minRate: number; // for calculations
  maxRate: number; // for calculations
}

export interface ScrapCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  bgColor: string;
  items: ScrapItem[];
}

export const scrapData: ScrapCategory[] = [
  {
    id: 'metal',
    title: 'Types of Metal Scrap',
    icon: '🔩',
    color: '#16a34a',
    bgColor: '#16a34a',
    items: [
      { name: 'Iron', rate: '₹20-30', image: require('../assets/images/Scrap Rates Photos/Iron.jpg'), description: 'Scrap iron, steel parts', minRate: 30, maxRate: 35 },
      { name: 'Tin', rate: '₹15-25', image: require('../assets/images/Scrap Rates Photos/Tin.jpg'), description: 'Tin cans, containers', minRate: 25, maxRate: 30 },
      { name: 'Steel', rate: '₹45-50', image: require('../assets/images/Scrap Rates Photos/Steel.jpg'), description: 'Steel utensils, parts', minRate: 45, maxRate: 50 },
      { name: 'Aluminum', rate: '₹150-180', image: require('../assets/images/Scrap Rates Photos/Aluminium.jpg'), description: 'Aluminum sheets, cans', minRate: 150, maxRate: 180 },
      { name: 'Brass', rate: '₹450-500', image: require('../assets/images/Scrap Rates Photos/Brass.jpg'), description: 'Brass fittings, decorative items', minRate: 600, maxRate: 680 },
      { name: 'Copper', rate: '₹600-680', image: require('../assets/images/Scrap Rates Photos/Copper.jpg'), description: 'Copper wires, pipes', minRate: 600, maxRate: 680 },
    ]
  },
  {
    id: 'electronics',
    title: 'Types of Electronic Scrap',
    icon: '💻',
    color: '#16a34a',
    bgColor: '#16a34a',
    items: [
      { name: 'Fridge', rate: '₹100-500', image: require('../assets/images/Scrap Rates Photos/fridge.jpg'), description: 'Single and double door fridges', minRate: 100, maxRate: 500 },
      { name: 'Top Load Washing Machine', rate: '₹100-500', image: require('../assets/images/Scrap Rates Photos/Top Load Machine.jpg'), description: 'Top load washing machines', minRate: 100, maxRate: 500 },
      { name: 'Front Load Washing Machine', rate: '₹100-500', image: require('../assets/images/Scrap Rates Photos/Front Load Machine.jpg'), description: 'Front load washing machines', minRate: 100, maxRate: 500 },
      { name: 'Split AC', rate: '₹2000-4000', image: require('../assets/images/Scrap Rates Photos/Split AC.jpg'), description: '1 Ton, 1.5 Ton, 2 Ton', minRate: 2000, maxRate: 4000 },
      { name: 'Window AC', rate: '₹1500-3500', image: require('../assets/images/Scrap Rates Photos/Window AC.jpg'), description: '1 Ton, 1.5 Ton, 2 Ton', minRate: 1500, maxRate: 3500 },
      { name: 'Laptops', rate: '₹500-2000', image: require('../assets/images/Scrap Rates Photos/Laptops.jpg'), description: 'Old laptops, computers', minRate: 500, maxRate: 2000 },
      { name: 'TV/Monitor', rate: '₹200-800', image: require('../assets/images/Scrap Rates Photos/TV.jpg'), description: 'CRT/LCD screens', minRate: 200, maxRate: 800 },
      { name: 'Cables & Wires', rate: '₹50-150', image: require('../assets/images/Scrap Rates Photos/Wire.jpg'), description: 'Electronic cables', minRate: 50, maxRate: 150 },
      { name: 'Printer', rate: '₹300-600', image: require('../assets/images/Scrap Rates Photos/Printer.jpg'), description: 'Inkjet, Laserjet', minRate: 300, maxRate: 600 },
      { name: 'Microwave', rate: '₹200-400', image: require('../assets/images/Scrap Rates Photos/Microwave.jpg'), description: 'Solo, Grill, Convection', minRate: 200, maxRate: 400 },
      { name: 'Batteries', rate: '₹80-200', image: require('../assets/images/Scrap Rates Photos/Battery.jpg'), description: 'Lead acid, lithium', minRate: 80, maxRate: 200 },
    ]
  },
  {
    id: 'paper',
    title: 'Types of Paper Scrap',
    icon: '📰',
    color: '#16a34a',
    bgColor: '#16a34a',
    items: [
      { name: 'Books', rate: '₹10-12', image: require('../assets/images/Scrap Rates Photos/Book.jpg'), description: 'Old books, notebooks', minRate: 10, maxRate: 12 },
      { name: 'Cardboard Boxes', rate: '₹10-12', image: require('../assets/images/Scrap Rates Photos/Cardboard.jpg'), description: 'Corrugated boxes', minRate: 10, maxRate: 12 },
      { name: 'Office Paper', rate: '₹10-14', image: require('../assets/images/Scrap Rates Photos/White Paper.jpg'), description: 'White office paper', minRate: 10, maxRate: 14 },
      { name: 'Newspaper', rate: '₹12-15', image: require('../assets/images/Scrap Rates Photos/Newspaper.jpg'), description: 'Daily newspapers', minRate: 12, maxRate: 15 },
    ]
  },
  {
    id: 'plastic',
    title: 'Types of Plastic Scrap',
    icon: '♻️',
    color: '#16a34a',
    bgColor: '#16a34a',
    items: [
      { name: 'Plastics', rate: '₹40-50', image: require('../assets/images/Scrap Rates Photos/Plastics.jpg'), description: 'Large plastic drums', minRate: 40, maxRate: 50 },
      { name: 'PVC Pipes', rate: '₹10-15', image: require('../assets/images/Scrap Rates Photos/PVC Pipes.jpg'), description: 'PVC pipes, fittings', minRate: 10, maxRate: 15 },
    ]
  }
];

// Helper function to get category by ID
export const getCategoryById = (id: string): ScrapCategory | undefined => {
  return scrapData.find(category => category.id === id);
};

// Helper function to get all items across categories
export const getAllItems = (): (ScrapItem & { categoryId: string; categoryColor: string })[] => {
  return scrapData.flatMap(category => 
    category.items.map(item => ({
      ...item,
      categoryId: category.id,
      categoryColor: category.color
    }))
  );
};

// Helper function to get average rate for calculations
export const getAverageRate = (item: ScrapItem): number => {
  return Math.round((item.minRate + item.maxRate) / 2);
};
