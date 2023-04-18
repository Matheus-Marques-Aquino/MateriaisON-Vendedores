import React, { Component } from 'react';
import MainHeader from '../subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from '../subcomponents/widgets/waiting';
import history from '../subcomponents/widgets/history';
import CustomInput from '../subcomponents/widgets/customInput';
import CustomToggle from '../subcomponents/widgets/customToggle';
import { validator } from '../subcomponents/widgets/validation_helper';
import { mask } from '../subcomponents/widgets/mask';
import VendorFooter from '../subcomponents/vendor_footer';

class VendorInvitePage extends Component {
    constructor(props){
        super(props);
        this.errors = [];
        this.success = [];
        this.state = {
            nome: '',
            celular: '',
            email: '',
            loading: false
        };
    }
    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;
        if (name == 'celular'){ value = mask('phone', value) }
        this.setState({ [name]: value });
    }
    validateInputs(){
        if (this.state.loading){ return; }
        this.errors = [];
        this.success = [];
        this.setState({loading: true})
        if (!validator('nome', this.state.nome, 'nome').result){ this.errors.push(validator('nome', this.state.nome, 'nome').message); }
        if (!validator('telefone', this.state.celular, 'celular').result){ this.errors.push(validator('telefone', this.state.celular, 'celular').message); }
        if (!validator('email', this.state.email, 'e-mail').result){ this.errors.push(validator('email', this.state.nome, 'e-mail').message); }
        if (this.errors.length > 0){ 
            this.setState({ loading: false })
            return; 
        }
        this.notification();
    }
    notification(){
        this.errors = []
        let user = { 
            nome: this.state.nome,
            celular: this.state.celular,
            email: this.state.email        
        }
        Meteor.call('beOurPartner', user, (error)=>{
            if (!error){
                this.success.push('Sua mensagem foi enviada com sucesso, em breve entraremos em contato com você para mais informações.')
            }else{
                this.errors.push( error.reason );
            }
            this.setState({ loading: false });
        })
    }
    displayErrors(){        
        if (this.errors.length > 0){return(<div style={{marginTop:'10px'}}>
            {this.errors.map((error, index)=>{
                let key = 'error_'+index
                return(<div style={{color:'#FF1414', fontSize:'14px'}} key={key}>{error}</div>)
            })}
        </div>)} 
        return(<div style={{width:'100%', marginTop:'40px'}}></div>);       
    }
    displaySuccess(){        
        if (this.success.length > 0){return(<div style={{marginTop:'10px'}}>
            {this.success.map((success, index)=>{
                let key = 'successs_'+index
                return(<div style={{color:'#3BCD38', fontSize:'14px'}} key={key}>{success}</div>)
            })}
        </div>)} 
        return(<div style={{width:'100%', marginTop:'15px'}}></div>);       
    }
    render(){      
        //if (Meteor.userId()){ Meteor.logout(); } 
        let select=[{color:'#666', weight:'normal'}, {color:'#666', weight:'normal'}];
        
        if (this.state.vendor){ select[0].color = '#FF7000'; select[0].weight = 'bold' }      
        if (this.state.service){ select[1].color = '#FF7000'; select[1].weight = 'bold' }  

        return(<div style={{width:'100%'}}>
            <MainHeader/>
            <div style={{width:'100%', height:'270px', backgroundColor:'#FF7000', color:'white', display:'flex'}}>
                <div style={{minWidth:'580px', minHeight:'215px', margin:'auto', display:'flex'}}>
                    <div style={{minWidth:'110px', minHeight:'215px', marginLeft:'165px', backgroundImage:'url(/imgs/others/app_screen.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                    <div style={{minWidth:'445px', paddingLeft:'40px', display:'flex'}}>
                        <div style={{height:'fit-content', margin:'auto 0'}}>
                            <div style={{fontSize:'33px', fontWeight:'200', paddingBottom:'15px'}}>Quer lucrar mais?</div>
                            <div style={{fontSize:'15px', fontWeight:'200', maxWidth:'500px'}}>
                            A <b>MateriaisON</b> é uma startup de marketplace desenvolvida para ajudar os pequenos e médios negócios a aumentar suas vendas. 
                            Oferecemos uma plataforma completa para que você crie sua loja virtual e expanda seu negócio vendendo mais.
                            </div>
                            <div style={{width:'fit-content', padding:'10px 20px', marginTop:'20px', marginBottom:'5px', borderRadius:'8px', backgroundColor:'white', color:'#1C2F59', cursor:'pointer'}} 
                            onClick={()=>{
                                document.body.scrollTop = 900;
                                document.documentElement.scrollTop = 900;
                            }}>
                                QUERO VENDER MAIS
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
            <div style={{width:'100%', height:'290px', borderBottom:'1px solid #FF700060', color:'black', display:'flex'}}>
                <div style={{width:'fit-content', height:'fit-content', margin:'auto', display:'flex'}}>
                    <div style={{width:'240px', height:'290px', backgroundImage:'url(/imgs/others/people_chart.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                    <div style={{width:'535px', height:'fit-content', maxWidth:'680px', paddingTop:'30px', margin:'auto 0', marginLeft:'60px', fontSize:'30px', fontWeight:'200', textAlign:'center'}}>
                    Um site e aplicativo para conectar você a novos clientes e prestadores de serviços, todo dia.
                    </div>
                </div>                
            </div>
            <div style={{width:'fit-content', margin:'0 auto', marginTop:'20px', fontSize:'25px', fontWeight:'200', color:'#555'}}>
            Com a gente você:
            </div>
            <div style={{width:'100%', height:'180px', borderBottom:'1px solid #FF700060', display:'flex'}}>
                <div style={{width:'fit-content', height:'fit-content', margin:'0 auto', display:'flex', fontSize:'12px', color:'#555'}}>
                    <div style={{width:'170px', height:'180px', display:'flex'}}>
                        <div style={{margin:'auto', paddingTop:'40px'}}>Reduz seus custos</div>
                    </div>
                    <div style={{width:'120px', height:'180px', display:'flex'}}>
                        <div style={{width:'100px', height:'180px', maxHeight:'180px', margin:'auto', backgroundImage:'url(/imgs/others/pig_bank.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                    </div>
                    <div style={{width:'190px', height:'180px', display:'flex'}}>
                        <div style={{width:'1750px', margin:'auto', paddingTop:'40px', textAlign:'center'}}>Acelera o crescimento da sua empresa alavancando<br/>suas vendas</div>
                    </div>
                    <div style={{width:'120px', height:'180px', display:'flex'}}>
                        <div style={{width:'100px', height:'180px', maxHeight:'180px', margin:'auto', backgroundImage:'url(/imgs/others/graph_bar.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                    </div>                    
                    <div style={{width:'190px', height:'180px', display:'flex'}}>
                        <div style={{width:'1700px', margin:'auto', paddingTop:'40px', textAlign:'center'}}>Amplia sua rede de contatos e torna-se cada vez mais conhecido pelo público</div>  
                    </div>
                </div>                
            </div>
            <div style={{width:'100%', margin:'0 auto', maxWidth:'500px'}}>
                <div style={{width:'100%', marginTop:'40px'}}>
                    <div style={{textAlign:'center', marginBottom:'40px', fontSize:'20px', color:'#FF7000'}}>VENHA SER NOSSO PARCEIRO</div>
                    <div style={{display:'flex'}}>
                        <div style={{width:'50%', paddingRight:'5px'}}>
                            <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='nome' value={this.state.nome} placeholder='NOME COMPLETO' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                        <div style={{width:'50%', paddingLeft:'5px'}}>
                            <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='celular' value={this.state.celular} placeholder='CELULAR' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                    </div>                    
                    <div style={{marginTop:'15px'}}>
                        <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='email' value={this.state.email} placeholder='E-MAIL' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>                 
                    {this.displayErrors()}
                    {this.displaySuccess()}
                    <div style={{width:'fit-content', padding:'10px 20px', margin:'0 auto', backgroundColor:'#FF7000', borderRadius:'8px', textAlign:'center', fontSize:'17px', fontWeight:'200', color:'white', cursor:'pointer'}} onClick={()=>{this.validateInputs()}}>
                        ENTRAR EM CONTATO
                    </div>                    
                </div>                
            </div>
            <VendorFooter />
            <Waiting open={this.state.loading} size='50px'/>
        </div>);
    }
}
export default VendorInvitePage;