import supabase from '../firebase/config';

export async function registerCitizen() {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;

  if (!userId) throw new Error('Not authenticated');

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (existing) throw new Error('Profile already exists');

  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, role: 'Citizen' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMyProfile() {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
