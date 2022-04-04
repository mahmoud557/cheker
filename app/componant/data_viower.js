
class Data_viower extends HTMLElement {
    constructor() {
        super();
        this.firest_connect_state=false
        this.clouse_event= new Event('clouse');
        this.files_extintions_visbailty_state=false;
        this.data_title=' ';
        this.data=[];
        this.result_files_count=0;
    }

    firest_connect(){
        if(!this.firest_connect_state){
            this.render()
            this.create_file_saver_input()
            this.handel_click_on_file_extention()
            this.zoom_in_out()
            this.show_hidden_file_extention()
            this.clouse()
            this.firest_connect_state=true
        }
    }

    render(){
        this.innerHTML=`
            <left-div>
                <table></table>
            </left-div>
            <right-div>
                <top-div class='center'>
                    <c-icon src='icons/rong.svg' size=40 ></c-icon>
                </top-div>
                <bottom-div class='center-v'>
                    <c-icon src='icons/save.svg' size=42 ></c-icon>
                    <div class='files_typs_aria center-v' >
                        <c-icon src='icons/exel.svg' size=50 save_type='.xlsx'></c-icon>
                        <c-icon src='icons/csv.svg' size=50 save_type='.csv'></c-icon>
                    </div>
                    <div class='zoom_input center-v'>
                        <top-div class='center'>
                            <input type="range" min="0.5" max="1" value="0.65" step="0.01"/>
                        </top-div>
                        <bottom-div>
                            <c-icon src='icons/zoom.svg' size=36 ></c-icon>
                        </bottom-div>
                    </div>
                </bottom-div>           
            </right-div>
        `       
    }

    push(chunk){
        this.data.push(...chunk)
        if(this.data.length>1000){
            this.result_files_count+=1;
            AM.manager_resulte.postMessage(['add_chunk',[this.data]])
            this.data=[];
        }
    }

    zoom_in_out(){
        this.children[1].children[1]
        .children[2].children[0].children[0]
        .addEventListener('input',(e)=>{
            this.children[0].children[0].style.zoom=e.currentTarget.value;
        })
    }

    clouse(){
        this.children[1].children[0].children[0]
        .addEventListener('click',()=>{
            this.previousElementSibling.click()
        })
    }

    show_hidden_file_extention(){
        this.children[1].children[1].children[0]
        .addEventListener('click',()=>{
            if(!this.files_extintions_visbailty_state){
                this.children[1].children[1].children[1].style.height='110px';
                this.files_extintions_visbailty_state=true
            }else{
                this.children[1].children[1].children[1].style.height='0px';
                this.files_extintions_visbailty_state=false               
            }
        })
    }

    handel_click_on_file_extention(){
        this.children[1].children[1].children[1].children[0]
        .addEventListener('click',(e)=>{
            //.xlsx
            if(MML.run_state){MML.show_cant_save_allert();return}
            this.file_saver.setAttribute('accept',".xlsx")
            this.file_saver.click()
        })
        this.children[1].children[1].children[1].children[1]
        .addEventListener('click',()=>{
            //.csv
            if(MML.run_state){MML.show_cant_save_allert();return}
            this.file_saver.setAttribute('accept',".csv")
            this.file_saver.click()
        })        
    }

    create_file_saver_input(){
        this.file_saver=document.createElement('input');
        this.file_saver.setAttribute('type','file')
        this.file_saver.setAttribute('nwdirectory','true')
        this.file_saver.addEventListener('input',(e)=>{
            var path=e.currentTarget.value
            var type=e.currentTarget.accept
            console.log(type)
            this.save(path,type)
            e.currentTarget.value=null;
        })
    }

    save(path,type){
        switch(type){
            case '.xlsx':
                MML.show_saveing_allert(path,this.result_files_count,0)
                AM.manager_resulte.postMessage(['save_result_as_excel',[path]])
                break;
            case '.csv':
                console.log(path)
                break;
            case '.json':
                var data=this.data;
                var fileName=this.data_title;
                var exportType=exportFromJSON.types.json;
                exportFromJSON({ data, fileName, exportType })
                break;  
            case '.xml':
                var data=this.data;
                var fileName=this.data_title;
                var exportType=exportFromJSON.types.xml;
                exportFromJSON({ data, fileName, exportType })
                break;                                                  
        }

    }

    clear_table_content(){
        while(this.children[0].children[0].children.length>1){
            this.children[0].children[0].children[this.children[0].children[0].children.length-1].remove()
        }
    }

    clear_table_content_with_header(){
        while(this.children[0].children[0].children[0]){
            this.children[0].children[0].children[0].remove()
        }
    }

    extract_table_keys_from_data(data){
        var keys= new Set()
        for(var i=0;i<data.length;i++){
            var keys_chuk=Object.keys(data[i])
            for(var key of keys_chuk){
                keys.add(key)
            }
        }
        return [...keys];
    }

    render_table_header(data){
        this.table_keys=this.extract_table_keys_from_data(data)
        var tr=document.createElement('tr');
        for(var key of this.table_keys){
            var th=document.createElement('th');
            var th_filter=document.createElement('filters-holder');
            th.textContent=key.toUpperCase();
            th.setAttribute('filter_part','true')
            th.appendChild(th_filter);
            th.filter=th_filter;
            th_filter.father=th;
            th_filter.attribute=key;
            this.togele_th_filter_visible_state(th)
            this.listen_to_filter_work_state_change(th_filter)
            tr.appendChild(th)
        }
        this.children[0].children[0].appendChild(tr)
        this.table_header=tr;
        console.log(this.table_header)
    }

    render_table_data_chunk(chunk){
        for(var i=0;i<chunk.length;i++){
            var tr=document.createElement('tr');
            for(var key of this.table_keys){
                var data=chunk[i][key]||"_";
                var td=document.createElement('td');
                td.setAttribute('dir',"auto")
                td.textContent=data;
                if(this.td_spacification){this.td_spacification(td)}
                tr.appendChild(td)
            }
            this.children[0].children[0].appendChild(tr)
        }
    } 

    delay(time){
        return new Promise((res,rej)=>{
            setTimeout(()=>{res()},time)
        })  
    }

    togele_th_filter_visible_state(th){
        th.addEventListener('click',async(e)=>{
            e.filter=true;
            if(e.target!=e.currentTarget){return}
            if(e.currentTarget.filter.visible_state==false){
                this.hidden_filter_on_show()
                e.currentTarget.filter.scrollIntoView({behavior: "smooth", block: "end", inline: "end"});
                e.currentTarget.filter.style.height='700px';
                e.currentTarget.filter.style.visibility='visible';
                e.currentTarget.filter.visible_state=true;
                e.currentTarget.style['box-shadow']='0 0 4px 0 black'
                this.fleter_on_show=e.currentTarget;
            }else{
                e.currentTarget.filter.style.height='0px';
                e.currentTarget.filter.style.visibility='hidden';
                e.currentTarget.filter.style.disply='none';
                e.currentTarget.filter.visible_state=false  
                e.currentTarget.style['box-shadow']='none'   
                this.fleter_on_show=e.currentTarget;              
            }
        })
    }

    hidden_filter_on_show(){
        if(this.fleter_on_show){
            this.fleter_on_show.filter.style.height='0px';
            this.fleter_on_show.filter.style.visibility='hidden';
            this.fleter_on_show.filter.visible_state=false  
            this.fleter_on_show.style['box-shadow']='none'
        }
    }

    listen_to_filter_work_state_change(filter){
       filter.addEventListener('work_state_change',(e)=>{
           switch(e.work_state){
               case true:
                   console.log(e.currentTarget.father)
                   e.currentTarget.father.style.border='2px solid  rgb(0 150 0)'
                   e.currentTarget.father.style.outline='1px solid rgb(0 150 0)'
                   break
               case false:
                   console.log(e.currentTarget.father)
                   e.currentTarget.father.style.border='none'
                   e.currentTarget.father.style['border-bottom']='1px solid rgba(216, 216, 216, 1)'
                   e.currentTarget.father.style.outline='none'
                   break                   
           }
       })
    }

    get_filters(){
        var filters=[];
       for(var th of this.table_header.children){
           if(th.filter.work_state==true&&th.filter.line.isEmpty()==false){
               filters.push(...th.filter.line.get_filters_as_array())
           }
           
        }
        return filters
    }



    connectedCallback(){ 
        this.firest_connect()           
    }

    run_on_Attribute_change(attribute_name){
        if(this.firest_connect_state){
            if(attribute_name=='data'){

            }
            return;
        } 
    }

    attributeChangedCallback(name, oldValue, newValue){
        this[name]=newValue;
        this.run_on_Attribute_change(name)
    } 
    static get observedAttributes() { return ['']; }
           
}
customElements.define('data-viower', Data_viower);