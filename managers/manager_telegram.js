const TelegramBot = require('node-telegram-bot-api');
global.EventEmitter = require('events');
class MyEmitter extends EventEmitter {}

class manager_telegrame{
	constructor() {
		this.token = '';
		this.commands=['/login'];
		this.events=new MyEmitter();
		this.bot=new TelegramBot(this.token, {polling: true});
		this.start()
	}

	handel_massages(){
		this.bot.on('message', (msg) => {
			try{
				if(msg.text){
					var command=this.cheek_if_text_start_with_command_and_return_comanad(msg.text)
					switch (command) {
						case '/login':
							this.handel_log_in_command(msg.text,msg.from.id)
							break;
					}
				}
			}catch(err){
				console.log(err)
			}
		});
	}

	cheek_if_text_start_with_command_and_return_comanad(text){
		for(var command of this.commands){
			if(text.startsWith(command)){
				return command
			}

		}
		return false
	}

	handel_log_in_command(login_command_text,chate_id){
		try{
			var {user_name,password}=this.get_user_name_password_from_login_command(login_command_text)
			if(!user_name||!password){return this.bot.sendMessage(chate_id, 'Something Rong In Login Data')}
			this.events.emit('login',{chate_id,user_name,password})
		}catch(err){
			return this.bot.sendMessage(chatId, 'Something Rong In Login Data')
		}
	}

	get_user_name_password_from_login_command(login_command_text){
		try{
			var login_command_array=login_command_text.split(" ");
			var username_password_text=login_command_array[login_command_array.length-1];
			var user_name_password_array=username_password_text.split(",");
			var user_name=user_name_password_array[0];
			var password=user_name_password_array[1];
			return {user_name,password}
		}catch(err){
			return {user_name:false,password:false}
		}
	}

	send(chate_id,message_text){
		this.bot.sendMessage(chate_id, message_text)
	}

	send_to_array(chate_ids_array,message_text){
		for(var chate_id of chate_ids_array){
			this.bot.sendMessage(chate_id, message_text)
		}
	}

	async start(){
		this.handel_massages()
		console.log(true)
	}	

 	delay(time){
		return new Promise((res,rej)=>{
			setTimeout(()=>{res()},time)
		})
	}
}

//var MT=new manager_telegrame

module.exports = new manager_telegrame;
