import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

const app = express();

app.set('view engine', 'pug'); // view 설정
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public')); //유저가 /public으로 가게 되면 __dirname+'/public'을 보여줌
//우리가 사용하는 유일한 route
//home으로 가면 req,res를 받고 res.render 함
app.get('/', (req, res) => res.render('home')); // render
app.get('/*', (req, res) => res.redirect('/')); //정해두지 않은 url로 접속해도 '/'으로 돌아가게끔!

const httpServer = http.createServer(app); //http server 생성
const wsServer = SocketIO(httpServer);

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size; //set이니까 size!
  // ? => roomname을 찾을 수도 있지만 아닐 수도 있어서
}

wsServer.on('connection', (socket) => {
  socket['nickname'] = '익명';
  socket.onAny((event) => {
    console.log(`Socket Event:  ${event}`);
  });
  socket.on('enter_room', (roomName, nickname, done) => {
    socket.join(roomName);
    socket['nickname'] = nickname;
    done();
    socket.to(roomName).emit('welcome', socket.nickname, countRoom(roomName));
    wsServer.sockets.emit('room_change', publicRooms());
  });
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => socket.to(room).emit('bye', socket.nickname, countRoom(room) - 1));
  });
  socket.on('disconnect', () => {
    wsServer.sockets.emit('room_change', publicRooms());
  });
  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_message', `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on('nickname', (nickname) => (socket['nickname'] = nickname));
});
// const wss = new WebSocket.Server({ server }) //websocket에서 http 사용 (필수 아님, ws만 작동원하면 이것만)

// const sockets = [];

// // 여기 socket은 "연결된 브라우저"를 의미
// //connection: 브라우저 연결되었을 때 실행하는거
// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Anonymous";
//      console.log("서버에서 브라우저와 연결!!!")
//     socket.on("close", () => console.log("client로부터 연결이 끊어져따"));
//     socket.on("message", msg => {
//         const _message = msg.toString('utf8');
//         const message = JSON.parse(_message);
//         switch (message.type){
//           case "new_message":
//             sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
//           case "nickname":
//             socket["nickname"] = message.payload;
//     };
//   });
// });

const handleListen = () => console.log(`Listening on http://localhost:5000`);
httpServer.listen(5000, handleListen);
