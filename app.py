from flask import Flask, render_template, request, session, jsonify
import google.generativeai as genai
from chatbot import chat_with_bot

# Set API key directly
api_key = 'AIzaSyAwBqHgimxnprqgK-DSOZn7mWCqPETOhgM'

if not api_key:
    raise ValueError("API key not found. Please set the GOOGLE_API_KEY environment variable.")

# Configure Gemini AI
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-pro')

app = Flask(__name__)
app.secret_key = 'your_secret_key'

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chatbot")
def chatbot():
    return render_template("chatbot.html")

@app.route("/get", methods=["GET"])
def get_bot_response():
    user_text = request.args.get("msg")
    conversation_history = session.get("conversation_history", [])
    response, conversation_history = chat_with_bot(user_text, conversation_history)
    session["conversation_history"] = conversation_history
    return response  # Return plain text response for JavaScript to process

@app.route("/process", methods=["POST"])
def process_text():
    data = request.get_json()
    text = data.get("text", "").strip()
    action = data.get("action", "paraphrase")
    style = data.get("style", "standard")

    if not text:
        return jsonify({"result": "Please enter some text to process."})

    # Modify the prompt based on the selected action and style
    if action == "paraphrase":
        if style == "standard":
            prompt = f"Paraphrase the following text while keeping the number of sentences the same. Use different words but retain the original meaning:\n\n{text}"
        elif style == "fluency":
            prompt = f"Paraphrase the following text to make it easier to understand while keeping the meaning intact. Use simpler words and natural sentence flow:\n\n{text}"
        elif style == "formal":
            prompt = f"Rephrase the following text in a professional and polite manner, keeping the meaning unchanged:\n\n{text}"
        else:
            return jsonify({"result": "Invalid paraphrasing style selected."})

    elif action == "summarize":
        prompt = f"Summarize the following text into a clear and concise paragraph. Keep the key points and remove unnecessary details:\n\n{text}"

    elif action == "grammar":
        prompt = (
            f"Check the grammar of the following text. First, state whether the grammar is correct or if there are mistakes. "
            f"If there are mistakes, identify the incorrect word(s) and provide a suggested replacement. "
            f"Do not modify the text or repeat it:\n\n{text}"
        )

    else:
        return jsonify({"result": "Invalid action. Please select a valid option."})

    try:
        response = model.generate_content(prompt)

        # Check if response is valid
        if not response or not hasattr(response, "text") or not response.text.strip():
            return jsonify({"result": "AI could not generate a valid response. Please try again."})

        # Suppress filter warnings - Skip safety check messaging
        if hasattr(response, "candidates") and response.candidates:
            finish_reason = response.candidates[0].finish_reason
            if finish_reason == 3:  # Safety filter was triggered
                return jsonify({"result": "Unable to process this request. Try rewording your input."})

        return jsonify({"result": response.text.strip()})

    except Exception as e:
        return jsonify({"result": f"An error occurred while processing your request: {e}"})

if __name__ == "__main__":
    app.run(debug=True)