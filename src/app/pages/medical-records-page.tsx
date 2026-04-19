import { useEffect, useState } from 'react';
import { FileText, Upload, Search, Filter, Eye, Download, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { supabase } from '../lib/supabase';
import { ensureUserProfile } from '../lib/database';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { MedicalRecord } from '../lib/supabase';

const getErrorMessage = (error: unknown) => {
  const storageSetupMessage =
    'Storage bucket "medical-records" was not found. Create it in Supabase Storage, then add the storage policies from DATABASE_SETUP.md.';

  if (error instanceof Error && error.message) {
    if (error.message.toLowerCase().includes('bucket not found')) {
      return storageSetupMessage;
    }

    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      if (message.toLowerCase().includes('bucket not found')) {
        return storageSetupMessage;
      }

      return message;
    }
  }

  return 'Please check your Supabase table and storage policies.';
};

export function MedicalRecordsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadData, setUploadData] = useState({
    category: 'prescription' as MedicalRecord['category'],
    title: '',
    description: '',
    isEmergencyVisible: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      loadRecords();
    }
  }, [user]);

  useEffect(() => {
    filterRecords();
  }, [records, searchTerm, categoryFilter]);

  const loadRecords = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false });

    if (error) {
      toast.error('Failed to load records');
    } else {
      setRecords(data || []);
    }
  };

  const filterRecords = () => {
    let filtered = records;

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((r) => r.category === categoryFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in before uploading a record');
      return;
    }

    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    const title = uploadData.title.trim();
    const description = uploadData.description.trim();

    if (!title) {
      toast.error('Please enter a title');
      return;
    }

    setLoading(true);
    let uploadedFilePath: string | null = null;

    try {
      await ensureUserProfile(user);

      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || 'file';
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('medical-records')
        .upload(filePath, selectedFile, {
          contentType: selectedFile.type || undefined,
        });

      if (uploadError) throw uploadError;
      uploadedFilePath = filePath;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('medical-records')
        .getPublicUrl(filePath);

      // Create database record
      const { error: dbError } = await supabase.from('medical_records').insert({
        user_id: user.id,
        category: uploadData.category,
        title,
        description: description || null,
        file_url: publicUrl,
        file_name: selectedFile.name,
        file_type: selectedFile.type,
        is_visible_in_emergency: uploadData.isEmergencyVisible,
      });

      if (dbError) {
        if (uploadedFilePath) {
          const { error: cleanupError } = await supabase.storage
            .from('medical-records')
            .remove([uploadedFilePath]);

          if (cleanupError) {
            console.warn('Uploaded file could not be cleaned up after database insert failed:', cleanupError);
          }
        }

        throw dbError;
      }

      toast.success('Record uploaded successfully');
      setUploadDialogOpen(false);
      resetUploadForm();
      loadRecords();
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to upload record: ${message}`);
      console.error('Failed to upload record:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadData({
      category: 'prescription',
      title: '',
      description: '',
      isEmergencyVisible: false,
    });
    setSelectedFile(null);
  };

  const handleDelete = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    const { error } = await supabase
      .from('medical_records')
      .delete()
      .eq('id', recordId);

    if (error) {
      toast.error('Failed to delete record');
    } else {
      toast.success('Record deleted');
      loadRecords();
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      prescription: 'bg-blue-100 text-blue-700 border-blue-200',
      lab_report: 'bg-green-100 text-green-700 border-green-200',
      vaccination: 'bg-purple-100 text-purple-700 border-purple-200',
      scan: 'bg-orange-100 text-orange-700 border-orange-200',
      other: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[category] || colors.other;
  };

  const getCategoryIcon = (category: string) => {
    return <FileText className="w-5 h-5" />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-600 mt-1">Upload and manage your health documents</p>
        </div>

        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Upload Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Medical Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={uploadData.category}
                  onValueChange={(value) => setUploadData({ ...uploadData, category: value as MedicalRecord['category'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="lab_report">Lab Report</SelectItem>
                    <SelectItem value="vaccination">Vaccination Record</SelectItem>
                    <SelectItem value="scan">Scan Report</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Blood Test Results"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add any notes or details"
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Upload File (PDF/Image, max 10MB)</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  required
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
                )}
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="emergency-visible" className="cursor-pointer">
                    Visible in Emergency Card
                  </Label>
                  <p className="text-xs text-gray-500">
                    Allow access via emergency QR code
                  </p>
                </div>
                <Switch
                  id="emergency-visible"
                  checked={uploadData.isEmergencyVisible}
                  onCheckedChange={(checked) =>
                    setUploadData({ ...uploadData, isEmergencyVisible: checked })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Uploading...' : 'Upload'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUploadDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search records..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="lab_report">Lab Report</SelectItem>
                <SelectItem value="vaccination">Vaccination</SelectItem>
                <SelectItem value="scan">Scan Report</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {records.length === 0 ? 'No records yet' : 'No matching records'}
            </h3>
            <p className="text-gray-500 mb-4">
              {records.length === 0
                ? 'Upload your first medical record to get started'
                : 'Try adjusting your search or filter'}
            </p>
            {records.length === 0 && (
              <Button onClick={() => setUploadDialogOpen(true)}>
                Upload First Record
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full border mb-2 ${getCategoryColor(
                        record.category
                      )}`}
                    >
                      {record.category.replace('_', ' ')}
                    </span>
                    <CardTitle className="text-base leading-tight">
                      {record.title}
                    </CardTitle>
                  </div>
                  {getCategoryIcon(record.category)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {record.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{record.description}</p>
                )}
                <p className="text-xs text-gray-500">
                  {format(new Date(record.uploaded_at), 'MMM dd, yyyy')}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <a href={record.file_url} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <a href={record.file_url} download={record.file_name}>
                      <Download className="w-3 h-3" />
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(record.id)}
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
