import replicate

# Define the model and input parameters
model_id = "meta/llama-2-7b-chat"

# Function to get specialty recommendation from the model
def get_specialty_recommendation(symptoms):
    prompt = f"Based on the following symptoms: {symptoms}, recommend the appropriate medical specialty."
    try:
        # Run the model with the specified prompt
        output = replicate.run(
            model_id,
            input={"prompt": prompt}
        )
        # Convert the list of tokens to a single string
        text_output = ''.join(output)
        return text_output
    except replicate.ReplicateError as e:
        print(f"ReplicateError: {e}")
        return "Error in retrieving recommendation."

# Function to get user input and recommend specialties
def main():
    # Get user input for symptoms
    user_input = input("Enter your symptoms separated by commas (e.g., runny nose, coughing): ")
    
    # Process the user input
    symptoms = user_input.strip()
    
    # Get specialty recommendation from the model
    specialty_recommendation = get_specialty_recommendation(symptoms)
    
    print("Recommended specialty based on your symptoms:")
    print(specialty_recommendation)

if __name__ == "__main__":
    main()
