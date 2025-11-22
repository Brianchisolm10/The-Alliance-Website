'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const IMPACT_AREAS = [
  { id: 'foundations', name: 'Foundations', description: 'Core wellness education and resources' },
  { id: 'equipment', name: 'Equipment', description: 'Fitness equipment for underserved communities' },
  { id: 'gear-drive', name: 'Gear Drive', description: 'Athletic gear distribution programs' },
  { id: 'sponsorship', name: 'Sponsorship', description: 'Sponsor clients who cannot afford services' },
];

const PRESET_AMOUNTS = [5, 10, 25, 50];

interface DonationAllocationProps {
  onDonationChange: (amount: number, area: string) => void;
}

export function DonationAllocation({ onDonationChange }: DonationAllocationProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const handlePresetAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    onDonationChange(amount * 100, selectedArea); // Convert to cents
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    const amount = parseFloat(value) || 0;
    onDonationChange(Math.round(amount * 100), selectedArea); // Convert to cents
  };

  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
    const amount = selectedAmount || parseFloat(customAmount) || 0;
    onDonationChange(Math.round(amount * 100), area);
  };

  return (
    <div className="space-y-4">
      {/* Preset Amounts */}
      <div>
        <Label className="mb-2 block">Select Amount</Label>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handlePresetAmount(amount)}
              className={`px-4 py-2 rounded-md border-2 font-medium transition-colors ${
                selectedAmount === amount
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount */}
      <div>
        <Label htmlFor="custom-amount">Or Enter Custom Amount</Label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            $
          </span>
          <Input
            id="custom-amount"
            type="number"
            min="0"
            step="0.01"
            value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            placeholder="0.00"
            className="pl-7"
          />
        </div>
      </div>

      {/* Impact Area Selection */}
      {(selectedAmount || customAmount) && (
        <div>
          <Label className="mb-2 block">Choose Impact Area (Optional)</Label>
          <div className="space-y-2">
            {IMPACT_AREAS.map((area) => (
              <label
                key={area.id}
                className={`flex items-start p-3 rounded-md border-2 cursor-pointer transition-colors ${
                  selectedArea === area.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="impact-area"
                  value={area.id}
                  checked={selectedArea === area.id}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="mt-1 mr-3"
                />
                <div>
                  <p className="font-medium text-gray-900">{area.name}</p>
                  <p className="text-sm text-gray-600">{area.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {(selectedAmount || customAmount) && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Thank you!</span> Your donation of{' '}
            <span className="font-semibold">
              ${selectedAmount || parseFloat(customAmount || '0').toFixed(2)}
            </span>
            {selectedArea && (
              <>
                {' '}to{' '}
                <span className="font-semibold">
                  {IMPACT_AREAS.find((a) => a.id === selectedArea)?.name}
                </span>
              </>
            )}{' '}
            will help make wellness accessible to all.
          </p>
        </div>
      )}
    </div>
  );
}
