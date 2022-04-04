global.LinvoDB = require("linvodb3");
global.LinvoDB.defaults.store = { db: require("leveldown") };
global.LinvoDB.dbPath = process.cwd();

class Manager_Db{

	constructor(props) {
		this.start()
	}

	load_componants(){
		this.manager_users = new (require('./componants/manager_db_users.js'))('kkk');
	}

	async start(){
		this.load_componants()
	}

    delay(time){
        return new Promise((res,rej)=>{
            setTimeout(()=>{res()},time)
        })
    }

}

module.exports= new Manager_Db