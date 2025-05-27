
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, ArrowLeft, CheckCircle, XCircle, RotateCcw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Results = () => {
  const navigate = useNavigate();

  const stats = {
    total: 127,
    accepted: 118,
    rejected: 6,
    retry: 3,
    successRate: 92.9
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting results in ${format} format...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/review')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Review
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-2 rounded-lg">
                <Download className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Export Results
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg p-8 mb-8 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Processing Complete!</h2>
            <p className="text-lg opacity-90">
              Successfully processed {stats.total} questions with {stats.successRate}% success rate
            </p>
          </div>

          {/* Statistics */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Processing Summary</CardTitle>
              <CardDescription>Overview of AI rewriting results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-emerald-100 p-4 rounded-lg mb-2">
                    <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">{stats.accepted}</div>
                  <div className="text-sm text-gray-600">Accepted</div>
                </div>
                <div className="text-center">
                  <div className="bg-red-100 p-4 rounded-lg mb-2">
                    <XCircle className="h-8 w-8 text-red-600 mx-auto" />
                  </div>
                  <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 p-4 rounded-lg mb-2">
                    <RotateCcw className="h-8 w-8 text-yellow-600 mx-auto" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.retry}</div>
                  <div className="text-sm text-gray-600">Retry</div>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-lg mb-2">
                    <FileText className="h-8 w-8 text-blue-600 mx-auto" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Download your rewritten questions in various formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleExport('JSON')}
                >
                  <FileText className="h-6 w-6" />
                  <span>JSON Format</span>
                  <span className="text-xs text-gray-500">Structured data</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleExport('Excel')}
                >
                  <FileText className="h-6 w-6" />
                  <span>Excel Format</span>
                  <span className="text-xs text-gray-500">Spreadsheet</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleExport('PDF')}
                >
                  <FileText className="h-6 w-6" />
                  <span>PDF Format</span>
                  <span className="text-xs text-gray-500">Document</span>
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Export Settings</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Include in Export:</h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Rewritten questions</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Original questions (reference)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Explanations</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Page references</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Filter by Status:</h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Accepted questions only</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Include rejected questions</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Include retry questions</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Source PDF:</span>
                    <span className="font-medium">medical_mcqs_2024.pdf</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Started:</span>
                    <span className="font-medium">2024-05-27 14:30:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Completed:</span>
                    <span className="font-medium">2024-05-27 15:45:22</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Duration:</span>
                    <span className="font-medium">1h 15m 22s</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">AI Model Used:</span>
                    <span className="font-medium">GPT-4o</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-medium text-emerald-600">{stats.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Time per Question:</span>
                    <span className="font-medium">35.7 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quality Score:</span>
                    <span className="font-medium text-emerald-600">Excellent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => handleExport('All Formats')}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Download All Formats
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/')}
              className="px-8 py-4 text-lg border-emerald-300 text-emerald-600 hover:bg-emerald-50"
            >
              <Home className="h-5 w-5 mr-2" />
              Start New Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
