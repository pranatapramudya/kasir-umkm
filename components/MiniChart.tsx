'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

const revenueData = [
  { value: 400 },
  { value: 300 },
  { value: 550 },
  { value: 450 },
  { value: 700 },
  { value: 650 },
  { value: 850 }
];

export function MiniChart() {
  return (
    <div className="h-16 w-full mt-2 opacity-80" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
