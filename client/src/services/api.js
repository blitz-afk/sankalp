import supabase from '../firebase/config';

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

function getSupabaseHeaders() {
  return {
    'Content-Type': 'application/json',
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };
}

/**
 * Calls the validate-problem-image edge function with the captured
 * image + title + description. Returns the AI analysis or throws
 * with a user-facing error message.
 */
export async function validateProblemImage({ image, mimeType, title, description }) {
  const session = await supabase.auth.getSession();
  const accessToken = session.data?.session?.access_token;

  const response = await fetch(`${EDGE_FUNCTION_URL}/validate-problem-image`, {
    method: 'POST',
    headers: {
      ...getSupabaseHeaders(),
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ image, mimeType, title, description }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Image validation failed. Please retake the photo.');
  }

  return data.analysis;
}
