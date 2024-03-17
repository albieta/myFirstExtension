export const chat_html = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chat Interface</title>
        <style>
            body {
                margin: 0;
                font-family: Arial, sans-serif;
            }
            #chatbox {
                position: fixed;
                top: 40px; 
                bottom: 0;
                width: 100%;
                padding: 10px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
            }
            #messages {
                overflow-y: scroll;
                max-height: calc(100% - 60px);
                padding: 10px;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                justify-content: flex-start;
                flex-grow: 1;
            }
            .message {
                margin-top: 5px;
                background-color: #595959;
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
            }
            .sent {
                align-self: flex-end;
            }

            .received {
                align-self: flex-start;
            }
            #user-input {
                padding: 10px;
                display: flex;
                justify-content: flex-start;
                align-items: flex-end;
                align-items: flex-end;
                flex-grow: 1;
            }
            #message-input {
                width: 80%;
                padding: 8px;
                margin-right: 1%;
                border: none;
                border-radius: 5px;
                background-color: #595959;
                outline: none;
                color: white;
            }
            #send-button {
                padding: 8px 10px;
                background-color: #384d29;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s;
                width: 19%;
            }
            #send-button:hover {
                background-color: #243318;
            }
            #fixed-buttons {
                position: fixed;
                padding-top: 5px;
                padding-bottom: 10px;
                top: 10px;
                left: 0;
                right: 0;
                display: flex;
                justify-content: center;
                flex-direction: row;
                z-index: 1;
                border-bottom:2px solid #8d8d8d;
            }
            #python-gen-button, #flutter-gen-button {
                margin-right: 10px;
                padding: 8px 10px;
                background-color: #384d29;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s;
            }

            #python-gen-button:hover, #flutter-gen-button:hover {
                background-color: #243318;
            }

            #backend-button, #frontend-button {
                margin-right: 10px;
                padding: 8px 10px;
                background-color: #294d4a;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            
            #backend-button:hover, #frontend-button:hover {
                background-color: #1c3533;
            }
        </style>
    </head>
    <body>
        <div id="fixed-buttons">
            <button id="backend-button">Activate Backend</button>
            <button id="python-gen-button">Activate Python Code Gen</button>
            <button id="flutter-gen-button">Activate Flutter Code Gen</button>
            <button id="frontend-button">Activate Frontend</button>
        </div>
        <div id="chatbox">
            <div id="messages"></div>
            <div id="user-input">
                <input type="text" id="message-input" placeholder="Type your message here...">
                <button id="send-button">Send</button>
            </div>
        </div>

        <script>
            (function() {
                const vscode = acquireVsCodeApi();
                const messagesContainer = document.getElementById('messages');
                const messageInput = document.getElementById('message-input');

                const welcomeMessage = document.createElement('div');
                welcomeMessage.classList.add('message');
                welcomeMessage.classList.add('received');
                welcomeMessage.textContent = "Hello! This is LAIA. How can I help you?";
                messagesContainer.appendChild(welcomeMessage);

                function appendMessage(content, role) {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('message');
                    messageElement.classList.add(role);
                    messageElement.textContent = content;
                    messagesContainer.appendChild(messageElement);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }

                function appendLetter(letter, done) {
                    if (done == false) {
                        const messageExisting = messagesContainer.querySelector('.ollama');
                        if (!messageExisting) {
                            const messageExisting = document.createElement('div');
                            messageExisting.classList.add('message');
                            messageExisting.classList.add('received');
                            messageExisting.classList.add('ollama');
                            messagesContainer.appendChild(messageExisting);
                        }
                        messageExisting.textContent += letter;
                    } else {
                        const messageExisting = document.querySelector('.ollama');
                        if (messageExisting) {
                            messageExisting.classList.remove('ollama');
                        }
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                }

                function appendAskPythonCodeGen(content) {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('message');
                    messageElement.classList.add('received');
                    messageElement.innerHTML = content + '<br><button id="python-yes">Yes</button> <button id="python-no">No</button>';
                    messagesContainer.appendChild(messageElement);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;

                    document.getElementById('python-yes').addEventListener('click', function() {
                        appendTriggerPythonCodeGen(true);
                    });

                    document.getElementById('python-no').addEventListener('click', function() {
                        appendTriggerPythonCodeGen(false);
                    });
                }

                function appendTriggerPythonCodeGen(bool) {
                    if (bool == true) {
                        vscode.postMessage({
                            command: 'python_code_gen',
                            text: ""
                        });
                        appendAskFlutterCodeGen("Would you like me to activate the flutter code generator?");
                    }
                }

                function appendAskFlutterCodeGen(content) {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('message');
                    messageElement.classList.add('received');
                    messageElement.innerHTML = content + '<br><button id="flutter-yes">Yes</button> <button id="flutter-no">No</button>';
                    messagesContainer.appendChild(messageElement);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;

                    document.getElementById('flutter-yes').addEventListener('click', function() {
                        appendTriggerFlutterCodeGen(true);
                    });

                    document.getElementById('flutter-no').addEventListener('click', function() {
                        appendTriggerFlutterCodeGen(false);
                    });
                }

                function appendTriggerFlutterCodeGen(bool) {
                    console.log(bool)
                    if (bool == true) {
                        vscode.postMessage({
                            command: 'flutter_code_gen',
                            text: ""
                        });
                    }
                }

                function appendTriggerBackend(bool) {
                    console.log(bool)
                    if (bool == true) {
                        vscode.postMessage({
                            command: 'backend',
                            text: ""
                        });
                    }
                }

                function appendTriggerFrontend(bool) {
                    console.log(bool)
                    if (bool == true) {
                        vscode.postMessage({
                            command: 'frontend',
                            text: ""
                        });
                    }
                }

                function sendMessage() {
                    const message = messageInput.value.trim();
                    if (message) {
                        appendMessage(message, 'sent');

                        vscode.postMessage({
                            command: 'sendMessage',
                            text: messageInput.value.trim()
                        });

                        messageInput.value = '';
                    }
                }

                document.getElementById('send-button').addEventListener('click', sendMessage);

                messageInput.addEventListener('keydown', function(event) {
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        sendMessage();
                    }
                });

                document.getElementById('python-gen-button').addEventListener('click', function() {
                    appendTriggerPythonCodeGen(true);
                });

                document.getElementById('flutter-gen-button').addEventListener('click', function() {
                    appendTriggerFlutterCodeGen(true);
                });

                document.getElementById('backend-button').addEventListener('click', function() {
                    appendTriggerBackend(true);
                });

                document.getElementById('frontend-button').addEventListener('click', function() {
                    appendTriggerFrontend(true);
                });

                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.command === 'llmResponse') {
                        if (message.response.includes('{')) {
                            appendMessage('I have added the Openapi specifications to the openapi.yaml file. Tell me if you need to do any modifications.', 'received');
                            appendAskPythonCodeGen('Would you like me to activate the python code generator?')
                        } else {
                            appendMessage(message.response, 'received');
                        }
                    }
                    else if (message.command === 'errorResponse') {
                        vscode.postMessage({
                            command: 'sendMessage',
                            text: "Send the openapi json again, there was an error: " + message.error
                        });
                    }
                    else if (message.command === 'ollamaResponse') {
                        appendLetter(message.letter, message.done)
                    }
                });

                const messages = document.querySelectorAll('.message');
                messages.forEach(message => {
                    messagesContainer.prepend(message);
                });

            }());
        </script>
    </body>
</html>
`