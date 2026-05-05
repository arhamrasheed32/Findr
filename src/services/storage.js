import { supabase } from '../config/supabase';

/**
 * Upload an image to Supabase Storage
 * @param {File} file
 * @returns {string} Public URL of the uploaded image
 */
export const uploadImage = async (file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `item-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('images') // Ensure you have a bucket named 'images' in Supabase
    .upload(filePath, file);

  if (uploadError) {
    console.error('Upload Error:', uploadError);
    throw new Error('Failed to upload image to Supabase');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
};
