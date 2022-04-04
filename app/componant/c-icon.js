const icon_template=document.createElement('template')
class Icon extends HTMLElement {
    constructor() {
        super();
        this.des=this.getAttribute('des')
        this.firest_connect_state=false;

    }
    description(){
        if(this.des){
            return `<div>${this.des}</div>`
        }else{
            return '';
        }     
    }

    firest_connect(){
        if(!this.firest_connect_state){
            icon_template.innerHTML=`
                <img src=${this.getAttribute('src')}>
                ${this.description()}
            `
            this.style=`
                display:flex;
                position:relative;
                flex-direction:row;
                justify-content:center;
                align-items:center;
                cursor:pointer;
                overflow: visible;
            `
            this.content=icon_template.content
            this.content.children[0].style.maxWidth=`${this.getAttribute('size')}%`;
            //this.content.children[0].style.maxHeight=`${this.getAttribute('size')}%`;
            if(this.des){
                this.content.children[1].style=`
                    width:${this.getAttribute('des_width')};
                    display:none;
                    opacity:0;
                    position:absolute;
                    /*top:100%;*/
                    left:100%;
                    background:${this.getAttribute('des_bk')};
                    padding:6px;
                    border-radius:3px;
                    margin-top:1px;
                    font-size:10px;
                    color:${this.getAttribute('des_color')};
                    font-family:system-ui;
                    text-align:center;
                    z-index:10;
                    justify-content:center;
                    min-width:90px;
                    filter:none;
                `    
                this.descreption_functions()
            }
            this.appendChild(this.content) 
            this.firest_connect_state=true;
        }  
    }

    descreption_functions(){
        this.addEventListener('mouseenter',()=>{
            this.mouse_in=true;
            console.log(window.getComputedStyle(this)['background-color'])
            setTimeout(()=>{
                if(this.mouse_in==true){
                  this.style['z-index']='10'
                  this.children[1].style.display='flex'
                  this.children[1].style.opacity='1';
                }
            },500)
        })
        this.addEventListener('mouseleave',()=>{
            this.mouse_in=false;
            this.style['z-index']='1'
            this.children[1].style.display='none';
            this.children[1].style.opacity='0';
        })        
    }

    connectedCallback(){
        this.firest_connect()
    }
}
customElements.define('c-icon', Icon);