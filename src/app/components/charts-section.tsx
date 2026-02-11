import React from 'react';
import { Card } from '@/app/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { TimeSeriesPoint, ContactResistanceData } from '@/app/utils/mock-data';

interface ChartsSectionProps {
  healthData: TimeSeriesPoint[];
  rulData: TimeSeriesPoint[];
  contactResistanceData: ContactResistanceData[];
  featureImportance: { feature: string; importance: number }[];
}

export function ChartsSection({
  healthData,
  rulData,
  contactResistanceData,
  featureImportance
}: ChartsSectionProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-200">Dynamic Analysis Charts</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors">
            Live
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-300 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:bg-slate-700/50 transition-colors">
            24h
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-300 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:bg-slate-700/50 transition-colors">
            7d
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Health Index vs Time */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-200">Health Index Trend</h3>
            <p className="text-xs text-slate-500">Real-time health monitoring</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData}>
                <defs>
                  <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTimestamp}
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                  labelFormatter={(label) => `Time: ${formatTimestamp(label)}`}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#healthGradient)"
                  name="Health Index"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* RUL vs Time */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-200">Remaining Useful Life</h3>
            <p className="text-xs text-slate-500">Predictive analytics</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rulData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTimestamp}
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Years', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                  labelFormatter={(label) => `Time: ${formatTimestamp(label)}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 3 }}
                  name="RUL (years)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Contact Resistance Waveform */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-700/50 backdrop-blur-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-200">Phase-wise Contact Resistance</h3>
            <p className="text-xs text-slate-500">Multi-phase signal comparison</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={contactResistanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis
                  dataKey="timestamp"
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  interval={9}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Resistance (mΩ)', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="r"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  name="R Phase"
                />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#eab308"
                  strokeWidth={2}
                  dot={false}
                  name="Y Phase"
                />
                <Line
                  type="monotone"
                  dataKey="b"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="B Phase"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Feature Importance */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-700/50 backdrop-blur-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-200">ML Feature Importance</h3>
            <p className="text-xs text-slate-500">Model explainability analysis</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis
                  type="number"
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  domain={[0, 1]}
                />
                <YAxis
                  type="category"
                  dataKey="feature"
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  width={150}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                  formatter={(value: number) => value.toFixed(3)}
                />
                <Bar
                  dataKey="importance"
                  fill="#8b5cf6"
                  radius={[0, 8, 8, 0]}
                  name="Importance"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
