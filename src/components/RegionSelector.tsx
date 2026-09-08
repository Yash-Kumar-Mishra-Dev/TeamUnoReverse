import React, { useState } from 'react';
import { MapPin, Compass } from 'lucide-react';

export const STATE_DISTRICT_MAP: Record<string, string[]> = {
  'Assam': [
    'Kamrup Metropolitan (Guwahati)',
    'Cachar (Silchar)',
    'Dhubri',
    'Dibrugarh',
    'Nagaon',
    'Jorhat',
    'Sonitpur (Tezpur)'
  ],
  'Delhi (NCT)': [
    'North East Delhi (Yamuna Basin)',
    'East Delhi (Mayur Vihar)',
    'Central Delhi',
    'South Delhi (Okhla)',
    'North West Delhi'
  ],
  'Bihar': [
    'Patna',
    'Muzaffarpur',
    'Bhagalpur',
    'Darbhanga',
    'Gaya'
  ],
  'West Bengal': [
    'Kolkata',
    'Howrah',
    'North 24 Parganas',
    'South 24 Parganas',
    'Darjeeling'
  ],
  'Odisha': [
    'Cuttack (Mahanadi Sector)',
    'Bhubaneswar',
    'Puri Coastal',
    'Balasore'
  ],
  'Kerala': [
    'Wayanad',
    'Ernakulam (Kochi)',
    'Thiruvananthapuram',
    'Alappuzha'
  ],
  'Maharashtra': [
    'Mumbai City',
    'Thane (Ulhas Basin)',
    'Pune',
    'Nagpur'
  ],
  'Uttar Pradesh': [
    'Varanasi (Ganga Basin)',
    'Prayagraj',
    'Gorakhpur',
    'Lucknow'
  ]
};

interface RegionSelectorProps {
  onRegionChange?: (state: string, district: string) => void;
  className?: string;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({ onRegionChange, className = '' }) => {
  const [selectedState, setSelectedState] = useState<string>('Assam');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Kamrup Metropolitan (Guwahati)');

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const districts = STATE_DISTRICT_MAP[newState] || [];
    const firstDist = districts[0] || '';
    setSelectedDistrict(firstDist);
    if (onRegionChange) {
      onRegionChange(newState, firstDist);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDistrict = e.target.value;
    setSelectedDistrict(newDistrict);
    if (onRegionChange) {
      onRegionChange(selectedState, newDistrict);
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-5 bg-white/95 px-4 py-2 rounded-xl border border-slate-200/90 shadow-2xs text-xs font-sans ${className}`}>
      {/* State Selector */}
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-rose-600 stroke-[2.2] flex-shrink-0" />
        <span className="text-rose-600 font-bold text-xs tracking-tight">State:</span>
        <select
          value={selectedState}
          onChange={handleStateChange}
          className="px-4 py-1.5 bg-[#F8FAFC] border border-slate-200/90 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30 cursor-pointer shadow-2xs hover:bg-slate-100/90 transition-colors"
        >
          {Object.keys(STATE_DISTRICT_MAP).map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* District / City Selector */}
      <div className="flex items-center gap-2">
        <Compass className="w-4 h-4 text-blue-600 stroke-[2.2] flex-shrink-0" />
        <span className="text-blue-600 font-bold text-xs tracking-tight">District / City:</span>
        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          className="px-4 py-1.5 bg-[#F8FAFC] border border-slate-200/90 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer shadow-2xs hover:bg-slate-100/90 transition-colors"
        >
          {(STATE_DISTRICT_MAP[selectedState] || []).map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
