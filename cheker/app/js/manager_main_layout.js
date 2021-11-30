function manager_main_layout(){
	this.main_holder=document.getElementById('main_holder');
	this.main_holder.cycil_end=new Event('cycil_end')
	this.main_holder.start_bt=document.getElementById('start_bt');
	this.main_holder.notifications_bt=document.getElementById('notifications_bt');
	this.main_holder.alerts_holder=document.getElementById('alerts_holder');
	this.before_get_cycels_periods=[120000,150000,180000,210000,240000,270000,300000];
	this.socket;
	this.cheker_url='ws://192.168.1.200:3000/data';
	this.connect_state=false;
	this.wait_befor=false;
	this.last_country='الإسماعيلية';
	
	this.get_data_from_cheker=async()=>{
		if(!this.connect_state){
			await this.connect()
			console.log('connect')
		}
		if(this.connect_state){
			this.socket.send(JSON.stringify({function:'get_cycil',last_country:this.last_country}))
		}
	}

	this.handel_cycil_end=(()=>{
		this.main_holder.addEventListener('cycil_end',async()=>{
			if(!this.wait_befor){
				//await this.delay(this.before_get_cycels_periods.random())
				await this.delay(10000)
				this.wait_befor=true;
				this.get_data_from_cheker()
			}else{
				this.get_data_from_cheker()	
			}
		})
	})()

	this.delay=(time)=>{
		return new Promise((res,rej)=>{
			setTimeout(()=>{res()},time)
		})
	}

	this.test=()=>{
		this.id=0
		setInterval(()=>{
				this.remove_all_alerts_for_city(this.id)
				this.id++
				var allert=document.createElement('allert-holder');
				allert.setAttribute('city',this.id)
				allert.city=this.id
				allert.disise=this.id
				allert.setAttribute('disise',this.id)
				allert.setAttribute('time',this.id)
				this.main_holder.alerts_holder.appendChild(allert)			
		},1000)
	}

	

	this.connect=()=>{
		return new Promise((res,rej)=>{
			this.socket=new WebSocket(this.cheker_url);

			this.socket.addEventListener('error',(err)=>{
				this.connect_state=false;
			})	

			this.socket.addEventListener('close', async(event) => {
				this.connect_state=false;
				this.main_holder.dispatchEvent(this.main_holder.cycil_end)
				
			});	

			this.socket.addEventListener('open',()=>{
				this.wait_befor=false;
				this.connect_state=true;
				res(true)
			})

			this.socket.addEventListener('message',(e)=> {
				var msg=JSON.parse(e.data)
				if(!msg.end){
					var city_name=(Object.keys(msg))[0];
					this.render_city(msg,city_name)
					this.last_country=city_name
				}else{
					this.wait_befor=false;
					this.main_holder.dispatchEvent(this.main_holder.cycil_end)
				}
				console.log(msg)
			});				

		})
	}

	//this.get_data_from_cheker()

	this.render_city=(city_object,city_name)=>{
		this.remove_all_alerts_for_city(city_name);
		for(var desise in city_object[city_name]){
			if(city_object[city_name][desise]==true){
				console.log('contain')
				var allert=document.createElement('allert-holder');
				allert.setAttribute('city',city_name)
				allert.city=city_name
				allert.disise=desise
				allert.time='4:50';
				allert.setAttribute('disise',desise)
				allert.setAttribute('time','4:50')
				this.main_holder.alerts_holder.appendChild(allert)
			}
		}
	}

	this.remove_all_alerts_for_city=(city)=>{
		var allerts=document.querySelectorAll(`[city='${city}']`)
		for(var allert of allerts){
			allert.remove()
		}
	}
	this.test()


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
