const { request, response } = require('express');
//express 라이브러리 첨부 and 사용 (밑에2줄)
const express = require('express')
const app = express();
app.use(express.urlencoded({extended: true}))
//저장된 request를 쓰기위해
app.set('view engine','ejs');
//ejs사용 -> ejs는 'views'라는 폴더안에 위치해야함

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
    console.log(request.body) //obj
    db.collection('counter').findOne({name:'postEA'}, (error,result) => {
        //함수 find() = 데이터 다찾기 findOne() = 해당 값을가진 그곳의데이터만 찾기 인자1=해당값 인자2=callBack
        if(error) return error
        console.log(result) //obj
        db.collection('post').insertOne({...request.body , ...{_id : result.totalPost + 1} }, (error,client) => {
            db.collection('counter').updateOne({name:'postEA'},{$inc : {totalPost : 1}},() => console.log('성공'))
            /*
            MongoDB 내 data 업데이트시 -> 위에 findOne이랑 비슷. 
            인자1 = 해당값을가진 그곳의 데이터를  인자2 = 이렇게세팅하겟다 인자3 = 콜백. (에러, 성공케이스)
            $inc -> 값을 기존것에서 변경 $set -> 값을 새로 세팅 -> operator 문법(검색)
            */
            response.send('전송완료')
            
    })
    /*
    리액트처럼 고유 id값이 필요 안적으면 mongoDB내에서 자체적으로 부여. -> id는 영구결번느낌으로 새겨주는게 좋다.
    해당 id의 data가 삭제되어도 그 data가 가진 id는 다른data가 못가지게끔.
    만든 db의 변수에 콜렉션(폴더)이름은 'post'(내가만듬) 거기다 insert(넣겟다) data를 
    1.argu = 저장할data(객체형으로 반드시) 2.argu = 에러시,성공시 인자받아서 주는 콜백함수
    */
    })
})

app.get('/list', (request,response) => { 
    //db(위에변수로지정함)내 post 컬렉션안에 모든 데이터 꺼내기 -> 배열로(toArray)
    db.collection('post').find().toArray( (error,suc) => {
        if(error) return error
        console.log(suc)
        response.render('list.ejs', {result : suc});
    });
    //가져온데이터를 list.ejs에 박아서 렌더하면서 result라는 키값에 value로 넣는다 ( 모든데이터값은 obj로 받는다 )
})

})


//request -> 클라쪽에서 한행동      이렇다가아니고 느낌.
//response -> 서버입장에서 할행동