import React from 'react';
import { Card } from '@/app/components/ui/card';
import { FeatureData } from '@/app/utils/mock-data';
import { TrendingUp, Activity, Waves, Zap } from 'lucide-react';

interface FeatureAnalyticsProps {
  features: FeatureData[];
}

export function FeatureAnalytics({ features }: FeatureAnalyticsProps) {
  const getFeatureIcon = (name: string) => {
    if (name.includes('Velocity') || name.includes('Degradation')) return <TrendingUp className="h-4 w-4" />;
    if (name.includes('Entropy') || name.includes('Bounce')) return <Activity className="h-4 w-4" />;
    if (name.includes('Zero') || name.includes('Peak')) return <Waves className="h-4 w-4" />;
    return <Zap className="h-4 w-4" />;
  };

  const getCategoryColor = (name: string) => {
    if (name.includes('Mean') || name.includes('RMS') || name.includes('Peak')) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (name.includes('RII') || name.includes('RSI') || name.includes('RGI')) return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    if (name.includes('Velocity') || name.includes('Bounce')) return 'text-green-400 bg-green-500/10 border-green-500/30';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-200">AI Feature Analytics</h2>
        <span className="text-xs text-slate-500">Extracted signal features</span>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {features.map((feature, index) => (
          <Card
            key={index}
            className={`p-4 bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300 group cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className={`p-1.5 rounded-lg ${getCategoryColor(feature.name)}`}>
                {getFeatureIcon(feature.name)}
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
            <p className="text-xs text-slate-500 mb-1">{feature.name}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                {feature.value}
              </span>
              {feature.unit && (
                <span className="text-xs text-slate-500">{feature.unit}</span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Table */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Feature Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Feature</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Value</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Unit</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Category</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => {
                const category = feature.name.includes('Mean') || feature.name.includes('RMS') || feature.name.includes('Peak')
                  ? 'Statistical'
                  : feature.name.includes('RII') || feature.name.includes('RSI') || feature.name.includes('RGI')
                  ? 'Resistance Index'
                  : feature.name.includes('Velocity') || feature.name.includes('Bounce')
                  ? 'Dynamic'
                  : 'Signal Processing';

                return (
                  <tr
                    key={index}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${getCategoryColor(feature.name)}`}>
                          {getFeatureIcon(feature.name)}
                        </div>
                        <span className="text-sm text-slate-300">{feature.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-semibold text-slate-200">{feature.value}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm text-slate-400">{feature.unit || '-'}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300">
                        {category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
                        Normal
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
