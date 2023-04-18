import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { OrderInbox } from '../../../imports/collections/order_inbox';
import history from './widgets/history';
import { withTracker } from 'meteor/react-meteor-data';

class ChatBox extends Component{
    constructor(props){
        super(props);
        this.message = '';
        this.state = { mensage: '' };
    }
    componentDidMount(){
        let chat = OrderInbox.findOne({'order_id': this.props.order_id});
    }
    componentDidUpdate(){
        let chat = document.getElementById('chatBox');
        if (chat){ chat.scrollTop = chat.scrollHeight; }
    }
    inputHandler(e){
        let name = e.target.name;
        let value = e.target.value;
        this.setState({[name]: value});
    }
    pushMessage(){
        if (this.message.length == 0){ return; }
        let input = document.getElementById('chatInput');
        let pack = { message: this.message, order_id: this.props.order_id };
        Meteor.call('message.insert', pack);
        if (input){ input.value = ''; this.message = ''; }        
        this.setState({message: ''});
    }
    pushImage(e){
        if (!e.target.files[0]){ return; }
        let file = e.target.files[0];
        e.target.value = '';
        let meta = { 
            folder: Meteor.userId(), 
            type: 'chatImageFolder', 
            id: this.props.chat.order_id + '_' + this.props.chat.messages.length.toString() 
        };
        let uploader = new Slingshot.Upload( 'chat-images', meta );
        uploader.send(file, (error, imageUrl)=>{ 
            if (error){ 
                return;
            }else{ 
                let pack = { message: imageUrl, order_id: this.props.order_id };
                Meteor.call('image.insert', pack); 
                return; 
            } 
        });
    }
    sameDay(dateA, dateB){
        let _dateA = {
            day: dateA.getDate(),
            month: dateA.getMonth(),
            year: dateA.getFullYear()
        }
        let _dateB = {
            day: dateB.getDate(),
            month: dateB.getMonth(),
            year: dateB.getFullYear()
        }
        if (_dateA.day != _dateB.day){ return false; }
        if (_dateA.month != _dateB.month){ return false; }
        if (_dateA.year != _dateB.year){ return false; }
        return true;
    }
    formateDate(type, date){
        if (type == 'time'){
            let hour = (date.getHours() > 9) ? date.getHours().toString() : '0' + date.getHours().toString();
            let minutes = (date.getMinutes() > 9) ? date.getMinutes().toString() : '0' + date.getMinutes().toString();
            return hour + ':' + minutes;
        }
        if (type == 'date'){
            let months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ];
            let day = date.getDate();
            let month = date.getMonth();
            return day.toString() + ' de ' + months[month];
        }
    }
    displayChat(){
        let chat = this.props.chat;
        if (!chat){ return; }
        let messages = chat.messages
        if (!messages){ messages = []; }
        messages.sort((a, b)=>{
            if (a.date < b.date){ return 1; }
            if (a.date > b.date){ return -1; }
            return 0
        });
        let lastDate = new Date();
        let lastFrom = -1;
        let today = new Date();
        //if (messages.length > 0){ lastDate = messages[0].date; } 
        return(
        <div style={{minHeight:'150px', display:'flex', flexDirection:'column-reverse'}}>{
            messages.map((message, index)=>{
                let key = 'Chat_'+index;
                if (this.sameDay(today, message.date) && index == messages.length - 1){
                    let marginTop = '5px';
                    lastDate = message.date;
                    if (lastFrom != message.from){ marginTop = '10px'; lastFrom = message.from; }
                    if (index == 0){ marginTop = '5px'; }
                    if (message.type == 'image'){
                        return(
                        <div key={key}>
                            <div style={{height:'35px', lineHeight:'35px', fontSize:'13px', fontWeight:'bold', textAlign:'center', color:'#555'}}>Hoje</div>
                            <div style={{width:'fit-content', maxWidth:'70%', height:'fit-content', padding:'10px 10px 5px 10px', marginTop:'5px', marginLeft:(message.from == 0)?'auto':'0px', borderRadius:'4px', backgroundColor:(message.from == 0)?'#FF7000':'#E5E5E5'}}>
                                <img style={{width:'100%', maxWidth:'200px', cursor:'pointer'}} src={message.message} onClick={()=>{window.open(message.message, '_system')}}/>
                                <div style={{width:'fit-content', marginTop:'5px', marginRight:'10px', fontSize:'9px', color:(message.from == 0)?'white':'#333', marginLeft:(message.from == 0)?'auto':'0px'}}>{this.formateDate('time', message.date)}</div>
                            </div>
                        </div>);
                    }
                    return(
                    <div key={key}>
                        <div style={{height:'35px', lineHeight:'35px', fontSize:'13px', fontWeight:'bold', textAlign:'center', color:'#555'}}>Hoje</div>
                        <div style={{width:'fit-content', maxWidth:'70%', height:'fit-content', padding:'10px 10px 5px 10px', marginTop:'5px', marginLeft:(message.from == 0)?'auto':'0px', borderRadius:'4px', backgroundColor:(message.from == 0)?'#FF7000':'#E5E5E5'}}>
                            <div style={{fontSize:'12px', color:(message.from == 0)?'white':'#333', wordBreak:'break-word'}}>{message.message}</div>
                            <div style={{width:'fit-content', marginTop:'5px', marginRight:'10px', fontSize:'9px', color:(message.from == 0)?'white':'#333', marginLeft:(message.from == 0)?'auto':'0px'}}>{this.formateDate('time', message.date)}</div>
                        </div>
                    </div>);
                }
                if (!this.sameDay(lastDate, message.date)){
                    let marginTop = '5px'
                    lastDate = message.date;
                    if (lastFrom != message.from){ marginTop = '10px'; }
                    if (message.type == 'image'){
                        return(
                        <div key={key}>
                            <div style={{height:'35px', lineHeight:'35px', fontSize:'13px', fontWeight:'bold', textAlign:'center', color:'#555'}}>{this.formateDate('date', message.date)}</div>
                            <div style={{width:'fit-content', maxWidth:'70%', height:'fit-content', padding:'10px 10px 5px 10px', marginTop:marginTop, marginLeft:(message.from == 0)?'auto':'0px', borderRadius:'4px', backgroundColor:(message.from == 0)?'#FF7000':'#E5E5E5'}}>
                                <img style={{width:'100%', maxWidth:'200px', cursor:'pointer'}} src={message.message} onClick={()=>{window.open(message.message, '_system')}}/>
                                <div style={{width:'fit-content', marginTop:'5px', marginRight:'10px', fontSize:'9px', color:(message.from == 0)?'white':'#333', marginLeft:(message.from == 0)?'auto':'0px'}}>{this.formateDate('time', message.date)}</div>
                            </div>
                        </div>);
                    }
                    return(
                    <div key={key}>
                        <div style={{height:'35px', lineHeight:'35px', fontSize:'13px', fontWeight:'bold', textAlign:'center', color:'#555'}}>{this.formateDate('date', message.date)}</div>
                        <div style={{width:'fit-content', maxWidth:'70%', height:'fit-content', padding:'10px 10px 5px 10px', marginTop:marginTop, marginLeft:(message.from == 0)?'auto':'0px', borderRadius:'4px', backgroundColor:(message.from == 0)?'#FF7000':'#E5E5E5'}}>
                            <div style={{fontSize:'12px', color:(message.from == 0)?'white':'#333', wordBreak:'break-word'}}>{message.message}</div>
                            <div style={{width:'fit-content', marginTop:'5px', marginRight:'10px', fontSize:'9px', color:(message.from == 0)?'white':'#333', marginLeft:(message.from == 0)?'auto':'0px'}}>{this.formateDate('time', message.date)}</div>
                        </div>
                    </div>);
                }
                let marginTop = '5px'
                    lastDate = message.date;
                    if (lastFrom != message.from){ marginTop = '10px'; }
                    if (message.type == 'image'){
                        return(
                        <div key={key}>
                            <div style={{width:'fit-content', maxWidth:'70%', height:'fit-content', padding:'10px 10px 5px 10px', marginTop:marginTop, marginLeft:(message.from == 0)?'auto':'0px', borderRadius:'4px', backgroundColor:(message.from == 0)?'#FF7000':'#E5E5E5'}}>
                                <img style={{width:'100%', maxWidth:'200px', cursor:'pointer'}} src={message.message} onClick={()=>{window.open(message.message, '_system')}}/>
                                <div style={{width:'fit-content', marginTop:'5px', marginRight:'10px', fontSize:'9px', color:(message.from == 0)?'white':'#333', marginLeft:(message.from == 0)?'auto':'0px'}}>{this.formateDate('time', message.date)}</div>
                            </div>
                        </div>);
                    }
                    return(
                    <div key={key}>
                        <div style={{width:'fit-content', maxWidth:'70%', height:'fit-content', padding:'10px 10px 5px 10px', marginTop:marginTop, marginLeft:(message.from == 0)?'auto':'0px', borderRadius:'4px', backgroundColor:(message.from == 0)?'#FF7000':'#E5E5E5'}}>
                            <div style={{fontSize:'12px', color:(message.from == 0)?'white':'#333', wordBreak:'break-word'}}>{message.message}</div>
                            <div style={{width:'fit-content', marginTop:'5px', marginRight:'10px', fontSize:'9px', color:(message.from == 0)?'white':'#333', marginLeft:(message.from == 0)?'auto':'0px'}}>{this.formateDate('time', message.date)}</div>
                        </div>
                    </div>);
            })

        }</div>
        );
        console.log(messages);
    }
    render(){
        console.log(this.props.loading);
        console.log(this.props.chat);        
        let loading = this.props.loading;
        if (loading){ return(<div></div>); }
        this.displayChat();
        return(
        <div style={{maxWidth:'500px', width:'100%', height:'fit-content'}}>
            <div style={{maxWidth:'480px', height:'fit-content', border:'1px solid #FFDBBF', borderRadius:'5px', backgroundColor:'white'}}>
                
                <div style={{height:'39px', padding:'0 10px', borderBottom:'1px solid #FFDBBF', display:'flex'}}>
                    <div style={{maxWidth:'100%', maxHeight:'30px', margin:'auto', overflow:'hidden', fontSize:'13px', fontWeight:'bold', color:'#555', display:(this.props.title)?'block':'none'}}>{this.props.title}</div>
                    <div style={{minWidth:'70px', margin:'auto 0 auto auto', textAlign:'right', fontSize:'11px', color:'#3395f5', cursor:'pointer', display:(this.props.link)?'block':'none'}} onClick={()=>{history.push(this.props.link)}}>Visitar Perfil</div>
                </div>
                <div id='chatBox' className='customScroll' style={{maxHeight:'180px', padding:'0px 5px 5px 5px', overflowY:'scroll', borderBottom:'1px solid #FFDBBF', backgroundColor:'#F7F7F7'}}>
                    {/*<div style={{minHeight:'150px'}}>
                        <div style={{height:'35px', lineHeight:'35px', fontSize:'13px', fontWeight:'bold', textAlign:'center', color:'#555'}}>Sexta</div>
                        <div style={{width:'fit-content', maxWidth:'70%', height:'fit-content', padding:'10px 10px 5px 10px', marginTop:'5px', marginLeft:'auto', borderRadius:'4px', backgroundColor:'#FF7000'}}>
                            <div style={{fontSize:'12px', color:'white'}}> sjdahfbasdvbdsf sdf gh hbre hbr ewah\b rweh baer hbe r gn tsa hbreas bhra\ bh aerhb re  </div>
                            <div style={{width:'fit-content', marginTop:'5px', marginRight:'10px', fontSize:'9px', color:'white', marginLeft:'auto'}}>23:20</div>
                        </div>
                        <div style={{width:'fit-content', maxWidth:'70%', height:'fit-content', padding:'10px 10px 5px 10px', marginTop:'5px', marginLeft:'auto', borderRadius:'4px', backgroundColor:'#FF7000'}}>
                            <div style={{fontSize:'12px', color:'white'}}> sjdahfbasdvbdsf sdf gh hbre hbr ewah\b rweh baer hbe r gn tsa hbreas bhra\ bh aerhb re  </div>
                            <div style={{width:'fit-content', marginTop:'5px', marginRight:'10px', fontSize:'9px', color:'white', marginLeft:'auto'}}>23:20</div>
                        </div>
                        <div style={{width:'fit-content', maxWidth:'70%', height:'fit-content', padding:'10px 10px 5px 10px', marginTop:'10px', borderRadius:'4px', backgroundColor:'#E5E5E5'}}>
                            <div style={{fontSize:'12px', color:'#333'}}> sjdahfbasdvbdsf sdf gh hbre hbr ewah\b rweh baer hbe r gn tsa hbreas bhra\ bh aerhb re  </div>
                            <div style={{width:'fit-content', marginTop:'5px', marginRight:'10px', fontSize:'9px', color:'#333'}}>23:20</div>
                        </div>
                    </div>*/}
                    {this.displayChat()}
                </div>
                <div style={{height:'34px', padding:'0 10px', display:'flex'}}>
                    <div style={{minWidth:'30px', height:'20px', margin:'auto 0', display:'flex'}}>
                        <input style={{display:'none'}} type='file' id='image' accept='image/jpg, image/jpeg, image/png' onChange={(e)=>{ this.pushImage(e); }}/>
                        <label htmlFor='image' style={{width:'20px', height:'20px', margin:'auto auto auto 0', backgroundImage:'url(/imgs/icons/icon-img.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}}></label>
                    </div>
                    <div style={{ width:'100%', height:'20px', padding:'0 15px', margin:'auto auto auto 0', border:'1px solid #DDD', borderRadius:'15px', backgroundColor:'#EEE'}}>
                        <input id='chatInput' style={{width:'100%', height:'22px', lineHeight:'20px', border:'0px', padding:'0px', fontSize:'12px', color:'#333'}} name='message' onChange={(e)=>{ this.message = e.target.value; }} onKeyPress={(e)=>{ if (e.key == 'Enter'){ this.pushMessage(); } }}/>
                    </div>
                    <div style={{minWidth:'65px', height:'22px', margin:'auto 0'}}>
                        <div style={{width:'55px', height:'22px', marginLeft:'auto', lineHeight:'22px', borderRadius:'15px', backgroundColor:'#DDD', fontSize:'12px', textAlign:'center', color:'#222', cursor:'pointer'}} onClick={()=>{this.pushMessage()}}>Enviar</div>
                    </div>
                </div>
            </div>
            {/*<div style={{width:'20px', height:'20px', backgroundColor:'purple'}} onClick={()=>{this.pushMessage()}}>
            </div>*/}

        </div>)
    }
}
export default ChatBox = withTracker( (props) => {
    const handle = Meteor.subscribe('OrderInbox');
    console.log(props.order_id)
    return {
      loading: !handle.ready(),
      chat: OrderInbox.findOne({'order_id': props.order_id}),
    }
})(ChatBox);