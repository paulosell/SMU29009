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


