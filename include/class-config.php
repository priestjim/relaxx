<?php
/* --------------------  /
/  Relax Player          /
/  class - config        /
/  -------------------- */

class config{
   var $version = "0.7.0";
   var $admin_name = "admin";
   var $admin_pass = "d41d8cd98f00b204e9800998ecf8427e";
   var $host = "127.0.0.1";
   var $port = "6600";
   var $pass = "";
   var $output = "1";
   var $template = "default";
   var $language = "en";
   var $volume = 100;
   var $repeat = false;
   var $random = false;
   var $fade = 5;
   var $rights = array  (  // anonymous userrights
         "add_songs" => "selected",
         "start_playing" => "selected",
         "pause_playing" => "selected",
         "set_volume" => "selected",
         "controll_playlist" => "selected",
         "controll_player" => "selected",
         "admin_relaxx" => "",
         "admin_mpd" => ""
   );
   var $plcolumns = "Pos:Artist:Title:Album:Genre:Time";
   var $trcolumns = "Artist:Title:Genre:Time";

   /* save constructor */
   function config($cfile){
   	  if (!file_exists($cfile)) {
   	  	  $this->save($cfile);
   	  }
   	  $version = $this->version;
   	  $xml = simplexml_load_file($cfile);
   	  $class = get_class_vars("config");
      while (list($key, $val) = each($class)) {
    	  if (is_array($val)) {
    	    foreach ($val as $array_key => $array_val) { $this->{$key}[$array_key] = $xml->$key->$array_key; }
    	  } else if (isset($xml->$key)) { $this->$key=$xml->$key; }
      }
      if (trim($this->pass =="")) { $this->pass = null; }
      // rewrite config if version changed
   	  if ($version != $this->version) {
   	  	  $this->version = $version;
   	  	  $this->save($cfile);
   	  }
      return true;
   }

   /* get postvars into object-data */
   function getPost(){
   	   global $_POST;
       $class = get_class_vars("config");
  	   while (list($key, $val) = each($class)) {
  	       if (is_array($val)) {
  	        	/* handle multiple selects */
               foreach ($val as $array_key => $array_val) { $this->{$key}[$array_key] =""; }
               foreach ($_POST[$key] as $array_key => $array_val) {  $this->{$key}[$array_val] = "selected"; }
  	       } else if (isset($_POST[$key]) && ($_POST[$key]!="PASSWORD")) $this->$key = $_POST[$key];
  	   }
  	   if ($_POST['admin_pass']!="PASSWORD") $this->admin_pass = md5($this->admin_pass);
   }

   /* get or set the MPS output */
   function controllOutput($action,$value) {

   }

   /* save config to xml */
   function save($cfile){
   	  $handle = fopen($cfile, 'w');
   	  if ($handle===false) {
   	  	echo "Error: I can not open ".$cfile." fo write. please make shure, that the config directory and the file are writable.";
   	  	die();
   	  }
   	  fwrite($handle,"<?xml version='1.0' standalone='yes'?>\n<config>\n");
   	  $class = get_class_vars("config");
      while (list($key, $val) = each($class)) {
    	  if (is_array($val)) {
    	  	fwrite($handle,"<".$key.">\n");
    	  	foreach ($this->$key as $array_key => $array_val) { fwrite($handle,"<".$array_key.">".$array_val."</".$array_key.">\n"); }
    	  	fwrite($handle,"</".$key.">\n");
    	  } else{
	        fwrite($handle,"<".$key.">".$this->$key."</".$key.">\n");
    	  }
   	  }
   	  fwrite($handle,"</config>\n");
      fclose($handle);
      chmod($cfile,0600);
   	  return true;
   }

   /* print admin form */
   function edit(){
   	 global $lng;
    echo "<h1>".$lng->adm_settings."</h1>";
    echo "<form id='login' name='login' action='".$_SERVER['PHP_SELF']."' method='post'>".
        "<div style='display:block; overflow:none; height:320px'><div id='dirTabs'><ul class='mootabs_title'>".
        "<li title='Tglobal'>global</li>".
		"<li title='Trelaxx'>relaxx</li>".
	    "</ul><div id='Tglobal' class='mootabs_panel' style='height:280px'>".
        "<fieldset><legend>MPD</legend><table>".
		"<tr><th>MPD Host<td><input name='host' value='".$this->host."'>".
		"<tr><th>MPD Port<td><input name='port' value='".$this->port."'>".
        "<tr><th>MPD Password<td><input name='pass' type='password' value='PASSWORD'>".
		"<tr><th>".$lng->output."<td><select id='outputSelect' name='output' size='2' onchange='toggleOutput()' multiple><option>error no output</option></select>".
        "</table></fieldset>".
        "<fieldset><legend>RelaXX - ".$lng->administrator."</legend><table>".
		"<tr><th>".$lng->administrator."<td><input name='admin_name' value='".$this->admin_name."'>".
		"<tr><th>".$lng->password."<td><input name='admin_pass' type='password' value='PASSWORD'>".
        "</table></fieldset>".
	    "</div><div id='Trelaxx' class='mootabs_panel' style='height:280px'>".
        "<fieldset><legend>RelaXX - ".$lng->config."</legend><table>".
		"<tr><th>".$lng->adm_template."<td><select name='template'>";
     foreach ($this->getSubdirs("./templates/") as $key => $val) {
          echo "<option value='".$val."' ";
          if ($this->template==$val) echo "selected";
          echo ">".$val."</option>";
     }
     echo "</select><tr><th>".$lng->adm_language."<td><select name='language'>";
     foreach ($this->getSubdirs("./include/lang/") as $key => $val) {
   	      echo "<option value='".$val."' ";
          if ($this->language==$val) echo "selected";
          echo ">".$val."</option>";
     }
     echo "</select><tr><th>".$lng->adm_rights."<td><select name='rights[]' size='5'   multiple>";
     foreach ($this->rights as $key => $val) {  echo "<option value='$key' $val>".$key."</option>"; }
     echo "</select>".
		  "<tr><th>Playlist columns<td><input name='plcolumns' value='".$this->plcolumns."'>".
		  "<tr><th>Songlist columns<td><input name='trcolumns' value='".$this->trcolumns."'>".
          "</table></fieldset></div></div></div>".
          "<div style='margin:5px;float:left; display:block;'>".
          "<button type='submit' class='positive' />".$lng->save."</button>".
          "<button class='negative' onclick='closeAndReload();'/>".$lng->close."</button>".
          "</div><div style='float:right;display:inline;margin:5px;'><button onclick='updateDatabase(); return false;' style='background-image: url(./images/warning.gif);'>".$lng->adm_updatedb."</button></div></form>";
   }

   /* get availiable templates and languages */
   function getSubdirs($path){
   	   $values= array();
		if (is_dir($path)) {
		   if ($dh = opendir($path)) {
              while (($file = readdir($dh)) !== false) {
              	 if ((filetype($path . $file)=="dir") && ($file!=".") && ($file!="..")) array_push($values,$file);
              }
              closedir($dh);
          }
       }
       return $values;
   }

   /* get availiable templates and languages : returns true or false*/
   function checkRights($context) {
   	if (($_SESSION['relaxx'] != "anonymous") || ($this->rights[$context]!="")) {
   		return true;
   	} else {
   		return false;
   	}
   }

}
?>