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
        notConnected : 'notConnected',
        connected    : 'connected',
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
    else {
        easyrtc.showError("ALREADY-CONNECTED", "already connected to " + easyrtc.idToName(otherEasyrtcid));
    }
}


var checkIfPeerIsConnected = function(otherEasyrtcid){
    easyrtc.sendDataP2P(otherEasyrtcid, 'msg', appMessages.requests.isConnected)
}


var handleMessages = function(who, msgType, content){
    

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
        }

        else if (content === appMessages.answers.ack){
            connectedPeer = who
            connected = true
    }

    else if (content[0] === ':') {
        addToConversation(who, msgType, content.substring(1, content.length))
    }
   
   
    
}



var addToConversation = function (who, msgType, content) {

        content = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        content = content.replace(/\n/g, '<br />');
        document.getElementById('chat').innerHTML +=
            "<b>" + who + ":</b>&nbsp;" + content + "<br />";
    
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

        var keys = Object.keys(connectList)
        var peer = connectList[keys[0]].easyrtcid
        startCall(peer)
       
    }



    sendText() {

        let txt = document.getElementById('box').value
        if (easyrtc.getConnectStatus(connectedPeer) === easyrtc.IS_CONNECTED) {
            easyrtc.sendDataP2P(connectedPeer, 'msg', ':'+txt);
        }

        addToConversation("Me", "msgtype", txt);
        document.getElementById('box').value = "";

    }


    render() {
        return (
            <div className='text-page'>
                <div className='chat' id='chat' > Procurando peer para comunicação
                </div>
                <div className='actions'>
                    <button onClick={this.changePeer}>Trocar</button>
                    &nbsp;
                    &nbsp;
                    <input type='text' id='box' onChange={this.handleChange} />
                    &nbsp;
                    &nbsp;
                    <button onClick={this.sendText}>Enviar</button>
                </div>

            </div>
        )

    }
}