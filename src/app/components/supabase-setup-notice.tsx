import { AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export function SupabaseSetupNotice() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // If credentials are set, don't show this notice
  if (supabaseUrl && supabaseKey) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-900">
            <AlertCircle className="w-6 h-6" />
            Supabase Configuration Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              HealthVault requires a Supabase backend to function. Please complete the following steps:
            </p>

            <div className="bg-white p-4 rounded-lg border border-orange-200 space-y-3">
              <h3 className="font-semibold text-gray-900">Quick Setup (5 minutes)</h3>
              
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>
                  Create a free Supabase account at{' '}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    supabase.com
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Create a new project (wait 2-3 minutes for setup)</li>
                <li>
                  Copy your project URL and anon key from Settings → API
                </li>
                <li>
                  Create a <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code> file in your project root:
                  <pre className="bg-gray-900 text-green-400 p-3 rounded mt-2 text-xs overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`}
                  </pre>
                </li>
                <li>
                  Run the SQL schema from <code className="bg-gray-100 px-1 py-0.5 rounded">DATABASE_SETUP.md</code> in Supabase SQL Editor
                </li>
                <li>
                  Restart your development server:
                  <pre className="bg-gray-900 text-green-400 p-3 rounded mt-2 text-xs">
{`npm run dev`}
                  </pre>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">📚 Documentation</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• <strong>QUICKSTART.md</strong> - Complete 5-minute setup guide</li>
                <li>• <strong>DATABASE_SETUP.md</strong> - SQL schema and table creation</li>
                <li>• <strong>README.md</strong> - Full project documentation</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button asChild className="flex-1">
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Supabase Dashboard
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-orange-200">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> Figma Make is not designed for collecting or storing sensitive PII or PHI. 
              This application requires proper HIPAA compliance and security measures for production use with real medical data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
