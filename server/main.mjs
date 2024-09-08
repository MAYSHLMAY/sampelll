import Replicate from 'replicate';
import readline from 'readline';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

const modelId = "meta/llama-2-7b-chat";

// Function to get specialty recommendation from the model
async function getSpecialtyRecommendation(symptoms) {
    const prompt = `Based on the following symptoms: ${symptoms}, recommend the appropriate medical specialty.`;
    try {
        const response = await replicate.run(modelId, { input: { prompt } });

        // If the response is in tokenized format
        if (Array.isArray(response)) {
            // Join tokens into a single string
            const text = response.join('');
            // Replace unwanted characters or spaces if needed
            return text.replace(/\s+/g, ' ').trim();
        }

        return response; // If the response is already a string
    } catch (error) {
        console.error(`ReplicateError: ${error.message}`);
        return "Error in retrieving recommendation.";
    }
}

// Function to get user input and recommend specialties
async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter your symptoms separated by commas (e.g., runny nose, coughing): ', async (userInput) => {
        // Process the user input
        const symptoms = userInput.trim();

        // Get specialty recommendation from the model
        const specialtyRecommendation = await getSpecialtyRecommendation(symptoms);

        console.log("Recommended specialty based on your symptoms:");
        console.log(specialtyRecommendation);

        rl.close();
    });
}

main();
