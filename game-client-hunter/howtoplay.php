<!-- Doc header, style sheets and javascripts -->
<?php $path=__DIR__; include(__DIR__ . '/gameheader.php');?>


<!-- Display main navigation menu -->
<nav id="navigationmenu"></nav>

<!-- Display header -->
<h1>Hur man spelar</h1>

<!-- Display about text -->
Jägarna och Vargen är en variant på schack där vargen representeras</br>
av den svarta pjäsen och där jägarna representerar de vita pjäserna.</br>
Jägarna börjar på rad 1 och vargen börjar på rad 8.</br>
<img src='img/gameplay1.JPG' alt='Start position' height='200'>
</br></br>

Vargen flyttar med tangenter q,w,a,s. Jägare 1 flytter med tangenter e,r.</br>
Jägare 2 flyttar med tangenter t,y. Jägare 3 flytter med tangenter u,i.</br>
Jägare 4 flyttar med tangenter o,p.</br>
Vargen flyttar först. Sedan flyttar en Jägare och sedan vargen igen.</br>
Jägarna och vargen får endast flyttas på de svarta rutorna och dom</br>
får bara gå ett steg i taget.</br>
Vargen får gå i alla riktningar. Snett upp och snett neråt.</br>
Jägarna får bara gå i riktningen uppåt från brädposition 1 upp till</br>
position 8.</br>
<img src='img/gameplay7.JPG' alt='Moving directions' height='200'>
</br></br>
Målet för vargen är att vinna genom att komma ner till rad 1</br>
eller att ta sig förbi alla jägarna.</br>
<img src='img/gameplay2.JPG' alt='Wolf win 1' height='200'>
<img src='img/gameplay3.JPG' alt='Wolf win 2' height='200'>
</br></br>
Jägarna ( de vita pjäserna) vinner om de lyckas låsa in vargen så</br>
att vargen inte kan flytta sig och därmed är fångad.</br>
<img src='img/gameplay5.JPG' alt='Hunters win 1' height='200'>
<img src='img/gameplay6.JPG' alt='Hunters win 2' height='200'>
</br></br>
</p>

<!-- Doc footer, copyright and javascripts -->
<?php $path=__DIR__; include(__DIR__ . '/gamefooter.php'); ?>
