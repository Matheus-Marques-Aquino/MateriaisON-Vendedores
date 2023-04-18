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
import windowResize from 'window-resize';
import { mask } from '../subcomponents/widgets/mask';
import { Services } from '../../../imports/collections/services';
import { ServicesOnHold } from '../../../imports/collections/services_onhold';
import validateDate from 'validate-date';

class ServiceSettingsPage extends Component {
    constructor(props){
        super(props);
        this.errors = [[], [], [], []];
        this.imcompleteProfile = [];
        this.start = true;
        this.statusText = { text: '', color: ''}
        this.services = ['Aluguel de Maquinário', 'Arquiteto', 'Engenheiro', 'Limpeza pós Obra', 
            'Pedreiro', 'Poço Artesiano', 'Antenista', 'Automação Residencial', 'Instalação de Eletrônicos', 
            'Instalador TV Digital', 'Instalador de Ar Condicionado', 'Segurança Eletrônica', 'Encanador', 
            'Eletricista', 'Gás', 'Gesso e Drywall', 'Pavimentação', 'Pintor', 'Serralheria e Solda', 
            'Vidraceiro', 'Chaveiro', 'Dedetizador', 'Desentupidor', 'Desinfecção', 'Impermebilizador', 
            'Marceneiro', 'Marido de Aluguel', 'Mudanças e Carretos', 'Tapeceiro', 'Decorador', 'Design de Interiores', 
            'Instalador de Papel de Parede', 'Jardinagem', 'Paisagismo', 'Montador de Móveis', 'Limpeza de Piscina', 'Outro'];
        this.socialMedias = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn'];
        this.state = {
            hidden: false,
            nome: '',
            cpf: '',
            cpnj: '',
            email: '',
            celular: '',
            telefone: '',
            nascimento: '',            
            img_url: '',
            banner_url: '',
            img_file: undefined,
            banner_file: undefined,       
            apresentacao: '',      
            servicos: [{servico: 'Selecione uma categoria', outro: '', index: -1, button: {color: '#3395F5', index: 0, text: '+'}}],            
            socialMedia: [{name: 'Selecione uma rede social', value: ''}],
            gallery:[{src:'', name:'', file: undefined}, {src:'', name:'', file: undefined}, {src:'', name:'', file: undefined}, {src:'', name:'', file: undefined}, {src:'', name:'', file: undefined}],
            banner: {
                w: (Math.round(document.querySelector('.mainContainer').clientWidth - 420)),
                h: (Math.round((document.querySelector('.mainContainer').clientWidth - 420) / 2.72))
            },
            loading: true,
            complete: 0
        };
    }
    handleResize = () => {
        let banner = { w: window.innerWidth, h: window.innerHeight };
        this.setState({ banner: banner });
    }
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        if (this.start){
            this.start = false;
            let select = [];
            this.services.map((service)=>{
                select.push(service.toLowerCase());
            });
            if (!Meteor.userId()){ 
                Meteor.logout();
                history.push('/entrar'); 
            }
            Meteor.subscribe('ProfileSettings', ()=>{
                let user = Meteor.users.findOne({'_id': Meteor.userId()});
                if (!user){ history.push('/index'); return; }
                if (!user.profile.roles.includes('service')){ history.push('/index'); return; }
                Meteor.subscribe('ServiceSettings', ()=>{  
                    let service = Services.findOne({'service_id': Meteor.userId()});
                    if (!service){ service = ServicesOnHold.findOne({'service_id': Meteor.userId()})}
                    if (!service ){ history.push('/index'); return; }
                    let servicos = [];
                    if (!service.services){
                        servicos.push({servico: 'Selecione uma categoria', outro: '', index: -1, button: {color: '#3395F5', index: 0, text: '+'}});
                    }else{
                        service.services.map((service, index)=>{
                            let indexOf = select.indexOf(service.toLowerCase());
                            if (indexOf > -1 && service != 'outro'){
                                this.services.splice(indexOf, 1);
                                servicos.push({servico:service, outro:'', index:indexOf, button: {color: '#3395F5', index: 0, text: '+'}});                                
                            }else{
                                servicos.push({servico:'Outro:', outro:service, index:this.services.length - 1, button: {color: '#3395F5', index: 0, text: '+'}});
                            }
                        });
                    }
                    let socialMedia = [];
                    let mediaList = [];
                    let gallery = service.gallery;
                    let complete = true;
                    if (!service.social){ service.social = {}; }
                    if (service.social.facebook){ socialMedia.push({name: 'Facebook', value: service.social.facebook}); }else{ mediaList.push('Facebook'); }
                    if (service.social.instagram){ socialMedia.push({name: 'Instagram', value: service.social.instagram}); }else{ mediaList.push('Instagram'); }
                    if (service.social.twitter){ socialMedia.push({name: 'Twitter', value: service.social.twitter}); }else{ mediaList.push('Twitter'); }
                    if (service.social.linkedin){ socialMedia.push({name: 'LinkedIn', value: service.social.linkedin}); }else{ mediaList.push('LinkedIn'); }
                    if (socialMedia.length < 4){ socialMedia.push({name: 'Selecione uma rede social', value: ''}); }
                    if (!gallery){ gallery = []; }
                    if (service.perfilStatus == 'incomplete'){ this.statusText = { text: 'Seu perifl está incompleto, preecha todos os campos obrigatórios.', color: '#FF1414' }; complete = false }
                    for(let i = 0; i < 5; i++){ if (!gallery[i]){ gallery.push({src:'', name:'', file: undefined}); } }
                    this.socialMedias = mediaList;                    
                    this.setState({
                        complete: complete,
                        nome: (service.display_name) ? service.display_name : '',
                        cpf: (service.cpf) ? service.cpf : '',
                        cnpj: (service.cnpj) ? service.cnpj : '',
                        email: (service.email) ? service.email : '',
                        celular: (service.cellphone) ? service.cellphone : '',
                        telefone: (service.phone) ? service.phone : '',
                        nascimento: (service.birthday) ? service.birthday : '',            
                        img_url: (service.img_url) ? service.img_url : '',
                        banner_url: (service.banner_url) ? service.banner_url : '',      
                        apresentacao: (service.description) ? service.description : '',
                        hidden: (service.hidden == true) ? true : false, 
                        servicos: servicos,
                        socialMedia: socialMedia,
                        gallery: gallery,
                        loading: false
                    })
                });
            });
        }
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this.handleResize)
    }
    inputHandler(e){
        this.statusText.text = '';
        let name = e.target.name;
        let value = e.target.value;
        if (name == 'cpf'){ value = mask('cpf', value);}
        if (name == 'cnpj'){ value = mask('cnpj', value);}
        if (name == 'celular'){ value = mask('phone', value);}
        if (name == 'telefone'){ value = mask('phone', value);}
        if (name == 'nascimento'){ value = mask('birthday', value);}   
        if (name == 'apresentacao'){ 
            if (value != null){
                if (value.length > 500) { return; }   
                let lineBreak = [];
                if (value != null){
                    lineBreak = value.match(/\r\n?|\n/g); 
                } 
                if (lineBreak != null && lineBreak != undefined){ if (lineBreak.length > 25){ return; } }                                         
                console.log(lineBreak);
            }            
        }
        if (name.includes('socialMedia_')){ 
            if (value != null || value != undefined){
                let index = name.replace('socialMedia_', '');                
                let selectIndex = this.socialMedias.indexOf(value);                
                let socialMedia = this.state.socialMedia;
                let sortList = []
                index = parseInt(index);
                socialMedia[index].name = value;
                if ( selectIndex > -1 && value != 'Selecione uma rede social' ){ this.socialMedias.splice(selectIndex, 1); }else{ return; }
                if ( !socialMedia[index + 1] && socialMedia.length < 4){ socialMedia.push({name: 'Selecione uma rede social', value: ''}); }
                for (let i = 0; i < 4; i++){ 
                    if (!socialMedia[i]){ break; }
                    if (socialMedia[i].name == 'Facebook'){ sortList.push(socialMedia[i]); } 
                }     
                for (let i = 0; i < 4; i++){ 
                    if (!socialMedia[i]){ break; }
                    if (socialMedia[i].name == 'Instagram'){ sortList.push(socialMedia[i]); } 
                }     
                for (let i = 0; i < 4; i++){ 
                    if (!socialMedia[i]){ break; }
                    if (socialMedia[i].name == 'Twitter'){ sortList.push(socialMedia[i]); } 
                }     
                for (let i = 0; i < 4; i++){ 
                    if (!socialMedia[i]){ break; }
                    if (socialMedia[i].name == 'LinkedIn'){ sortList.push(socialMedia[i]); } 
                }     
                for (let i = 0; i < 4; i++){ 
                    if (!socialMedia[i]){ break; }
                    if (socialMedia[i].name == 'Selecione uma rede social'){ sortList.push(socialMedia[i]); } 
                }                
                this.setState({socialMedia: sortList});
                return;
            }else{
                return;
            }            
        } 
        if (name.includes('Link_')){
            if (value != null || value != undefined){
                let index = name.replace('Link_', '');
                let socialMedia = this.state.socialMedia;
                index = parseInt(index);
                if (!socialMedia[index]){ return; };
                if (!socialMedia[index].name){ return; }
                socialMedia[index].value = value;
                this.setState({socialMedia: socialMedia});
            }else{
                return;
            }
        }
        if (name.includes('servicos_')){
            let index = name.replace('servicos_', '');
            let servicos = this.state.servicos;
            let selectIndex = this.services.indexOf(value);
            index = parseInt(index);            
            if (value == undefined){ return; }
            if (value == 'Outro'){ value = 'Outro:'; }
            if (value != 'Outro:'){ this.services.splice(selectIndex, 1); }
            if (value == servicos[index].servico){ return; }
            if (servicos[index].servico != 'Outro' && servicos[index].servico != 'Outro:'){               
                if (selectIndex > -1 && servicos[index].servico != 'Selecione uma categoria'){ 
                    this.services.splice( servicos[index].index, 0, servicos[index].servico );
                }         
            }                            
            servicos[index].servico = value;
            servicos[index].index = selectIndex;
            
            this.setState({ servicos: servicos });
            return;
        }
        if (name.includes('outros_')){
            let index = name.replace('outros_', '');
            let servicos = this.state.servicos;
            name = 'outros_'+index;
            index = parseInt(index);
            servicos[index].outro = value;            
            this.setState({ servicos: servicos });
            return;
        }        
        this.setState({ [name]: value });
    }
    serviceList(){
        let servicos = this.state.servicos;
        for (let i = 0; i < servicos.length; i++){
            let service = servicos[i];            
            if (i + 1 == servicos.length ){
                service.button = {text:'+', color:'#3395F5', index: i};                  
                continue;
            }           
            service.button = {text:'-', color:'#FF1414', index: i};
        }
        return(
            servicos.map((service, index)=>{
                let key = 'Servico_'+index; 
                if (service.servico == 'Outro' || service.servico == 'Outro:' ){
                    return(<div style={{height:'32px', padding:'0', display:'flex', marginBottom:'10px'}} key={key}>
                        <div style={{width:'100%', display:'flex'}}>
                            <div style={{width:'fit-content', position:'absolute', display:'flex'}}>                                
                                <div style={{width:'fit-content', paddingRight:'10px', fontSize:'14px'}}>
                                    <CustomSelect boxStyle={{position:'absolute', top:'31px', zIndex:'45'}} dropStyle={{width:'300px'}} width='80px' height='32px' margin='0px' maxHeight='223px' select={this.services} name={'servicos_'+index} start={-1} startText='Outro:' value={this.state.servicos[index].servico} onChange={(e)=>{ this.inputHandler(e); }}/>
                                </div>
                                <CustomInput width='348px' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name={'outros_'+index} value={this.state.servicos[index].outro} placeholder='SERVIÇO PRESTADO' onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{height:'30px', marginLeft:'10px', cursor:'pointer', borderRadius:'3px', border:'1px solid #FF1414', backgroundColor:'#FF1414', display:(index >= 14 || this.state.servicos[index].servico == 'Selecione uma categoria' || this.state.servicos.length == 1) ? 'none' : 'flex'}} onClick={(e)=>{this.serviceController(index, '0')}}>
                                    <div style={{width:'30px', lineHeight:'30px', textAlign:'center', fontWeight:'bold', color:'white'}}>-</div>
                                </div>
                                <div style={{height:'30px', marginLeft:'10px', cursor:'pointer', borderRadius:'3px', border:'1px solid #3395F5', backgroundColor:'#3395F5', display:((index != this.state.servicos.length - 1 || this.state.servicos[index].servico == 'Selecione uma categoria') && (index < 14 || this.state.servicos[index].servico == 'Selecione uma categoria')) ? 'none' : 'flex'}} onClick={(e)=>{this.serviceController(index, '1')}}>
                                    <div style={{width:'30px', lineHeight:'30px', textAlign:'center', fontWeight:'bold', color:'white'}}>+</div>
                                </div>                               
                            </div>
                        </div>
                    </div>);
                }
                return(                    
                    <div style={{height:'32px', padding:'0', display:'flex', marginBottom:'10px'}} key={key}>
                        <div style={{width:'fit-content', display:'flex', position:'absolute'}}>
                            <CustomSelect boxStyle={{position:'absolute', top:'31px', zIndex:'45'}} dropStyle={{width:'442px'}} width='460px' height='32px' maxHeight='223px' margin='0px' select={this.services} name={'servicos_'+index} start={-1} startText={this.state.servicos[index].servico} value={this.state.servicos[index].servico} onChange={(e)=>{ this.inputHandler(e); }}/>
                            <div style={{height:'30px', marginLeft:'10px', cursor:'pointer', borderRadius:'3px', border:'1px solid #FF1414', backgroundColor:'#FF1414', display:(index >= 14 || this.state.servicos[index].servico == 'Selecione uma categoria' || this.state.servicos.length == 1) ? 'none' : 'flex'}} onClick={(e)=>{this.serviceController(index, '0')}}>
                                <div style={{width:'30px', lineHeight:'30px', textAlign:'center', fontWeight:'bold', color:'white'}}>-</div>
                            </div> 
                            <div style={{height:'30px', marginLeft:'10px', cursor:'pointer', borderRadius:'3px', border:'1px solid #3395F5', backgroundColor:'#3395F5', display:((index != this.state.servicos.length - 1 || this.state.servicos[index].servico == 'Selecione uma categoria') && (index < 14 || this.state.servicos[index].servico == 'Selecione uma categoria')) ? 'none' : 'flex'}} onClick={(e)=>{this.serviceController(index, '1')}}>
                                <div style={{width:'30px', lineHeight:'30px', textAlign:'center', fontWeight:'bold', color:'white'}}>+</div>
                            </div>                                                       
                        </div>
                    </div>
                ); 
            })
        );
    }
    serviceController(index, change){
        let servicos = this.state.servicos;
        this.statusText.text = '';
        if (change == '1'){
            if (servicos.length < 15){
                servicos.push({ servico: 'Selecione uma categoria', outro:''}); 
            }
            this.setState({servicos: servicos})
            return;
        }
        if (change == '0'){            
            this.services.splice(index, 1);            
            if (servicos[index].servico != 'Outro' && servicos[index].servico != 'Outro:'){                
                this.services.splice( this.state.servicos[index].index, 0, this.state.servicos[index].servico );
            }     
            servicos.splice(index, 1);                             
            this.setState({servicos: servicos})
            return;
        }           
    }
    socialMedia(){
        return(
        <div>{
            this.state.socialMedia.map((midia, index)=>{
                let key = 'Media_'+index;
                let socialMedia = midia.name;
                //let socialMedias = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn'];
                if (!socialMedia || socialMedia == 'Selecione uma rede social'){
                    return(
                    <div style={{width:'300px', height:'30x', padding:(index == 0) ? '0px 10px' : '15px 0px 5px 10px', fontSize:'15px', color:'#444'}} key={key}>
                        <div style={{position:'relative'}}>
                            <CustomSelect boxStyle={{position:'absolute', top:'29px', zIndex:'45', borderRight:'0px', overflow:'hidden', overflowY:'hidden'}} dropStyle={{width:'235px', borderBottom:'1px solid #FF7000', borderTop:'0px'}} maxHeight='300px' width='235px' height='30px' select={this.socialMedias} name={'socialMedia_'+index} start={-1} startText='Selecione uma rede social' value={this.state.socialMedia.name} onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>                            
                    </div>)
                }else{
                    if (socialMedia){
                        let link = ''
                        switch(midia.name){
                            case 'Facebook':
                                link = 'www.facebook.com/'
                                break;
                            case 'Instagram':
                                link = 'www.instagram.com/'
                                break;
                            case 'Twitter':
                                link = 'www.twitter.com/'
                                break;
                            case 'LinkedIn':
                                link = 'linkedin.com/company/'
                                break;
                        }
                        return(
                        <div style={{padding:'0 10px', fontSize:'15px', color:'#444', display:'flex'}} key={key}>
                            <div style={{width:'100px', fontWeight:'bold'}}>
                                <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    {this.state.socialMedia[index].name}
                                </div>                                                        
                            </div>
                            <div style={{width:'288px', padding:'0px'}}>
                                <div style={{maxWidth:'288px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    <CustomInput width='100%' height='28px' margin='0' name={'Link_'+index} value={this.state.socialMedia[index].value} inputStyle={{lineHeight:'30px', paddingTop:'1px', textAlign:'left', fontWeight:'normal'}} start={link} onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>                                                                        
                            </div>
                            <div style={{width:'32px', height:'30px', lineHeight:'30px', margin:'5px 0px 5px 30px', borderRadius:'3px', textAlign:'center', fontWeight:'bold', backgroundColor:'#FF1414', color:'white', cursor:'pointer'}} onClick={()=>{this.deleteLink(index)}}>-</div>                                                                    
                        </div>)
                    }
                }                
            })
        }</div>);        
    }
    deleteLink(index){
        let socialMedia = this.state.socialMedia;
        let value = '';
        let sortList = [];
        if (!socialMedia[index]){ return; }
        value = socialMedia[index].name;
        console.log(value)
        if (value != 'Selecione uma rede social'){ this.socialMedias.push(value); }else{ return; }
        if (this.socialMedias.includes('Facebook')) { sortList.push('Facebook'); }
        if (this.socialMedias.includes('Instagram')) { sortList.push('Instagram'); }
        if (this.socialMedias.includes('Twitter')) { sortList.push('Twitter'); }
        if (this.socialMedias.includes('LinkedIn')) { sortList.push('LinkedIn'); }
        this.socialMedias = sortList;
        console.log(this.socialMedias)
        socialMedia.splice(index, 1);
        this.setState({socialMedia: socialMedia});
    }
    displayImage(e){
        this.statusText.text = '';
        this.canSave = ['white', '#FF7000', 'normal'];
        this.setState({ loading: true });
        let id = e.target.id
        let display = this.state.display;
        let index = 0;
        let gallery = [];
        console.log(id)
        if (!e.target.files[0]){ 
            this.setState({ loading: false, display: display });
            return; 
        }
        if (id.includes('gallery')){
            console.log('a')
            gallery = this.state.gallery;
            console.log(gallery);
            index = id.replace('gallery_', '');
            index = parseInt(index);
            id = 'galleryImage';
            console.log(e.target.value);
        }
        let src = URL.createObjectURL(e.target.files[0]);
        if (!src){ this.setState({ loading: false }) }
        console.log(src);
        switch(id){
            case 'profileImage': 
                this.setState({ loading: false, img_url: src, img_file: e.target.files[0] });
            break;
            case 'bannerImage': 
                this.setState({ loading: false, banner_url: src, banner_file: e.target.files[0] });
            break;
            case 'galleryImage':
                if (gallery[index]){
                    gallery[index].src = src;
                    gallery[index].file = e.target.files[0];
                    e.target.value = '';
                    this.setState({gallery: gallery, loading: false});
                }else{
                    this.setState({loading: false});
                }
            break;s
        }       
    }
    deleteImage(index){
        if (this.state.loading){ return; }
        this.setState({loading: true})
        let gallery = this.state.gallery;
        gallery.splice(index, 1);
        gallery.push({src: '', name:'', file: undefined})
        this.setState({gallery: gallery, loading:false});
        return;
    }
    uploadImage(inputId){   
        if (this.state.loading){ return; }
        this.setState({loading:true})
        let id = inputId;
        let meta = { folder: Meteor.userId() };        
        let img = '';
        let file = undefined;
        let index = 0;
        let gallery = [];
        if (id.includes('gallery')){
            gallery = this.state.gallery;
            index = id.replace('galleryImage_', '');
            index = parseInt(index); 
            id = 'galleryImage';                      
            if (!gallery[index]){
                gallery[index] = {src: '', name: '', file: undefined};
                this.setState({gallery: gallery, loading: false});
                this.validateInputs(); 
                return;
            }
            if (index > 5){ 
                gallery.splice(index, 1);
                this.setState({gallery: gallery, loading: false});
                this.validateInputs(); 
                return; 
            }
            file = gallery[index].file;
        }
        switch(id){
            case 'profileImage':
                meta.type = 'usersProfileFolder';
                img = 'img_url';
                file = this.state.img_file;
                if (!file){ 
                    this.setState({ img_file: undefined, img_url: '', loading: false });
                    this.errors[0].push('Ocorreu ao subir a imagem de perfil, verifique sua conexão com a internet ou selecione a imagem novamente');
                    this.imcompleteProfile.push('img_url')
                    this.validateInputs(); 
                    return;
                }
                break;
            case 'bannerImage':
                meta.type = 'usersBannerFolder';
                img = 'banner_url';
                file = this.state.banner_file;
                if (!file){ 
                    this.setState({ banner_file: undefined, img_url: '', loading: false }); 
                    this.errors[0].push('Ocorreu ao subir seu banner, verifique sua conexão com a internet ou selecione a imagem novamente');
                    this.validateInputs();
                    return;
                }
                break;
            case 'galleryImage':
                meta.type = 'usersGalleryFolder';
                meta.index = index;
                console.log('a')
                file = this.state.gallery[index].file;
                if (!file){
                    gallery[index] = {src: '', name: '', file: undefined};
                    this.setState({ gallery: gallery, loading: false });
                    this.validateInputs(); 
                    return;
                }
                let uploader = new Slingshot.Upload('service-images', meta);
                uploader.send(file, (error, imageUrl)=>{
                    if (error) {
                        gallery[index] = {src: '', name: '', file: undefined};
                        this.setState({ gallery: gallery, loading: false });
                        this.validateInputs(); 
                    }else{ 
                        gallery[index].src = imageUrl;
                        this.setState({ gallery: gallery, loading: false }); 
                        this.validateInputs();
                        console.log(imageUrl) 
                    }
                });
                return;
                break;

        }
        if (!file){ return; }
        let uploader = new Slingshot.Upload('service-images', meta); 
        uploader.send(file, (error, imageUrl)=>{
            let url = ''
            if (error) {
                this.errors[0].push('Ocorreu um erro ao subir a imagem para o servido, verifique sua conexão com a internet ou selecione a imagem novamente.')
                this.setState({ [img]: '', loading: false });
                this.validateInputs(); 
            }else{ 
                url = imageUrl; 
                this.setState({ [img]: url, loading: false }); 
                this.validateInputs();
                console.log(url) 
            }         
        });
    } 
    validateInputs(){
        if (this.state.loading){ return; }
        this.setState({loading: true});
        this.statusText = { text: '', color: '' };
        this.errors = [[],[],[],[]];
        this.imcompleteProfile = [];
        let services = [];   
        let lineBreaks = [];
        let caractereLimit = false;
        

        if (this.state.img_url.includes('blob')){ 
            this.setState({loading: false});
            this.uploadImage('profileImage'); 
            return; 
        }
        if (this.state.banner_url.includes('blob')){ 
            this.setState({loading: false});
            this.uploadImage('bannerImage'); 
            return; 
        }        
        for (let i = 0; i < this.state.gallery.length; i++){
            if (this.state.gallery[i].src.includes('blob')){ 
                console.log(i)
                this.setState({loading: false});
                this.uploadImage('galleryImage_'+i); 
                return; 
                break; 
            }
        }
        if (this.state.nome.length < 3){
            this.errors[1].push('O campo "Nome completo" é obrigatório.');
            this.imcompleteProfile.push('display_name')
        }
        this.state.nome = this.state.nome.trim();
        this.state.nome = this.state.nome.charAt(0).toUpperCase() + this.state.nome.slice(1);
        if (this.state.nascimento.length < 10){
            this.errors[1].push('O campo "Data de nascimento" é obrigatório.');
            this.imcompleteProfile.push('birthday');
        }else{
            if (!validateDate(this.state.nascimento, 'boolean', 'dd/mm/yyyy')){
                this.errors[1].push('A data de nascimento inserida não é válida.');
                this.imcompleteProfile.push('birthday');
            }
        }
        if (this.state.cpf.length < 14){
            this.errors[1].push('O campo "CPF" é obrigatório.');
            this.imcompleteProfile.push('cpf');
        }
        if (this.state.email.length < 5){
            this.errors[1].push('O campo "E-mail" é obrigatório.');
            this.imcompleteProfile.push('email');
        }else{
            if (!this.state.email.includes('@') || !this.state.email.includes('.')){
                this.errors[1].push('O e-mail inserido não é válido.');
                this.imcompleteProfile.push('email');
            }
        }
        if (this.state.celular.length < 13){
            this.errors[1].push('O campo "Celular" é obrigatório.');
            this.imcompleteProfile.push('cellphone');
        }
        this.state.apresentacao = this.state.apresentacao.trim();
        this.state.apresentacao = this.state.apresentacao.charAt(0).toUpperCase() + this.state.apresentacao.slice(1);
        if (this.state.apresentacao.length < 3){
            this.errors[2].push('O campo "Apresentação breve" é obrigatório.');
            this.imcompleteProfile.push('description');
        }else{
            if (this.state.apresentacao.length < 30){
                this.errors[2].push('Sua apresentação deve ter no mínimo 30 caracteres.');
                this.imcompleteProfile.push('description');
                caractereLimit = true;
            }
        }
        if (this.state.apresentacao.length > 500){
            this.errors[2].push('Sua apresentação deve ter no máximo 500 caracteres.');
            if (!this.imcompleteProfile.includes('description')){ this.imcompleteProfile.push('description'); }
        }        
        if (this.state.apresentacao != null && this.state.apresentacao != undefined){
            lineBreaks = this.state.apresentacao.match(/\r\n?|\n/g);
            if (lineBreaks != null && lineBreaks != undefined){
                if (lineBreaks.length > 25){
                    this.errors[2].push('Sua apresentação não pode conter mais que 25 quebras de linha.');
                    if (!this.imcompleteProfile.includes('description')){ this.imcompleteProfile.push('description'); }
                } 
                if (this.state.apresentacao.length - lineBreaks.length < 30 && !caractereLimit){
                    this.errors[2].push('Sua apresentação deve ter no mínimo 30 caracteres.'); 
                    if (!this.imcompleteProfile.includes('description')){ this.imcompleteProfile.push('description'); }
                }
            }
                       
        }
        let serviceError = [false, false];
        this.state.servicos.map((_service, index)=>{
            let value = _service.servico;
            let stop = false;            
            if ((value == 'Outro:' || value == 'Outro')){ 
                value = _service.outro
                if (value == '' || value == null || value == undefined){
                    if (!serviceError[0]){
                        this.errors[3].push('O campo ao lado de "Outro:" é obrigatório.');
                        if (!this.errors[3].includes('O campo ao lado de "Outro:" é obrigatório.')){ this.imcompleteProfile.push('O campo ao lado de "Outro:" é obrigatório.'); }
                        serviceError[0] = true;
                    }
                    //stop = true;
                }else{
                    if (value.length < 3){
                        if (!serviceError[1]){
                            this.errors[3].push('O nome do serviço a ser prestado deve ter ao menos 3 caracteres.');
                            if (!this.errors[3].includes('O nome do serviço a ser prestado deve ter ao menos 3 caracteres.')){ this.imcompleteProfile.push('O nome do serviço a ser prestado deve ter ao menos 3 caracteres.'); }
                            serviceError[1] = true;
                        }                        
                        //stop = true;
                    }                    
                }
            }
            if (value == 'Selecione uma categoria' || value == '' || value == null || value == undefined){ 
                stop = true; 
            }
            if (!stop){ 
                services.push(value); 
            }            
        });
        if (services.length == 0 || this.state.servicos.length == 0){  
            if (!serviceError[0] && !serviceError[1]){
                this.errors[3].push('Você deve selecinar ao menos um serviço.');
                this.imcompleteProfile.push('Você deve selecinar ao menos um serviço.');          
            }
        }        
        if (this.errors[0].length > 0 ||this.errors[1].length > 0 || this.errors[2].length > 0 || this.errors[3].length > 0){
            //this.setState({loading: false});
            //return;
        }
        let settings = this.state;
        let gallery = [];
        this.state.gallery.map((image, index)=>{
            if (image.src.includes('http')){
                if (!image.src.includes('blob')){ gallery.push(image); }
            }
        });
        let pack = {
            clientSideErrors: this.imcompleteProfile,
            hidden: settings.hidden,
            img_url: settings.img_url,
            banner_url: settings.banner_url,
            display_name: settings.nome,
            birthday: settings.nascimento,
            cpf: settings.cpf,
            cnpj: settings.cnpj,
            phone: settings.telefone,
            cellphone: settings.celular,
            description: settings.apresentacao,
            services: services,
            gallery: gallery
        }
        pack.services.map((service, index)=>{
            pack.services[index] = pack.services[index].trim();
            pack.services[index] = pack.services[index].charAt(0).toUpperCase() + pack.services[index].slice(1);
        });
        this.state.socialMedia.map((social, index)=>{
            if (social.name){
                 if (social.name != 'Selecione uma categoria'){
                     if (social.value){
                        let midiaName = social.name.toLowerCase()
                        //if (social.value.length > 3){ 
                            pack[midiaName] = social.value; 
                        //}
                    }
                }
            }  
        });
        console.log(pack)
        Meteor.call('saveServiceSettings', pack, (error, result)=>{
            if (error){
                console.log(error)
                //this.errors[0].push(error.reason);
            }else{
                if (result.serverErrors.length > 0){
                    this.statusText = { text: 'Seu perfil foi salvo, porém falta campos obrigatórios!', color: '#FF1414' };
                }else{
                    this.statusText = { text: 'Seu perfil foi salvo com sucesso!', color: '#3BCD38' };
                }
            }
            console.log(result);
            this.setState({loading: false});
        })
        /*CHECAR SE CATEGORIA OUTRO BATE COM LOWERCASE DAS LISTA, EM PRODUTOS TBM*/
    }    
    displayErrors(i){
        return(<div style={{margin:'10px 0'}}>
            {this.errors[i].map((errors, index)=>{
                let key = 'mainError_'+index
                switch(i){
                    case 0:
                        key = 'subError_'+index+'_0';
                        return( <div style={{color:'red', fontSize:'14px'}} key={key}>{this.errors[i][index]}</div> );
                        break;
                    case 1:
                        key = 'subError_'+index+'_1';
                        return( <div style={{color:'red', fontSize:'14px'}} key={key}>{this.errors[i][index]}</div> );
                        break;
                    case 2:
                        key = 'subError_'+index+'_2';
                        return( <div style={{color:'red', fontSize:'14px'}} key={key}>{this.errors[i][index]}</div> );
                        break;  
                    case 3:
                        key = 'subError_'+index+'_3';
                        return( <div style={{color:'red', fontSize:'14px'}} key={key}>{this.errors[i][index]}</div> );
                        break;                        
                }
            })}
        </div>);        
    }
    render(){//CRIAR APELIDO E MULTIPLOS TELEFONES
        console.log(this.state)
        let totalWidth = Math.round(this.state.banner.w - 320);
        let totalHeight = Math.round(this.state.banner.w - 320) / 2.72 - 40;
        let logo = 110 / totalWidth * 110;
        let index = 2;
        let sizes = [
            {px:'50px', font:'10px'}, 
            {px:'75px', font:'14px'}, 
            {px:'90px', font:'18px'}];
        return(
            <div style={{minWidth:'950px'}}>
                <VendorHeader/>
                <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                    <VendorMenu />
                    <div style={{width:'100%', backgroundColor:'white'}}>
                        <div style={{width:'100%', height:'45px', borderBottom:'1px solid #FF7000', backgroundColor:'#F7F7F7', display:'flex', position:'sticky', top:'0', zIndex:'30'}}>
                            <div style={{paddingLeft:'20px', margin:'auto 0', fontSize:'16px', fontWeight:'bold', color:'555'}}>Editar Perfil</div>
                            <div style = {{margin:'auto', fontSize:'14px', paddingLeft:'20px', color:this.statusText.color, fontWeight:'bold'}}>{this.statusText.text}</div>
                            <div style={{height:'27px', width:'75px', margin:'auto 20px', marginLeft:'auto', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000', cursor:'pointer'}} onClick={()=>{this.validateInputs()}}>Salvar</div>
                        </div>
                        <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                            <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                                <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Perfil do prestador de serviço:</div>
                                <div style={{margin:'auto 0', marginLeft:'auto', display:'flex'}}>
                                    <CustomToggle name='hidden' value={this.state.hidden} size={1} onChange={(e)=>{if (this.state.complete){this.inputHandler(e)}}}/>
                                    <div style={{margin:'auto 10px', paddingTop:'3px', paddingRight:'10px', color:'#555', fontSize:'13px', fontWeight:'bold'}}>
                                        Ocultar perfil
                                    </div>
                                </div>                                
                            </div>
                            <div style={{maxHeight:(!this.state.hidden) ? '0px' : '80px', overflow:'hidden', display:'flex'}}>
                                <div style={{width:'100%', marginTop:'15px', padding:'0px 15px 5px 15px', margin:'auto 0', borderBottom:'1px solid #FFDBBF', fontSize:'13px', color:'#666'}}>
                                Seu perfil esta oculto, ele não irá aparecer nos mecanismos de pesquisa e nem poderá ser acessado pelos usuários.
                                </div>
                            </div>
                            <div style={{margin:'10px 10px', border:'1px solid #CCC', backgroundColor:'white', position:'relative'}}>                                
                                <div style={{width:'100%', height:'100%', display:(this.state.banner_url != '') ? 'block' : 'none', backgroundColor:'white', position:'absolute', top:'0px', left:'0px', backgroundImage:'url('+this.state.banner_url+')', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                <div style={{padding:'10px', border:(this.state.banner_url != '') ? '5px solid #F7F7F7' : '0px', display:'flex', position:'relative'}}>
                                    <div style={{width:'100%', height:totalHeight, backgroundColor:(this.state.banner_url == '') ? '#F7F7F7' : 'transparent', display:'flex'}}>
                                        <div style={{margin:'auto', fontWeight:'bold', color:'#CCC', fontSize:'20px', display:(this.state.banner_url == '') ? 'block' : 'none'}}>1200 X 440</div>
                                        
                                        <label htmlFor='bannerImage' style={{width:'150px', height:'30px', lineHeight:'33px', borderRadius:'3px', backgroundColor:'#FF7000', textAlign:'center', position:'absolute', right:'100px', bottom:'-20px', fontSize:'14px', color:'white', display:'flex'}}>
                                            <div style={{margin:'0 auto', display:'flex'}}>
                                                <div style={{width:'16px', height:'16px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-upload.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                                <div style={{width:'max-content', cursor:'pointer'}}>Adicionar Banner</div>
                                            </div>
                                        </label>
                                        <input style={{display:'none'}} type='file' id='bannerImage' accept='image/*' onChange={(e)=>{ this.displayImage(e); }}/>
                                    </div>                                    
                                    <div style={{position:'absolute', bottom:'-30px', left:'30px', border:'1px solid #ccc', backgroundColor:'white'}}>
                                        <div style={{padding:'10px', border:'5px solid #F7F7F7'}}>
                                            <div style={{width:sizes[index].px, height:sizes[index].px, backgroundColor:'#F7F7F7', display:'flex'}}>
                                                <div style={{margin:'auto'}}>
                                                    <div style={{fontWeight:'bold', textAlign:'center', color:'#CCC', fontSize:sizes[index].font}}>100 X 100</div>                                                
                                                </div>                                            
                                            </div>
                                        </div>
                                        <div style={{width:(parseInt(sizes[index].px)+30+'px'), height:(parseInt(sizes[index].px)+30+'px'), display:(this.state.img_url != '') ? 'block' : 'none', position:'absolute', top:'0px', left:'0px', backgroundImage:'url('+this.state.img_url+')', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundSize:'contain', backgroundColor:'white'}}></div>
                                        <label htmlFor='profileImage' style={{width:'100%', height:'25px', lineHeight:'25px', marginTop:'auto', fontSize:'12px', textAlign:'center', backgroundColor:'#00000050', color:'white', position:'absolute', bottom:'0', cursor:'pointer'}}>
                                            Adicionar Foto
                                        </label>
                                        <input style={{display:'none'}} type='file' id='profileImage' accept='image/*' onChange={(e)=>{ this.displayImage(e); }}/>
                                    </div>
                                </div>
                            </div>      
                            <div style={{marginTop:'50px', padding:'0 10px'}}>{this.displayErrors(0)}</div>                      
                            <div style={{paddingBottom:'10px', fontSize:'15px', fontWeight:'bold', color:'#444', display:'flex'}}>
                                <div style={{width:'160px', padding:'0 10px'}}>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <span style={{color:'#FF1414'}}>*</span>Nome completo
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <span style={{color:'#FF1414'}}>*</span>Data de nascimento
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <span style={{color:'#FF1414'}}>*</span>CPF
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        CNPJ
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <span style={{color:'#FF1414'}}>*</span>E-mail
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <span style={{color:'#FF1414'}}>*</span>Celular
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        Telefone
                                    </div>                                                                    
                                </div>
                                <div style={{width:'260px', padding:'0 10px'}}>
                                    <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <CustomInput width='100%' height='28px' margin='0' name='nome' value={this.state.nome} inputStyle={{textAlign:'center'}} placeholder='Nome' onChange={(e)=>{this.inputHandler(e)}}/>
                                    </div>
                                    <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <CustomInput width='100%' height='28px' margin='0' name='nascimento' value={this.state.nascimento} inputStyle={{textAlign:'center'}} placeholder='Data de Nascimento' onChange={(e)=>{this.inputHandler(e)}}/>
                                    </div>
                                    <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <CustomInput width='100%' height='28px' margin='0' name='cpf' value={this.state.cpf} inputStyle={{textAlign:'center'}} placeholder='CPF' onChange={(e)=>{this.inputHandler(e)}}/>
                                    </div>
                                    <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <CustomInput width='100%' height='28px' margin='0' name='cnpj' value={this.state.cnpj} inputStyle={{textAlign:'center'}} placeholder='CNPJ' onChange={(e)=>{this.inputHandler(e)}}/>
                                    </div>
                                    <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <CustomInput width='100%' height='28px' margin='0' name='email' style={{backgroundColor:'#DFDFDF'}} value={this.state.email} inputStyle={{textAlign:'center'}} placeholder='E-mail'/>
                                    </div>
                                    <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <CustomInput width='100%' height='28px' margin='0' name='celular' value={this.state.celular} inputStyle={{textAlign:'center'}} placeholder='Celular com DDD' onChange={(e)=>{this.inputHandler(e)}}/>
                                    </div>
                                    <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <CustomInput width='100%' height='28px' margin='0' name='telefone' value={this.state.telefone} inputStyle={{textAlign:'center'}} placeholder='Telefone com DDD' onChange={(e)=>{this.inputHandler(e)}}/>
                                    </div>
                                </div>                                
                            </div>                  
                            <div style={{padding:'0 10px'}}>{this.displayErrors(1)}</div>  
                                       
                            <div style={{padding:'0 10px', marginTop:'30px'}}>
                                <div style={{height:'30px', lineHeight:'30px', fontSize:'16px', fontWeight:'bold', color:'#444'}}>
                                    <span style={{color:'#FF1414'}}>*</span>Apresentação breve
                                </div>
                                <div style={{marginTop:'15px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                                    <div style={{height:'175px', width:'462px', padding:'10px', paddingBottom:'0px', border:'1px solid #ff7000', borderRadius:'3px', boxSizing:'border-box', backgroundColor:'white'}}>                                        
                                        <textarea style={{width:'100%', height:'140px', padding:'0px', border:'0px', boxSizing:'border-box', overflowY:'scroll', resize:'none', fontSize:'14px'}} name='apresentacao' value={this.state.apresentacao} onChange={(e)=>{this.inputHandler(e)}}/>
                                        <div style={{width:'100%', height:'20px', marginLeft:'auto', lineHeight:'20px', fontSize:'13px'}}>
                                        <div style={{width:'fit-content', marginLeft:'auto'}}>
                                            caracteres: <span style={{fontSize:'11px'}}>{this.state.apresentacao.length.toString()}/500</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{marginTop:'10px'}}>
                                    <div style={{lineHeight:'12px', paddingLeft:'5px', fontSize:'12px', fontWeight:'nomal', color:'#666', }}>
                                        Sua apresentação deve ter no mínimo 30 caracteres.
                                    </div>    
                                </div>
                                {this.displayErrors(2)}
                            </div>                            
                            <div style={{padding:'0 10px', marginTop:'30px'}}>
                                <div style={{height:'30px', lineHeight:'30px', fontSize:'16px', fontWeight:'bold', color:'#444'}}>
                                    <span style={{color:'#FF1414'}}>*</span>Serviços prestados
                                </div>
                                <div style={{marginTop:'15px'}}>
                                    {this.serviceList()}
                                    {this.displayErrors(3)}
                                </div>                                
                            </div>
                            <div style={{padding:'0 10px', marginTop:'30px'}}>
                                <div style={{height:'fit-content', lineHeight:'30px', fontSize:'16px', color:'#444'}}>
                                    <div style={{fontWeight:'bold'}}>Redes sociais </div>
                                    <div style={{lineHeight:'12px', paddingLeft:'10px', fontSize:'12px', fontWeight:'nomal', color:'#666', }}>
                                        Divulgar suas redes sociais em seu perfil.(Este campo não é obrigatório)
                                    </div>
                                </div>
                                <div style={{paddingBottom:'10px', marginTop:'15px', fontSize:'15px', color:'#444', display:'flex'}}>
                                    {this.socialMedia()}                                                              
                                </div>                                
                            </div>
                            <div style={{padding:'0 10px', marginTop:'30px'}}>
                            <div style={{height:'fit-content', lineHeight:'30px', fontSize:'16px', color:'#444'}}>
                                    <div style={{fontWeight:'bold'}}>Galeria </div>
                                    <div style={{lineHeight:'12px', paddingLeft:'10px', fontSize:'12px', fontWeight:'nomal', color:'666', }}>
                                        Divulgue fotos de seus trabalhos para tornar seu perfil mais atrativo.(Este campo não é obrigatório)
                                    </div>
                                    <div style={{lineHeight:'12px', paddingLeft:'10px', fontSize:'12px', fontWeight:'nomal', color:'#777'}}>
                                        • Cada imagem não deve ultrapassar 2MB.
                                    </div>
                                    <div style={{lineHeight:'12px', paddingLeft:'10px', fontSize:'12px', fontWeight:'nomal', color:'#777'}}>
                                        • Os formatos de imagem aceitos são: PNG, JPEG e JPG.
                                    </div>
                                </div>
                                <div style={{marginTop:'10px', display:'flex', flexWrap:'nowrap'}}>
                                    <div style={{width:'120px', height:'120px', margin:'10px 10px 0 0', border:'1px solid #ccc', 'backgroundColor':'#FFF', position:'relative', cursor:'pointer'}}>
                                        <label htmlFor='gallery_0' style={{width:'120px', height:'95px', display:'flex', cursor:'pointer'}}>
                                            <label htmlFor='gallery_0' style={{width:'40px', height:'40px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-image-plus.png', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', opacity:'0.4', cursor:'pointer'}}></label>                                                                                               
                                        </label>                                         
                                        <label htmlFor='gallery_0' style={{width:'120px', height:'120px', lineHeight:'25px', position:'absolute', top:'0px', left:'0px', backgroundImage:'url('+ this.state.gallery[0].src+')', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', cursor:'pointer', backgroundColor:(this.state.gallery[0].src) ? 'white' : 'transparent'}}></label>
                                        <label htmlFor='gallery_0' style={{width:'120px', height:'25px', lineHeight:'25px', position:'absolute', bottom:'0px', left:'0px', backgroundColor:'#00000060', fontSize:'12px', textAlign:'center', color:'#FFF', cursor:'pointer'}}>
                                            Subir Foto
                                        </label>
                                        <div style={{width:'20px', height:'20px', position:'absolute', top:'-5px', right:'-5px', backgroundImage:'url(/imgs/icons/icon-cancel.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer', display:(this.state.gallery[0].src) ? 'block' : 'none'}} onClick={()=>{this.deleteImage(0)}}></div>
                                        <input style={{display:'none'}} type='file' id='gallery_0' accept='image/*' onChange={(e)=>{this.displayImage(e)}}/>
                                    </div>
                                    <div style={{width:'120px', height:'120px', margin:'10px 10px 0 0', border:'1px solid #ccc', 'backgroundColor':'#FFF', position:'relative', cursor:'pointer', display:(this.state.gallery[1].src ||this.state.gallery[0].src) ? 'block' : 'none'}}>
                                        <label htmlFor='gallery_1' style={{width:'120px', height:'95px', display:'flex', cursor:'pointer'}}>
                                            <label htmlFor='gallery_1' style={{width:'40px', height:'40px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-image-plus.png', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', opacity:'0.4', cursor:'pointer'}}></label>                                                                                               
                                        </label>                                         
                                        <label htmlFor='gallery_1' style={{width:'120px', height:'120px', lineHeight:'25px', position:'absolute', top:'0px', left:'0px', backgroundImage:'url('+ this.state.gallery[1].src+')', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', cursor:'pointer', backgroundColor:(this.state.gallery[1].src) ? 'white' : 'transparent'}}></label>
                                        <label htmlFor='gallery_1' style={{width:'120px', height:'25px', lineHeight:'25px', position:'absolute', bottom:'0px', left:'0px', backgroundColor:'#00000060', fontSize:'12px', textAlign:'center', color:'#FFF', cursor:'pointer'}}>
                                            Subir Foto
                                        </label>
                                        <div style={{width:'20px', height:'20px', position:'absolute', top:'-5px', right:'-5px', backgroundImage:'url(/imgs/icons/icon-cancel.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer', display:(this.state.gallery[1].src) ? 'block' : 'none'}} onClick={()=>{this.deleteImage(1)}}></div>
                                        <input style={{display:'none'}} type='file' id='gallery_1' accept='image/*' onChange={(e)=>{this.displayImage(e)}}/>
                                    </div>
                                    <div style={{width:'120px', height:'120px', margin:'10px 10px 0 0', border:'1px solid #ccc', 'backgroundColor':'#FFF', position:'relative', cursor:'pointer', display:(this.state.gallery[2].src || this.state.gallery[1].src && this.state.gallery[0].src) ? 'block' : 'none'}}>
                                        <label htmlFor='gallery_2' style={{width:'120px', height:'95px', display:'flex', cursor:'pointer'}}>
                                            <label htmlFor='gallery_2' style={{width:'40px', height:'40px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-image-plus.png', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', opacity:'0.4', cursor:'pointer'}}></label>                                                                                               
                                        </label>                                         
                                        <label htmlFor='gallery_2' style={{width:'120px', height:'120px', lineHeight:'25px', position:'absolute', top:'0px', left:'0px', backgroundImage:'url('+ this.state.gallery[2].src+')', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', cursor:'pointer', backgroundColor:(this.state.gallery[2].src) ? 'white' : 'transparent'}}></label>
                                        <label htmlFor='gallery_2' style={{width:'120px', height:'25px', lineHeight:'25px', position:'absolute', bottom:'0px', left:'0px', backgroundColor:'#00000060', fontSize:'12px', textAlign:'center', color:'#FFF', cursor:'pointer'}}>
                                            Subir Foto
                                        </label>
                                        <div style={{width:'20px', height:'20px', position:'absolute', top:'-5px', right:'-5px', backgroundImage:'url(/imgs/icons/icon-cancel.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer', display:(this.state.gallery[2].src) ? 'block' : 'none'}} onClick={()=>{this.deleteImage(2)}}></div>
                                        <input style={{display:'none'}} type='file' id='gallery_2' accept='image/*' onChange={(e)=>{this.displayImage(e)}}/>
                                    </div>
                                    <div style={{width:'120px', height:'120px', margin:'10px 10px 0 0', border:'1px solid #ccc', 'backgroundColor':'#FFF', position:'relative', cursor:'pointer', display:(this.state.gallery[3].src || this.state.gallery[2].src && this.state.gallery[1].src && this.state.gallery[0].src) ? 'block' : 'none'}}>
                                        <label htmlFor='gallery_3' style={{width:'120px', height:'95px', display:'flex', cursor:'pointer'}}>
                                            <label htmlFor='gallery_3' style={{width:'40px', height:'40px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-image-plus.png', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', opacity:'0.4', cursor:'pointer'}}></label>                                                                                               
                                        </label>                                        
                                        <label htmlFor='gallery_3' style={{width:'120px', height:'120px', lineHeight:'25px', position:'absolute', top:'0px', left:'0px', backgroundImage:'url('+ this.state.gallery[3].src+')', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', cursor:'pointer', backgroundColor:(this.state.gallery[3].src) ? 'white' : 'transparent'}}></label>
                                        <label htmlFor='gallery_3' style={{width:'120px', height:'25px', lineHeight:'25px', position:'absolute', bottom:'0px', left:'0px', backgroundColor:'#00000060', fontSize:'12px', textAlign:'center', color:'#FFF', cursor:'pointer'}}>
                                            Subir Foto
                                        </label> 
                                        <div style={{width:'20px', height:'20px', position:'absolute', top:'-5px', right:'-5px', backgroundImage:'url(/imgs/icons/icon-cancel.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer', display:(this.state.gallery[3].src) ? 'block' : 'none'}} onClick={()=>{this.deleteImage(3)}}></div>
                                        <input style={{display:'none'}} type='file' id='gallery_3' accept='image/*' onChange={(e)=>{console.log('a');this.displayImage(e)}}/>
                                    </div>
                                    <div style={{width:'120px', height:'120px', margin:'10px 10px 0 0', border:'1px solid #ccc', 'backgroundColor':'#FFF', position:'relative', cursor:'pointer', display:(this.state.gallery[4].src || this.state.gallery[3].src && this.state.gallery[2].src && this.state.gallery[1].src && this.state.gallery[0].src) ? 'block' : 'none'}}>
                                        <label htmlFor='gallery_4' style={{width:'120px', height:'95px', display:'flex', cursor:'pointer'}}>
                                            <label htmlFor='gallery_4' style={{width:'40px', height:'40px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-image-plus.png', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', opacity:'0.4', cursor:'pointer'}}></label>                                                                                               
                                        </label>                                         
                                        <label htmlFor='gallery_4' style={{width:'120px', height:'120px', lineHeight:'25px', position:'absolute', top:'0px', left:'0px', backgroundImage:'url('+ this.state.gallery[4].src+')', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', cursor:'pointer', backgroundColor:(this.state.gallery[4].src) ? 'white' : 'transparent'}}></label>
                                        <label htmlFor='gallery_4' style={{width:'120px', height:'25px', lineHeight:'25px', position:'absolute', bottom:'0px', left:'0px', backgroundColor:'#00000060', fontSize:'12px', textAlign:'center', color:'#FFF', cursor:'pointer'}}>
                                            Subir Foto
                                        </label>
                                        <div style={{width:'20px', height:'20px', position:'absolute', top:'-5px', right:'-5px', backgroundImage:'url(/imgs/icons/icon-cancel.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer', display:(this.state.gallery[4].src) ? 'block' : 'none'}} onClick={()=>{this.deleteImage(4)}}></div>
                                        <input style={{display:'none'}} type='file' id='gallery_4' accept='image/*' onChange={(e)=>{this.displayImage(e)}}/>
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
export default ServiceSettingsPage;