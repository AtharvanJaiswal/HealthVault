import React from 'react';
import { Card } from '@/app/components/ui/card';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { PhaseHealth } from '@/app/utils/mock-data';

interface PhaseHealthCardsProps {
  phases: PhaseHealth[];
}

export function PhaseHealthCards({ phases }: PhaseHealthCardsProps) {
  const getPhaseColor = (phase: string) => {
    if (phase === 'R') return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', graph: '#ef4444' };
    if (phase === 'Y') return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', graph: '#eab308' };
    return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', graph: '#3b82f6' };
  };

  const getStatusColor = (status: string) => {
    if (status === 'healthy') return 'bg-green-500';
    if (status === 'warning') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = (status: string) => {
    if (status === 'healthy') return 'Healthy';
    if (status === 'warning') return 'Warning';
    return 'Critical';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-200">Phase-wise Circuit Breaker Health</h2>
        <span className="text-xs text-slate-500">Real-time monitoring</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {phases.map((phase) => {
          const colors = getPhaseColor(phase.phase);
          const waveformData = phase.waveform.map((value, index) => ({ index, value }));

          return (
            <Card
              key={phase.phase}
              className={`p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-700/50 backdrop-blur-sm ${colors.border}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-2xl font-bold ${colors.text}`}>
                      {phase.phase} Phase
                    </span>
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(phase.status)} animate-pulse`} />
                  </div>
                  <p className="text-xs text-slate-500">Contact Resistance Monitor</p>
                </div>
                <div className={`px-3 py-1 rounded-full ${colors.bg} ${colors.border} border`}>
                  <span className={`text-xs font-medium ${colors.text}`}>
                    {getStatusText(phase.status)}
                  </span>
                </div>
              </div>

              {/* Health Score */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-slate-200">{phase.healthScore}</span>
                  <span className="text-sm text-slate-500">/100</span>
                </div>
                <div className="h-2 bg-slate-700/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      phase.status === 'healthy'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                        : phase.status === 'warning'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-400'
                        : 'bg-gradient-to-r from-red-500 to-rose-400'
                    }`}
                    style={{ width: `${phase.healthScore}%` }}
                  />
                </div>
              </div>

              {/* Mini Waveform Graph */}
              <div className="h-20 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={waveformData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={colors.graph}
                      strokeWidth={2}
                      dot={false}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Stats */}
              <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500">Resistance</p>
                  <p className="text-sm font-semibold text-slate-300">
                    {(Math.random() * 20 + 40).toFixed(1)} mΩ
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Trend</p>
                  <p className="text-sm font-semibold text-green-400">
                    ↑ {(Math.random() * 5).toFixed(1)}%
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
