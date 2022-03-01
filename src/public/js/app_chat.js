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

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = nicknameForm.querySelector('input');
  socket.emit('nickname', input.value);
  input.value = '';
}

function handleMsgSubmit(event) {
  event.preventDefault();
  const input = room.querySelector('#msg input');
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
  const msgForm = room.querySelector('#msg');
  msgForm.addEventListener('submit', handleMsgSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const roomNameInput = welcome.querySelector('#roomName');
  const nicknameInput = welcome.querySelector('#nickname');
  socket.emit('enter_room', roomNameInput.value, nicknameInput.value, showRoom); //room이라는 event를 emit
  roomName = roomNameInput.value; //join하면 input.value값으로 됨
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', (user, newCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `${roomName}(${newCount}) `;
  addMessage(`${user}님이 방에 입장하였습니다!`);
});

socket.on('bye', (left, newCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `${roomName}(${newCount})`;
  addMessage(`${left}님이 방에서 퇴장하였습니다`);
});

socket.on('room_change', (rooms) => {
  const roomList = welcome.querySelector('ul');
  roomList.innerHTML = '';
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement('li');
    li.innerText = room;
    roomList.appendChild(li);
  });
});

socket.on('new_message', addMessage);
