
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Github, ExternalLink, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PreviewStatus {
  status: 'idle' | 'cloning' | 'building' | 'ready' | 'error';
  message: string;
  buildLogs?: string[];
  previewUrl?: string;
  repoInfo?: {
    name: string;
    framework: string;
    branch: string;
  };
}

const GitHubPreview = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [accessToken, setAccessToken] = useState('');
  const [previewStatus, setPreviewStatus] = useState<PreviewStatus>({ status: 'idle', message: '' });
  const [previewKey, setPreviewKey] = useState(0);
  const { toast } = useToast();

  const validateGitHubUrl = (url: string): boolean => {
    const githubRegex = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/;
    return githubRegex.test(url.replace(/\.git$/, ''));
  };

  const extractRepoInfo = (url: string) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, '')
      };
    }
    return null;
  };

  const startPreview = async () => {
    if (!repoUrl) {
      toast({
        title: "Error",
        description: "Please enter a GitHub repository URL",
        variant: "destructive"
      });
      return;
    }

    if (!validateGitHubUrl(repoUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive"
      });
      return;
    }

    const repoInfo = extractRepoInfo(repoUrl);
    if (!repoInfo) {
      toast({
        title: "Error",
        description: "Could not parse repository information",
        variant: "destructive"
      });
      return;
    }

    setPreviewStatus({ status: 'cloning', message: 'Cloning repository...' });

    try {
      const response = await fetch('/api/github-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoUrl: repoUrl,
          branch: branch || 'main',
          accessToken: accessToken || undefined,
          owner: repoInfo.owner,
          repo: repoInfo.repo
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        setPreviewStatus({ 
          status: 'error', 
          message: data.error,
          buildLogs: data.logs 
        });
        return;
      }

      // Start polling for build status
      pollBuildStatus(data.buildId);
      
    } catch (error) {
      console.error('Preview error:', error);
      setPreviewStatus({ 
        status: 'error', 
        message: `Failed to start preview: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  };

  const pollBuildStatus = async (buildId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/github-preview/status?buildId=${buildId}`);
        const data = await response.json();
        
        setPreviewStatus({
          status: data.status,
          message: data.message,
          buildLogs: data.logs,
          previewUrl: data.previewUrl,
          repoInfo: data.repoInfo
        });

        if (data.status === 'ready') {
          setPreviewKey(prev => prev + 1);
          toast({
            title: "Preview Ready!",
            description: "Your repository is now running in the preview window"
          });
        } else if (data.status === 'error') {
          toast({
            title: "Build Failed",
            description: data.message,
            variant: "destructive"
          });
        } else if (data.status === 'building' || data.status === 'cloning') {
          setTimeout(poll, 2000);
        }
      } catch (error) {
        console.error('Polling error:', error);
        setPreviewStatus({ 
          status: 'error', 
          message: 'Failed to check build status' 
        });
      }
    };

    poll();
  };

  const refreshPreview = () => {
    setPreviewKey(prev => prev + 1);
  };

  const getStatusIcon = () => {
    switch (previewStatus.status) {
      case 'cloning':
      case 'building':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Github className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (previewStatus.status) {
      case 'cloning':
        return 'bg-blue-500';
      case 'building':
        return 'bg-yellow-500';
      case 'ready':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Controls */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">GitHub Preview</h1>
            <p className="text-sm text-gray-600">
              Enter a GitHub repository URL to preview it live
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Repository</CardTitle>
              <CardDescription>
                Enter the GitHub repository URL you want to preview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Repository URL
                </label>
                <Input
                  type="url"
                  placeholder="https://github.com/owner/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Branch (optional)
                </label>
                <Input
                  type="text"
                  placeholder="main"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Access Token (for private repos)
                </label>
                <Input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxx"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional: GitHub personal access token for private repositories
                </p>
              </div>

              <Button 
                onClick={startPreview}
                disabled={previewStatus.status === 'cloning' || previewStatus.status === 'building'}
                className="w-full"
              >
                {previewStatus.status === 'cloning' || previewStatus.status === 'building' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {previewStatus.status === 'cloning' ? 'Cloning...' : 'Building...'}
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Preview
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Status Panel */}
          {previewStatus.status !== 'idle' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {getStatusIcon()}
                  Status
                  <Badge className={`text-white ${getStatusColor()}`}>
                    {previewStatus.status.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{previewStatus.message}</p>
                
                {previewStatus.repoInfo && (
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Repository:</span>
                      <span className="text-xs">{previewStatus.repoInfo.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Framework:</span>
                      <span className="text-xs">{previewStatus.repoInfo.framework}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Branch:</span>
                      <span className="text-xs">{previewStatus.repoInfo.branch}</span>
                    </div>
                  </div>
                )}

                {previewStatus.status === 'ready' && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={refreshPreview} variant="outline">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Refresh
                    </Button>
                    {previewStatus.previewUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={previewStatus.previewUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open
                        </a>
                      </Button>
                    )}
                  </div>
                )}

                {previewStatus.buildLogs && previewStatus.buildLogs.length > 0 && (
                  <details className="mt-3">
                    <summary className="text-xs font-medium cursor-pointer">Build Logs</summary>
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {previewStatus.buildLogs.join('\n')}
                    </div>
                  </details>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 bg-white">
        <div className="h-full flex flex-col">
          <div className="border-b border-gray-200 p-4 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
            {previewStatus.repoInfo && (
              <p className="text-sm text-gray-600">
                {previewStatus.repoInfo.name} • {previewStatus.repoInfo.framework}
              </p>
            )}
          </div>
          
          <div className="flex-1 relative">
            {previewStatus.status === 'ready' && previewStatus.previewUrl ? (
              <iframe
                key={previewKey}
                src={previewStatus.previewUrl}
                className="w-full h-full border-0"
                title="Repository Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  {previewStatus.status === 'idle' && (
                    <>
                      <Github className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No preview available</p>
                      <p className="text-sm">Enter a GitHub repository URL to get started</p>
                    </>
                  )}
                  {(previewStatus.status === 'cloning' || previewStatus.status === 'building') && (
                    <>
                      <Loader2 className="h-16 w-16 mx-auto mb-4 text-blue-500 animate-spin" />
                      <p className="text-lg font-medium">{previewStatus.message}</p>
                      <p className="text-sm">This may take a few minutes...</p>
                    </>
                  )}
                  {previewStatus.status === 'error' && (
                    <>
                      <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
                      <p className="text-lg font-medium text-red-600">Preview Failed</p>
                      <p className="text-sm text-gray-600">{previewStatus.message}</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubPreview;
