const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.chatWithGPT = async (req, res) => {
    const { userMessage } = req.body;
    try {
        
        const assistant = await openai.beta.assistants.retrieve(
            "asst_wGA3qiDGK1OE0VaujzHyJwEP"
        );

        //console.log("assistant");
        //console.log(assistant);

        const thread = await openai.beta.threads.create();

        //console.log("thread");
        //console.log(thread);

        const message = await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: userMessage,
        });

        //console.log("message");
        //console.log(message);

        const run = await openai.beta.threads.runs.createAndPoll(
            thread.id,
            {
                assistant_id: assistant.id,
                instructions: "Please address the user as Dear customer.",
            }
        );
        
        //console.log("run");
        //console.log(run);

        const checkStatusAndPrintMessages = async (threadId, runId) => {

            const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

            if (runStatus.status === "completed") {

                const messages = await openai.beta.threads.messages.list(threadId);

                //console.log("messages");
                //console.log(messages);

                res.json({ message: messages.body.data[0].content[0].text.value });

            } else {
                console.log("Run is not completed yet.");
            }

        };

        setTimeout(() => {
            checkStatusAndPrintMessages(thread.id, run.id)
        }, 10000);

        

        //const messages = require('./test_response.json');
        //console.log("message content");
        //console.log(messages.body.data[0].content[0].text.value);


    } catch (error) {
        console.error('Error communicating with ChatGPT:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
}