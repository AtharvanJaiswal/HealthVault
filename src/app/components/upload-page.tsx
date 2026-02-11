import React, { useState, useRef } from 'react';
import { Activity, Upload, File, CheckCircle, AlertCircle, ArrowRight, Database } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { RegistrationData } from './registration-page';

interface UploadPageProps {
  registrationData: RegistrationData;
  onProceed: (file: File) => void;
  onBack: () => void;
}

export function UploadPage({ registrationData, onProceed, onBack }: UploadPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [hasReference, setHasReference] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      checkForReference();
    } else {
      alert('Please upload a CSV file');
    }
  };

  const checkForReference = () => {
    setIsChecking(true);
    // Simulate checking database for reference data
    setTimeout(() => {
      // Randomly determine if reference exists (70% chance)
      const referenceExists = Math.random() > 0.3;
      setHasReference(referenceExists);
      setIsChecking(false);
    }, 1500);
  };

  const handleAnalyze = () => {
    if (file) {
      onProceed(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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
                <p className="text-xs text-slate-400">Upload DCRM Test Data</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                <CheckCircle className="h-6 w-6" />
              </div>
              <span className="text-green-400 font-medium">Register CB</span>
            </div>
            <div className="h-0.5 w-20 bg-cyan-500" />
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
                2
              </div>
              <span className="text-cyan-400 font-medium">Upload Data</span>
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

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Registration Summary */}
          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Registered Circuit Breaker</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Breaker ID</p>
                <p className="text-sm font-semibold text-cyan-400">{registrationData.breakerId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Substation</p>
                <p className="text-sm font-semibold text-slate-300">{registrationData.substationName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Bay Name</p>
                <p className="text-sm font-semibold text-slate-300">{registrationData.bayName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Phase</p>
                <p className="text-sm font-semibold text-slate-300">{registrationData.phase} Phase</p>
              </div>
            </div>
          </Card>

          {/* Upload Area */}
          <Card className="p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-slate-200 mb-6">Upload DCRM Test Data</h2>
            
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 ${
                dragActive
                  ? 'border-cyan-500 bg-cyan-500/5'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleChange}
                className="hidden"
              />

              {!file ? (
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-cyan-500/10">
                      <Upload className="h-12 w-12 text-cyan-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">
                    Drop your CSV file here
                  </h3>
                  <p className="text-sm text-slate-400 mb-6">
                    or click to browse files
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    Select CSV File
                  </Button>
                  <p className="text-xs text-slate-500 mt-4">
                    Supported format: CSV • Max size: 10MB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-green-500/10">
                      <File className="h-12 w-12 text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">{file.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Size: {formatFileSize(file.size)}
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-slate-700 text-slate-400 hover:text-slate-200"
                  >
                    Change File
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Status Messages */}
          {file && (
            <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Database className="h-6 w-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-200 mb-3">
                    Database Reference Check
                  </h3>
                  
                  {isChecking ? (
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-slate-400">
                        Searching for reference data in database...
                      </span>
                    </div>
                  ) : hasReference ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-green-400 mb-1">
                            Matching Reference Data Found
                          </p>
                          <p className="text-xs text-slate-400">
                            Match criteria: Substation ({registrationData.substationName}) + Bay ({registrationData.bayName}) + Phase ({registrationData.phase})
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 p-3 rounded-lg bg-slate-800/50">
                        <p><strong>Reference Data Details:</strong></p>
                        <ul className="mt-2 space-y-1 ml-4">
                          <li>• Best health index CB data from same configuration</li>
                          <li>• Comparison analysis will be performed</li>
                          <li>• ML prediction with reference baseline</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                        <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-yellow-400 mb-1">
                            No Reference Data Found
                          </p>
                          <p className="text-xs text-slate-400">
                            No matching reference CB data in database for this configuration
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 p-3 rounded-lg bg-slate-800/50">
                        <p><strong>Analysis Mode:</strong></p>
                        <ul className="mt-2 space-y-1 ml-4">
                          <li>• AI-only prediction mode</li>
                          <li>• Health assessment using ML model</li>
                          <li>• No comparison graph will be shown</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="outline"
              className="border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            >
              Back to Registration
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={!file}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyze DCRM Data
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
