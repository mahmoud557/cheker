class Filter_Holder extends HTMLElement {
    constructor() {
        super();
        this.id;
        this.filter_value;
        this.filter_type;
        this.attribute;
        this.filter_relation;
        this.filters_dont_need_value=['Exist','Not Exist'];
        this.Delete_event=new Event('Delete');
        this.value_change_event=new Event('value_change');
    }

    firest_connect(){
        if(!this.firest_connect_state){
            this.render()
            this.delete()
            this.listen_to_value_input_change()
            this.firest_connect_state=true
        }
    }

    render(){
        this.innerHTML=`
            <div class='operator center'>${this.filter_type}</div>
            <div class='value center'>
                ${this.set_value_input()}
            </div>
            <div class='delete'>
                <c-icon src='icons/delete.svg' size=40 ></c-icon>
            </div>
        `
    }

    set_value_input(){
        if(!this.filters_dont_need_value.includes(this.filter_type)){
            return `<input type='text' dir='auto'/>`
        }else{
            return ''
        }
    }

    delete(){
        this.children[2].children[0]
        .addEventListener('click',()=>{
            this.Delete_event.filter_id=this.id;
            this.dispatchEvent(this.Delete_event)
            this.remove()
        })
    }

    listen_to_value_input_change(){
        if(!this.children[1].children[0]){return}
        this.children[1].children[0]
        .addEventListener('keyup',(e)=>{
            //(if(e.currentTarget.value==''||e.currentTarget.value==' '){return}
            this.value_change_event.filter_id=this.id;
            this.value_change_event.value=e.currentTarget.value;
            this.dispatchEvent(this.value_change_event)
        })

        this.children[1].children[0]
        .addEventListener('value',(e)=>{
            //(if(e.currentTarget.value==''||e.currentTarget.value==' '){return}
            this.value_change_event.filter_id=this.id;
            this.value_change_event.value=e.currentTarget.value;
            this.dispatchEvent(this.value_change_event)
        })  

        this.children[1].children[0]
        .addEventListener('change',(e)=>{
            //(if(e.currentTarget.value==''||e.currentTarget.value==' '){return}
            this.value_change_event.filter_id=this.id;
            this.value_change_event.value=e.currentTarget.value;
            this.dispatchEvent(this.value_change_event)
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

customElements.define('filter-holder', Filter_Holder);