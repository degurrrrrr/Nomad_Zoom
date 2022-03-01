const socket = io(); //socketIO를 프론트와 연결

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;

let roomName; //roomName을 만들어주는 것. 처음에는 비어있다.

function addMessage(message) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
}

function handleMsgSubmit(event) {
  event.preventDefault();
  const input = room.querySelector('input');
  const value = input.value;
  socket.emit('new_message', input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = '';
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = `${roomName}에 입장하셨습니다`;
  const form = room.querySelector('form');
  form.addEventListener('submit', handleMsgSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', input.value, showRoom); //room이라는 event를 emit
  roomName = input.value; //join하면 input.value값으로 됨
  input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', () => {
  addMessage('누군가 방에 입장하였습니다');
});

socket.on('bye', () => {
  addMessage('누군가 방에서 퇴장하였습니다ㅜㅜ');
});

socket.on('new_message', addMessage);
