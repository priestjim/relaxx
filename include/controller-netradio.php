<?php
/* ----------------------------------------------  /
/  Relax Player                                    /
/                                                  /
/  Get the first URL out of a netradio PLAYLIST    /
/  ---------------------------------------------- */

 session_start();

 ini_set('default_mimetype','text/javascript');
 header("Content-type: text/javascript;  charset=utf-8");

 if (isset($_SESSION['relaxx'])) {
   $playlist = strtolower(strip_tags($_GET['playlist']));
   $url = "";
   // no http entered
   if (substr($playlist,0,4)!='http') {
   	  $playlist = "http://".$playlist;
   }
   // Get Playlist from URL - playlit format if no port is given
   if (strpos($playlist,":",5) === false) {
   	 $ext = substr(strrchr($playlist, '.'), 1); 
   	 switch ($ext) {
   	 	case "pls":
 	 	  	 $url = getPlaylist($playlist,"file");
	 	  	 $url = substr($url, (strpos($url,"=")+1)); 
 	  	 break;
   	 	case "m3u":
 	 	  	 $url = getPlaylist($playlist,"http:");
	 	  	 $url = $url; 
 	  	 break;
   	 	case "asx":
   	 	case "aspx":
   	 	case "wax":
	 	  	 $url = getPlaylist($playlist,"<ref");
	 	  	 $url = eregi_replace( "[ >\"']","",substr($url,strpos($url,"=")+1,-2)); 
	 	break;  	 	
   	 	case "xspf":
   	 		$xml = simplexml_load_file($playlist);
   	 		if ($xml->trackList) $url = $xml->trackList->track[0]->location;   	 		 
   	 	break;  	 	
	 	default:  // try to match first url in file if content is unknown
			$lines = file ($playlist);
     			if ($lines) {
	 	 	    foreach ($lines as $line) {
 	  	 		$url = getPlaylist($playlist);
				$fu = preg_match('~http:(.+?)[ "\'>]~is',trim($line)." ", $matches);
				if ($fu) { $url = substr($matches[0],0,-1); break; }
				}
			}
  	 	break;
  	 }   	   	 
   } else { // assume it is a raw url to a steam and return   	  
      $url = $playlist;
   }
   if ($url!="") {
      echo '({"url":"'.$url.'"})';
   } else {
      echo '({"error":"radiostream"})';
   }      
 }
 
// read a playlist and searchs for pattern
function getPlaylist($playlist,$tag="") {
     $lines = file ($playlist);
     if ($lines) {
      // Search for http line and return first URL
      foreach ($lines as $line) {
      	 $line = strtolower(trim($line));
	  	  // check if stream url
   	  	 if (($line!="") && ($tag==(substr($line,0,strlen($tag)))) && ($line{0}!="#")) return $line;
     	}
     }	
     return false;
}
 
 
?>
