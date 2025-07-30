import React from 'react';
import { Pill, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Medication } from '@/types/onboarding';

interface AllMedicationsScreenProps {
  medications: Medication[];
  onBack: () => void;
}

const AllMedicationsScreen: React.FC<AllMedicationsScreenProps> = ({ medications, onBack }) => {
  return (
    <div className="animate-fade-in flex flex-col h-full px-6 py-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">All Medications ({medications.length})</h1>
        </div>
      </div>

      {/* Medications Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {medications.map((med, index) => (
            <div 
              key={med.id || index} 
              className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: '#F26C3A' }}>
                <Pill size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white">
                  <div className="font-semibold text-lg leading-tight">{med.name}</div>
                  <div className="flex items-center gap-2 text-sm text-white/80 mt-1">
                    <span>{med.strength}</span>
                    <span className="text-white/60">•</span>
                    <span className="capitalize">{med.form}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllMedicationsScreen;