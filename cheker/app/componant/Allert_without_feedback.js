class Allert_without_feedback extends HTMLElement {
    constructor() {
        super();
        this.firest_connect_state=false;
        this.allert_title;
        this.title_background;
        this.allert_body;
        this.distroy_time;
    }

    firest_connect(){
        if(!this.firest_connect_state){
            this.render()  
            this.destroy_after_destroy_time()
            this.set_title_background()
            this.clouse()
            this.firest_connect_state=true
        }
    }

    render(){
        this.innerHTML=`
            <top-div>
                <left-div>${this.allert_title}</left-div>
                <right-div>
                    <c-icon src='icons/rong.svg' size=28 ></c-icon>
                </right-div>
            </top-div>
            <bottom-div>
                ${this.allert_body}
            </bottom-div>
        `       
    }

    destroy_after_destroy_time(){
        if(!this.distroy_time){return}
        setTimeout(()=>{
            if(this.isConnected){
                this.remove()
                this.father.allert_in_show=false;                
            }
        },this.distroy_time)
    }

    clouse(){
        this.children[0].children[1].addEventListener('click',()=>{
            this.remove()
            this.father.allert_in_show=false;            
        })
    }

    set_title_background(){
        this.children[0].style.background=this.title_background;
    }

    connectedCallback(){ 
        this.firest_connect()           
    }

    attributeChangedCallback(name, oldValue, newValue){
        this[name]=newValue;
        this.run_on_Attribute_change(name)

    } 
    static get observedAttributes() { return []; } 
           
}
customElements.define('allert-without-feedback', Allert_without_feedback);