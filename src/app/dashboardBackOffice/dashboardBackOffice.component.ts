import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DashboardBackOfficeService } from './dashboardBackOffice.service';
import { Question } from './question.model';

@Component({
	moduleId: module.id,
	selector: 'dashboardBackOffice',
	templateUrl: 'dashboardBackOffice.component.html'
})

export class DashboardBackOfficeComponent  { 
	questions: any = [];
	answers: any = [];
	currentQuestion: number; 

	question: Question;
	editMode: boolean = false;
	addNewMode: boolean = false;

	constructor(private _dashboardBackOfficeService: DashboardBackOfficeService){}

	ngOnInit(){
		this._dashboardBackOfficeService.getQuestions()
			.subscribe(data =>{ 
				this.questions = data.data;
				console.log(this.questions);
			});
	}

	selectedQuestion(question:any, index:number){
		this._dashboardBackOfficeService.getQuestionById(question.id)
			.subscribe(data =>{ 
				this.answers = data.answers;
				let editQuestion = new Question(question.id, question.question_text, this.answers);
				this.question = editQuestion;

				this.currentQuestion = index;
				this.editMode = true;
				this.addNewMode = false;
			});
	}

	saveAnswers(){
		console.log(this.question);
		if(this.question.id){
			this._dashboardBackOfficeService.updateAnswers(this.question, this.question.id)
				.subscribe(data =>{ 
					console.log(data);
				});
		} else {
			console.log('save new q');
		}
	}

	createNewQuestion(){
		let newQuestion = new Question("", "", []);
		this.question = newQuestion;
		this.editMode = false;
		this.addNewMode = true;
		console.log(newQuestion);
	}

	identify(index:any,item:any){
      //do what ever logic you need to come up with the unique identifier of your item in loop, I will just return the object id.
      
      console.log(index);
      return index;
     }
}