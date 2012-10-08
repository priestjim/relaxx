<?php
/* ----------------------------------------------  /
/  Relax Player                                    /
/                                                  /
/  AJAX controller for MPD - admin functions	   /
/  ---------------------------------------------- */
 session_start();
 
 ini_set('default_mimetype','text/javascript');
 header("Content-type: text/javascript;  charset=utf-8");  
 
 // read config
 require("class-config.php");   
 $config = new config("../config/config.php");
 
 if (isset($_SESSION['relaxx'])) {
     
   // include MPD-lib and connect
   require_once 'lib-mpd.php';
   $MPD = Net_MPD::factory('Admin', $config->host, intval($config->port), $config->pass);
   if (!$MPD->connect()) {   
   	    echo json_encode('error');   	
   		die();   	    
   }
   
   // switch ond action
   switch($_GET['action'])
	{
		case 'getOutputs':
			 $status = ($MPD->isCommand('outputs')) ? $MPD->getOutputs() : 'error';
			 break;
		case 'disableOutput':
			($MPD->isCommand('disableoutput')) ? $MPD->disableOutput($_GET['value']) : $status = "error";
			break;		
		case 'enableOutput':
			($MPD->isCommand('enableoutput')) ? $MPD->enableOutput($_GET['value']) : $status = "error";
			break;		
		case 'kill':
			($MPD->isCommand('kill')) ? $MPD->kill() : $status = "error";
			break;		
		case 'updateDatabase':
			($MPD->isCommand('update')) ? $MPD->updateDatabase($_GET['value']) : $status = "error";			
			break;					
	}
	echo json_encode($status);		
 }
?>
