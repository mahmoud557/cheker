const switsh_bt_templet=document.createElement('template')

class Switsh_Bt extends HTMLElement {
    constructor() {
        super();
        this.firest_connect_state=false;
        this.state=this.getAttribute('state')||'off';
        this.translate_to=this.getAttribute('translate_to')||'36';
        this.disable=this.getAttribute('disable')||false;
    }

    firest_connect(){
        if(!this.firest_connect_state){
             switsh_bt_templet.innerHTML=`
                 <div></div>
            `
            this.content=switsh_bt_templet.content.cloneNode(true);
            this.appendChild(this.content)
            this.firest_connect_state=true;
            this.style=`
                width: 60px;
                height: 24px;
                display: flex;
                border-radius: 50px;
                background: #303030;
                flex-direction: row;
                align-items: center;
                padding:2px;
                cursor:pointer;
                justify-content: flex-start;
                padding:6px;
               
            `
            this.children[0].style=`
                width:18px;
                height:18px;
                border-radius: 50px;
                background: #242424;
                position: relative;
                transition: all .5s;
            `
            this.togel_on_off()
            this.set_class_on_if_state_on()
            this.firest_connect_state=true;
        } 
        
    }
    togel_on_off(){
       this.addEventListener('click',()=>{
         if(!this.disable){
             if(this.state=='on'){
                 this.children[0].style.transform='translate(0px, 0px)'
                 this.classList.remove('on')
                 this.state='off'
             }else{
                 this.children[0].style.transform=`translate(${this.translate_to}px, 0px)`
                 this.classList.add('on')
                 this.state='on'
             }          
         }
       })
    }
    set_class_on_if_state_on(){
        if(this.state=='on'){
           this.children[0].style.transform=`translate(${this.translate_to}px, 0px)`
           this.classList.add('on')
           this.state='on'            
        }
    }
    connectedCallback(){
       this.firest_connect() 
    }

    /*attributeChangedCallback(name, oldValue, newValue){
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
    */
  
}
customElements.define('switsh-bt', Switsh_Bt);