const connectdb = require('../utils/connectdb');
const { decode } = require('base64-arraybuffer');

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = await connectdb();

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ message: 'student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const supabase = await connectdb();

    // Update user information
    if (updateData.email || updateData.username || updateData.password) {
      const { error: userError } = await supabase
        .from('students')
        .update(`
            users:student_id (
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
        .from('student-images')
        .upload(`${id}-${Date.now()}.jpg`, decode(base64Data), {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) throw uploadError;
      img_url = uploadData.path;
    }

    // Update student information
    const { error: studentError } = await supabase
      .from('students')
      .update({
        fullName: `${updateData.first_name} ${updateData.last_name}`,
        contact: updateData.phone_number,
        address: updateData.address,
        dateOfBirth: updateData.dob,
        gender: updateData.gender,
        img_url: img_url
      })
      .eq('id', id);

    if (studentError) throw studentError;

    res.status(200).json({ message: 'student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = await connectdb();

    const { data: student, error: studentError } = await supabase
      .from('students')
      .select(`
        *,
        users:student_id (
          email,
          username,
          password
        )
      `)
      .eq('id', id)
      .single();

    if (studentError) throw studentError;
    if (!student) {
      return res.status(404).json({ error: 'student not found' });
    }

    // Format the response data with default values
    const studentData = {
      id: student.id,
      first_name: student.first_name || '',
      last_name: student.last_name || '',
      phone_number: student.phone_number || '',
      address: student.address || '',
      dob: student.dob || '',
      gender: student.gender || 'Male',
      email: student.users?.email || '',
      username: student.users?.username || '',
      password: student.users?.password || '',
      img_url: student.img_url || ''
    };

    res.status(200).json(studentData);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student details' });
  }
};

module.exports = {
  deleteStudent,
  updateStudent,
  getStudent
}; 