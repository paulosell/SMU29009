import React, { Component } from 'react'


import './styles.css'

export default class Text extends Component{

    state = {
        inputText: "",
        divText: "",
        easyrtc: window.easyrtc,
    }
    
    componentDidMount = () => (
        this.connect()
        
    )
    connect(){
       
        this.state.easyrtc.enableDebug(false)
        this.state.easyrtc.enableDataChannels(true);
       this.state.easyrtc.enableVideo(false);
   this.state.easyrtc.enableAudio(false);
    
   
        console.log('aa')
    }
    handleChange  = (event) =>(
        this.setState({inputText: event.target.value})
    )
        

    getText = () => (
       this.setState({divText: this.state.divText + '\n' + this.state.inputText, inputText: "" })            
    )
     
    
    render(){
       return ( 
            <div className='text-page'>
                <div className='chat' >{this.state.divText}
               
                </div>
                <div className='actions'>
                    <button>Trocar</button>
                    &nbsp;
                    &nbsp; 
                    <input type='text'  value={this.state.inputText} onChange={this.handleChange}/>
                    &nbsp;
                    &nbsp; 
                    <button onClick = {this.getText}>Enviar</button>                     
                </div>

            </div>
       ) 

    }
}