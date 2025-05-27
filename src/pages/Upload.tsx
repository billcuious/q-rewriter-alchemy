
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Settings, ArrowRight, ArrowLeft, Crop, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { extractTextFromPDF } from "@/utils/pdfProcessor";
import { rewriteQuestion, type RewrittenQuestion } from "@/utils/aiProcessor";

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rewritingRules, setRewritingRules] = useState(`Rewrite questions with the following guidelines:
- Tone: Professional and academic
- Complexity: Maintain original difficulty level
- Style: Clear and concise explanations
- Format: Use bullet points for complex explanations
- Preserve all technical terminology
- Ensure explanations are comprehensive but not verbose`);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      toast.success("PDF uploaded successfully!");
    } else {
      toast.error("Please upload a valid PDF file");
    }
  };

  const handleStartProcessing = async () => {
    if (!file) {
      toast.error("Please upload a PDF file first");
      return;
    }
    
    setIsProcessing(true);
    toast.success("Starting AI processing...");
    
    try {
      // Extract text from PDF
      toast.info("Extracting text from PDF...");
      const questions = await extractTextFromPDF(file);
      
      if (questions.length === 0) {
        toast.error("No questions found in the PDF. Please try a different file.");
        setIsProcessing(false);
        return;
      }
      
      toast.success(`Found ${questions.length} potential questions. Processing with AI...`);
      
      // Process questions with AI (limit to first 3 for demo)
      const questionsToProcess = questions.slice(0, 3);
      const results: RewrittenQuestion[] = [];
      
      for (let i = 0; i < questionsToProcess.length; i++) {
        const question = questionsToProcess[i];
        toast.info(`Processing question ${i + 1} of ${questionsToProcess.length}...`);
        
        try {
          const rewritten = await rewriteQuestion(question.rawText, question.id, rewritingRules);
          results.push(rewritten);
          toast.success(`Question ${question.id} processed successfully`);
        } catch (error) {
          console.error(`Failed to process question ${question.id}:`, error);
          toast.error(`Failed to process question ${question.id}`);
        }
      }
      
      // Store results in sessionStorage for demo
      sessionStorage.setItem('processedQuestions', JSON.stringify(results));
      sessionStorage.setItem('originalQuestions', JSON.stringify(questions));
      
      toast.success(`Processing complete! ${results.length} questions rewritten.`);
      navigate('/review');
      
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(`Processing failed: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Upload & Configure
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
              <div className="w-16 h-1 bg-blue-200 rounded"></div>
              <div className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
              <div className="w-16 h-1 bg-gray-200 rounded"></div>
              <div className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* PDF Upload Section */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-blue-600" />
                  PDF Upload
                </CardTitle>
                <CardDescription>
                  Upload your MCQ question bank PDF (Demo: processes first 5 pages)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                    disabled={isProcessing}
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {file ? file.name : "Click to upload PDF"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Demo mode: processes first 5 pages only
                    </p>
                  </label>
                </div>

                {file && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="font-medium text-green-800">{file.name}</p>
                        <p className="text-sm text-green-600">
                          {(file.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <Crop className="h-4 w-4 mr-2 text-blue-600" />
                    Preprocessing Options
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span>Auto-crop UI elements</span>
                      <span className="text-blue-600 font-medium">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span>Question-answer grouping</span>
                      <span className="text-blue-600 font-medium">Auto-detect</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span>Text extraction mode</span>
                      <span className="text-blue-600 font-medium">Advanced OCR</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rewriting Rules Section */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-green-600" />
                  AI Rewriting Rules
                </CardTitle>
                <CardDescription>
                  Define how the AI should rewrite your questions and explanations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="rewriting-rules" className="text-sm font-medium">
                    Custom Instructions
                  </Label>
                  <Textarea
                    id="rewriting-rules"
                    value={rewritingRules}
                    onChange={(e) => setRewritingRules(e.target.value)}
                    rows={12}
                    className="resize-none"
                    placeholder="Enter your rewriting guidelines..."
                    disabled={isProcessing}
                  />
                  <p className="text-xs text-gray-500">
                    These instructions will guide AI rewriting while preserving educational integrity
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-green-600" />
                    Processing Settings
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span>Batch size</span>
                      <span className="text-green-600 font-medium">10 questions</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span>Auto-retry on failure</span>
                      <span className="text-green-600 font-medium">Once</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span>Preserve answer order</span>
                      <span className="text-green-600 font-medium">Yes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mt-12">
            <Button 
              size="lg" 
              onClick={handleStartProcessing}
              disabled={!file || isProcessing}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg"
            >
              {isProcessing ? "Processing..." : "Start AI Processing"}
              {!isProcessing && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
