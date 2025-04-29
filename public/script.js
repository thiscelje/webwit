// Voice Recognition and Chat Logic
const startBtn = document.getElementById('start-btn');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const outputDiv = document.getElementById('output');
const lampu = document.getElementById('lampu');

let recognition;

// Check if SpeechRecognition is supported
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'id-ID'; // Indonesian language

    recognition.onresult = async (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        await processCommand(command);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        outputDiv.textContent = 'Terjadi kesalahan saat mendengarkan suara.';
    };
} else {
    alert('Speech recognition not supported in this browser.');
}

// Start Listening Button
startBtn.addEventListener('click', () => {
    recognition.start();
    outputDiv.textContent = 'Mendengarkan...';
});

// Send Button for Chat Input
sendBtn.addEventListener('click', async () => {
    const command = chatInput.value.trim().toLowerCase();
    if (!command) {
        alert('Silakan masukkan perintah.');
        return;
    }
    await processCommand(command);
    chatInput.value = ''; // Clear input field
});

// Handle Enter Key Press in Chat Input
chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendBtn.click();
    }
});

// Process Command Function
async function processCommand(command) {
    try {
        console.log(`Processing command: ${command}`);
        outputDiv.textContent = `Perintah: ${command}`;

        // Send request to backend
        const response = await fetch('/api/wit-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: command }),
        });

        if (!response.ok) {
            console.error('Error: Failed to send request to backend');
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response from backend:', data);

        // Handle response
        handleWitResponse(data);
    } catch (error) {
        console.error('Error processing command:', error.message);
        outputDiv.textContent = 'Terjadi kesalahan saat memproses perintah.';
    }
}

// Handle Wit.ai Response
function handleWitResponse(data) {
    try {
        const intent = data.intents[0]?.name;
        const device = data.entities['device:device']?.[0]?.value;

        if (!intent || !device) {
            outputDiv.textContent = 'Perintah tidak dikenali.';
            return;
        }

        if (intent === 'set_device') {
            if (data.text.includes('nyalakan')) {
                lampu.classList.remove('off');
                lampu.classList.add('on');
                outputDiv.textContent = 'Lampu dinyalakan.';
            } else if (data.text.includes('matikan')) {
                lampu.classList.remove('on');
                lampu.classList.add('off');
                outputDiv.textContent = 'Lampu dimatikan.';
            }
        } else if (intent === 'get_device') {
            const status = lampu.classList.contains('on') ? 'Nyala' : 'Mati';
            outputDiv.textContent = `Status Lampu: ${status}`;
        } else {
            outputDiv.textContent = 'Perintah tidak dikenali.';
        }
    } catch (error) {
        console.error('Error handling Wit.ai response:', error.message);
        outputDiv.textContent = 'Terjadi kesalahan saat memproses respons.';
    }
}
