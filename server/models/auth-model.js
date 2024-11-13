
const connectdb = require('../utils/connectdb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const salt = bcrypt.genSaltSync(10);

const createUser = async (userData) => {

  try {
    const createClient = await connectdb();

    // Destructure userData
    const { image,studentClass,first_name, last_name, address, phone_number, parent_name, username, email, password, role, gender, dob } = userData;

    // Debugging role and gender
    console.log('Creating user with role:', role, 'and gender:', gender);

    // Validate role and gender before inserting (Optional but recommended)
    const validRoles = ['Admin', 'teachers', 'students'];
    const validGenders = ['Male','Female','Others'];

    if (!validRoles.includes(role)) {
      throw new Error(`Invalid role: ${role}. Allowed roles are: ${validRoles.join(', ')}`);
    }

    if (!validGenders.includes(gender)) {
      throw new Error(`Invalid gender: ${gender}. Allowed genders are: ${validGenders.join(', ')}`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into users table
    const { data: userRecord, error: userError } = await createClient
      .from('users')
      .insert([{ email, username, password: hashedPassword, role, gender, created_at: new Date().toISOString() }]);
    
    if (userError) throw userError;

    // Insert additional data based on role
    if (role === "teachers") {
      let imageUrl = null;
      if(image){
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
          const filePath = `teachers/${fileName}`;
  
          // Upload to Supabase storage with correct content type
          const { error: uploadError } = await createClient.storage
              .from('users')
              .upload(filePath, buffer, {
                  contentType: `image/${fileExtension}`,
                  upsert: false
              });
  
          if (uploadError) throw uploadError;
  
          // Get public URL with complete URL path
          const { data: urlData } = await createClient.storage
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
      const { data: teacherRecord, error: teacherError } = await createClient
        .from('teachers')
        .insert([{first_name, last_name, address, phone_number, dob,img_url: imageUrl,created_at: new Date().toISOString() }]);

      if (teacherError) throw teacherError;
    } 
    else if (role === "students") {

      let imageUrl = null;
      if(image){
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
          const filePath = `students/${fileName}`;
  
          // Upload to Supabase storage with correct content type
          const { error: uploadError } = await createClient.storage
              .from('users')
              .upload(filePath, buffer, {
                  contentType: `image/${fileExtension}`,
                  upsert: false
              });
  
          if (uploadError) throw uploadError;
  
          // Get public URL with complete URL path
          const { data: urlData } = await createClient.storage
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
      const { data: studentRecord, error: studentError } = await createClient
        .from('students')
        .insert([{first_name, last_name, address, phone_number, parent_name,img_url: imageUrl, created_at: new Date().toISOString() }]);
      
        if (studentError) throw studentError;
    }
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;
  }
};




const comparePassword = async (candidatePassword, hashedPassword) => {
  try {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  } catch (err) {
    throw err;
  }
};

const generateToken = async (userId, role, gender) => {
  try {
    const token = jwt.sign({ id: userId, gender, role }, process.env.JWT_SECRET, {
      expiresIn: '15d',
    });
    return token;
  } catch (err) {
    throw err;
  }
};

const getUserById = async (userId) => {
  try {
    const createClient = await connectdb();
    const { data, error } = await createClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user by ID:', error.message);
    throw error;
  }
};

module.exports = {
  createUser,
  comparePassword,
  generateToken,
  getUserById,
};