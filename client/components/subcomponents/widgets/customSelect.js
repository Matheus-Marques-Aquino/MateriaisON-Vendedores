import React, { Component } from 'react';

class CustomSelect extends Component {
    constructor(props){
        super(props);
        this.selection = '';
        this.maxHeight = '0px';
        this.transition = '0.3s ease-in';
        this.overflowY='hidden'
        this.name = '';
        this.startIndex = 0;
        if (this.props.start){ this.startIndex = this.props.start; }
        this.state = {
            index: this.startIndex,
            open: false,
            mouseIndex: 1
        };
    }
    componentDidMount(){
        let event = { 
            target: {
                name: this.name,
                value: this.props.select[this.state.index]
            }
        };
        this.props.onChange(event);
    }
    openSelect(open, index){
        let selectArray = this.props.select;
        let height = this.props.height;
        if (open){
            if (!this.state.open){
                this.transition = '0.3s ease-in';
                this.maxHeight = selectArray.length * height.replace('px','') + 'px';
                if (this.props.maxHeight){
                    this.overflowY='scroll'
                    //if (this.props.maxHeight < this.maxHeight){
                        this.maxHeight = this.props.maxHeight;
                    //}
                }
                this.setState({
                    index:index,
                    open:true
                });                 
            }else{
                this.transition = '0.2s ease-in';
                this.maxHeight = '0px';
                this.overflowY = 'hidden'
                this.setState({
                    index:index,
                    open:false
                });             
                let event = { 
                    target: {
                        name: this.name,
                        value: this.props.select[index]
                    }
                };
                this.props.onChange(event); 
            }
        }else{
            this.transition = '0s ease-in';
            this.maxHeight = '0px';
            this.setState({
                index: index,
                open: false
            });
            let event = { 
                target: {
                    name: this.name,
                    value: this.props.select[index]
                }
            };
            this.props.onChange(event);
        }
    }
    render(){
        var selectArray = this.props.select;
        var width = this.props.width;
        var height = this.props.height;
        var round = ' 3px 3px';
        var border = '1px solid #FF7000';
        var transition = this.transition;
        var maxHeight = this.maxHeight;
        var display = 'none';
        var borderBottom = '1px solid #FF7000';
        if (this.maxHeight == '0px'){ borderBottom = '0px'; } 
        var basicStyle = {width:'fit-content', height:'fit-content'};
        var basicStyle1 = {width:width, height:height, padding:'0 10px', border:'1px solid #FF7000', borderRadius:'3px 3px'+round, boxSizing:'border-box', lineHeight:height, backgroundColor:'white', display:'flex', cursor:'pointer'};
        var basicStyle2 = {width:'fit-content', maxHeight:maxHeight, overflow:'hidden', overflowY:this.overflowY, border:'1px solid #FF7000', borderLeft:'0px', transition:transition, position:'relative', zIndex:'10'};
        var basicStyle3 = {width:width, height:height, padding:'0 10px', border:'1px solid #FF7000', borderTop:'0px', boxSizing:'border-box', lineHeight:height, backgroundColor:'white', display:'flex'}
        var basicStyle4 = {width:'100%', height:'100%', cursor:'pointer'}
        var customStyle = {};
        var customStyle1 = {};
        var customStyle2 = {};
        var customStyle3 = {};
        var customStyle4 = {};
        if (this.props.style){ customStyle1 = this.props.style; }
        if (this.props.containStyle){ customStyle = this.props.containStyle; }
        if (this.props.boxStyle){ customStyle2 = this.props.boxStyle; }
        if (this.props.dropStyle){ customStyle3 = this.props.dropStyle; }
        if (this.props.selectStyle){ customStyle4 = this.props.selectStyle; }
        this.name = this.props.name;    
        let style = Object.assign(basicStyle, customStyle)    
        let style1 = Object.assign(basicStyle1, customStyle1);
        let style2 = Object.assign(basicStyle2, customStyle2);
        let style3 = Object.assign(basicStyle3, customStyle3);
        let style4 = Object.assign(basicStyle4, customStyle4);
        if (this.state.open){ 
            round = ' 0px 0px';
            border = '0px';
            display = 'block';
            style2.display = 'block';
            style3.display = 'block';
        }else{
            style2.display = 'none';
            style3.display = 'none';
        }
        if (!this.props.select){ 
            selectArray = [''];
            maxHeight = '0px';
            
        }
        this.selection = selectArray[this.state.index];
        if (this.props.value){ this.selection = this.props.value; }
        if (this.props.startText && this.state.index == -1){ this.selection = this.props.startText; }
        return(
        <div style={style}>
            <div style={{width:width, height:height}}>
                <div style={{width:'100%', height:'100%', position:'fixed', top:'0px', left:'0px', display:display}} onClick={()=>{this.openSelect(false, this.state.index);}}></div>
                <div style={style1} onClick={(e)=>{this.openSelect(true, this.state.index); e.stopPropagation();}}>
                    <div style={{width:'100%', height:'100%'}}>{this.selection}</div>
                    <div style={{width:'11px', height:'11px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-downArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                </div>
            </div>
            <div style={style2}>{
                selectArray.map((text, index)=>{
                    let key = 'select_'+index;
                    let classIndex = index;
                    let selected = ''
                    if (index == selectArray.length - 1){ classIndex = 'last'; }  
                    if (this.state.mouseIndex == index){selected = ' item_hover'}else{ selected = ''}                
                    if (text == undefined){ return; }
                    return(
                    <div className={'select_'+classIndex+selected} style={style3} onClick={(e)=>{this.openSelect(false, index); e.stopPropagation();}} onMouseOver={()=>{if (this.state.mouseIndex != index){ this.setState({mouseIndex: index})}}} onMouseLeave={()=>{this.setState({mouseIndex: -1})}} key={key}>
                        <div style={style4}>{text}</div>
                    </div>)
                })    
            }</div>
        </div>);
    }
}
export default CustomSelect;