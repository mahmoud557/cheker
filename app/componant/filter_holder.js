class Reserver extends HTMLElement {
    constructor() {
        super();
    }

    firest_connect(){
        if(!this.firest_connect_state){
            this.render()
            this.firest_connect_state=true
        }
    }

    render(){
        this.innerHTML=``
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

customElements.define('reserver-holder', Reserver);