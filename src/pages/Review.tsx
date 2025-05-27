
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, RotateCcw, ArrowLeft, ArrowRight, Eye, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Review = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [decisions, setDecisions] = useState<{ [key: number]: 'accepted' | 'rejected' | 'retry' }>({});

  const sampleQuestions = [
    {
      id: "Q083",
      original: {
        question: "A 45-year-old patient with diabetes mellitus type 2 is prescribed metformin. Which of the following is the primary mechanism of action of metformin?",
        options: [
          "Increases insulin secretion from pancreatic beta cells",
          "Decreases hepatic glucose production and improves insulin sensitivity",
          "Delays gastric emptying and reduces postprandial glucose spikes",
          "Inhibits sodium-glucose cotransporter 2 in the kidneys",
          "Stimulates glucose uptake in skeletal muscle through GLUT4 translocation"
        ],
        correctAnswer: 1,
        explanation: "Metformin primarily works by decreasing hepatic glucose production through inhibition of gluconeogenesis and glycogenolysis. It also improves peripheral insulin sensitivity..."
      },
      rewritten: {
        question: "A middle-aged diabetic patient receives a prescription for metformin as part of their treatment regimen. What represents the fundamental mechanism by which this medication exerts its therapeutic effects?",
        options: [
          "Enhances pancreatic beta cell insulin release",
          "Reduces liver glucose synthesis while enhancing cellular insulin responsiveness",
          "Slows stomach emptying to moderate post-meal glucose elevation",
          "Blocks renal glucose reabsorption transporters",
          "Promotes muscle cell glucose absorption via transporter activation"
        ],
        correctAnswer: 1,
        explanation: "Metformin's primary therapeutic action involves suppressing hepatic glucose synthesis by inhibiting key metabolic pathways including gluconeogenesis and glycogenolysis. Additionally, it enhances peripheral tissue sensitivity to insulin..."
      },
      pageRange: [234, 236]
    }
  ];

  const handleDecision = (decision: 'accepted' | 'rejected' | 'retry') => {
    setDecisions(prev => ({ ...prev, [currentQuestion]: decision }));
    toast.success(`Question ${decision === 'accepted' ? 'accepted' : decision === 'rejected' ? 'rejected' : 'marked for retry'}`);
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'retry': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const currentQ = sampleQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200">
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
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Review & Approve
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">✓</div>
              <div className="w-16 h-1 bg-green-600 rounded"></div>
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">✓</div>
              <div className="w-16 h-1 bg-green-600 rounded"></div>
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
            </div>
          </div>

          {/* Question Navigation */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Question {currentQuestion + 1} of {sampleQuestions.length}
              </h2>
              <Badge variant="outline" className="text-sm">
                ID: {currentQ.id}
              </Badge>
              <Badge variant="outline" className="text-sm">
                Pages: {currentQ.pageRange[0]}-{currentQ.pageRange[1]}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(prev => prev - 1)}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentQuestion === sampleQuestions.length - 1}
                onClick={() => setCurrentQuestion(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Original Question */}
            <Card className="h-fit">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-lg text-gray-800">Original Question</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800">Question Stem</h3>
                  <p className="text-gray-700 leading-relaxed">{currentQ.original.question}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800">Answer Options</h3>
                  <div className="space-y-2">
                    {currentQ.original.options.map((option, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        index === currentQ.original.correctAnswer 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                        {option}
                        {index === currentQ.original.correctAnswer && (
                          <Badge className="ml-2 bg-green-600">Correct</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-gray-800">Explanation</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{currentQ.original.explanation}</p>
                </div>
              </CardContent>
            </Card>

            {/* Rewritten Question */}
            <Card className="h-fit">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-lg text-blue-800">AI Rewritten Question</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800">Question Stem</h3>
                  <p className="text-gray-700 leading-relaxed">{currentQ.rewritten.question}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800">Answer Options</h3>
                  <div className="space-y-2">
                    {currentQ.rewritten.options.map((option, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        index === currentQ.rewritten.correctAnswer 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                        {option}
                        {index === currentQ.rewritten.correctAnswer && (
                          <Badge className="ml-2 bg-green-600">Correct</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-gray-800">Explanation</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{currentQ.rewritten.explanation}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Decision Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Review Decision</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Current Status:</span>
                  {decisions[currentQuestion] && (
                    <Badge className={getDecisionColor(decisions[currentQuestion])}>
                      {decisions[currentQuestion].charAt(0).toUpperCase() + decisions[currentQuestion].slice(1)}
                    </Badge>
                  )}
                  {!decisions[currentQuestion] && (
                    <Badge variant="outline">Pending Review</Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDecision('rejected')}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDecision('retry')}
                    className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                  <Button 
                    onClick={() => handleDecision('accepted')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Final Actions */}
          <div className="flex justify-center mt-12">
            <Button 
              size="lg" 
              onClick={() => navigate('/results')}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Export Results
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
