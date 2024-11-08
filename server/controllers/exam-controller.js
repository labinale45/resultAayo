const connectdb = require('../utils/connectdb');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Supabase client


const createExam = async (req, res) => {

    try {
        const { examType, ddate,dtime,rdate,rtime} = req.body;
        const createClient = await connectdb();
        
        const {data,error} = await createClient
        .from('exams')
        .insert({
            exam_type: examType,
            deadline_date: ddate,
            deadline_time: dtime,
            resultDate: rdate,
            resultTime: rtime,
            created_at: new Date().toISOString()
        });
        if (error){
          console.error('Error creating Exam:', error.message);
          throw error;
        }
        return res.status(200).json({message: examType + " created successfully"});
}
    catch (error) {
        console.error('Error creating Exam:', error.message);
        throw error;
    }
}

const createNotice = async (req, res) => {
    try {
        const { title, description, image } = req.body;
        const createClient = await connectdb();
        
        if (!title || !description) {
            return res.status(400).json({ 
                message: "Title and description are required" 
            });
        }

        let imageUrl = null;
        
        if (image) {
            try {
                // Convert base64 to buffer
                const buffer = Buffer.from(
                    image.replace(/^data:image\/\w+;base64,/, ''),
                    'base64'
                );

                // Generate unique filename with original file extension
                const matches = image.match(/^data:image\/([A-Za-z-+\/]+);base64,/);
                const fileExtension = matches ? matches[1].replace('+', '') : 'jpg';
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
                const filePath = `notices/${fileName}`;

                // Upload to Supabase storage with correct content type
                const { error: uploadError } = await createClient.storage
                    .from('notices')
                    .upload(filePath, buffer, {
                        contentType: `image/${fileExtension}`,
                        upsert: false
                    });

                if (uploadError) throw uploadError;

                // Get public URL with complete URL path
                const { data: urlData } = await createClient.storage
                    .from('notices')
                    .getPublicUrl(filePath);

                // Make sure we have the complete URL from Supabase
                imageUrl = urlData.publicUrl;
                
                // Verify the URL is complete and accessible
                if (!imageUrl.startsWith('http')) {
                    // If needed, construct the full Supabase URL
                    imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/notices/${filePath}`;
                }

                console.log('Final imageUrl:', imageUrl);
            } catch (uploadError) {
                console.error('Error uploading image:', uploadError);
                return res.status(500).json({
                    message: "Failed to upload image",
                    error: uploadError.message
                });
            }
        }

        const { data, error } = await createClient
            .from('notices')
            .insert({
                title: title,
                description: description,
                img_url: imageUrl,
                created_at: new Date().toISOString()
            });

        if (error) {
            console.error('Error creating Notice:', error.message);
            return res.status(500).json({ 
                message: "Failed to create notice", 
                error: error.message 
            });
        }

        return res.status(200).json({ 
            message: title + " created successfully",
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error('Error creating Notice:', error.message);
        return res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
}
module.exports = {createExam, createNotice};