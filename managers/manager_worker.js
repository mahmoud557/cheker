class MyEmitter extends EventEmitter {}
class manager_worker{
	constructor() {
		//this.workers_url=['192.168.1.200:3001','192.168.1.200:3002','192.168.1.200:3003','192.168.1.200:3004','192.168.1.200:3005','192.168.1.200:3006'];
		this.workers_url=['localhost:3002','localhost:3003','localhost:3004','localhost:3005'];
		this.workers=new Set();
		this.state;
		this.events=new MyEmitter();
		this.connect_to_all_workers()
	}

	get_worker_by_url(url){
		for(var worker of this.workers){
			if(worker.worker_url==url){
				return worker;
			}
		}
	}

	async connect_to_all_workers(){
		for(var url of this.workers_url){
			await this.connect_to_worker(url)
		}
		this.state='ready_to_cycil';
		this.events.emit('ready_to_cycil')
	}

	connect_to_worker(url,prev_res){
		if(!prev_res){
			return new Promise(async(res,rej)=>{
				const ws = new WebSocket(`ws://${url}/data`);
				ws.res=res;
				ws.worker_url=url;
				ws.on('open', async()=>{
					console.log('connected to worker')
					
				    ws.worker_url=url;
					ws.once('close', (err)=>{
						this.close_ruteen(ws,err)
					})
					ws.once('error', (err)=>{
						this.close_ruteen(ws,err)
					})	
					ws.on('message', (data)=>{
						this.handel_socket_message(ws,data)
					})					
					this.workers.add(ws)	
					await this.delay(500)
					this.send_get_sycel_message_automatic_on_open_when_state_is_in_cycil(ws)														    
				    ws.res()
				});
				ws.once('error', (err)=>{
					setTimeout(()=>{
						console.log('error to connect',err)
						this.connect_to_worker(ws.worker_url,ws.res)
					},1000)
				})
				
			})	
		}else{
			const ws = new WebSocket(`ws://${url}/data`);
			ws.res=prev_res;
			ws.worker_url=url;
			ws.on('open', async()=>{
				console.log('connected to worker')
			    ws.worker_url=url;
				ws.once('close', (err)=>{
					this.close_ruteen(ws,err)
				})	
				ws.once('error', (err)=>{
					this.close_ruteen(ws,err)
				})
				ws.on('message', (data)=>{
					this.handel_socket_message(ws,data)
				})				
				this.workers.add(ws)
				await this.delay(500)
				this.send_get_sycel_message_automatic_on_open_when_state_is_in_cycil(ws)												    
			    ws.res()
			});
			ws.once('error', (err)=>{
				//console.log('error to connect',err)
				setTimeout(()=>{
					this.connect_to_worker(ws.worker_url,ws.res)
				},1000)
			})							
		}
	}

	async close_ruteen(ws,err){
		console.log(this.state)
		await this.connect_to_worker(ws.worker_url);
		var t= this.workers.delete(ws)
		console.log(t)
	}

	send_get_sycel_message_automatic_on_open_when_state_is_in_cycil(ws){
		if(this.state=='in_cycil'){
			this.send_get_sycil_message(ws)
		}
	}

	handel_socket_message(ws,data){
		var message=data.toString();
		message=JSON.parse(message);
		if(message.end){
			ws.end=true;
			this.chek_if_cycil_end()
		}else{
			this.events.emit('cycil_data',message)
		}
	}

	chek_if_cycil_end(){
		var worker_end_count=0;
		for(var worker of this.workers){
			if(worker.end==true){
				worker_end_count+=1;
			}
		}
		if(worker_end_count==this.workers_url.length){
			this.events.emit('cycil_end')
		}
		
	}

	ready(){
		return new Promise((res,rej)=>{
			this.ready_to_cycil_res=res;
			if(this.state=='ready_to_cycil'){
				this.ready_to_cycil_res(true)
			}else{
				this.events.once('ready_to_cycil',()=>{
					this.state='ready_to_cycil';
					this.ready_to_cycil_res(true)
				})
			}
		})
	}

	get_cycil(){
		return new Promise((res,rej)=>{
			this.state="in_cycil";
			for (let worker of this.workers) {
				this.send_get_sycil_message(worker)
			}
			this.listen_to_cycil_end(res)
		})
	}

	send_get_sycil_message(worker){
		worker.end=false;
		var message=JSON.stringify({function:'get_cycil'})
		worker.send(message)		
	}

	listen_to_cycil_end(res){
		this.sycle_end_res=res
		this.events.once('cycil_end',()=>{
			this.state='ready_to_cycil';
			this.sycle_end_res(true)
		})
	}

 	delay(time){
		return new Promise((res,rej)=>{
			setTimeout(()=>{res()},time)
		})
	}
}

module.exports = new manager_worker;

/*
var MW=new manager_worker;
(async()=>{
	await MW.ready()
	console.time("sycile_time");
	await MW.get_cycil()
	console.timeEnd("sycile_time");
	console.log('sycle_end')
})()
*/



















			/*ws.on('message', (data)=> {
			    console.log('received: %s', data);
			});

			ws.on('close',()=>{
			    console.log('disconnected');
			});*/