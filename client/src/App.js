import logo from './logo.svg';
import './App.css';
import React from 'react';
import api from './api/api';
const testData = require( './questions.json')

class Question extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			question: props.question,
			options: props.options,
			feedBack: "",
			checked: props.options[0],
			optionNum: 0,
			changeAnswer: props.changeAnswer
		}
		
		let value = {
			qNum: this.props.qNum,
			optionNum: 0
		}
		this.getAnswer = this.getAnswer.bind(this);

		this.state.changeAnswer(value)
	}

	async getAnswer(event) {
		let value = {
			qNum: Number(this.props.qNum),
			optionNum: Number(event.target.id)
		}

		console.log("getting feedback")
		
		try{
            const response = await api.post('/api/feedback', {
				...value
			})
			.then((response) => {
				if(response.data){
					console.log("feedback correct")
					
					this.setState({
						feedBack: "Correct",
						checked: event.target.value,
						optionNum: Number(event.target.id)
					})
				}
				if(!response.data){
					this.setState({
						feedBack: "Wrong",
						checked: event.target.value,
						optionNum: Number(event.target.id)
					})
				}

			})
            
        }
        catch(err){
            console.log(err)
        }
	}

	onValChange = (event) => {
		let value = {
			qNum: this.props.qNum,
			optionNum: Number(event.target.id)
		}

		this.state.changeAnswer(value);

		this.getAnswer(event);
	}
	

	render(){
		let optionsHtml = []

		for(let i = 0; i < this.state.options.length; i++){
			let correct;

			if(this.state.feedBack !== ''){
				if(i === Number(this.state.optionNum)){
					correct = <a className = {this.state.feedBack}>{this.state.feedBack}</a>;
				}
			}
			
			optionsHtml[i] =  <label className = "options">
									<input
										id = {i}
										type="radio"
										value= {this.state.options[i]}
										checked={this.state.checked === this.state.options[i]}
										onChange={this.onValChange}/>
								
									<span>{this.state.options[i]} {correct}</span>
								</label>										
		}

		return(
			<div className = "holder">
				<div className = "question">
					<h1 className = "question-header">{this.state.question}</h1>
					<form>
						{optionsHtml}
					</form>
				</div>
			</div>

		)
	}

}


class App extends React.Component {
	constructor(){
		super();
		
		//state stores the, score- null if submit button not press, answers stores the users answers, and data which is null if not retreived from server
		this.state = {
			data: null,
			answers: [],
			score: null
		}

		this.getAnswer = this.getAnswer.bind(this)
		this.getdata = this.getdata.bind(this)
		this.setAnswer = this.setAnswer.bind(this)
	}

	//test function for testing the react without the need for the server running
	getDataTest(){
		let q = []

    	for(let i = 0; i < testData.length; i ++){
			q[i] = {
				stem: testData[i].stem,
				options: testData[i].options
			}
    	}
		
		this.setState({
			data: q	
		})
	}

	//axios function for getting server data
    async getdata(){
        try{
            const response = await api.get('/api/data')
            console.log(response.data)
			this.setState({
                data: response.data,
            })
        }
        catch(err){
            console.log(err)
        }

	}

	//set the answer state value, this function is passed as a property to each question
	setAnswer = (value) => {
		console.log(value)
		let prevAnswer = this.state.answers;

		prevAnswer[value.qNum] = value.optionNum;

		this.setState({
			answers: prevAnswer
		})
	}

	//when submit it clicked, upload the data
	onSubmitForm = () => {
		this.getAnswer()
	}

	async getAnswer(){
		try{
			console.log(this.state.answers)
            const response = await api.post('/api/answers', {
				...this.state.answers
			})
			.then((response) => {
				this.setState({
					score: response.data
				})
			})
            
        }
        catch(err){
            console.log(err)
        }
	}

	render(){
		if(this.state.data === null){
			this.getdata();
			//this.getDataTest()
			return(
				<div>Loading</div>
			)
		}
		else{
			let questions = []
			let score = <h1 className = "answer"> 0/5 </h1>;
			let submission = <button className = "submit-button" onClick = {this.onSubmitForm}> Submit</button>

			if(this.state.score !== null){
				score = <h1 className = "answer">{this.state.score}/5</h1>
				submission = <button className = "submit-button"> Submitted </button>
			}

			for(let i = 0; i < this.state.data.length; i ++){
				questions[i] = <Question
									qNum = {i}
									question = {this.state.data[i].stem}
									options = {this.state.data[i].options}
									changeAnswer = {this.setAnswer}
							   />
			}

			return (
				<div className="App">
					<header className = "title">
						Quiz
					</header>
					<div>
						{questions}
					</div>

					<div className = "submission-holder">
						{submission}
						{score}
					</div>
				</div>

			);
		}
		
	}
	
}

export default App;
