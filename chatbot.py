from dataset import get_faq_response
from gemini_api import generate_response_from_gemini

def chat_with_bot(user_input, conversation_history=None):
    """Main chatbot function to interact with the user."""
    if conversation_history is None:
        conversation_history = []

    # Add user input to the conversation history
    conversation_history.append(f"{ user_input}")

    # Check if the input matches any of the predefined FAQ prompts
    faq_response = get_faq_response(user_input)
    if faq_response:
        response = faq_response
    else:
        # Generate response from Gemini API if no FAQ match
        response = generate_response_from_gemini(user_input)

    # Add bot response to the conversation history
    conversation_history.append(f"Bot: {response}")

    return response, conversation_history