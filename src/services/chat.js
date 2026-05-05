import { supabase } from '../config/supabase';

/**
 * Create or get an existing conversation for an item
 */
export const createConversation = async (item_id, participant_ids) => {
  // Check if conversation already exists for this item and these participants
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('item_id', item_id)
    .contains('participant_ids', participant_ids);

  if (existing && existing.length > 0) return existing[0];

  const { data, error } = await supabase
    .from('conversations')
    .insert([{ item_id, participant_ids }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get all conversations for a user
 */
export const getConversations = async (userId) => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, items(*)')
    .contains('participant_ids', [userId]);

  if (error) throw error;
  return data;
};

/**
 * Get all messages for a conversation
 */
export const getMessages = async (conversation_id) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversation_id)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

/**
 * Send a message
 */
export const sendMessage = async (conversation_id, sender_id, text) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ conversation_id, sender_id, text }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Subscribe to new messages in a conversation
 */
export const subscribeToMessages = (conversation_id, onMessage) => {
  return supabase
    .channel(`messages:${conversation_id}`)
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'messages', 
      filter: `conversation_id=eq.${conversation_id}` 
    }, (payload) => {
      onMessage(payload.new);
    })
    .subscribe();
};
