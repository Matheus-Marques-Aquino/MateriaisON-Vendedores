import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';
import history from './subcomponents/widgets/history';
import CustomInput from './subcomponents/widgets/customInput';
import CustomToggle from './subcomponents/widgets/customToggle';
import CustomSelect from './subcomponents/widgets/customSelect';
import VendorHeader from './subcomponents/vendorHeader';
import VendorMenu from './subcomponents/vendorMenu';

class WorkingTimePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            domingoOpen: '08:00',
            domingoClose:'18:00'
        };
    }

    inputHandler(e){
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value });
    }

    render(){
        //sem expediente
        let height = Math.round((document.querySelector('.mainContainer').clientWidth - 402) / 2.72);
        let time = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', 
        '04:30', '05:00', '05:30', '06:30', '06:00', '07:00', '07:30', '08:00', '08:30', '10:00', 
        '09:30', '10:00', '10:30' ,'11:00' , '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', 
        '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', 
        '19:30', '20:00', '20:30', '2:00', '21:30', '22:00', '22:30', '23:00', '23:30'];
        
        return(
        <div>
            <VendorHeader/>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                <VendorMenu />
                <div style={{width:'100%', backgroundColor:'white'}}>
                    <div style={{width:'100%', height:'45px', borderBottom:'1px solid #f7f7f7', backgroundColor:'#F7F7F7', display:'flex'}}>
                        <div style={{paddingLeft:'20px', margin:'auto 0', fontSize:'16px'}}>Editar Horário</div>
                        <div style={{height:'27px', width:'75px', margin:'auto 0', marginLeft:'auto', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000'}}>Salvar</div>
                        <div style={{height:'27px', width:'90px', margin:'auto 0', marginLeft:'10px', marginRight:'20px', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000'}}>Rascunho</div>
                    </div> 
                    <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                        <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                            <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                            <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Horário comercial:</div>
                        </div>
                        <div style={{width:'100%', maxWidth:'700px', lineHeight:'30px', marginLeft:'20px', marginTop:'30px', color:'#555'}}>
                            <div style={{height:'30px', padding:'7px 0', display:'flex'}}>
                                <div style={{width:'100%', minWidth:'110px', maxWidth:'150px', fontSize:'15px', fontWeight:'bold'}}>Domingo:</div>
                                <CustomSelect width='110px' height='30px' style={{maxWidth:'110px'}} start={16} select={time} name='domingoStart' onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'100%', maxWidth:'80px', fontSize:'15px', fontWeight:'bold', textAlign:'center'}}>-</div>
                                <CustomSelect width='110px' height='30px' style={{maxWidth:'110px'}} start={36} select={time} name='domingoEnd' onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{height:'100%', width:'100%', maxWidth:'40px'}}></div>
                                <CustomToggle name='cpfAccept' value={this.state.domingoOpen} size={0} onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'100%', maxWidth:'60px', marginLeft:'5px', lineHeight:'31px', fontSize:'14px', fontWeight:'bold'}}>Fechado</div>
                            </div>    
                            <div style={{height:'30px', padding:'7px 0', display:'flex'}}>
                                <div style={{width:'100%', minWidth:'110px', maxWidth:'150px', fontSize:'15px', fontWeight:'bold'}}>Segunda-feira:</div>
                                <CustomSelect width='110px' height='30px' style={{maxWidth:'110px'}} start={16} select={time} name='domingoStart' onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'100%', maxWidth:'80px', fontSize:'15px', fontWeight:'bold', textAlign:'center'}}>-</div>
                                <CustomSelect width='110px' height='30px' style={{maxWidth:'110px'}} start={36} select={time} name='domingoEnd' onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{height:'100%', width:'100%', maxWidth:'40px'}}></div>
                                <CustomToggle name='cpfAccept' value={this.state.domingoOpen} size={0} onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'100%', maxWidth:'60px', marginLeft:'5px', lineHeight:'31px', fontSize:'14px', fontWeight:'bold'}}>Fechado</div>
                            </div> 
                            <div style={{height:'30px', padding:'7px 0', display:'flex'}}>
                                <div style={{width:'100%', minWidth:'110px', maxWidth:'150px', fontSize:'15px', fontWeight:'bold'}}>Terça-feira:</div>
                                <CustomSelect width='110px' height='30px' style={{maxWidth:'110px'}} start={16} select={time} name='domingoStart' onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'100%', maxWidth:'80px', fontSize:'15px', fontWeight:'bold', textAlign:'center'}}>-</div>
                                <CustomSelect width='110px' height='30px' style={{maxWidth:'110px'}} start={36} select={time} name='domingoEnd' onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{height:'100%', width:'100%', maxWidth:'40px'}}></div>
                                <CustomToggle name='cpfAccept' value={this.state.domingoOpen} size={0} onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'100%', maxWidth:'60px', marginLeft:'5px', lineHeight:'31px', fontSize:'14px', fontWeight:'bold'}}>Fechado</div>
                            </div> 
                            <div style={{height:'30px', padding:'7px 0', display:'flex'}}>
                                <div style={{width:'100%', minWidth:'110px', maxWidth:'150px', fontSize:'15px', fontWeight:'bold'}}>Quarta-feira:</div>
                                <CustomSelect width='110px' height='30px' style={{maxWidth:'110px'}} start={16} select={time} name='domingoStart' onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'100%', maxWidth:'80px', fontSize:'15px', fontWeight:'bold', textAlign:'center'}}>-</div>
                                <CustomSelect width='110px' height='30px' style={{maxWidth:'110px'}} start={36} select={time} name='domingoEnd' onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{height:'100%', width:'100%', maxWidth:'40px'}}></div>
                                <CustomToggle name='cpfAccept' value={this.state.domingoOpen} size={0} onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'100%', maxWidth:'60px', marginLeft:'5px', lineHeight:'31px', fontSize:'14px', fontWeight:'bold'}}>Fechado</div>
                            </div> 
                            <div style={{height:'30px', padding:'7px 0', display:'flex'}}>
                                <div style={{width:'100%', minWidth:'110px', maxWidth:'150px', fontSize:'15px', fontWeight:'bold'}}>Quinta-feira:</div>
                                <CustomSelect width='110px' height='30px' style={{maxWidth:'110px'}} start={16} select={time} name='domingoStart' onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'100%', maxWidth:'80px', fontSize:'15px', fontWeight:'bold', textAlign:'center'}}>-</div>
                                <CustomSelect width='110px' height='30px' style={{maxWidth:'110px'}} start={36} select={time} name='domingoEnd' onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{height:'100%', width:'100%', maxWidth:'40px'}}></div>
                                <CustomToggle name='cpfAccept' value={this.state.domingoOpen} size={0} onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'100%', maxWidth:'60px', marginLeft:'5px', lineHeight:'31px', fontSize:'14px', fontWeight:'bold'}}>Fechado</div>
                            </div> 
                            <div style={{height:'30px', padding:'7px 0', display:'flex'}}>
                                <div style={{width:'100%', minWidth:'110px', maxWidth:'150px', fontSize:'15px', fontWeight:'bold'}}>Sexta-feira:</div>
                                <CustomSelect width='110px' height='30px' style={{maxWidth:'110px'}} start={16} select={time} name='domingoStart' onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'100%', maxWidth:'80px', fontSize:'15px', fontWeight:'bold', textAlign:'center'}}>-</div>
                                <CustomSelect width='110px' height='30px' style={{maxWidth:'110px'}} start={36} select={time} name='domingoEnd' onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{height:'100%', width:'100%', maxWidth:'40px'}}></div>
                                <CustomToggle name='cpfAccept' value={this.state.domingoOpen} size={0} onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'100%', maxWidth:'60px', marginLeft:'5px', lineHeight:'31px', fontSize:'14px', fontWeight:'bold'}}>Fechado</div>
                            </div>  
                            <div style={{height:'30px', padding:'7px 0', display:'flex'}}>
                                <div style={{width:'100%', minWidth:'110px', maxWidth:'150px', fontSize:'15px', fontWeight:'bold'}}>Sábado:</div>
                                <CustomSelect width='110px' height='30px' style={{maxWidth:'110px'}} start={16} select={time} name='domingoStart' onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'100%', maxWidth:'80px', fontSize:'15px', fontWeight:'bold', textAlign:'center'}}>-</div>
                                <CustomSelect width='110px' height='30px' style={{maxWidth:'110px'}} start={36} select={time} name='domingoEnd' onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{height:'100%', width:'100%', maxWidth:'40px'}}></div>
                                <CustomToggle name='cpfAccept' value={this.state.domingoOpen} size={0} onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'100%', maxWidth:'60px', marginLeft:'5px', lineHeight:'31px', fontSize:'14px', fontWeight:'bold'}}>Fechado</div>
                            </div>                        
                        </div>  
                    </div>
                </div>
            </div>
        </div>);
    }
}
export default WorkingTimePage;