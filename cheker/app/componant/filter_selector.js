class Filter_Selector extends HTMLElement {
    constructor() {
        super();
        this.filter_title=this.getAttribute('filter_title')
        this.type=this.getAttribute('type')
         
    }

    firest_connect(){
        if(!this.firest_connect_state){
            this.render()
            this.listen_to_click()
            this.firest_connect_state=true
        }
    }

    render(){
        this.innerHTML=`
            <left-div>${this.filter_title}</left-div>
        `
    }

    listen_to_click(){
        this.addEventListener('click',(e)=>{
            e.filter_type=this.type;
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

customElements.define('filter-selector', Filter_Selector);