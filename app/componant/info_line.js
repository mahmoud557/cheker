class Info_line extends HTMLElement {
    constructor() {
        super();
        this.key=this.getAttribute('key');
        this.value=this.getAttribute('value');
        this.firest_connect_state=false;     
    }

    firest_connect(){
        if(!this.firest_connect_state){
            this.render()
            this.firest_connect_state=true
        }
    }

    render(){
        this.innerHTML=`
            <left-div>${this.key} : </left-div>
            <right-div title='${this.value}'>${this.value}</right-div>
        `
    }
    set_value(){
        this.children[1].textContent=this.value;
        this.children[1].title=this.value;
    }

    connectedCallback(){ 
        this.firest_connect()
    }

    run_on_Attribute_change(attribute_name){
        if(this.firest_connect_state){
            if(attribute_name=='value'){
                this.set_value()
            }
        } 
    }

    attributeChangedCallback(name, oldValue, newValue){
        this[name]=newValue;
        this.run_on_Attribute_change(name)
    } 
    static get observedAttributes() { return ['value']; }
           
}
customElements.define('info-line', Info_line);