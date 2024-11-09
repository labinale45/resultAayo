const connectdb = require('../utils/connectdb');
const auth = require('../models/auth-model');
const mail = require('../models/email-model');
const { verify } = require('jsonwebtoken');


const register = async (req, res) => {
  try {
    const { last_name,first_name, email, gender, role,address,phone_number,parent_name,dob ,studentClass } = req.body;
    const supabaseClient = await connectdb();

    
    //Generate random username
    const generateUsername = (first_name, last_name) => {
      const safeFirstName = (first_name || '').toLowerCase().replace(/\s/g, '');
      const safeLastName = (last_name || '').toLowerCase().replace(/\s/g, '');
      //random position of the name
      const nameParts = [safeFirstName, safeLastName];
      nameParts.sort(() => Math.random() - 0.5);
      
      return nameParts.join('') + Math.floor(10 + Math.random() * 90);
    };
    
    
    const username = generateUsername(first_name,last_name);

    //Generate random password
    const generatePassword = () => {
      return Math.random().toString(36).slice(-8);
    };
    const password = generatePassword();


    // Check if user already exists
    const { data: existingUser, error: findError } = await supabaseClient
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      throw new Error("User already exists");
    }
    // Send otp to email
   // mail.sentOTP({email});


    // Create new user
   auth.createUser({ username, email, password, gender, role, first_name, last_name, address, phone_number, parent_name,dob,studentClass });
   res.status(201).json({
      message : role + " added successfully",	
    });  
    try{// Send email with username and password
      mail.sendMail({email,username,password});
    }catch(error){
      console.log(error);
    }

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


const login = async(req,res) => {
    const supabaseClient = await connectdb();
    try {
        const {username, password} = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const { data: findUser, error: userError } = await supabaseClient
            .from('users')
            .select(`
                *
            `)
            .eq('username', username)
            .single();
        
        if (userError || !findUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await auth.comparePassword(password, findUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = await auth.generateToken(findUser.id, findUser.role, findUser.username);
        
        const userData = {
            id: findUser.id,
            username: findUser.username,
            email: findUser.email,
            role: findUser.role,
            created_at: findUser.created_at,
            ...(findUser.students?.[0] || findUser.teachers?.[0] || {})
        };

        return res.status(200).json({
            message: findUser.role,
            token,
            userData
        });
    } catch(error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const publishResult = async (req, res) => {
  try {
    const { year, className, examType } = req.body;
    const supabaseClient = await connectdb();

    const { data, error } = await supabaseClient
      .from('exam_results')
      .update({ published: true, publishedAt: new Date() })
      .match({ year, class: className, exam_type: examType });

    if (error) throw error;

    res.status(200).json({ message: 'Result published successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  const supabaseClient = await connectdb();
  try {
    const { username } = req.params;
    
    // Get user basic info
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (userError) throw userError;

    // Get role-specific data
    let additionalData = null;
    if (userData.role === 'Student') {
      const { data: studentData } = await supabaseClient
        .from('students')
        .select('*')
        .eq('user_id', userData.id)
        .single();
      additionalData = studentData;
    } else if (userData.role === 'Teacher') {
      const { data: teacherData } = await supabaseClient
        .from('teachers')
        .select('*')
        .eq('user_id', userData.id)
        .single();
      additionalData = teacherData;
    }

    res.status(200).json({
      ...userData,
      ...additionalData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const supabaseClient = await connectdb();
  try {
    const { username } = req.user;
    const { first_name, last_name, phone_number, address } = req.body;

    // Get user basic info
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (userError) throw userError;

    // Update role-specific table
    if (userData.role === 'Student') {
      const { error: updateError } = await supabaseClient
        .from('students')
        .update({ first_name, last_name, phone_number, address })
        .eq('user_id', userData.id);

      if (updateError) throw updateError;
    } else if (userData.role === 'Teacher') {
      const { error: updateError } = await supabaseClient
        .from('teachers')
        .update({ first_name, last_name, phone_number, address })
        .eq('user_id', userData.id);

      if (updateError) throw updateError;
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  register,
  publishResult,
  getUserProfile,
  updateUserProfile
};
