const connectdb = require('../utils/connectdb');
const { decode } = require('base64-arraybuffer');

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = await connectdb();

    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id);

    if (error) throw error;

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

    // Update user information
    if (updateData.email || updateData.username || updateData.password) {
      const { error: userError } = await supabase
        .from('teachers')
        .update(`
            users:teacher_id (
              email: ${updateData.email},
              username: ${updateData.username},
              password: ${updateData.password}
            )
          `)
        // .update({
        //   email: updateData.email,
        //   username: updateData.username,
        //   password: updateData.password
        // })
        .eq('id', id);

      if (userError) throw userError;
    }

    // Handle image upload if new image is provided
    let img_url = updateData.image;
    if (updateData.image && updateData.image.startsWith('data:image')) {
      // Extract base64 data from data URL
      const base64Data = updateData.image.split(',')[1];
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('teacher-images')
        .upload(`${id}-${Date.now()}.jpg`, decode(base64Data), {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) throw uploadError;
      img_url = uploadData.path;
    }

    // Update teacher information
    const { error: teacherError } = await supabase
      .from('teachers')
      .update({
        fullName: `${updateData.first_name} ${updateData.last_name}`,
        contact: updateData.phone_number,
        address: updateData.address,
        dateOfBirth: updateData.dob,
        gender: updateData.gender,
        img_url: img_url
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