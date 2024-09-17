const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config();

const connectdb = async () => {
    try {
        const dbUrl = process.env.SUPABASE_URL;
        const dbKey = process.env.SUPABASE_ANON_KEY;

        if (!dbUrl || !dbKey) {
            throw new Error("Database environment variables missing");
        }

        const supabaseClient = createClient(dbUrl, dbKey);
        return supabaseClient;
    } catch (error) {
        throw error;
    }
};

module.exports = connectdb;
