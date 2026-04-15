'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CheckoutButtonProps {
  planId: string;
  label?: string;
  className?: string;
  caseType?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function CheckoutButton({
  planId,
  label = 'Get Started',
  className = '',
  caseType = '',
  variant = 'primary',
  size = 'lg',
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          caseType,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Checkout error:', err);
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="space-y-2">
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={handleCheckout}
          isLoading={isLoading}
        >
          {label}
        </Button>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleCheckout}
      isLoading={isLoading}
    >
      {label}
    </Button>
  );
}
