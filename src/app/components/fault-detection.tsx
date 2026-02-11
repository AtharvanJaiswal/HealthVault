import React from 'react';
import { Card } from '@/app/components/ui/card';
import { AlertTriangle, Zap, Cog, TrendingUp, Shield } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface FaultDetectionProps {
  faultType: 'None' | 'Electrical' | 'Mechanical';
  failureProbability: number;
  anomalyScore: number;
  severityLevel: 'Normal' | 'Warning' | 'Critical' | 'Imminent Failure';
}

export function FaultDetection({
  faultType,
  failureProbability,
  anomalyScore,
  severityLevel
}: FaultDetectionProps) {
  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'Normal':
        return { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', dot: 'bg-green-500' };
      case 'Warning':
        return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', dot: 'bg-yellow-500' };
      case 'Critical':
        return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-500' };
      case 'Imminent Failure':
        return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-500' };
      default:
        return { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400', dot: 'bg-slate-500' };
    }
  };

  const severityColors = getSeverityColor(severityLevel);

  // Pie chart data for fault types
  const faultDistribution = [
    { name: 'Healthy', value: faultType === 'None' ? 70 : 30, color: '#10b981' },
    { name: 'Electrical', value: faultType === 'Electrical' ? 50 : 10, color: '#f59e0b' },
    { name: 'Mechanical', value: faultType === 'Mechanical' ? 40 : 10, color: '#ef4444' }
  ];

  // Radar chart data for anomaly detection
  const radarData = [
    { metric: 'Resistance', value: Math.random() * 40 + 60 },
    { metric: 'Current', value: Math.random() * 40 + 60 },
    { metric: 'Voltage', value: Math.random() * 40 + 60 },
    { metric: 'Temperature', value: Math.random() * 40 + 60 },
    { metric: 'Vibration', value: Math.random() * 40 + 60 },
    { metric: 'Timing', value: Math.random() * 40 + 60 }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-200">Fault & Anomaly Detection</h2>
        <span className="text-xs text-slate-500">AI-powered diagnostics</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Fault Classification */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-1">Fault Classification</h3>
              <p className="text-xs text-slate-500">ML-based detection</p>
            </div>
            <div className="p-2 rounded-lg bg-orange-500/10">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
            </div>
          </div>

          {/* Current Fault Type */}
          <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <p className="text-sm text-slate-400 mb-2">Current Status</p>
            <div className="flex items-center gap-3">
              {faultType === 'None' ? (
                <>
                  <Shield className="h-6 w-6 text-green-400" />
                  <span className="text-xl font-bold text-green-400">No Fault Detected</span>
                </>
              ) : faultType === 'Electrical' ? (
                <>
                  <Zap className="h-6 w-6 text-yellow-400" />
                  <span className="text-xl font-bold text-yellow-400">Electrical Fault</span>
                </>
              ) : (
                <>
                  <Cog className="h-6 w-6 text-red-400" />
                  <span className="text-xl font-bold text-red-400">Mechanical Fault</span>
                </>
              )}
            </div>
          </div>

          {/* Fault Distribution Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={faultDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {faultDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 mt-4">
            {faultDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-400">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Anomaly Detection */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-1">Anomaly Detection</h3>
              <p className="text-xs text-slate-500">Multi-parameter analysis</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10">
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
          </div>

          {/* Anomaly Score */}
          <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <p className="text-sm text-slate-400 mb-2">Anomaly Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-purple-400">{anomalyScore.toFixed(3)}</span>
              <span className="text-sm text-slate-500">/ 1.000</span>
            </div>
            <div className="mt-3 h-2 bg-slate-700/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${anomalyScore * 100}%` }}
              />
            </div>
          </div>

          {/* Radar Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <Radar
                  name="Health"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Failure Probability & Severity */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-700/50 backdrop-blur-sm lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Probability of Failure */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-1">Probability of Failure</h3>
                  <p className="text-xs text-slate-500">Next 12 months</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-orange-400">{failureProbability}%</span>
                </div>
                <div className="h-3 bg-slate-700/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      failureProbability < 20
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                        : failureProbability < 40
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-400'
                        : 'bg-gradient-to-r from-red-500 to-rose-400'
                    }`}
                    style={{ width: `${failureProbability}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50">
                  <span className="text-sm text-slate-400">Risk Level</span>
                  <span className={`text-sm font-semibold ${
                    failureProbability < 20 ? 'text-green-400' : failureProbability < 40 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {failureProbability < 20 ? 'Low' : failureProbability < 40 ? 'Moderate' : 'High'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50">
                  <span className="text-sm text-slate-400">Confidence</span>
                  <span className="text-sm font-semibold text-cyan-400">92.5%</span>
                </div>
              </div>
            </div>

            {/* Severity Level */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-1">Severity Level</h3>
                  <p className="text-xs text-slate-500">Current system status</p>
                </div>
              </div>

              <div className={`mb-4 p-6 rounded-lg ${severityColors.bg} border ${severityColors.border}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-4 w-4 rounded-full ${severityColors.dot} animate-pulse`} />
                  <span className={`text-2xl font-bold ${severityColors.text}`}>
                    {severityLevel}
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  {severityLevel === 'Normal' && 'All parameters within normal operating range'}
                  {severityLevel === 'Warning' && 'Some parameters approaching threshold limits'}
                  {severityLevel === 'Critical' && 'Immediate attention required - parameters exceed limits'}
                  {severityLevel === 'Imminent Failure' && 'Emergency maintenance required - failure imminent'}
                </p>
              </div>

              {/* Severity Levels Reference */}
              <div className="space-y-2">
                {['Normal', 'Warning', 'Critical', 'Imminent Failure'].map((level) => {
                  const colors = getSeverityColor(level);
                  const isActive = level === severityLevel;
                  return (
                    <div
                      key={level}
                      className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                        isActive ? `${colors.bg} border ${colors.border}` : 'bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${isActive ? colors.dot : 'bg-slate-600'}`} />
                        <span className={`text-xs font-medium ${isActive ? colors.text : 'text-slate-500'}`}>
                          {level}
                        </span>
                      </div>
                      {isActive && (
                        <span className="text-xs text-slate-400">Active</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
