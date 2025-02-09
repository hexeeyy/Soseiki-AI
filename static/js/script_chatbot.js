document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.querySelector(".send-button");

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

    fetchBotResponse(message, botMessageDiv);
    }

    function fetchBotResponse(message, botMessageDiv) {
        fetch("/get?msg=" + encodeURIComponent(message))
            .then(response => response.text())
            .then(data => {
                botMessageDiv.innerHTML = '<i class=""></i> ';
                typeEffect(botMessageDiv, formatResponse(data));
            })
            .catch(error => {
                botMessageDiv.innerHTML = '<i> class=""</i> ⚠️ Error: Unable to fetch response.';
                console.error("Fetch error:", error);
            });
    }

    function typeEffect(element, text, index = 0) {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            setTimeout(() => typeEffect(element, text, index + 1), 30); // Adjust typing speed here
        }
    }

    function appendMessage(type, text, align) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container", align); // Wrapper for icon and message
    
        const iconDiv = document.createElement("div");
        iconDiv.classList.add("icon");
        iconDiv.innerHTML = type === "user" ? '<i class=""></i>' : '<i class="fas fa-robot"></i>';
    
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", type);
        messageDiv.innerHTML = text;
    
        // Append icon and message to the container
        messageContainer.appendChild(iconDiv);
        messageContainer.appendChild(messageDiv);
        
        chatBox.appendChild(messageContainer);
    
        // GSAP animation for smooth message appearance
        gsap.fromTo(messageContainer, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    
        // Smooth auto-scroll to latest message
        setTimeout(() => {
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 100);
    
        return messageDiv; // Return message element for text typing effect
    }
    

    function formatResponse(response) {
        return response
            .replace(/\*/g, '') // Removes unwanted asterisks
            .replace(/(\bIMPORTANT\b)/g, '<span class="bold">$1</span>') // Highlights "IMPORTANT"
            .replace(/(\d+)\^(\d+)/g, (match, base, exp) => `${base}<sup>${exp}</sup>`) // Converts exponent notation to superscript (5^2 → 5²)
            .replace(/([a-zA-Z])_(\d+)/g, (match, letter, num) => `${letter}<sub>${num}</sub>`) // Converts subscript (H_2O → H₂O)
            .replace(/\n{3,}/g, '\n\n') // Limits excess line breaks to 2
            .replace(/^\s*[-•]\s+(.*)$/gm, '• $1') // Normalizes bullet points (- Item, • Item → • Item)
            .replace(/--/g, '—') // Converts -- to em dash (—)
            .replace(/(\d+)-(\d+)/g, '$1–$2') // Converts hyphen in number ranges to en dash (1990-2000 → 1990–2000)
            .replace(/[\u200B-\u200D\uFEFF]/g, '') // Removes zero-width spaces
            .replace(/\n/g, '\n\n'); // Converts new lines to HTML line breaks
    }
    

    // Initial bot message with GSAP animation and typing effect
    setTimeout(() => {
        const initialMessageDiv = appendMessage("bot", "", "left");
        typeEffect(initialMessageDiv, "Mabuhay, GIANTS! Welcome to Sōseiki.ai (創世記). I will be your assistant at the moment.");
    }, 500);

    // Send message on Enter key
    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") sendMessage();
    });

    // Send message on button click
    sendButton.addEventListener("click", sendMessage);
});
