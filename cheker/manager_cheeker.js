//var puppeteer = require('puppeteer');
var fetch = require('node-fetch');
var xml2js = require('xml2js');
const express = require('express')
var cors = require('cors')
var path = require('path')

var parser = new xml2js.Parser(/* options */);
class manager_cheker{
	constructor(props) {
		this.browser;
		this.country_map={
			'1':"القاهرة",
			'2':"الاسكندرية",
			'3':"بورسعيد",
			'4':"السويس",
			'5':"حلوان",
			'11':"دمياط",
			'12':"الدقهلية",
			'13':"الشرقية",
			'14':"القليوبية",
			'15':"كفر الشيخ",
			'16':"الغربية",
			'17':"المنوفية",
			'18':"البحيرة",
			'19':"الإسماعيلية",
			'21':"الجيزة",
			'22':"بنى سويف",
			'23':"الفيوم",
			'24':"المنيا",
			'25':"اسيوط",
			'26':"سوهاج",
			'27':"قنا",
			'28':"أسوان",
			'29':"الاقصر",
			'31':"البحر الاحمر",
			'32':"الوادى الجديد",
			'33':"مرسى مطروح",
			'34':"شمال سيناء",
			'35':"جنوب سيناء"
		}

		this.desise_map={
			"1":'أمراض الدم',
			"3":'الإعاقة البصرية',
			"4":'الإعاقة السمع بصرية',
			"5":'الإعاقة السمعية',
			"6":'الإعاقة الذهنية',
			"7":'الإعاقة الحركية',
			"8":'اضطراب طيف توحد',
			"11":'القزامة',
			"14":'الإعاقة المتعددة',
		}
		this.before_get_city_periods=[1000,1100,1050,1250,1500,1650,1800,1890,1900,1930,1950];
		this.before_get_disise_periods=[700,800,850,900,950];
		this.working_soket_id=0;
		this.start()
	}

	delay(time){
		return new Promise((res,rej)=>{
			setTimeout(()=>{res()},time)
		})
	}

	wait(){
   		if (true) setTimeout(()=>{this.wait()}, 30000);
	}

	async start(){
		/*while(true){
			//await this.delay(this.before_get_cycels_periods.random())
			await this.get_cycil()
		}*/
		this.start_http_server()
	}

	start_http_server(){
		this.http_server = express()
		this.http_server.use(cors())
		this.http_server.use(express.static(path.join(__dirname,"app")));
		//this.http_server.use(express.static(__dirname + './styles'));
		var expressWs = require('express-ws')(this.http_server);
		this.http_server.ws('/data', (ws, req)=> {
			this.working_soket_id++;
			ws.working_soket_id=this.working_soket_id;
			this.socket=ws;
			ws.on('message',(msg)=> {
			  	var msg=JSON.parse(msg)
			  	console.log(msg)
			    switch(msg.function){
			    	case 'get_cycil':
			    		console.log('get_cycil')
			    		this.get_cycil(msg.last_country,ws)
			    		break;
			    }
			});
		});

		this.http_server.get('/app',(req,res)=>{
			res.sendFile(path.join(__dirname, 'app/index.html'));
		})

		this.http_server.listen(3000)
	}

	mute_ws(ws){
		ws.on('message',(msg)=> {
		  	console.log('muted  :',msg)
		});		
	}

    async open_browser(visible_stat,prev_res){
		if(!prev_res){
			return new Promise(async(res,rej)=>{
				try{
					
					this.browser=await puppeteer.launch({
						headless: !visible_stat,
					    slowMo:60,
					    defaultViewport: null,
					    userDataDir: './user_data',
					    ignoreDefaultArgs: ["--disable-extensions"],
					    ignoreHTTPSErrors: true,
					    args: ['--allow-file-access-from-files','--enable-features=NetworkService','--no-sandbox']
					})
					this.visible_stat=visible_stat;
					this.open_state=true;
					this.context = this.browser.defaultBrowserContext();
					this.context.clearPermissionOverrides();		
					/*this.browser.clearPermissionOverrides();
					this.browser.overridePermissions('https://web.whatsapp.com',['camera']);*/
					res(true);			
				}catch(err){
					if(this.re_open_browser_count<5){
						this.re_open_browser_count++
						await this.open(visible_stat,res)
					}else{
						res(false);	
					}
				}			
			})			
		}else{
			try{
				this.browser=await puppeteer.launch({
					headless: !visible_stat,
				    slowMo:60,
				    defaultViewport: null,
				    userDataDir: './user_data',
				    ignoreDefaultArgs: ["--disable-extensions"],
				    ignoreHTTPSErrors: true,
				    args: ['--allow-file-access-from-files','--enable-features=NetworkService','--no-sandbox']
				})
				this.visible_stat=visible_stat;
				this.context = this.browser.defaultBrowserContext();
				this.context.clearPermissionOverrides();				
				prev_res(true);			
			}catch(err){
				console.log(err)
				if(this.re_open_browser_count<5){
					this.re_open_browser_count++
					await this.open(visible_stat,prev_res)
				}else{
					prev_res(false);	
				}
			}				
		}
	}
 	
 	open_ruteen(){
 		return new Promise(async(res,rej)=>{
			//await this.page.setUserAgent(this.userAgent);	    
		    await this.page.evaluateOnNewDocument(() => {
		      Object.defineProperty(navigator, 'webdriver', {
		        get: () => false,
		      });
		    });
		    await this.page.evaluateOnNewDocument(() => {
		      // Overwrite the `plugins` property to use a custom getter.
		      Object.defineProperty(navigator, 'plugins', {
		        // This just needs to have `length > 0` for the current test,
		        // but we could mock the plugins too if necessary.
		        get: () => [1, 2, 3, 4, 5],
		      });
		    });	    
		    //await this.page.setBypassCSP(true)	
		    res()
 		})
 	}	

 	async open_page(url){
 		this.page=await this.browser.newPage();
		await this.open_ruteen()
		await this.page.goto('http://pod.mohp.gov.eg/register',{waitUntil: 'load', timeout: 0});	
 	}

 	async get_xml_secound_result(url){
		const response = await fetch(url);
		const data = await response.text()
		var result=await parser.parseStringPromise(data);
		return result['data']['item'][1];
 	}

 	async get_cycil(last_country,ws){
 		if(!last_country||last_country=="جنوب سيناء"){
			for(var country_key in this.country_map){
				if(ws.working_soket_id!=this.working_soket_id){
					return true
				}
				await this.delay(this.before_get_city_periods.random())
				await this.get_city(country_key)
			}	
			this.send_cycil_end()			
 		}else{
 			var end_detected=false;
			for(var country_key in this.country_map){
				if(ws.working_soket_id!=this.working_soket_id){
					return true
				}			
				if(!end_detected){
					if(this.country_map[country_key]==last_country){
						end_detected=true;
					}
				}else{
					await this.delay(this.before_get_city_periods.random())
					await this.get_city(country_key)
				}
			}
				
 		}
		
 	}



 	async get_city(city_code){
 		var city_object=new Object;
 		city_object[this.country_map[city_code]]={};
 		for(var disise_key in this.desise_map){
 			var url=`http://pod.mohp.gov.eg/apps/lookups/centers.php?lk_governments=${city_code}&major_dismed=${disise_key}&dhxr1638123344142=1`
 			await this.delay(this.before_get_disise_periods.random())
 			var secound_result=await this.get_xml_secound_result(url);
 			if(secound_result){
 				city_object[this.country_map[city_code]][this.desise_map[disise_key]]=true;
 			}else{
 				city_object[this.country_map[city_code]][this.desise_map[disise_key]]=false;
 			}
 		}

		var message=JSON.stringify(city_object)
		this.socket.send(message)
 		console.log(city_object)
 	} 	

 	send_cycil_end(){
		var message=JSON.stringify({end:true})
		this.socket.send(message) 		
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

var MC=new manager_cheker

//http://pod.mohp.gov.eg/register

//http://pod.mohp.gov.eg/apps/lookups/centers.php?lk_governments=21&major_dismed=3&dhxr1638123344142=1
