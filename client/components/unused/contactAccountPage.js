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

class ContactAccountPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            result: '',
            mensagem: {value: '', text:'white', background:'transparant', border:'white', input:'whiteInput'}
        };
    }
    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;
        let input = this.state[name];        
        input.value = value; 
        if (input.value.length != 0){
            input.input = 'whiteInput'; 
            input.background ='white';
            input.text = 'black';
            input.border = 'white';
        }else{
            input.border = 'white';
            input.input = 'whiteInput';
            input.background ='transparent';
        }               
        this.setState({ [name]: input });
    }    
    render(){
        let display = 'none'
        if (this.state.result.length > 0){ display = 'block'; }
        return(
        <div>
            <VendorHeader/>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                <VendorMenu />
                <div style={{width:'100%', backgroundColor:'white'}}>
                    <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                        <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                            <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                            <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Entre em contato:</div>
                        </div>
                        <div style={{width:'100%', maxWidth:'570px', margin:'0 auto', marginTop:'30px'}}>
                            <div style={{margin:'35px 20px', marginBottom:'0px', padding:'15px 20px', border:'1px solid #ff7000', borderBottom:'0px', backgroundColor:'white'}}>
                                <div style={{fontSize:'13px', lineHeight:'16px', color:'#444', position:'relative'}}>
                                    Entre em contato através das nossas centrais de atendimento ou redes sociais:
                                    <div style={{width:'15px', height:'15px', position:'absolute',top:'0px', left:'0px', backgroundImage:'url(/imgs/icons/icon-info.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                </div>              
                                <div style={{marginTop:'17px', fontSize:'14px', color:'#444', lineHeight:'22px'}}>
                                    <div style={{width:'fit-content', margin:'0 auto', display:'flex'}}><div style={{width:'16px', height:'16px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-whatsapp.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>(11) 93289-7996</div>
                                    <div style={{width:'fit-content', margin:'0 auto', display:'flex'}}><div style={{width:'16px', height:'16px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-telefone.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>(11) 4226-7099</div>
                                    <div style={{width:'fit-content', margin:'0 auto', display:'flex'}}><div style={{width:'16px', height:'16px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-telefone.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>(11) 4318-7223</div>    
                                </div> 
                                <div style={{marginTop:'12px', padding:'10px 0', lineHeight:'18px', borderTop:'1px solid #FFDBBF', borderBottom:'1px solid #FFDBBF', fontSize:'16px', color:'#444'}}>
                                    <div style={{width:'fit-content', display:'flex', margin:'0 auto'}}>
                                        <div style={{width:'19px', height:'19px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-email.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                        <div>contato@materiaison.com</div>
                                    </div>    
                                </div>
                                <div style={{marginTop:'8px', fontSize:'15px', color:'#444'}}>
                                    <div style={{width:'fit-content', margin:'0 auto', display:'flex'}}>
                                        <div style={{width:'18px', height:'18px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-facebook.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                        <div>materiaison.online</div>
                                    </div>
                                    <div style={{width:'fit-content', margin:'0 auto', marginTop:'8px', display:'flex'}}>
                                        <div style={{width:'18px', height:'18px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-instagram.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                        <div>_materiaison</div>
                                    </div>    
                                </div>
                            </div>    
                            <div style={{margin:'20px', marginTop:'0px',  backgroundColor:'#ff7000'}}>
                                <div style={{height:'39px', backgroundImage:'url(/imgs/whiteDownArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                <div style={{margin:'20px'}}>
                                    <div style={{fontSize:'18px', textAlign:'center', color:'white'}}>
                                        Fale diretamente conosco:
                                    </div>
                                    <div style={{marginTop:'35px', padding:'0 20px'}}>                                                                
                                        <div style={{height:'120px', marginTop:'5px', backgroundColor:this.state.mensagem.background, border:'1px solid '+this.state.mensagem.border, borderRadius:'3px'}}>
                                            <textarea className={this.state.mensagem.input} id='mensagem' style={{width:'100%', height:'120px', padding:'5px', border:'0px', borderRadius:'3px', fontSize:'14px', color:this.state.mensagem.text, color:this.state.mensagem.text, resize:'none', boxSizing: 'border-box'}} value={this.state.mensagem.value} onChange={this.inputHandler.bind(this)} placeholder='MENSAGEM' name='mensagem' onKeyDown={(e)=>{if (e.key==='Enter'){}}}/>
                                        </div>
                                        <div style={{fontSize:'13px', paddingTop:'15px', color:'white', display: display}}>{this.state.result}</div>
                                        <div style={{paddingTop:'25px', paddingBottom:'25px'}}>
                                            <div style={{width:'fit-content', margin:'0 auto', padding:'7px 14px', fontSize:'14px', backgroundColor:'white', borderRadius:'20px', color:'#ff7000'}} onClick={()=>{this.validateInputs()}}>ENVIAR</div>
                                        </div>
                                    </div>
                                </div>
                            </div>                            
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}
export default ContactAccountPage;