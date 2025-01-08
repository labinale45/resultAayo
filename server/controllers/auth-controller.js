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
        if (findUser.role === 'students') {
          const {data: status, error: statusError} = await supabaseClient
            .from('sttudents')
            .select('class')
            .eq('student_id', findUser.id)
            .single();

            return res.status(200).json({
                message: findUser.role,
                token,
                userData,
                class: status?.class
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
    const { year, class: className, examType, schoolName, schoolAddress, establishmentYear, students, isPublished } = req.body;

    console.log("Received request to publish results", req.body);
    // Validate required fields
    if (!year || !className || !examType || !students) {
      return res.status(400).json({ 
        error: 'Missing required fields: year, class, examType, and students are required' 
      });
    }

    const { data: examData, error: examError } = await supabaseClient
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
    console.log("Exam ID:", examData.id);

    const { data: classData, error: classError } = await supabaseClient
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

    console.log("Class ID:", classData.id);

   // Create an array of subjects from the students' data (Extract subject names)
   const subjectsArray = students.flatMap(student => Object.keys(student.subjects));

   // Fetch subject details from the database
   const { data: subjects, error: subjectsError } = await supabaseClient
     .from('subjects')
     .select('id, subject_name')
     .in('subject_name', subjectsArray)
     .eq('class_id', classData.id);

   if (subjectsError) throw subjectsError;
   if (!subjects || subjects.length === 0) return res.status(404).json({ error: 'Subject not found' });

   console.log('Subjects id and Name:', subjects);


    const {data: studentData, error: studentError } = await supabaseClient
    .from('students')
    .select('id,rollNo')
    .eq('class', className)
    .gte('updated_at', `${year}-01-01`)
    .lte('updated_at', `${year}-12-31`);
    if (studentError) {
      throw studentError;
    }
    if (!studentData) {
      return res.status(404).json({ error: 'Student not found' });
    }

    console.log('Student Data:', studentData);

    console.log("students : ", students);

    // Loop through each student
    const markSheetsData = []; // Initialize an array to hold mark sheets data

    students.forEach(student => {
      // Find the corresponding student record from `studentData` by rollNo
  const studentRecord = studentData.find(sd => sd.rollNo === student.rollNo);
  if (studentRecord) {
    // Iterate over the subject names (keys) of the student.subjects object
    Object.keys(student.subjects).forEach(subjectName => {
      const subjectData = student.subjects[subjectName]; // Access the marks data for the subject
      const subject = subjects.find(s => s.subject_name === subjectName); // Find the corresponding subject in the DB

      if (subject) {
        // Push the mark sheet data with the relevant theory (TH) and practical (PR) marks
        markSheetsData.push({
          class: className,
          student_id: studentRecord.id, // Use the id of the student found in studentData
          exam_id: examData.id,
          subject_id: subject.id,
          TH: subjectData.theory, // Theory marks
          PR: subjectData.practical, // Practical marks
          updated_at: new Date().toISOString()
        });
      }
    });
  } else {
    console.log(`Student with rollNo ${student.rollNo} not found in the database.`);
  }
});


  // Log the markSetupData to check for undefined values
  console.log("Mark Sheets Data:", markSheetsData);

// Proceed to insert/update mark sheets into the database

for (const mark of markSheetsData) {
  const { student_id, exam_id, subject_id, TH, PR } = mark;

  // Check if student_id or subject_id is undefined
  if (!student_id || !subject_id) {
    console.error(`Skipping entry: student_id or subject_id is undefined. Student ID: ${student_id}, Subject ID: ${subject_id}`);
    continue; // Skip this iteration
  }

  // Perform the database operations (update or insert) here
  try {
    const { data: existingRecord, error: fetchError } = await supabaseClient
      .from('marksheets')
      .select('*')
      .eq("class", className)
      .eq('student_id', student_id) // Check for existing record by student_id
      .eq('exam_id', exam_id) // Check for existing record by exam_id
      .eq('subject_id', subject_id) // Check for existing record by subject_id
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingRecord) {
      const { error } = await supabaseClient
        .from('marksheets')
        .update({
          schoolName,
          schoolAddress,
          estdYear: establishmentYear,
          TH: TH,
          PR: PR,
          isPublished: isPublished,
          updated_at: new Date().toISOString()
        })
        .eq("class", className)
        .eq('student_id', student_id)
        .eq('exam_id', exam_id)
        .eq('subject_id', subject_id);

      if (error) throw error;

      console.log(`Updated result for student ${student_id}, subject ${subject_id}`);
    } else {
      const { error } = await supabaseClient
        .from('marksheets')
        .insert([{
          student_id,
          subject_id,
          class: className,
          exam_id,
          schoolName,
          schoolAddress,
          estdYear: establishmentYear,
          TH,
          PR,
          isPublished,
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      console.log(`Inserted new result for student ${student_id}, subject ${subject_id}`);
    }
  } catch (error) {
    console.error('Error inserting/updating mark sheet:', error);
  }
}

res.status(200).json({
  message: 'Results published successfully',
  data: markSheetsData // Return all results
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

  console.log('Request Body:', req.body);

const { data: examData, error: examError } = await supabaseClient
    .from('exams')
    .select('id')
    .eq('exam_type', examType)
    .gte('created_at', `${year}-01-01`)
    .lte('created_at', `${year}-12-31`)
    .single();

    if (examError) throw examError;
    if (!examData) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    console.log('Exam Data:', examData);

  const { data: ledgerData, error: ledgerError } = await supabaseClient
    .from('marksheets')
    .select('*')
    .eq('class', className)
    .eq('exam_id', examData.id)
    .gte('created_at', `${year}-01-01`)
    .lte('created_at', `${year}-12-31`)
    .eq('isPublished', true)

    console.log("ledgerData",ledgerData);

    res.status(200).json({
      message: ledgerData.length >0 ? 'Ledger status retrieved successfully for ' + ledgerData[0]?.class : "Class "+ className + " Ledger Not Published yet or not found",
      data: ledgerData,
      isPublished: ledgerData[0]?.isPublished || false,
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

const upgradeStudents = async (req, res) => {
  try {
    const { studentIds, targetClass,updateDate } = req.body;
    console.log("studentIds",studentIds,targetClass,updateDate);
    const supabase = await connectdb();

    const{data:classData, error: classError} = await supabase
    .from('class')
    .select('id')
    .eq('class', targetClass)
    .single();

    if (classError) throw classError;
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }



    // Update students' class in both students and users tables
    const { error } = await supabase
      .from('students')
      .update({ class: targetClass, class_id: classData.id, updated_at: updateDate })
      .in('id', studentIds);

    if (error) throw error;

    res.status(200).json({ message: 'Students upgraded successfully' });
  } catch (error) {
    console.error('Error upgrading students:', error);
    res.status(500).json({ error: 'Failed to upgrade students' });
  }
};


module.exports = {
  upgradeStudents,
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