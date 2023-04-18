import React, { Component } from 'react';

class Warning extends Component{
    constructor(props){
        super(props);
        this.state = {

        }; 
    }
    render(){
        var display = 'none';
        var open = this.props.open;
        var text = this.props.text;
        var button = this.props.button;
        var top = '0px'
        var right = '0px'
        var bottom = '0px'
        var left = '0px'
        if (this.props.top){ top = this.props.top; }
        if (this.props.right){ right = this.props.right; }
        if (this.props.bottom){ bottom = this.props.bottom; }
        if (this.props.left){ left = this.props.left; }
        if (open){ display = 'block'; }else{ display = 'none'; }
        return(<div style={{display:display}}>            
            <div style={{height:'100%', width: document.querySelector('.mainContainer').clientWidth, position:'fixed', top:0, left:0}}></div>
            <div style={{height:'90px', width:'90px', margin:'auto', borderRadius:'15px', backgroundColor:'black', position:'fixed', top:'0px', right:'0px', bottom:'0px', left:'0px', opacity:'0.5'}}></div>
            <div style={{width:'260px', height:'160px', minWidth:'260px', minHeight:'160px', margin:'auto', border:'1px solid #cccccc80', borderRadius:'5px', backgroundColor:'white', position:'fixed', left:left, right:right, top:top, bottom:bottom}}>
                <div style={{height:'30px', borderTopRightRadius:'5px', borderTopLeftRadius:'5px', borderBottom:'1px solid #cccccc80', backgroundColor:'#F7F7F7'}}></div>

            </div>            
        </div>);
    }
}
export default Warning;