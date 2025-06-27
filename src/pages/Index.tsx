import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Brain, CheckCircle, Download, ArrowRight, Upload, Settings, Eye, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload className="h-8 w-8 text-blue-600" />,
      title: "PDF Upload & Processing",
      description: "Upload large PDFs (500-1000+ pages) and automatically detect question-answer groupings with intelligent cropping."
    },
    {
      icon: <Settings className="h-8 w-8 text-green-600" />,
      title: "Custom Rewriting Rules",
      description: "Define tone, complexity, and style preferences that guide AI rewriting while preserving educational integrity."
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "AI-Powered Rewriting",
      description: "Advanced AI rewrites questions and explanations while maintaining the same teaching points and correct answers."
    },
    {
      icon: <Eye className="h-8 w-8 text-orange-600" />,
      title: "Side-by-Side Review",
      description: "Compare original and rewritten content in batches of 10, with accept/reject controls for quality assurance."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-emerald-600" />,
      title: "Quality Control",
      description: "Built-in validation ensures rewritten questions preserve instructional intent and factual accuracy."
    },
    {
      icon: <Download className="h-8 w-8 text-indigo-600" />,
      title: "Export & Management",
      description: "Export processed questions in multiple formats and maintain full traceability to original PDF pages."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MCQ Rewriter Pro
              </h1>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate('/github-preview')}
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub Preview
              </Button>
              <Button 
                onClick={() => navigate('/upload')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              AI-Powered MCQ Rewriting Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform large PDF question banks with intelligent AI rewriting that preserves educational integrity 
              while avoiding direct copying. Perfect for educators, test prep companies, and educational publishers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/upload')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg"
              >
                Start Processing PDFs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/demo')}
                className="border-blue-300 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
              >
                View Demo
                <Eye className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/github-preview')}
                className="border-green-300 text-green-600 hover:bg-green-50 px-8 py-4 text-lg"
              >
                <Github className="mr-2 h-5 w-5" />
                GitHub Preview
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Comprehensive MCQ Processing Pipeline</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              End-to-end solution for processing, rewriting, and managing multiple-choice questions at scale
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">How It Works</h2>
            <p className="text-lg text-gray-600">Simple 4-step process to transform your question banks</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Upload PDF", desc: "Upload your question bank PDF and configure cropping settings" },
                { step: "2", title: "Set Rules", desc: "Define rewriting style, tone, and complexity preferences" },
                { step: "3", title: "AI Processing", desc: "AI processes questions in batches while preserving teaching points" },
                { step: "4", title: "Review & Export", desc: "Review results side-by-side and export in your preferred format" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Question Banks?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join educators and publishers who are streamlining their content creation with AI-powered rewriting
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/upload')}
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
          >
            Start Your First Project
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MCQ Rewriter Pro</span>
          </div>
          <p className="text-sm">Intelligent question rewriting for educational excellence</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
