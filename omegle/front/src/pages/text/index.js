import React, { Component } from 'react'
import './styles.css'

var channelIsActive = {}
var selfEasyrtcid = ""
var connectList = {}
const easyrtc = window.easyrtc
var possiblePeer = ""
var connectedPeer = ""
var connected = false

var appMessages = {
    requests : {
        connect      : 'connect',
        isConnected  : 'isConnected',
        disconnect   : 'disconnect',
    },

    answers : {
        ack          : 'ack',
        notConnected : 'peerNotConnected',
        connected    : 'peerIsConnected',
    }
 
}

var startCall = function (otherEasyrtcid) {
    
    if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.NOT_CONNECTED) {
        try {
            easyrtc.call(otherEasyrtcid,
                function (caller, media) { // success callback
                    if (media === 'datachannel') {
                        // console.log("made call succesfully");
                        //checkIfConnected(otherEasyrtcid)
                        connectList[otherEasyrtcid] = true
                        possiblePeer = otherEasyrtcid
                        console.log('possible peer', possiblePeer)
                        checkIfPeerIsConnected(possiblePeer)
                       
                    }
                },
                function (errorCode, errorText) {
                    connectList[otherEasyrtcid] = false;
                    easyrtc.showError(errorCode, errorText);
                },
                function (wasAccepted) {
                    // console.log("was accepted=" + wasAccepted);
                    possiblePeer = otherEasyrtcid
                }
            );
        } catch (callerror) {
            console.log("saw call error ", callerror);
        }
    }
  
}


var checkIfPeerIsConnected = function(otherEasyrtcid){
    easyrtc.sendDataP2P(otherEasyrtcid, 'msg', appMessages.requests.isConnected)
}


var handleMessages = function(who, msgType, content){
    console.log(content)

    if (content === appMessages.requests.isConnected){
        if (connected === true) {
            easyrtc.sendDataP2P(who, 'msg', appMessages.answers.connected)
        } else {
            easyrtc.sendDataP2P(who, 'msg', appMessages.answers.notConnected)
        }

    }

    else if (content === appMessages.answers.notConnected){
        easyrtc.sendDataP2P(who, 'msg', appMessages.requests.connect)
    } 

    else if (content === appMessages.requests.connect){
        easyrtc.sendDataP2P(who, 'msg', appMessages.answers.ack)
        connected = true
        connectedPeer = who
        document.getElementById('chat').innerHTML = '<b>Conectado</b><br/>'
        document.getElementById('change-button').textContent = 'Trocar'
    }

    else if (content === appMessages.answers.ack && connected == false){
        connectedPeer = who
        connected = true
        document.getElementById('chat').innerHTML = '<b>Conectado</b><br/>'
        document.getElementById('change-button').textContent = 'Trocar'
    }

    else if (content === appMessages.requests.disconnect){
        connected = false
        connectedPeer = ""
        easyrtc.sendDataP2P(who, 'msg', appMessages.answers.ack)
        document.getElementById('chat').innerHTML = '<b>Procurando peer para comunicação</b><br/>'
        document.getElementById('change-button').textContent = 'Trocar'
        var keys = Object.keys(connectList)
        var peer = connectList[keys[ keys.length * Math.random() << 0]].easyrtcid
        startCall(peer) 
    }

    else if (content === appMessages.answers.ack && connected == true){
        connectedPeer = ""
        connected = false
        document.getElementById('chat').innerHTML = '<b>Procurando peer para comunicação</b><br/>'
        document.getElementById('change-button').textContent = 'Tente de novo'
        var keys = Object.keys(connectList)
        var peer =connectList[keys[ keys.length * Math.random() << 0]].easyrtcid
        startCall(peer) 
    }

    else if (content.substring(0,3) === ':::') {
        addToConversation(who, msgType, content.substring(3, content.length))
    }
   

}


var addToConversation = function (who, msgType, content) {

        content = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        content = content.replace(/\n/g, '<br />');
        document.getElementById('chat').innerHTML +=
            "<b>" + 'Stranger' + ":</b>&nbsp;" + content + "<br />";
    
}



var connect = function () {
    //const { easyrtc } = this.state
    easyrtc.enableDebug(false)
    easyrtc.enableDataChannels(true);
    easyrtc.enableVideo(false);
    easyrtc.enableAudio(false);
    easyrtc.setDataChannelOpenListener(openListener)
    easyrtc.setDataChannelCloseListener(closeListener)
    easyrtc.setRoomOccupantListener(getListeners)
    easyrtc.setPeerListener(handleMessages);
    easyrtc.connect("easyrtc.dataMessaging", loginSuccess, loginFailure)


}

var openListener = function (otherParty) {
    channelIsActive[otherParty] = true
    possiblePeer = otherParty
    console.log('possible peer', possiblePeer)

}

var getListeners = function (roomName, occupantList, isPrimary) {
    connectList = occupantList
}


var closeListener = function (otherParty) {

    channelIsActive[otherParty] = false
    connectedPeer = ""
    connected = false
}

var loginSuccess = function (easyrtcid) {
    selfEasyrtcid = easyrtcid

}

var loginFailure = function (errorCode, message) {
    //const {easyrtc} = this.state
    easyrtc.showError(errorCode, "failure to login");
}

export default class Text extends Component {


    state = {
        inputText: "",
        divText: "",
      
        //easyrtc: window.easyrtc,       
    }


    componentDidMount() {
        connect()
    }

     changePeer() {

        if (!connected){
            var keys = Object.keys(connectList)
            console.log(keys)
            var peer = connectList[keys[ keys.length * Math.random() << 0]].easyrtcid
            startCall(peer)  
        }
        else {
            console.log('solicitando desconn')
            easyrtc.sendDataP2P(connectedPeer, 'msg', appMessages.requests.disconnect)  
        }
       
    }

    sendText() {

        let txt = document.getElementById('box').value
        if (easyrtc.getConnectStatus(connectedPeer) === easyrtc.IS_CONNECTED) {
            easyrtc.sendDataP2P(connectedPeer, 'msg', ':::'+txt);
        }

        txt = txt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        txt = txt.replace(/\n/g, '<br />');
        document.getElementById('chat').innerHTML +=
            "<b>" + 'Me' + ":</b>&nbsp;" + txt + "<br />";
        document.getElementById('box').value = "";
      
    }


    render() {
        return (
            <div className='text-page'>
                <div className='chat' id='chat' > <b>Procurando peer para comunicação</b><br/>
                </div>
                <div className='actions'>
                    <button id='change-button' onClick={this.changePeer}>Trocar</button>
                    &nbsp;
                    &nbsp;
                    <input type='text' id='box' onChange={this.handleChange} />
                    &nbsp;
                    &nbsp;
                    <button id='send-button' onClick={this.sendText}>Enviar</button>
                </div>

            </div>
        )

    }
}