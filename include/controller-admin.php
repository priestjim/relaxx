<?php
/* ----------------------------------------------  /
/  Relax Player                                    /
/                                                  /
/  Control ADMIN / USER - Login and logout	   /
/  ---------------------------------------------- */

 session_start();
 
 ini_set('default_mimetype','text/javascript');
 header("Content-type: text/javascript;  charset=utf-8"); 
 
 if (isset($_SESSION['relaxx'])) {
  	
   // read config
   require("class-config.php");   
   $config = new config("../config/config.php");
   if ($_SESSION['relaxx'] == "anonymous") {
   	  if (($config->admin_name == $_POST['admin']) && ($config->admin_pass == md5($_POST['password']))) {
   	  	 $_SESSION['relaxx'] = $_POST['admin'];   	 
   	  	 $_SESSION['relaxx_pass'] = md5($_POST['password']);   	 
   	  } else {
         echo "({'error' : 'login'})";
         die;
   	  }
   } else {
   	 $_SESSION['relaxx'] = "anonymous";   	 
   	 $_SESSION['relaxx_pass'] = "not valid";
   }
   echo "({'user' : '".$_SESSION['relaxx']."', 'openConfig' : '".$_GET['openConfig']."'})";
 }
?>