class Filters_holder extends HTMLElement {
    
    constructor() {
        super();
        this.visible_state=false;
        this.firest_connect_state=false;
        this.work_state=false;
        this.filter_selector_visbility_state=false;
        this.attribute;
        this.last_filter_id=0;
        this.line;
        this.work_state_change=new Event('work_state_change'); 
    }

    firest_connect(){
        if(!this.firest_connect_state){
            this.create_filters_line()
            this.render()
            this.change_work_state()
            this.listen_to_click()
            this.listen_to_select_filter()
            this.show_hid_filter_selector()
            this.firest_connect_state=true
        }
    }

    render(){
        this.innerHTML=`
            <top-div >
                <left-div>
                    <div class='hid'>ON</div>
                    <switsh-bt translate_to='44' ></switsh-bt>
                </left-div>
            </top-div>
            <bottom-div>
                <top-div></top-div>
                <bottom-div >
                    <c-icon src='icons/add.svg'  size='40' title='Add Filter'></c-icon>
                </bottom-div>
                <div class='filter_selector_holder'>
                    <top-div  class='center'>
                        <left-div>Select Filter</left-div>
                        <c-icon src='icons/rong.svg'  size='40' ></c-icon>
                    </top-div>
                    <bottom-div>
                        <filter-selector type='Exist' filter_title='Exist'></filter-selector>
                        <filter-selector type='Not Exist' filter_title='Not Exist'></filter-selector>
                        <filter-selector type='(=)' filter_title='Equal (=)'></filter-selector>
                        <filter-selector type='(!=)' filter_title='Not Equal (!=)'></filter-selector>
                        <filter-selector type='Start With' filter_title='Start With (..lter)'></filter-selector>
                        <filter-selector type='End With' filter_title='End With (filt..)'></filter-selector>
                        <filter-selector type='Includes' filter_title='Includes (fi..er)'></filter-selector>
                        <filter-selector type='(>)' filter_title='Greater Than (>)'></filter-selector>
                        <filter-selector type='(>=)' filter_title='Greater Than Or Equal (>=)'></filter-selector>
                        <filter-selector type='(<)' filter_title='Smaler Than (<)'></filter-selector>
                        <filter-selector type='(<=)' filter_title='Smaler Than Or Equal (<=)'></filter-selector>
                    </bottom-div>
                </div>               
            </bottom-div>
        `
    }

    create_filters_line(){
        class Line{
            constructor() {
              this.filters={};
            }

            add_filter(id,type,attribute,value){
                this.filters[id]={type,attribute,value}
            }

            remove_filter(id){
                delete this.filters[id]
            }

            edite_filter(id,value){
                this.filters[id]['value']=value;
            }

            get_filters(){
                return this.filters
            }
            get_filters_as_array(){
                var result=[];
                for(var filter_id in this.filters){
                    result.push(this.filters[filter_id])
                }
                return result;
            }
            isEmpty(){
                 return Object.keys(this.filters).length === 0;
            }
        }

        this.line=new Line
    }

    change_work_state(){
        this.children[0].children[0].children[1]
        .addEventListener('click',()=>{
            this.work_state=!this.work_state;
            this.work_state_change.work_state=this.work_state
            this.dispatchEvent(this.work_state_change)
        })
    }

    show_hid_filter_selector(){
        this.children[1].children[1].children[0]
        .addEventListener('click',()=>{
            this.children[1].children[2].style.height='100%';
        })

        this.children[1].children[2].children[0].children[1]
        .addEventListener('click',()=>{
            this.children[1].children[2].style.height='0%';
        })       
    }

    listen_to_click(){
        this.addEventListener('click',(e)=>{
            e.filter=true;
        })
    }

    listen_to_select_filter(){
        this.children[1].children[2].children[1]
        .addEventListener('click',(e)=>{
            if(e.filter_type){
                this.add_filter(e.filter_type)
                this.hid_filter_selector_holder()
            }
        })
    }
    
    hid_filter_selector_holder(){
        this.children[1].children[2].style.height='0%';
    }
    get_new_filter_id(){
        this.last_filter_id++;
        return this.last_filter_id;
    }

    add_filter(filter_type){
        var filter=document.createElement('filter-holder')
        filter.filter_type=filter_type;
        filter.id=this.get_new_filter_id()
        filter.attribute=this.attribute;
        this.line.add_filter(filter.id,filter.filter_type,filter.attribute,null)
        this.children[1].children[0].appendChild(filter)
        this.handel_filter_events(filter)
    }


    handel_filter_events(filter){
        filter.addEventListener('Delete',(e)=>{
            console.log('filter Deleted')
            this.line.remove_filter(e.filter_id)
        })
        filter.addEventListener('value_change',(e)=>{
            this.line.edite_filter(e.filter_id,e.value)
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

customElements.define('filters-holder', Filters_holder);