const { request, response } = require('express');
//express 라이브러리 첨부 and 사용 (밑에2줄)
const express = require('express')
const app = express();
app.use(express.urlencoded({extended: true}))
//저장된 request를 쓰기위해

//MongoDB 대표적인 NoSQL DB 
const MongoClient = require('mongodb').MongoClient;
//mongodb 클라우드에 접속하면 안에 코드 실행해주세요
//url은 MongoDB Atlas에 참조.(마이 클러스터 쪽)

let db;
MongoClient.connect('mongodb+srv://rlatlswo135:qwe123@cluster0.ubwu1.mongodb.net/todoapp?retryWrites=true&w=majority', 
(error,client)=>{
    if(error){ //연결안됫을시
        return console.log(error)
    }
    db = client.db('todoapp'); //'todoapp'이라는 db를 변수에

    db.collection('post').insertOne({name:'John',age:20}, (에러시,성공시)=>{
        console.log('저장완료')
    })
    //만든 db의 변수에 콜렉션(폴더)이름은 'post'(내가만듬) 거기다 insert(넣겟다) data를 
    //1.argu = 저장할data(객체형으로 반드시) 2.argu = 에러시,성공시 인자받아서 주는 콜백함수


    app.listen(8080, ()=>console.log('listening on 8080'));
})

//8080이란 포트 들어오면 콜백함수 실행
// 1. listen함수
// (인자1 = 서버를 오픈할 포트 인자2 = 들어올때 실행할 콜백함수)
// listen -> 포트8080으로 들어오면 서버를 띄워준다는거,
// 즉 다른포트로 들어가면 서버가 없으니 암것도 안됨

// 1. get요청을 받았을때 처리하는  -> 누군가 /pet url로 방문하면 콜백함수 실행
//(인자1 = 경로 인자2 = 방문할때 실행할 콜백함수) -> get의 콜백함수도 2개의 인자를받는다 (요청,응답)->어떤식으로 요청 어떤식으로 응답
// .get()여러개로 경로 많이 생성 가능,
app.get('/pet',(request,response) => {
    response.send('펫 용품 쇼핑 페이지입니다')
})
app.get('/',(request,response) => {
    response.sendFile(__dirname + '/index.html') // 현재폴더 내에 index.html 경로 찝음
    //'/'경로에 왓을때 html파일을 띄우고싶을때 -> .sendFile()함수 인자=경로

    /* $ __dirname vs __filename
    전자 = 현재 실행중인 폴더 경로.  -> my_project/node/todoapp
    후자 = 현재 실행중인 파일 경로.  -> my_project/node/todoapp/server.js
    */                                          
})
app.get('/write',(request,response) => {
    response.sendFile(__dirname + '/write.html')

//어떤사람이 /add경로로 POST요청을 하면 ~~~해주세요

app.post('/add', (request,response) => {
    response.send('전송완료')
    console.log(request.body.data)
    console.log(request.body.date)
    console.log(request.body)
})
})


//request -> 클라쪽에서 한행동      이렇다가아니고 느낌.
//response -> 서버입장에서 할행동