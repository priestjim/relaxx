<?php
/* --------------------  /
/  relaXX Player         /
/  plugin - audioplayer  /
/  -------------------- */

// Displays a flash audioplayer in the local browser
 session_start();

//* relaXX plugins are xml-resopnder returning htmlcode for a popup box
 ini_set('default_mimetype','text/html');
 header("Content-type: text/html;  charset=utf-8");
 
 if (isset($_SESSION['relaxx'])) {
 	$filename = $_GET['filename']; 		 	
 	if ($filename) { 		
 		if (!fopen("../../music/".$filename,"r")) {
 			writeLngString("error_open"); 
 			die();
 		}
   // write the audioplayer flash		
?> 		
  	<script type="text/javascript" src="audio-player.js"></script>  
    <script type="text/javascript">AudioPlayer.setup("audioplayer.swf", {  width: 300, animation: "no" });</script>  
   	<p id='audioflash'>No flash installed?</p>  
    <script type='text/javascript'>
    	AudioPlayer.embed('audioflash', {soundFile: 'music/<?php echo $filename?>'});
   	</script> 		
<?php 		
 	} else {
 		writeLngString("error_nofile");
 	}
 	
 }

 // ist faster to handle language output on the client side
 function writeLngString($lngvar) { 	 	
 	 echo "<script type='text/javascript'>document.write(language.audioplayer".$lngvar.");</script>\n";
 }
?>