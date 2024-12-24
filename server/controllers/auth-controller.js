const connectdb = require('../utils/connectdb');
const auth = require('../models/auth-model');
const mail = require('../models/email-model');
const { verify } = require('jsonwebtoken');
const { createImage } = require('../models/image-model');

const { v4: uuidv4 } = require('uuid');
const { response } = require('express');

const ledgerModel = require('../models/ledger-model');

const createLedgerConfiguration = async (req, res) => {
  try {
    const configData = req.body;
    const result = await ledgerModel.createLedgerConfiguration(configData);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error creating ledger configuration:', error);
    res.status(500).json({ error: 'Failed to create ledger configuration' });
  }
};

const getLedgerConfiguration = async (req, res) => {
  try {
    const { schoolName } = req.params;
    const result = await ledgerModel.getLedgerConfiguration(schoolName);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching ledger configuration:', error);
    res.status(500).json({ error: 'Failed to fetch ledger configuration' });
  }
};

const generateLedgerSheet = async (req, res) => {
  try {
    const examData = req.body;
    const result = await ledgerModel.generateLedgerSheet(examData);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error generating ledger sheet:', error);
    res.status(500).json({ error: 'Failed to generate ledger sheet' });
  }
};


const register = async (req, res) => {
  try {
    const { class_id,last_name,first_name, email, gender, role,address,phone_number,parent_name,dob ,studentClass,image } = req.body;
    const supabaseClient = await connectdb();

        // Generate a unique rollNo based on year, class, and a random number
     const generateUniqueRollNo = async (supabaseClient, year, class_id) => {
       let rollNo;
       let isUnique = false;
        while (!isUnique) {
         const randomNum = Math.floor(Math.random() * 10); // Generate a random digit (0-9)
         rollNo = `${year.toString().slice(-2)}${class_id}${randomNum}`; // Format: YYClassR
          const { data: existingRollNo, error } = await supabaseClient
           .from('users') // Assuming 'users' table contains roll numbers
           .select('rollNo')
           .eq('rollNo', rollNo)
           .single();
          if (!existingRollNo) {
           isUnique = true; // Roll number is unique
         }
       }
       return rollNo;
     };
      const rollNo = await generateUniqueRollNo(supabaseClient, new Date().getFullYear(), class_id);
    
    
    // Check if user already exists
    if(role === 'teachers'){
      const { data: existingUser, error: findError } = await supabaseClient
        .from('users')
        .select('email')
        .eq('email', email)
        .single();
  
  
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }
    }
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


    
    // Send otp to email
   // mail.sentOTP({email});


    // Create new user
   auth.createUser({ rollNo,class_id,username, email, password, gender, role, first_name, last_name, address, phone_number, parent_name,dob,studentClass,image });
   res.status(201).json({
      message : role + " added successfully",	
    });  

    console.log(role + "Added Successfully")

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
            return res.status(404).json({ message: "User incorrect or not found" });
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
        console.log("User data:", userData);

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: 'strict',
            secure: true,
        });

        if (findUser.role === 'teachers') {
          const {data: status, error: statusError} = await supabaseClient
            .from('teachers')
            .select('status')
            .eq('teacher_id', findUser.id)
            .single();

            return res.status(200).json({
                message: findUser.role,
                token,
                userData,
                stat: status.status
            });
        } 
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
    const supabaseClient = await connectdb();
    const { year, class: className, examType,schoolName, schoolAddress, establishmentYear, students, isPublished } = req.body;

    console.log("Received request to publish results", req.body);
    // Validate required fields
    if (!year || !className || !examType || !students) {
      return res.status(400).json({ 
        error: 'Missing required fields: year, class, examType, and students are required' 
      });
    }

    const {data: examData, error: examError} = await supabaseClient
    .from('exams')
    .select('id')
    .eq('exam_type', examType)
    .gte('created_at', `${year}-01-01`)
    .lte('created_at', `${year}-12-31`)
    .single();
    if (examError) {
      throw examError;
    }
    if (!examData) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const {data: classData, error: classError} = await supabaseClient
    .from('class')
    .select('id')
    .eq('class', className)
    .gte('updated_at', `${year}-01-01`)
    .lte('updated_at', `${year}-12-31`)
    .single();

    if (classError) {
      throw classError;
    }
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const subjectsArray = []; // Initialize an array to hold all subjects

    students.forEach(student => {
        const studentSubjects = student.subjects.split(', ').map(subject => subject.trim());
        subjectsArray.push(...studentSubjects); // Add subjects to the array
        console.log(`Subjects for ${student.students}:`, studentSubjects);
    });
    
    // Query the database for subjects based on the first subject in the array
    const { data: subjects, error: subjectsError } = await supabaseClient
        .from('subjects')
        .select('id, subject_name')
        .in('subject_name', subjectsArray) // Use .in() to match any subject in the array
        .eq('class_id', classData.id);

    if (subjectsError) {
      throw subjectsError;
    }
    if (!subjects || subjects.length === 0) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    console.log('Subjects id and Name:', subjects);


    const marksheetid = []; // Holds all marksheet IDs

    students.forEach(student => {
      console.log('This is marksheet Id', student.id);
      marksheetid.push(student.id); // Collecting marksheet IDs
    });
            // Check if a record already exists for each student
    const results = []; // Array to hold results for each student

    for (const student of students) {
      const { data: existingRecord, error: fetchError } = await supabaseClient
        .from('marksheets')
        .select('*')
        .in('id',marksheetid)  
        .gte('updated_at', `${year}-01-01`)
        .lte('updated_at', `${year}-12-31`);

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw fetchError;
      }

      console.log('Existing Record for student:', existingRecord);
      let result;

      // Convert TH and PR arrays to a format suitable for the database
      const thValue = Array.isArray(student.TH) ? student.TH[0] : student.TH; // Use the first element or the value directly
      const prValue = Array.isArray(student.PR) ? student.PR[0] : student.PR; // Use the first element or the value directly

      if (existingRecord && existingRecord.length > 0) {
        // Update existing record for the current student
        const { data, error } = await supabaseClient
          .from('marksheets')
          .update({
            schoolName,
            schoolAddress,
            estdYear: establishmentYear,
            TH: thValue, // Use the converted value
            PR: prValue, // Use the converted value
            isPublished: isPublished,
            updated_at: new Date().toISOString()
          })
          .gte('updated_at', `${year}-01-01`)
          .lte('updated_at', `${year}-12-31`)
          .in('id', marksheetid)
          .select();  

        if (error) throw error;
        result = data;
      } else {
        // Insert new record for the current student
        const { data, error } = await supabaseClient
          .from('marksheets')
          .insert([{
            student_id: student.id, // Use current student's ID
            subject_id: subjects[0].id,
            class: className,
            exam_id: examData.id,
            schoolName,
            schoolAddress,
            estdYear: establishmentYear,
            TH: thValue, // Use the converted value
            PR: prValue, // Use the converted value
            isPublished: isPublished,
            updated_at: new Date().toISOString()
          }])
          .select();

        if (error) throw error;
        result = data;
      }

      if (!result) {
        console.warn(`No result returned for student: ${student.id}`);
      } else {
        results.push(result); // Store the result for the current student
      }
    }

    res.status(200).json({
      message: 'Results published successfully',
      data: results // Return all results
    });

  } catch (error) {
    console.error('Error publishing result:', error);
    res.status(500).json({ 
      error: 'Failed to publish result',
      details: error.message 
    });
  }
};

const getLedgerStatus = async (req, res) => {
  const supabaseClient = await connectdb();
  const { year, class: className, examType } = req.body;
  const { data: ledgerData, error: ledgerError } = await supabaseClient
    .from('ledgers')
    .select('*')
    .eq('class', className)
    .eq('exam_type', examType)
    .eq('year', year)
    .single();

    console.log("ledgerData",ledgerData);
    res.status(200).json({
      message: 'Ledger status fetched successfully',
      data: ledgerData
    });
 
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
    if (userData.role === 'students') {
      const { data: studentData } = await supabaseClient
        .from('students')
        .select('*')
        .eq('student_id', userData.id)
        .single();
      additionalData = studentData;
    } else if (userData.role === 'teachers') {
      const { data: teacherData } = await supabaseClient
        .from('teachers')
        .select('*')
        .eq('teacher_id', userData.id)
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
    if (userData.role === 'students') {
      const { error: updateError } = await supabaseClient
        .from('students')
        .update({ first_name, last_name, phone_number, address })
        .eq('student_id', userData.id);

      if (updateError) throw updateError;
    } else if (userData.role === 'teachers') {
      const { error: updateError } = await supabaseClient
        .from('teachers')
        .update({ first_name, last_name, phone_number, address })
        .eq('teacher_id', userData.id);

      if (updateError) throw updateError;
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTeacherStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Expecting the new status in the request body

  try {
    const supabaseClient = await connectdb();
    if (!supabaseClient) {
      return res.status(500).json({ error: "Database connection failed" });
    }

    // Update the teacher's status in the database
    const { error } = await supabaseClient
      .from("teachers") // Assuming the table is named "teachers"
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating teacher status:", error);
      return res.status(500).json({ error: "Failed to update teacher status" });
    }

    return res.status(200).json({ message: "Teacher status updated successfully" });
  } catch (error) {
    console.error("Server error in updateTeacherStatus:", error);
    return res.status(500).json({ error: error.message || "Failed to update teacher status" });
  }
};

module.exports = {
  login,
  register,
  publishResult,
  getLedgerStatus,
  getUserProfile,
  updateUserProfile,
  updateTeacherStatus,
  createLedgerConfiguration,
  getLedgerConfiguration,
  generateLedgerSheet
};