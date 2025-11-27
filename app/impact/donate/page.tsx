'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PublicLayout } from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Heart, Package, Users, Award } from 'lucide-react';

const PRESET_AMOUNTS = [25, 50, 100, 250];

const IMPACT_AREAS = [
  { id: 'foundations', name: 'Foundations', icon: Heart },
  { id: 'equipment', name: 'Equipment', icon: Package },
  { id: 'sponsorship', name: 'Sponsorship', icon: Award },
  { id: 'general', name: 'Where Needed Most', icon: Users },
];

function DonatePageContent() {
  const searchParams = useSearchParams();
  const preselectedArea = searchParams.get('area');

  const [email, setEmail] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [allocation, setAllocation] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize allocation based on preselected area
  useEffect(() => {
    if (preselectedArea && IMPACT_AREAS.find(a => a.id === preselectedArea)) {
      setAllocation({ [preselectedArea]: 100 });
    } else {
      setAllocation({ general: 100 });
    }
  }, [preselectedArea]);

  const donationAmount = customAmount 
    ? Math.round(parseFloat(customAmount) * 100) 
    : (selectedAmount || 0) * 100;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleAllocationChange = (areaId: string, percentage: number) => {
    const newAllocation = { ...allocation };
    
    // If setting to 100%, clear others
    if (percentage === 100) {
      Object.keys(newAllocation).forEach(key => {
        newAllocation[key] = key === areaId ? 100 : 0;
      });
    } else {
      newAllocation[areaId] = percentage;
      
      // Normalize to ensure total is 100%
      const total = Object.values(newAllocation).reduce((sum, val) => sum + val, 0);
      if (total > 0) {
        Object.keys(newAllocation).forEach(key => {
          newAllocation[key] = Math.round((newAllocation[key] / total) * 100);
        });
      }
    }
    
    setAllocation(newAllocation);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (donationAmount < 100) {
      setError('Minimum donation amount is $1.00');
      return;
    }

    const totalAllocation = Object.values(allocation).reduce((sum, val) => sum + val, 0);
    if (totalAllocation !== 100) {
      setError('Allocation must total 100%');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: donationAmount,
          allocation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process donation');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Make a Donation
          </h1>
          <p className="text-lg text-gray-600">
            Support AFYA&apos;s mission to make wellness accessible to everyone
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="mt-1"
              />
              <p className="text-sm text-gray-600 mt-1">
                We&apos;ll send your tax receipt to this email
              </p>
            </div>
          </Card>

          {/* Donation Amount */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Donation Amount
            </h2>
            
            {/* Preset Amounts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {PRESET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleAmountSelect(amount)}
                  className={`py-3 px-4 rounded-lg border-2 font-semibold transition-colors ${
                    selectedAmount === amount
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div>
              <Label htmlFor="customAmount">Custom Amount</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="customAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="Enter amount"
                  className="pl-7"
                />
              </div>
            </div>

            {donationAmount > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Your donation:</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${(donationAmount / 100).toFixed(2)}
                </p>
              </div>
            )}
          </Card>

          {/* Allocation */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Allocate Your Donation
            </h2>
            <p className="text-gray-600 mb-4">
              Choose how you&apos;d like your donation to be used. You can support one area
              or split your donation across multiple areas.
            </p>

            <div className="space-y-4">
              {IMPACT_AREAS.map((area) => {
                const Icon = area.icon;
                const percentage = allocation[area.id] || 0;
                
                return (
                  <div key={area.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{area.name}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAllocationChange(area.id, 100)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          percentage === 100
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        100%
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={percentage}
                        onChange={(e) => handleAllocationChange(area.id, parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12 text-right">
                        {percentage}%
                      </span>
                    </div>
                    
                    {percentage > 0 && donationAmount > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        ${((donationAmount * percentage) / 10000).toFixed(2)} to {area.name}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Allocation:</span>
                <span className={`font-bold ${
                  Object.values(allocation).reduce((sum, val) => sum + val, 0) === 100
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {Object.values(allocation).reduce((sum, val) => sum + val, 0)}%
                </span>
              </div>
            </div>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || donationAmount < 100}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="mr-2" />
                Processing...
              </>
            ) : (
              `Donate ${donationAmount > 0 ? `$${(donationAmount / 100).toFixed(2)}` : ''}`
            )}
          </Button>

          <p className="text-sm text-gray-600 text-center">
            You will be redirected to Stripe for secure payment processing.
            Your donation is tax-deductible.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <PublicLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
        <DonatePageContent />
      </Suspense>
    </PublicLayout>
  );
}
