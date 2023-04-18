import React, { Component } from 'react';
import windowResize from 'window-resize';

class VendorFooter extends Component {
    constructor(props){
        super(props);
        this.state = {
            display: 'none',
            w: Math.round(document.querySelector('.mainContainer').clientWidth)
        }   
    }
    render(){
        return(<div style={{width:'100%'}}>
            <div className='Footer_mainDiv' style={{width:'100%', height:'16px' , marginTop:'80px', backgroundImage:'url(/imgs/others/footer_blue_blocks.png)', backgroundSize:'contain', backgroundRepeat:'repeat-x'}}></div>
            <div style={{width:'100%', minHeight:'140px', backgroundColor:'#1c2f59', display:'flex'}}>
                <div className='Footer_contentDiv' style={{width:'100%', maxWidth:'890px', margin:'0 auto', display:'flex'}}>
                    <div className='Footer_emailDiv' style={{width:'fit-content', height:'25px', margin:'auto', textAling:'left', color:'white', fontSize:'15px', fontWeight:'200', display:'flex'}}>
                        <div style={{width:'25px', height:'10px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-email2.png', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                        <div style={{height:'25px', lineHeight:'25px', margin:'auto 0'}}>contato@materiaison.com.br</div>
                    </div>
                    <div className='Footer_phoneDiv' style={{width:'fit-content', margin:'auto', textAling:'left', color:'white', fontSize:'13px', fontWeight:'200'}}>
                        <div style={{magin:'0 auto'}}>
                            <div style={{display:'flex'}}>
                                <div style={{width:'25px', height:'13px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-whatsapp2.png', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                                <div style={{height:'22px', lineHeight:'22px', margin:'auto 0'}}>(11) 99510-7345</div>
                            </div>
                            <div style={{display:'flex'}}>
                                <div style={{width:'25px', height:'13px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-whatsapp2.png', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                                <div style={{height:'22px', lineHeight:'22px', margin:'auto 0'}}>(11) 93407-8531</div>
                            </div>
                            <div style={{display:'flex'}}>
                                <div style={{width:'25px', height:'14px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-phone.png', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                                <div style={{height:'22px', lineHeight:'22px', margin:'auto 0'}}>(11) 4226-7099</div>
                            </div>
                            <div style={{display:'flex'}}>                                
                                <div style={{width:'25px', height:'14px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-phone.png', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                                <div style={{height:'22px', lineHeight:'22px', margin:'auto 0'}}>(11) 4318-7223</div>
                            </div>                            
                        </div>                        
                    </div>
                    <div className='Footer_socialDiv' style={{width:'fit-content', margin:'auto',display:'flex'}}>
                        <div style={{magin:'0 auto'}}>
                            <div className='FootersocialTitleDiv' style={{width:'fit-content', margin:'auto', fontSize:'20px', color:'white'}}>Redes Sociais</div>
                            <div style={{display:'flex'}}>
                                <a className='Footer_facebookIcon' style={{marginTop:'15px'}} href='https://www.facebook.com/materiaison.online/'>
                                    <div style={{width:'45px', height:'45px', backgroundImage:'url(/imgs/others/footer_facebook.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                                </a>
                                <a className='Footer_twitterIcon' style={{marginTop:'15px'}} href='https://twitter.com/MateriaisON'>
                                    <div style={{width:'45px', height:'45px', marginLeft:'5px', backgroundImage:'url(/imgs/others/footer_twitter.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                                </a>
                                <a className='Footer_instagramIcon' style={{marginTop:'15px'}} href='https://www.instagram.com/materiaison_/'>
                                    <div style={{width:'45px', height:'45px', marginLeft:'5px', backgroundImage:'url(/imgs/others/footer_instagram.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                                </a>
                                <a className='Footer_pinterestIcon' style={{marginTop:'15px'}} href='https://br.pinterest.com/materiaison/'>
                                    <div style={{width:'45px', height:'45px', marginLeft:'5px', backgroundImage:'url(/imgs/others/footer_pinterest.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                                </a>
                                <a className='Footer_likedinIcon' style={{marginTop:'15px'}} href='https://www.linkedin.com/company/28887465/admin/'>
                                    <div style={{width:'45px', height:'45px', marginLeft:'5px', backgroundImage:'url(/imgs/others/footer_linkedin.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                                </a>
                            </div>
                        </div>                        
                    </div>
                </div>                
            </div>
        </div>);
    }
}
export default VendorFooter