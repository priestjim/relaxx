<?php
/* ----------------------------------------------  /
/  RelaXXPlayer                                    /
/  Main administration output			           /
/  ---------------------------------------------- */

   session_start();

   // read config
   require("./include/class-config.php");   
   $config = new config("./config/config.php");

   // include language-file
   $lng = simplexml_load_file("./include/lang/".$config->language."/lang.xml");

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta content="www.dirk-hoeschen.de" name="Author" />
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>RelaXXPlayer</title>
<link rel="shortcut icon" href="favicon.ico" />
<script src="js/mootools.js"></script>
<script src="js/mootabs.js"></script>
<script src="js/admin.js"></script>
<link href="templates/<?php echo $config->template; ?>/template.css" rel="stylesheet" type="text/css" />
<link href="templates/<?php echo $config->template; ?>/styles/mootabs.css" rel="stylesheet" type="text/css" />
<style type="text/css">
   /* reset body style */
   body {
      padding: 5px;
      overflow: auto;
      height:auto; 
   }
   html {
      overflow: auto;    
   }
      
   /* table style */
	table {
	  width:100%;
	  border-spacing:4px;
	  margin: 0;
    }

	td {
	   margin: 0px;
	   text-align: left;    
     }

    th {
	   width:150px;
	   text-align: right;
	   font-weight:normal;
	   vertical-align: top;
	   margin: 0px;
	   border: 0;
     }

</style>
</head>
<body>       
<?php      
   // user is registered and the mainadmin
   if (isset($_SESSION['relaxx']) && ($_SESSION['relaxx']==$config->admin_name) && ($_SESSION['relaxx_pass']==$config->admin_pass)) {
  	
     // update config
     if (isset($_POST['host']))  {
   	    $config->getPost(); 
        $config->save('./config/config.php'); 
     }

  	$config->edit();
  	
  } else {  
  	// user is not valid	
  	echo "<h3>".$lng->error."</h3><p>".str_replace("\\n","<br />",$lng->error_login)."</p>";
  } 
?>
</body>
</html>
