<?php
/* --------------------  /
/  relaXX Player         /
/  plugin - audioplayer  /
/  -------------------- */

// Displays a flash audioplayer in the local browser

class audioplayer {
	var $plugin_name = "audioplayer";
	var $title = "";
	var $filename = "";
	var $language = null;

	// load language file use english if file not exists
	function audioplayer($language) {
		// include language-file
   	   $this->language = simplexml_load_file('../plugins/'.$this->plugin_name.'/lang/'.$language.".xml");
	}  
	
	// generate output and print it out
	function display() {
		global $HTTP_SERVER_VARS;
    	$title = stripslashes($_GET['title']);
    	if (strlen($title)>40) { $title = substr($title,0,40)." ..."; }
 		$filename = strip_tags(stripslashes($_GET['filename']));
 		if ($filename!="") { 		
 			$path = $HTTP_SERVER_VARS['HTTP_REFERER'];
 			$path = substr($path,0, strrpos($path,"/"));
 			// hack for radio streams 			 
			$mpath = (substr($filename,4,3)=="://") ? '' : $path."/music/";
 			$fvars  = '<param name="flashvars" value="animation=no&bg=5C5C5C&leftbg=ffffff&rightbg=ffffff&transparentpagebg=yes&soundFile='
				.urlencode($mpath.$filename).'&playerID=audioflash"/>'; 		
// write the audioplayer flash		
?> 		
	<div style="margin-bottom: 5px;display: block;"><? echo $title ?></div>
     <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="300" height="24">
        <param name="movie" value="<? echo $path; ?>plugins/audioplayer/player.swf" />
		<?php echo $fvars ?>
		<param name="wmode" value="transparent"/>
		<param name="menu" value="false"/>
		<param value="high" name="quality"/>
        <!--[if !IE]>-->
		<object id="audioflash" width="300" height="24" type="application/x-shockwave-flash" name="audioflash" style="visibility: visible;" data="<? echo $path; ?>/plugins/audioplayer/player.swf">
        <!--<![endif]-->
          macromedia flash needed
        <!--[if !IE]>-->
			<?php echo $fvars ?>
        </object>
        <!--<![endif]-->
      </object>
<?php 		
	 }
   }

   	// activate the plugin - return output or menu list 
	function activate($context) {

	}	
   
 } 
?>