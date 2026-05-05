import { supabase } from '../config/supabase';

/**
 * Sign up a new user with email and password
 * @param {string} email
 * @param {string} password
 * @param {string} name
 */
export const signUp = async (email, password, name) => {
  if (!email.endsWith('@srmist.edu.in')) {
    throw new Error('Only @srmist.edu.in emails are allowed.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) throw error;
  return data;
};

/**
 * Sign in with email and password
 * @param {string} email
 * @param {string} password
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Get the currently logged-in user and their profile
 */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch extra details from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { ...user, ...profile };
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return { data: { subscription } };
};
