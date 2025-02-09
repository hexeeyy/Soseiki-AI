from flask import Flask, render_template, request, session
from chatbot import chat_with_bot

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

if __name__ == "__main__":
    app.run(debug=True)
