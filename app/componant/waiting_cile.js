class Waiting_Cile extends HTMLElement {
    constructor() {
        super();
        this.name;
        this.city;
        this.disise;
        this.date_of_type;
        this.form_object;
        this.firest_connect_state=false;
    }

    firest_connect(){
        if(!this.firest_connect_state){
            this.render()
            this.handel_remove()
            this.handel_edite()
            this.firest_connect_state=true
        }
    }

    render(){
        this.innerHTML=`
            <top-div>
                <info-line key='الاسم' value="${this.name}" dir='auto'></info-line>
                <info-line key='المحافظه' value="${this.city}" dir='auto'></info-line>
                <info-line key='الاعاقه' value="${this.disise}" dir='auto'></info-line>
                <info-line key='تاريخ الملء' value="${this.date_of_type}" dir='auto'></info-line>
            </top-div>
            <bottom-div>
                <left-div>Remove</left-div>
                <right-div>Edite</right-div>
            </bottom-div>
        `       
    }

    edit(form_object){
        this.form_object=form_object;
        this.name=form_object['الإسم الأول'].value+" "+form_object['الإسم الثاني'].value+" "+form_object['الإسم الثالث'].value;
        this.city=form_object['المحافظة'].textContent
        this.disise=form_object['نوع الاعاقه'].textContent
        this.date_of_type=new Date().toLocaleString();  
        this.children[0].children[0].setAttribute('value',this.name) 
        this.children[0].children[1].setAttribute('value',this.city) 
        this.children[0].children[2].setAttribute('value',this.disise) 
        this.children[0].children[3].setAttribute('value',this.date_of_type) 
    }

    handel_remove(){
        this.children[1].children[0]
        .addEventListener('click',async()=>{
            await this.father.remove_waiting_cile(this.form_object)
            this.remove()
        })
    }

    handel_edite(){
        this.children[1].children[1]
        .addEventListener('click',()=>{
            this.father.waiting_cill_on_edete=this;
            this.father.show_data_taker_for_edit(this.form_object)
        })
    }

    connectedCallback(){ 
        this.firest_connect()           
    }

    run_on_Attribute_change(){
        if(this.firest_connect_state){
            return;
        } 
    }

    attributeChangedCallback(name, oldValue, newValue){
        this[name]=newValue;
        this.run_on_Attribute_change()
    } 
    static get observedAttributes() { return []; }    
           
}
customElements.define('waiting-cile', Waiting_Cile);