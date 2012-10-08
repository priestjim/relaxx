<?php
/* ----------------------------------------------  /
/  Relax Player                                    /
/                                                  /
/  AJAX Controller for MPD Common functions		   /
/  ---------------------------------------------- */
 session_start();
 
 ini_set('default_mimetype','text/javascript');
 header("Content-type: text/javascript;  charset=utf-8");  
 
 // read config
 require("class-config.php");   
 $config = new config("../config/config.php");
 
   // include MPD-lib and connect
   require_once 'lib-mpd.php';
   $MPD = Net_MPD::factory('Common', $config->host, intval($config->port), $config->pass);
   if (!$MPD->connect()) die();
   
   $status = "success";   
   
   // switch ond action
   switch($_GET['action'])
	{
		case 'getStats':
			 $status = ($MPD->isCommand('stats')) ? $MPD->getStats() : 'error';
  		     break;		
		case 'getCommands':
			 $status = ($MPD->isCommand('commands')) ? $MPD->getCommands() : 'error';
  		     break;		
	}
   echo json_encode($status);		
?>