const connectdb = require('../utils/connectdb');
const { decode } = require('base64-arraybuffer');

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = await connectdb();


    const {data: teacher, error: teacherError} = await supabase
    .from('teachers')
    .select("teacher_id")
    .eq('id', id)
    .single();
    if (teacherError) throw teacherError;

    const { error: userError } = await supabase
    .from('users')
    .delete()
    .eq('id', teacher.teacher_id);

    if (teacherError) throw error;

    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const supabase = await connectdb();
     console.log("updateData", updateData);
    // Update user information
    if (updateData.email || updateData.username || updateData.password) {
      const { error: userError } = await supabase
        .from('teachers')
        .update(`
            teacher_id:users (
              email: ${updateData.email},
              username: ${updateData.username},
              gender:   ${updateData.gender},
              password: ${updateData.password}
            )
          `)
        .eq('id', id);
       if (userError) throw userError;
    }

    const deletePath = updateData.img_url;
    console.log("deletePath", deletePath);

    const desiredPath = deletePath.split("users/")[1];

    const { error: deleteError } = await supabase.storage
    .from('users')
    .remove([desiredPath]);
   if (deleteError) throw deleteError;


    let imageUrl = null;
      if(updateData.image){
        try {
          // Convert base64 to buffer
          const buffer = Buffer.from(
              updateData.image.replace(/^data:image\/\w+;base64,/, ''),
              'base64'
          );
  
          // Generate unique filename with original file extension
          const matches = updateData.image.match(/^data:image\/([A-Za-z-+\/]+);base64,/);
          const fileExtension = matches ? matches[1].replace('+', '') : 'jpg';
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
          const filePath = `teachers/${fileName}`;
        
          // Upload to Supabase storage with correct content type
          const { error: uploadError } = await supabase.storage
              .from('users')
              .upload(filePath, buffer, {
                  contentType: `image/${fileExtension}`,
                  upsert: false
              });
            if (uploadError) throw uploadError;

            
         
  
          // Get public URL with complete URL path
          const { data: urlData } = await supabase.storage
              .from('users')
              .getPublicUrl(filePath);
  
          // Make sure we have the complete URL from Supabase
          imageUrl = urlData.publicUrl;
          
          // Verify the URL is complete and accessible
          if (!imageUrl.startsWith('http')) {
              // If needed, construct the full Supabase URL
              imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/users/${filePath}`;
          }
  
          console.log('Final imageUrl:', imageUrl);
      } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          return res.status(500).json({
              message: "Failed to upload image",
              error: uploadError.message
          });
      }
      }
    //  // Handle image upload if new image is provided
    // let img_url = updateData.image;
    // if (typeof updateData.image === 'string' && updateData.image.startsWith('data:image')) {
    //   // Extract base64 data from data URL
    //   const base64Data = updateData.image.split(',')[1];
      
    //   const { data: uploadData, error: uploadError } = await supabase.storage
    //     .from('teacher-images')
    //     .upload(`${id}-${Date.now()}.jpg`, decode(base64Data), {
    //       contentType: 'image/jpeg',
    //       upsert: true // Ensure existing image is replaced
    //     });
    //    if (uploadError) throw uploadError;
    //   img_url = uploadData.path; // Update img_url with the new image path
    // }
     // Update teacher information
    const { error: teacherError } = await supabase
      .from('teachers')
      .update({
        first_name: updateData.first_name,
        last_name: updateData.last_name,
        phone_number: updateData.phone_number,
        address: updateData.address,
        dob: updateData.dob,
        img_url: imageUrl // Use the updated img_url
      })
      .eq('id', id);
     if (teacherError) throw teacherError;
     res.status(200).json({ message: 'Teacher updated successfully' });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ error: 'Failed to update teacher' });
  }
};

const getTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = await connectdb();

    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select(`
        *,
        users:teacher_id (
          email,
          username,
          password
        )
      `)
      .eq('id', id)
      .single();

    if (teacherError) throw teacherError;
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Format the response data with default values
    const teacherData = {
      id: teacher.id,
      first_name: teacher.first_name || '',
      last_name: teacher.last_name || '',
      phone_number: teacher.phone_number || '',
      address: teacher.address || '',
      dob: teacher.dob || '',
      gender: teacher.gender || 'Male',
      email: teacher.users?.email || '',
      username: teacher.users?.username || '',
      password: teacher.users?.password || '',
      img_url: teacher.img_url || ''
    };

    res.status(200).json(teacherData);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ error: 'Failed to fetch teacher details' });
  }
};

module.exports = {
  deleteTeacher,
  updateTeacher,
  getTeacher
}; 