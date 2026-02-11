export interface HistoricalRecord {
  id: string;
  fileName: string;
  timestamp: string;
  healthIndex: number;
  rul: number;
  faultType: 'None' | 'Electrical' | 'Mechanical';
  anomalyFlag: boolean;
  mlPrediction: string;
}

export interface PhaseHealth {
  phase: 'R' | 'Y' | 'B';
  healthScore: number;
  status: 'healthy' | 'warning' | 'critical';
  waveform: number[];
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface ContactResistanceData {
  timestamp: string;
  r: number;
  y: number;
  b: number;
}

export interface FeatureData {
  name: string;
  value: number;
  unit: string;
}

// Generate random health index between 60-100
export function generateHealthIndex(): number {
  return Math.floor(Math.random() * 40) + 60;
}

// Generate RUL between 2-15 years
export function generateRUL(): number {
  return parseFloat((Math.random() * 13 + 2).toFixed(1));
}

// Generate fault status
export function generateFaultStatus(): 'Healthy' | 'Electrical Fault' | 'Mechanical Fault' {
  const rand = Math.random();
  if (rand < 0.7) return 'Healthy';
  if (rand < 0.85) return 'Electrical Fault';
  return 'Mechanical Fault';
}

// Generate anomaly status
export function generateAnomalyStatus(): 'Normal' | 'Warning' | 'Critical' {
  const rand = Math.random();
  if (rand < 0.75) return 'Normal';
  if (rand < 0.92) return 'Warning';
  return 'Critical';
}

// Generate phase health data
export function generatePhaseHealth(): PhaseHealth[] {
  return ['R', 'Y', 'B'].map((phase) => {
    const healthScore = Math.floor(Math.random() * 40) + 60;
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (healthScore < 70) status = 'critical';
    else if (healthScore < 85) status = 'warning';
    
    const waveform = Array.from({ length: 50 }, (_, i) => 
      Math.sin(i / 5) * 10 + Math.random() * 5
    );

    return {
      phase: phase as 'R' | 'Y' | 'B',
      healthScore,
      status,
      waveform
    };
  });
}

// Generate time series data for charts
export function generateTimeSeriesData(points: number = 20): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = [];
  const now = Date.now();
  
  for (let i = 0; i < points; i++) {
    const timestamp = new Date(now - (points - i) * 3600000).toISOString();
    const value = Math.floor(Math.random() * 30) + 70;
    data.push({ timestamp, value });
  }
  
  return data;
}

// Generate contact resistance waveform
export function generateContactResistanceData(points: number = 100): ContactResistanceData[] {
  const data: ContactResistanceData[] = [];
  
  for (let i = 0; i < points; i++) {
    const timestamp = `${i}ms`;
    data.push({
      timestamp,
      r: Math.sin(i / 10) * 20 + 50 + Math.random() * 10,
      y: Math.sin(i / 10 + 1) * 22 + 48 + Math.random() * 10,
      b: Math.sin(i / 10 + 2) * 18 + 52 + Math.random() * 10
    });
  }
  
  return data;
}

// Generate feature importance data
export function generateFeatureImportance(): { feature: string; importance: number }[] {
  const features = [
    'Contact Resistance',
    'RMS Velocity',
    'Peak-to-Peak',
    'Degradation Rate',
    'Bounce Index',
    'Zero Crossings',
    'Entropy',
    'RGI'
  ];
  
  return features.map(feature => ({
    feature,
    importance: Math.random() * 0.8 + 0.2
  })).sort((a, b) => b.importance - a.importance);
}

// Generate AI feature analytics
export function generateFeatureAnalytics(): FeatureData[] {
  return [
    { name: 'Mean', value: parseFloat((Math.random() * 50 + 30).toFixed(2)), unit: 'mΩ' },
    { name: 'Standard Deviation', value: parseFloat((Math.random() * 10 + 2).toFixed(2)), unit: 'mΩ' },
    { name: 'RMS', value: parseFloat((Math.random() * 45 + 35).toFixed(2)), unit: 'mΩ' },
    { name: 'Peak-to-Peak', value: parseFloat((Math.random() * 30 + 20).toFixed(2)), unit: 'mΩ' },
    { name: 'RII', value: parseFloat((Math.random() * 0.5 + 0.5).toFixed(3)), unit: '' },
    { name: 'RSI', value: parseFloat((Math.random() * 0.4 + 0.6).toFixed(3)), unit: '' },
    { name: 'RGI', value: parseFloat((Math.random() * 0.3 + 0.7).toFixed(3)), unit: '' },
    { name: 'Velocity', value: parseFloat((Math.random() * 100 + 50).toFixed(2)), unit: 'mm/s' },
    { name: 'Bounce Index', value: parseFloat((Math.random() * 5 + 1).toFixed(2)), unit: '' },
    { name: 'Entropy', value: parseFloat((Math.random() * 2 + 3).toFixed(3)), unit: '' },
    { name: 'Zero Crossings', value: Math.floor(Math.random() * 20 + 10), unit: '' },
    { name: 'Degradation Rate', value: parseFloat((Math.random() * 2 + 0.5).toFixed(3)), unit: '%/year' }
  ];
}

// Generate historical data table
export function generateHistoricalData(count: number = 15): HistoricalRecord[] {
  const records: HistoricalRecord[] = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now - i * 86400000).toISOString();
    const healthIndex = generateHealthIndex();
    const faultType = healthIndex > 85 ? 'None' : (Math.random() > 0.5 ? 'Electrical' : 'Mechanical');
    
    records.push({
      id: `CB-${String(i + 1).padStart(4, '0')}`,
      fileName: `CB_Data_${String(i + 1).padStart(3, '0')}.csv`,
      timestamp,
      healthIndex,
      rul: generateRUL(),
      faultType,
      anomalyFlag: healthIndex < 80,
      mlPrediction: healthIndex > 85 ? 'Normal Operation' : healthIndex > 75 ? 'Monitor' : 'Maintenance Required'
    });
  }
  
  return records;
}

// Generate probability of failure
export function generateFailureProbability(): number {
  return parseFloat((Math.random() * 30 + 5).toFixed(1));
}

// Generate anomaly score
export function generateAnomalyScore(): number {
  return parseFloat((Math.random() * 0.5 + 0.2).toFixed(3));
}
