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


const login= async(req,res)=>{
    const supabaseClient = await connectdb();
    try{
    const {username,password}=req.body;
    const findUser = await supabaseClient
    .from('users')
    .select('*')
    .eq('username',username)
    .single();
    
    if(!findUser.data){
        throw new Error("User not found");
      }
    const isPasswordValid = await auth.comparePassword(password,findUser.data.password);
    if(isPasswordValid){
      
      // Generate token
      const token = await auth.generateToken(findUser.data.id, findUser.data.role, findUser.data.username);

      res.status(200).json({message:findUser.data.role,token});

      // if(findUser.data.role ==="Student"){
      //   res.status(200).json({message:"Student"});
        
      // }else if(findUser.data.role==="Teacher"){
      //   res.status(200).json({message:"Teacher"});
        
      // }else if(findUser.data.role==="Admin"){
      //   res.status(200).json({message:"Admin"});
      // }
    }
    else{
        throw new Error("Invalid password");
      }
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

module.exports = {login,register};

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
module.exports = {
  login,
  register,
  publishResult,
};
