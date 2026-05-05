import { supabase } from '../config/supabase';

/**
 * Create a claim for an item
 * @param {string} item_id
 * @param {string} message
 */
export const createClaim = async (item_id, message) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('claims')
    .insert([
      {
        item_id,
        message,
        claimer_id: user?.id,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get all claims for the logged-in user
 */
export const getClaimsForUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  // Claims I made
  const { data: myClaims, error: err1 } = await supabase
    .from('claims')
    .select('*, items(*)')
    .eq('claimer_id', user?.id);

  // Claims made on my items
  const { data: incomingClaims, error: err2 } = await supabase
    .from('claims')
    .select('*, items(*)')
    .eq('items.reporter_id', user?.id);

  if (err1 || err2) throw (err1 || err2);
  
  // Filter out null items (if join failed or item deleted)
  return { 
    myClaims: myClaims || [], 
    incomingClaims: incomingClaims?.filter(c => c.items) || [] 
  };
};

/**
 * Update the status of a claim
 */
export const updateClaimStatus = async (claim_id, status) => {
  const { data, error } = await supabase
    .from('claims')
    .update({ status })
    .eq('id', claim_id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
