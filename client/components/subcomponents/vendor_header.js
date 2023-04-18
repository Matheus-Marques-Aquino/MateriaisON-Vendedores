import React, { Component } from 'react';
import history from './widgets/history';
import windowResize from 'window-resize';

class VendorHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
            display: 'none',
            w: Math.round(document.querySelector('.mainContainer').clientWidth),
            img_url: '/imgs/icons/icon-perfil.png'
        }   
    }
    popMenu(){
        if (this.state.display == 'none'){
            this.setState({ display: 'block' });
            return;
        }
        this.setState({ display: 'none' });
    }
    handleResize = () => {
        this.setState({ w: window.innerWidth });
    }
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize)
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this.handleResize)
    }
    render(){
        let totalWidth = Math.round(this.state.w - 260).toString()+'px';
        let img_url = this.state.img_url;
        let page = history.location.pathname;
        return(
        <div style={{width:'100%', display:'flex', position:'relative', left:'0', top:'0'}}>
            <div style={{width:'100%', height:'65px', borderBottom:'1px solid #FF7000', display:'flex'}}>
                <div style={{width:'227px', height:'65px', backgroundColor:'#FF7000', display:'flex'}}>
                    <div style={{width:'65px', height:'65px', paddingLeft:'15px', display:'flex', margin:'auto 0'}}>
                        <div style={{width:'63px', height:'63px', margin:'auto', backgroundImage:'url(/imgs/logos/logo4.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}></div>
                    </div>
                    <div style ={{paddingRight:'15px', margin:'auto', fontSize:'16px', color:'white'}}>Configurações</div>
                </div>                
            </div>
            <div style={{height:'65px', borderBottom:'1px solid #FF7000', backgroundColor:'white', display:'flex', zIndex:'20'}}>
                <div style={{width:'30px', height:'30px', margin:'auto auto auto 0', borderRadius:'50%', border:'1px solid #F7F7F7', backgroundImage:'url('+img_url+')', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}></div>
                <div style={{width:'20px', height:'20px', margin:'auto 20px', marginLeft:'20px', backgroundImage:'url(/imgs/icons/icon-downArrow.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}} onClick={()=>{this.popMenu()}}></div>
            </div>
            <div style={{display:this.state.display, width:'140px', height:'30px', border:'1px solid #FF7000', borderRadius:'0 0 3px 3px', position:'absolute', top:'65px', right:'15px', textAlign:'center', lineHeight:'30px', backgroundColor:'white', zIndex:'40', cursor:'pointer'}} onClick={()=>{history.push('/configuracoes')}}>Configurações</div>
            <div style={{display:this.state.display, width:'140px', height:'30px', border:'1px solid #FF7000', borderRadius:'0 0 3px 3px', position:'absolute', top:'95px', right:'15px', textAlign:'center', lineHeight:'30px', backgroundColor:'white', zIndex:'40', cursor:'pointer'}} onClick={()=>{history.push('/contato')}}>Contato</div>
            <div style={{display:this.state.display, width:'140px', height:'30px', border:'1px solid #FF7000', borderRadius:'0 0 3px 3px', position:'absolute', top:'125px', right:'15px', textAlign:'center', lineHeight:'30px', backgroundColor:'white', zIndex:'40', cursor:'pointer'}} onClick={()=>{Meteor.logout(); history.push('/entrar')}}>Sair</div>            
        </div>);
    }
}
export default VendorHeader;