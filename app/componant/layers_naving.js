//layers-holder
class LayersHolder extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
        this.layer_in_show=this.getAttribute('in_show');
        this.hid_all=()=>{
            for(var i=0;i<this.children.length;i++){
                this.children[i].style.display='none'
            }
        };
        this.show_by_defult=()=>{
            for(var i=0;i<this.children.length;i++){
                var child_layer_id=this.children[i].getAttribute('layer_id');
                if(child_layer_id==this.layer_in_show){
                    this.children[i].style.display=this.children[i].getAttribute('disply');
                }
            }                    
        };
        this.active=(layer_id)=>{
            this.hid_all()
            for(var i=0;i<this.children.length;i++){
                var child_layer_id=this.children[i].getAttribute('layer_id');
                if(child_layer_id==layer_id){
                    this.children[i].style.display=this.children[i].getAttribute('disply');
                }
            }                   
        }
        this.hid_all()
        this.show_by_defult()
    }
}
customElements.define('layers-holder', LayersHolder);

//layers-holder-head
class LayersHolderHead extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback(){
        for(var i=0;i<this.children.length;i++){
            this.children[i]
            .addEventListener('click',(e)=>{
                if(!this.target_holder){
                    this.target_holder=document
                    .getElementById(this.getAttribute('target_id'));
                    this.target_holder.active(e.currentTarget.getAttribute('layer_target'))
                }
                this.target_holder.active(e.currentTarget.getAttribute('layer_target'))
            })
        }                
    }
}
customElements.define('layers-holder-head', LayersHolderHead);