import React, { Component } from 'react';

class CustomToggle extends Component {
    constructor(props){
        super(props);
        this.select = false;
        this.text = '';
        this.state = {
            name: '',
            value: false
        };
    }
    componentDidMount(){
        console.log(this.props.value)
        if (this.state.value != this.props.value){
            this.select = this.props.value;
            this.setState({ value: this.props.value });
        }
        let event = { 
            target: {
                name: this.props.name,
                value: this.props.value
            }
        };
        this.props.onChange(event);
    }    
    changeState(){
        let event = { 
            target: {
                name: this.props.name,
                value: !this.props.value
            }
        };
        this.setState({
            name: this.props.name,
            value: !this.props.value
        });
        this.props.onChange(event);
    }
    fixState(){
        this.setState({ value:this.props.value });
    }
    render(){
        if (this.state.value != this.props.value){ 
            this.fixState();
        }
        let size = [{in:'6px', out:'10px'}, {in:'6px', out:'12px'}, {in:'9px', out:'14px'}]
        size = size[this.props.size];
        let indicator = {
            border:'2px solid #B3B3B3',
            ball: 'none'
        }
        if (this.state.value){
            indicator = { border:'2px solid #FF7000', ball: 'block' };
        }else{
            indicator = { border:'2px solid #B3B3B3', ball: 'none' };
        }
        return(
        <div style={{minWidth:size.out, height:size.out, margin:'auto 0', border:indicator.border, borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{this.changeState()}}>
            <div style={{minWidth:size.in, height:size.in, margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:indicator.ball}}></div>
        </div>);
    }
}
export default CustomToggle;