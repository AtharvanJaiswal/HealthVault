import React, { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Search, Download, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { HistoricalRecord } from '@/app/utils/mock-data';

interface HistoricalTableProps {
  data: HistoricalRecord[];
}

export function HistoricalTable({ data }: HistoricalTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof HistoricalRecord>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: keyof HistoricalRecord) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedAndFilteredData = React.useMemo(() => {
    let filtered = data.filter((record) =>
      Object.values(record).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    filtered.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue);
      const bStr = String(bValue);
      return sortDirection === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    return filtered;
  }, [data, searchTerm, sortColumn, sortDirection]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const SortIcon = ({ column }: { column: keyof HistoricalRecord }) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-200">Historical Data Records</h2>
        <span className="text-xs text-slate-500">{sortedAndFilteredData.length} records</span>
      </div>

      <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-slate-400 cursor-pointer hover:text-slate-300"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-1">
                    ID
                    <SortIcon column="id" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-slate-400 cursor-pointer hover:text-slate-300"
                  onClick={() => handleSort('fileName')}
                >
                  <div className="flex items-center gap-1">
                    File Name
                    <SortIcon column="fileName" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-slate-400 cursor-pointer hover:text-slate-300"
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center gap-1">
                    Timestamp
                    <SortIcon column="timestamp" />
                  </div>
                </th>
                <th
                  className="text-center py-3 px-4 text-sm font-semibold text-slate-400 cursor-pointer hover:text-slate-300"
                  onClick={() => handleSort('healthIndex')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Health Index
                    <SortIcon column="healthIndex" />
                  </div>
                </th>
                <th
                  className="text-center py-3 px-4 text-sm font-semibold text-slate-400 cursor-pointer hover:text-slate-300"
                  onClick={() => handleSort('rul')}
                >
                  <div className="flex items-center justify-center gap-1">
                    RUL (years)
                    <SortIcon column="rul" />
                  </div>
                </th>
                <th
                  className="text-center py-3 px-4 text-sm font-semibold text-slate-400 cursor-pointer hover:text-slate-300"
                  onClick={() => handleSort('faultType')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Fault Type
                    <SortIcon column="faultType" />
                  </div>
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-400">
                  Anomaly
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                  ML Prediction
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredData.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-mono text-cyan-400">{record.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-slate-300">{record.fileName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-slate-400">{formatDate(record.timestamp)}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-sm font-semibold ${
                        record.healthIndex > 85
                          ? 'text-green-400'
                          : record.healthIndex > 70
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {record.healthIndex}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm text-slate-300">{record.rul}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        record.faultType === 'None'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : record.faultType === 'Electrical'
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {record.faultType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          record.anomalyFlag ? 'bg-red-500' : 'bg-green-500'
                        } animate-pulse`}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-slate-300">{record.mlPrediction}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {sortedAndFilteredData.length} of {data.length} records</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              1
            </button>
            <button className="px-3 py-1.5 rounded bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 rounded bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 transition-colors">
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
