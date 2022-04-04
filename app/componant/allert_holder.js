
class Allert_Holder extends HTMLElement {
    constructor() {
        super();
        this.firest_connect_state=false;
        /*this.link=this.getAttribute('link')
        this.name=this.getAttribute('name')
        this.time=this.getAttribute('time')
        this.dates_state=this.getAttribute('dates_state')*/
    }

    firest_connect(){
        if(!this.firest_connect_state){
            this.set_all_atributes_from_allert_object()
            this.render()
            this.handel_click()
            this.firest_connect_state=true
        }
    }



    generate_dates_state_text_from_dates_state(){
        var dates_state_text=this.dates_state?'يوجد':'لايوجد';
        return dates_state_text;
    }

    set_backgroung_to_white_if_dates_state(){
        if(this.dates_state){
            this.style.background='rgb(255,255,255)';
        }
    }

    set_all_atributes_from_allert_object(){
        for(var key in this.allert_object){
            this.setAttribute(`${key}`,`${this.allert_object[key]['value']}`)
            this[`${key}`]=`${this.allert_object[key]['value']}`
        }
    }

    create_body_string(){
        var body_string='';
        for(var key in this.allert_object){
            if(!this.allert_object[key]['body_element']){continue;}
            var element_string=`<info-line key=${this.allert_object[key]['key']} value=${this.allert_object[key]['value']} dir='auto' class='no_sellect'></info-line>`
            body_string+=element_string;
        }
        return body_string     
    }

    render(){
        this.innerHTML=`
            ${this.create_body_string()}
        `       
    }

    handel_click(){
        this.addEventListener('click',()=>{
            window.open(this.link, '_blank').focus();
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
customElements.define('allert-holder', Allert_Holder);