import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DashboardBackOfficeService } from './dashboardBackOffice.service';
import { Question } from './question.model';

@Component({
	moduleId: module.id,
	selector: 'dashboardBackOffice',
	templateUrl: 'dashboardBackOffice.component.html',
	styleUrls: ['bodashboard.component.css']
})

export class DashboardBackOfficeComponent  { 
	questions: any = [];
	answers: any = [];
	currentQuestion: number; 
	question: Question;
	editMode: boolean = false;
	addNewMode: boolean = false;
	validationError: string;
	successSave: string;

	constructor(private _dashboardBackOfficeService: DashboardBackOfficeService){}

	getListOfQuestions(){
		this._dashboardBackOfficeService.getQuestions()
			.subscribe(
				data =>{ 
					this.questions = data.data;
				},
				err => { console.log(err); }
			);
	}

	ngOnInit(){
		this.getListOfQuestions();
	}

	selectedQuestion(question:any, index:number){
		this.validationError = "";
		this._dashboardBackOfficeService.getQuestionById(question.id)
			.subscribe(
				data =>{ 
					this.answers = data.answers;
					let editQuestion = new Question(question.id, question.question_text, this.answers);
					this.question = editQuestion;
					this.currentQuestion = index;
					this.editMode = true;
					this.addNewMode = false;
				},
				err => { console.log(err); }
			);
	}

	saveAnswers(){
		let validate = this.validateQuestion();
		if(validate){
			this.validationError = validate;
			return false;
		}
		this.validationError = "";
		this._dashboardBackOfficeService.updateAnswers(this.question, this.question.id)
			.subscribe(
				data =>{ 
					this.successSave = "Question saved successfully";
					setTimeout(()=>{
					    this.successSave = "";
					}, 1000);
					this.getListOfQuestions();
				},
				err => { console.log(err); }
			);
	}

	createNewQuestion(){
		let newQuestion = new Question("", "", []);
		this.question = newQuestion;
		this.editMode = false;
		this.addNewMode = true;
	}

	checkRightAnswer(index){
		for (var i = 0; i < this.question.answers.length; i++) {
			if(i !== index){
				this.question.answers[i].is_right = false;
			}
		}
	}

	validateQuestion(){
		return this._dashboardBackOfficeService.validateQuestion(this.question);
	}

	identify(index:any,item:any){
      //do what ever logic you need to come up with the unique identifier of your item in loop, I will just return the object id.
      
      console.log(index);
      return index;
     }
}