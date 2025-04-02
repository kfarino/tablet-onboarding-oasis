
import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';
import { format } from 'date-fns';

const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black text-white py-3 px-6 flex justify-between items-center relative">
      <div className="text-2xl font-medium">
        {format(currentTime, 'EEE, MMM d')}
      </div>
      <div className="text-2xl font-medium absolute left-1/2 transform -translate-x-1/2">
        {format(currentTime, 'h:mm a')}
      </div>
      <div>
        <Wifi size={24} />
      </div>
    </div>
  );
};

export default Header;
