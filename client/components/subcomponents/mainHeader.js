import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import history from './widgets/history';
import Profile from '../../../imports/collections/profile';
class MainHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            user: undefined
        };   
    }
    componentDidMount(){
        this.setState({loading: true})
        Meteor.subscribe('ProfileSettings',()=>{
            let user = Meteor.users.findOne({'_id': Meteor.userId()});
            if (!user){ user = {} }
            if (!user.profile){ user.profile = {} }
            if (!user.profile.roles){ user.profile.roles = [] }
            this.setState({ user: user, loading: false });
        })
    }
    adminOptions(){
        let user = this.state.user;
        console.log(user);
        if (!user){ return; }
        if (!user.profile){ return; }
        if (!user.profile.roles){ return; }
        if (!user.profile.roles.includes('admin')){ return; }
        return(
        <div>
            <div className='HeaderPerfil' style={{height:'25x', marginRight:'15px', display:'flex'}} onClick={()=>{history.push('/lista-de-usuarios')}}>
                <div className='HeaderPerfilIcon' style={{width:'25px', height:'25px', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundImage:'url(/imgs/icons/icon-user-list.png)', backgroundColor:'#555'}}></div>
                <div className='HeaderPerfilText' style={{height:'25px', margin:'0 0 0 10px', lineHeight:'29px', fontSize:'15px', color:'#555'}}>Lista de Usuários</div>
            </div>
        </div>)
    }
    render(){
        let page = this.props.page;
        let login = true;
        if (!Meteor.userId()){ login = false; }
        console.log(login)
        return(
        <div style={{width:'100%', position:'relative'}}>
            <div style={{width:'100%', height:'30px', backgroundRepeat:'repeat-x', backgroundPosition:'center', backgroundSize:'contain', backgroundImage:'url(https://materiaison-image.s3.amazonaws.com/public/site/header_blocks.jpg)'}}></div>
            <div style={{width:'100%', height:'140px', paddingTop:'30px', display:'flex'}}>
                <div style={{width:'210px', margin:'0 auto', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundImage:'url(https://materiaison-image.s3.amazonaws.com/public/site/PNG_LOGO.png)'}}></div>
            </div>
            <div style={{width:'100%', marginTop:'25px', borderTop:'2px solid #FF7000'}}></div> 
            <div className='HeaderLogin' style={{height:'25x', right:'75px', bottom:'45px', position:'absolute', display:(page != 'login' && !login) ? 'flex' : 'none'}} onClick={()=>{history.push('/entrar')}}>
                <div className='HeaderLoginIcon' style={{width:'25px', height:'25px', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundImage:'url(/imgs/icons/icon-login.png)', backgroundColor:'#555'}}></div>
                <div className='HeaderLoginText' style={{height:'25px', margin:'0 0 0 10px', lineHeight:'29px', fontSize:'15px', color:'#555'}}>Entrar</div>
            </div>  
            <div style={{height:'25px', right:'75px', bottom:'45px', position:'absolute', display:(page != 'login' && login) ? 'flex' : 'none'}}>
                {this.adminOptions()}
                <div className='HeaderPerfil' style={{height:'25x', marginRight:'15px', display:'flex'}} onClick={()=>{history.push('/index')}}>
                    <div className='HeaderPerfilIcon' style={{width:'25px', height:'25px', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundImage:'url(/imgs/icons/icon-gear.png)', backgroundColor:'#555'}}></div>
                    <div className='HeaderPerfilText' style={{height:'25px', margin:'0 0 0 10px', lineHeight:'29px', fontSize:'15px', color:'#555'}}>Editar Perfil</div>
                </div>
                <div className='HeaderLogout' style={{height:'25x', display:'flex'}} onClick={()=>{Meteor.logout(); history.push('/entrar')}}>
                    <div className='HeaderLogoutIcon' style={{width:'25px', height:'25px', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundImage:'url(/imgs/icons/icon-logout.png)', backgroundColor:'#555'}}></div>
                    <div className='HeaderLogoutText' style={{height:'25px', margin:'0 0 0 5px', lineHeight:'29px', fontSize:'15px', color:'#555'}}>Sair</div>
                </div>
            </div>    
                     
        </div>);
    }
}
export default MainHeader;