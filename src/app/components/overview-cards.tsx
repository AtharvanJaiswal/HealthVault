import React from 'react';
import { Card } from '@/app/components/ui/card';
import { Activity, Clock, AlertTriangle, Shield } from 'lucide-react';

interface OverviewCardsProps {
  healthIndex: number;
  rul: number;
  faultStatus: string;
  anomalyStatus: string;
}

export function OverviewCards({ healthIndex, rul, faultStatus, anomalyStatus }: OverviewCardsProps) {
  const getStatusColor = (status: string) => {
    if (status === 'Healthy' || status === 'Normal') return 'text-green-400';
    if (status === 'Warning') return 'text-yellow-400';
    return 'text-red-400';
  };

  const getAnomalyColor = (status: string) => {
    if (status === 'Normal') return 'text-green-400';
    if (status === 'Warning') return 'text-yellow-400';
    return 'text-red-400';
  };

  // Calculate gauge rotation
  const gaugeRotation = (healthIndex / 100) * 180 - 90;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Health Index with Gauge */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-slate-400 mb-1">Health Index</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-cyan-400">{healthIndex}</span>
              <span className="text-sm text-slate-500">/100</span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <Activity className="h-5 w-5 text-cyan-400" />
          </div>
        </div>
        
        {/* Circular Gauge */}
        <div className="relative w-full h-24 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 120 70">
            {/* Background arc */}
            <path
              d="M 10 60 A 50 50 0 0 1 110 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-700/30"
            />
            {/* Progress arc */}
            <path
              d="M 10 60 A 50 50 0 0 1 110 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className={healthIndex > 80 ? 'text-green-500' : healthIndex > 60 ? 'text-yellow-500' : 'text-red-500'}
              strokeDasharray={`${(healthIndex / 100) * 157} 157`}
            />
            {/* Needle */}
            <g transform="translate(60, 60)">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-40"
                stroke="currentColor"
                strokeWidth="2"
                className="text-cyan-400"
                transform={`rotate(${gaugeRotation})`}
              />
              <circle cx="0" cy="0" r="3" fill="currentColor" className="text-cyan-400" />
            </g>
          </svg>
        </div>
      </Card>

      {/* Remaining Useful Life */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-slate-400 mb-1">Remaining Useful Life</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-400">{rul}</span>
              <span className="text-sm text-slate-500">years</span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Clock className="h-5 w-5 text-blue-400" />
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="h-2 bg-slate-700/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((rul / 15) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">Expected life: 15 years</p>
        </div>
      </Card>

      {/* Fault Status */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-slate-400 mb-1">Fault Status</p>
            <div className="flex items-center gap-2 mt-2">
              <div className={`h-3 w-3 rounded-full ${
                faultStatus === 'Healthy' ? 'bg-green-500' : 'bg-red-500'
              } animate-pulse`} />
              <span className={`text-lg font-semibold ${getStatusColor(faultStatus)}`}>
                {faultStatus}
              </span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-orange-500/10">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Electrical</span>
            <span className="text-slate-400">{faultStatus === 'Electrical Fault' ? 'Detected' : 'OK'}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Mechanical</span>
            <span className="text-slate-400">{faultStatus === 'Mechanical Fault' ? 'Detected' : 'OK'}</span>
          </div>
        </div>
      </Card>

      {/* Anomaly Status */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-slate-400 mb-1">Anomaly Status</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-lg font-semibold ${getAnomalyColor(anomalyStatus)}`}>
                {anomalyStatus}
              </span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Shield className="h-5 w-5 text-purple-400" />
          </div>
        </div>
        
        {/* Status indicator bars */}
        <div className="mt-6 space-y-2">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Risk Level</span>
              <span className="text-slate-400">
                {anomalyStatus === 'Normal' ? 'Low' : anomalyStatus === 'Warning' ? 'Medium' : 'High'}
              </span>
            </div>
            <div className="h-1.5 bg-slate-700/30 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  anomalyStatus === 'Normal'
                    ? 'bg-green-500 w-1/3'
                    : anomalyStatus === 'Warning'
                    ? 'bg-yellow-500 w-2/3'
                    : 'bg-red-500 w-full'
                }`}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
