const pop_up_templet=document.createElement('template')

class Pop_Up extends HTMLElement {
    constructor() {
        super();
        this.display_state=this.getAttribute('display_state');
        this.disable=this.getAttribute('disable')||'false';
        this.firest_connect_state=false;
        this.get_hazi_elements_state=false;
    }
    append_child(){
        if(this.children[0]){
           this.element_in_show=this.children[0];
           this.element_in_show.style['z-index']='2'
           this.content.children[0].appendChild(this.element_in_show) 
        }
    }
    hidden_on_click(){
        this.content.children[0].children[0]
        .addEventListener('click',()=>{
            if(this.disable=='false'){
                this.style.display='none'
                this.display_state='none'
                //this.children[0].replaceChild(document.createElement('div'), this.children[0].children[1]);
                //console.log(this.children[0].children[1])
                this.remove_hazi()               
            }

        })
    }

    show(element){
        if(this.element_in_show){
            this.element_in_show=element;
            element.style['z-index']=3;
            this.children[0].replaceChild(element, this.children[0].children[1]);
            this.style.display='flex';
            this.display_state='flex';
            this.set_hazi()
        }else{
            this.element_in_show=element;
            element.style['z-index']=3;
            this.children[0].appendChild(element);
            this.style.display='flex';
            this.display_state='flex';   
            this.set_hazi()           
        }
    }

    get_hazi_elements(){
        if(!this.get_hazi_elements_state){
           this.hazi_target_id=this.getAttribute('hazi')
           this.hazi_target_elements=document
           .querySelectorAll(`[hazi_key="${this.hazi_target_id}"]`)
           this.set_hazi()
        }
    }

    set_hazi(){
        if(this.hazi_target_elements&&this.display_state=='flex'){
            for(var i=0;i<this.hazi_target_elements.length;i++){
                this.hazi_target_elements[i].style.filter='blur(1px)';
            } 
        }
    }
    remove_hazi(){
        if(this.hazi_target_elements){
            for(var i=0;i<this.hazi_target_elements.length;i++){
                this.hazi_target_elements[i].style.filter='blur(0px)';
            } 
        }
    }

    firest_connect(){
        pop_up_templet.innerHTML=`
            <div>
                <div></div>
            </div>
        `
        this.content=pop_up_templet.content.cloneNode(true);
        this.style=`
            width:100%;
            height:100%;
            position: absolute;
            display: ${this.display_state};
            overflow: hidden;        
        `
        this.content.children[0].style=`
            width:100%;
            height:100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            position: relative;      
        `
        this.content.children[0].children[0].style=`
            width: 100%;
            height: 100%;
            background: rgb(50 50 50 / 60%);
            position: absolute;
            z-index: 1    
        `
        this.append_child()
        this.get_hazi_elements()
        this.hidden_on_click()
        this.appendChild(this.content) 
        this.firest_connect_state=true;
    }

    connectedCallback(){   
        this.firest_connect()        
    }

    attributeChangedCallback(name, oldValue, newValue){
        this[name]=newValue
        this.style=`
            width:100%;
            height:100%;
            position: absolute;
            display: ${this.display_state};
            overflow: hidden;        
        `
    }

    static get observedAttributes() { return ['display_state']; }    
  
}
customElements.define('pop-up', Pop_Up);