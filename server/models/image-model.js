  const dotenv = require('dotenv');
  dotenv.config();

  const createImage = async (image, userRole, userId) => {
      try {
          // Convert base64 to buffer
          const buffer = Buffer.from(
              image.replace(/^data:image\/\w+;base64,/, ''),
              'base64'
          );

          // Generate unique filename with original file extension
          const matches = image.match(/^data:image\/([A-Za-z-+\/]+);base64,/);
          const fileExtension = matches ? matches[1].replace('+', '') : 'jpg';
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
        
          // Determine bucket path based on user role
          const bucketName = 'users';
          const folderPath = userRole.toLowerCase() + 's'; // 'students' or 'teachers'
          const filePath = `${folderPath}/${fileName}`;

          // Upload to appropriate Supabase storage bucket
          const { error: uploadError } = await createClient.storage
              .from(bucketName)
              .upload(filePath, buffer, {
                  contentType: `image/${fileExtension}`,
                  upsert: false
              });

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: urlData } = await createClient.storage
              .from(bucketName)
              .getPublicUrl(filePath);

          let imageUrl = urlData.publicUrl;

          // Ensure complete URL
          if (!imageUrl.startsWith('http')) {
              imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucketName}/$server\models\image-model.js`;
          }

          // Update the appropriate table with the image URL
          const tableName = userRole.toLowerCase() + 's'; // 'students' or 'teachers'
          const { error: updateError } = await createClient
              .from(tableName)
              .update({ img_url: imageUrl })
              .eq('user_id', userId);

          if (updateError) throw updateError;

          return imageUrl;

      } catch (error) {
          console.error('Error handling image:', error);
          throw error;
      }
  }

  module.exports = {
      createImage
  }