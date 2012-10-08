<?php
/* ----------------------------------------------  /
/  Relax Player                                    /
/                                                  /
/  AJAX controller to get tracklist content	   /
/  ---------------------------------------------- */
 session_start();
 
 if ($_GET['action']=="extendTree") {
 	ini_set('default_mimetype','text/xml');
 	header("Content-type: text/xml;  charset=utf-8");
 } else {    
 	ini_set('default_mimetype','text/javascript');
 	header("Content-type: text/javascript;  charset=utf-8"); 
 }	
 
 if (isset($_SESSION['relaxx'])) {
   	
   // read config
   require("class-config.php");   
   $config = new config("../config/config.php");
   
   // include MPD-lib and connect
   require_once 'lib-mpd.php';
   $MPD = Net_MPD::factory('Database', $config->host, intval($config->port), $config->pass);
    if (!$MPD->connect()) {
   	    echo json_encode('error');   	
   	    die();   	    
	}
		
	// switch Tab
 	switch($_GET['action'])
	{
		case 'extendTree': // returns next directory level in html/xml
		  if ($MPD->isCommand('lsinfo')) {	 
			$data = $MPD->getInfo($_GET['dir']);
			if ($data['directory']) {
		      foreach ($data['directory'] as $entry) {
		      	// look for subdirs in every entry     		
		      	$subdata = $MPD->getInfo($entry); 
		      	// select dirs with subdirswith a class tag 
		      	$class = (isset($subdata['directory'])) ? "" :  "empty";        	
       	 		$dval = str_replace(" ","&nbsp;",substr($entry,strrpos($entry,'/')+1));       	
       	 		$dval = strtr($dval,"-)(",".][");
		      	
		      	echo "<li class='".$class."' onclick='getDir(event);' title='".urlencode($entry)."'>".$dval."</li>";
		      }	
		 	}
         	die();
      	  }	
		  break;			
		case 'directory':
		  if ($MPD->isCommand('lsinfo')) {	 
			$data = $MPD->getInfo($_GET['dir']);
 	        echo json_encode($data);
 	        die();   		
		  } 	
		  break;			
		case 'search':
		  if ($MPD->isCommand('search')) {	 
			$params = array($_GET['type'] => $_GET['search']);
			$data = $MPD->find($params);			
			echo "{";
			if ($data[0]!="") { echo "file: ".json_encode($data); }
			echo "}";
 	        die();
		  }     		
		 break;
	}	
	echo json_encode('error');	
 }
?>
