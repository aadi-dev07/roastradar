
// This is a Cloudflare Worker script
// Deploy this to Cloudflare Workers (https://workers.cloudflare.com/)

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Set up CORS headers for preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders()
    })
  }

  try {
    const url = new URL(request.url)
    const path = url.pathname
    
    // Handle Reddit API token request
    if (path === '/reddit/token') {
      return await handleRedditToken(request)
    }
    
    // Handle Reddit search request
    if (path === '/reddit/search') {
      return await handleRedditSearch(request)
    }
    
    return new Response('Not found', { status: 404 })
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 })
  }
}

// Default CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  }
}

// Handle Reddit OAuth token requests
async function handleRedditToken(request) {
  const data = await request.json()
  const { clientId, clientSecret } = data
  
  if (!clientId || !clientSecret) {
    return new Response(
      JSON.stringify({ error: 'Missing Reddit API credentials' }), 
      {
        status: 400,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
      }
    )
  }
  
  // Basic Auth for Reddit API
  const token = btoa(`${clientId}:${clientSecret}`)
  
  try {
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })
    
    const data = await response.json()
    
    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to get Reddit access token' }),
      {
        status: 500,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
      }
    )
  }
}

// Handle Reddit search requests
async function handleRedditSearch(request) {
  const { searchParams } = new URL(request.url)
  const accessToken = request.headers.get('X-Reddit-Access-Token')
  
  if (!accessToken) {
    return new Response(
      JSON.stringify({ error: 'Missing Reddit access token' }), 
      {
        status: 400,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
      }
    )
  }
  
  // Forward all search parameters
  const url = new URL('https://oauth.reddit.com/search.json')
  for (const [key, value] of searchParams.entries()) {
    url.searchParams.append(key, value)
  }
  
  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    
    const data = await response.json()
    
    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to search Reddit' }),
      {
        status: 500,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
      }
    )
  }
}
