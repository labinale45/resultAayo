
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
    const { studentClass,first_name, last_name, address, phone_number, parent_name, username, email, password, role, gender, dob } = userData;

    // Debugging role and gender
    console.log('Creating user with role:', role, 'and gender:', gender);

    // Validate role and gender before inserting (Optional but recommended)
    const validRoles = ['Admin', 'Teacher', 'Student'];
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
    if (role === "Teacher") {
      const { data: teacherRecord, error: teacherError } = await createClient
        .from('teachers')
        .insert([{first_name, last_name, address, phone_number, dob,created_at: new Date().toISOString() }]);

      if (teacherError) throw teacherError;
    } 
    else if (role === "Student") {
      const { data: studentRecord, error: studentError } = await createClient
        .from('students')
        .insert([{first_name, last_name, address, phone_number, parent_name, created_at: new Date().toISOString() }]);
      
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
