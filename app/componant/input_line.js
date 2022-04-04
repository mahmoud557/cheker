class Input_line extends HTMLElement {
    constructor() {
        super();
        this.key=this.getAttribute('key');
        this.value=null;
        this.firest_connect_state=false;     
    }

    firest_connect(){
        if(!this.firest_connect_state){
            this.render()
            this.handel_input()
            this.firest_connect_state=true
        }
    }

    render(){
        this.innerHTML=`
            <left-div>${this.key} : </left-div>
            <right-div>
                <input  dir='rtl' ></input>
            </right-div>
        `
    }
    
    handel_input(){
        this.children[1].children[0]
        .addEventListener('input',(e)=>{
            this.value={value:e.currentTarget.value,textContent:e.currentTarget.value};
            //this.dispatchEvent(this.input_event)
        })
    }

    fill(fill_object){
        this.children[1].children[0].value=fill_object.value;
        this.value={value:fill_object.value,textContent:fill_object.value};
    } 

    reset(){
        this.value={};
        this.children[1].children[0].value=null;
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
customElements.define('input-line', Input_line);