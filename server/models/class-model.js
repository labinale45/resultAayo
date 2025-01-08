const connectdb = require('../utils/connectdb');	
const dotenv = require('dotenv');

dotenv.config();


const createClass = async (userData) => {
    try {
        if (!userData.className || !userData.sec) {
            throw new Error("Incomplete class data");
        }
        const createClient = await connectdb();
        const sanitizedSec = userData.sec.trim().toUpperCase();
        const { data: classData, error: classError } = await createClient
            .from('class')
            .insert({
                class: userData.className,
                sec: sanitizedSec,
                // updated_at will be automatically set by Supabase
            })
            .select();

        if (classError) throw classError;
        return classData;
    } catch (error) {
        console.error("Error creating class:", error);
        throw error;
    }
}

const getClass = async ()=>{
    try {
        const createClient = await connectdb();
        const {data,error} = await createClient
        .from('class')
        .select('*');
        if(error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching class:", error);
    }
}

const createSubject = async (userData, classId) => {
    try {
        if(!userData.subject){
            throw new Error("Incomplete class data");
        }

        const createClient = await connectdb();
        const subjectPromises = userData.subject.map(subject => 
            createClient
                .from('subjects')
                .insert({ 
                    subject_name: subject.trim().toLowerCase(),
                    class_id: classId
                })
        );

        const results = await Promise.all(subjectPromises);
        
        const errors = results.filter(result => result.error);
        if (errors.length > 0) {
            throw new Error(`Error creating subjects: ${errors[0].error.message}`);
        }

        return results.map(result => result.data);
    }
    catch (error) {
        console.error("Error creating subject:", error);
        throw error;
    }
};

const getSubjects = async ()=>{
    try {
        const createClient = await connectdb();
        const {data,error} = await createClient
        .from('subjects')
        .select('*');
        if(error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching subjects:", error);
    }
}

const getSubjectsByClass = async (classId, section, year) => {
    try {
        const createClient = await connectdb();
        console.log("class model: ", classId, section, year);

        const { data: classData, error: classError } = await createClient
            .from('class')
            .select('id')
            .eq('class', classId)
            .eq('sec', section)
            .gte('updated_at', `${year}-01-01`)
            .lte('updated_at', `${year}-12-31`);

        if (classError) throw classError;
        if (!classData || classData.length === 0) {
            return [];
        }

        const { data: subjectsData, error: subjectsError } = await createClient
            .from('subjects')
            .select(`
                id,
                subject_name,
                teacher_id:teachers(
                    id,
                    first_name,
                    last_name
                ),
                class_id:class(
                    classTeacher:teachers(
                        id,
                        teacher_id
                    )
                )
            `)
            .eq('class_id', classData[0].id);
            console.log("subjectsData: ", subjectsData);

        if (subjectsError) throw subjectsError;

        // Get marks data for each subject
        const subjectsWithMarks = await Promise.all(subjectsData.map(async (subject) => {
            console.log(subject.id);
            const { data: marksData, error: marksError } = await createClient
                .from('marksheets')
                .select('TH,PR')
                .eq('subject_id', subject.id);

            if (marksError) throw marksError;

            const theoryTotal = marksData.reduce((sum, mark) => sum + (Number(mark.TH) || 0), 0);
            const practicalTotal = marksData.reduce((sum, mark) => sum + (Number(mark.PR) || 0), 0);
            
            const theoryAverage = marksData.length ? Math.round((theoryTotal / marksData.length) * 100) / 100 : 0;
            const practicalAverage = marksData.length ? Math.round((practicalTotal / marksData.length) * 100) / 100 : 0;
            return {
                id: subject.id,
                name: subject.subject_name,
                ctId: subject.class_id.classTeacher?.id|| "",
                classTeacher: subject.class_id.classTeacher?.teacher_id || "",
                teacher: subject.teacher_id ? `${subject.teacher_id.first_name} ${subject.teacher_id.last_name}` : '',
                theoryAverage,
                practicalAverage
            };
        }));

        return subjectsWithMarks;

    } catch (error) {
        console.error("Error fetching subjects:", error);
        return [];
    }
};


const assignTeacher = async (subjectId, teacherId, classId, section, classTeacher) => {
    try {
        const createClient = await connectdb();       


        // Update the subject with the teacher ID
        const { data: subjectData, error: subjectError } = await createClient
            .from('subjects')
            .update({ 
                teacher_id: teacherId,
                updated_at: new Date().toISOString()
            })
            .eq('id', subjectId)
            .select();

        if (subjectError) throw subjectError;

        const { data: classData, error: classError } = await createClient
        .from('class')
        .update({
            classTeacher: classTeacher,
            updated_at: new Date().toISOString()
        })
        .eq('class', classId)
        .eq('sec', section)
        .select();

    if (classError) throw classError;

        return { subjectData, classData }; // Return both subject and class data
    } catch (error) {
        console.error("Error assigning teacher:", error);
        throw error;
    }
};

const getTeachers = async () => {
    try {
        const createClient = await connectdb();
        const { data, error } = await createClient
            .from('teachers')
            .select('id, first_name, last_name')
            .eq('status', 'active');
            
        if (error) throw error;
        return data.map(teacher => ({
            id: teacher.id,
            name: `${teacher.first_name} ${teacher.last_name}`
        }));
    } catch (error) {
        console.error("Error fetching teachers:", error);
        return [];
    }
};

const getClassesByTeacher = async (teacherId,year) => {
    try {
        console.log("Model teacher Id and year:", teacherId, year);
        const createClient = await connectdb();

        const { data: teacherData, error: teacherError } = await createClient
        .from('teachers')
        .select('id')
        .eq('teacher_id', teacherId)

        if (teacherError) {
            console.error("Teacher Query Error: ", teacherError);
            throw teacherError;
        }
        if (!teacherData || teacherData.length === 0) {
            console.warn("No teacher data found.");
            return { classes: [], count: 0 };
        }

        const { data: assignedClass, error: assignedClassError } = await createClient
            .from('subjects')
            .select(`class_id:class(class, sec)`)
            .eq('teacher_id', teacherData[0].id)
            .gte('created_at', `${year}-01-01`)
            .lte('created_at', `${year}-12-31}`)

        if (assignedClassError) {
            console.error("Query Error: ", assignedClassError);
            throw assignedClassError;
        }

        console.log("Model Data: ", assignedClass);
        
        if (assignedClass.length === 0) {
            console.warn("No classes assigned for this teacher.");
        }

         const uniqueClassesWithSections = new Set();

         const classes = (assignedClass || []).map(item => {
             const className = item.class_id?.class || '';
             const section = item.class_id?.sec || '';
             if (className && section) {
                 uniqueClassesWithSections.add(JSON.stringify({ class: className, section: section }));
             }
             return { class: className, section: section };
         });
         
         const uniqueClasses = Array.from(uniqueClassesWithSections).map(item => JSON.parse(item));
         
         return {
             classes: uniqueClasses,
             count: uniqueClasses.length
         };
    } catch (error) {
        console.error("Error in getClassesByTeacher: ", error);
        return { classes: [], count: 0 };
    }
};


const getClassByTeacher = async (teacherId, year) => {
    try {
        console.log("Model teacher Id and year:", teacherId, year);
        const createClient = await connectdb();

        const { data: teacherData, error: teacherError } = await createClient
        .from('teachers')
        .select('id')
        .eq('teacher_id', teacherId)

        if (teacherError) {
            console.error("Teacher Query Error: ", teacherError);
            throw teacherError;
        }
        if (!teacherData || teacherData.length === 0) {
            console.warn("No teacher data found.");
            return [];
        }

        const { data: assignedClass, error: assignedClassError } = await createClient
            .from('class')
            .select(`
                id,
                class, 
                sec,
                updated_at
            `)
            .eq('classTeacher', teacherData[0].id)
            .gte('updated_at', `${year}-01-01`)
            .lte('updated_at', `${year}-12-31`);

        if (assignedClassError) {
            console.error("Query Error: ", assignedClassError);
            throw assignedClassError;
        }

        const classesWithCounts = await Promise.all(
            assignedClass.map(async (cls) => {
                const { count, error: countError } = await createClient
                    .from('students')
                    .select('*', { count: 'exact', head: true })
                    .eq('class_id', cls.id);

                return {
                    class: cls.class,
                    section: cls.sec,
                    updated_at: cls.updated_at,
                    studentCount: count || 0
                };
            })
        );

        const uniqueClassesWithSections = new Set(
            classesWithCounts.map(item => JSON.stringify(item))
        );

        return Array.from(uniqueClassesWithSections).map(item => JSON.parse(item));
    } catch (error) {
        console.error("Error in getClassesByTeacher: ", error);
        return [];
    }
};



const getClassesByStudent = async (studentId) => {
    try {
        console.log("Model student Id:", studentId);
        const createClient = await connectdb();

        const { data: studentData, error: studentError } = await createClient
        .from('students')
        .select('id')
        .eq('student_id', studentId)

        if (studentError) {
            console.error("Teacher Query Error: ", studentError);
            throw studentError;
        }
        if (!studentData || studentData.length === 0) {
            console.warn("No teacher data found.");
            return [];
        }

        const { data: enrolledClass, error: enrolledClassError } = await createClient
            .from('marksheets')
            .select(`class,
                student_id:students(
                class)`)
            .eq('student_id', studentData[0].id);

        if (enrolledClassError) {
            console.error("Query Error: ", enrolledClassError);
            throw enrolledClassError;
        }

        console.log("Model Data: ", enrolledClass);
        
        if (enrolledClass.length === 0) {
            console.warn("No enrolled classes for this Student.");
        }

        const uniqueClasses = new Set();

        // Map both class values from the data structure
        const classes = (enrolledClass || []).map(item => {
          const marksheetClass = item.class || '';
          const studentClass = item.student_id?.class || '';
          
          if (marksheetClass) uniqueClasses.add(marksheetClass);
          if (studentClass) uniqueClasses.add(studentClass);
          
          return { marksheetClass, studentClass };
        });
        
        // Convert the Set back to an array with all unique classes
        return Array.from(uniqueClasses);
        

    } catch (error) {
        console.error("Error in getClassesByStudent: ", error);
        return [];
    }
};


module.exports ={  getClassByTeacher,getClassesByStudent , getClassesByTeacher ,createClass, getClass, createSubject, getSubjects, getSubjectsByClass, assignTeacher, getTeachers};