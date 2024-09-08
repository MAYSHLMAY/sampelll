import pandas as pd
from fuzzywuzzy import process

# Load and preprocess the DataFrame
def load_and_preprocess_csv(file_path):
    df = pd.read_csv(file_path)
    # Standardize column names: lower case and replace spaces with underscores
    df.columns = [col.lower().strip().replace(' ', '_').replace('(', '').replace(')', '') for col in df.columns]
    return df

# Function to find the best matches for symptoms
def find_best_matches(symptom, choices, threshold=80):
    matches = process.extractBests(symptom, choices, score_cutoff=threshold)
    return [match[0] for match in matches]

# Recommendation function
def recommend_doctor(user_symptoms, df):
    # Convert user symptoms to lowercase and strip extra spaces
    symptoms_list = [symptom.strip().lower().replace(' ', '_') for symptom in user_symptoms.split(", ")]

    # Standardize DataFrame column names for matching
    df_columns = [col.strip().lower().replace(' ', '_') for col in df.columns]

    # Create a mask to filter the DataFrame
    valid_symptoms = []
    for symptom in symptoms_list:
        matches = find_best_matches(symptom, df_columns)
        if matches:
            valid_symptoms.extend(matches)
    
    # Remove duplicates and ensure columns exist
    valid_symptoms = list(set(valid_symptoms))
    valid_symptoms = [symptom for symptom in valid_symptoms if symptom in df_columns]

    if not valid_symptoms:
        return ["No valid symptoms found in DataFrame"]

    # Create mask for filtering DataFrame
    try:
        # The last column is assumed to be the doctor specialty
        specialty_column = df.columns[-1]
        # Ensure the mask is created with valid symptoms
        mask = (df[valid_symptoms].fillna(0) == 1).all(axis=1)
    except KeyError as e:
        print(f"KeyError: {e}")
        print(f"Valid Symptoms: {valid_symptoms}")
        print(f"DataFrame Columns: {df_columns}")
        return ["Error processing symptoms"]

    # Find the doctors based on the matching symptoms
    recommended_specialists = df[mask][specialty_column]

    if not recommended_specialists.empty:
        return recommended_specialists.tolist()
    else:
        return ["No specialists found"]

# Example usage
file_path = 'Specialist.csv'  # Path to your CSV file
specialist_df = load_and_preprocess_csv(file_path)
user_input_symptoms = "chest pain"  # User input symptoms with partial names
print(recommend_doctor(user_input_symptoms, specialist_df))
