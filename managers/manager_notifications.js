class Manager_notifications{
	constructor() {
		this.token = '1800756985:AAGaX9D89TBRbTThxMWJrn6vbMyJ9q32T9M';
		this.bot=new TelegramBot(this.token, {polling: true});
		this.start()
	}

	async start(){
		console.log(true)
	}

	handel_log_in(){

	}

 	delay(time){
		return new Promise((res,rej)=>{
			setTimeout(()=>{res()},time)
		})
	}
}

//var MT=new manager_telegrame

module.exports = new Manager_notifications;
