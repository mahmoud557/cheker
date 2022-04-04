
class RIGHT extends HTMLElement {
    constructor() {
        super();
        this.firest_connect_state=false
    }

    firest_connect(){
        if(!this.firest_connect_state){
            this.firest_connect_state=true
        }
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
customElements.define('right-div', RIGHT);