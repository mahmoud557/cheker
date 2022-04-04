class Waiting_List extends HTMLElement {
    constructor() {
        super();
        this.waiting_ciles=[];
        this.firest_connect_state=false;
    }

    firest_connect(){
        if(!this.firest_connect_state){
            this.render()
            this.create_data_taker()
            this.show_data_taker()
            this.get_and_render_all_waiting_ciles()
            this.firest_connect_state=true
        }
    }

    render(){
        this.innerHTML=`
            <top-div hazi_key='1'></top-div>
            <bottom-div class='center' hazi_key='1'>
                <left-div></left-div>
                <right-div class='center'>New</right-div>
            </bottom-div>
            <pop-up display_state='none' hazi='1' id='waiting_list_pop_up'></pop-up>
         
        `
    }

    create_data_taker(){
        this.data_taker=document.createElement('data-taker');
        this.data_taker.father=this;
    }

    async get_and_render_all_waiting_ciles(){
       var waiting_ciles=await MML.main_holder.reserver_holder.send_get_all_waiting_ciles()
       console.log(waiting_ciles)
       this.render_all_waiting_cile(waiting_ciles)
    }

    render_all_waiting_cile(waiting_ciles){
       for(var form_object of waiting_ciles){
            var waiting_cile=document.createElement('waiting-cile');
            waiting_cile.name=form_object['الإسم الأول'].value+" "+form_object['الإسم الثاني'].value+" "+form_object['الإسم الثالث'].value;
            waiting_cile.city=form_object['المحافظة'].textContent
            waiting_cile.disise=form_object['نوع الاعاقه'].textContent
            waiting_cile.date_of_type=form_object['date_of_take'];
            waiting_cile.form_object=form_object;
            waiting_cile.father=this;
            this.children[0].appendChild(waiting_cile)           
       } 
    }

    async create_waiting_cile(form_object){
        var add_doc=await MML.main_holder.reserver_holder.send_add_waiting_cile(form_object)
        var waiting_cile=document.createElement('waiting-cile');
        waiting_cile.name=add_doc['الإسم الأول'].value+" "+add_doc['الإسم الثاني'].value+" "+add_doc['الإسم الثالث'].value;
        waiting_cile.city=add_doc['المحافظة'].textContent
        waiting_cile.disise=add_doc['نوع الاعاقه'].textContent
        waiting_cile.date_of_type=add_doc['date_of_take']
        waiting_cile.form_object=add_doc;
        waiting_cile.father=this;
        this.children[0].appendChild(waiting_cile)
    }

    async edite_waiting_cill(form_object){
        var form_object=await MML.main_holder.reserver_holder.send_edite_waiting_cile(form_object)
        this.waiting_cill_on_edete.edit(form_object)
    }

    async remove_waiting_cile(form_object){
        await MML.main_holder.reserver_holder.send_remove_waiting_cile(form_object)
    }

    show_data_taker(){
        this.children[1].children[1]
        .addEventListener('click',()=>{
            this.data_taker.form_object={}
            this.children[2].show(this.data_taker)
            
        })
    }

    show_data_taker_for_edit(form_object){
        this.data_taker.edite_mode=true;
        this.children[2].show(this.data_taker)
        this.data_taker.set_edite_form_object(form_object)
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

customElements.define('waiting-list', Waiting_List);