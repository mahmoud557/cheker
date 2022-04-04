class Reserver extends HTMLElement {

    constructor() {
        super();
        this.reserver_data_ready=new Event('reserver_data_ready')
        this.sucssess_connect_event=new Event('sucssess_connect_event')
        this.server_ack_event=new Event('server_ack_event')
        this.ack_id=0;
        this.waiting_res={};
        this.firest_connect_state=false;
    }

    firest_connect(){
        if(!this.firest_connect_state){
            /*this.render()
            this.handel_reserver_data_ready()
            this.get_reserver_data()
            this.handel_server_ack()
            this.togel_active_nav_button()*/
            this.firest_connect_state=true
        }
    }

    render(){
        this.innerHTML=`
            <top-div>
                <layers-holder-head class='center' target_id='main_layer_holder'>
                    <div layer_target='Waiting_list' class='center active'>Waiting List</div>
                    <div layer_target='History' class='center'>History</div>
                </layers-holder-head>
            </top-div>
            <bottom-div>
                <layers-holder id='main_layer_holder' in_show='Waiting_list' class='center'>
                    <waiting-list layer_id='Waiting_list' display='flex'></waiting-list>
                    <div class='center History' layer_id='History' display='flex'></div>
                </layers-holder>
            </bottom-div>
        `
    }


    togel_active_nav_button(){
        for(var children of this.children[0].children[0].children){
            children.addEventListener('click',(e)=>{
                if(!this.active_nav_button){
                    var defult_active=this.querySelector('.active')
                    defult_active.classList.remove('active')
                    this.active_nav_button=e.currentTarget;
                    this.active_nav_button.classList.add('active')
                }else{
                    if(this.active_nav_button!=e.currentTarget){
                        this.active_nav_button.classList.remove('active')      
                        this.active_nav_button=e.currentTarget;
                        this.active_nav_button.classList.add('active')                       
                    }
                }
            })
        }   
    }

    async get_reserver_data(){
        await MML.account()
        this.reserver_data= await fetch(
            '/reserver_data',
                {
                    method: 'POST',
                    headers:{
                      'Content-Type': 'application/json'
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify({account:{username:MML.user_name,password:MML.password}})                      
                },          
            )
        this.reserver_data=await this.reserver_data.json()
        this.reserver_url=`ws://${this.reserver_data.host}/data`
        this.dispatchEvent(this.reserver_data_ready)
    }

    send_add_waiting_cile(form_object){
       return new Promise(async(res,rej)=>{
           await this.sucssess_connect()
           this.ack_id++
           var message={function:'add_waiting_cile',parameters:[form_object,this.ack_id]}
           this.socket.send(JSON.stringify(message))
           this.waiting_res[`${this.ack_id}`]=res
       }) 
    }

    send_get_all_waiting_ciles(){
       return new Promise(async(res,rej)=>{
           await this.sucssess_connect()
           this.ack_id++
           var message={function:'get_all_waiting_cile',parameters:[this.ack_id]}
           this.socket.send(JSON.stringify(message))
           this.waiting_res[`${this.ack_id}`]=res
       })       
    }

    send_edite_waiting_cile(form_object){
       return new Promise(async(res,rej)=>{
           await this.sucssess_connect()
           this.ack_id++
           var message={function:'edite_waiting_cill',parameters:[form_object,this.ack_id]}
           this.socket.send(JSON.stringify(message))
           this.waiting_res[`${this.ack_id}`]=res
       })       
    }  

    send_remove_waiting_cile(form_object){
       return new Promise(async(res,rej)=>{
           await this.sucssess_connect()
           this.ack_id++
           var message={function:'remove_waiting_cill',parameters:[this.ack_id,form_object]}
           this.socket.send(JSON.stringify(message))
           this.waiting_res[`${this.ack_id}`]=res
       })       
    }    

    handel_reserver_data_ready(){
        this.addEventListener('reserver_data_ready',async()=>{
           await this.connect(MML.user_name,MML.password,null)
        })
    }

    fire_server_ack(ack_id,payload){
        this.server_ack_event.ack_id=ack_id;
        this.server_ack_event.payload=payload;
        this.dispatchEvent(this.server_ack_event)
    }

    handel_server_ack(){
        this.addEventListener('server_ack_event',(e)=>{
            this.waiting_res[`${e.ack_id}`](e.payload)
        })
    }

    handel_socket_masseges(ws){
        this.socket.addEventListener('message',(event)=>{
            var message=JSON.parse(event.data);
            switch(message.function){
                case 'ack':
                    this.fire_server_ack(message.ack_id,message.payload);
                    break
                case 'disise_update':
                    this.disise_update(message.update_by,message.disise);
                    break    
                case 'last_update':
                    this.set_last_update(message.date);
                    break
                case 'update_supscripe':
                    this.update_supscripe();
                    break                                                        
            }
        })
    }   

   connect(user_name,password,prev_res){
        if(!prev_res){
            return new Promise((res,rej)=>{
                this.socket=new WebSocket(this.reserver_url);
                this.socket.res=res;
                this.socket.addEventListener('open',async()=>{
                    this.socket.send(JSON.stringify({user_name:user_name,password:password}))
                    this.handel_socket_masseges()

                    this.connect_state=true;
                    this.dispatchEvent(this.sucssess_connect_event)
                    //setTimeout(()=>{this.socket.send(JSON.stringify({function:'get_all_valid_disise'}))},2000)
                    this.socket.addEventListener('close', async(event) => {
                        this.disconnect_ruteen()
                    },{once:true});        
          
                    this.socket.addEventListener('error', async(event) => {
                        this.disconnect_ruteen()
                    },{once:true});    
                    this.socket.res(true)
                })    
                this.socket.addEventListener('error',(err)=>{    
                    this.disconnect_ruteen()    
                },{once:true})    

                this.socket.addEventListener('close', async(event) => {
                    this.disconnect_ruteen()
                },{once:true});    

            })
        }else{
            this.socket=new WebSocket(this.reserver_url);
            this.socket.res=prev_res;
            this.socket.addEventListener('open',async()=>{
                this.socket.send(JSON.stringify({user_name:user_name,password:password,Notification_subscrip:this.Notification_subscrip}))
                this.handel_socket_masseges()
                this.connect_state=true;
                this.dispatchEvent(this.sucssess_connect_event)
                //setTimeout(()=>{this.socket.send(JSON.stringify({function:'get_all_valid_disise'}))},2000)        
                this.socket.addEventListener('close', async(event) => {
                    this.disconnect_ruteen()
                },{once:true});        
      
                this.socket.addEventListener('error', async(event) => {
                    this.disconnect_ruteen()
                },{once:true});    
                this.socket.res(true)
            })    

            this.socket.addEventListener('error',(err)=>{    
                this.disconnect_ruteen()    
            },{once:true})    

            this.socket.addEventListener('close', async(event) => {
                this.disconnect_ruteen()
            },{once:true});            
        }

    }

    sucssess_connect(){
        return new Promise((res,rej)=>{
            if(this.connect_state){
                res(true)
            }else{
                this.addEventListener('sucssess_connect_event',()=>{
                    res(true)
                },{once:true})
            }            
        })
    }

    disconnect_ruteen(){
        this.connect_state=false;
        if(!this.socket.discpnnect_catch){
            this.socket.discpnnect_catch=true;
            console.log('error to connect',event)
            setTimeout(()=>{
                this.connect(this.user_name,this.password,this.socket.res)
            },2)
        }        
    }

    run_on_Attribute_change(){
        if(this.firest_connect_state){
            return;
        } 
    }

    connectedCallback(){ 
        this.firest_connect()           
    }   

    attributeChangedCallback(name, oldValue, newValue){
        this[name]=newValue;
        this.run_on_Attribute_change()
    } 
    static get observedAttributes() { return []; }           
}

customElements.define('reserver-holder', Reserver);