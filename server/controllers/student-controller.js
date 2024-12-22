const connectdb = require('../utils/connectdb');
const { decode } = require('base64-arraybuffer');
const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("studentid",id);
    const supabase = await connectdb();

    const { data: student, error: studentError } = await supabase
    .from('students')
    .select("student_id")
    .eq('id', id)
    .single();
    
    if (studentError) throw studentError;

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', student.student_id);

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

    console.log(" req id: ", id);

    console.log("updateData", updateData);
    console.log("updateData.password", updateData.password);
    console.log("updateData.change_password", updateData.change_password);

     // Check if password exists before hashing
    let hashedPassword = updateData.change_password ? await bcrypt.hash(updateData.change_password, salt) : updateData.password;

    console.log("hashedPassword", hashedPassword);
    
    const { data: student, error: studError } = await supabase
    .from('students')
    .select("student_id")
    .eq('id', id)
    .single();

    if (studError) throw studError;

     console.log("student", student);
     
     // Update user information
    if (updateData.email || updateData.username || hashedPassword) {
      const { error: userError } = await supabase
        .from('users')
        .update({
          email: updateData.email,
          gender: updateData.gender,
          password: hashedPassword // Only update if hashedPassword is not null
        })
        .eq('id', student.student_id);
      if (userError) throw new Error(`User update error: ${userError.message}`);
    }
     
    if(updateData.img_url && updateData.image ){
      // Delete the old image from storage
    const deletePath = updateData.img_url;
    console.log("deletePath", deletePath);

    const desiredPath = deletePath.split("users/")[1];

    const { error: deleteError } = await supabase.storage
    .from('users')
    .remove([desiredPath]);
   if (deleteError) throw deleteError;
    }

    let imageUrl = null || updateData.img_url;
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
          const filePath = `students/${fileName}`;
        
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

     const { error: studentError } = await supabase
      .from('students')
      .update({
        first_name: updateData.first_name,
        last_name: updateData.last_name,
        phone_number: updateData.phone_number,
        address: updateData.address,
        dob: updateData.dob,
        img_url: imageUrl // Use the updated img_url
      })
      .eq('id', id);
    if (studentError) throw new Error(`Student update error: ${studentError.message}`);
    
    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: error.message || 'Failed to update student' });
  }
};


const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = await connectdb();
    console.log("studentid",id);

    const { data: student, error: studentError } = await supabase
      .from('students')
      .select(`
        *,
        users:student_id (
          email,
          username,
          password,
          gender
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
      gender: student.users?.gender || 'Male',
      email: student.users?.email || '',
      username: student.users?.username || '',
      password: student.users?.password || '',
      img_url: student.img_url || ''
    };
    console.log("student Data",studentData);
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