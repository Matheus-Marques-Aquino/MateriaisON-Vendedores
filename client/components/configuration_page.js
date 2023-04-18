import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import { Profile } from '../../imports/collections/profile';
import Waiting from './subcomponents/widgets/waiting';
import history from './subcomponents/widgets/history';
import CustomInput from './subcomponents/widgets/customInput';
import CustomToggle from './subcomponents/widgets/customToggle';
import CustomSelect from './subcomponents/widgets/customSelect';
import VendorHeader from './subcomponents/vendor_header';
import VendorMenu from './subcomponents/vendorMenu';

class ConfigurationPage extends Component {
    constructor(props){
        super(props);
        this.errors = [];
        this.success = [];
        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            displayPassword: [false, false, false],
            loading: true
        };
    }
    componentWillMount(){
        if (Meteor.userId()){
            Meteor.subscribe('ProfileSettings', ()=>{
                let user = Meteor.users.findOne({'_id': Meteor.userId()});
                let pack = {};
                if (!user){ Meteor.logout(); history.push('/entrar'); return; }
                if (!user.profile){ Meteor.logout(); history.push('/entrar'); return; }
                if (!user.profile.roles){ Meteor.logout(); history.push('/entrar'); return; }
                if (!user.profile.roles.includes('vendor') && !user.profile.roles.includes('service')){
                    Meteor.logout(); 
                    history.push('/entrar'); 
                    return;
                }
                console.log(user)
                pack.email = user.username;
                if (!pack.email){ Meteor.logout(); history.push('/entrar'); return; }                
                pack.name = user.profile.fullName;
                if (!pack.name){
                    pack.name = user.profile.firstName;
                    if (!pack.name){ 
                        pack.name = user.profile.name;
                        if (!pack.name){ Meteor.logout(); history.push('/entrar'); return; }
                    }                    
                }
                pack.name = pack.name.trim(); 
                if (user.profile.lastName && !user.profile.fullName){ 
                    user.profile.lastName = user.profile.lastName.trim();
                    pack.name += ' ' + user.profile.lastName;
                }
                if (user.profile.birthday){ pack.birthday = user.profile.birthday; }
                if (user.profile.cpfCnpj){
                    if (user.profile.cpfCnpj.length == 14){ pack.cpf = user.profile.cpf; }
                    if (user.profile.cpfCnpj.length == 18){ pack.cnpj = user.profile.cnpj; }
                }
                if (user.profile.cpf){ pack.cpf = user.profile.cpf; }
                if (user.profile.cnpj){ pack.cnpj = user.profile.cnpj; }

                this.setState({loading: false, user: pack});
            });
        }
    }
    inputHandler(e){
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value });
    }
    displayErrors(){
        if (!this.errors.length > 0)return(<div></div>);
        return(<div style={{width:'fit-content', padding:'10px 0 10px 23px', color:'#FF1414', fontSize:'14px'}}>{
            this.errors.map((error, index)=>{
                let key = 'Error_' + index;
                return(<div key={key}>{error}</div>)
            })
        }</div>);
    }
    displaySuccess(){
        if (!this.success.length > 0)return(<div></div>);
        return(<div style={{width:'fit-content', padding:'10px 0 10px 23px', color:'#3BCD38', fontSize:'14px'}}>{
            this.success.map((_success, index)=>{
                let key = 'Success_' + index;
                return(<div key={key}>{_success}</div>)
            })
        }</div>);
    }
    changePassword(){
        if (this.state.loading){ return; }
        this.setState({loading: true});  
        this.errors = [];
        this.success = [];
        if (this.state.newPassword != this.state.confirmPassword){ this.errors.push('Sua nova senha e a confirmação da mesma não estão iguais.'); }
        if (!this.state.newPassword.length > 7 ){ this.errors.push('Sua nova senha deve ter ao menos 8 caracteres.'); }
        if (!this.state.oldPassword > 0){ this.errors.push('Você deve preecher o campo indicado com sua senha atual para que ela possa ser alterada.'); }
        if (this.errors.length > 0){ this.setState({loading: false}); return; }              
        let password = this.state.oldPassword;
        let encrypt = Package.sha.SHA256(password);
        password = this.state.newPassword;        
        Meteor.call('profile.internChangePassword', encrypt, password, (error, result)=>{
            if (error){
                console.log(error);
                this.errors.push(error.reason);
            }else{
                this.success.push('Sua senha foi alterada com sucesso!')
            }
            this.setState({loading: false});
        });
        console.log(encrypt)
    }
    render(){//dados do proprietario
        let password = [{title: '', type: 'password'}, {title: '', type: 'password'}, {title: '', type: 'password'}];
        this.state.displayPassword.map((display, index)=>{
            if (display){ password[index] = {title: 'Ocultar senha', type: 'text'};  }else{ password[index] = {title: 'Mostrar senha', type: 'password'}; }
        });
        if (this.state.loading){
            return(
            <div>
                <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                    <VendorMenu />
                </div>
                <Waiting open={this.state.loading} size='60px'/>
            </div>)
        }
        return(
            <div>
                <VendorHeader/>
                <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                    <VendorMenu />
                    <div style={{width:'100%', backgroundColor:'white'}}>
                        <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                            <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                                <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Configurações da conta:</div>
                            </div>
                            <div style={{margin:'20px 20px 0px 20px', padding:'10px 15px', borderRadius:'3px', color:'#444', backgroundColor:'#F7F7F7', fontWeight:'bold'}}>
                                <div>Dados do proprietário:</div>
                            <div style={{marginTop:'30px', paddingBottom:'10px', fontSize:'15px', color:'#444', display:'flex'}}>
                                <div style={{minWidth:'145px', textAlign:'right', marginRight:'20px', marginLeft:'10px'}}>
                                    <div style={{height:'30px', lineHeight:'30px', margin:'5px 0', fontWeight:'normal'}}>
                                        Nome completo:
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', margin:'5px 0', fontWeight:'normal', display:(this.state.user.birthday) ? 'block' : 'none'}}>
                                        Data de nascimento:
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', margin:'5px 0', fontWeight:'normal', display:(this.state.user.cpf) ? 'block' : 'none'}}>
                                        CPF:
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', margin:'5px 0', fontWeight:'normal', display:(this.state.user.cnpj) ? 'block' : 'none'}}>
                                        CNPJ:
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', margin:'5px 0', fontWeight:'normal'}}>
                                        Endereço de e-mail:
                                    </div>
                                </div>
                                <div>
                                    <div style={{width:'350px', height:'28px', padding: '0 0 0 15px', margin:'5px 0', lineHeight:'30px', border:'1px solid #FF7000AA', borderRadius:'3px', backgroundColor:'#DFDFDF50', fontWeight:'300', color:'black'}}>
                                        {this.state.user.name}
                                    </div>
                                    <div style={{width:'350px', height:'28px', padding: '0 0 0 15px', margin:'5px 0', lineHeight:'30px', border:'1px solid #FF7000AA', borderRadius:'3px', backgroundColor:'#DFDFDF50', fontWeight:'300', color:'black', display:(this.state.user.birthday) ? 'block' : 'none'}}>
                                        {this.state.user.birthday}
                                    </div>
                                    <div style={{width:'350px', height:'28px', padding: '0 0 0 15px', margin:'5px 0', lineHeight:'30px', border:'1px solid #FF7000AA', borderRadius:'3px', backgroundColor:'#DFDFDF50', fontWeight:'300', color:'black', display:(this.state.user.cpf) ? 'block' : 'none'}}>
                                        {this.state.user.cpf}
                                    </div>
                                    <div style={{width:'350px', height:'28px', padding: '0 0 0 15px', margin:'5px 0', lineHeight:'30px', border:'1px solid #FF7000AA', borderRadius:'3px', backgroundColor:'#DFDFDF50', fontWeight:'300', color:'black', display:(this.state.user.cnpj) ? 'block' : 'none'}}>
                                        {this.state.user.cnpj}
                                    </div>
                                    <div style={{width:'350px', height:'28px', padding: '0 0 0 15px', margin:'5px 0', lineHeight:'30px', border:'1px solid #FF7000AA', borderRadius:'3px', backgroundColor:'#DFDFDF50', fontWeight:'300', color:'black'}}>
                                        {this.state.user.email}
                                    </div>
                                </div>
                            </div>
                            <div style={{width:'538px', height:'fit-content', marginTop:'30px', borderRadius:'5px', border:'1px solid #CCC', position:'relative'}}>
                                <div style={{width:'155px', height:'fit-contend', textAlign:'center', backgroundColor:'#F7F7F7', position:'absolute', top:'-10px', left:'10px', fontWeight:'bold'}}>Alteração da senha</div>
                                <div style={{display:'flex', marginLeft:'20px', marginTop:'20px'}}>
                                    <div style={{width:'135px', marginRight:'20px', textAlign:'right'}}>
                                        <div style={{height:'30px', lineHeight:'30px', margin:'15px 0', fontWeight:'normal'}}>
                                            Senha atual:
                                        </div>
                                        <div style={{height:'30px', lineHeight:'30px', margin:'15px 0', fontWeight:'normal'}}>
                                            Nova senha:
                                        </div>
                                        <div style={{height:'30px', lineHeight:'30px', margin:'15px 0', fontWeight:'normal'}}>
                                            Confirmar senha:
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{width:'365px', height:'30px', margin:'15px 0', display:'flex'}}>
                                            <div style={{width:'297px', height:'28px', padding: '0 0 0 15px', lineHeight:'30px', border:'1px solid #FF7000AA', borderRadius:'3px', backgroundColor:'#FFF', fontWeight:'300'}}>
                                                <input type={password[0].type} style={{width:'100%', height:'100%', padding:'0px', border:'0px', display:'block', backgroundColor:'transparent'}} name='oldPassword' value={this.state.oldPassword} onChange={(e)=>{ this.inputHandler(e) }}/>
                                            </div>
                                            <div title={password[0].title} style={{width:'30px', height:'30px', margin:'0 0 0 10px', backgroundImage:(!this.state.displayPassword[0]) ? 'url(/imgs/icons/icon-lockEye.png)' : 'url(/imgs/icons/icon-unlockEye.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{let state = this.state.displayPassword; state[0] = !state[0]; this.setState({displayPassword: state});}}></div>
                                        </div>
                                        <div style={{width:'365px', height:'30px', margin:'15px 0', display:'flex'}}>
                                            <div style={{width:'297px', height:'28px', padding: '0 0 0 15px', lineHeight:'30px', border:'1px solid #FF7000AA', borderRadius:'3px', fontWeight:'300'}}>
                                                <input type={password[1].type} style={{width:'100%', height:'100%', padding:'0px', border:'0px', display:'block', backgroundColor:'transparent'}} name='newPassword' value={this.state.newPassword} onChange={(e)=>{ this.inputHandler(e) }}/>
                                            </div>
                                            <div title={password[1].title} type={password[1].type} style={{width:'30px', height:'30px', margin:'0 0 0 10px', backgroundImage:(!this.state.displayPassword[1]) ? 'url(/imgs/icons/icon-lockEye.png)' : 'url(/imgs/icons/icon-unlockEye.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{let state = this.state.displayPassword; state[1] = !state[1]; this.setState({displayPassword: state});}}></div>
                                        </div>
                                        <div style={{width:'365px', height:'30px', margin:'15px 0', display:'flex'}}>
                                            <div style={{width:'297px', height:'28px', padding: '0 0 0 15px', lineHeight:'30px', border:'1px solid #FF7000AA', borderRadius:'3px', fontWeight:'300'}}>
                                                <input type={password[2].type} style={{width:'100%', height:'100%', padding:'0px', border:'0px', display:'block', backgroundColor:'transparent'}} name='confirmPassword' value={this.state.confirmPassword} onChange={(e)=>{ this.inputHandler(e) }}/>
                                            </div>
                                            <div title={password[2].title} type={password[2].type} style={{width:'30px', height:'30px', margin:'0 0 0 10px', backgroundImage:(!this.state.displayPassword[2]) ? 'url(/imgs/icons/icon-lockEye.png)' : 'url(/imgs/icons/icon-unlockEye.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{let state = this.state.displayPassword; state[2] = !state[2]; this.setState({displayPassword: state});}}></div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{width:'fit-content', padding:'8px 48px', margin:'10px auto 20px auto', fontSize:'15px', borderRadius:'10px', color:'#FFF', textAlign:'center', fontWeight:'300', backgroundColor:'#FF7000', cursor:'pointer'}} onClick={()=>{this.changePassword()}}>ALTERAR SENHA</div>
                                {this.displayErrors()}
                                {this.displaySuccess()}
                            </div>
                        </div>
                    </div>
                </div>
                <Waiting open={this.state.loading} size='60px'/>
            </div>
        </div>)    
    }
}
export default ConfigurationPage;