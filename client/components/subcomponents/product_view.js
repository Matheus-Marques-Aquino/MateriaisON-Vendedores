import React, { Component } from 'react';

class Productview extends Component{
    constructor(props){
        super(props);
        this.state = {

        }; 
    }
    displayImage(){
        return(<div style={{width:'100%', height:'fit-content'}}>
            <div style={{width:'100px', height:'100px', margin:'0 auto', marginBottom:'5px', border:'1px solid #F2F2F2', borderRadius:'3px'}}></div>
            <div style={{width:'102px', height:'32px', margin:'0 auto', display:'flex'}}>
                <div style={{width:'30px', height:'30px', border:'1px solid #F2F2F2', borderRadius:'3px'}}></div>
                <div style={{width:'30px', height:'30px', margin:'0 3px', border:'1px solid #F2F2F2', borderRadius:'3px'}}></div>
                <div style={{width:'30px', height:'30px', border:'1px solid #F2F2F2', borderRadius:'3px'}}></div>
            </div>
        </div>)
    }
    displayContent(select, content){
        switch(select){
            case 'description':
                return(<div>
                    <div style={{padding:'5px 5px', wordBreak:'normal', fontSize:'10px', color:'#333', border:'1px solid #ff7000'}}>
                        {content}
                    </div>
                </div>)
                break;
            case 'details':
                return(<div></div>)
                break;
        }
        return;
    }
    render(){
        var display = 'none';
        var open = this.props.open;
        var product = this.props.product;
        var description = 'Descrição do produto teste.'
        if (open != true){ return; }
        return(
        <div style={{zIndex:'80'}}>
            <div style={{height:'100%', width: document.querySelector('.mainContainer').clientWidth, backgroundColor:'black', position:'fixed', top:'0', right:'0', bottom:'0', left:'0', opacity:'0.5', zIndex:'80'}}></div>
            <div style={{width:'180px', height:'390px', margin:'auto', overflow:'hidden', backgroundColor:'white', position:'fixed', top:'0', right:'0', bottom:'0', left:'0', zIndex:'80', display:'flex'}}>
                <div style={{width:'100%', height:'fit-content'}}>
                    <div style={{height:'24px', backgroundColor:'white'}}>
                        <div style={{width:'100%', height:'24px', borderBottom:'1px solid #ccc', position:'relative', top:'0px', backgroundColor:'white', display:'flex'}}>
                            <div style={{width:'12px', height:'12px', margin:'auto 0', marginLeft:'5px', backgroundImage:'url(/imgs/icons/backArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                            <div style={{width:'100%', height:'fit-content', margin:'auto 0', marginRight:'17px', textAlign:'center', fontSize:'11px', fontWeight:'bold', color:'#111'}}>ConstruçãoON</div>
                        </div>
                    </div>
                    <div style={{height:'22px', lineHeight:'22px', paddingLeft:'10px', marginBottom:'10px', borderBottom:'1px solid #ccc', fontSize:'11px'}}>» Outros</div> 
                    {this.displayImage()}
                    <div style={{width:'fit-content', heigth:'fit-content', margin:'0 15px', marginTop:'10px', fontSize:'12px', textAlign:'center', color:'#333'}}>Produto Teste</div> 
                    <div style={{height:'fit-content', padding:'5px 15px', paddingBottom:'2px', display:'flex'}}>
                        <div style={{paddingRight:'2px', fontSize:'10px', marginTop:'auto'}}>R$ 25,30</div>
                        <div style={{fontSize:'8px', marginTop:'auto', marginBottom:'1px'}}>unidade</div>                
                    </div>   
                    <div style={{marginLeft:'15px', marginBottom:'8px', fontSize:'8px'}}>5 unidades em estoque.</div>
                    <div style={{margin:'0 15px'}}>
                        <div style={{height:'18px', display:'flex', border:'1px solid #ff7000', borderBottom:'0px'}}>
                            <div style={{width:'50%', height:'18px', margin:'auto', borderRight:'1px solid #ff7000'}}>
                                <div style={{margin:'auto', marginRight:'10px', width:'fit-content', height:'18px', lineHeight:'18px', textAlign:'center', fontSize:'11px', color:'#FF7000', fontWeight:'bold'}}>Descrição</div>
                            </div>
                            <div style={{width:'50%', height:'18px', margin:'auto'}}>
                                <div style={{margin:'auto', marginLeft:'10px', width:'fit-content', height:'18px', lineHeight:'18px', textAlign:'center', fontSize:'11px', color:'#777', fontWeight:'bold'}}>Detalhes</div>
                            </div>
                        </div>            
                        {this.displayContent('description', description)}
                    </div>                
                    <div style={{width:'fit-content', margin:'0 auto', marginTop:'10px', display:'flex'}}>
                        <div style={{display:'flex', margin:'auto', marginRight:'5px'}}>
                            <div style={{height:'20px', width:'20px', lineHeight:'20px', marginLeft:'auto', border:'1px solid #ff7000', textAlign:'center', fontSize:'11px'}}>-</div>
                                <div style={{width:'25px', height:'20px', border:'1px solid #ff7000', borderRight:'0px', borderLeft:'0px'}}>
                                    <div style={{width:'25px', height:'20px', lineHeight:'20px', textAlign:'center', border:'0px', fontSize:'11px'}}>5</div>
                                </div>                        
                            <div style={{height:'20px', width:'20px', lineHeight:'20px', marginRight:'auto', border:'1px solid #ff7000', textAlign:'center', fontSize:'11px'}}>+</div>                
                        </div>
                        <div style={{width:'70px', height:'22px', lineHeight:'22px', margin:'0 auto', marginLeft:'5px', backgroundColor:'#3395f5', borderRadius:'15px', textAlign:'center', fontSize:'11px', color:'white'}}>Adicionar</div>                
                    </div>
                    <div style={{width:'110px', height:'22px', lineHeight:'22px', margin:'0 auto', marginTop:'8px', backgroundColor:'#FF7000', borderRadius:'15px', textAlign:'center', fontSize:'11px', color:'white'}}>Finalizar Compra</div>                
                    <div style={{margin:'8px 15px', padding:'3px 4px', fontSize:'9px', border:'1px solid #ff7000', display:'flex'}}>
                        <div style={{fontWeight:'bold', color:'#FF7000'}}>ConstruçãoON</div>
                        <div style={{marginLeft:'auto'}}>(5 km)</div>
                    </div>
                </div>
            </div>
            <div style={{width:'200px', height:'425px', margin:'auto', backgroundImage:'url(/imgs/others/phone_frame.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', position:'fixed', top:'0', right:'0', bottom:'0', left:'0', zIndex:'80'}}></div>     
        </div>);
    }
}
export default Productview;