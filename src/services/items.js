import { supabase } from '../config/supabase';
import { uploadImage } from './storage';

/**
 * Fetch all items, newest first.
 */
export const getItems = async () => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Create a new lost/found item.
 * @param {object} itemData - { title, description, location, date }
 * @param {File|null} imageFile - Optional image file
 */
export const createItem = async (itemData, imageFile) => {
  let imageUrl = null;
  if (imageFile) {
    imageUrl = await uploadImage(imageFile);
  }

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('items')
    .insert([
      {
        ...itemData,
        image_url: imageUrl,
        reporter_id: user?.id,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Fetch a single item by ID.
 */
export const getItemById = async (id) => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};
