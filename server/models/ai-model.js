const OpenAI = require('openai');
const dotenv = require('dotenv');
const connectdb = require('../utils/connectdb');
const {fetchAllData}  = require('../utils/retrieveData');

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const generateResponse = async (prompt, userId) => {
  try {
    const supabase = await connectdb();
    
    // // Get user context from Supabase
    // const { data: userData, error: userError } = await supabase
    //   .from('users')
    //   .select('*')
    //   .eq('id', userId)
    //   .single();

    // if (userError) throw userError;

    // // Add user context to the prompt
    // const contextualPrompt = `User Role: ${userData.role}\n${prompt}`;
    const completion = await openai.chat.completions.create({
      model: "writer/palmyra-fin-70b-32k",
      messages: [{"role": "user", "content": fetchAllData + prompt}],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    let fullResponse = '';
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
    }
    
    // Store conversation in Supabase
    const { error: chatError } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: userId,
        prompt: prompt,
        response: fullResponse,
        created_at: new Date().toISOString()
      });

    if (chatError) throw chatError;
    
    return fullResponse;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};

module.exports = { generateResponse }; 
