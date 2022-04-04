function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
} 

function manager_main_layout(){
	this.main_holder=document.getElementById('main_holder');
	this.main_holder.cycil_end=new Event('cycil_end')
	this.main_holder.account_event=new Event('account_event')
	this.main_holder.start_bt=document.getElementById('start_bt');
	this.main_holder.notifications_bt=document.getElementById('notifications_bt');
	this.main_holder.alerts_holder=document.getElementById('alerts_holder');
	this.main_holder.password_taker=document.getElementById('password_taker');
	this.main_holder.password_ok_bt=document.getElementById('password_ok_bt');
	this.main_holder.password_input=document.getElementById('password_input');
	this.main_holder.user_name_input=document.getElementById('user_name_input');
	this.main_holder.last_update=document.getElementById('last_update');
	this.main_holder.reserver_holder_holder=document.getElementById('reserver_holder_holder');
	this.main_holder.show_reserver_button=document.getElementById('show_reserver_button');
	this.main_holder.hid_reserver_button=document.getElementById('hid_reserver_button');
	this.main_holder.reserver_holder=document.getElementById('reserver_holder');
	this.notification_puplic_key='BAnlkboOC-XU-l8uHkWHCbngrPRBOBJynF82sYZXoxiB6FUQHjnOLkV58EFbnMLjI13e1J7CQUJO5_twB7nR7lU';
	this.socket;
	this.cheker_url='ws://localhost:3000/data';
	this.firest_connect=false;
	//this.cheker_url='wss://chek.glitch.me/data';
	this.connect_state=false;
	this.notifications_state=true;
	this.account_state=false;
	this.Notification_subscrip;
	
	this.get_notification_subscripe=(async()=>{
		window.addEventListener('serviceWorker_done',async(e)=>{
			var register=(await navigator.serviceWorker.getRegistrations())[0]
		    this.Notification_subscrip = await register.pushManager.subscribe({
		        userVisibleOnly: true,
		        applicationServerKey: urlBase64ToUint8Array(this.notification_puplic_key)
		    });
		    console.log(this.Notification_subscrip)
		})	
	})()

	this.handel_notification_on_off=()=>{
		this.main_holder.notifications_bt
		.addEventListener('click',()=>{
			this.notifications_state=!this.notifications_state;
			console.log("notifications_state",this.notifications_state)
		})		
	}

	this.update_supscripe=async()=>{
		try{
			console.log('iwill update subscrip')
			var register=(await navigator.serviceWorker.getRegistrations())[0]
			var subscription=await register.pushManager.getSubscription()
			if(subscription){
				await subscription.unsubscribe()
			}
		    this.Notification_subscrip = await register.pushManager.subscribe({
		        userVisibleOnly: true,
		        applicationServerKey: urlBase64ToUint8Array(this.notification_puplic_key)
		    });
		    this.socket.send(JSON.stringify({function:'update_supscripe',Notification_subscrip:this.Notification_subscrip}))
		}catch(err){
			console.log(err)
		}
	}

	this.handel_start=(()=>{
		this.main_holder.start_bt
		.addEventListener('click',()=>{
			if(!this.firest_connect){
				this.show_hid_password_taker(true)
				this.main_holder.start_bt.style.color='rgb(38 190 38)';
				this.main_holder.start_bt.style.cursor='wait';
				this.firest_connect=true
			}
			
		})
	})();

	this.show_hid_password_taker=(state)=>{
		switch(state){
			case true:
				this.main_holder.password_taker.classList.remove('hid')
				break;
			case false:
				this.main_holder.password_taker.classList.add('hid')
				break;				
		}
	}

	this.show_reserver=(()=>{
		this.main_holder.show_reserver_button
		.addEventListener('click',()=>{
			this.main_holder.reserver_holder_holder.style['box-shadow']='0 0 3px 0px #383434a3';
			this.main_holder.reserver_holder_holder.style.top='0vh'
		})
		//this.main_holder.show_reserver_button.click()
	})()

	this.hid_reserver=(()=>{
		this.main_holder.hid_reserver_button
		.addEventListener('click',()=>{
			this.main_holder.reserver_holder_holder.style['box-shadow']='none';
			this.main_holder.reserver_holder_holder.style.top='100vh'
		})
	})()

	this.handel_password=(()=>{
		this.main_holder.password_ok_bt
		.addEventListener('click',async()=>{
			if(!this.Notification_subscrip){return}
			this.user_name=this.main_holder.user_name_input.value;
			this.password=this.main_holder.password_input.value;
			this.account_state=true;
			this.main_holder.dispatchEvent(this.main_holder.account_event)
			await this.connect(this.user_name,this.password)
			console.log('connected')
		})
	})()

	this.account=()=>{
		return new Promise((res,rej)=>{
			if(this.account_state){
				console.log(1)
				res(true)
			}else{
				console.log(2)
				this.main_holder.addEventListener('account_event',()=>{
					res(true)
				})
			}
		})
	}

	//

	this.connect=(user_name,password,prev_res)=>{
		if(!prev_res){
			return new Promise((res,rej)=>{
				this.socket=new WebSocket(this.cheker_url);
				this.socket.res=res;
				this.socket.addEventListener('open',async()=>{
				this.main_holder.start_bt.textContent='Working';
				this.socket.send(JSON.stringify({user_name:user_name,password:password,Notification_subscrip:this.Notification_subscrip}))
      			this.handel_socket_masseges()
				this.show_hid_password_taker(false)
				this.connect_state=true;
     			setTimeout(()=>{this.socket.send(JSON.stringify({function:'get_all_valid_disise'}))},2000)        
				this.socket.addEventListener('close', async(event) => {
					this.disconnect_ruteen()
				},{once:true});		
      
				this.socket.addEventListener('error', async(event) => {
					this.disconnect_ruteen()
				},{once:true});	
				this.socket.res(true)
				})	

				this.socket.addEventListener('error',(err)=>{	
					this.disconnect_ruteen()	
				},{once:true})	

				this.socket.addEventListener('close', async(event) => {
					this.disconnect_ruteen()
				},{once:true});	

			})
		}else{
			this.socket=new WebSocket(this.cheker_url);
			this.socket.res=prev_res;
			this.socket.addEventListener('open',async()=>{
			this.main_holder.start_bt.textContent='Working';
			this.socket.send(JSON.stringify({user_name:user_name,password:password,Notification_subscrip:this.Notification_subscrip}))
  			this.handel_socket_masseges()
			this.show_hid_password_taker(false)
			this.connect_state=true;
 			setTimeout(()=>{this.socket.send(JSON.stringify({function:'get_all_valid_disise'}))},2000)        
			this.socket.addEventListener('close', async(event) => {
				this.disconnect_ruteen()
			},{once:true});		
  
			this.socket.addEventListener('error', async(event) => {
				this.disconnect_ruteen()
			},{once:true});	
			this.socket.res(true)
			})	

			this.socket.addEventListener('error',(err)=>{	
				this.disconnect_ruteen()	
			},{once:true})	

			this.socket.addEventListener('close', async(event) => {
				this.disconnect_ruteen()
			},{once:true});			
		}

	}

	this.handel_socket_masseges=(ws)=>{
		this.socket.addEventListener('message',(event)=>{
			var message=JSON.parse(event.data);
			switch(message.function){
				case 'all_valid_allert':
					this.render_all_valid_allert(message.allerts_array);
					break					
				case 'allert_update':
					this.allert_update(message.update_by,message.allert_object);
					break						
				case 'last_update':
					this.set_last_update(message.date);
					break
				case 'update_supscripe':
					this.update_supscripe();
					break														
			}
		})
	}


	this.allert_update=(update_by,allert_object)=>{
		switch(update_by){
			case 'valid':
				this.remove_allert_if_exest(allert_object)
				//this.showNotification(allert_object['city'],disise['disise'],disise['dates_state'],new Date().toLocaleString())
				var allert=document.createElement('allert-holder');
				allert.allert_object=allert_object;
				allert.setAttribute('class','no_sellect')
				this.main_holder.alerts_holder.appendChild(allert)
				break;
			case 'unvalid':
				var unvalid_allert=this.main_holder.alerts_holder
				.querySelector(`[allert_key='${allert_object['allert_key']['value']}']`)
				unvalid_allert.remove()
				break;
		}
	}

	this.remove_allert_if_exest=(allert_object)=>{
		var allert=this.main_holder.alerts_holder
		.querySelector(`[allert_key='${allert_object['allert_key']}']`)
		if(allert){
			allert.remove()
		}	
	}

	this.set_last_update=(date)=>{
		this.main_holder.last_update.setAttribute('value',date)
	}

	this.render_all_valid_allert=(allerts_array)=>{
		console.log(allerts_array)
	    try{
	      while(this.main_holder.alerts_holder.children[0]){
	        this.main_holder.alerts_holder.children[0].remove()
	      }     
	    }catch(err){}
			for(var allert_object of allerts_array){
				this.remove_allert_if_exest(allert_object)
				var allert=document.createElement('allert-holder');
				allert.allert_object=allert_object;
				allert.setAttribute('class','no_sellect')
				this.main_holder.alerts_holder.appendChild(allert)
				console.log('down')
		}
	}	

	this.disconnect_ruteen=()=>{
		if(!this.socket.discpnnect_catch){
			this.main_holder.start_bt.textContent='Connecting';
			this.socket.discpnnect_catch=true;
			console.log('error to connect',event)
			setTimeout(()=>{
				this.connect(this.user_name,this.password,this.socket.res)
			},2)
		}		
	}

	this.delay=(time)=>{
		return new Promise((res,rej)=>{
			setTimeout(()=>{res()},time)
		})
	}

	this.ask_for_notification_premitions=()=>{
		Notification.requestPermission(function(result) {
		  if (result === 'granted') {
		  	console.log('done')
		  }
		});
	 // At last, if the user has denied notifications, and you  // want to be respectful there is no need to bother them any more.	
	}
	//this.ask_for_notification_premitions()
	this.showNotification=(city,desise,datas_State,time)=>{
		if(!this.notifications_state){return}
		Notification.requestPermission(function(result) {
		  if (result === 'granted') {
		    navigator.serviceWorker.ready.then(function(registration) {
		      var dates_state_text=datas_State?'المواعيد : يوجد':'المواعيد : لايوجد';
		      registration.showNotification(
		      	city,
		      	{
		      		body:`(${desise})\n${dates_state_text}\n${time}\nApp`,
		      		icon: '/icons/iknow_allert-192x192.png',
		      	}
		      	);
		    });
		  }
		});		
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

var MML=new manager_main_layout
