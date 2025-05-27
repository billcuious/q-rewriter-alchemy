
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, FileText, ArrowLeft, ArrowRight, Pause, Play, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Processing = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(1);
  const [isProcessing, setIsProcessing] = useState(true);
  const [processedQuestions, setProcessedQuestions] = useState(0);
  const [totalQuestions] = useState(127);

  useEffect(() => {
    if (isProcessing) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 2;
          if (newProgress >= 100) {
            setIsProcessing(false);
            return 100;
          }
          return newProgress;
        });
        setProcessedQuestions((prev) => Math.min(prev + 1, totalQuestions));
      }, 500);

      return () => clearInterval(timer);
    }
  }, [isProcessing, totalQuestions]);

  const stats = [
    { label: "Total Questions", value: totalQuestions },
    { label: "Processed", value: processedQuestions },
    { label: "Remaining", value: totalQuestions - processedQuestions },
    { label: "Current Batch", value: `${currentBatch}/13` }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/upload')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Upload
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI Processing
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
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">✓</div>
              <div className="w-16 h-1 bg-green-600 rounded"></div>
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
              <div className="w-16 h-1 bg-purple-200 rounded"></div>
              <div className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
            </div>
          </div>

          {/* Main Processing Card */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">
                {isProcessing ? "Processing Questions..." : "Processing Complete!"}
              </CardTitle>
              <CardDescription className="text-lg">
                AI is rewriting MCQs while preserving educational integrity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Overall Progress */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Overall Progress</span>
                  <span className="text-lg font-bold text-purple-600">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Started processing</span>
                  <span>{processedQuestions} of {totalQuestions} questions</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Current Status */}
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-purple-800">Current Status</h3>
                  <Badge variant={isProcessing ? "default" : "secondary"} className="bg-purple-600">
                    {isProcessing ? "Processing" : "Complete"}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Current Batch:</span>
                    <span className="font-medium">Batch {currentBatch} (Questions 121-127)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Model:</span>
                    <span className="font-medium">GPT-4o (Advanced Rewriting)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Time:</span>
                    <span className="font-medium">~45 seconds per question</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Checks:</span>
                    <span className="font-medium text-green-600">All passed</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsProcessing(!isProcessing)}
                  className="flex items-center"
                >
                  {isProcessing ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isProcessing ? "Pause Processing" : "Resume Processing"}
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Adjust Settings
                </Button>
              </div>

              {/* Next Step Button */}
              {!isProcessing && (
                <div className="text-center pt-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/review')}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg"
                  >
                    Review Results
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                Processing Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {[
                  { time: "14:32:15", action: "Completed Batch 13 (Questions 121-127)", status: "success" },
                  { time: "14:31:42", action: "Processing Question 127: Advanced Pharmacology", status: "processing" },
                  { time: "14:31:18", action: "Rewritten Question 126 successfully", status: "success" },
                  { time: "14:30:55", action: "Processing Question 126: Drug Interactions", status: "processing" },
                  { time: "14:30:31", action: "Rewritten Question 125 successfully", status: "success" },
                  { time: "14:30:08", action: "Processing Question 125: Pediatric Dosing", status: "processing" },
                  { time: "14:29:45", action: "Started Batch 13 processing", status: "info" }
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        log.status === 'success' ? 'bg-green-500' :
                        log.status === 'processing' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="text-sm">{log.action}</span>
                    </div>
                    <span className="text-xs text-gray-500">{log.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Processing;
