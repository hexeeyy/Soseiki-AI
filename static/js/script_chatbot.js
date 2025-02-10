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

    let abortController; // Declare abort controller globally

function fetchBotResponse(message, botMessageDiv) {
    // Abort any ongoing fetch request before starting a new one
    if (abortController) {
        abortController.abort();
    }
    abortController = new AbortController(); // Create a new AbortController

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
            currentBotMessage = element; // Store the message element
            fullResponseText = text; // Store full response
        }

        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            typingTimeout = setTimeout(() => typeEffect(element, text, index + 1), 30);
        } else {
            stopButton.style.display = "none"; // Hide stop button after completion
            currentBotMessage = null;
            fullResponseText = "";
        }
    }


    function stopResponse() {
        clearTimeout(typingTimeout); // Stop the typing effect
        if (abortController) {
            abortController.abort(); // Cancel the fetch request
        }
        stopButton.style.display = "none";
    }
    
    

    function appendMessage(type, text, align) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container", align);
    
        const iconDiv = document.createElement("div");
        iconDiv.classList.add("icon");
        iconDiv.innerHTML = type === "user" ? '<i class=""></i>' : '<i class="fas fa-robot"></i>';
    
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
