import React, { Component } from 'react'

import './styles.css'

export default class Text extends Component{
    render(){
       return (
            <div className='text-page'>
                <div className='chat'>
                    
                </div>
                <div className='actions'>
                    <button>Trocar</button>
                    &nbsp;
                    &nbsp; 
                    <input type='text'/>
                    &nbsp;
                    &nbsp; 
                    <button>Enviar</button> 
                    
                </div>

            </div>
       ) 

    }
}