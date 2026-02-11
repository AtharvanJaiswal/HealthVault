import React, { useState } from 'react';
import { Activity, ArrowRight, MapPin, Settings, Clipboard } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Label } from '@/app/components/ui/label';

interface RegistrationPageProps {
  onProceed: (data: RegistrationData) => void;
  onBack: () => void;
}

export interface RegistrationData {
  breakerId: string;
  voltageRating: string;
  currentRating: string;
  breakerType: string;
  manufacturer: string;
  subsystemName: string;
  substationName: string;
  bayName: string;
  phase: string;
  reasonForTesting: string;
  dateOfTesting: string;
  kitManufacturer: string;
  kitMake: string;
  kitModel: string;
}

export function RegistrationPage({ onProceed, onBack }: RegistrationPageProps) {
  const [formData, setFormData] = useState<RegistrationData>({
    breakerId: '',
    voltageRating: '',
    currentRating: '',
    breakerType: '',
    manufacturer: '',
    subsystemName: '',
    substationName: '',
    bayName: '',
    phase: '',
    reasonForTesting: '',
    dateOfTesting: new Date().toISOString().split('T')[0],
    kitManufacturer: '',
    kitMake: '',
    kitModel: ''
  });

  const handleChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceed(formData);
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
                <p className="text-xs text-slate-400">Circuit Breaker Registration</p>
              </div>
            </div>
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-slate-400 hover:text-slate-200"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
                1
              </div>
              <span className="text-cyan-400 font-medium">Register CB</span>
            </div>
            <div className="h-0.5 w-20 bg-slate-700" />
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 font-bold">
                2
              </div>
              <span className="text-slate-500">Upload Data</span>
            </div>
            <div className="h-0.5 w-20 bg-slate-700" />
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 font-bold">
                3
              </div>
              <span className="text-slate-500">Analysis</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Breaker Information */}
            <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <Settings className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-200">Breaker Information</h2>
                  <p className="text-sm text-slate-500">Enter circuit breaker specifications</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="breakerId" className="text-slate-300">Breaker ID / Serial Number *</Label>
                  <Input
                    id="breakerId"
                    placeholder="e.g., CB-2024-001"
                    value={formData.breakerId}
                    onChange={(e) => handleChange('breakerId', e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voltageRating" className="text-slate-300">Voltage Rating (kV) *</Label>
                  <Input
                    id="voltageRating"
                    type="number"
                    placeholder="e.g., 132"
                    value={formData.voltageRating}
                    onChange={(e) => handleChange('voltageRating', e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentRating" className="text-slate-300">Current Rating (A) *</Label>
                  <Input
                    id="currentRating"
                    type="number"
                    placeholder="e.g., 2000"
                    value={formData.currentRating}
                    onChange={(e) => handleChange('currentRating', e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breakerType" className="text-slate-300">Type of Circuit Breaker *</Label>
                  <Select
                    value={formData.breakerType}
                    onValueChange={(value) => handleChange('breakerType', value)}
                    required
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="SF6">SF6 (Sulfur Hexafluoride)</SelectItem>
                      <SelectItem value="Vacuum">Vacuum</SelectItem>
                      <SelectItem value="Oil">Oil</SelectItem>
                      <SelectItem value="Air">Air</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturer" className="text-slate-300">Manufacturer *</Label>
                  <Input
                    id="manufacturer"
                    placeholder="e.g., ABB, Siemens"
                    value={formData.manufacturer}
                    onChange={(e) => handleChange('manufacturer', e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subsystemName" className="text-slate-300">Subsystem Name</Label>
                  <Input
                    id="subsystemName"
                    placeholder="e.g., Main Grid"
                    value={formData.subsystemName}
                    onChange={(e) => handleChange('subsystemName', e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>
              </div>
            </Card>

            {/* Location Information */}
            <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <MapPin className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-200">Location Information</h2>
                  <p className="text-sm text-slate-500">Specify installation location and testing details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="substationName" className="text-slate-300">Substation Name *</Label>
                  <Input
                    id="substationName"
                    placeholder="e.g., North Grid Substation"
                    value={formData.substationName}
                    onChange={(e) => handleChange('substationName', e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bayName" className="text-slate-300">Bay Name *</Label>
                  <Input
                    id="bayName"
                    placeholder="e.g., TIE BAY OF ICT 2 - BR2"
                    value={formData.bayName}
                    onChange={(e) => handleChange('bayName', e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phase" className="text-slate-300">Phase *</Label>
                  <Select
                    value={formData.phase}
                    onValueChange={(value) => handleChange('phase', value)}
                    required
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                      <SelectValue placeholder="Select phase" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="R">R Phase (Red)</SelectItem>
                      <SelectItem value="Y">Y Phase (Yellow)</SelectItem>
                      <SelectItem value="B">B Phase (Blue)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfTesting" className="text-slate-300">Date of Testing *</Label>
                  <Input
                    id="dateOfTesting"
                    type="date"
                    value={formData.dateOfTesting}
                    onChange={(e) => handleChange('dateOfTesting', e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="reasonForTesting" className="text-slate-300">Reason for Testing *</Label>
                  <Input
                    id="reasonForTesting"
                    placeholder="e.g., Routine maintenance, Post-fault inspection"
                    value={formData.reasonForTesting}
                    onChange={(e) => handleChange('reasonForTesting', e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Test Kit Details */}
            <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Clipboard className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-200">Test Kit Details</h2>
                  <p className="text-sm text-slate-500">Enter DCRM test equipment information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="kitManufacturer" className="text-slate-300">Kit Manufacturer</Label>
                  <Input
                    id="kitManufacturer"
                    placeholder="e.g., Megger"
                    value={formData.kitManufacturer}
                    onChange={(e) => handleChange('kitManufacturer', e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kitMake" className="text-slate-300">Make</Label>
                  <Input
                    id="kitMake"
                    placeholder="e.g., DLRO600"
                    value={formData.kitMake}
                    onChange={(e) => handleChange('kitMake', e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kitModel" className="text-slate-300">Model</Label>
                  <Input
                    id="kitModel"
                    placeholder="e.g., v2.1"
                    value={formData.kitModel}
                    onChange={(e) => handleChange('kitModel', e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                onClick={onBack}
                variant="outline"
                className="border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 shadow-lg shadow-cyan-500/20"
              >
                Proceed to Upload
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
