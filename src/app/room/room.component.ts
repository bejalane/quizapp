import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { RoomDataForSocket, AnswerData } from './DataForSocket';
import { RoomService } from './room.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as io from "socket.io-client";
import { Question } from './question.model';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
	moduleId: module.id,
	selector: 'room',
	templateUrl: 'room.component.html'
})

export class RoomComponent  { 
	username:string = Cookie.get('quiz_user');
	sub: any;
	id: number;
	socket: any = null;
	data: any;
	players: any[];
	quizActive: boolean;
	questionMode: boolean;
	resultsMode: boolean;
	question: Question;
	results: any[];
	step: number;
	answerSend: boolean;
	stepTime: any;
	loaderTime: number;
	loaderTimePercents: string;
	roomLink: string;
	roomChangesMessages: any[] = [];

	constructor(
		private _roomService: RoomService,
		private route: ActivatedRoute,
		private _router: Router,
		@Inject(DOCUMENT) private document: any
	){
	    let sdata = new RoomDataForSocket(this.id, Cookie.get('quiz_token'));
		this.socket = io('http://quiz.slstaging.tk:6560');
	    this.socket.on('RoomChanges', (data:any) => {
      		console.log(data);
      		if(data.type == 'joined'){
      			let msg = data.user.name + ' joined the room...';
      			if(this.roomChangesMessages[this.roomChangesMessages.length-1] != msg){
      				this.roomChangesMessages.push(msg);
      			}
      		}
      		this.getAllRoomPlayers(this.id);
      	});
      	this.step = 0;
      	this.socket.on('SendQuestion', (data:any) => {
      		this.quizActive = true;
      		this.questionMode = true;
      		this.resultsMode = false;
      		this.answerSend = false;
      		console.log(data);
      		this.question = new Question(data.question.id, data.question.question_text, data.question.answers);
      		this.step++;
      		this.stepTime = Date.now();
      		this.timer();
      	});
      	this.socket.on('SendIntermediateResults', (data:any) => {
      		this.questionMode = false;
      		this.resultsMode = true;
      		console.log(data);
      		this.results = data.results;
      	});
      	this.roomLink = this.document.location.href;
	}

	timer(){
    	this.loaderTime = (15000 - (Date.now() - this.stepTime))/150;
    	this.loaderTimePercents = this.loaderTime.toFixed(2);
    	setTimeout(() => { 
    		if(this.loaderTime > 0) { 
    			this.timer(); 
    		} 
    	}, 25);
    }

	joinRoom(roomId:any){
		this._roomService.joinRoom(roomId)
			.subscribe(
				data =>{ 
					console.log(data);
					let sdata = new RoomDataForSocket(parseInt(roomId), Cookie.get('quiz_token'));
					this.socket.emit('joinRoom', sdata);
					if(Cookie.get('temp_room')){
						Cookie.delete('temp_room', '');
					}
				},
				err => {
					console.log(err);
					if(err == 'token_not_provided'){
						Cookie.set('temp_room', roomId);
						this._router.navigate(['/']);
					} else {
						if(Cookie.get('temp_room')){
							Cookie.delete('temp_room', '');
						}
					}
				}
			);
	}

	getAllRoomPlayers(roomId:any){
		this._roomService.getAllRoomPlayers(roomId)
			.subscribe(
				data => { 
					console.log(data.users);
					this.players = data.users;
				},
				err => {
					console.log(err);
				}
			);
	}

	startQuiz(){
		let sdata = new RoomDataForSocket(this.id, Cookie.get('quiz_token'));
		this.socket.emit('startQuiz', sdata);
	}

	chooseAnswer(answerId:number){
		if(!this.answerSend){
			console.log(answerId);
			let currentTime = Date.now() - this.stepTime;
			console.log(currentTime);
			let sdata = new AnswerData(this.id, Cookie.get('quiz_token'), this.step, this.question.id, answerId, currentTime);
			this.socket.emit('sendResult', sdata);
			this.answerSend = true;
		}
	}

	copyRoomAddress(){
		let selBox = document.createElement('textarea');

	    selBox.style.position = 'fixed';
	    selBox.style.left = '0';
	    selBox.style.top = '0';
	    selBox.style.opacity = '0';
	    selBox.value = this.roomLink;

	    document.body.appendChild(selBox);
	    selBox.focus();
	    selBox.select();

	    document.execCommand('copy');
	    document.body.removeChild(selBox);

	    this.roomLink = 'Copied!';
	    setTimeout(() => {this.roomLink = this.document.location.href;}, 500)
	}

	ngOnInit() {
	   this.sub = this.route.params.subscribe(params => {
	      this.id = parseInt(params['id']); // (+) converts string 'id' to a number
	      this.joinRoom(this.id);
	      this.getAllRoomPlayers(this.id);
	   });
	}

	
}