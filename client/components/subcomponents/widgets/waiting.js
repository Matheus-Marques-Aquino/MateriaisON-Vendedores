import React, { Component } from 'react';

class Waiting extends Component{
    constructor(props){
        super(props);
        this.state = {

        }; 
    }
    render(){
        var display = 'none';
        var open = this.props.open;
        var size = this.props.size;
        var border = this.props.border;
        var top = '0px'
        var right = '0px'
        var bottom = '0px'
        var left = '0px'
        if (this.props.top){ top = this.props.top; }
        if (this.props.right){ right = this.props.right; }
        if (this.props.bottom){ bottom = this.props.bottom; }
        if (this.props.left){ left = this.props.left; }
        if (!size){
            size = '90px'
        }
        if (!border){
            border = '16px'
        }
        if (open){ display = 'block'; }else{ display = 'none'; }
        return(
        <div style={{display:display, zIndex:'100'}}>
            <div style={{height:'100%', width: document.querySelector('.mainContainer').clientWidth, backgroundColor:'black', position:'fixed', top:top, right:right, bottom:bottom, left:left, opacity:'0.5', zIndex:'100'}}></div>
            <div style={{position:'fixed', left:left, right:right, top:top, bottom:bottom, margin:'auto', width: size, height: size, border: border+' solid #f3f3f3', borderRadius:'50%', borderTop: border+' solid #ff7000', animation:'spin 2s linear infinite', zIndex:'100'}}></div>            
        </div>);
    }
}
export default Waiting;