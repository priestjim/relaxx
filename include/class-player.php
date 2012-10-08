<?php
/* ---------------------------------------------- /
/  Relax Player 0.6 	                          /
/  class player                                   /
/  initial player functions                       /
/  ----------------------------------------------*/

class player{
  var $data = "";
  var $error = null;
  var $useIcons = true;

  // connect to MPD and get rootdir content
  function player($withIcons=true) {
	global $config;
	($withIcons) ?	$this->imgPath = "templates/".$config->template."/images/" : $this->useIcons = false;

  	// include MPD-lib and connect
    require_once 'include/lib-mpd.php';
    $this->mdb = Net_MPD::factory('Database', $config->host, intval($config->port), $config->pass);
    if (!$this->mdb->connect()) {
    	$this->error = 'Connection failed';
    	return false;
	}
	// get the root filelist
	if ($this->mdb->isCommand('lsinfo')) $this->data = $this->mdb->getInfo("");
    return true;
   }

/* xxDirectory()
 *   Description: prints selection-tab with treemenu
 *   Params: none
*/
  function xxDirectory() {
   echo "<div style='margin:0px;padding:0px;display:block;width:auto;'><ul id='treemenu' class='treelist'>";
   echo "<li class='' id='treeroot' onclick='refreshTracklist(\"\",\"/\");'>/</li>";
   if (isset($this->data['directory'])) {
      echo "<ul>";
      foreach ($this->data['directory'] as $entry) {
      	 // look for subdirs in every entry
      	 $subdata = $this->mdb->getInfo($entry);
      	 // select dirs with subdirs with a class tag
       	 $class = (isset($subdata['directory'])) ? "" :  "empty";
       	 $dval = str_replace(" ","&nbsp;",$entry);
       	 $dval = strtr($dval,"-)(",".][");
         echo "<li class='".$class."' onclick='getDir(event);' title='".urlencode($entry)."'>".$dval."</li>";
      }
      echo "</ul>";
   }
   echo "</ul></div>";
  }


/* xxSearch()
 *   Description: prints a search form
 *   Params: $listcount = number of rows in input field (default = 7)
*/
  function xxPlaylistform($listcount = 7) {
  	   global $lng;
   	   echo "<h1>".$lng->tab_playlists."</h1>";
  	   echo "<table class='normTable' style='width:auto'><tr><td>";
  	   echo "<select id='playlistSelect' name='playlistSelect' onclick='refreshTracklist(\"listPlaylistInfo\",this.value)' size='".$listcount."'></select>";
  	   $icon = ($this->useIcons) ? $this->imgPath."append.gif" : "";
  	   echo "</td><td valign=top><button onclick='controllRemote(\"loadPlaylist\",$(\"playlistSelect\").value,true,\"playlist\")' style='width:9em;background-image:url(".$icon.");'>".$lng->pl_append."</button><br />";
  	   $icon = ($this->useIcons) ? $this->imgPath."replace.gif" : "";
  	   echo "<button onclick='controllRemote(\"clear\",\"\",true,\"playlist\"); controllRemote(\"loadPlaylist\",$(\"playlistSelect\").value,true,\"playlist\")' style='width:9em;background-image:url(".$icon.");'>".$lng->pl_replace."</button><br />";
  	   $icon = ($this->useIcons) ? $this->imgPath."delete.gif" : "";
  	   echo "<button onclick='controllRemote(\"deletePlaylist\",$(\"playlistSelect\",true).value,false,\"playlist\"); loadPlaylists();' style='width:9em;background-image:url(".$icon.");'>".$lng->pl_delete."</button><br />";
  	   $icon = ($this->useIcons) ? $this->imgPath."save.gif" : "";
  	   echo "<button onclick='savePlaylist();' style='width:9em;background-image:url(".$icon.");'>".$lng->pl_save."</button></td></tr></table>";
}

/* xxPlaylistform()
 *   Description: prints a form to handle MPD playlists
 *   Paramaters: none
*/
  function xxSearchform() {
  	   global $lng, $config;
 	   echo "<h1>".$lng->tab_search."</h1>";
  	   echo "<form action='#' onsubmit='if (this.search.value!=\"\") refreshTracklist(\"search\",this); return false;' >";
  	   echo "<table class='normTable' style='width:auto'><tr><td>".$lng->search_for."<br />".
  	        "<input id='searchField' name='search' value='' onclick='this.focus();' onkeydown='current_element=\"input\"' /><tr><td>".
  	         $lng->search_in."<br /><select id='searchTarget' name='target' onmousedown='alert(\"bla\"); return:true;'><option value='any' standard>".$lng->any.
  	        "<option value='artist'>".$lng->artist.
  	        "<option value='title'>".$lng->title.
  	        "<option value='genre'>".$lng->genre.
  	        "<option value='date'>".$lng->date.
  	        "<option value='filename'>".$lng->file.
  	        "<option value='comment'>".$lng->comment."</select><br />";
  	   $icon = ($this->useIcons) ? $this->imgPath."search.gif" : "";
  	   echo "<tr><td><br/><button type='submit' style='background-image: url(".$icon.");'>".$lng->tab_search."</button></table></form></p>";
  }


/* xxAllfiles()
 *   Description: List all files
 *   Paramaters: none (unused)
*/
 function xxAllfiles() {
   echo "<h1>Playlist</h1><ul>";
   foreach ($this->data['file'] as $entry) {
      echo "<li>".$entry."</li>";
   }
   echo "</ul>";
 }

/* xxMenu()
 *   Description: basic menu
 *   Paramaters: $aspect (default=hor)
*/
  function xxMenu($aspect="vert") {
	global $lng;
	echo "<a id='menu_login' class='menu' href='#' onclick='loginOut(false); return false;'>"
	      .(($_SESSION['relaxx']=='anonymous') ? $lng->login : $lng->logout)."</a>";
	echo "<a class='menu' href='#' onclick='doAdmin(this);return false;'>".$lng->config."</a>";
 }

/* xxPlayerButtons()
 *   Description: Display Player-controll-buttons
 *   Paramaters: none
*/
 function xxPlayerButtons() {
	global $lng;
	echo "<a href='#' class='player' onClick='controllRemote(\"prevSong\",\"\",true,\"playback\");return false;'><img class='button' src='".$this->imgPath."previous.gif' title='".$lng->previous."'/></a>";
	echo "<a href='#' class='player' onClick='controllRemote(\"stop\",\"\",true,\"playback\");return false;'><img class='button'  src='".$this->imgPath."stop.gif' title='".$lng->stop."' /></a>";
	echo "<a href='#' class='player' onClick='togglePlay();return false;'><img  class='button' src='".$this->imgPath."play.gif' id='play_button' title='".$lng->play."' /></a>";
	echo "<a href='#' class='player' onClick='controllRemote(\"nextSong\",\"\",true,\"playback\");return false;'><img class='button' src='".$this->imgPath."next.gif' title='".$lng->next."' /></a>";
  }

/* xxPlayposSlider()
 *   Description: Display Playpos Slider
 *   Paramaters: none
*/
  function xxPlayposSlider() {
	echo "<div id='playpos'><div id='plposKnob' class='knob'></div></div>";
  }

/* xxVolumeSlider()
 *   Description: Display Volume Slider
 *   Paramaters: none
 */
  function xxVolumeSlider() {
	echo "<div id='volume'><div id='volKnob'class='knob'></div></div>";
  }

}

?>
