//socket: 서버로의 연결
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => {
    console.log("서버 연결!!!")
})

socket.addEventListener("message", (message) => {
    console.log("메세지", message.data, "를 서버로부터 받았다!")
})

socket.addEventListener("close", () => {
    console.log("서버로부터 연결 끊어짐!")
})

setTimeout(() => {
    socket.send("얍");
  }, 5000);