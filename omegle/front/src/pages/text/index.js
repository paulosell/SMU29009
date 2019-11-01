import React, { Component } from 'react'
import './styles.css'

var channelIsActive = {}
var selfEasyrtcid = ""
var connectList = {}
const easyrtc = window.easyrtc
var connectedto = ""


var startCall = function(otherEasyrtcid){
    //const {easyrtc} = this.state

    if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.NOT_CONNECTED) {
        try {
        easyrtc.call(otherEasyrtcid,
                function(caller, media) { // success callback
                    if (media === 'datachannel') {
                        // console.log("made call succesfully");
                        connectList[otherEasyrtcid] = true;
                        
                        connectedto = otherEasyrtcid
                    }
                },
                function(errorCode, errorText) {
                    connectList[otherEasyrtcid] = false;
                    easyrtc.showError(errorCode, errorText);
                },
                function(wasAccepted) {
                    // console.log("was accepted=" + wasAccepted);
                    connectedto = otherEasyrtcid
                }
        );
        }catch( callerror) {
            console.log("saw call error ", callerror);
        }
    }
    else {
        easyrtc.showError("ALREADY-CONNECTED", "already connected to " + easyrtc.idToName(otherEasyrtcid));
    }
}

var addToConversation = function(who, msgType, content){
    content = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    content = content.replace(/\n/g, '<br />');
    document.getElementById('chat').innerHTML +=
            "<b>" + who + ":</b>&nbsp;" + content + "<br />";
}

export default class Text extends Component{
    
    

    state = {
        inputText: "",
        divText: "",
        //easyrtc: window.easyrtc,       
    }


    componentDidMount(){
        this.connect()
        
       

    }
        
    
    connect(){       
         //const { easyrtc } = this.state
        easyrtc.enableDebug(false)
        easyrtc.enableDataChannels(true);
        easyrtc.enableVideo(false);
        easyrtc.enableAudio(false);  
        easyrtc.setDataChannelOpenListener(this.openListener)
        easyrtc.setDataChannelCloseListener(this.closeListener)
        easyrtc.setRoomOccupantListener(this.getListeners)
        easyrtc.setPeerListener(addToConversation);
        easyrtc.connect("easyrtc.dataMessaging", this.loginSuccess, this.loginFailure)

        

    }

  
    getListeners(roomName, occupantList, isPrimary){
        connectList = occupantList
        console.log(connectList)

    }

    openListener(otherParty){
        channelIsActive[otherParty] = true
        console.log('connectd to' + otherParty)
        connectedto = otherParty
        
    }

    trocar(){
        
        var keys = Object.keys(connectList)
        
        let otherEasyrtcid = connectList[keys[0]]
              
        
        console.log(connectList)
        startCall(connectList[keys[0]].easyrtcid)
        console.log(connectedto)
        
    }

    closeListener(otherParty){
        
        channelIsActive[otherParty] = false
        console.log('disconnectd to' + otherParty)
        connectedto = ""
    }

    loginSuccess (easyrtcid){
        selfEasyrtcid = easyrtcid
        console.log(selfEasyrtcid)
    }

    loginFailure(errorCode, message){
        //const {easyrtc} = this.state
        easyrtc.showError(errorCode, "failure to login");
    }
    
    handleChange  = (event) =>(
        this.setState({inputText: event.target.value})
    )
        
    sendText(){
        console.log(connectedto)
        console.log(easyrtc.getConnectStatus(connectedto))
        let txt = document.getElementById('box').value
        if (easyrtc.getConnectStatus(connectedto) === easyrtc.IS_CONNECTED) {
            easyrtc.sendDataP2P(connectedto, 'msg', txt);
        }

        addToConversation("Me", "msgtype", txt);
        document.getElementById('box').value = "";

    }
     
    
    render(){
       return ( 
            <div className='text-page'>
                <div className='chat' id='chat' >{this.state.divText}
               
                </div>
                <div className='actions'>
                    <button onClick={this.trocar}>Trocar</button>
                    &nbsp;
                    &nbsp; 
                    <input type='text' id='box' value={this.state.inputText} onChange={this.handleChange}/>
                    &nbsp;
                    &nbsp; 
                    <button onClick = {this.sendText}>Enviar</button>                     
                </div>

            </div>
       ) 

    }
}