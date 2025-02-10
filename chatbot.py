from dataset import get_faq_response
from gemini_api import generate_response_from_gemini

def chat_with_bot(user_input, conversation_history=None, max_history_length=10):
    """Chatbot function that interacts with the user, supports FAQs, and uses Gemini API."""
    
    if conversation_history is None:
        conversation_history = []

    # Add user input to conversation history
    conversation_history.append(f"User: {user_input}")

    # Check if the input matches predefined FAQs
    faq_response = get_faq_response(user_input)
    
    if faq_response:
        response = faq_response
    else:
        # Generate response from Gemini API if no FAQ match
        response = generate_response_from_gemini(user_input)

    # Add bot response to conversation history
    conversation_history.append(f"Bot: {response}")

    # Keep conversation history within limit
    if len(conversation_history) > max_history_length * 2:  # User and bot pairs
        conversation_history = conversation_history[-(max_history_length * 2):]

    return response, conversation_history
