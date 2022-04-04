class Manager_Users{
	constructor() {
		this.users= new LinvoDB("users", { /* schema, can be empty */ })
		this.start()
	}
	async start(){
		//console.log(this.users)
	}

 	delay(time){
		return new Promise((res,rej)=>{
			setTimeout(()=>{res()},time)
		})
	}
}


module.exports = Manager_Users;
