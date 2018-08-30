//HTML Elems
var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivPassword = document.getElementById('signDiv-password');
var signDivRoom = document.getElementById('signDiv-roomID');
var signDivJoin = document.getElementById('signDiv-login');


//Button and text listeners
document.querySelector('#chat-form').addEventListener('submit', onFormSubmitted);

signDivJoin.onclick = function(){
  console.log('click');
  socket.emit('login',{username:signDivUsername.value, password: signDivPassword.value, room: signDivRoom.value});
}

//writing functions

function writeEvent(text){
  const parent = document.querySelector('#events');
  const elem = document.createElement('ul');
  elem.innerHTML = text;

  parent.appendChild(elem);
}

function onFormSubmitted(e){
  event.preventDefault();
  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';
  socket.emit('message', text);
};

//Socket Business

const socket = io();

socket.on('loginResp',function(data){
  signDiv.style.display = 'none';
  chatDiv.style.display = 'inline-block';
  writeEvent('Welcome to the Chatroom!')
});

socket.on('eval',function(data){
  console.log(data);
});

socket.on('message', writeEvent);
