class Data_Taker extends HTMLElement {
    constructor() {
        super();
        this.disises_array=[
            {value:null,textContent:'..........'},
            {value:'1',textContent:'أمراض الدم'},
            {value:'3',textContent:'الإعاقة البصرية'},
            {value:'4',textContent:'الإعاقة السمع بصرية'},
            {value:'5',textContent:'الإعاقة السمعية'},
            {value:'6',textContent:'الإعاقة الذهنية'},
            {value:'7',textContent:'الإعاقة الحركية'},
            {value:'8',textContent:'اضطراب طيف توحد'},
            {value:'11',textContent:'القزامة'},
            {value:'14',textContent:'الإعاقة المتعددة'},
        ]
        this.social_rel=[
            {value:null,textContent:'..........'},
            {value:'01',textContent:'متزوج'},
            {value:'02',textContent:'أعزب'},
            {value:'03',textContent:'أرمل'},
            {value:'04',textContent:'مطلق'},
            {value:'04',textContent:'منفصل / مهاجره'},
            {value:'05',textContent:'دون سن الزواج'},
        ]        
        this.city_array=[
            {value:null,textContent:'..........'},
            {value:'1',textContent:'القاهرة'},
            {value:'2',textContent:'الاسكندرية'},
            {value:'3',textContent:'بورسعيد'},
            {value:'4',textContent:'السويس'},
            {value:'5',textContent:'حلوان'},
            {value:'11',textContent:'دمياط'},
            {value:'12',textContent:'الدقهلية'},
            {value:'13',textContent:'الشرقية'},
            {value:'14',textContent:'القليوبية'},
            {value:'15',textContent:'كفر الشيخ'},
            {value:'16',textContent:'الغربية'},
            {value:'17',textContent:'المنوفية'},
            {value:'18',textContent:'البحيرة'},
            {value:'19',textContent:'الإسماعيلية'},
            {value:'21',textContent:'الجيزة'},
            {value:'22',textContent:'بنى سويف'},
            {value:'23',textContent:'الفيوم'},
            {value:'24',textContent:'المنيا'},
            {value:'25',textContent:'اسيوط'},    
            {value:'26',textContent:'سوهاج'},
            {value:'27',textContent:'قنا'},
            {value:'28',textContent:'أسوان'},
            {value:'29',textContent:'الاقصر'},
            {value:'31',textContent:'البحر الاحمر'},
            {value:'32',textContent:'الوادى الجديد'},
            {value:'33',textContent:'مرسى مطروح'},
            {value:'34',textContent:'شمال سيناء'},
            {value:'35',textContent:'جنوب سيناء'},                  
        ];  
        this.form_object={};
        this.firest_connect_state=false;

    }

   async firest_connect(){
        if(!this.firest_connect_state){
            this.render()
            this.get_input_lines()
            this.get_select_lines()
            this.render_disises_options()
            this.render_city_options()
            this.render_social_rel()
            this.handel_city_select()
            this.handel_center_select()
            this.hid()
            this.save()
            this.firest_connect_state=true
        }
    }
    render(){
        this.innerHTML=`
            <top-div>
                <left-div></left-div>
                <right-div class='center'>
                    <c-icon src='icons/rong.svg' size='34'></c-icon>
                </right-div>
            </top-div>
            <bottom-div>
                <input-line key='الرقم القومي' value="" dir='auto' ></input-line>
                <input-line key='الإسم الأول' value="" dir='auto' ></input-line>
                <input-line key='الإسم الثاني' value="" dir='auto' ></input-line>
                <input-line key='الإسم الثالث' value="" dir='auto' ></input-line>
                <input-line key='اللقب' value="" dir='auto' ></input-line>
                <input-line key='العنوان' value="" dir='auto' ></input-line>
                <input-line key='الوظيفة' value="" dir='auto' ></input-line>
                <input-line key='التليفون' value="" dir='auto' ></input-line>
                <select-line key='نوع الاعاقه' value="" dir='auto' ></select-line>
                <select-line key='المحافظة' value="" dir='auto' ></select-line>
                <select-line key='المركز' value="" dir='auto' ></select-line>
                <select-line key='القرية/الحي' value="" dir='auto' ></select-line>
                <select-line key='الحالة الإجتماعية' value="" dir='auto' ></select-line>
            </bottom-div>
            <div class='controlers center'>
                <div class='center'>Cancle</div>
                <div class='center'>Save</div>
            </div>

        `
    }

    hid(){
        this.children[0].children[1]
        .addEventListener('click',(e)=>{
            this.previousElementSibling.click()
            if(this.edite_mode){
                this.edite_mode=false;
                this.reset_all_lines()
            }
        })
    }

    get_input_lines(){
        this.input_lines=this.children[1].querySelectorAll('input-line')
        console.log(this.input_lines)
    }

    get_select_lines(){
        this.select_lines=this.children[1].querySelectorAll('select-line')
    }

    render_disises_options(){
        this.children[1].children[8].remove_all_options()
        this.children[1].children[8].render_options(this.disises_array)
    }

    render_city_options(){
        this.children[1].children[9].remove_all_options()
        this.children[1].children[10].remove_all_options()
        this.children[1].children[11].remove_all_options()
        this.children[1].children[9].render_options(this.city_array)
    }

    render_centers_options(centers_options_array){
        this.children[1].children[10].remove_all_options()
        this.children[1].children[11].remove_all_options()
        this.children[1].children[10].render_options([{value:'null',textContent:'---------'},...centers_options_array])
        this.children[1].children[10].reset()
        this.children[1].children[11].reset()
   }

    render_vills_options(vills_options_array){
        this.children[1].children[11].remove_all_options()
        this.children[1].children[11].render_options([{value:'null',textContent:'---------'},...vills_options_array])
        this.children[1].children[11].reset()
    }

    render_social_rel(){
        this.children[1].children[12].remove_all_options()
        this.children[1].children[12].render_options(this.social_rel)
    }

    handel_city_select(){
        this.children[1].children[9]
        .addEventListener('change',async(e)=>{
            var city_code=e.currentTarget.value.value;
            var centers_array=await this.get_centers_py_city_code(city_code)
            this.render_centers_options(centers_array)
        })
    }

    get_all_valuse(){
        for(var row of this.children[1].children){
            if(!row['value']||row['value']['value']==null||row['value']['value']==''){return false}
            this.form_object[row['key']]= row['value']   
        }
        
        this.form_object['date_of_take']= new Date().toLocaleString('en-GB');
        return this.form_object;
    }

    reset_all_lines(){
        for(var row of this.children[1].children){
            row.reset() 
        }        
    }

    async set_edite_form_object(form_object){
        this.reset_all_lines()
        for(var row of this.input_lines){
            row.fill(form_object[row['key']]) 
        } 
        this.children[1].children[8].select_by_option_value(form_object['نوع الاعاقه'])
        this.children[1].children[9].select_by_option_value(form_object['المحافظة'])
       
        var centers_array=await this.get_centers_py_city_code(form_object['المحافظة']['value'])
        this.render_centers_options(centers_array) 
        this.children[1].children[10].select_by_option_value(form_object['المركز'])
        
        var vill_array=await this.get_vill_by_center_code(form_object['المركز']['value'])
        this.render_vills_options(vill_array)
        this.children[1].children[11].select_by_option_value(form_object['القرية/الحي'])
        this.children[1].children[12].select_by_option_value(form_object['الحالة الإجتماعية'])
        this.form_object=form_object;
    }

    save(){
         this.children[2].children[1]
         .addEventListener('click',()=>{
             var form_object=this.get_all_valuse()
             console.log(form_object)
             if(form_object){
                if(!this.edite_mode){
                    this.reset_all_lines()
                    this.father.create_waiting_cile(form_object)
                    this.children[0].children[1].click()
                }else{
                    this.reset_all_lines()
                    this.father.edite_waiting_cill(form_object)
                    this.children[0].children[1].click()
                    this.edite_mode=false;
                }
             }
         })    
    }



    handel_center_select(){
        this.children[1].children[10]
        .addEventListener('input',async(e)=>{
            var center_code=e.currentTarget.value.value;
            var vill_array=await this.get_vill_by_center_code(center_code)
            if(vill_array){
                this.render_vills_options(vill_array)
            }else{
                this.render_vills_options([{value:'not_exest',textContent:'لايوجد'}])
            }
            
        })
    }

    async get_centers_py_city_code(city_code){
       var response= await fetch("centers_map.json")
       var json = await response.json()
       return json[city_code]
    }

    async get_vill_by_center_code(center_code){
       var response= await fetch("vill_map.json")
       var json = await response.json()
       return json[center_code]
    }

    run_on_Attribute_change(){
        if(this.firest_connect_state){
            return;
        } 
    }

    connectedCallback(){ 
        this.firest_connect()           
    }   

    attributeChangedCallback(name, oldValue, newValue){
        this[name]=newValue;
        this.run_on_Attribute_change()
    } 
    static get observedAttributes() { return []; }           
}

customElements.define('data-taker', Data_Taker);