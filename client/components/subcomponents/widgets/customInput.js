import React, { Component } from 'react';

class CustomInput extends Component {
    constructor(props){
        super(props);
        this.start = {text: ''}
        this.unit = {text: ''}
        this.state = {
            name: this.props.name,
            value: this.props.value,
            selectStart: (this.props.value)?this.props.value.length:0,
            element: undefined
        };        
    }
    componentDidUpdate(){
        if (this.state.value != this.props.value){
            this.setState({ value: this.props.value });
            //if (this.state.element){console.log(this.state.element.target.value)}
            
        }
    }
    inputHandler(e){
        let value = e.target.value; 
        let name = e.target.name;
        console.log(e.target.selectionStart)
        let event = { 
            target: {
                name: name,
                value: value,
                //selectStart: e.target.selectionStart
            }
        };
        this.setState({ [name]: value });
        this.props.onChange(event);
        //e.target.setSelectionRange(this.state.selectStart, this.state.selectStart)
    } 
    insertUnit(unit){
        if (!this.props.unit){ return; }
        return(<div style={this.unit.style}>{this.unit.text}</div>);
    }
    insertStart(start){
        if (!this.props.start){ return; }
        return(<div style={this.start.style}>{this.start.text}</div>);
    }   
    render(){
        let name = this.state.name;
        let value = this.state.value

        let width = this.props.width;
        let height = this.props.height;
        let margin = this.props.margin;

        let placeholder = '';
        if (this.props.placeholder){ placeholder = this.props.placeholder};
        let type = 'text';
        if (this.props.type){ type = this.props.type; }
        let unit = false;
        if (this.props.unit){ unit = this.props.unit; }
        let autoComplete = 'on';
        if (this.props.autoComplete){ autoComplete = this.props.autoComplete; }
        let start = false;
        if (this.props.start){ 
            if (this.props.start.style){
                this.start.text = this.props.start.text;
                this.start.style = this.props.start.style;
            }else{
                this.start.text = this.props.start;
                this.start.style = {margin:'auto 0', paddingRight:'3px', fontSize:'15px'};
            }             
        }
        if (this.props.unit){ 
            if (this.props.unit.style){
                this.unit.text = this.props.unit.text;
                this.unit.style = this.props.unit.style;
            }else{
                this.unit.text = this.props.unit;
                this.unit.style = {margin:'auto 0', fontSize:'12px'}
            }             
        }
        let customStyle = {};
        if (this.props.style){ customStyle = this.props.style; }
        let customInputStyle = {};
        if (this.props.inputStyle){ customInputStyle = this.props.inputStyle; }

        let mainStyle = {
            width:width, 
            height:height, 
            margin:margin, 
            padding:'0 10px', 
            lineHeight:'30px', 
            border:'1px solid #ff7000', 
            borderRadius:'3px', 
            backgroundColor:'white', 
            display:'flex'
        };
        let mainInputStyle = {
            width:'100%', 
            height:'100%', 
            border:'0px', 
            padding:'0px'
        };

        let style = Object.assign(mainStyle, customStyle);
        let inputStyle = Object.assign(mainInputStyle, customInputStyle);

        return(
        <div style={style}>
            {this.insertStart(start)}
            <input type={type} style={inputStyle} name={name} value={value} placeholder={placeholder} autoComplete={autoComplete} onChange={(e)=>{this.inputHandler(e)}} lang='br'/>
            {this.insertUnit(unit)}
        </div>);
    }
}
export default CustomInput;