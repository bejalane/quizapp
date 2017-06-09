import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Question } from './question.model';
import { Observable } from 'rxjs/Rx';
import { HttpClientService } from '../shared/services/httpclient.service';
import { environment  } from '../environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DashboardBackOfficeService {
	constructor(private _http: HttpClientService){}

	getQuestions() : Observable<any> {
		return this._http.get(environment.url + 'admin/questions')
			.map((response:Response) => response.json())
			.catch((error:any) => Observable.throw(error.json().error || 'Server error'))
	}
 
	getQuestionById(id:any) : Observable<any> {
		return this._http.get(environment.url + 'admin/questions' + '/' + id)
			.map((response:Response) => response.json())
			.catch((error:any) => Observable.throw(error.json().error || 'Server error'))
	}

	updateAnswers(data:any, id:number) : Observable<any> {
		let req = Object.assign({}, data);
		for (var i = 0; i < req.answers.length; i++) {
			req.answers[i].is_right = (req.answers[i].is_right) ? 1 : 0;
		}
		if(id){
			return this._http.put(environment.url + 'admin/questions' + '/' + id, req)
				.map((response:Response) => response.json())
				.catch((error:any) => Observable.throw(error.json().error || 'Server error'))
		} else {
			return this._http.post(environment.url + 'admin/questions', req)
				.map((response:Response) => response.json())
				.catch((error:any) => Observable.throw(error.json().error || 'Server error'))
		}
	}

	validateQuestion(question:any){
		if(!question.question_text){
			return "Fill question text";
		}
		let answers = 0;
		for (var i = 0; i < question.answers.length; i++) {
			if(!question.answers[i].answer_text){
				answers++;
			}
		}
		if(answers){
			return "Fill all answers";
		}
		let right = 0;
		for (var n = 0; n < question.answers.length; n++) {
			if(question.answers[n].is_right){
				right++;
			}
		}
		if(!right){
			return "Choose right answer";
		}
		return false;
	}
}