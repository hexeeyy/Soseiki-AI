document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.querySelector(".send-button");
    const stopButton = document.createElement("button");
    let typingTimeout;

    // Create stop button dynamically and add to the input container
    stopButton.classList.add("stop-button");
    stopButton.innerHTML = '<i class="fas fa-stop"></i>';
    stopButton.style.display = "none"; // Hide initially
    document.querySelector(".input-container").appendChild(stopButton);

    // Apply styles dynamically
    const style = document.createElement("style");
    style.innerHTML = `
      .stop-button {
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 8px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, #ff4e50, #ff9a8b);
        box-shadow: 0 4px 10px rgba(255, 78, 80, 0.3);
        color: white;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        position: relative;
      }

      .stop-button i {
        transition: transform 0.3s ease-in-out;
      }

      .stop-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 14px rgba(255, 78, 80, 0.5);
      }

      .stop-button.spinning i {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        appendMessage("user", message, "right");
        userInput.value = "";

        // Create a bot message container for real-time text generation
        const botMessageDiv = appendMessage("bot", "", "left");

        // Insert the new typing animation
        botMessageDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-circle"></div>
                <div class="typing-circle"></div>
                <div class="typing-circle"></div>
                <div class="typing-shadow"></div>
                <div class="typing-shadow"></div>
                <div class="typing-shadow"></div>
            </div>`;

        stopButton.style.display = "inline-block"; // Show stop button
        fetchBotResponse(message, botMessageDiv);
    }

    let abortController;

    function fetchBotResponse(message, botMessageDiv) {
        if (abortController) {
            abortController.abort();
        }
        abortController = new AbortController();

        fetch("/get?msg=" + encodeURIComponent(message), { signal: abortController.signal })
            .then(response => response.text())
            .then(data => {
                botMessageDiv.innerHTML = '<i class=""></i> ';
                typeEffect(botMessageDiv, formatResponse(data));
            })
            .catch(error => {
                if (error.name === "AbortError") {
                    botMessageDiv.innerHTML = '<i class=""></i> ⚠️ Response stopped.';
                } else {
                    botMessageDiv.innerHTML = '<i class=""></i> ⚠️ Error: Unable to fetch response.';
                    console.error("Fetch error:", error);
                }
            });
    }

    let currentBotMessage = null;
    let fullResponseText = "";

    function typeEffect(element, text, index = 0) {
        if (index === 0) {
            currentBotMessage = element;
            fullResponseText = text;
        }

        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            typingTimeout = setTimeout(() => typeEffect(element, text, index + 1), 30);
        } else {
            stopButton.style.display = "none";
            currentBotMessage = null;
            fullResponseText = "";
        }
    }

    function stopResponse() {
        clearTimeout(typingTimeout);
        if (abortController) {
            abortController.abort();
        }
        stopButton.style.display = "none";
    }

    function appendMessage(type, text, align) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container", align);

        const iconDiv = document.createElement("div");
        iconDiv.classList.add("icon");
        iconDiv.innerHTML = type === "user" ? '<i class=""></i>' : '<i class="fa-sharp fa-solid fa-s"></i>';

        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", type);
        messageDiv.innerHTML = text;

        messageContainer.appendChild(iconDiv);
        messageContainer.appendChild(messageDiv);
        
        chatBox.appendChild(messageContainer);

        gsap.fromTo(messageContainer, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });

        setTimeout(() => {
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 100);

        return messageDiv;
    }

    function formatResponse(response) {
        return response
            .replace(/\*/g, '')
            .replace(/(\bIMPORTANT\b)/g, '<span class="bold">$1</span>')
            .replace(/(\d+)\^(\d+)/g, (match, base, exp) => `${base}<sup>${exp}</sup>`)
            .replace(/([a-zA-Z])_(\d+)/g, (match, letter, num) => `${letter}<sub>${num}</sub>`)
            .replace(/\n{3,}/g, '\n\n')
            .replace(/^\s*[-•]\s+(.*)$/gm, '• $1')
            .replace(/--/g, '—')
            .replace(/(\d+)-(\d+)/g, '$1–$2')
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            .replace(/\n/g, '\n\n');
    }

    setTimeout(() => {
        const initialMessageDiv = appendMessage("bot", "", "left");
        typeEffect(initialMessageDiv, "Mabuhay, GIANTS! Welcome to Sōseiki.ai (創世記). I will be your assistant at the moment.");
    }, 500);

    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") sendMessage();
    });

    sendButton.addEventListener("click", sendMessage);
    stopButton.addEventListener("click", stopResponse);
});
