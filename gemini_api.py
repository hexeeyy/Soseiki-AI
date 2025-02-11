import google.generativeai as genai

# Configure the API key (store this securely!)
genai.configure(api_key="AIzaSyCHQFJTsoZZ7fHeWXNXJF2k2NMF4kh_EU8")

def generate_response_from_gemini(prompt: str):
    try:
        # Select the Gemini model
        model = genai.GenerativeModel("gemini-2.0-flash")  # Use "gemini-1.5-pro" if available

        # Generate a response
        response = model.generate_content(prompt)

        # Return the response text
        return response.text if hasattr(response, 'text') else "No response generated."
    
    except Exception as e:
        print(f"Error with the Gemini API request: {e}")
        return "Sorry, I couldn't generate a response at the moment."

