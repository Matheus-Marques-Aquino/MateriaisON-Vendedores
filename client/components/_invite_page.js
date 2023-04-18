import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';
import history from './subcomponents/widgets/history';
import CustomInput from './subcomponents/widgets/customInput';
import { validator } from './subcomponents/widgets/validation_helper';
import { mask } from './subcomponents/widgets/mask';
import VendorFooter from './subcomponents/vendor_footer';

class InvitePage extends Component {
    constructor(props){
        super(props);
        this.start = true;
        this.errors = [];
        this.success = [];
        this.state = {
            nome: '',
            celular: '',
            email: '',
            slider: 0,
            loading: false,
            screenSize: Math.round(document.querySelector('.mainContainer').clientWidth)
        };
    }
    handleResize = () => {
        this.setState({ screenSize: window.innerWidth });
    }
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize)
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this.handleResize)
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
        if (this.state.loading){ return; }
        this.setState({ loading: true });
        let user = { 
            nome: this.state.nome,
            celular: this.state.celular,
            email: this.state.email        
        }
        Meteor.call('joinOurTeam', user, (error)=>{
            if (!error){
                this.success.push('Sua mensagem foi enviada com sucesso, em breve entraremos em contato com você para mais informações.');
                this.setState({ loading: false });
            }else{
                this.errors.push( error.reason );
                this.setState({ loading: false });
            }
            
        })
    }
    displayErrors(){        
        if (this.errors.length > 0){return(<div style={{marginTop:'10px'}}>
            {this.errors.map((error, index)=>{
                let key = 'error_'+index
                return(<div style={{color:'#FF1414', fontSize:'14px'}} key={key}>{error}</div>)
            })}
        </div>)} 
        return(<div style={{width:'100%', marginTop:'20px'}}></div>);       
    }
    displaySuccess(){        
        if (this.success.length > 0){return(<div style={{marginTop:'10px'}}>
            {this.success.map((success, index)=>{
                let key = 'successs_'+index
                return(<div style={{color:'#3BCD38', fontSize:'14px', marginBottom:'20px'}} key={key}>{success}</div>)
            })}
        </div>)} 
        return(<div style={{width:'100%', marginTop:'20px'}}></div>);       
    }
    returnSliderText(){
        let slider = this.state.slider;
        let text = [
            'Você faz seu cadastro e nós entramos em contato para finalizar a parceria.',
            'Você cria e adiciona seus produtos em sua loja dentro da plataforma.',
            'Você recebe os pedidos e aumenta os lucros de suas vendas.'
        ]
        let width = ['110px', '110px', '90px']
        return{width: width[slider], text: text[slider]};
    }
    render(){      
        if (this.start){
            this.start = false;
            window.onbeforeunload = function(){ window.scrollTo(0,0); };      
        }                
        let select=[{color:'#666', weight:'normal'}, {color:'#666', weight:'normal'}]; 
        let slider = this.state.slider;
        let bannerWidth = this.state.screenSize / 2 * 0.8;
        let bannerHeight = Math.ceil(bannerWidth * 0.736);
        if (Meteor.userId()){ Meteor.logout(); }          
        if (this.state.vendor){ select[0].color = '#FF7000'; select[0].weight = 'bold' }      
        if (this.state.service){ select[1].color = '#FF7000'; select[1].weight = 'bold' }  
        
        return(<div className='mainContainer' style={{width:'100%'}}>
            <MainHeader/>
            <div style={{width:'100%', minHeight:'270px', backgroundColor:'#FF7000', color:'white', display:'flex'}}>
                <div className='InvitePage_profitDiv' style={{minWidth:'300px', padding:'0 15px', minHeight:'215px', margin:'auto', display:'flex'}}>
                    <div className='InvitePage_appScreen'style={{minWidth:'100px', minHeight:'215px', marginLeft:'200px', marginRight:'20px', backgroundImage:'url(/imgs/others/app_screen.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                    <div style={{minWidth:'280px', display:'flex'}}>
                        <div style={{height:'fit-content', margin:'auto 0'}}>
                            <div className='InvitePage_profitTitle' style={{fontSize:'33px', fontWeight:'200', paddingBottom:'15px'}}>Quer lucrar mais?</div>
                            <div className='InvitePage_profitText' style={{fontSize:'15px', fontWeight:'200', maxWidth:'500px', textAlign:'left'}}>
                            A <b>MateriaisON</b> é uma startup de marketplace desenvolvida para ajudar os pequenos e médios negócios a aumentar suas vendas. 
                            Oferecemos uma plataforma completa para que você crie sua loja virtual e expanda seu negócio vendendo mais.
                            </div>
                                <div style={{width:'100%', height:'fit-content'}}>
                                    <div className='InvitePage_profitButton' style={{width:'fit-content', padding:'10px 20px', margin:'20px 0px 5px 0px', borderRadius:'8px', backgroundColor:'white', color:'#1C2F59', cursor:'pointer'}} 
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
            </div>
            <div style={{width:'100%', height:'185px', paddingTop:'15px', backgroundColor:'#F2F2F2', position:'relative'}}>
                <div style={{width:'635px', height:'185px', position:'relative', margin:'0 auto'}}>
                    <div style={{width:'540px', height:'185px', backgroundColor:'white', display:'flex', position:'absolute', left:'35px', top:'0px'}}></div>
                    <div style={{width:'96px', height:'185px', backgroundImage:'url(/imgs/others/inviteBanner2.png)', backgroundSize:'contain', backgroundPosition:'right center', backgroundRepeat:'no-repeat', display:'flex', position:'absolute', left:'575px', top:'0px'}}></div>
                    <div style={{width:'fit-contet', height:'185px', maxWidth:'550px', display:'flex', position:'absolute', left:'35px', top:'0px'}}>                
                        <img src='/imgs/others/inviteBanner.png' height='185px'/>
                        <div style={{width:'285px', height:'fit-content', margin:'auto 0'}}>
                            <div style={{width:'fit-content', height:'fit-content'}}>
                                <div style={{fontSize:'23px', paddingBottom:'5px', color:'#FF7000', textAlign:'right'}}>A SOLUÇÃO PARA VOCÊ!</div>
                                <div style={{fontSize:'16px', color:'#333', textAlign:'right'}}>Um aplicativo criado para conectar você a novos clientes, todo dia</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{width:'100%', height:'fit-content', backgroundColor:'#F2F2F2'}}>                
                <div style={{width:'100%', height:'100px', display:'flex'}}>
                    <div style={{width:'fit-content', height:'fit-content', margin:'auto', fontSize:'35px', fontWeight:'200', color:'black'}}>
                        Como funciona?
                    </div>
                </div>
                <div style={{width:'100%', height:'fit-content', paddingBottom:'40px', display:'flex'}}>
                    <div className='InvitePage_steps' style={{minWidth:'485px', margin:'0 auto', display:'flex'}}>                    
                        <div style={{width:'155px', height:'256px', backgroundImage:'url(/imgs/others/step1.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', display:'flex'}}>
                            <div style={{width:'110px', height:'fit-content', lineHeight:'18px', paddingTop:'90px', margin:'0 auto', fontSize:'14px', fontWeight:'nomal',textAlign:'center', color:'#555'}}>
                                Você faz seu cadastro e nós entramos em contato para finalizar a parceria.
                            </div>
                        </div> 
                        <div style={{width:'155px', height:'256px', margin:'0 40px', backgroundImage:'url(/imgs/others/step2.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', display:'flex'}}>
                            <div style={{width:'110px', height:'fit-content', lineHeight:'18px', paddingTop:'90px', margin:'0 auto', fontSize:'14px', fontWeight:'nomal',textAlign:'center', color:'#555'}}>
                                Você cria e adiciona seus produtos em sua loja dentro da plataforma.
                            </div>
                        </div> 
                        <div style={{width:'155px', height:'256px', backgroundImage:'url(/imgs/others/step3.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', display:'flex'}}>
                            <div style={{width:'90px', height:'fit-content', lineHeight:'18px', paddingTop:'90px', margin:'0 auto', fontSize:'14px', fontWeight:'nomal',textAlign:'center', color:'#555'}}>
                                Você recebe os pedidos e aumenta os lucros de suas vendas.
                            </div>
                        </div> 
                    </div>                     
                </div>
                <div className='InvitePage_steps2' style={{width:'100%', height:'fit-content', paddingBottom:'20px', display:'none'}}>
                    <div style={{minWidth:'280px', margin:'0 auto', display:'flex'}}>
                    <div style={{width:'50px', height:'50px', margin:'auto 0', marginLeft:'auto', marginRight:'20px', backgroundImage:(slider == 0) ? 'url()' : 'url(/imgs/icons/icon-leftArrowWhite.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:(slider != 0) ? 'pointer' : 'default'}} onClick={()=>{if (slider != 0){ this.setState({ slider: this.state.slider - 1 })}}}></div>
                        <div style={{display:(slider == 0) ? 'flex' : 'none', width:'155px', height:'256px', backgroundImage:'url(/imgs/others/step1.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}>
                            <div style={{width:this.returnSliderText().width, height:'fit-content', lineHeight:'18px', paddingTop:'90px', margin:'0 auto', fontSize:'14px', fontWeight:'nomal',textAlign:'center', color:'#555'}}>
                                {this.returnSliderText().text}
                            </div>
                        </div> 
                        <div style={{display:(slider == 1) ? 'flex' : 'none', width:'155px', height:'256px', backgroundImage:'url(/imgs/others/step2.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}>
                            <div style={{width:this.returnSliderText().width, height:'fit-content', lineHeight:'18px', paddingTop:'90px', margin:'0 auto', fontSize:'14px', fontWeight:'nomal',textAlign:'center', color:'#555'}}>
                                {this.returnSliderText().text}
                            </div>
                        </div> 
                        <div style={{display:(slider == 2) ? 'flex' : 'none', width:'155px', height:'256px', backgroundImage:'url(/imgs/others/step3.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}>
                            <div style={{width:this.returnSliderText().width, height:'fit-content', lineHeight:'18px', paddingTop:'90px', margin:'0 auto', fontSize:'14px', fontWeight:'nomal',textAlign:'center', color:'#555'}}>
                                {this.returnSliderText().text}
                            </div>
                        </div> 
                        <div style={{width:'50px', height:'50px', margin:'auto 0', marginRight:'auto', marginLeft:'20px', backgroundImage:(slider == 2) ? 'url()' : 'url(/imgs/icons/icon-rightArrowWhite.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:(slider != 2) ? 'pointer' : 'deafult'}} onClick={()=>{if (slider != 2){ this.setState({ slider: this.state.slider + 1 })}}}></div>                     
                    </div>                    
                </div>
                <div className='InvitePage_steps2' style={{width:'100%', maxWidth:'120px', paddingBottom:'20px', height:'fit-contet', margin:'auto', display:'none'}}>
                    <div style={{width:'10px', height:'10px', borderRadius:'50%', backgroundColor:(slider == 0) ? '#FFF' : '#CCC', margin:'0 8px', marginLeft:'auto', cursor:'pointer'}} onClick={()=>{if (slider != 1){ this.setState({ slider: 1 })}}}></div>
                    <div style={{width:'10px', height:'10px', borderRadius:'50%', backgroundColor:(slider == 1) ? '#FFF' : '#CCC', margin:'0 8px', cursor:'pointer'}} onClick={()=>{if (slider != 1){ this.setState({ slider: 1 })}}}></div>
                    <div style={{width:'10px', height:'10px', borderRadius:'50%', backgroundColor:(slider == 2) ? '#FFF' : '#CCC', margin:'0 8px', marginRight:'auto', cursor:'pointer'}} onClick={()=>{if (slider != 2){ this.setState({ slider: 2 })}}}></div>
                </div>
            </div>
            <div className='InvitePage_steps2' style={{width:'100%', height:'290px', borderBottom:'1px solid #FF700060', color:'black', display:'flex'}}>
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
            <div style={{width: '100%', height:'180px', borderBottom:'1px solid #FF700060', display:'flex'}}>
                <div style={{width:'fit-content', height:'fit-content', margin:'0 auto', display:'flex', fontSize:'12px', color:'#555'}}>
                    <div style={{width:'170px', height:'180px', display:'flex'}}>
                        <div style={{margin:'auto', paddingTop:'40px'}}>Reduz seus custos</div>
                    </div>
                    <div style={{width:'120px', height:'180px', display:'flex'}}>
                        <div style={{width:'100px', height:'180px', maxHeight:'180px', margin:'auto', backgroundImage: 'url(/imgs/others/pig_bank.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
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
                <div style={{width:'auto', marginTop:'40px', padding:'0 10px'}}>
                    <div className='InvitePage_formTitle' style={{textAlign:'center', marginBottom:'25px', fontSize:'20px', color:'#FF7000'}}>VENHA SER NOSSO PARCEIRO</div>
                    <div className='InvitePage_formDiv' style={{display:'flex'}}>
                        <div className='InvitePage_nameDiv' style={{width:'50%', padding:'0 5px', marginTop:'15px'}}>
                            <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='nome' value={this.state.nome} placeholder='NOME COMPLETO' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                        <div className='InvitePage_phoneDiv' style={{width:'50%', padding:'0 5px', marginTop:'15px'}}>
                            <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='celular' value={this.state.celular} placeholder='CELULAR' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                    </div>                    
                    <div className='InvitePage_emailDiv' style={{marginTop:'20px', padding:'0 5px'}}>
                        <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='email' value={this.state.email} placeholder='E-MAIL' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>                 
                    {this.displayErrors()}
                    {this.displaySuccess()}
                    <div className='InvitePage_sendDiv' style={{width:'fit-content', padding:'10px 20px', margin:'0 auto', marginTop:'35px', backgroundColor:'#FF7000', borderRadius:'8px', textAlign:'center', fontSize:'17px', fontWeight:'200', color:'white', cursor:'pointer'}} onClick={()=>{this.validateInputs()}}>
                        CADASTRAR
                    </div>                    
                </div>                
            </div>
            <VendorFooter />
            <Waiting open={this.state.loading} size='50px'/>            
        </div>);
    }
}
export default InvitePage;