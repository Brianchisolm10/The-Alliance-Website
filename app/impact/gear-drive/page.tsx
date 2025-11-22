'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicLayout } from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Package, Plus, X } from 'lucide-react';

interface GearItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  description: string;
}

const GEAR_CATEGORIES = [
  'Fitness Equipment',
  'Athletic Apparel',
  'Sports Gear',
  'Yoga/Pilates',
  'Weights/Resistance',
  'Cardio Equipment',
  'Recovery Tools',
  'Other',
];

const CONDITION_OPTIONS = [
  { value: 'new', label: 'New - Never used' },
  { value: 'like-new', label: 'Like New - Gently used' },
  { value: 'good', label: 'Good - Some wear but fully functional' },
  { value: 'fair', label: 'Fair - Shows wear but still usable' },
];

const PREFERENCE_OPTIONS = [
  { value: 'pickup', label: 'I can drop off the items' },
  { value: 'dropoff', label: 'Please arrange pickup' },
  { value: 'flexible', label: 'Either option works for me' },
];

export default function GearDrivePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [items, setItems] = useState<GearItem[]>([
    { id: '1', name: '', category: '', quantity: 1, description: '' },
  ]);
  const [condition, setCondition] = useState('');
  const [preference, setPreference] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: '',
        category: '',
        quantity: 1,
        description: '',
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof GearItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name || !email || !condition || !preference) {
      setError('Please fill in all required fields');
      return;
    }

    const validItems = items.filter(
      (item) => item.name && item.category && item.quantity > 0
    );

    if (validItems.length === 0) {
      setError('Please add at least one item');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/gear-drive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          items: validItems,
          condition,
          preference,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit donation');
      }

      // Redirect to confirmation page
      router.push('/impact/gear-drive/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gear Drive Donation
          </h1>
          <p className="text-lg text-gray-600">
            Donate gently used athletic gear and equipment to support our community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Items */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Items to Donate
              </h2>
              <Button
                type="button"
                onClick={addItem}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 relative"
                >
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`item-name-${item.id}`}>
                        Item Name *
                      </Label>
                      <Input
                        id={`item-name-${item.id}`}
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(item.id, 'name', e.target.value)
                        }
                        placeholder="e.g., Yoga Mat, Dumbbells"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`item-category-${item.id}`}>
                        Category *
                      </Label>
                      <select
                        id={`item-category-${item.id}`}
                        value={item.category}
                        onChange={(e) =>
                          updateItem(item.id, 'category', e.target.value)
                        }
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select category</option>
                        {GEAR_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor={`item-quantity-${item.id}`}>
                        Quantity *
                      </Label>
                      <Input
                        id={`item-quantity-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)
                        }
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`item-description-${item.id}`}>
                        Description (Optional)
                      </Label>
                      <Input
                        id={`item-description-${item.id}`}
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, 'description', e.target.value)
                        }
                        placeholder="Size, color, brand, etc."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Condition */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Overall Condition *
            </h2>
            <div className="space-y-2">
              {CONDITION_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="condition"
                    value={option.value}
                    checked={condition === option.value}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Preference */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pickup or Dropoff Preference *
            </h2>
            <div className="space-y-2">
              {PREFERENCE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="preference"
                    value={option.value}
                    checked={preference === option.value}
                    onChange={(e) => setPreference(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Additional Notes */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Notes (Optional)
            </h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about your donation, preferred pickup times, special instructions, etc."
              rows={4}
            />
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
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Donation'
            )}
          </Button>

          <p className="text-sm text-gray-600 text-center">
            We&apos;ll contact you within 2-3 business days to coordinate pickup or dropoff.
          </p>
        </form>
        </div>
      </div>
    </PublicLayout>
  );
}
