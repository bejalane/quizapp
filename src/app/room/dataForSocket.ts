export class RoomDataForSocket {
    constructor(
        public room: any, 
        public user: string
    ){}
}

export class AnswerData {
	constructor(
		public room: number,
		public user: string,
		public step: number,
		public question: number,
		public answer: number,
		public time: number
	){}
}