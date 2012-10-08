<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<?php echo $defaultHeader; ?>
<!-- include neccessary scripts /-->
<script src="js/mootools.js"></script>
<script src="js/mootabs.js"></script>
<script src="js/contextmenu.js"></script>
<script src="js/tablesort.js"></script>
<script src="js/dragdrop.js"></script>
<script src="js/functions.js"></script>
<script src="./templates/<?php echo $config->template; ?>/template.js"></script>
<!-- include styles /-->
<link href="./templates/<?php echo $config->template; ?>/template.css" rel="stylesheet" type="text/css" />
<link href="./templates/<?php echo $config->template; ?>/styles/mootabs.css" rel="stylesheet" type="text/css" />
<link href="./templates/<?php echo $config->template; ?>/styles/treeview.css" rel="stylesheet" type="text/css" />
<link href="./templates/<?php echo $config->template; ?>/styles/menu.css" rel="stylesheet" type="text/css" />
<link href="./templates/<?php echo $config->template; ?>/styles/table.css" rel="stylesheet" type="text/css" />
</head>
<body>
<div id="footer"><span><a href='http://relaxx.dirk-hoeschen.de'>relaXX-player</a> <?php echo $config->version; ?> Copyright © 2008 by Dirk Hoeschen. Relaeased under GPL v3.</span></div>
<!-- Container Header with 4 collumns.... menu, player,playersettings, trackinfo and logo /-->
<div id="cont_top" class="cont_top">
  <div class="pannel"><?php $player->xxMenu('vert'); ?></div>
  <div class="pannel" align="left">
      <div align="center" style="width:130px;"><div style="width:120px;"><?php $player->xxPlayerButtons(); ?></div></div>
      <div style="position:absolute;top:40px;left:10px;width:130px;"><?php $player->xxPlayposSlider(); ?></div>
  </div>      
  <div class="pannel" align="left">
       <div style="width:105px; font-size:11px;">
          <div id='repeat' class='select' onclick='toggleStatus(this);'><?php echo $lng->repeat; ?></div><br/>
          <div id='random' class='select' onclick='toggleStatus(this);'><?php echo $lng->shuffle; ?></div>
       </div>           
       <div style="position:absolute;top:5px;left:60px;font-size:11px;" align="center">
             <div style="width:50px;"><?php echo $lng->xfade; ?></div> 
             <div style="width:50px;display:block;white-space: nowrap;">
               <div style="display:inline;float:left;cursor:pointer;"><img onclick="setCrossfade(false);" src="./templates/<?php echo $config->template; ?>/images/minus.gif" /></div>
               <div id="xfade">00</div>             
               <div style="display:inline;float:left;cursor:pointer;"><img onclick="setCrossfade(true);" src="./templates/<?php echo $config->template; ?>/images/plus.gif" /></div>
             </div>
        </div>                        
  	    <div style="position:absolute;width:100px;top:34px;left:6px;cursor:pointer;" >
  	       <table class='normTable' style="border-spacing:2px;"><tr>
  	          <td style="width:10px;"><img onclick="handleKeys(null, 'q');" title="<?php echo $lng->volume; ?>"src="./templates/<?php echo $config->template; ?>/images/volume-low.gif"></td>
  	          <td style="width:70px;"><?php $player->xxVolumeSlider(); ?></td>
  	          <td style="width:16px;"><img onclick="handleKeys(null, 'w');" title="<?php echo $lng->volume; ?>" src="./templates/<?php echo $config->template; ?>/images/volume-high.gif"></td>
  	       </tr></table>
  	     </div>
  </div>
  <div class="pannel" align="left">
       <div style="width:253px;margin-top:7px;font-size:11px;">
         <div style="position:absolute;right:8px;" id='remaining'>00:00</div>
         <img src="./templates/<?php echo $config->template; ?>/images/info.gif" title="<?php echo $lng->info; ?>" onclick="showStats();" align="absmiddle" hspace="1" style="cursor:pointer">
         <?php echo $lng->now_playing; ?>
       </div>         
       <div style="position:absolute;top:28px;left:8px;width:250px;font-size:0.97em;">
         <marquee id='trackinfo' scrollamount='10' scrolldelay='200' direction="left" onmouseover="this.stop();" onmouseout="this.start();"><?php echo $lng->loading; ?></marquee>
       </div>  
  </div>
  <div class="pannel" style="width:5px;" ></div>
  <div style="float:right;margin-top:3px;margin-right:5px;cursor:pointer;" onclick='aboutRelaxx();'><img src="./templates/<?php echo $config->template; ?>/images/relaxx-logo.png"></div>
</div>

<!-- Playlist Container /-->
<div id="playlist" class="playlist">
</div>

<!-- Container Files with Directory and Filelist /-->
<div id="cont_bottom" class="cont_bottom">
   <div id="directory" class="directory">
        <div id='dirTabs' style="cursor:default;" onmouseover='current_element="dirTabs";' onmouseout='current_element=false;'>
			<ul class="mootabs_title">
				<li title="Tfolders"><?php echo $lng->tab_folder; ?></li>
				<li title="Tsearch"><?php echo $lng->tab_search; ?></li>
				<li title="Tplaylist"><?php echo $lng->tab_playlists; ?></li>
   		    </ul>
			<div id="Tfolders" class="mootabs_panel"><?php $player->xxDirectory(); ?></div>
			<div id="Tsearch" class="mootabs_panel"><?php $player->xxSearchform(); ?></div>
			<div id="Tplaylist" class="mootabs_panel"><?php $player->xxPlaylistform(); ?></div>
		</div>     
   </div>
   <!-- Tracklist Container /-->
   <div id="tracklist" class="tracklist">
   </div>
</div>
<!-- InfoBox (hidden) /-->
  <div id="infobox" class="infobox">
        <div id="infobox_content" style="width:440px; margin: 15px 10px 10px 20px; overflow: auto; padding: 2px; position: fixed;">Loading Javascript ...</div> 
        <button class="buttons" style="position:absolute; top:2px; right:5px; padding: 0 3px 0 3px;" onclick="$('infobox').style.display = 'none';">x</button>
        <button id="infobox_close" class="negative" style="position:absolute; bottom:10px; left:10px;" onclick="$('infobox').style.display = 'none';"><? echo $lng->close ?></button>
  </div>
</body>
</html>