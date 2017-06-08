class Answer {
    constructor(
        public id: any,
        public answer_text: string
    ){}
}

export class Question {
    constructor(
        public id: any,
        public question_text:string,
        public answers: any[]
    ){	
    	if(!this.answers.length){
	    	for (var i = 0; i < 4; ++i) {
	    		let answer = new Answer("", "");
	    		this.answers.push(answer);
	    	}
    	}
    }
}
