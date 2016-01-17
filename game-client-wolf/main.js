/**
* Main part for the client wolf.
* Handle network connection
* Handle game logic.
* Handle chessboard and chessboard display and logic.
*/
$(document).ready(function(){
  'use strict';

  //declare main variables
//  var broadcasturl = 'ws://127.0.0.1:8127/',
  var broadcasturl = 'ws://nodejs1.student.bth.se:8127/',
  websocket,
  form = $('#form1'),
  output = $('#output'),
  user = $('#user').val(),
  hunterPos = "A1C1E1G1",
  wolfPos = "D8D8",
  wolfmoved =false;
  // Display the url in form field for the user to change
  $('#broadcastconnect_url').val(broadcasturl);

  //Main navigation menu
  document.getElementById("navigationmenu").innerHTML =
  "<ul id='menu'>" +
  "<li><a href='index.php'>Hem</a></li>" +
  "<li><a href='howtoplay.php'>Spelinstruktioner</a></li>" +
  "<li><a href='about.php'>Om mig</a></li>" +
  "</ul>";

  /**
  * Function to setup connection
  */
  function setupConnection () {
    user = 'Vargen';
    websocket = new WebSocket(broadcasturl, 'broadcast-protocol');

    websocket.onopen = function() {
      websocket.send(user+ ' är nu uppkopplad. Vargen flyttar först');
    }

    websocket.onmessage = function(event) {

      // Dont display sent messages in the output log
      if (event.data.indexOf("Vargen säger") <= -1)	{
        outputLog(event.data);
      }

      // Store hunter positions....
      if (event.data.indexOf("Jägarna säger") > -1)	{
        //Reset volf moved so that wolf can make a new move
        wolfmoved=false;
        hunterPos=event.data.substring(15,23);
        DisplayHunter();
      }
    }

    /**
    * Function to close websocket
    */
    websocket.onclose = function() {
      outputLog(user+' är nerkopplad.');
    }
  }

  /**
  * Function to send message
  */
  function sendMessage () {

    var msg = wolfPos;
    msg=msg.toUpperCase();

    if(!websocket || websocket.readyState === 3) {
      outputLog('Klienten är inte uppkopplad mot server, koppla upp');
    } else {
      var result=checkmessage(msg);
      //Wolf won
      if(result.indexOf('Ok,Vargen vann') > -1) {
        msg=msg.substring(2,4);
        websocket.send('Vargen' + ' säger: '+msg);
        websocket.send('Vargen vann');
        //Send message to Hunters
      }  else if(result.indexOf('Ok') > -1) {
        msg=msg.substring(2,4);
        websocket.send('Vargen' + ' säger: '+msg);
        wolfmoved =true;
        //Something went wrong with the input, display fault
      }	else {
        outputLog(result);
      }
    }
  }

  /**
  * Function to check that message is correct before sent
  */
  function checkmessage(msg) {
    var result='Ok';

    //Verify that the movefrom and moveto is not the same , for instance A1A1
    if ((msg.substring(0, 2) === msg.substring(2, 4))) {
      return "Flytta till och flytta från måste vara olika";
    }

    // Verify that the wolf just move one step for instance D8E7 not D8, F6
    if ((msg.charCodeAt(2) - msg.charCodeAt(0) >1) || (msg.charCodeAt(2) - msg.charCodeAt(0) <-1)) {
      return "Flytta från och flytta till får inte skilja mer än ett steg";
    }

    //  Verify if the wolf reached same as all hunters, wolf won.
    if ((msg.charCodeAt(3)<=hunterPos.charCodeAt(1))&&(msg.charCodeAt(3)<=hunterPos.charCodeAt(3))&&
    (msg.charCodeAt(3)<=hunterPos.charCodeAt(5))&&(msg.charCodeAt(3)<=hunterPos.charCodeAt(7))) {
      return "Ok,Vargen vann";
    }

    return result;
  }

  /**
  * Function to see received messages
  */
  function outputLog(message) {
    //  otherPartConnected(message);
    $(output).append(message + '<br/>').scrollTop(output[0].scrollHeight);
  }

  /**
  * Function to see if other part is connected
  */
  function otherPartConnected(message) {
    var substrconnected = 'Jägarna är nu uppkopplade. Vargen flyttar först';
    if (message.indexOf(substrconnected) > -1) {
      hunterconnected=true;
    }
  }

  /**
  * Function to close connection
  */
  function closeConnection () {
    $('#broadcastclose').on('click', function() {
      if(!websocket || websocket.readyState === 3) {
        outputLog('Client är inte kopplad mot en server, koppla upp');
      } else {
        websocket.send('Vargen' + ' är nerkopplad');
        websocket.close();
      }
    });
  }

  //Display chessboard with chesspices
  var w1y=21,w1x=170,
  h1y=371,h1x=20,
  h2y=371,h2x=120,
  h3y=371,h3x=220,
  h4y=371,h4x=320,

  imgwolf=document.getElementById("wolf"),
  imghunter1=document.getElementById("hunter1"),
  imghunter2=document.getElementById("hunter2"),
  imghunter3=document.getElementById("hunter3"),
  imghunter4=document.getElementById("hunter4"),
  imgempty=document.getElementById("emptysquare"),
  c=document.getElementById("canvas1"),
  ctx=c.getContext("2d");

  document.onkeydown=function(event) {
    event = event || window.event;

    var e = event.keyCode;

    if (wolfmoved==false) {
      if (e==81 /*q*/){
        if(w1x>=70 && w1y>=22) {
          var wolfPosTemp=wolfPos.substring(2,4);
          wolfPos=wolfPosTemp.substring(0,3);
          wolfPos+=String.fromCharCode(wolfPosTemp.charCodeAt(0)-1);
          wolfPos+=String.fromCharCode(wolfPosTemp.charCodeAt(1)+1);
          if(checkWolfSameAsHunter(wolfPos)===false) {
            sendMessage();
            ctx.drawImage(imgempty,w1x,w1y);
            w1y=w1y-50;w1x=w1x-50;
            ctx.drawImage(imgwolf,w1x,w1y);
          } else {
            wolfPosTemp=wolfPos.substring(2,4);
            wolfPos=wolfPosTemp.substring(0,3);
            wolfPos+=String.fromCharCode(wolfPosTemp.charCodeAt(0)+1);
            wolfPos+=String.fromCharCode(wolfPosTemp.charCodeAt(1)-1);
          }
        }
      }

      if (e==87 /*w*/){
        if(w1x<=369 && w1y>=22) {
          var wolfPosTemp=wolfPos.substring(2,4);
          wolfPos=wolfPosTemp.substring(0,3);
          wolfPos+=String.fromCharCode(wolfPosTemp.charCodeAt(0)+1);
          wolfPos+=String.fromCharCode(wolfPosTemp.charCodeAt(1)+1);
          if(checkWolfSameAsHunter(wolfPos)===false) {
            sendMessage();
            ctx.drawImage(imgempty,w1x,w1y);
            w1y=w1y-50;w1x=w1x+50;
            ctx.drawImage(imgwolf,w1x,w1y);
          } else {
            wolfPosTemp=wolfPos.substring(2,4);
            wolfPos=wolfPosTemp.substring(0,3);
            wolfPos+=String.fromCharCode(wolfPosTemp.charCodeAt(0)-1);
            wolfPos+=String.fromCharCode(wolfPosTemp.charCodeAt(1)-1);
          }
        }
      }

      if (e==65 /*a*/){
        if(w1x>=70 && w1y<=370) {
          var wolfPosTemp=wolfPos.substring(2,4);
          wolfPos=wolfPosTemp.substring(0,3);
          wolfPos+=String.fromCharCode(wolfPosTemp.charCodeAt(0)-1);
          wolfPos+=String.fromCharCode(wolfPosTemp.charCodeAt(1)-1);
          if(checkWolfSameAsHunter(wolfPos)===false) {
            sendMessage();
            ctx.drawImage(imgempty,w1x,w1y);
            w1y=w1y+50;w1x=w1x-50;
            ctx.drawImage(imgwolf,w1x,w1y);
          } else {
            wolfPosTemp=wolfPos.substring(2,4);
            wolfPos=wolfPosTemp.substring(0,3);
            wolfPos+=String.fromCharCode(wolfPosTemp.charCodeAt(0)+1);
            wolfPos+=String.fromCharCode(wolfPosTemp.charCodeAt(1)+1);
          }
        }
      }

      if (e==83 /*s*/){
        if(w1x<=369&&w1y<=370) {
          var wolfPosTemp=wolfPos.substring(2,4);
          wolfPos=wolfPosTemp.substring(0,3);
          wolfPos+=String.fromCharCode(wolfPosTemp.charCodeAt(0)+1);
          wolfPos+=String.fromCharCode(wolfPosTemp.charCodeAt(1)-1);
          if(checkWolfSameAsHunter(wolfPos)===false) {
            sendMessage();
            ctx.drawImage(imgempty,w1x,w1y);
            w1y=w1y+50;w1x=w1x+50;
            ctx.drawImage(imgwolf,w1x,w1y);
          } else {
            wolfPosTemp=wolfPos.substring(2,4);
            wolfPos=wolfPosTemp.substring(0,3);
            wolfPos+=String.fromCharCode(wolfPosTemp.charCodeAt(0)-1);
            wolfPos+=String.fromCharCode(wolfPosTemp.charCodeAt(1)+1);
          }
        }
      }
    } else {
      outputLog("Nu är det jägarnas tur att flytta");
    }
  }

  window.onload = function() {
    var img=document.getElementById("chessb");
    ctx.drawImage(img,1,1);
    ctx.drawImage(imgwolf,170,21);
    ctx.drawImage(imghunter1,20,371);
    ctx.drawImage(imghunter2,120,371);
    ctx.drawImage(imghunter3,220,371);
    ctx.drawImage(imghunter4,320,371);
  };

  /**
  * Check if hunter and wolf are on the same posiion
  */
  function checkWolfSameAsHunter(wolfPos) {
    for (var i = 0; i < 4; i++) {
      var hunterstartindex=0+(2*i);
      var hunterstopindex=2+(2*i);
      if (wolfPos.substring(2, 4)===hunterPos.substring(hunterstartindex,hunterstopindex)) {
        return true;
      }
    }
    return false;
  }

  /**
  * DisplayHunter for different hunters
  */
  function DisplayHunter() {
    ctx.drawImage(imgempty,h1x,h1y);
    ctx.drawImage(imgempty,h2x,h2y);
    ctx.drawImage(imgempty,h3x,h3y);
    ctx.drawImage(imgempty,h4x,h4y);
    h1x=20+((hunterPos.charCodeAt(0)-65)*50);
    h1y=371-((hunterPos.charCodeAt(1)-49)*50);
    h2x=20+((hunterPos.charCodeAt(2)-65)*50);
    h2y=371-((hunterPos.charCodeAt(3)-49)*50);
    h3x=20+((hunterPos.charCodeAt(4)-65)*50);
    h3y=371-((hunterPos.charCodeAt(5)-49)*50);
    h4x=20+((hunterPos.charCodeAt(6)-65)*50);
    h4y=371-((hunterPos.charCodeAt(7)-49)*50);
    var hunterpostemp=hunterPos.substring(0,2);
    hunterPos=hunterpostemp+hunterPos;
    ctx.drawImage(imghunter1,h1x,h1y);
    ctx.drawImage(imghunter2,h2x,h2y);
    ctx.drawImage(imghunter3,h3x,h3y);
    ctx.drawImage(imghunter4,h4x,h4y);
  }
  setupConnection();
  closeConnection();
});
