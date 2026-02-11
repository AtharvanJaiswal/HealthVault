import React, { useState } from 'react';
import { Activity, TrendingUp, Clock, AlertTriangle, Database, CheckCircle, History } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Button } from '@/app/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { RegistrationData } from './registration-page';

interface ComparisonDashboardProps {
  registrationData: RegistrationData;
  uploadedFile: File;
  hasReference: boolean;
  onNewAnalysis: () => void;
}

// Generate mock comparison data
const generateComparisonData = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      time: i,
      resistanceUploaded: Math.sin(i / 10) * 15 + 50 + Math.random() * 5,
      resistanceReference: Math.sin(i / 10) * 12 + 48 + Math.random() * 4,
      currentUploaded: Math.cos(i / 8) * 200 + 500 + Math.random() * 20,
      currentReference: Math.cos(i / 8) * 180 + 480 + Math.random() * 15,
      travelUploaded: (i / 100) * 80 + Math.random() * 5,
      travelReference: (i / 100) * 75 + Math.random() * 3
    });
  }
  return data;
};

const generateFeatureComparison = () => {
  return [
    { feature: 'Mean', uploaded: 52.3, reference: 48.7, diff: 7.4 },
    { feature: 'Standard Deviation', uploaded: 8.2, reference: 6.9, diff: 18.8 },
    { feature: 'RMS', uploaded: 53.1, reference: 49.2, diff: 7.9 },
    { feature: 'Peak-to-Peak', uploaded: 28.5, reference: 24.3, diff: 17.3 },
    { feature: 'RII', uploaded: 0.892, reference: 0.945, diff: -5.6 },
    { feature: 'RSI', uploaded: 0.756, reference: 0.821, diff: -7.9 },
    { feature: 'RGI', uploaded: 0.834, reference: 0.898, diff: -7.1 },
    { feature: 'Velocity', uploaded: 125.4, reference: 108.2, diff: 15.9 },
    { feature: 'Bounce Index', uploaded: 3.2, reference: 2.1, diff: 52.4 },
    { feature: 'Entropy', uploaded: 4.23, reference: 3.87, diff: 9.3 },
    { feature: 'Zero Crossings', uploaded: 18, reference: 15, diff: 20.0 },
    { feature: 'Degradation Rate', uploaded: 1.84, reference: 0.92, diff: 100.0 }
  ];
};

const generateHistoricalData = () => {
  const data = [];
  const now = Date.now();
  for (let i = 10; i >= 0; i--) {
    const date = new Date(now - i * 30 * 24 * 60 * 60 * 1000); // Monthly data
    data.push({
      date: date.toISOString().split('T')[0],
      healthIndex: 95 - i * 2 + Math.random() * 5,
      rul: 14 - i * 0.5 + Math.random() * 0.5
    });
  }
  return data;
};

const generatePastTests = () => {
  return [
    { date: '2026-01-15', healthIndex: 78, rul: 8.5, status: 'Healthy' },
    { date: '2025-12-20', healthIndex: 82, rul: 9.2, status: 'Healthy' },
    { date: '2025-11-18', healthIndex: 85, rul: 10.1, status: 'Healthy' },
    { date: '2025-10-22', healthIndex: 87, rul: 10.8, status: 'Healthy' },
    { date: '2025-09-25', healthIndex: 89, rul: 11.5, status: 'Healthy' }
  ];
};

export function ComparisonDashboard({ registrationData, uploadedFile, hasReference, onNewAnalysis }: ComparisonDashboardProps) {
  const [visibleSignals, setVisibleSignals] = useState({
    resistanceUploaded: true,
    resistanceReference: hasReference,
    currentUploaded: true,
    currentReference: hasReference,
    travelUploaded: true,
    travelReference: hasReference
  });

  const comparisonData = generateComparisonData();
  const featureComparison = generateFeatureComparison();
  const historicalData = generateHistoricalData();
  const pastTests = generatePastTests();

  const healthIndex = 78;
  const rul = 8.5;
  const faultType = 'Healthy';
  const confidence = 94.2;

  const toggleSignal = (signal: keyof typeof visibleSignals) => {
    setVisibleSignals(prev => ({ ...prev, [signal]: !prev[signal] }));
  };

  const getDeviationLevel = (diff: number) => {
    const absDiff = Math.abs(diff);
    if (absDiff < 10) return { level: 'Low', color: 'text-green-400 bg-green-500/10 border-green-500/30' };
    if (absDiff < 30) return { level: 'Medium', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' };
    return { level: 'High', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-cyan-400" strokeWidth={2.5} />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  CB-AI DCRM Analytics
                </h1>
                <p className="text-xs text-slate-400">Comparison & Analysis Dashboard</p>
              </div>
            </div>
            <Button
              onClick={onNewAnalysis}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              New Analysis
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Summary Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="p-4 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <p className="text-xs text-slate-500 mb-1">Breaker ID</p>
            <p className="text-sm font-bold text-cyan-400">{registrationData.breakerId}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <p className="text-xs text-slate-500 mb-1">Substation</p>
            <p className="text-sm font-semibold text-slate-300">{registrationData.substationName}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <p className="text-xs text-slate-500 mb-1">Bay</p>
            <p className="text-sm font-semibold text-slate-300">{registrationData.bayName}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <p className="text-xs text-slate-500 mb-1">Phase</p>
            <p className="text-sm font-semibold text-slate-300">{registrationData.phase} Phase</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <p className="text-xs text-slate-500 mb-1">Health Index</p>
            <p className="text-xl font-bold text-green-400">{healthIndex}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <p className="text-xs text-slate-500 mb-1">RUL (Years)</p>
            <p className="text-xl font-bold text-blue-400">{rul}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <p className="text-xs text-slate-500 mb-1">Confidence</p>
            <p className="text-xl font-bold text-purple-400">{confidence}%</p>
          </Card>
        </div>

        {/* Fault Status */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Fault Status</p>
                <p className="text-xl font-bold text-green-400">{faultType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-cyan-500/10">
                <Database className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Reference Data</p>
                <p className="text-xl font-bold text-cyan-400">{hasReference ? 'Found' : 'Not Found'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Interactive Comparison Graph */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-200">Unified Signal Comparison</h2>
              <p className="text-sm text-slate-500">Dynamic Resistance • Current • Travel</p>
            </div>
          </div>

          {/* Interactive Legend with Checkboxes */}
          <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm font-semibold text-slate-300 mb-3">Toggle Signals</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="resistanceUploaded"
                  checked={visibleSignals.resistanceUploaded}
                  onCheckedChange={() => toggleSignal('resistanceUploaded')}
                />
                <label htmlFor="resistanceUploaded" className="text-sm text-blue-400 cursor-pointer flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  Resistance (Upload)
                </label>
              </div>
              {hasReference && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="resistanceReference"
                    checked={visibleSignals.resistanceReference}
                    onCheckedChange={() => toggleSignal('resistanceReference')}
                  />
                  <label htmlFor="resistanceReference" className="text-sm text-blue-300 cursor-pointer flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full border-2 border-blue-400" />
                    Resistance (Ref)
                  </label>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="currentUploaded"
                  checked={visibleSignals.currentUploaded}
                  onCheckedChange={() => toggleSignal('currentUploaded')}
                />
                <label htmlFor="currentUploaded" className="text-sm text-green-400 cursor-pointer flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  Current (Upload)
                </label>
              </div>
              {hasReference && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="currentReference"
                    checked={visibleSignals.currentReference}
                    onCheckedChange={() => toggleSignal('currentReference')}
                  />
                  <label htmlFor="currentReference" className="text-sm text-green-300 cursor-pointer flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full border-2 border-green-400" />
                    Current (Ref)
                  </label>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="travelUploaded"
                  checked={visibleSignals.travelUploaded}
                  onCheckedChange={() => toggleSignal('travelUploaded')}
                />
                <label htmlFor="travelUploaded" className="text-sm text-orange-400 cursor-pointer flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500" />
                  Travel (Upload)
                </label>
              </div>
              {hasReference && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="travelReference"
                    checked={visibleSignals.travelReference}
                    onCheckedChange={() => toggleSignal('travelReference')}
                  />
                  <label htmlFor="travelReference" className="text-sm text-orange-300 cursor-pointer flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full border-2 border-orange-400" />
                    Travel (Ref)
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Unified Comparison Chart */}
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Time (ms)', position: 'insideBottom', offset: -5, style: { fill: '#64748b' } }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Normalized Values', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
                {visibleSignals.resistanceUploaded && (
                  <Line
                    type="monotone"
                    dataKey="resistanceUploaded"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    name="Resistance (Uploaded)"
                  />
                )}
                {visibleSignals.resistanceReference && hasReference && (
                  <Line
                    type="monotone"
                    dataKey="resistanceReference"
                    stroke="#93c5fd"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Resistance (Reference)"
                  />
                )}
                {visibleSignals.currentUploaded && (
                  <Line
                    type="monotone"
                    dataKey="currentUploaded"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name="Current (Uploaded)"
                  />
                )}
                {visibleSignals.currentReference && hasReference && (
                  <Line
                    type="monotone"
                    dataKey="currentReference"
                    stroke="#6ee7b7"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Current (Reference)"
                  />
                )}
                {visibleSignals.travelUploaded && (
                  <Line
                    type="monotone"
                    dataKey="travelUploaded"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                    name="Travel (Uploaded)"
                  />
                )}
                {visibleSignals.travelReference && hasReference && (
                  <Line
                    type="monotone"
                    dataKey="travelReference"
                    stroke="#fdba74"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Travel (Reference)"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Feature Comparison Panel */}
        {hasReference && (
          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Feature</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Uploaded</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Reference</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Difference (%)</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-400">Deviation</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((item, index) => {
                    const deviation = getDeviationLevel(item.diff);
                    return (
                      <tr key={index} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 text-sm text-slate-300 font-medium">{item.feature}</td>
                        <td className="py-3 px-4 text-sm text-right text-cyan-400 font-semibold">{item.uploaded}</td>
                        <td className="py-3 px-4 text-sm text-right text-blue-400 font-semibold">{item.reference}</td>
                        <td className={`py-3 px-4 text-sm text-right font-semibold ${item.diff > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                          {item.diff > 0 ? '+' : ''}{item.diff.toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full border ${deviation.color}`}>
                            {deviation.level}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Decision & AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Database className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200">Matching Logic</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="text-slate-400 mb-1">Match Strategy:</p>
                <p className="text-slate-200">Substation + Bay + Breaker ID + Phase</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="text-slate-400 mb-1">Fallback Strategy:</p>
                <p className="text-slate-200">Breaker ID + Phase</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="text-slate-400 mb-1">If No Match:</p>
                <p className="text-slate-200">AI-only prediction mode</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200">Maintenance Recommendation</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <span className="text-sm text-slate-400">Degradation Score</span>
                <span className="text-sm font-semibold text-yellow-400">Moderate</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <span className="text-sm text-slate-400">Risk Level</span>
                <span className="text-sm font-semibold text-green-400">Normal</span>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-sm text-green-400 font-semibold">✓ Recommendation:</p>
                <p className="text-sm text-slate-300 mt-1">Continue normal operation. Schedule routine inspection in 6 months.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Historical Data */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">Historical Data</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Date', position: 'insideBottom', offset: -5, style: { fill: '#64748b' } }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Health Index & RUL', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="healthIndex"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Health Index"
                />
                <Line
                  type="monotone"
                  dataKey="rul"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="RUL (Years)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Past Tests */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">Past Tests</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Health Index</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">RUL (Years)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {pastTests.map((item, index) => (
                  <tr key={index} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-sm text-slate-300 font-medium">{item.date}</td>
                    <td className="py-3 px-4 text-sm text-right text-cyan-400 font-semibold">{item.healthIndex}</td>
                    <td className="py-3 px-4 text-sm text-right text-blue-400 font-semibold">{item.rul}</td>
                    <td className={`py-3 px-4 text-sm text-right font-semibold ${item.status === 'Healthy' ? 'text-green-400' : 'text-red-400'}`}>
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}