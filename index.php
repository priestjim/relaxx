<?php
/* ----------------------------------------------  /
/  RelaXXPlayer 0.70			      	               /
/  home: http://relaxx.sourceforge.net/            /
/  updates: http://sourceforge.net/projects/relaxx /
/                                                  /
/  © 2008 Dirk Hoeschen (relaxx@dirk-hoeschen.de)  /
/                                                  /
/  This program is relased under GPLv3             /
/  http://www.gnu.org/licenses/gpl.html            /
/  ---------------------------------------------- */

   // prevent phpsession urls
   ini_set('url_rewriter.tags','');

   // register anonymous session
   session_start(); 
   
   // reset the login status every time the page reloads
   $_SESSION['relaxx'] = 'anonymous';
   $_SESSION['relaxx_pass'] = "not valid";   
      
   // read config
   require("include/class-config.php");   
   $config = new config("config/config.php");
   
   // no need to read config every ping
   $_SESSION['relaxx_hostdata'] = $config->host.";".$config->port.";".$config->pass;
   
   // include language-file
   $lng = simplexml_load_file("include/lang/".$config->language."/lang.xml");
   
   // read player functions
   require_once("include/class-player.php");
   $player = new player();   
   
   // some Headerentries --- no need to change
   $defaultHeader = '<meta content="&copy; 2009 Hoeschen" name="Copyright" />
	  <meta content="relaxx.dirk-hoeschen.de" name="Author" />
	  <meta http-equiv="cache-control" content="no-cache" />
      <link rel="shortcut icon" href="favicon.ico" />
      <title>RelaXXPlayer</title>
      <script type="text/javascript">
         var language =  new Object; language = '.str_replace("\\n", "<br />",json_encode($lng)).'; 
         var imgpath="./templates/'.$config->template.'/images/"; 
         var version="'.$config->version.'"; 
         var adminName="'.$_SESSION['relaxx'].'";
         var version="'.$config->version.'";
		 var plcolumns ="'.$config->plcolumns.'";
		 var plcolumns = plcolumns.split(":");         
		 var trcolumns ="'.$config->trcolumns.'";
		 var trcolumns = trcolumns.split(":");         
	 </script>';
        
   // include template
   require("templates/".$config->template."/template.inc");   
?>