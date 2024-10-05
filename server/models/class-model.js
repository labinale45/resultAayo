const connectdb = require('../utils/connectdb');	
const dotenv = require('dotenv');

dotenv.config();

const createClass = async (userData)=>{
    try {
        if(!userData.className ||!userData.sec ||!userData.subject){
            throw new Error("Incomplete class data");
        }
        const createClient = await connectdb();
        const {data,error} = await createClient
       .from('class')
       .insert({
            class: userData.className,
            sec: userData.sec,
            });
        if(error) throw error;
        return data;

    } catch (error) {
        console.error("Error creating class:", error);
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

const createSubject = async (userData)=>{
    try {
        if(!userData.subject){
            throw new Error("Incomplete class data");
        }
        const createClient = await connectdb();
        const {data: subjectData, error: subjectError} = await createClient
        .from('subjects')
        .insert({
            subject_name: userData.subject,
        });
        if(subjectError) throw subjectError;
        return subjectData;
    }
    catch (error) {
        console.error("Error creating subject:", error);
    }
}

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

module.exports ={createClass, getClass, createSubject, getSubjects};