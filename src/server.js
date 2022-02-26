import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set('view engine', 'pug'); // view 설정
app.set('views', __dirname + "/views");
app.use("/public", express.static(__dirname + "/public")); //유저가 /public으로 가게 되면 __dirname+'/public'을 보여줌
//우리가 사용하는 유일한 route
//home으로 가면 req,res를 받고 res.render 함
app.get("/", (req, res) => res.render("home")); // render
app.get("/*", (req, res) => res.redirect("/")); //정해두지 않은 url로 접속해도 '/'으로 돌아가게끔!

const handleListen = () => console.log(`Listening on http://localhost:5000`)

const server = http.createServer(app); //http server 생성
const wss = new WebSocket.Server({ server }) //websocket에서 http 사용 (필수 아님, ws만 작동원하면 이것만)

// 여기 socket은 "연결된 브라우저"를 의미
wss.on("connection", (socket) => {
    //connection: 브라우저 연결되었을 때 실행하는거
    console.log("브라우저 연결!!!") 
    // 브라우저 꺼졌을 때 
    socket.on("close", () => console.log("client로부터 연결이 끊어져따"));
    // 브라우저가 서버에 메세지 보냈을 때
    socket.on('message', message => {
        const translatedMessageData = message.toString('utf8');
        console.log(translatedMessageData);
      });    
    // 브라우저에 메세지를 보내도록
    socket.send("hello!!!!!");
});

server.listen(5000, handleListen);