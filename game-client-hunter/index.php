<!-- Doc header, style sheets and javascripts -->
<?php $path=__DIR__; include(__DIR__ . '/gameheader.php');?>

<!-- Display main navigation menu -->
<nav id="navigationmenu"></nav>

<!-- Text header to display -->
<h1>Jägarna och vargen, Client Jägarna</h1>

<!-- Canvas to display chessboard and chesspices -->
<img id="chessb" width="0" height="0" src="img/Board_brown.png" alt="Chess board">
<img id="wolf" width="0" height="0" src="img/Black_Brown.png" alt="wolf">
<img id="hunter1" width="0" height="0" src="img/White_Brown.png" alt="hunter1">
<img id="hunter2" width="0" height="0" src="img/White_Brown.png" alt="hunter2">
<img id="hunter3" width="0" height="0" src="img/White_Brown.png" alt="hunter3">
<img id="hunter4" width="0" height="0" src="img/White_Brown.png" alt="hunter4">
<img id="emptysquare" width="0" height="0" src="img/empty_brown.png" alt="emptysquare">
<canvas id='canvas1' width='441' height='441'>
  Your browser does not support the element HTML5 Canvas.
</canvas>

<!-- Display output log -->
<form id='form1'>
  </br>
  <p>
    <label>Log: </label>
    </br><div id='output' class='output'></div>
  </p>
</form>

<!-- Doc footer, copyright and javascripts -->
<?php $path=__DIR__; include(__DIR__ . '/gamefooter.php'); ?>
