import React, { Component } from 'react'
import { Link } from 'react-router-dom'

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
                    <Link to="/text"> Texto </Link> 
                    &nbsp;
                    &nbsp; 
                    <a disabled = {video === false} >Video</a>                 
                </div>         
            </div>
            
        )
    }



}