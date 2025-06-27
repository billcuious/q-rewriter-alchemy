
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GitHubFile {
  name: string;
  path: string;
  content: string;
  type: 'file' | 'dir';
}

interface RepoInfo {
  name: string;
  framework: string;
  branch: string;
  packageManager: string;
  buildCommand: string;
  devCommand: string;
}

class GitHubPreviewService {
  private supabase: any;
  
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async fetchRepository(owner: string, repo: string, branch: string, accessToken?: string): Promise<GitHubFile[]> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Preview-Service'
    };
    
    if (accessToken) {
      headers['Authorization'] = `token ${accessToken}`;
    }

    const files: GitHubFile[] = [];
    
    // Fetch repository contents recursively
    await this.fetchDirectoryContents(owner, repo, branch, '', files, headers);
    
    return files;
  }

  private async fetchDirectoryContents(
    owner: string, 
    repo: string, 
    branch: string, 
    path: string, 
    files: GitHubFile[], 
    headers: Record<string, string>
  ): Promise<void> {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    
    try {
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      const contents = await response.json();
      
      if (Array.isArray(contents)) {
        for (const item of contents) {
          if (item.type === 'file') {
            // Skip large files and certain file types
            if (item.size > 1000000) continue; // Skip files > 1MB
            if (this.shouldSkipFile(item.name)) continue;
            
            const fileContent = await this.fetchFileContent(item.download_url);
            files.push({
              name: item.name,
              path: item.path,
              content: fileContent,
              type: 'file'
            });
          } else if (item.type === 'dir' && !this.shouldSkipDirectory(item.name)) {
            await this.fetchDirectoryContents(owner, repo, branch, item.path, files, headers);
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching directory ${path}:`, error);
      throw error;
    }
  }

  private async fetchFileContent(downloadUrl: string): Promise<string> {
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error fetching file content:', error);
      return '';
    }
  }

  private shouldSkipFile(filename: string): boolean {
    const skipExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot'];
    const skipFiles = ['.DS_Store', 'Thumbs.db', '.git'];
    
    return skipExtensions.some(ext => filename.toLowerCase().endsWith(ext)) ||
           skipFiles.some(file => filename === file);
  }

  private shouldSkipDirectory(dirname: string): boolean {
    const skipDirs = ['.git', 'node_modules', '.next', 'dist', 'build', '.nuxt', 'coverage'];
    return skipDirs.includes(dirname);
  }

  detectFramework(files: GitHubFile[]): RepoInfo {
    let framework = 'Unknown';
    let packageManager = 'npm';
    let buildCommand = 'npm run build';
    let devCommand = 'npm run dev';
    
    const packageJsonFile = files.find(f => f.name === 'package.json');
    
    if (packageJsonFile) {
      try {
        const packageJson = JSON.parse(packageJsonFile.content);
        
        // Detect framework
        if (packageJson.dependencies?.react || packageJson.devDependencies?.react) {
          framework = 'React';
          if (packageJson.dependencies?.next || packageJson.devDependencies?.next) {
            framework = 'Next.js';
          } else if (packageJson.dependencies?.vite || packageJson.devDependencies?.vite) {
            framework = 'React + Vite';
          }
        } else if (packageJson.dependencies?.vue || packageJson.devDependencies?.vue) {
          framework = 'Vue.js';
          if (packageJson.dependencies?.nuxt || packageJson.devDependencies?.nuxt) {
            framework = 'Nuxt.js';
          }
        } else if (packageJson.dependencies?.angular || packageJson.devDependencies?.angular) {
          framework = 'Angular';
        } else if (packageJson.dependencies?.svelte || packageJson.devDependencies?.svelte) {
          framework = 'Svelte';
        }
        
        // Detect package manager
        if (files.find(f => f.name === 'yarn.lock')) {
          packageManager = 'yarn';
          buildCommand = 'yarn build';
          devCommand = 'yarn dev';
        } else if (files.find(f => f.name === 'pnpm-lock.yaml')) {
          packageManager = 'pnpm';
          buildCommand = 'pnpm build';
          devCommand = 'pnpm dev';
        }
        
        // Override with custom scripts if available
        if (packageJson.scripts?.build) {
          buildCommand = `${packageManager} run build`;
        }
        if (packageJson.scripts?.dev) {
          devCommand = `${packageManager} run dev`;
        } else if (packageJson.scripts?.start) {
          devCommand = `${packageManager} start`;
        }
        
      } catch (error) {
        console.error('Error parsing package.json:', error);
      }
    } else {
      // Check for vanilla HTML/JS
      if (files.find(f => f.name === 'index.html')) {
        framework = 'HTML/JS';
        buildCommand = 'none';
        devCommand = 'serve';
      }
    }
    
    return {
      name: '',
      framework,
      branch: '',
      packageManager,
      buildCommand,
      devCommand
    };
  }

  async buildProject(files: GitHubFile[], repoInfo: RepoInfo): Promise<{ success: boolean; logs: string[]; error?: string }> {
    const logs: string[] = [];
    
    try {
      logs.push('Starting build process...');
      
      // For demonstration, we'll simulate a build process
      // In a real implementation, you'd set up a containerized environment
      
      if (repoInfo.framework === 'HTML/JS') {
        logs.push('Static HTML project detected - no build required');
        return { success: true, logs };
      }
      
      logs.push(`Detected framework: ${repoInfo.framework}`);
      logs.push(`Using package manager: ${repoInfo.packageManager}`);
      
      // Simulate package installation
      logs.push('Installing dependencies...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      logs.push('Dependencies installed successfully');
      
      // Simulate build process
      if (repoInfo.buildCommand !== 'none') {
        logs.push(`Running build command: ${repoInfo.buildCommand}`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        logs.push('Build completed successfully');
      }
      
      logs.push('Project ready for preview');
      return { success: true, logs };
      
    } catch (error) {
      logs.push(`Build failed: ${error.message}`);
      return { success: false, logs, error: error.message };
    }
  }

  async createPreview(buildId: string, files: GitHubFile[]): Promise<string> {
    // In a real implementation, you would:
    // 1. Store the built files in a cloud storage service
    // 2. Create a unique URL for the preview
    // 3. Set up a simple HTTP server to serve the files
    
    // For this demo, we'll create a simple preview URL
    const previewUrl = `https://your-netlify-site.netlify.app/preview/${buildId}`;
    
    return previewUrl;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const service = new GitHubPreviewService(supabaseUrl, supabaseKey);
    
    if (req.method === 'POST') {
      const { repoUrl, branch, accessToken, owner, repo } = await req.json();
      
      const buildId = crypto.randomUUID();
      
      // Store build status in Supabase
      const { error: insertError } = await service.supabase
        .from('preview_builds')
        .insert({
          id: buildId,
          repo_url: repoUrl,
          branch: branch,
          status: 'cloning',
          created_at: new Date().toISOString()
        });
      
      if (insertError) {
        throw new Error(`Database error: ${insertError.message}`);
      }
      
      // Start async processing
      processRepository(service, buildId, owner, repo, branch, accessToken);
      
      return new Response(
        JSON.stringify({ buildId, status: 'started' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const buildId = url.searchParams.get('buildId');
      
      if (!buildId) {
        throw new Error('Build ID is required');
      }
      
      const { data: build, error } = await service.supabase
        .from('preview_builds')
        .select('*')
        .eq('id', buildId)
        .single();
      
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
      
      return new Response(
        JSON.stringify({
          status: build.status,
          message: build.message || '',
          logs: build.logs || [],
          previewUrl: build.preview_url,
          repoInfo: build.repo_info
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function processRepository(
  service: GitHubPreviewService,
  buildId: string,
  owner: string,
  repo: string,
  branch: string,
  accessToken?: string
) {
  try {
    // Update status to cloning
    await service.supabase
      .from('preview_builds')
      .update({ status: 'cloning', message: 'Cloning repository...' })
      .eq('id', buildId);
    
    // Fetch repository files
    const files = await service.fetchRepository(owner, repo, branch, accessToken);
    
    // Detect framework and setup
    const repoInfo = service.detectFramework(files);
    repoInfo.name = `${owner}/${repo}`;
    repoInfo.branch = branch;
    
    // Update status to building
    await service.supabase
      .from('preview_builds')
      .update({ 
        status: 'building', 
        message: 'Building project...',
        repo_info: repoInfo
      })
      .eq('id', buildId);
    
    // Build the project
    const buildResult = await service.buildProject(files, repoInfo);
    
    if (buildResult.success) {
      // Create preview
      const previewUrl = await service.createPreview(buildId, files);
      
      // Update status to ready
      await service.supabase
        .from('preview_builds')
        .update({ 
          status: 'ready', 
          message: 'Preview is ready!',
          logs: buildResult.logs,
          preview_url: previewUrl
        })
        .eq('id', buildId);
    } else {
      // Update status to error
      await service.supabase
        .from('preview_builds')
        .update({ 
          status: 'error', 
          message: buildResult.error || 'Build failed',
          logs: buildResult.logs
        })
        .eq('id', buildId);
    }
    
  } catch (error) {
    console.error('Processing error:', error);
    
    // Update status to error
    await service.supabase
      .from('preview_builds')
      .update({ 
        status: 'error', 
        message: error.message || 'Processing failed'
      })
      .eq('id', buildId);
  }
}
