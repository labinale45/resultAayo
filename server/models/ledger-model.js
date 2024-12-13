const connectdb = require('../utils/connectdb');

const createLedgerConfiguration = async (configData) => {
  try {
    const createClient = await connectdb();
    
    const { 
      school_name, 
      school_location, 
      pass_percentage, 
      grade_system 
    } = configData;

    // Insert or update ledger configuration
    const { data, error } = await createClient
      .from('ledger_configurations')
      .upsert({
        school_name,
        school_location,
        pass_percentage,
        grade_system: JSON.stringify(grade_system), // Store as JSON string
        created_at: new Date().toISOString()
      }, { 
        onConflict: 'school_name' 
      });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error creating ledger configuration:', error);
    throw error;
  }
};

const getLedgerConfiguration = async (schoolName) => {
  try {
    const createClient = await connectdb();
    
    const { data, error } = await createClient
      .from('ledger_configurations')
      .select('*')
      .eq('school_name', schoolName)
      .single();

    if (error) throw error;

    // Parse grade system back to object
    return {
      ...data,
      grade_system: JSON.parse(data.grade_system)
    };
  } catch (error) {
    console.error('Error fetching ledger configuration:', error);
    throw error;
  }
};

const generateLedgerSheet = async (examData) => {
  try {
    const createClient = await connectdb();
    
    const { 
      year, 
      exam_type, 
      class_name, 
      school_name 
    } = examData;

    // Fetch ledger configuration
    const ledgerConfig = await getLedgerConfiguration(school_name);

    // Fetch students and their marks
    const { data: studentMarks, error } = await createClient
      .from('marksheets')
      .select(`
        students(id, first_name, last_name, rollNo),
        subjects(subject_name),
        TH,
        PR
      `)
      .eq('year', year)
      .eq('exam_type', exam_type)
      .eq('class', class_name);

    if (error) throw error;

    // Calculate total marks, percentage, and grade
    const processedMarks = studentMarks.map(mark => {
      const totalMarks = mark.TH + mark.PR;
      const percentage = (totalMarks / ledgerConfig.total_marks) * 100;
      
      // Determine grade based on percentage
      const grade = determineGrade(percentage, ledgerConfig.grade_system);

      return {
        student: {
          id: mark.students.id,
          name: `${mark.students.first_name} ${mark.students.last_name}`,
          rollNo: mark.students.rollNo
        },
        subject: mark.subjects.subject_name,
        theoryMarks: mark.TH,
        practicalMarks: mark.PR,
        totalMarks,
        percentage,
        grade,
        passed: percentage >= ledgerConfig.pass_percentage
      };
    });

    return {
      ledgerConfig,
      studentMarks: processedMarks
    };
  } catch (error) {
    console.error('Error generating ledger sheet:', error);
    throw error;
  }
};

const determineGrade = (percentage, gradeSystem) => {
  for (const [grade, { min, max }] of Object.entries(gradeSystem)) {
    if (percentage >= min && percentage <= max) {
      return grade;
    }
  }
  return 'F'; // Fail grade if no match
};

module.exports = {
  createLedgerConfiguration,
  getLedgerConfiguration,
  generateLedgerSheet
}; 