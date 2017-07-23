import * as sio from 'socket.io';
import config from './config/config';

export default function setSocket(server) {

  const io=sio(server);

  io.on('connection',function(socket){
    console.log('A user has been connected');

    //socket.on('add-message', function(socket){console.log('Un cliente se ha conectado 2');});
    socket.on('add-message', (message)=>{
      io.emit('message',{message: message, emitedBy: socket.id}); //broastcast
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
  });

//  io.on('add-message', function(socket){console.log('Un cliente se ha conectado 2');});

}
