const puppeteer = require('puppeteer');

class Manager_Browser{
	constructor(props) {
		this.browser;
		this.re_open_browser_count=0;
		this.start()
	}
	async start(){
		await this.open_browser(true)
		await this.open_main_page()	
		await this.reserv_cycil(null)
		await this.reserv_cycil(null)
	}
//p27d14mc0af6c9ohjeac5ge7o4
	async open_browser(visible_stat,prev_res){
		if(!prev_res){
			return new Promise(async(res,rej)=>{
				try{
					this.browser=await puppeteer.launch({
						headless: !visible_stat,
					    slowMo:0,
					    defaultViewport: null,
					    ignoreDefaultArgs: ["--disable-extensions"],
					    ignoreHTTPSErrors: true,
					    args: ['--allow-file-access-from-files','--enable-features=NetworkService','--no-sandbox']
					})
					this.visible_stat=visible_stat;
					this.open_state=true;
					this.context = this.browser.defaultBrowserContext();
					this.context.clearPermissionOverrides();
					res(true);			
				}catch(err){
					if(this.re_open_browser_count<5){
						this.re_open_browser_count++
						await this.open_browser(visible_stat,res)
					}else{
						res(false);	
					}
				}			
			})			
		}else{
			try{
				this.browser=await puppeteer.launch({
					headless: !visible_stat,
				    slowMo:0,
				    defaultViewport: null,
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
					await this.open_browser(visible_stat,prev_res)
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
		      Object.defineProperty(navigator, 'plugins', {
		        get: () => [1, 2, 3, 4, 5],
		      });
		    });	    
		    res()
 		})
 	}	

	async open_main_page(){
		this.page=await this.browser.newPage();
		await this.open_ruteen()			
		await this.page.goto('http://pod.mohp.gov.eg/register',{waitUntil: 'load', timeout: 0});
	}

	async reserv_cycil(reserv_object){
		console.time('all time : ');
		await this.realod()
		await this.fill(null)
		await this.save()
		console.timeEnd("all time : ");	
		console.log((await this.page.cookies()))
	}

	async fill(fill_object){
		await this.fill_national_id('27904241500274')
		await this.fill_name_1('سامح')
		await this.fill_name_2('جاد الله')
		await this.fill_name_3('بسيوني')
		await this.fill_name_4('الجبالي')
		await this.select_city('29')
		await this.select_mark_code('2901')
		await this.select_vill_code('290101')
		await this.fill_benf_address('القاهره قسم الموسكي')
		await this.select_major_dismed('1')
		await this.click_on_ok_in_allert()
		await this.select_social_rel('01')
		await this.fill_benf_job('معلم')
		await this.fill_benf_tel('01001922558')
		await this.select_center_id('26')
		await this.select_fk_centerschd_id('694')
		await this.select_visit_time('from3')
	}
	
	async save(){
		return new Promise(async(res,rej)=>{
			try{
				await this.page.waitForSelector(`.dhxform_btn_txt.dhxform_btn_txt_autowidth`);
				var save_button=await this.page.$(`.dhxform_btn_txt.dhxform_btn_txt_autowidth`)
				await save_button.click()
				await this.click_on_ok_in_allert()
				res()
			}catch(err){
				console.log(err)
				res()
			}
		})
	}

	async realod(){
		console.time('realod time : ');
		await this.page.deleteCookie({
            name : 'PHPSESSID',
            domain : "pod.mohp.gov.eg"
        })
		await this.page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
		console.timeEnd("realod time : ");
	}

	async fill_national_id(national_id){
		return new Promise(async(res,rej)=>{
			await this.page.waitForSelector(`[name='national_id']`);
			var national_id_input=await this.page.$(`[name='national_id']`)
			await national_id_input.click()
			await this.page.keyboard.type(national_id,{delay:0});
			res(true)
		})
	}

	async fill_name_1(name_1_value){
		return new Promise(async(res,rej)=>{
			await this.page.waitForSelector(`[name='name_1']`);
			var name_1=await this.page.$(`[name='name_1']`)
			await name_1.click()
			await this.page.keyboard.type(name_1_value,{delay:0});
			res(true)
		})
	}

	async fill_name_2(name_2_value){
		return new Promise(async(res,rej)=>{
			await this.page.waitForSelector(`[name='name_2']`);
			var name_2=await this.page.$(`[name='name_2']`)
			await name_2.click()
			await this.page.keyboard.type(name_2_value,{delay:0});
			res(true)
		})
	}

	async fill_name_3(name_3_value){
		return new Promise(async(res,rej)=>{
			await this.page.waitForSelector(`[name='name_3']`);
			var name_3=await this.page.$(`[name='name_3']`)
			await name_3.click()
			await this.page.keyboard.type(name_3_value,{delay:0});
			res(true)
		})
	}	

	async fill_name_4(name_4_value){
		return new Promise(async(res,rej)=>{
			await this.page.waitForSelector(`[name='name_4']`);
			var name_4=await this.page.$(`[name='name_4']`)
			await name_4.click()
			await this.page.keyboard.type(name_4_value,{delay:0});
			res(true)
		})
	}	

	async select_city(city_key){
		await this.page.waitForSelector("[name='govt_code']");
		await this.page.select("[name='govt_code']", city_key);
	}

	async select_mark_code(mark_code){
		await this.page.waitForSelector("[name='mark_code']");
		await this.page.waitForSelector(`[value='${mark_code}']`);
		await this.page.select("[name='mark_code']", mark_code);
	}

	async select_vill_code(vill_code){
		await this.page.waitForSelector("[name='vill_code']");
		await this.page.waitForSelector(`[value='${vill_code}']`);
		await this.page.select("[name='vill_code']", vill_code);
	}

	async fill_benf_address(benf_address_value){
		return new Promise(async(res,rej)=>{
			await this.page.waitForSelector(`[name='benf_address']`);
			var benf_address=await this.page.$(`[name='benf_address']`)
			await benf_address.click()
			await this.page.keyboard.type(benf_address_value,{delay:0});
			res(true)
		})
	}

	async select_vill_code(vill_code){
		await this.page.waitForSelector("[name='vill_code']");
		await this.page.waitForSelector(`[value='${vill_code}']`);
		await this.page.select("[name='vill_code']", vill_code);
	}

	async select_major_dismed(major_dismed){
		await this.page.waitForSelector("[name='major_dismed']");
		await this.page.waitForSelector(`[value='${major_dismed}']`);
		await this.page.select("[name='major_dismed']", major_dismed);
	}	

	async click_on_ok_in_allert(){
		return new Promise(async(res,rej)=>{
			await this.page.waitForSelector(`[class='dhtmlx_popup_button']`);
			var ok_bt=await this.page.$(`[class='dhtmlx_popup_button']`)
			await ok_bt.click()
			res(true)
		})
	}

	async select_social_rel(social_rel){
		await this.page.waitForSelector("[name='social_rel']");
		await this.page.waitForSelector(`[value='${social_rel}']`);
		await this.page.select("[name='social_rel']", social_rel);
	}	

	async fill_benf_job(benf_job_value){
		return new Promise(async(res,rej)=>{
			await this.page.waitForSelector(`[name='benf_job']`);
			var benf_job=await this.page.$(`[name='benf_job']`)
			await benf_job.click()
			await this.page.keyboard.type(benf_job_value,{delay:0});
			res(true)
		})
	}

	async fill_benf_tel(benf_tel_value){
		return new Promise(async(res,rej)=>{
			await this.page.waitForSelector(`[name='benf_tel']`);
			var benf_tel=await this.page.$(`[name='benf_tel']`)
			await benf_tel.click()
			await this.page.keyboard.type(benf_tel_value,{delay:0});
			res(true)
		})
	}

	async select_center_id(center_id){
		await this.page.waitForSelector("[name='center_id']");
		await this.page.waitForSelector(`[value='${center_id}']`);
		await this.page.select("[name='center_id']", center_id);
	}

	async select_fk_centerschd_id(fk_centerschd_id){
		await this.page.waitForSelector("[name='fk_centerschd_id']");
		await this.page.waitForSelector(`[value='${fk_centerschd_id}']`);
		await this.page.select("[name='fk_centerschd_id']", fk_centerschd_id);
	}

	async select_visit_time(visit_time){
		await this.page.waitForSelector("[name='visit_time']");
		await this.page.waitForSelector(`[value='${visit_time}']`);
		await this.page.select("[name='visit_time']", visit_time);
	}	
}

var MB=new Manager_Browser;