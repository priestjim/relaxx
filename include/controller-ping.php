<?php
/* ----------------------------------------------  /
/  Relax Player                                    /
/                                                  /
/  AJAX Controller to get MPD Status			   /
/  ---------------------------------------------- */

 // read config - its much faster to get it from a session variable


 session_start();

 ini_set('default_mimetype','text/javascript');
 header("Content-type: text/javascript;  charset=utf-8"); 
 
 if (isset($_SESSION['relaxx_hostdata'])) {
   $config = split(";",$_SESSION['relaxx_hostdata'],3);
   if ($config[2]=="") { $config[2]= null; }
   // include MPD-lib and connect
   require_once 'lib-mpd.php';
   
   $MPD_COMMON = Net_MPD::factory('Common', $config[0] , $config[1], $config[2]);
   if ((!$MPD_COMMON->connect()) or (!$MPD_COMMON->isCommand('status'))) {
   	  echo '({"error":"connect"})';
   	  die();
   }
      
   // ping and exit
   $status = $MPD_COMMON->getStatus();
   echo '{"status":'.json_encode($status).'';

   $plpos = $_GET['value'];      
   // is the actual playlist position different then the recent?
   if (($plpos<$status) or ($plpos==0)) {   
   		$MPD_PL = Net_MPD::factory('Playlist', $config[0], $config[1], $config[2]);   
   		$getChanges = $MPD_PL->getChanges($_GET['value']);
   		if($getChanges!='true') {
        	echo ',"playlist":'.json_encode($getChanges)."";
   		}
   }		   
   echo '}';
   
 }   
?>