import logging
import google.generativeai as genai
from dotenv import load_dotenv
import os
import sys

# Suppress unwanted log messages
logging.getLogger('absl').setLevel(logging.CRITICAL)
logging.basicConfig(level=logging.CRITICAL)

# Load environment variables
load_dotenv()
api_key = os.getenv('GOOGLE_API_KEY')

if not api_key:
    raise ValueError("API key not found. Please set the GOOGLE_API_KEY environment variable.")

# Configure AI model
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-pro')

def paraphrase_text(text):
    if not text.strip():
        return "Input text cannot be empty. Please enter some text to paraphrase."

    # Modified prompt to ensure simple and close paraphrasing
    prompt = (
        f"Paraphrase the following sentence using different words while keeping it simple and very close to the original meaning:\n\n'{text}'"
    )

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logging.error(f"API request failed: {e}")
        return "Sorry, I couldn't process that request. Please try again!"


def main():
    print("Hey there! 👋 Ready to make your words flow better? Let's get started!")
    try:
        while True:
            user_input = input("\nYou: ")
            if user_input.lower() == 'exit':
                print("Goodbye! 👋 Thanks for chatting with me!")
                break
            if not user_input.strip():
                print("Please enter some text to paraphrase!")
                continue
            
            paraphrased_text = paraphrase_text(user_input)
            print(f"Paraphrase: {paraphrased_text}")
    except KeyboardInterrupt:
        print("\nGoodbye! 👋 Thanks for chatting with me!")

if __name__ == "__main__":
    main()
    sys.exit(0)
