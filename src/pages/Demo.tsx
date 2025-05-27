
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, FileText, Brain, Eye, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Demo = () => {
  const navigate = useNavigate();

  const demoStep = {
    original: {
      question: "A 34-year-old female patient presents to the emergency department with acute onset of severe abdominal pain, nausea, and vomiting. Physical examination reveals right lower quadrant tenderness with positive McBurney's point. Laboratory results show elevated white blood cell count. What is the most likely diagnosis?",
      options: [
        "Acute cholecystitis",
        "Acute appendicitis", 
        "Ovarian torsion",
        "Ectopic pregnancy",
        "Gastroenteritis"
      ],
      correctAnswer: 1
    },
    rewritten: {
      question: "A woman in her early thirties arrives at the emergency room experiencing sudden, intense abdominal discomfort accompanied by nausea and emesis. Clinical assessment demonstrates localized tenderness in the right iliac fossa with a positive McBurney's sign. Blood work indicates leukocytosis. Which condition most likely explains this presentation?",
      options: [
        "Gallbladder inflammation",
        "Appendiceal inflammation",
        "Adnexal torsion", 
        "Extrauterine pregnancy",
        "Intestinal viral infection"
      ],
      correctAnswer: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-violet-200">
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
              <div className="bg-gradient-to-r from-violet-600 to-blue-600 p-2 rounded-lg">
                <Play className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                Interactive Demo
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Demo Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              See AI Rewriting in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Watch how our AI intelligently rewrites medical MCQs while preserving the exact teaching point, 
              difficulty level, and correct answer. Every word is changed, but the educational value remains intact.
            </p>
          </div>

          {/* Demo Flow */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardHeader>
                <FileText className="h-12 w-12 text-violet-600 mx-auto mb-4" />
                <CardTitle>Original Question</CardTitle>
                <CardDescription>From source PDF</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>AI Processing</CardTitle>
                <CardDescription>Intelligent rewriting</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Rewritten Result</CardTitle>
                <CardDescription>Preserving integrity</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Original */}
            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-gray-600" />
                  Original Question
                </CardTitle>
                <Badge variant="outline" className="w-fit">From PDF Page 156</Badge>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800">Question Stem</h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {demoStep.original.question}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800">Answer Choices</h3>
                  <div className="space-y-2">
                    {demoStep.original.options.map((option, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        index === demoStep.original.correctAnswer 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                        {option}
                        {index === demoStep.original.correctAnswer && (
                          <Badge className="ml-2 bg-green-600 text-xs">Correct</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rewritten */}
            <Card>
              <CardHeader className="bg-violet-50">
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-violet-600" />
                  AI Rewritten Version
                </CardTitle>
                <Badge className="w-fit bg-violet-600">Preserves Teaching Point</Badge>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800">Question Stem</h3>
                  <p className="text-gray-700 leading-relaxed bg-violet-50 p-4 rounded-lg">
                    {demoStep.rewritten.question}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800">Answer Choices</h3>
                  <div className="space-y-2">
                    {demoStep.rewritten.options.map((option, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        index === demoStep.rewritten.correctAnswer 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-violet-50 border-violet-200'
                      }`}>
                        <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                        {option}
                        {index === demoStep.rewritten.correctAnswer && (
                          <Badge className="ml-2 bg-green-600 text-xs">Correct</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Features Highlighted */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>What Makes This Rewrite Effective?</CardTitle>
              <CardDescription>Key preservation and enhancement features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-green-600">✅ Preserved Elements</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Clinical scenario:</strong> 34-year-old female with abdominal pain</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Key symptoms:</strong> Right lower quadrant pain, McBurney's point</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Correct answer:</strong> Appendicitis remains the right choice</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Difficulty level:</strong> Same clinical reasoning required</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-blue-600">🔄 Enhanced Elements</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Language variety:</strong> "emesis" instead of "vomiting"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Clinical terminology:</strong> "right iliac fossa" for anatomical precision</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Answer options:</strong> Completely reworded while maintaining validity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Flow improvement:</strong> More natural sentence structure</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Ready to Transform Your Question Bank?</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the power of AI-driven question rewriting that maintains educational integrity 
              while creating completely original content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/upload')}
                className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
              >
                Start Your Project
                <FileText className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/')}
                className="px-8 py-4 text-lg border-violet-300 text-violet-600 hover:bg-violet-50"
              >
                Learn More
                <Eye className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
