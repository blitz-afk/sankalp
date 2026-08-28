import supabase from '../firebase/config';

export async function createProblem({ title, description, imageBlob, location, aiAnalysis }) {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) throw new Error('Not authenticated');

  const fileName = `${userId}/${Date.now()}.jpg`;
  const { error: uploadError } = await supabase
    .storage
    .from('problem-images')
    .upload(fileName, imageBlob, { contentType: 'image/jpeg', upsert: false });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase
    .storage
    .from('problem-images')
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('problems')
    .insert({
      title: title.trim(),
      description: description.trim(),
      media_url: urlData.publicUrl,
      location,
      ai_analysis: aiAnalysis,
      status: 'Submitted',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMyProblems() {
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
