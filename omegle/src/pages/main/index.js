import React, { Component } from 'react'
import './styles.css'

export default class Main extends Component{
    state = {
        video: false,
    }
    render(){
        const {video} = this.state
        return (
            <div className='main-page'>
                Aperte em 'texto' para chat ou 'video' para conferencia
                <div className='actions'>
                    <button>Texto</button> 
                    &nbsp;
                    &nbsp; 
                    <button disabled = {video === false} >Video</button>                 
                </div>         
            </div>
            
        )
    }



}