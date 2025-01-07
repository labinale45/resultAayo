const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://zgneyxpprmpclcszwqpo.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnbmV5eHBwcm1wY2xjc3p3cXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NjI1NzQsImV4cCI6MjAzODQzODU3NH0.MZov2x2Uvwx_1lR48CqmfQ29eQOcs_ItKosTNdqpsL4";
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAllData() {
    try {
        // Fetch data from all tables
        const { data: adminsettings, error: adminsettingsError } = await supabase
            .from('adminsettings')
            .select('*');

        if (adminsettingsError) throw adminsettingsError;

        const { data: ai_conversations, error: aiConversationsError } = await supabase
            .from('ai_conversations')
            .select('*');

        if (aiConversationsError) throw aiConversationsError;

        const { data: classData, error: classError } = await supabase
            .from('class')
            .select('*');

        if (classError) throw classError;

        const { data: exams, error: examsError } = await supabase
            .from('exams')
            .select('*');

        if (examsError) throw examsError;

        const { data: ledgers, error: ledgersError } = await supabase
            .from('ledgers')
            .select('*');

        if (ledgersError) throw ledgersError;

        const { data: markSetup, error: markSetupError } = await supabase
            .from('markSetup')
            .select('*');

        if (markSetupError) throw markSetupError;

        const { data: marksheets, error: marksheetsError } = await supabase
            .from('marksheets')
            .select('*');

        if (marksheetsError) throw marksheetsError;

        const { data: notices, error: noticesError } = await supabase
            .from('notices')
            .select('*');

        if (noticesError) throw noticesError;

        const { data: students, error: studentsError } = await supabase
            .from('students')
            .select('*');

        if (studentsError) throw studentsError;

        const { data: subjects, error: subjectsError } = await supabase
            .from('subjects')
            .select('*');

        if (subjectsError) throw subjectsError;

        const { data: teachers, error: teachersError } = await supabase
            .from('teachers')
            .select('*');

        if (teachersError) throw teachersError;

        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*');

        if (usersError) throw usersError;
        console.log({adminsettings,
            ai_conversations,
            class: classData,
            exams,
            ledgers,
            markSetup,
            marksheets,
            notices,
            students,
            subjects,
            teachers,
            users})

        // Combine all data into a single object
        return {
            adminsettings,
            ai_conversations,
            class: classData,
            exams,
            ledgers,
            markSetup,
            marksheets,
            notices,
            students,
            subjects,
            teachers,
            users,
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

module.exports = {
    fetchAllData,
};