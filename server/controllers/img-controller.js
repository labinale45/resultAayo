const connectdb = require('../utils/connectdb');
const dotenv = require('dotenv');
dotenv.config();

const uploadAvatar = async (req, res) => {
  const supabaseClient = await connectdb();
  try {
    const { username } = req.user;
    const { avatar } = req.body; // Base64 encoded image

    // Get user basic info
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (userError) throw userError;

    // Upload image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('avatars')
      .upload(`${username}-${Date.now()}.jpg`, Buffer.from(avatar.split(',')[1], 'base64'), {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('avatars')
      .getPublicUrl(uploadData.path);

    // Update user's avatar URL in database
    const { error: updateError } = await supabaseClient
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', userData.id);

    if (updateError) throw updateError;

    res.status(200).json({ 
      message: 'Avatar updated successfully',
      avatar_url: publicUrl 
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadAvatar
};
