class Select_line extends HTMLElement {
    constructor() {
        super();
        this.key=this.getAttribute('key');
        this.value=this.getAttribute('value');
        this.input_event=new Event('input')
        this.firest_connect_state=false;     
    }

    firest_connect(){
        if(!this.firest_connect_state){
            this.render()
            this.handel_select()
            this.remove_all_options()
            this.render_options([
                    {value:'-----',textContent:'..........'}
                ])
            this.firest_connect_state=true
        }
    }

    render(){
        this.innerHTML=`
            <left-div>${this.key} : </left-div>
            <right-div>
                <select name='${this.key}'>

                </select>                
            </right-div>
        `
    }

    handel_select(){
        this.children[1].children[0]
        .addEventListener('input',(e)=>{
            this.value={value:e.currentTarget.value,textContent:e.currentTarget.selectedOptions[0].textContent};
            //this.dispatchEvent(this.input_event)
        })       
    }

    render_options(options_array){
        for(var option_itim of options_array){
            var option=document.createElement('option')
            option.setAttribute('value',`${option_itim['value']}`)
            option.setAttribute('textContent',`${option_itim['textContent']}`)
            option.value=option_itim['value']
            option.textContent=option_itim['textContent']
            this.children[1].children[0].appendChild(option)
        }
    }

    remove_all_options(){
        while(this.children[1].children[0].children[0]){
            this.children[1].children[0].children[0].remove()
        }
    }

    set_value(){
        this.children[1].textContent=this.value;
        this.children[1].title=this.value;
    }

    fill(fill_object){
        //this.children[1].children[0].value=fill_object.value;
        this.value={value:fill_object.value,textContent:fill_object.textContent};
    } 

    reset(){
        this.value={value:null,textContent:null};
        this.children[1].children[0].value=null;
    }

    select_by_option_value(fill_object){
        this.children[1].children[0].value=fill_object.value;
        this.value={value:fill_object.value,textContent:fill_object.textContent};
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
customElements.define('select-line', Select_line);