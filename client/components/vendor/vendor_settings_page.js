import React, { Component } from 'react';
import MainHeader from '../subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from '../subcomponents/widgets/waiting';
import history from '../subcomponents/widgets/history';
import CustomInput from '../subcomponents/widgets/customInput';
import CustomToggle from '../subcomponents/widgets/customToggle';
import CustomSelect from '../subcomponents/widgets/customSelect';
import VendorHeader from '../subcomponents/vendor_header';
import VendorMenu from '../subcomponents/vendorMenu';
import { validator } from '../subcomponents/widgets/validation_helper';
import windowResize from 'window-resize';
import { Vendors } from '../../../imports/collections/vendors';
import { VendorsOnHold } from '../../../imports/collections/vendors_onhold';
import { mask } from '../subcomponents/widgets/mask';
import { map } from 'jquery';

class VendorSettingsPage extends Component {
    constructor(props){
        super(props);
        this.start = true;
        this.errors = [];
        this.errorColor = [];
        this.successText = '';
        this.canSave = ['white', '#FF7000', 'bold'];
        this.weekIndex = [ {start:16, end:36}, {start:16, end:36}, {start:16, end:36}, {start:16, end:36}, 
        {start:16, end:36}, {start:16, end:36}, {start:16, end:36} ];
        this.state = {
            display_name: '',
            cnpj: '',
            email: '',
            cellphone: '',
            phone: '',
            img_url: '',
            banner_url: '',
            loading: true,            
            forceIndex: 0, 
            timeIndex: 0,
            weekIndex: [ {end: 5} ],
            manualOpen: {
                status:0, 
                style: [['white', '#3BCD38'],                     
                    ['white', '#FF1414']]
            },
            openStatus: {
                color: ['#666', '#3BCD38', '#FF1414'],
                text: ['', 'ABERTO', 'FECHADO'], 
                instructions: 
                ['Sua loja irá abrir e fechar automatimente conforme configurado o horário de funcionamento abaixo.',
                `Somente mantenha selecionado "Abrir Loja" se estiver disponível para atender pedidos neste horário. 
                Sua loja irá fechar automaticamente quando der o horário de fechamento configurado abaixo.`,
                `Ao selecionar "Fechar Loja" o perfil de sua loja informará aos clientes que vocês não esta em funcionamento no momento. 
                Sua loja abrirá automaticamente no próximo dia disponível de acordo com as congigurações de funcionamento abaixo.`]
            },                           
            horarios: {
                domingo: {start:'08:00', end:'18:00', close:false},
                segunda: {start:'08:00', end:'18:00', close:false},
                terca:   {start:'08:00', end:'18:00', close:false},
                quarta:  {start:'08:00', end:'18:00', close:false},
                quinta:  {start:'08:00', end:'18:00', close:false},
                sexta:   {start:'08:00', end:'18:00', close:false},
                sabado:  {start:'08:00', end:'18:00', close:false}
            },
            _horarios: {},
            banner: {
                w: (Math.round(document.querySelector('.mainContainer').clientWidth - 420)),
                h: (Math.round((document.querySelector('.mainContainer').clientWidth - 420) / 2.72))
            }
        };
    }
    handleResize = () => {
        let banner = { w: window.innerWidth, h: window.innerHeight };
        console.log('a')
        this.setState({ banner: banner });
    }
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize)
        if (this.start){
            this.start = false;
            if (!Meteor.userId()){ 
                Meteor.logout();
                history.push('/entrar'); 
            }
            Meteor.subscribe('ProfileSettings', ()=>{
                let user = Meteor.users.findOne({'_id': Meteor.userId()});
                if (!user){ return; }
                if (!user.profile.roles.includes('vendor')){ history.push('/index') }
                Meteor.subscribe('VendorSettings', ()=>{                    
                    let week = [ 'domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado' ];                    
                    let horarios = {
                        domingo: {start:'08:00', end:'18:00', close:false},
                        segunda: {start:'08:00', end:'18:00', close:false},
                        terca:   {start:'08:00', end:'18:00', close:false},
                        quarta:  {start:'08:00', end:'18:00', close:false},
                        quinta:  {start:'08:00', end:'18:00', close:false},
                        sexta:   {start:'08:00', end:'18:00', close:false},
                        sabado:  {start:'08:00', end:'18:00', close:false}
                    };
                    let hours = [];
                    for(let i=0; i<=23; i++){
                        let _time = '';
                        if (i < 10){ 
                            _time = '0'+i+':00'; hours.push(_time); _time = '0'+i+':30'; hours.push(_time);
                        }else{ 
                            _time = i+':00'; hours.push(_time); _time = i+':30'; hours.push(_time);
                        }
                    }  
                    let vendor = Vendors.findOne({'vendor_id': Meteor.userId()});
                    if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id': Meteor.userId()})}
                    if (!vendor){ Meteor.logout(); history.push('/entrar'); return; }
                    if (vendor.terms){
                        if (vendor.terms.openTime){
                            let _horarios = {}
                            week.map((day, index)=>{
                                let time = {};
                                time = {};
                                time.start = vendor.terms.openTime[index].start;
                                time.end = vendor.terms.openTime[index].end;
                                time.close = !vendor.terms.openTime[index].open;
                                _horarios[day] = time;
                            });
                            horarios = _horarios; 
                            this.weekIndex = []
                            week.map((day, index)=>{
                                let timeIndex = {}
                                let start = horarios[day].start;
                                let end = horarios[day].end;
                                timeIndex = {};
                                if ( hours.indexOf(start) > -1 ){ timeIndex.start = hours.indexOf(start); }else{ timeIndex.start = 16; }
                                if ( hours.indexOf(end) > -1 ){ timeIndex.end = hours.indexOf(end); }else{ timeIndex.end = 36; }
                                this.weekIndex.push(timeIndex);            
                            });                           
                        }
                    }                                      
                    this.setState({ 
                        loading: false,
                        display_name: vendor.display_name ? vendor.display_name : '',
                        razaoSocial: (vendor.razaoSocial) ? vendor.razaoSocial : '',
                        img_url: vendor.img_url ? vendor.img_url : '',
                        banner_url: vendor.banner_url ? vendor.banner_url : '',
                        cnpj: vendor.cnpj ? vendor.cnpj : '',
                        email: vendor.email ? vendor.email : '',
                        cellphone: vendor.cellphone ? vendor.cellphone : '',
                        phone: vendor.phone ? vendor.phone : '',
                        forceIndex: (vendor.forceOpenIndex != undefined) ? vendor.forceOpenIndex : 0,
                        horarios: horarios,
                        _horarios: horarios,
                        weekIndex: [ {end: 10} ]
                    });
                    this.canSave = ['white', '#FF7000', 'bold'];
                    this.checkTime();
                });
            });
        }
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this.handleResize)
    }
    inputHandler(e){
        this.successText = '';
        this.canSave = ['white', '#FF7000', 'normal'];
        let name = e.target.name;
        let value = e.target.value;        
        if (name == 'cnpj'){ value = mask('cnpj', value);}
        if (name == 'cellphone'){ value = mask('phone', value);}
        if (name == 'phone'){ value = mask('phone', value);}
        if (name.includes('_start')){
            let horarios = this.state.horarios;
            name = name.replace('_start','')
            horarios[name].start = value;
            this.setState({horarios: horarios});
            return;
        }
        if (name.includes('_end')){
            let horarios = this.state.horarios;
            name = name.replace('_end','')
            horarios[name].end = value;
            this.setState({horarios: horarios});
            return;
        }
        if (name.includes('_close')){
            let horarios = this.state.horarios;
            name = name.replace('_close','')
            horarios[name].close = value;
            this.setState({horarios: horarios});
            return;
        }
        this.setState({ [name]: value });
    }
    openShop(index){
        if (index == 1 && this.state.forceIndex != 1){ this.setState({ forceIndex: 1 }); return; }
        if (index == 2 && this.state.forceIndex != 2){ this.setState({ forceIndex: 2 }); return; }
        this.setState({ forceIndex: 0 });
    }
    displayImage(e){
        this.successText = '';
        this.canSave = ['white', '#FF7000', 'normal'];
        this.setState({ loading: true });
        let id = e.target.id
        let display = this.state.display;
        if (!e.target.files[0]){ 
            this.setState({ loading: false, display: display });
            return; 
        }
        let src = URL.createObjectURL(e.target.files[0]);
        if (!src){ this.setState({ loading: false }) }
        switch(id){
            case 'profileImage': 
                this.setState({ loading: false, img_url: src });
            break;
            case 'bannerImage': 
                this.setState({ loading: false, banner_url: src });
            break;
        }       
    }
    uploadImage(inputId){   
        let meta = { folder: Meteor.userId() };        
        let img = ''
        switch(inputId){
            case 'profileImage':
                meta.type = 'usersProfileFolder';
                img = 'img_url'
                break;
            case 'bannerImage':
                meta.type = 'usersBannerFolder';
                img = 'banner_url';
                break;
        }
        let uploader = new Slingshot.Upload('vendor-images', meta); 
        uploader.send(document.getElementById(inputId).files[0], (error, imageUrl)=>{
            let url = ''
            if (error) {
              this.errors.push('Ocorreu um erro ao subir a imagem para o servido, verifique sua conexão com a internet ou se a imagem se enquadra nas especificações.')
                this.setState({ loading: false }); 
            }
            else { 
                url = imageUrl; 
                this.setState({ [img]: url, loading: false });  
                this.saveSettings()
            }         
        });
    }    
    checkTime(){// CRIAR STATE PARA VALORES ANTIGOS, ANTES DES SEREM ATUALIZADOS PARA PODER FAZER COMPARAÇÕES
        setTimeout(()=>{this.checkTime()}, 1200000);        
        let index = 0;
        let weekArray = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        let now = new Date();        
        let week = now.getDay();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let today = weekArray[week];
        let start = this.state._horarios[today].start.split(':');
        let end = this.state._horarios[today].end.split(':');
        start[0] = parseInt(start[0]);
        end[0] = parseInt(end[0]);
        start[1] = parseInt(start[1]);
        end[1] = parseInt(end[1]);
        if (hours > end[0]){ index = 2; }
        if (hours ==  end[0] && minutes > end[1]){ index = 2; }
        if (hours < start[0]){ index = 2; }
        if (hours == start[0] && minutes < start[1]){ index = 2; }
        index = 1;
        this.setState({ timeIndex: index });
        return index;  
    }
    saveSettings(){        
        if (this.state.loading){ return; }        
        this.errors = [];
        this.errorColor = [];
        this.setState({ loading: true }); 
        let openTime = [];     
        let week = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        let weekError = false;
        if (this.state.img_url.includes('blob:')){ this.uploadImage('profileImage'); return; }
        if (this.state.banner_url.includes('blob:')){ this.uploadImage('bannerImage'); return; }
        if (this.state.display_name.length < 3){ 
            this.errors.push('O nome da loja deve ter no mínimo 3 caracteres.');
            this.errorColor.push = day;
            this.errorColor['display_name'] = '#FF1414'; 
        }
        /*if (!validator('telefone', this.state.phone, 'telefone').result){ 
            this.errors.push(validator('telefone', this.state.phone, 'telefone').message);
            this.errorColor.push = 'phone';
            this.errorColor['phone'] = '#FF1414'; 
        } */
        if (!validator('telefone', this.state.cellphone, 'celular').result && this.state.cellphone.length > 0){ 
            this.errors.push(validator('telefone', this.state.cellphone, 'celular').message); 
            this.errorColor.push = 'cellphone';
            this.errorColor['cellphone'] = '#FF1414';            
        } 
        week.map((day, index)=>{
            let time = {};
            time.start = this.state.horarios[day].start;
            time.end = this.state.horarios[day].end;
            time.open = !this.state.horarios[day].close;            
            openTime.push(time);
            let start = time.start.split(':');
            let end = time.end.split(':')
            start[0] = parseInt(start[0]);
            start[1] = parseInt(start[1]);
            end[0] = parseInt(end[0]);
            end[1] = parseInt(end[1]);
            if ( start[0] > end[0] ){ 
                if ( !weekError ){ 
                    this.errors.push('O horário de abertura deve ser mais do cedo que seu horário de fechamento.'); 
                    weekError = true;
                }
                this.errorColor.push = day;
                this.errorColor[day] = '#FF1414';
            }                 
            if ( start[0] == end[0] ){                 
                if ( start[1] > end[1] ){ 
                    if ( !weekError ){ 
                        this.errors.push('O horário de abertura deve ser mais cedo do que seu horário de fechamento.'); 
                        weekError = true;
                    }
                    this.errorColor.push = day;
                    this.errorColor[day] = '#FF1414';
                }
                if ( start[1] == end[1]){ 
                    if ( !weekError ){ 
                        this.errors.push('Seu horário de abertura e fechamento não podem ser iguais.');
                        this.errors.push('Em caso da sua loja não funcionar neste dia, selecione a opção "Fechado".'); 
                        weekError = true;
                    }
                    this.errorColor.push = day;
                    this.errorColor[day] = '#FF1414';
                }
            }            
        });
        if (this.errors.length > 0){ this.setState({ loading: false }); return; }        
        let pack = {   
            img_url: this.state.img_url,
            banner_url: this.state.banner_url,
            display_name: this.state.display_name,
            phone: this.state.phone,
            cellphone: this.state.cellphone,     
            forceOpenIndex: this.state.forceIndex,    
            openTime: openTime     
        };
        Meteor.call('saveVendorSettings', pack, (error)=>{
            if (error){ 
                this.errors.push(error.result); 
            }else{
                this.successText = 'Seu perfil foi atualizado com sucesso!';
                this.canSave = ['#FF7000', 'white', 'bold'];
            }
            this.setState({ loading: false });
        });        
    }
    displayErrors(display){        
        if (this.errors.length > 0){return(<div style={{margin:'10px 0'}}>
            {this.errors.map((error, index)=>{
                let key = 'input_'+index
                if (display == 1 && error.includes('funcionamento')){
                    return(<div style={{color:'red', fontSize:'14px'}} key={key}>{error}</div>);
                }
                if (display == 0 && !error.includes('funcionamento')){ return(<div style={{color:'red', fontSize:'14px'}} key={key}>{error}</div>); }                
            })}
        </div>)
        }      
    }
    render(){        
        //if (!Meteor.userId()){ Meteor.logout(); history.push('/entrar'); }
        let totalWidth = Math.round(this.state.banner.w - 320);
        let totalHeight = Math.round(this.state.banner.w - 320) / 2.72 - 40;
        let timeIndex = this.state.timeIndex;  
        let logo = 110 / totalWidth * 110;
        let index = 2;
        let closeDay = [];
        let forceIndex = 0;
        let display = {profile:'none', banner:'none'};        
        let color = [ ['white', '#3BCD38'], ['white', '#FF1414'] ];
        let week = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];                
        let time = [];
        let logoText = 'Adicionar Logo';
        let bannerText = 'Adicionar Banner';
        let sizes = [
            {px:'50px', font:'10px'}, 
            {px:'75px', font:'14px'}, 
            {px:'90px', font:'18px'}];  
        if (this.state.img_url.includes('http') || this.state.img_url.includes('blob')){ logoText = 'Trocar Logo'; }
        if (this.state.banner_url.includes('http') || this.state.banner_url.includes('blob')){ bannerText = 'Trocar Logo'; }
        if (this.state.img_url != ''){ display.profile = 'block'; }
        if (this.state.banner_url != ''){ display.banner = 'block'; }
        switch(this.state.forceIndex){
            case 1: color = [ ['#3BCD38','white'], ['white', '#FF1414'] ]; timeIndex = 1; forceIndex = 1; break;
            case 2: color = [ ['white', '#3BCD38'], ['#FF1414', 'white'] ]; timeIndex = 2; forceIndex = 2; break;
        }              
        for (var day in this.state.horarios) {
            if (this.state.horarios[day]) {  if (this.state.horarios[day].close){ closeDay.push('block'); }else{ closeDay.push('none'); } }
        }        
        for(let i=0; i<=23; i++){
            let _time = '';
            if (i < 10){ 
                _time = '0'+i+':00'; time.push(_time); _time = '0'+i+':30'; time.push(_time);
            }else{ 
                _time = i+':00'; time.push(_time); _time = i+':30'; time.push(_time);
            }
        }     
        return(
            <div>
                <VendorHeader/>
                <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                    <VendorMenu />
                    <div style={{width:'100%', backgroundColor:'white'}}>
                        <div style={{width:'100%', height:'45px', borderBottom:'1px solid #FF7000', backgroundColor:'#F7F7F7', display:'flex', position:'sticky', top:'0', zIndex:'20'}}>
                            <div style={{paddingLeft:'20px', margin:'auto 0', fontSize:'16px', fontWeight:'bold', color:'555'}}>Editar Perfil</div>
                            <div style = {{margin:'auto', fontSize:'14px', paddingLeft:'20px', color:'#3BCD38', fontWeight:'bold'}}>{this.successText}</div>
                            <div style={{height:'21px', width:'75px', margin:'auto 20px', marginLeft:'auto', lineHeight:'21px',textAlign:'center', color:this.canSave[0], borderRadius:'15px', border:'3px solid #FF7000', backgroundColor:this.canSave[1], fontWeight:this.canSave[2], cursor:'pointer'}} onClick={()=>{this.saveSettings();}}>Salvar</div>                            
                        </div>
                        <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                            <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                                <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Perfil do lojista:</div>
                            </div>
                            <div style={{margin:'10px 10px', border:'1px solid #CCC', backgroundColor:'white', position:'relative'}}>
                                <div style={{border:'5px solid #F7F7F7'}}>
                                    <div style={{padding:'10px', display:'flex'}}>   
                                        <div style={{width:'100%', height:totalHeight, backgroundColor:'#F7F7F7', display:'flex'}}>
                                            <div style={{margin:'auto', fontWeight:'bold', color:'#CCC', fontSize:'20px'}}>1200 X 440</div>
                                            <label htmlFor='bannerImage' style={{width:'150px', height:'30px', lineHeight:'33px', borderRadius:'3px', backgroundColor:'#FF7000', textAlign:'center', position:'absolute', right:'100px', bottom:'-20px', fontSize:'14px', color:'white', display:'flex', cursor:'pointer', zIndex:'10'}}>
                                                <div style={{margin:'0 auto', display:'flex'}}>
                                                    <div style={{width:'16px', height:'16px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-upload.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                                    <div style={{width:'max-content'}}>
                                                        {bannerText}
                                                    </div>                                                    
                                                </div>
                                            </label>
                                            <input style={{display:'none'}} type='file' id='bannerImage' accept='image/*' onChange={(e)=>{ this.displayImage(e); }}/>
                                        </div>
                                    </div>
                                    <div style={{position:'absolute', bottom:'-40px', left:'30px', border:'1px solid #ccc', backgroundColor:'white', zIndex:'10'}}>
                                        <div style={{padding:'10px', border:'5px solid #F7F7F7'}}>
                                            <div style={{width:sizes[index].px, height:sizes[index].px, backgroundColor:'#F7F7F7', display:'flex'}}>
                                                <div style={{margin:'auto'}}>
                                                    <div style={{fontWeight:'bold', textAlign:'center', color:'#CCC', fontSize:sizes[index].font}}>100 X 100</div>                                                
                                                </div>                                            
                                            </div>
                                        </div>
                                        <div style={{width:(parseInt(sizes[index].px)+30+'px'), height:(parseInt(sizes[index].px)+30+'px'), display:display.profile, position:'absolute', top:'0px', left:'0px', backgroundImage:'url('+this.state.img_url+')', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundSize:'contain', backgroundColor:'white'}}></div>
                                        <label htmlFor='profileImage' style={{width:'100%', height:'25px', lineHeight:'25px', marginTop:'auto', fontSize:'12px', textAlign:'center', backgroundColor:'#00000050', color:'white', position:'absolute', bottom:'-1px', cursor:'pointer'}}>
                                            {logoText}
                                        </label>
                                        <input style={{display:'none'}} type='file' id='profileImage' accept='image/*' onChange={(e)=>{ this.displayImage(e); }}/>
                                    </div>
                                </div>
                                <div style={{width:'100%', height:Math.ceil(parseInt(totalHeight))+30+'px', display:display.banner, backgroundColor:'white', position:'absolute', top:'0px', left:'0px', backgroundImage:'url('+this.state.banner_url+')', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                            </div>
                            <div style={{marginTop:'70px', paddingBottom:'10px', fontSize:'15px', fontWeight:'bold', color:'#444', display:'flex'}}>
                                <div style={{width:'120px', padding:'0 10px'}}>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <div style={{display:'flex'}}><div style={{minWidth:'10px', color:'#FF1414', textAlign:'center'}}>*</div>Nome da Loja:</div>
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0', display:(this.state.razaoSocial)?'block':'none'}}>
                                        <div style={{display:'flex'}}><div style={{minWidth:'10px', color:'#FF1414', textAlign:'center'}}>*</div>Razão Social:</div>
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <div style={{display:'flex'}}><div style={{minWidth:'10px', color:'#FF1414', textAlign:'center'}}>*</div>CNPJ:</div>
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <div style={{display:'flex'}}><div style={{minWidth:'10px', color:'#FF1414', textAlign:'center'}}>*</div>E-mail:</div>
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <div style={{display:'flex'}}><div style={{minWidth:'10px', color:'#FF1414', textAlign:'center'}}>*</div>Celular:</div>
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <div style={{display:'flex'}}><div style={{minWidth:'10px', color:'#FF1414', textAlign:'center'}}></div>Telefone:</div>
                                    </div>
                                </div>
                                <div style={{width:'280px', padding:'0 10px'}}>
                                    <div style={{maxWidth:'260px', display:'flex', width:'100%', padding:'5px 0'}}>
                                        <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', width:'100%'}}>
                                            <input style={{width:'100%', maxWidth:'230px', height:'28px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='display_name' placeholder='Nome da loja' value={this.state.display_name} onChange={(e)=>{ this.inputHandler(e); }}/>                                            
                                        </div>
                                    </div>
                                    <div style={{maxWidth:'260px', display:(this.state.razaoSocial)?'flex':'none', width:'100%', padding:'5px 0'}}>
                                        <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', width:'100%'}}>
                                            <input style={{width:'100%', maxWidth:'230px', height:'28px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'#DFDFDF', color:'#555'}} name='razaoSocial' placeholder='Razão Social' value={this.state.razaoSocial} onChange={(e)=>{}}/>                                            
                                        </div>
                                    </div>
                                    <div style={{maxWidth:'260px', display:'flex', width:'100%', padding:'5px 0'}}>
                                        <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', width:'100%'}}>
                                            <input style={{width:'100%', maxWidth:'230px', height:'28px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'#DFDFDF', color:'#555'}} name='cnpj' placeholder='CNPJ' value={this.state.cnpj} onChange={(e)=>{}}/>                                            
                                        </div>
                                    </div>
                                    <div style={{maxWidth:'260px', display:'flex', width:'100%', padding:'5px 0'}}>
                                        <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', width:'100%'}}>
                                            <input style={{width:'100%', maxWidth:'230px', height:'28px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'#DFDFDF', color:'#555'}} name='email' placeholder='E-mail' value={this.state.email} onChange={(e)=>{}}/>                                            
                                        </div>
                                    </div>
                                    <div style={{maxWidth:'260px', display:'flex', width:'100%', padding:'5px 0'}}>
                                        <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', width:'100%'}}>
                                            <input style={{width:'100%', maxWidth:'230px', height:'28px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='cellphone' placeholder='Celular com DDD' value={this.state.cellphone} onChange={(e)=>{ this.inputHandler(e); }}/>                                            
                                        </div>
                                    </div>
                                    <div style={{maxWidth:'260px', display:'flex', width:'100%', padding:'5px 0'}}>
                                        <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', width:'100%'}}>
                                            <input style={{width:'100%', maxWidth:'230px', height:'28px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='phone' placeholder='Telefone com DDD' value={this.state.phone} onChange={(e)=>{ this.inputHandler(e); }}/>                                            
                                        </div>
                                    </div>                                    
                                </div>
                            </div>
                            {this.displayErrors(0)}
                            <div style={{padding:'0 10px', marginTop:'30px'}}>
                                <div style={{height:'30px', lineHeight:'30px', fontSize:'16px', fontWeight:'bold', color:'#444'}}>
                                    <div style={{display:'flex'}}><div style={{minWidth:'10px', color:'#FF1414', textAlign:'center'}}>*</div>
                                    <div>Horário de funcionamento:</div> <div style={{marginLeft:'10px', fontSize:'14px', color:this.state.openStatus.color[timeIndex]}}> 
                                        {this.state.openStatus.text[timeIndex]} 
                                    </div>                                    
                                </div>
                                </div>
                                {/*<div style={{display:'flex', marginTop:'15px', marginBottom:'15px'}}>
                                    <div style={{width:'95px',padding:'3px 2px', marginRight:'20px', border:'3px solid #3BCD38', borderRadius:'12px', textAlign:'center', fontSize:'12px', fontWeight:'bold', backgroundColor:color[0][0], color:color[0][1], cursor:'pointer'}} onClick={()=>{this.openShop(1)}}>
                                        ABRIR LOJA
                                    </div>
                                    <div style={{width:'95px',padding:'3px 2px', border:'3px solid #FF1414', borderRadius:'12px', textAlign:'center', fontSize:'12px', fontWeight:'bold', backgroundColor:color[1][0], color:color[1][1], cursor:'pointer'}} onClick={()=>{this.openShop(2)}}>
                                        FECHAR LOJA
                                    </div>
                                </div>*/}
                                <div style={{padding:'10px 5px', borderTop:'1px solid #CCC', borderBottom:'1px solid #CCC', color:'#999', fontSize:'13px'}}>
                                    <div style={{width:'100%'}}>
                                        {this.state.openStatus.instructions[forceIndex]}
                                    </div>
                                </div>
                                {this.displayErrors(1)}
                                <div style={{display:'flex', paddingBottom:'50px', marginTop:'25px', lineHeight:'30px', color:'#444'}}>
                                    <div style={{width:'100%', minWidth:'130px', maxWidth:'150px', fontSize:'15px', fontWeight:'bold'}}>
                                        <div style={{height:'30px', fontWeight:'bold'}}>Domingo:</div>
                                        <div style={{height:'30px', marginTop:'5px', fontWeight:'bold'}}>Segunda-feira:</div>
                                        <div style={{height:'30px', marginTop:'5px', fontWeight:'bold'}}>Terça-feira:</div>
                                        <div style={{height:'30px', marginTop:'5px', fontWeight:'bold'}}>Quarta-feira:</div>
                                        <div style={{height:'30px', marginTop:'5px', fontWeight:'bold'}}>Quinta-feira:</div>
                                        <div style={{height:'30px', marginTop:'5px', fontWeight:'bold'}}>Sexta-feira:</div>
                                        <div style={{height:'30px', marginTop:'5px', fontWeight:'bold'}}>Sábado:</div>                                        
                                    </div>
                                    <div>                                        
                                        <div style={{height:'30px', borderRadius:'3px', backgroundColor:'#00000030', position:'relative'}}>
                                            <CustomSelect maxHeight='149px' width='110px' height='30px' style={{maxWidth:'110px'}} start={16} select={time} value={this.state.horarios['domingo'].start} name='domingo_start' onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{width:'110px', height:'30px', position:'absolute', backgroundColor:'#00000030', top:'0', left:'0', display:closeDay[0]}}></div>
                                        </div>
                                        <div style={{height:'30px', marginTop:'5px', borderRadius:'3px', backgroundColor:'#00000030', position:'relative'}}>
                                            <CustomSelect maxHeight='149px' width='110px' height='30px' style={{maxWidth:'110px'}} start={16} select={time} value={this.state.horarios['segunda'].start} name='segunda_start' onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{width:'110px', height:'30px', position:'absolute', backgroundColor:'#00000030', top:'0', left:'0', display:closeDay[1]}}></div>
                                        </div>
                                        <div style={{height:'30px', marginTop:'5px', borderRadius:'3px', backgroundColor:'#00000030', position:'relative'}}>
                                            <CustomSelect maxHeight='149px' width='110px' height='30px' style={{maxWidth:'110px'}} start={16} select={time} value={this.state.horarios['terca'].start} name='terca_start' onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{width:'110px', height:'30px', position:'absolute', backgroundColor:'#00000030', top:'0', left:'0', display:closeDay[2]}}></div>
                                        </div>
                                        <div style={{height:'30px', marginTop:'5px', borderRadius:'3px', backgroundColor:'#00000030', position:'relative'}}>
                                            <CustomSelect maxHeight='149px' width='110px' height='30px' style={{maxWidth:'110px'}} start={16} select={time} value={this.state.horarios['quarta'].start} name='quarta_start' onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{width:'110px', height:'30px', position:'absolute', backgroundColor:'#00000030', top:'0', left:'0', display:closeDay[3]}}></div>
                                        </div>
                                        <div style={{height:'30px', marginTop:'5px', borderRadius:'3px', backgroundColor:'#00000030', position:'relative'}}>
                                            <CustomSelect maxHeight='149px' width='110px' height='30px' style={{maxWidth:'110px'}} start={16} select={time} value={this.state.horarios['quinta'].start} name='quinta_start' onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{width:'110px', height:'30px', position:'absolute', backgroundColor:'#00000030', top:'0', left:'0', display:closeDay[4]}}></div>
                                        </div>
                                        <div style={{height:'30px', marginTop:'5px', borderRadius:'3px', backgroundColor:'#00000030', position:'relative'}}>
                                            <CustomSelect maxHeight='149px' width='110px' height='30px' style={{maxWidth:'110px'}} start={16} select={time} value={this.state.horarios['sexta'].start} name='sexta_start' onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{width:'110px', height:'30px', position:'absolute', backgroundColor:'#00000030', top:'0', left:'0', display:closeDay[5]}}></div>
                                        </div>
                                        <div style={{height:'30px', marginTop:'5px', borderRadius:'3px', backgroundColor:'#00000030', position:'relative'}}>
                                            <CustomSelect maxHeight='149px' width='110px' height='30px' style={{maxWidth:'110px'}} start={16} select={time} value={this.state.horarios['sabado'].start} name='sabado_start' onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{width:'110px', height:'30px', position:'absolute', backgroundColor:'#00000030', top:'0', left:'0', display:closeDay[6]}}></div>
                                        </div>
                                    </div>
                                    <div style={{width:'100%', maxWidth:'39px', fontSize:'15px', fontWeight:'bold', textAlign:'center'}}>
                                        <div style={{height:'30px'}}>-</div>
                                        <div style={{height:'30px', marginTop:'5px'}}>-</div>
                                        <div style={{height:'30px', marginTop:'5px'}}>-</div>
                                        <div style={{height:'30px', marginTop:'5px'}}>-</div>
                                        <div style={{height:'30px', marginTop:'5px'}}>-</div>
                                        <div style={{height:'30px', marginTop:'5px'}}>-</div>
                                        <div style={{height:'30px', marginTop:'5px'}}>-</div>
                                    </div>
                                    <div>
                                        <div style={{height:'30px', borderRadius:'3px', backgroundColor:'#00000030', position:'relative'}}>
                                            <CustomSelect maxHeight='149px' width='115px' height='30px' style={{maxWidth:'115px'}} start={36} select={time} value={this.state.horarios['domingo'].end} name='domingo_end' onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{width:'115px', height:'30px', position:'absolute', backgroundColor:'#00000030', top:'0', left:'0', display:closeDay[0]}}></div>
                                        </div>
                                        <div style={{height:'30px', marginTop:'5px', borderRadius:'3px', backgroundColor:'#00000030', position:'relative'}}>
                                            <CustomSelect maxHeight='149px' width='115px' height='30px' style={{maxWidth:'115px'}} start={36} select={time} value={this.state.horarios['segunda'].end} name='segunda_end' onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{width:'115px', height:'30px', position:'absolute', backgroundColor:'#00000030', top:'0', left:'0', display:closeDay[1]}}></div>
                                        </div>
                                        <div style={{height:'30px', marginTop:'5px', borderRadius:'3px', backgroundColor:'#00000030', position:'relative'}}>
                                            <CustomSelect maxHeight='149px' width='115px' height='30px' style={{maxWidth:'115px'}} start={36} select={time} value={this.state.horarios['terca'].end} name='terca_end' onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{width:'115px', height:'30px', position:'absolute', backgroundColor:'#00000030', top:'0', left:'0', display:closeDay[2]}}></div>
                                        </div>
                                        <div style={{height:'30px', marginTop:'5px', borderRadius:'3px', backgroundColor:'#00000030', position:'relative'}}>
                                            <CustomSelect maxHeight='149px' width='115px' height='30px' style={{maxWidth:'115px'}} start={36} select={time} value={this.state.horarios['quarta'].end} name='quarta_end' onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{width:'115px', height:'30px', position:'absolute', backgroundColor:'#00000030', top:'0', left:'0', display:closeDay[3]}}></div>
                                        </div>
                                        <div style={{height:'30px', marginTop:'5px', borderRadius:'3px', backgroundColor:'#00000030', position:'relative'}}>
                                            <CustomSelect maxHeight='149px' width='115px' height='30px' style={{maxWidth:'115px'}} start={36} select={time} value={this.state.horarios['quinta'].end} name='quinta_end' onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{width:'115px', height:'30px', position:'absolute', backgroundColor:'#00000030', top:'0', left:'0', display:closeDay[4]}}></div>
                                        </div>
                                        <div style={{height:'30px', marginTop:'5px', borderRadius:'3px', backgroundColor:'#00000030', position:'relative'}}>
                                            <CustomSelect maxHeight='149px' width='115px' height='30px' style={{maxWidth:'115px'}} start={36} select={time} value={this.state.horarios['sexta'].end} name='sexta_end' onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{width:'115px', height:'30px', position:'absolute', backgroundColor:'#00000030', top:'0', left:'0', display:closeDay[5]}}></div>
                                        </div>
                                        <div style={{height:'30px', marginTop:'5px', borderRadius:'3px', backgroundColor:'#00000030', position:'relative'}}>
                                            <CustomSelect maxHeight='149px' width='115px' height='30px' style={{maxWidth:'115px'}} start={36} select={time} value={this.state.horarios['sabado'].end} name='sabado_end' onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{width:'115px', height:'30px', position:'absolute', backgroundColor:'#00000030', top:'0', left:'0', display:closeDay[6]}}></div>
                                        </div>
                                    </div>
                                    <div style={{height:'100%', width:'100%', maxWidth:'20px'}}></div>
                                    <div>
                                        <div style={{height:'30px', display:'flex'}}><CustomToggle name='domingo_close' value={this.state.horarios.domingo.close} size={0} onChange={(e)=>{this.inputHandler(e)}}/></div>
                                        <div style={{height:'30px', marginTop:'5px', display:'flex'}}><CustomToggle name='segunda_close' value={this.state.horarios.segunda.close} size={0} onChange={(e)=>{this.inputHandler(e)}}/></div>
                                        <div style={{height:'30px', marginTop:'5px', display:'flex'}}><CustomToggle name='terca_close' value={this.state.horarios.terca.close} size={0} onChange={(e)=>{this.inputHandler(e)}}/></div>
                                        <div style={{height:'30px', marginTop:'5px', display:'flex'}}><CustomToggle name='quarta_close' value={this.state.horarios.quarta.close} size={0} onChange={(e)=>{this.inputHandler(e)}}/></div>
                                        <div style={{height:'30px', marginTop:'5px', display:'flex'}}><CustomToggle name='quinta_close' value={this.state.horarios.quinta.close} size={0} onChange={(e)=>{this.inputHandler(e)}}/></div>
                                        <div style={{height:'30px', marginTop:'5px', display:'flex'}}><CustomToggle name='sexta_close' value={this.state.horarios.sexta.close} size={0} onChange={(e)=>{this.inputHandler(e)}}/></div>
                                        <div style={{height:'30px', marginTop:'5px', display:'flex'}}><CustomToggle name='sabado_close' value={this.state.horarios.sabado.close} size={0} onChange={(e)=>{this.inputHandler(e)}}/></div>
                                    </div>
                                    <div style={{width:'100%', maxWidth:'60px', marginLeft:'5px', lineHeight:'31px', fontSize:'14px', fontWeight:'bold'}}>
                                        <div style={{height:'30px'}}>Fechado</div>
                                        <div style={{height:'30px', marginTop:'5px'}}>Fechado</div>
                                        <div style={{height:'30px', marginTop:'5px'}}>Fechado</div>
                                        <div style={{height:'30px', marginTop:'5px'}}>Fechado</div>
                                        <div style={{height:'30px', marginTop:'5px'}}>Fechado</div>
                                        <div style={{height:'30px', marginTop:'5px'}}>Fechado</div>
                                        <div style={{height:'30px', marginTop:'5px'}}>Fechado</div>
                                    </div>
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
                <Waiting open={this.state.loading} size='50px'/>
            </div>
        );
    }
}
export default VendorSettingsPage;