# OMEGLE WebRTC

Este projeto implementa um *chat* *online* similar ao [omegle](https://www.omegle.com/), onde o usuário conversa com pessoas aleatórias via *chat* ou  conferência (audio e video). 

![omegle](/images/omegle.png)

A versão 1 deste projeto, que irá para avaliação do professor, irá implementar a troca de mensagens entre usuários apenas via *chat*. Caso haja tempo hábil, será implementado a video conferência. 

O lado cliente deste projeto será feito em Javascript com os *frameworks* [react](https://github.com/facebook/react) e [easyRTC](https://github.com/priologic/easyrtc).

O lado servidor será implementado em [Node.js](https://nodejs.org/en/), também com o [easyRTC](https://github.com/priologic/easyrtc).



## OMEGLE 1.1

Instalação e utilização:

```
git clone https://github.com/paulosell/SMU29009
cd SMU29009/omegle/front
npm run-script build
cd ../backend
node server.js
```

O projeto irá rodar no *localhost*, porta 8080.

### Oferta de mídia

No momento em que um *peer* deseja abrir um *data channel*, o mesmo envia uma oferta de mídia através do servidor de sinalização para o outro *peer*. Desta forma, o protocolo SDP é enviado encapsulado dentro das mensagens
do *easyrtc*. O bloco abaixo demonstra uma captura através do *wireshark* da oferta de mídia do protocolo SDP.

```
v=0
o=- 5992877891373361706 2 IN IP4 127.0.0.1
s=-
t=0 0
m=application 9 UDP/DTLS/SCTP webrtc-datachannel
c=IN IP4 0.0.0.0
b=AS:30
a=ice-ufrag:mmAs
a=ice-pwd:lvYKj8q3HXHQug63krfMgCBZ
a=ice-options:trickle
a=fingerprint:sha-256 B0:29:ED:97:26:33:E9:88:10:42:8C:2D:72:71:51:AE:24:55:20:C4:2F:7B:5F:39:94:AD:D0:68:F8:0A:3F:8E
a=setup:active
a=mid:2
a=sctp-port:5000
a=max-message-size:262144
```
Como  é possível observar, o campo *m* indica o tipo de dado que está sendo ofertado, neste caso um *data channel* que será aberto


Após a oferta de mídia, uma mensagem do tipo "dataChannelPrimed", própria do *easyrtc*, é trocada entre os pares que estão estabelecendo o canal de comunicação.

```
[
"easyrtcMsg",
  {
    "senderEasyrtcid":"wnk0rozRfNtqVgdB",
    "targetEasyrtcid":"KdA6zAd7wgZiFFNK",
    "msgType":"dataChannelPrimed",
    "msgData":"",
    "easyrtcid":"KdA6zAd7wgZiFFNK",
    "serverTime":1575831181732
  }
]

[
"easyrtcMsg",
  { 
    "senderEasyrtcid":"KdA6zAd7wgZiFFNK",
    "targetEasyrtcid":"wnk0rozRfNtqVgdB",
    "msgType":"dataChannelPrimed",
    "msgData":"",
    "easyrtcid":"wnk0rozRfNtqVgdB",
    "serverTime":1575831180778
  }
]
```

Após o recebimento dos ACK's destas mensagens, o *data channel* fica estabelecido e os pares podem trocar mensagens livremente.

