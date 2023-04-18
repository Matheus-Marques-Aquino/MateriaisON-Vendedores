import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';
import history from './subcomponents/widgets/history';
import CustomInput from './subcomponents/widgets/customInput';
import CustomToggle from './subcomponents/widgets/customToggle';
import CustomSelect from './subcomponents/widgets/customSelect';
import { validator } from './subcomponents/widgets/validationHelper';
import { mask } from './subcomponents/widgets/mask';
import validateDate from 'validate-date';
import getAge from 'get-age';

class AccountFirstStepPage extends Component {
    constructor(props){
        super(props);
        this.errors = [];
        this.errors[0] = [];
        this.errors[1] = [];
        this.errors[2] = [];
        this.prestador_profile = {};
        this.fornecedor_profile = {};
        this.start = true;
        this.services = ['Escolha uma categoria', 'Aluguel de Maquinário', 'Arquiteto', 'Engenheiro', 'Limpeza pós Obra', 
        'Pedreiro', 'Poço Artesiano', 'Antenista', 'Automação Residencial', 'Instalação de Eletrônicos', 
        'Instalador TV Digital', 'Instalador de Ar Condicionado', 'Segurança Eletrônica', 'Encanador', 
        'Eletricista', 'Gás', 'Gesso e Drywall', 'Pavimentação', 'Pintor', 'Serralheria e Solda', 
        'Vidraceiro', 'Chaveiro', 'Dedetizador', 'Desentupidor', 'Desinfecção', 'Impermebilizador', 
        'Marceneiro', 'Marido de Aluguel', 'Mudanças e Carretos', 'Tapeceiro', 'Decorador', 'Design de Interiores', 
        'Instalador de Papel de Parede', 'Jardinagem', 'Paisagismo', 'Montador de Móveis', 'Limpeza de Piscina', 'Outro'];
        this.start = true;
        this.state = {
            fornecedor: false,
            nomeLoja: '',
            cnpj: '',
            telefone1: '',
            prestador: false,
            servicos:[{ servico: '' }],            
            foto: '',
            apelido: '',
            telefone2: '',
            nascimento: '',
            cpfAccept: false,  
            display: {display:'none', src:''},   
            imgUrl: '',       
            loading: false 
        };
    }
    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;
        console.log(name);
        if (name == 'telefone1' || name == 'telefone2'){ value = mask('phone', value); }
        if (name == 'nascimento'){value = mask('birthday', value); }
        if (name == 'cnpj'){value = mask('cnpj', value); }
        if (name.includes('servicos_')){
            console.log(name)
            let index = name.replace('servicos_', '');
            let servicos = []
            servicos = this.state.servicos;
            index = parseInt(index);
            servicos[index].servico = value;   
            if (value != 'Outros'){ servicos[index] = {servico: value}; }         
            this.setState({ servicos: servicos });
            return;
        }
        if (name.includes('outros_')){
            console.log(name)
            let index = name.replace('outros_', '');
            let servicos = []
            servicos = this.state.servicos;
            index = parseInt(index);
            servicos[index].other = value;            
            this.setState({ servicos: servicos });
            return;
        }
        this.setState({ [name]: value });
    }
    displayImage(e){
        let src = URL.createObjectURL(e.target.files[0]);
        let display = this.state.display;
        display = {display:'flex', src:src};        
        this.setState({display:display});
    }
    ageValidation(date){
        let formatedDate = date.split('/');
        formatedDate = formatedDate[2]+'-'+formatedDate[1]+'-'+formatedDate[0];
        console.log(formatedDate)
        return getAge(formatedDate);
    }
    secondValidation(){
        if (this.state.prestador){
            let uploader = new Slingshot.Upload('profile-pics');
            uploader.send(document.getElementById('foto').files[0], (error, imgUrl)=>{
                if (error) {
                    this.errors[1].push('A foto escolhida não pode ser validada, tente novamente com outra foto.');
                }
                else {
                    let serv = [];
                    this.state.servicos.map(service=>{
                        serv.push(service.servico);
                    });                    
                    this.prestador_profile = {
                        prestador: true,
                        img_url: imgUrl,
                        nickname: this.state.apelido,
                        birthday: this.state.nascimento,
                        phone: this.state.telefone2,
                        services: serv
                    };           
                    console.log(this.prestador_profile);
                    if (this.errors[0].length > 0 || this.errors[1].length > 0 || this.errors[2].length > 0 ){
                        this.setState({ loading: false });
                        return;
                    }        
                    console.log(this.errors);
                    this.setState({ loading: false });
                    Meteor.call('AccountFirstStep', this.fornecedor_profile, this.prestador_profile, (error)=>{
                        if (error){
                            this.errors[2].push(error.reason);
                            this.setState({ loading: false });
                        }else{
                            history.push('/nova-conta/segundo-passo');
                        }
                    })            
                    return;
                }
            });            
        }
        if (this.errors[0].length > 0 || this.errors[1].length > 0 || this.errors[2].length > 0 ){
            this.setState({ loading: false });
            return;
        }        
        this.setState({ loading: false });
    }  
    validateInputs(){              
        this.errors[0] = [];
        this.errors[1] = [];
        this.errors[2] = [];
        if (this.state.loading){ return; }
        this.setState({loading: true})   
        if (this.state.fornecedor == false && this.state.prestador == false){ this.errors[2].push('Você deve escolher pelo menos uma das categorias acima.'); }
        if (this.state.fornecedor){ 
            if (this.state.nomeLoja.length < 3){ this.errors[0].push('Você deve preencher o nome de sua loja.'); }
            if (!validator('cnpj', this.state.cnpj, 'CNPJ').result){ this.errors[0].push(validator('cnpj', this.state.cnpj, 'CNPJ').message); }
            if (!validator('telefone', this.state.telefone1, 'telefone').result){ this.errors[0].push(validator('telefone', this.state.telefone1, 'telefone').message); }
            if (!this.state.cpfAccept){ this.errors[0].push('Você deve confirmar que é responsavel pelo CNPJ.')}
            this.fornecedor_profile = {
                fornecedor: true,
                display_name: this.state.nomeLoja,
                cnpj: this.state.cnpj,
                phone: this.state.telefone1,
                cnpjConfirm: this.state.cpfAccept
            }
        }
        if (this.state.prestador){
            if (this.state.nascimento.length < 10){ 
                this.errors[1].push('A data de nascimento inserida não é válida.'); 
            }else{
                if (!validateDate(this.state.nascimento, 'boolean', 'dd/mm/yyyy')){
                    this.errors[1].push('A data de nascimento inserida não é válida.');
                }else{
                    let age = this.ageValidation(this.state.nascimento);
                    if ( age < 16 ){
                        this.errors[1].push('Você deve ter no minímo 16 anos para se cadstrar na plataforma.');
                    }
                    if ( age > 85 ){
                        this.errors[1].push('A data de nascimento inserida não é válida.')
                    }
                }
            }            
            if (!validator('telefone', this.state.telefone2, 'telefone').result){ this.errors[1].push(validator('telefone', this.state.telefone2, 'telefone').message); }
            for(let i = 0; i < this.state.servicos.length; i++){
                if (this.state.servicos[i].servico == 'Escolha uma categori'){
                    if (i > 0){ 
                        this.errors[1].push('Todos os campos de serviço adicionados devem ser preenchidos.');
                        break;
                    }
                    this.errors[1].push('Você deve escolher pelo menos um serviço da lista.');
                    break;
                }
            }
            if (document.getElementById('foto').files[0] == undefined){
                this.errors[1].push('A foto escolhida não pode ser validada, tente novamente com outra foto.');
            }
            if (this.errors[1].length > 0){
                this.setState({ loading: false });
                return;
            }            
            async function imageValidation(){
                let uploader = new Slingshot.Upload('ProductImages');
                let image = await uploader.send(document.getElementById('foto').files[0], (error, url)=>{
                    if (error) {
                        this.errors[1].push('A foto escolhida não pode ser validada, tente novamente com outra foto.');
                        return '';
                    }
                    else { return url; }
                });
            }             
        }
        this.secondValidation();
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
                if (service.servico == 'Outros'){
                    return(<div style={{display:'flex', marginBottom:'5px'}} key={key}>
                        <div style={{width:'100%', display:'flex'}}>
                            <div style={{width:'100%', paddingRight:'20px', display:'flex'}}>                                
                                <div style={{width:'260px', paddingRight:'10px', fontSize:'14px'}}>
                                    <CustomSelect width='260px' height='32px' margin='0px' maxHeight='192px' select={this.services} start={37} name={'servicos_'+index} index={index} value={this.state.servicos[index].servico} placeholder='SERVIÇO PRESTADO' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <CustomInput width='100%' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name={'outros_'+index} value={this.state['outros_'+index]} placeholder='SERVIÇO PRESTADO' onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>                            
                            <div style={{height:'30px', marginLeft:'10px', cursor:'pointer', borderRadius:'3px', border:'1px solid '+service.button.color, backgroundColor:service.button.color, display:'flex'}} onClick={(e)=>{this.serviceController(index)}}>
                                <div style={{width:'30px', lineHeight:'30px', textAlign:'center', fontWeight:'bold', color:'white'}}>{service.button.text}</div>
                            </div>
                        </div>
                    </div>)
                }
                return(
                    <div style={{display:'flex', marginBottom:'5px'}} key={key}>
                        <div style={{width:'100%', display:'flex'}}>
                            <CustomSelect width='100%' height='30px' maxHeight='210px' margin='0px' select={this.services} name={'servicos_'+index} index={index} value={this.state.servicos[index].servico} placeholder='SERVIÇO PRESTADO' onChange={(e)=>{this.inputHandler(e)}}/>
                            <div style={{height:'30px', marginLeft:'10px', cursor:'pointer', borderRadius:'3px', border:'1px solid '+service.button.color, backgroundColor:service.button.color, display:'flex'}} onClick={(e)=>{this.serviceController(index)}}>
                                <div style={{width:'30px', lineHeight:'30px', textAlign:'center', fontWeight:'bold', color:'white'}}>{service.button.text}</div>
                            </div>
                        </div>
                    </div>
                ); 
            })
        );       
    }
    serviceController(index){
        let servicos = this.state.servicos;
        if (servicos[index].button.text == '-'){
            servicos.splice(index, 1);            
        }else{
            if (servicos.length < 15){
                servicos.push({ servico: ''}); 
            }
        }
        this.setState({servicos: servicos})         
    }    
    displayErrors(index){     
        if (index == 0 && this.state.fornecedor == false){ return; }
        if (index == 1 && this.state.prestador == false) { return; }   
        if (this.errors[index].length > 0){return(<div style={{margin:'10px 0'}}>
            {this.errors[index].map((error, index)=>{
                let key = 'input_'+index
                return(<div style={{color:'red', fontSize:'14px'}} key={key}>{error}</div>)
            })}
        </div>)}        
    }
    displayForm(){
        let style = this.state.display;
        let clientWidth = document.querySelector('.mainContainer').clientWidth;
        if (clientWidth >= 620){
            return(
            <div style={{width:'100%', marginTop:'10px', display:'flex'}}>
                <div style={{width:'50%', height:'100px', padding:'7.5px 0', marginRight:'10px', border:'1px solid #FF7000', borderRadius:'3px', display:'flex'}}>
                    <div style={{width:'50%', dispay:'flex'}}>
                        <div style={{marginTop:'10px', marginLeft:'30px', marginBottom:'5px'}}>Foto pessoal:</div>                                                       
                        <div style={{fontSize:'12px', marginLeft:'30px', color:'#444'}}><span style={{color:'#FF7000', paddingTop:'1px'}}>•</span> Deve estar nítida </div>
                        <div style={{fontSize:'12px', marginLeft:'30px', color:'#444'}}><span style={{color:'#FF7000', paddingTop:'1px'}}>•</span> Focar em seu rosto</div>
                        <div style={{fontSize:'12px', marginLeft:'30px', color:'#444'}}><span style={{color:'#FF7000', paddingTop:'1px'}}>•</span> Evitar acessórios</div>                                
                    </div>
                    <div style={{width:'50%', paddingLeft:'10px 0', display:'flex'}}>
                        <div style={{width:'98px', height:'98px', border:'1px solid #FF7000', borderRadius:'3px', margin:'0 auto', position:'relative'}}>
                            <div style={{width:'98px', height:'69px', display:'flex'}}>
                                <label htmlFor='foto' style={{width:'30px', height:'30px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-image-plus.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', opacity:'0.5'}}></label>
                            </div>
                            <label htmlFor='foto'  style={{width:'98px', height:'98px', cursor:'pointer', borderTopLeftRadius:'3px', borderTopRightRadius:'3px', display:style.display, top:'0px', left:'0px', position:'absolute', backgroundColor:'white', backgroundImage:'url('+style.src+')', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></label>
                            <label htmlFor='foto' style={{width:'100%', height:'30px', cursor:'pointer', lineHeight:'30px', textAlign:'center', backgroundColor:'black', fontSize:'12px', opacity:'0.5', color:'white', display:'block'}}>Subir imagem</label> 
                            <input style={{display:'none'}} type="file" id="foto" accept="image/*" onChange={(e)=>{this.displayImage(e)}}/>
                        </div>                            
                    </div>                    
                </div>
                <div style={{width:'50%'}}>
                    <div style={{width:'100%'}}>
                        <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='apelido' value={this.state.apelido} placeholder='NOME FANTASIA (opcional)' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>
                    <div style={{width:'100%', marginTop:'10px'}}>
                        <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='nascimento' value={this.state.nascimento} placeholder='DATA DE NASCIMENTO' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>
                    <div style={{width:'100%', marginTop:'10px'}}>
                        <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='telefone2' value={this.state.telefone2} placeholder='TELEFONE' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>
                </div>
            </div>);
        }
        return(
        <div style={{width:'100%', marginTop:'10px'}}>
            <div style={{width:'100%', padding:'10px 0', margin:'0 auto', border:'1px solid #FF7000', borderRadius:'3px'}}>
                <div style={{marginBottom:'10px', textAlign:'center', fontWeight:'bold', color:'#555'}}>Foto pessoal:</div>
                <div style={{margin:'0 auto', display:'flex'}}>
                    <div style={{width:'98px', height:'98px', border:'1px solid #FF7000', borderRadius:'3px', margin:'0 auto', position:'relative'}}>
                        <div style={{width:'98px', height:'69px', display:'flex'}}>
                            <label htmlFor='foto' style={{width:'30px', height:'30px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-image-plus.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', opacity:'0.5'}}></label>
                        </div>
                        <label htmlFor='foto'  style={{width:'98px', height:'98px', cursor:'pointer', borderTopLeftRadius:'3px', borderTopRightRadius:'3px', display:style.display, top:'0px', left:'0px', position:'absolute', backgroundColor:'white', backgroundImage:'url('+style.src+')', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></label>
                        <label htmlFor='foto' style={{width:'100%', height:'30px', cursor:'pointer', lineHeight:'30px', textAlign:'center', backgroundColor:'black', fontSize:'12px', opacity:'0.5', color:'white', display:'block'}}>Subir imagem</label> 
                        <input style={{display:'none'}} type="file" id="foto" accept="image/*" onChange={(e)=>{this.displayImage(e)}}/>
                    </div>                            
                </div>
                <div style={{width:'fit-content', margin:'0 auto', marginTop:'10px'}}>
                    <div style={{fontSize:'12px', color:'#444'}}><span style={{color:'#FF7000', paddingTop:'1px'}}>•</span> Deve estar nítida </div>
                    <div style={{fontSize:'12px', color:'#444'}}><span style={{color:'#FF7000', paddingTop:'1px'}}>•</span> Focar em seu rosto</div>
                    <div style={{fontSize:'12px', color:'#444'}}><span style={{color:'#FF7000', paddingTop:'1px'}}>•</span> Evitar acessórios</div>
                </div>
            </div>        
            <div style={{width:'100%', marginTop:'10px'}}>
                <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='apelido' value={this.state.apelido} placeholder='NOME FANTASIA (opcional)' onChange={(e)=>{this.inputHandler(e)}}/>
            </div>
            <div style={{width:'100%', marginTop:'10px'}}>
                <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='nascimento' value={this.state.nascimento} placeholder='DATA DE NASCIMENTO' onChange={(e)=>{this.inputHandler(e)}}/>
            </div>
            <div style={{width:'100%', marginTop:'10px'}}>
                <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='telefone2' value={this.state.telefone2} placeholder='TELEFONE' onChange={(e)=>{this.inputHandler(e)}}/>
            </div>
        </div>);
    }
    render(){
        console.log(this)
        if (this.start){
            console.log(Meteor.userId())
            this.start = false;
            if (!Meteor.userId()){ history.push('/entrar'); }
            Meteor.subscribe('userProfile', ()=>{
                let user = Profile.findOne({'_id': Meteor.userId()});
                console.log(user);
                if (!user.profile.roles){ history.push('/registrar'); }
                if (!Array.isArray(user.profile.roles)){ history.push('/registrar'); }
                let onHold = false;
                if (user.profile.roles.length == 1){
                    if (user.profile.roles[0] == 'user' ){ history.push('/entrar'); }
                }
                user.profile.roles.map(role=>{
                    if (role == 'fornecedor'){
                        if (user.funcionario.fornecedor.address){
                            history.push('/entrar');
                        }else{
                            history.push('/nova-conta/segundo-passo');
                        }
                    }
                    if (role == 'prestador'){
                        if (user.funcionario.prestador.address){
                            history.push('/entrar');
                        }else{
                            history.push('/nova-conta/segundo-passo');
                        }
                    }
                    if (role == 'on-hold'){ onHold = true; }
                });
                if (onHold == false){ history.push('/registrar'); }
            });
        }
        let selector = [
            {fontWeight:'normal', color:'#444'},
            {fontWeight:'normal', color:'#444'}
        ];
        let container = [
            {height:'0px', maxHeight:'0px', borderBottom:'0px solid #FF7000'},
            {height:'0px', maxHeight:'0px', borderBottom:'0px solid #FF7000'}
        ];
        if (this.state.fornecedor){
            selector[0] = {fontWeight:'bold', color:'#FF7000'};
            container[0] = {height:'auto', maxHeight:'300px', borderBottom:'1px solid #FF7000'};
        }else{
            selector[0] = {fontWeight:'normal', color:'#444'};
            container[0] = {height:'0px', maxHeight:'0px', borderBottom:'0px solid #FF7000'};
        }        
        if (this.state.prestador){
            selector[1] = {fontWeight:'bold', color:'#FF7000'};
            container[1] = {height:'auto', maxHeight:'725px', borderBottom:'1px solid #FF7000', overflow:'visible'};
        }else{
            selector[1] = {fontWeight:'normal', color:'#444'};
            container[1] = {height:'0px', maxHeight:'0px', borderBottom:'0px solid #FF7000', overflow:'hidden'};
        }
        var style = this.state.display;
        if (this.start){
            this.start = false;
            Slingshot.fileRestrictions('profile-pics', {
                allowedFileTypes: ['image/png', 'image/jpeg'],
                maxSize: 3 * 1024 * 1024 
            });           
        } 
        return(
        <div style={{width:'100%'}}>
            <MainHeader/>            
            <div style={{width:'100%', maxWidth:'670px', margin:'0 auto', marginTop:'40px'}}>
                <div style={{textAlign:'center', marginBottom:'60px', fontSize:'20px', fontWeight:'bold'}}>CONFIGURE SUA CONTA</div>
                <div style={{width:'100%', display:'flex'}}>
                    <CustomToggle name='fornecedor' value={this.state.fornecedor} size={1} onChange={(e)=>{this.inputHandler(e)}}/>
                    <span style={{width:'100%', paddingLeft:'6px', margin:'auto 0', fontWeight:selector[0].fontWeight, fontSize:'15px', color:selector[0].color}}>
                        Sou fornecedor de materiais de contrução
                    </span>
                </div>
                <div style={{width:'100%', maxWidth:'630px', overflow:'hidden', transition:'all 0.3s ease-in-out', maxHeight:container[0].maxHeight, borderBottom:container[0].borderBottom}}>
                    <div style={{textAlign:'center', marginTop:'30px', marginBottom:'20px', fontSize:'16px'}}>DADOS DO ESTABELECIMENTO</div>
                    <div style={{width:'100%', marginTop:'10px'}}>
                        <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='nomeLoja' value={this.state.nomeLoja} placeholder='NOME FANTASIA' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>
                    <div style={{width:'100%', marginTop:'10px', display:'flex'}}>
                        <div style={{width:'50%', paddingRight:'5px'}}>
                            <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='cnpj' value={this.state.cnpj} placeholder='CNPJ' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                        <div style={{width:'50%', paddingLeft:'5px'}}>
                            <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='telefone1' value={this.state.telefone1} placeholder='TELEFONE' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>                        
                    </div>
                    <div style={{marginTop:'15px', display:'flex', paddingBottom:'15px'}}>
                        <CustomToggle name='cpfAccept' value={this.state.cpfAccept} size={0} onChange={(e)=>{this.inputHandler(e)}}/>
                        <span style={{paddingLeft:'6px', margin:'auto 0', color:'#666', fontSize:'12px'}}>Eu afirmo ser responsável pela empresa da qual o CNPJ foi informado.</span>
                    </div>
                </div>
                {this.displayErrors(0)}
                <div style={{width:'100%', display:'flex', marginTop:'20px'}}>
                    <CustomToggle name='prestador' value={this.state.prestador} size={1} onChange={(e)=>{this.inputHandler(e)}}/>
                    <span style={{width:'100%', paddingLeft:'6px', margin:'auto 0', fontWeight:selector[1].fontWeight, fontSize:'15px', color:selector[1].color}}>
                        Sou prestador de serviço
                    </span>                    
                </div>               
                <div style={{width:'100%', paddingBottom:'20px', overflow:container[1].overflow, transition:'all 0.3s ease-in-out', maxHeight:container[1].maxHeight, borderBottom:container[1].borderBottom}}>
                    <div style={{textAlign:'center', marginTop:'30px', marginBottom:'20px', fontSize:'16px'}}>SEUS DADOS</div>
                    {this.displayForm()}
                    <div style={{width:'100%', marginTop:'10px'}}>                                                
                        {this.serviceList()}
                    </div> 
                </div>
                {this.displayErrors(1)}  
                {this.displayErrors(2)}               
                <div style={{margin:'60px auto', marginBottom:'100px', width:'220px', height:'40px', lineHeight:'40px', backgroundColor:'#3395f5', border:'2px solid #3395f5', borderRadius:'15px', textAlign:'center', fontSize:'17px', color:'white'}} onClick={()=>{this.validateInputs()}}>
                    Continuar
                </div>                
            </div>
            <Waiting open={this.state.loading} size='60px'/>            
        </div>);
    }
}
export default AccountFirstStepPage;