document.addEventListener("DOMContentLoaded", function () {
    const chatOutput = document.getElementById("chat-output");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const apiKey = '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';

    sendButton.addEventListener("click", function () {
        const userMessage = userInput.value;
        displayMessage(userMessage, true);
        userInput.value = "";

        // Call OpenAI API to get a response
        fetchResponse(userMessage)
            .then(response => {
                const botMessage = response.choices[0].text;
                displayMessage(botMessage, false);
            })
            .catch(error => {
                console.error("Error fetching response:", error);
            });
    });

    function displayMessage(message, isUser) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add(isUser ? "user-message" : "bot-message");
        messageDiv.textContent = message;
        chatOutput.appendChild(messageDiv);
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    function fetchResponse(userMessage) {
        return fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}` // Replace with your API key
            },
            body: JSON.stringify({
                prompt: userMessage,
                max_tokens: 50 // You can adjust this to limit the response length
            })
        }).then(response => response.json());
    }
});
