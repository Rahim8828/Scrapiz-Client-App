// Service availability configuration for different cities

export interface ServiceCity {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  radius: number; // in kilometers
  pinCodes?: string[];
}

export interface ComingSoonCity {
  name: string;
  state: string;
  expectedLaunch: string;
}

export const SERVICE_CITIES = {
  available: [
    {
      name: 'Mumbai',
      state: 'Maharashtra',
      latitude: 19.0760,
      longitude: 72.8777,
      radius: 50, // 50 km radius from city center
      pinCodes: [
        '400001', '400002', '400003', '400004', '400005',
        '400006', '400007', '400008', '400009', '400010',
        '400011', '400012', '400013', '400014', '400015',
        '400016', '400017', '400018', '400019', '400020',
        '400021', '400022', '400023', '400024', '400025',
        '400026', '400027', '400028', '400029', '400030',
        '400031', '400032', '400033', '400034', '400035',
        '400049', '400050', '400051', '400052', '400053',
        '400054', '400055', '400056', '400057', '400058',
        '400059', '400060', '400061', '400062', '400063',
        '400064', '400065', '400066', '400067', '400068',
        '400069', '400070', '400071', '400072', '400074',
        '400075', '400076', '400077', '400078', '400079',
        '400080', '400081', '400082', '400083', '400084',
        '400085', '400086', '400087', '400088', '400089',
        '400090', '400091', '400092', '400093', '400094',
        '400095', '400096', '400097', '400098', '400099',
        '400101', '400102', '400103', '400104', '400105'
      ]
    }
  ] as ServiceCity[],
  
  comingSoon: [
    {
      name: 'Pune',
      state: 'Maharashtra',
      expectedLaunch: 'Q2 2025'
    },
    {
      name: 'Thane',
      state: 'Maharashtra',
      expectedLaunch: 'Q2 2025'
    },
    {
      name: 'Navi Mumbai',
      state: 'Maharashtra',
      expectedLaunch: 'Q2 2025'
    },
    {
      name: 'Delhi',
      state: 'Delhi',
      expectedLaunch: 'Q3 2025'
    },
    {
      name: 'Bangalore',
      state: 'Karnataka',
      expectedLaunch: 'Q3 2025'
    },
    {
      name: 'Hyderabad',
      state: 'Telangana',
      expectedLaunch: 'Q4 2025'
    },
    {
      name: 'Chennai',
      state: 'Tamil Nadu',
      expectedLaunch: 'Q4 2025'
    }
  ] as ComingSoonCity[]
};

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Check if a location is within service area
export function isLocationServiceable(
  latitude: number,
  longitude: number
): boolean {
  return SERVICE_CITIES.available.some(city => {
    const distance = calculateDistance(
      latitude,
      longitude,
      city.latitude,
      city.longitude
    );
    return distance <= city.radius;
  });
}

// Get service city name from coordinates
export function getServiceCityFromLocation(
  latitude: number,
  longitude: number
): string | null {
  const serviceableCity = SERVICE_CITIES.available.find(city => {
    const distance = calculateDistance(
      latitude,
      longitude,
      city.latitude,
      city.longitude
    );
    return distance <= city.radius;
  });
  
  return serviceableCity ? serviceableCity.name : null;
}

// Check if a city name is serviceable
export function isCityServiceable(cityName: string): boolean {
  return SERVICE_CITIES.available.some(
    city => city.name.toLowerCase() === cityName.toLowerCase()
  );
}

// Get coming soon city info
export function getComingSoonCityInfo(cityName: string): ComingSoonCity | null {
  return SERVICE_CITIES.comingSoon.find(
    city => city.name.toLowerCase() === cityName.toLowerCase()
  ) || null;
}
