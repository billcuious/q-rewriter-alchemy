
const { createClient } = require('@supabase/supabase-js');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
};

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    if (event.httpMethod === 'POST') {
      const { repoUrl, branch, accessToken, owner, repo } = JSON.parse(event.body);
      
      const buildId = require('crypto').randomUUID();
      
      // Store build status in Supabase
      const { error: insertError } = await supabase
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
      
      // For demo purposes, simulate processing
      setTimeout(async () => {
        await simulateProcessing(supabase, buildId, owner, repo, branch);
      }, 1000);
      
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildId, status: 'started' })
      };
    }
    
    if (event.httpMethod === 'GET') {
      const buildId = event.queryStringParameters?.buildId;
      
      if (!buildId) {
        throw new Error('Build ID is required');
      }
      
      const { data: build, error } = await supabase
        .from('preview_builds')
        .select('*')
        .eq('id', buildId)
        .single();
      
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
      
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: build.status,
          message: build.message || '',
          logs: build.logs || [],
          previewUrl: build.preview_url,
          repoInfo: build.repo_info
        })
      };
    }
    
    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

async function simulateProcessing(supabase, buildId, owner, repo, branch) {
  try {
    // Simulate cloning
    await supabase
      .from('preview_builds')
      .update({ status: 'cloning', message: 'Cloning repository...' })
      .eq('id', buildId);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate building
    await supabase
      .from('preview_builds')
      .update({ 
        status: 'building', 
        message: 'Building project...',
        repo_info: {
          name: `${owner}/${repo}`,
          framework: 'React',
          branch: branch
        }
      })
      .eq('id', buildId);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate completion
    await supabase
      .from('preview_builds')
      .update({ 
        status: 'ready', 
        message: 'Preview is ready!',
        logs: ['Cloning repository...', 'Installing dependencies...', 'Building project...', 'Preview ready!'],
        preview_url: `https://github.com/${owner}/${repo}` // Fallback to GitHub repo
      })
      .eq('id', buildId);
      
  } catch (error) {
    console.error('Processing error:', error);
    
    await supabase
      .from('preview_builds')
      .update({ 
        status: 'error', 
        message: error.message || 'Processing failed'
      })
      .eq('id', buildId);
  }
}
