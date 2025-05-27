
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, Eye, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface RewrittenQuestion {
  question_id: string;
  rewritten_question: string;
  answer_choices: string[];
  correct_answer_index: number;
  explanations: {
    correct: string;
    [key: string]: string;
  };
  original_text: string;
  user_prompt_applied: string;
}

const Review = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<RewrittenQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [approvedQuestions, setApprovedQuestions] = useState<Set<string>>(new Set());
  const [rejectedQuestions, setRejectedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedQuestions = sessionStorage.getItem('processedQuestions');
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    } else {
      toast.error("No processed questions found. Please go back and upload a PDF.");
      navigate('/upload');
    }
  }, [navigate]);

  const currentQuestion = questions[currentIndex];

  const handleApprove = () => {
    if (currentQuestion) {
      setApprovedQuestions(prev => new Set(prev).add(currentQuestion.question_id));
      setRejectedQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentQuestion.question_id);
        return newSet;
      });
      toast.success(`Question ${currentQuestion.question_id} approved`);
    }
  };

  const handleReject = () => {
    if (currentQuestion) {
      setRejectedQuestions(prev => new Set(prev).add(currentQuestion.question_id));
      setApprovedQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentQuestion.question_id);
        return newSet;
      });
      toast.error(`Question ${currentQuestion.question_id} rejected`);
    }
  };

  const handleFinishReview = () => {
    const approvedCount = approvedQuestions.size;
    const rejectedCount = rejectedQuestions.size;
    
    toast.success(`Review complete! ${approvedCount} approved, ${rejectedCount} rejected`);
    
    // Store final results
    const finalResults = {
      approved: questions.filter(q => approvedQuestions.has(q.question_id)),
      rejected: questions.filter(q => rejectedQuestions.has(q.question_id)),
      summary: {
        total: questions.length,
        approved: approvedCount,
        rejected: rejectedCount
      }
    };
    
    sessionStorage.setItem('finalResults', JSON.stringify(finalResults));
    navigate('/results');
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <p className="text-lg text-gray-600 mb-4">No questions to review</p>
            <Button onClick={() => navigate('/upload')}>Back to Upload</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/processing')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Processing
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-2 rounded-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Review Results
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">✓</div>
              <div className="w-16 h-1 bg-green-600 rounded"></div>
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">✓</div>
              <div className="w-16 h-1 bg-orange-600 rounded"></div>
              <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
            </div>
          </div>

          {/* Question Counter and Navigation */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Question {currentIndex + 1} of {questions.length}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {currentQuestion.question_id}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                disabled={currentIndex === questions.length - 1}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Original */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Original Content</CardTitle>
                <CardDescription>Extracted from PDF page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Raw Text:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {currentQuestion.original_text}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Rewritten */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-orange-800">Rewritten Content</CardTitle>
                <CardDescription>AI-generated version</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Question:</h4>
                    <p className="text-gray-700">{currentQuestion.rewritten_question}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Answer Choices:</h4>
                    <div className="space-y-2">
                      {currentQuestion.answer_choices.map((choice, index) => (
                        <div 
                          key={index} 
                          className={`p-2 rounded ${
                            index === currentQuestion.correct_answer_index 
                              ? 'bg-green-50 border border-green-200' 
                              : 'bg-gray-50'
                          }`}
                        >
                          <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {choice}
                          {index === currentQuestion.correct_answer_index && (
                            <Badge variant="secondary" className="ml-2 text-xs">Correct</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Explanations:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-green-50 p-3 rounded">
                        <strong>Correct Answer:</strong> {currentQuestion.explanations.correct}
                      </div>
                      {Object.entries(currentQuestion.explanations)
                        .filter(([key]) => key !== 'correct')
                        .map(([key, explanation]) => (
                        <div key={key} className="bg-gray-50 p-3 rounded">
                          <strong>Option {key}:</strong> {explanation}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Button
              onClick={handleReject}
              variant="destructive"
              size="lg"
              className="px-8"
            >
              <XCircle className="h-5 w-5 mr-2" />
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              size="lg"
              className="bg-green-600 hover:bg-green-700 px-8"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Approve
            </Button>
          </div>

          {/* Status Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Review Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{approvedQuestions.size}</div>
                  <div className="text-sm text-gray-600">Approved</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{rejectedQuestions.size}</div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Finish Review Button */}
          <div className="text-center mt-8">
            <Button 
              size="lg" 
              onClick={handleFinishReview}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 text-lg"
            >
              Finish Review & Export
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
