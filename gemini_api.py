from google import genai

def generate_response_from_gemini(prompt: str):
    try:
        # Replace with your actual API key
        client = genai.Client(api_key="AIzaSyCHQFJTsoZZ7fHeWXNXJF2k2NMF4kh_EU8")
        
        # Generate response using Gemini model
        response = client.models.generate_content(
            model="gemini-2.0-flash",  # You can adjust the model name if needed
            contents=prompt,
        )
        return response.text  # Extract the generated text response
    except Exception as e:
        print(f"Error with the Gemini API request: {e}")
        return "Sorry, I couldn't generate a response at the moment."
