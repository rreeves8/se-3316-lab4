// Require express and create an instance of it
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const data = require( './questions.json')

app.use(express.static('client/build'))

//answer api, receives the answers and responds with number of correct
app.post('/api/answers', jsonParser,(request,response) => {
    let submitted = request.body;
    let totalCorrect = 0;
    console.log(request.body)

    console.log(submitted)

    for(let i = 0; i < data.length; i ++){
        if(submitted[i] === data[i].answerIndex){
            totalCorrect++;
        }
    }

    response.json(totalCorrect)
})

//responds with the correct answer for indivudual questions
app.post('/api/feedback', jsonParser,(request,response) => {
    let submitted = request.body;
    let correct = false;

    console.log(submitted.optionNum)
    console.log(data[submitted.qNum].answerIndex);

    if(submitted.optionNum === data[submitted.qNum].answerIndex){
        correct = true;
    }

    console.log(correct)

    response.json(correct)
})



app.get('/api/data', (request,response) => {
    let q = []

    for(let i = 0; i < data.length; i ++){
        q[i] = {
            stem: data[i].stem,
            options: data[i].options
        }
    }
    response.json(q)
})

app.listen(80, (request, response) => {
    console.log("Server is running at port 80");
});