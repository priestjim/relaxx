<?php
/* ----------------------------------------------  /
/  Relax Player                                    /
/                                                  /
/  Load the plugin content and returns HTML data   /
/  ---------------------------------------------- */

 session_start();

 /*
  * relaXX plugins are xml-resopnder returning htmlcode
  * in a popup box or tab. The controller calls the display
  * function of the class and returns the output.
  */
 ini_set('default_mimetype','text/html');
 header("Content-type: text/html;  charset=utf-8");

 if (isset($_SESSION['relaxx'])) {
   $plugin_name = strtolower(strip_tags($_GET['plugin']));
   if (file_exists('../plugins/'.$plugin_name.'/plugin.php')) {
   	 // read config
     require_once("class-config.php");        
   	 $config = new config("../config/config.php");
   	 // read read plugin and execute
   	 require_once('../plugins/'.$plugin_name.'/plugin.php');
   	 if (!file_exists('../plugins/'.$plugin_name.'/lang/'.$config->language.".xml")) { $config->language = "en"; }
   	 $plugin = new $plugin_name($config->language);
   	 // get output
   	 $plugin->display();
   }	else {
   	 echo "Error";
   }
 }
 
?>
