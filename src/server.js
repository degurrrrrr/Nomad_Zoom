import express from "express";

const app = express();

app.set('view engine', 'pug'); // view 설정
app.set('views', __dirname + "/views");
app.use("/public", express.static(__dirname + "/public")); //유저가 /public으로 가게 되면 __dirname+'/public'을 보여줌
//우리가 사용하는 유일한 route
//home으로 가면 req,res를 받고 res.render 함
app.get("/", (req, res) => res.render("home")); // render
app.get("/*", (req, res) => res.redirect("/")); //정해두지 않은 url로 접속해도 '/'으로 돌아가게끔!

const handleListen = () => console.log(`Listening on http://localhost:5000`)
app.listen(5000, handleListen);