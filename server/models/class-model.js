const connectdb = require('../utils/connectdb');	
const dotenv = require('dotenv');

dotenv.config();


const createClass = async (userData) => {
    try {
        if (!userData.className || !userData.sec) {
            throw new Error("Incomplete class data");
        }
        const createClient = await connectdb();
        
        const { data: classData, error: classError } = await createClient
            .from('class')
            .insert({
                class: userData.className,
                sec: userData.sec,
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
                    subject_name: subject,
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
        
        // Get the class ID using class, section, and year from updated_at
        const { data: classData, error: classError } = await createClient
            .from('class')
            .select('id')
            .eq('class', classId)
            .eq('sec', section)
            .gte('updated_at', `${year}-01-01`)
            .lte('updated_at', `${year}-12-31`);

        if (classError) throw classError;
        if (!classData || classData.length === 0) {
            return []; // Return empty array if no class found
        }

        // Get subjects with teacher information for this class
        const { data: subjectsData, error: subjectsError } = await createClient
            .from('subjects')
            .select(`
                id,
                subject_name,
                teacher_id:teachers(
                    id,
                    first_name,
                    last_name
                )
            `)
            .eq('class_id', classData[0].id);

        if (subjectsError) throw subjectsError;
        
        return (subjectsData || []).map(item => ({
            id: item.id,
            name: item.subject_name,
            teacher: item.teacher_id ? `${item.teacher_id.first_name} ${item.teacher_id.last_name}`||`${item.teacher.first_name} ${item.teacher.last_name}` : ''
        }));
    } catch (error) {
        console.error("Error fetching subjects:", error);
        return []; // Return empty array on error
    }
};

const assignTeacher = async (subjectId, teacherId, classId, section) => {
    try {
        const createClient = await connectdb();
        
        // First verify the teacher exists and is active
        const { data: teacherData, error: teacherError } = await createClient
            .from('teachers')
            .select('id')
            .eq('id', teacherId)
            .eq('status', 'active')
            .single();

        if (teacherError || !teacherData) {
            throw new Error('Teacher not found or inactive');
        }

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
                teacher_id: teacherId,
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

const getClassesByTeacher = async (teacherId) => {
    try {
        console.log("Model teacher Id:", teacherId);
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
            .from('subjects')
            .select(`class_id:class(class)`)
            .eq('teacher_id', teacherData[0].id);

        if (assignedClassError) {
            console.error("Query Error: ", assignedClassError);
            throw assignedClassError;
        }

        console.log("Model Data: ", assignedClass);
        
        if (assignedClass.length === 0) {
            console.warn("No classes assigned for this teacher.");
        }

         // Use a Set to track unique classes
    const uniqueClasses = new Set();

    // Map the assignedClass data and add unique classes to the Set
    const classes = (assignedClass || []).map(item => {
      const className = item.class_id?.class || '';
      if (className) {
        uniqueClasses.add(className); // Add to Set for uniqueness
      }

      return className; // Return the class name
    });

    // Convert the Set back to an array
    return Array.from(uniqueClasses); // Return unique class names

    } catch (error) {
        console.error("Error in getClassesByTeacher: ", error);
        return [];
    }
};


module.exports ={ getClassesByTeacher ,createClass, getClass, createSubject, getSubjects, getSubjectsByClass, assignTeacher, getTeachers};