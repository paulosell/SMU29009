import React, { Component } from 'react'
import './styles.css'

var channelIsActive = {}
var selfEasyrtcid = ""
var connectList = {}
const easyrtc = window.easyrtc
var connectedto = ""
var connected = true

var startCall = function(otherEasyrtcid){
    //const {easyrtc} = this.state

    
    if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.NOT_CONNECTED) {
        try {
        easyrtc.call(otherEasyrtcid,
                function(caller, media) { // success callback
                    if (media === 'datachannel') {
                        // console.log("made call succesfully");
                        connectList[otherEasyrtcid] = true                        
                        connectedto = otherEasyrtcid
                        connected = true
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



var connect = function(){       
    //const { easyrtc } = this.state
   easyrtc.enableDebug(false)
   easyrtc.enableDataChannels(true);
   easyrtc.enableVideo(false);
   easyrtc.enableAudio(false);  
   easyrtc.setDataChannelOpenListener(openListener)
   easyrtc.setDataChannelCloseListener(closeListener)
   easyrtc.setRoomOccupantListener(getListeners)
   easyrtc.setPeerListener(addToConversation);
   easyrtc.connect("easyrtc.dataMessaging", loginSuccess, loginFailure)
   

}

var openListener = function(otherParty){
    channelIsActive[otherParty] = true   
    connectedto = otherParty
    connected = true
    console.log('connect list ', connectList)
    console.log('canais ativos ', channelIsActive)
    
}

var   getListeners = function (roomName, occupantList, isPrimary){
    connectList = occupantList
}   
 

var closeListener = function(otherParty){
        
    channelIsActive[otherParty] = false
    
    connectedto = ""
    connected = false
}

var loginSuccess = function(easyrtcid){
    selfEasyrtcid = easyrtcid
    
}

var loginFailure = function(errorCode, message){
    //const {easyrtc} = this.state
    easyrtc.showError(errorCode, "failure to login");
}

export default class Text extends Component{
    
    

    state = {
        inputText: "",
        divText: "",
        connected: false
        //easyrtc: window.easyrtc,       
    }


    componentDidMount(){
        connect()
    }
        

    changePeer(){
        
        channelIsActive[connectedto] = false    
        connectedto = ""
        connected = false
        console.log('canais ativos ', channelIsActive)

        var keys = Object.keys(connectList) 
        console.log(keys)
        var peer = connectList[keys[0]].easyrtcid
        startCall(peer)
        console.log(connected)
        
    
        
    }

    
        
    sendText(){

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
                <div className='chat' id='chat' > Procurando peer para comunicação               
                </div>
                <div className='actions'>
                    <button onClick={this.changePeer}>Trocar</button>
                    &nbsp;
                    &nbsp; 
                    <input type='text' id='box' onChange={this.handleChange}/>
                    &nbsp;
                    &nbsp; 
                    <button onClick = {this.sendText}>Enviar</button>                     
                </div>

            </div>
       ) 

    }
}