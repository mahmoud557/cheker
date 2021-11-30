
class Allert_Holder extends HTMLElement {
    constructor() {
        super();
        this.firest_connect_state=false;
        this.city=this.getAttribute('city')
        this.disise=this.getAttribute('disise')
        this.time=this.getAttribute('time')
    }

    firest_connect(){
        if(!this.firest_connect_state){
            this.render()
            this.firest_connect_state=true
        }
    }

    render(){
        this.innerHTML=`
            <info-line key='المدينه' value="${this.city}" dir='auto'></info-line>
            <info-line key='الاعاقه' value="${this.disise}" dir='auto'></info-line>
            <info-line key='الوقت' value="${this.time}" dir='auto'></info-line>
        `       
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