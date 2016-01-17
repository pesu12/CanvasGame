/**
* Main part for the client hunters.
* Handle network connection
* Handle game logic.
* Handle chessboard and chessboard display and logic.
*/
$(document).ready(function(){
  'use strict';

  //declare main variables
  //var broadcasturl = 'ws://127.0.0.1:8127/',
  var broadcasturl = 'ws://nodejs1.student.bth.se:8127/',
  websocket,
  form = $('#form1'),
  output = $('#output'),
  user = $('#user').val(),
  wolfPos = "D8",
  hunterPos = "A1C1E1G1",
  huntermoved =true;

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
    user = 'Jägarna';
    websocket = new WebSocket(broadcasturl, 'broadcast-protocol');

    websocket.onopen = function() {
      websocket.send(user+ ' är nu uppkopplad. Vargen flyttar först');
    }

    websocket.onmessage = function(event) {
      // Dont display sent message in the log output
      if (event.data.indexOf("Jägarna säger") <= -1)	{
        outputLog(event.data);
      }

      // Store wolf positions....
      if (event.data.indexOf("Vargen säger") > -1)	{
        //Reset hunter moved so that hunter can make a new move
        huntermoved=false;
        wolfPos=event.data.substring(14, 16);
        DisplayWolf();
      }
    }

    /**
    * Function to close socket
    */
    websocket.onclose = function() {
      outputLog(user+' är nerkopplad.');
    }
  }

  /**
  * Function to send message
  */
  function sendMessage () {
    //var msg = $('#message').val();

    var msg = hunterPos;
    msg=msg.toUpperCase();

    if(!websocket || websocket.readyState === 3) {
      outputLog('Klienten är inte uppkopplad mot server, koppla upp');
    }else {
      var result=checkmessage(msg);
      if(result.indexOf('Ok,Jägarna vann') > -1) {
        websocket.send('Jägarna' + ' säger: '+msg);
        websocket.send('Jägarna vann');
      }  else if(result.indexOf('Ok') > -1) {
        websocket.send('Jägarna' + ' säger: '+msg);
        huntermoved =true;
        //Something went wrong with the input, display fault
      } else {
        outputLog(result);
      }
    }
  }

  /**
  * Function to check that message is correct before sent
  */
  function checkmessage(msg) {
    var result='Ok';

    //Verify that length is 8, for instance B2C1E1G1
    if ((msg.length> 8) || (msg.length< 8)) {
      return "Inkorrekt längd";
    }

    //verify that odd characters are A to H, even are 1 to 8
    for (var i = 0; i < 4; i++) {

      //Verify that character is from A to H
      if(/^[A-H]*$/.test(msg[i*2]) === false) {
        return "Inkorrekt tecken, måste vara A till H.";
      }
      //Verify that number is from 1 to 8
      if(/^[1-8]*$/.test(msg[1+i*2]) === false) {
        return "Inkorrect number, måste vara 1 till 8.";
      }
    }


    //Verify that all white positions on odd rows are not selected
    for (var j = 0; j < 3; j++) {
      for (var i = 0; i < 3; i++) {
        //66 is char B, 49 is char 1, do for B1,D1,F1,H1, B3, D3 ...
        var checked=String.fromCharCode(66+(i*2), 49+(j*2));
        if (msg.indexOf(checked) > -1)	{
          return "Inkorrekt till-position, måste vara en svart ruta";
        }
      }
    }

    //Verify that all white positions on even rows are not selected
    for (var j = 0; j < 3; j++) {
      for (var i = 0; i < 3; i++) {
        //65 is char A, 50 is char 2, do for A2,C2,E2,G2, A4,C4,E4,G4 ...
        var checked=String.fromCharCode(65+(i*2), 50+(j*2));
        if (msg.indexOf(checked) > -1)	{
          return "Inkorrekt till-position, måste vara en svart ruta";
        }
      }
    }

    //If wolf is in pos h8 and one of the hunters are in G7 then the wolf is locked in , hunters win
    if(wolfPos==='H8') {
      if (msg.substring(0,8).indexOf('G7') > -1) {
        return "Ok,Jägarna vann";
      }
    }

    //If wolf is in pos B8,D8,F8 and a hunter is blocked by hunters,hunters win
    if (wolfPos[1]==='8') {
      if((msg[1]==='7') && (msg.charCodeAt(0)===(wolfPos.charCodeAt(0)-1))) {
        if((msg[3]==='7') && (msg.charCodeAt(2)===(wolfPos.charCodeAt(0)+1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[5]==='7') && (msg.charCodeAt(4)===(wolfPos.charCodeAt(0)+1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[7]==='7') && (msg.charCodeAt(6)===(wolfPos.charCodeAt(0)+1))) {
          return "Ok,Jägarna vann";
        }
      }

      if((msg[3]==='7') && (msg.charCodeAt(2)===(wolfPos.charCodeAt(0)-1))) {
        if((msg[1]==='7') && (msg.charCodeAt(0)===(wolfPos.charCodeAt(0)+1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[5]==='7') && (msg.charCodeAt(4)===(wolfPos.charCodeAt(0)+1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[7]==='7') && (msg.charCodeAt(6)===(wolfPos.charCodeAt(0)+1))) {
          return "Ok,Jägarna vann";
        }
      }

      if((msg[5]==='7') && (msg.charCodeAt(4)===(wolfPos.charCodeAt(0)-1))) {
        if((msg[1]==='7') && (msg.charCodeAt(0)===(wolfPos.charCodeAt(0)+1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[3]==='7') && (msg.charCodeAt(2)===(wolfPos.charCodeAt(0)+1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[7]==='7') && (msg.charCodeAt(6)===(wolfPos.charCodeAt(0)+1))) {
          return "Ok,Jägarna vann";
        }
      }

      if((msg[7]==='7') && (msg.charCodeAt(6)===(wolfPos.charCodeAt(0)-1))) {
        if((msg[1]==='7') && (msg.charCodeAt(0)===(wolfPos.charCodeAt(0)+1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[3]==='7') && (msg.charCodeAt(2)===(wolfPos.charCodeAt(0)+1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[5]==='7') && (msg.charCodeAt(4)===(wolfPos.charCodeAt(0)+1))) {
          return "Ok,Jägarna vann";
        }
      }
    }

    //Here hunter moves to right dowm on wolf, check if there is a hunter on upper of wolf
    if (wolfPos[0]==='A') {

      if((msg[0]==='B') && (msg.charCodeAt(1)===(wolfPos.charCodeAt(1)+1))) {
        if((msg[2]==='B') && (msg.charCodeAt(3)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }

        if((msg[4]==='B') && (msg.charCodeAt(5)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[6]==='B') && (msg.charCodeAt(7)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
      }
      //Here hunter moves to right up of wolf, check if there is a hunter on down side of wolf
      if((msg[2]==='B') && (msg.charCodeAt(3)===(wolfPos.charCodeAt(1)+1))) {
        if((msg[0]==='B') && (msg.charCodeAt(1)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[4]==='B') && (msg.charCodeAt(5)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[6]==='B') && (msg.charCodeAt(7)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
      }

      if((msg[4]==='B') && (msg.charCodeAt(5)===(wolfPos.charCodeAt(1)+1))) {
        if((msg[0]==='B') && (msg.charCodeAt(1)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[2]==='B') && (msg.charCodeAt(3)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[6]==='B') && (msg.charCodeAt(7)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
      }

      if((msg[6]==='B') && (msg.charCodeAt(7)===(wolfPos.charCodeAt(1)+1))) {
        if((msg[0]==='B') && (msg.charCodeAt(1)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[2]==='B') && (msg.charCodeAt(3)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[4]==='B') && (msg.charCodeAt(5)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
      }
    }

    //If wolf is in pos H2,H4,H6 and a hunter is blocked by hunters,hunters win
    if (wolfPos[0]==='H') {

      if((msg[0]==='G') && (msg.charCodeAt(2)===(wolfPos.charCodeAt(1)+1))) {
        if((msg[2]==='G') && (msg.charCodeAt(3)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[4]==='G') && (msg.charCodeAt(5)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[6]==='G') && (msg.charCodeAt(7)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
      }

      if((msg[2]==='G') && (msg.charCodeAt(3)===(wolfPos.charCodeAt(1)+1))) {
        if((msg[0]==='G') && (msg.charCodeAt(1)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[4]==='G') && (msg.charCodeAt(5)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[6]==='G') && (msg.charCodeAt(7)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";s
        }
      }

      if((msg[4]==='G') && (msg.charCodeAt(5)===(wolfPos.charCodeAt(1)+1))) {
        if((msg[0]==='G') && (msg.charCodeAt(1)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[2]==='G') && (msg.charCodeAt(3)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[6]==='G') && (msg.charCodeAt(7)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";s
        }
      }

      if((msg[6]==='G') && (msg.charCodeAt(7)===(wolfPos.charCodeAt(1)+1))) {
        if((msg[0]==='G') && (msg.charCodeAt(1)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[2]==='G') && (msg.charCodeAt(3)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
        if((msg[4]==='G') && (msg.charCodeAt(5)===(wolfPos.charCodeAt(1)-1))) {
          return "Ok,Jägarna vann";
        }
      }
    }

    //If 4 hunters sorround the wolf, the the hunters win, for this to happen then
    //wolf must be in square B2 to G7
    if(wolfPos.charCodeAt(0)> 65 && wolfPos.charCodeAt(0) < 72 && wolfPos.charCodeAt(1) > 49 && wolfPos.charCodeAt(1) < 56) {
      if((msg.charCodeAt(0)+msg.charCodeAt(2)+msg.charCodeAt(4)+msg.charCodeAt(6))/wolfPos.charCodeAt(0)===4&&
      (msg.charCodeAt(1)+msg.charCodeAt(3)+msg.charCodeAt(5)+msg.charCodeAt(7))/wolfPos.charCodeAt(1)===4) {
        return "Ok,Jägarna vann";
      }
    }
    return result;
  }



  /**
  * Function to see received messages
  */
  function outputLog(message) {
    // otherPartConnected(message);
    $(output).append(message + '<br/>').scrollTop(output[0].scrollHeight);
  }

  /**
  * Function to see if other part is connected
  */
  function otherPartConnected(message) {
    var substrconnected = 'Vargen är nu uppkopplad. Vargen flyttar först';
    if (message.indexOf(substrconnected) > -1) {
      wolfconnected=true;
    }
  }

  /**
  * Function to close connection
  */
  function closeConnection () {
    // broadcastclose the connection to the server
    $('#broadcastclose').on('click', function() {
      if(!websocket || websocket.readyState === 3) {
        outputLog('Websocket är inte kopplad mot någon server, koppla upp');
      } else {
        websocket.send('Jägarna' + ' är nerkopplad');
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

    if (huntermoved==false) {
      if (e==69 /*e first hunter up left*/){
        if(h1x>20 && h1y>21) {
          var hunterFromPos=hunterPos.substring(0,2);
          var hunterToPos=String.fromCharCode(hunterFromPos.charCodeAt(0)-1);
          var hunterToPos=hunterToPos+String.fromCharCode(hunterFromPos.charCodeAt(1)+1);
          if((checkWolfSameAsHunter(hunterToPos)===false)&&(checkHunterSameAsOtherHunter(hunterToPos)===false)) {
            ctx.drawImage(imgempty,h1x,h1y);
            h1y=h1y-50;
            h1x=h1x-50;
            ctx.drawImage(imghunter1,h1x,h1y);
            hunterPos = hunterToPos[0] + hunterPos.substring(1+1);
            hunterPos = hunterPos.substring(0, 1) + hunterToPos[1] + hunterPos.substring(1);
            sendMessage();
          }
        }
      }

      if (e==82 /*r first hunter up r*/){
        if(h1x<370 && h1y>21) {
          var hunterFromPos=hunterPos.substring(0,2);
          var hunterToPos=String.fromCharCode(hunterFromPos.charCodeAt(0)+1);
          var hunterToPos=hunterToPos+String.fromCharCode(hunterFromPos.charCodeAt(1)+1);
          if((checkWolfSameAsHunter(hunterToPos)===false)&&(checkHunterSameAsOtherHunter(hunterToPos)===false)) {
            ctx.drawImage(imgempty,h1x,h1y);
            h1y=h1y-50;
            h1x=h1x+50;
            ctx.drawImage(imghunter1,h1x,h1y);
            hunterPos = hunterToPos[0] + hunterPos.substring(1+1);
            hunterPos = hunterPos.substring(0, 1) + hunterToPos[1] + hunterPos.substring(1);
            sendMessage();
          }
        }
      }

      if (e==84 /*t second hunter up left*/){
        if(h2x>20 && h2y>21) {
          var hunterFromPos=hunterPos.substring(2,4);
          var hunterToPos=String.fromCharCode(hunterFromPos.charCodeAt(0)-1);
          var hunterToPos=hunterToPos+String.fromCharCode(hunterFromPos.charCodeAt(1)+1);
          if((checkWolfSameAsHunter(hunterToPos)===false)&&(checkHunterSameAsOtherHunter(hunterToPos)===false)) {
            ctx.drawImage(imgempty,h2x,h2y);
            h2y=h2y-50;
            h2x=h2x-50;
            ctx.drawImage(imghunter2,h2x,h2y);
            hunterPos = hunterPos.substring(0, 2) + hunterToPos[0] + hunterPos.substring(2+1);
            hunterPos = hunterPos.substring(0, 3) + hunterToPos[1] + hunterPos.substring(3+1);
            sendMessage();
          }
        }
      }

      if (e==89 /*y second hunter up right*/){
        if(h2x<370 && h2y>21) {
          var hunterFromPos=hunterPos.substring(2,4);
          var hunterToPos=String.fromCharCode(hunterFromPos.charCodeAt(0)+1);
          var hunterToPos=hunterToPos+String.fromCharCode(hunterFromPos.charCodeAt(1)+1);
          if((checkWolfSameAsHunter(hunterToPos)===false)&&(checkHunterSameAsOtherHunter(hunterToPos)===false)) {
            ctx.drawImage(imgempty,h2x,h2y);
            h2y=h2y-50;
            h2x=h2x+50;
            ctx.drawImage(imghunter2,h2x,h2y);
            hunterPos = hunterPos.substring(0, 2) + hunterToPos[0] + hunterPos.substring(2+1);
            hunterPos = hunterPos.substring(0, 3) + hunterToPos[1] + hunterPos.substring(3+1);
            sendMessage();
          }
        }
      }

      if (e==85 /*u third hunter up left*/){
        if(h3x>20 && h3y>21) {
          var hunterFromPos=hunterPos.substring(4,6);
          var hunterToPos=String.fromCharCode(hunterFromPos.charCodeAt(0)-1);
          var hunterToPos=hunterToPos+String.fromCharCode(hunterFromPos.charCodeAt(1)+1);
          if((checkWolfSameAsHunter(hunterToPos)===false)&&(checkHunterSameAsOtherHunter(hunterToPos)===false)) {
            ctx.drawImage(imgempty,h3x,h3y);
            h3y=h3y-50;
            h3x=h3x-50;
            ctx.drawImage(imghunter3,h3x,h3y);
            hunterPos = hunterPos.substring(0, 4) + hunterToPos[0] + hunterPos.substring(4+1);
            hunterPos = hunterPos.substring(0, 5) + hunterToPos[1] + hunterPos.substring(5+1);
            sendMessage();
          }
        }
      }

      if (e==73 /*i third hunter up right*/){
        if(h3x<370 && h3y>21) {
          var hunterFromPos=hunterPos.substring(4,6);
          var hunterToPos=String.fromCharCode(hunterFromPos.charCodeAt(0)+1);
          var hunterToPos=hunterToPos+String.fromCharCode(hunterFromPos.charCodeAt(1)+1);
          if((checkWolfSameAsHunter(hunterToPos)===false)&&(checkHunterSameAsOtherHunter(hunterToPos)===false)) {
            ctx.drawImage(imgempty,h3x,h3y);
            h3y=h3y-50;
            h3x=h3x+50;
            ctx.drawImage(imghunter3,h3x,h3y);
            hunterPos = hunterPos.substring(0, 4) + hunterToPos[0] + hunterPos.substring(4+1);
            hunterPos = hunterPos.substring(0, 5) + hunterToPos[1] + hunterPos.substring(5+1);
            sendMessage();
          }
        }
      }

      if (e==79 /*o fourth hunter up left*/){
        if(h4x>20 && h4y>21) {
          var hunterFromPos=hunterPos.substring(6,8);
          var hunterToPos=String.fromCharCode(hunterFromPos.charCodeAt(0)-1);
          var hunterToPos=hunterToPos+String.fromCharCode(hunterFromPos.charCodeAt(1)+1);
          if((checkWolfSameAsHunter(hunterToPos)===false)&&(checkHunterSameAsOtherHunter(hunterToPos)===false)) {
            ctx.drawImage(imgempty,h4x,h4y);
            h4y=h4y-50;
            h4x=h4x-50;
            ctx.drawImage(imghunter4,h4x,h4y);
            hunterPos = hunterPos.substring(0, 6) + hunterToPos[0] + hunterPos.substring(6+1);
            hunterPos = hunterPos.substring(0, 7) + hunterToPos[1] + hunterPos.substring(7+1);
            sendMessage();
          }
        }
      }

      if (e==80 /*p fourth hunter up right*/){
        if(h4x<370 && h4y>21) {
          var hunterFromPos=hunterPos.substring(6,8);
          var hunterToPos=String.fromCharCode(hunterFromPos.charCodeAt(0)+1);
          var hunterToPos=hunterToPos+String.fromCharCode(hunterFromPos.charCodeAt(1)+1);
          if((checkWolfSameAsHunter(hunterToPos)===false)&&(checkHunterSameAsOtherHunter(hunterToPos)===false)) {
            ctx.drawImage(imgempty,h4x,h4y);
            h4y=h4y-50;
            h4x=h4x+50;
            ctx.drawImage(imghunter4,h4x,h4y);
            hunterPos = hunterPos.substring(0, 6) + hunterToPos[0] + hunterPos.substring(6+1);
            hunterPos = hunterPos.substring(0, 7) + hunterToPos[1] + hunterPos.substring(7+1);
            sendMessage();
          }
        }
      }
    } else {
      outputLog("Nu är det vargens tur att flytta");
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
  function checkWolfSameAsHunter(hunterToPos) {
    if (hunterToPos.substring(0, 2)===wolfPos.substring(0,2)) {
      return true;
    }
    return false;
  }

  /**
  * Check if hunter and anoter hunter are on the same position.
  */
  function checkHunterSameAsOtherHunter(hunterToPos) {

    if (hunterToPos.substring(0, 2)===hunterPos.substring(0,2)) {
      return true;
    }
    if (hunterToPos.substring(0, 2)===hunterPos.substring(2,4)) {
      return true;
    }
    if (hunterToPos.substring(0, 2)===hunterPos.substring(4,6)) {
      return true;
    }
    if (hunterToPos.substring(0, 2)===hunterPos.substring(6,8)) {
      return true;
    }
    return false;
  }

  /**
  * DisplayWolf
  */
  function DisplayWolf() {
    ctx.drawImage(imgempty,w1x,w1y);
    w1x=20+((wolfPos.charCodeAt(0)-65)*50);
    w1y=371-((wolfPos.charCodeAt(1)-49)*50);
    ctx.drawImage(imgwolf,w1x,w1y);
  }

  setupConnection();
  closeConnection();
});
