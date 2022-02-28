const messageList = document.querySelector("ul");
const nicknameForm = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");
//socket: 서버로의 연결
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
    const msg = { type, payload }; //object로 만들었다!
    return JSON.stringify(msg); //object를 string으로!
}

socket.addEventListener('open', () => {
    console.log("서버에 연결!")
})

socket.addEventListener("message", (message) => {
    const li = document.createElement('li');
    li.innerText = message.data;
    messageList.append(li);
})

socket.addEventListener("close", () => {
    console.log("서버로부터 연결 끊어짐!")
})
  // "우리에게 event를 준다"
function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    const li = document.createElement('li');
    li.innerText = `You: ${input.value}`
    messageList.append(li);
    input.value = ''; //보내고 나서 input 창 비워주는 역할
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = nicknameForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value)); // {} : JSon object 객체 전송
    input.value = '';
}

messageForm.addEventListener("submit", handleSubmit)
nicknameForm.addEventListener("submit", handleNicknameSubmit)