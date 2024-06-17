const openai = require('openai');
require('dotenv').config();

exports.chatWithGPT = async (req, res) => {
    const { userMessage } = req.body;
    try {
        
        const thread = await openai.beta.threads.create();
        
        const message = await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: userMessage,
        });
        
        let run = await openai.beta.threads.runs.createAndPoll(
            thread.id,
            { 
                assistant_id: "asst_wGA3qiDGK1OE0VaujzHyJwEP",
                instructions: "Please address the user as Dear customer.",   
            }
        );
        
        console.log(run)

        const checkStatusAndPrintMessages = async (threadId, runId) => {

            let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
            if(runStatus.status === "completed"){
                let messages = await openai.beta.threads.messages.list(threadId);
                res.json({ message: messages.content[0].text.value });
                
            } else {
                console.log("Run is not completed yet.");
            }  

        };
        
        setTimeout(() => {
            checkStatusAndPrintMessages(thread.id, run.id)
        }, 10000 );


    } catch (error) {
        console.error('Error communicating with ChatGPT:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
}






/*
const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function chatWithGPT(req, res) {
    const { message } = req.body;
    try {

        const response = await openaiClient.chat.completions.create({
            messages: [{ role: "system", content: 'You are a helpful assistant for an e-commerce website selling mobile phones.Do not answer any questions except smart phones.\nUser: ' + message }],
            model: "gpt-3.5-turbo",
        });
        
        const botMessage = response.data.choices[0].text;
        res.json({ message: botMessage });

    } catch (error) {
        console.error('Error communicating with ChatGPT:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
}

*/