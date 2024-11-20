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
        const { data, error } = await createClient
            .from('subjects')
            .update({ 
                teacher_id: teacherId,
                updated_at: new Date().toISOString()
            })
            .eq('id', subjectId)
            .select();

        if (error) throw error;
        return data;
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

module.exports ={createClass, getClass, createSubject, getSubjects, getSubjectsByClass, assignTeacher, getTeachers};