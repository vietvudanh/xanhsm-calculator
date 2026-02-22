/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, Info, Calculator, MapPin, CheckCircle2 } from 'lucide-react';

type CarType = 'standard' | 'premium';

interface PricingTier {
  opening: number; // 0-2km
  tier1: number;   // 2-12km
  tier2: number;   // 12-25km
  tier3: number;   // 25km+
}

const PRICING: Record<CarType, PricingTier> = {
  standard: {
    opening: 30500,
    tier1: 14700,
    tier2: 13800,
    tier3: 11900,
  },
  premium: {
    opening: 34400,
    tier1: 16000,
    tier2: 14900,
    tier3: 12900,
  },
};

export default function App() {
  const [distance, setDistance] = useState<string>('1');
  const [carType, setCarType] = useState<CarType>('standard');

  const calculatePrice = (d: number, type: CarType) => {
    const pricing = PRICING[type];
    if (d <= 0) return 0;
    if (d <= 2) return pricing.opening;
    
    let total = pricing.opening;
    
    // 2km to 12km
    const tier1Dist = Math.min(Math.max(0, d - 2), 10);
    total += tier1Dist * pricing.tier1;
    
    // 12km to 25km
    const tier2Dist = Math.min(Math.max(0, d - 12), 13);
    total += tier2Dist * pricing.tier2;
    
    // 25km+
    const tier3Dist = Math.max(0, d - 25);
    total += tier3Dist * pricing.tier3;
    
    return total;
  };

  const totalPrice = useMemo(() => {
    const d = parseFloat(distance) || 0;
    return calculatePrice(d, carType);
  }, [distance, carType]);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-slate-900 p-4 md:p-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#005a4b] p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold tracking-tight mb-1">XanhSM Calculator</h1>
            <p className="text-emerald-100/80 text-sm">Hanoi Taxi Fare Estimator</p>
          </div>
          <Car className="absolute -right-4 -bottom-4 w-32 h-32 text-emerald-400/10 rotate-12" />
        </div>

        <div className="p-8 space-y-8">
          {/* Car Type Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Car className="w-3 h-3" /> Vehicle Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCarType('standard')}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                  carType === 'standard' 
                    ? 'border-[#005a4b] bg-emerald-50/50' 
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="font-bold text-sm">Xanh SM Car</div>
                <div className="text-xs text-slate-500 mt-1">Standard Electric</div>
                {carType === 'standard' && (
                  <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-[#005a4b]" />
                )}
              </button>
              <button
                onClick={() => setCarType('premium')}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                  carType === 'premium' 
                    ? 'border-[#005a4b] bg-emerald-50/50' 
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="font-bold text-sm">Xanh SM Premium</div>
                <div className="text-xs text-slate-500 mt-1">Luxury Experience</div>
                {carType === 'premium' && (
                  <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-[#005a4b]" />
                )}
              </button>
            </div>
          </div>

          {/* Distance Input */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Distance (km)
            </label>
            <div className="relative">
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full p-4 pr-16 bg-slate-50 border-2 border-transparent focus:border-[#005a4b] focus:bg-white rounded-2xl outline-none transition-all text-xl font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none">km</div>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-xs font-medium text-emerald-400 uppercase tracking-widest mb-1">Estimated Fare</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={totalPrice}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-3xl font-bold tracking-tight"
                >
                  {formatVND(totalPrice)}
                </motion.div>
              </AnimatePresence>
            </div>
            <Calculator className="absolute -right-2 -bottom-2 w-16 h-16 text-white/5" />
          </div>

          {/* Pricing Breakdown Info */}
          <div className="bg-emerald-50 rounded-xl p-4 flex gap-3 items-start">
            <Info className="w-5 h-5 text-[#005a4b] shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900/70 leading-relaxed">
              <p className="font-semibold text-emerald-900 mb-1">Pricing Policy (Hanoi):</p>
              <ul className="space-y-1">
                <li>• Opening (0-2km): {formatVND(PRICING[carType].opening)}</li>
                <li>• 2km to 12km: {formatVND(PRICING[carType].tier1)}/km</li>
                <li>• 12km to 25km: {formatVND(PRICING[carType].tier2)}/km</li>
                <li>• 25km+: {formatVND(PRICING[carType].tier3)}/km</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
            Prices are for reference only and exclude tolls or extra fees.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
