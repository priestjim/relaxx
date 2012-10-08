<?php
/* ----------------------------------------------  /
/  Relax Player                                    /
/                                                  /
/  AJAX controller for playlist commands		   /
/  ---------------------------------------------- */
 session_start();
 
 ini_set('default_mimetype','text/javascript');
 header("Content-type: text/javascript;  charset=utf-8"); 
 if (isset($_SESSION['relaxx'])) {
 	
   // read config
   require("class-config.php");   
   $config = new config("../config/config.php");
   
   // include MPD-lib and connect
   require_once 'lib-mpd.php';
   $MPD = Net_MPD::factory('Playlist', $config->host, intval($config->port), $config->pass);
   if (!$MPD->connect()) {
   	    echo json_encode('error');   	
   	    die();   	    
	}
	
	$status = "success";
	
   // switch ond action
	switch($_GET['action'])
	{
		case 'getPlaylistInfo':
			$status = ($MPD->isCommand('playlistinfo')) ? $MPD->getPlaylistInfo($_GET['value']) : 'error';
    		break;			
		case 'getPlaylists':
			$status = ($MPD->isCommand('lsinfo')) ? $MPD->getPlaylists() : 'error';
			break;			
		case 'getCurrentSong':
			$status = ($MPD->isCommand('currentsong')) ? $MPD->getCurrentSong() : 'error';
			break;									
		case 'listPlaylistInfo':
			$status = ($MPD->isCommand('listplaylistinfo')) ? $MPD->listPlaylistInfo($_GET['value']) : 'error';
			break;									
		case 'savePlaylist':
			($config->checkRights("controll_playlist") && $MPD->isCommand('save')) ? $MPD->savePlaylist(strip_tags($_GET['value'])) : $status = "error";
    		break;			    		
		case 'loadPlaylist':
			($config->checkRights("controll_playlist") && $MPD->isCommand('load')) ? $MPD->loadPlaylist($_GET['value']) : $status = "error";
    		break;			    		
    	case 'deletePlaylist':
			($config->checkRights("controll_playlist") && $MPD->isCommand('rm')) ? $MPD->deletePlaylist($_GET['value']) : $status = "error";
    		break;			    		
    	case 'addSong':
    		($config->checkRights("add_songs") && $MPD->isCommand('add')) ? $MPD->addSong($_GET['value']) : $status = "error";
    		break;			
		case 'swapSong':
			$pos = split(":",$_GET['value']);
			($config->checkRights("controll_playlist") && $MPD->isCommand('swap'))  ? $MPD->swapSong($pos[0],$pos[1]) : $status = "error";
    		break;			
		case 'moveSong':
			$pos = split(":",$_GET['value']);
			($config->checkRights("controll_playlist") && $MPD->isCommand('move')) ? $MPD->moveSong($pos[0],$pos[1]) : $status = "error";
    		break;			
    	case 'deleteSong':
    		if (($config->checkRights("controll_playlist") && $MPD->isCommand('delete')) ) {
    		  $ids = split(":",$_GET['value']);
    		  foreach ($ids as $id) { if ($id!="") $MPD->deleteSongId(intval($id));  }
	        } else {
			  $status = "error";
	        }  
			break;			    		
		case 'clear':
			($config->checkRights("controll_playlist") && $MPD->isCommand('clear')) ? $MPD->clear() : $status = "error";
			break;			    		
	}
	echo json_encode($status);			
 }
?>