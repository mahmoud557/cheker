class Allert_with_feedback extends HTMLElement {
    constructor() {
        super();
        this.firest_connect_state=false;
        this.allert_title;
        this.title_background;
        this.allert_body;
        this.feedbacks;
        this.feedback_event=new Event('feedback');
        this.distroy_time;
    }

    firest_connect(){
        if(!this.firest_connect_state){
            this.render()  
            this.set_title_background()
            this.create_feedback_buttons()
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
                <top-div>${this.allert_body}</top-div>
                <bottom-div class='center'></bottom-div>
            </bottom-div>
        `       
    }


    clouse(){
        this.children[0].children[1].addEventListener('click',()=>{
            this.remove()
            this.father.allert_in_show=false;            
        })
    }

    create_feedback_buttons(){
        for (var feedback of this.feedbacks){
            var feedback_div=document.createElement('div');
            feedback_div.setAttribute('feedback',feedback);
            feedback_div.textContent=feedback;
            this.handel_feedback_click(feedback_div)
            this.children[1].children[1].appendChild(feedback_div)
        }
    }

    handel_feedback_click(feedback_div){
        feedback_div.addEventListener('click',(e)=>{
            var feedback=e.currentTarget.getAttribute('feedback');
            this.feedback_event.feedback=feedback;
            this.dispatchEvent(this.feedback_event)
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
customElements.define('allert-with-feedback', Allert_with_feedback);