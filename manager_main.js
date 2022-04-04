var Public_key='BAnlkboOC-XU-l8uHkWHCbngrPRBOBJynF82sYZXoxiB6FUQHjnOLkV58EFbnMLjI13e1J7CQUJO5_twB7nR7lU';
var private_key='CbgQji_fZR6uY-Y0ppXMy60mZwgh9-vuWvI56D2P8VA'

global.express = require('express')
global.cors = require('cors')
global.path = require('path')
global.webpush = require('web-push');
global.bodyParser = require('body-parser');
global.jsonfile = require('jsonfile')
global.fs=require('fs')
global.EventEmitter = require('events');
global.WebSocket = require('ws');
global.fetch = require('node-fetch');

class Manager_Main{

	constructor(props) {
		this.defult_file_data={};
		this.file_data_path=path.join(__dirname,'./data.json')
		this.listener_sockets=new Set()
		this.notification_listener_subscription=new Set();
		this.uvalid_notification_listener_subscription_endpoints=new Set();
		this.valed_disise=new Set()
		this.allerts_array=[];
		this.accounts=[];
		this.last_notification_subscrip_key=0;
		this.statistecs={
			up_time_in_secund:process.uptime(),
			up_time_in_hours:Math.floor(process.uptime() / 3600),
			sockets_in_connect:null,
			sycile_time:null,
			prodcast_to:null,
			prodcast_time:null,
			last_supscription_update:null,
			last_city_time:null,
			last_city_name:null,
			errors_count:0,
			last_error_time:null,
			last_error_type:null,
			last_error:null
		}
		this.start()
	}

	async load_managers(){
		global.manager_worker=require('./managers/manager_worker.js');
		global.manager_telegram=require('./managers/manager_telegram.js');
		global.manager_notification=require('./managers/manager_telegram.js');
		global.manager_DB=require('./managers/manager_db.js');
	}

	async load_file_data(){
		var {accounts}=await jsonfile.readFile(this.file_data_path)
		this.accounts=accounts;
	}

	async save_file_data(){
		var file_object={
			accounts:this.accounts,
		}
	    try{
	      await jsonfile.writeFile(this.file_data_path,file_object,{ spaces: 2, EOL: '\r\n' })
	    }catch(err){
			this.statistecs.errors_count+=1;
			this.statistecs.last_error=err;
			this.statistecs.last_error_type='save_file_data';
			this.statistecs.last_error_time=new Date().toLocaleString('en')	
	    }	
	}

	start_http_server(){
		this.http_server = express()
		this.http_server.use(cors())
		this.http_server.use(bodyParser.json())
		this.http_server.use(express.static(path.join(__dirname,"app")));
		var expressWs = require('express-ws')(this.http_server);	
		this.http_server.ws('/data', (ws, req)=> {
			this.set_socket(ws)
		});
		this.http_server.get('/app',(req,res)=>{
			res.sendFile(path.join(__dirname, 'app/index.html'));
		})
		this.http_server.post('/reserver_data',async(req,res)=>{
			var account=req.body.account;
			var reserver_data=await this.get_reserver_data_by_account(account)
			res.json(reserver_data);
		})		
		webpush.setVapidDetails('mailto:mercymeave@section.com', Public_key,private_key);
		this.http_server.listen(3000)
	}

	get_reserver_data_by_account(account){
		return {host:'192.168.1.200:5000',account:account}
	}

	cheek_if_socket_in_listener_socket_by_user_name_and_return_socket(user_name){
		try{
			for(var socket of this.listener_sockets){
				if(socket['user_name']==user_name){
					return socket;
				}
			}
			return false
		}catch(err){
			this.statistecs.errors_count+=1;
			this.statistecs.last_error=err;
			this.statistecs.last_error_time=new Date().toLocaleString('en')			
		}			
	}


	get_listener_socket_by_supscription_endpoit(endpoint){
		try{
			for(var socket of this.listener_sockets){
				if(socket['notification_subscribe']['endpoint']==endpoint){
					return socket;
				}
			}
			return false
		}catch(err){
			this.statistecs.errors_count+=1;
			this.statistecs.last_error=err;
			this.statistecs.last_error_type='get_listener_socket_by_supscription_endpoit';
			this.statistecs.last_error_time=new Date().toLocaleString('en')			
		}				
	}


	set_link_in_allerts_array_and_return_allert_object(link){
		var allert_object={
			allert_key:{key:'allert_key',value:link},
			link:{key:'link',value:link,body_element:true},
			date:{key:'Date',value:`'${new Date().toLocaleTimeString()}'`,body_element:true}
		}
		this.allerts_array.push(allert_object)
		return allert_object
	}

	remove_link_from_allerts_array_and_return_allert_object(link){
		const index = this.allerts_array.findIndex(object => {
		  return object['link']['value'] === link;
		});
		var allert_object=(this.allerts_array.splice(index, 1))[0];
		return allert_object
	}

	cheek_if_link_in_allerts_array(link){
		for(var allert_object of this.allerts_array){
			if(allert_object.link.value==link){return true}
		}
		return false
	}

	send_allert_update_to_all_sockets(update_by,allert_object){
		for(var socket of this.listener_sockets){
			try{
				var message=JSON.stringify({function:'allert_update',update_by,allert_object})
				socket.send(message)
			}catch(err){
				this.statistecs.errors_count+=1;
				this.statistecs.last_error=err;
				this.statistecs.last_error_time=new Date().toLocaleString('en')	
			}
		}
	}	

	handel_manager_worker_cycil_data_event(){
		manager_worker.events.on('cycil_data',async(data)=>{
			console.log('iwill')
			this.send_last_update_to_all_sockets(new Date().toLocaleString('en')) 
			for(var link_object of data){
				var avaleble_state=link_object['avaleble_state'];
				var link=link_object['link'];
				switch (avaleble_state) {
					case true:
						var cheek_if_link_in_valid_allert_state=this.cheek_if_link_in_allerts_array(link)
						if(!cheek_if_link_in_valid_allert_state){
							var allert_object=this.set_link_in_allerts_array_and_return_allert_object(link)
							this.send_to_all_notification_listener({title:'Avalible_link',body:link})
							this.send_to_all_telegram_listener(link)
							this.send_allert_update_to_all_sockets('valid',allert_object)
						
						}
					break;
					case false:
						var cheek_if_link_in_valid_allert_state=this.cheek_if_link_in_allerts_array(link)
						if(cheek_if_link_in_valid_allert_state){
							var allert_object=this.remove_link_from_allerts_array_and_return_allert_object(link)
							this.send_allert_update_to_all_sockets('unvalid',allert_object)
						}
					break;					
				}
			}
		})
	}

	handel_manager_telegram_login_event(){
		manager_telegram.events.on('login',async(data)=>{
			var cheek_account_data_state=this.cheek_log_in_data(data.user_name,data.password)
			if(!cheek_account_data_state){return manager_telegram.send(data.chate_id,'Something Rong In Login Data')}
			var set_telegram_chat_id_to_account_state=await this.set_telegram_chate_id_to_account(data.user_name,data.chate_id)
			manager_telegram.send(data.chate_id,'Sucssess Log In')	
		})
	}

	async send_valide_disise_to_all_notification_listener(disise_object){
		try{
			var dates_state_text=disise_object['dates_state']?'المواعيد : يوجد':'المواعيد : لايوجد';
			var mesage_object={
				title:disise_object['city'],
				body:`(${disise_object['disise']}) \n ${dates_state_text}`
			}
			await this.send_to_all_notification_listener(mesage_object)		
		}catch(err){
			this.statistecs.errors_count+=1;
			this.statistecs.last_error=err;
			this.statistecs.last_error_type='send_valide_disise_to_all_notification_listener';
			this.statistecs.last_error_time=new Date().toLocaleString('en')			
		}		
	}

	send_last_update_to_all_sockets(date){
		for(var socket of this.listener_sockets){
			try{
				var message=JSON.stringify({function:'last_update',date})
				socket.send(message)	
			}catch(err){
				this.statistecs.errors_count+=1;
				this.statistecs.last_error=err;
				this.statistecs.last_error_type='send_last_update_to_all_sockets';
				this.statistecs.last_error_time=new Date().toLocaleString('en')	
			}
		}		
	}

	async set_socket(ws){
   		this.handel_socket_disconnect(ws)
	   	this.set_on_message_functions_to_socket(ws)
		await this.cheek_account(ws)
		await this.make_prev_account_not_listen(ws)
		await this.set_notification_subscription_to_account(ws)
		this.listener_sockets.add(ws)
		console.log('connected')
	}

	cheek_account(ws){
		return new Promise((res,rej)=>{
			ws.once('message',(msg)=> {		
				try{
				  	var msg=JSON.parse(msg)
				  	if(msg.password&&msg.user_name){
				  		var account=this.get_account_from_accounts_by_user_name(msg.user_name);
				  		if(account){
				  			if(msg.password==account.password){
				  				ws.password=msg.password;
				  				ws.user_name=msg.user_name;
				  				ws.notification_subscribe=msg.Notification_subscrip
				  				res()
				  			}
				  		}
				  	}
				}catch(err){
					this.statistecs.errors_count+=1;
					this.statistecs.last_error=err;
					this.statistecs.last_error_time=new Date().toLocaleString('en')			
				}				
			});
		})
	}

	cheek_log_in_data(user_name,password){
		var account=this.get_account_from_accounts_by_user_name(user_name);
		if(!account){return false}
		if(account.password!=password){return false}
		return true;
	}

	get_account_from_accounts_by_user_name(user_name){
		try{
			for(var account of this.accounts){
				if(account['Username']==user_name){
					return account
				}
			}
			return false
		}catch(err){
			this.statistecs.errors_count+=1;
			this.statistecs.last_error=err;
			this.statistecs.last_error_type='get_account_from_accounts_by_user_name';
			this.statistecs.last_error_time=new Date().toLocaleString('en')			
		}		
	}

	async make_prev_account_not_listen(ws){
		try{
			var socket=this.cheek_if_socket_in_listener_socket_by_user_name_and_return_socket(ws.user_name)
			if(socket){
				this.listener_sockets.delete(socket);
			}			
		}catch(err){
			this.statistecs.errors_count+=1;
			this.statistecs.last_error=err;
			this.statistecs.last_error_type='make_prev_account_not_listen';
			this.statistecs.last_error_time=new Date().toLocaleString('en')
		}

	}

	handel_socket_disconnect(ws){
	    ws.once('close', (wes)=> {
	        this.listener_sockets.delete(ws)
	    });	
		ws.once('error', (err)=>{
			this.listener_sockets.delete(ws)
		})	    	
	}

	async set_notification_subscription_to_account(ws){
		try{
			var account=this.get_account_from_accounts_by_user_name(ws.user_name);
			account.notification_subscribe=ws.notification_subscribe;
			await this.save_file_data()			
		}catch(err){
			this.statistecs.errors_count+=1;
			this.statistecs.last_error=err;
			this.statistecs.last_error_type='set_notification_subscription_to_account';
			this.statistecs.last_error_time=new Date().toLocaleString('en')
		}		
	}

	async set_telegram_chate_id_to_account(user_name,chate_id){
		try{
			var account=this.get_account_from_accounts_by_user_name(user_name);
			account.telegrame_chate_id=chate_id;
			await this.save_file_data()		
		}catch(err){
			this.statistecs.errors_count+=1;
			this.statistecs.last_error=err;
			this.statistecs.last_error_type='set_telegram_chate_id_to_account';
			this.statistecs.last_error_time=new Date().toLocaleString('en')
		}		
	}

	send_to_all_notification_listener(mesage_object){
		return new Promise(async(res,rej)=>{
			try{
				var begin=Date.now();
				for(var account of this.accounts){
					if(!account.notification_subscribe){continue}
					const payload = JSON.stringify(mesage_object);	
					await webpush.sendNotification(account.notification_subscribe, payload)
					.catch((err)=> {
						if(err.statusCode==410){
							this.uvalid_notification_listener_subscription_endpoints.add(err.endpoint)
						}
					});
				}
				var end= Date.now();
				this.statistecs.prodcast_time=(end-begin)/1000+"secs";
				res(true)		
			}catch(err){
				this.statistecs.errors_count+=1;
				this.statistecs.last_error=err;
				this.statistecs.last_error_type='send_to_all_notification_listener';
				this.statistecs.last_error_time=new Date().toLocaleString('en')
			}						
		})
	}

	send_to_all_telegram_listener(text_message){
		try{
			var telegrame_chate_ids=this.get_all_telegrame_chate_ids()
			console.log(telegrame_chate_ids)
			if(telegrame_chate_ids.length==0){return false}
			manager_telegram.send_to_array(telegrame_chate_ids,text_message)
		}catch(err){
			this.statistecs.errors_count+=1;
			this.statistecs.last_error=err;
			this.statistecs.last_error_type='send_to_all_notification_listener';
			this.statistecs.last_error_time=new Date().toLocaleString('en')
		}
	}

	get_all_telegrame_chate_ids(){
		var telegrame_chate_ids=[]		
		for(var account of this.accounts){
			if(!account.telegrame_chate_id){continue}
			telegrame_chate_ids.push(account.telegrame_chate_id)
		}
		return telegrame_chate_ids;
	}

	async handel_uvalid_notification_listener_subscription(){
		try{
			if(this.uvalid_notification_listener_subscription_endpoints.size>0){
				var temp_array=[...this.uvalid_notification_listener_subscription_endpoints];
				var endpoint=temp_array[0];
				await this.remove_unvalid_notification_subscription(endpoint)
				this.uvalid_notification_listener_subscription_endpoints.delete(endpoint)
				this.send_update_supscripe_to_socket(endpoint)
			}				
		}catch(err){
			this.statistecs.errors_count+=1;
			this.statistecs.last_error=err;
			this.statistecs.last_error_type='handel_uvalid_notification_listener_subscription';
			this.statistecs.last_error_time=new Date().toLocaleString('en')
		}
	}

	send_update_supscripe_to_socket(endpoint){
		try{
			var socket=this.get_listener_socket_by_supscription_endpoit(endpoint);
			if(socket){
				var message=JSON.stringify({function:'update_supscripe'})
				socket.send(message)			
			}
		}catch(err){
			this.statistecs.errors_count+=1;
			this.statistecs.last_error=err;
			this.statistecs.last_error_type='send_update_supscripe_to_socket';
			this.statistecs.last_error_time=new Date().toLocaleString('en')
		}		
	}

	async remove_unvalid_notification_subscription(unvalid_subscription_endpoint){
		for(var account of this.accounts){
			if(!account.notification_subscribe){continue}
			if(account.notification_subscribe.endpoint==unvalid_subscription_endpoint){
				account.notification_subscribe=null;
				break;
			}
		}
		await this.save_file_data()
	}

	send_all_valid_allert(ws){
		var message=JSON.stringify({function:'all_valid_allert',allerts_array:this.allerts_array})
		ws.send(message)		
	}

	set_on_message_functions_to_socket(ws){
		ws.on('message',async(msg)=> {
		  	var msg=JSON.parse(msg)
		    switch(msg.function){
		    	case 'get_all_valid_disise':
		            if(!ws.password){return}
			    		this.send_all_valid_allert(ws)
			    		break; 
		    	case 'update_supscripe':
		    		try{
		            	if(!ws.password){return}
				    		ws.notification_subscribe=msg.Notification_subscrip;
				    		await this.set_notification_subscription_to_account(ws)
				    		this.statistecs.last_supscription_update=new Date().toLocaleString();
				    		break;  		    			
				    }catch(err){
				    	console.log(err)
				    }
 			    		          
		    }
		});
	}

	five_sucond_task(){
		setInterval(async()=>{
			await this.handel_uvalid_notification_listener_subscription()
			this.show_statistics()
		},5000)		
	}

	send_erros_to_file(err){
		var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});  
		log_file_err.write(util.format('Caught exception: '+err) + '\n');	
	}

	show_statistics(){
		console.clear();
		this.statistecs.up_time_in_secund=process.uptime()
		this.statistecs.up_time_in_hours=Math.floor(process.uptime() / 3600);
		this.statistecs.sockets_in_connect=this.listener_sockets.size;
		this.statistecs.prodcast_to=this.accounts.length;
		console.log('----------------------')
		for(var key in this.statistecs){
			console.log(key,' : ',this.statistecs[key])
		}
		console.log('----------------------')
	}	


	delay(time){
		return new Promise((res,rej)=>{
			setTimeout(()=>{res()},time)
		})
	}

	async get_cycil_recertion(){
		await manager_worker.ready()
		var begin=Date.now();
		await manager_worker.get_cycil()
		var end= Date.now();
		this.statistecs.sycile_time=(end-begin)/1000+"secs";
		await this.get_cycil_recertion()
	}

	async start(){
		this.load_managers()
		this.start_http_server()
		//this.send_erros_to_file()
		//this.five_sucond_task()
		//this.handel_prossess_exet()
		await this.load_file_data()
		this.handel_manager_worker_cycil_data_event()
		this.handel_manager_telegram_login_event()
		await this.get_cycil_recertion()
	}

}


Object.defineProperty(Array.prototype, 'random', {
  value: function(chunkSize) {
  	  if(this.length==0){return new Error('Cant Use Roundom With Empty Array')}
	  min = Math.ceil(0);
	  max = Math.floor(this.length);
	  r=Math.floor(Math.random() * (max - min) + min);
	  return this[r]
  }
});



global.MM=new Manager_Main
