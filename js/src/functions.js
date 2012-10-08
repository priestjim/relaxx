/* ----------------------------------------------  /
/  Relax Player 0.70
/  Basic Player functions - Javascript
/  Autor: Dirk Hoeschen
/  Contact: relaxx [at] dirk-hoeschen.de
/  home: http://relaxx.sourceforge.net
/  updates: https://sourceforge.net/projects/relaxx
/  ---------------------------------------------- */

/*
   Remark: the code isn't allways object oriented    
   Otherwise the player would be much to slow
*/

/** ... to highlight the element on mouseover ... */
var IEsucks = "onclick='markRows(event,this)' "
			 +"onmouseover='activateRow(event,this)'"
			 +"onmouseout='deactivateRow(this)'" ;

var testcounter=0;

/** Status information */
var oldStatus = new Object;
var popInfo = null;
var popAdm = new Object;

/** Global vars */
var current_row = false; // Hovered row
var current_element = false; // Active table
var last_marked = false; // Last marked row

/** Timer handle to prevent collision */
var pingTimer =  null;
var infoTimer =  null;

/** sorted table */
var trackSort = null;

/** selected directory node */
var current_dir = null;

// Init the complete player
function initPlayer() {

    makeTracklist(); // make tracklist table

    /* Init Directory Tabs */
    myTabs = new mootabs('dirTabs', {height: '100%', width: '100%'});

    /* Get Tracklist from rootdir */
	refreshTracklist('','\/');

	/* Init playpos slider */
	playPos = new Slider($('playpos'), $('plposKnob'), {
			steps: 100,
			mode: 'horizontal',
			onComplete: function(step) {
			  if (oldStatus.time) {
 			  	   pos= Math.round(step*(oldStatus.time.split(':')[1]/100))
				   controllRemote('seekId&id='+oldStatus.song,pos,true,'playback');
			  }
			}
	}).set(0);

	/* Init volpos slider */
	volPos = new Slider($('volume'), $('volKnob'), {
			steps: 100,
			mode: 'horizontal',
			onComplete: function(step) {
			  if (oldStatus.volume) {
				   controllRemote('setVolume',step,true,'playback');
			  }
			}
	}).set(0);

	makePlaylist(); // make playlist table
	loadPlaylists(); // get playlists

	/* capture keys */
	// FIXME: FF2 has problems to detect keystrokes in playlist window
	keyKTarget = window.ie ? document : window;
	keyKTarget.addEvent("keydown", function(e) { handleKeys(e,false); });

	/* select 1st direcrory entry */
	current_dir = $$('#treemenu li')[0];

	/* set popup style and dimensions */
	popInfo = new Element('div')
	$(document.body).adopt(popInfo);
	popInfo.addClass('tipbox');
	
	popAdm.closed=true;
	
	$('playlist').addEvent('mouseover', function() { selectElement("playlist"); });
	$('playlist').addEvent('mouseout', function() { current_element=null });
	$('tracklist').addEvent('mouseover', function() { selectElement("tracklist"); });
	$('tracklist').addEvent('mouseout', function() { current_element=null });
}

// Prepare playlist container
function makePlaylist() {
	plHeader =  "<table id='plTable' class='dataTable' cellspacing='0'><thead><tr>";
    plcolumns.each(function(item){  	
    	item = item.charAt(0).toLowerCase() + item.substring(1);
        plHeader += "<th axis='"+(item=="pos"? "number":"string" )+"'>"+language[item]+"</th>";
    });	
	plHeader += "</tr></thead><tbody>";
	$('playlist').innerHTML = "<div class='tableContainer' id='plContainer'></div>";
    $('plContainer').innerHTML = plHeader + "<tr id='pl0'><td colspan='0' onmouseover='current_row=false' align='center'>"+language.loading+"</td></tr></tbody></table>";
	nSize = $('playlist').getSize();
	$('plContainer').setStyle('height', nSize.size.y);
	// inititalize table sort
	var plSort = new tableSort('plTable',0);
	// Start the ping timer
	oldStatus.playlist = "0";
	// Get Data
	pingMPD();
}

// Prepage tracklist container
function makeTracklist() {
	trackHeader = "<table id='trackTable' class='dataTable' cellspacing='0'><thead><tr>";
    trcolumns.each(function(item){  	
    	item = item.charAt(0).toLowerCase() + item.substring(1);
        trackHeader += "<th axis='string'>"+language[item]+"</th>";
    });	
	trackHeader +="</tr></thead><tbody>";
   	$('tracklist').innerHTML = "<div class='tableContainer' id='trackContainer'>"+trackHeader+"</tbody></table></div>";
   	nSize = $('tracklist').getSize();
	$('trackContainer').setStyle('height', nSize.size.y);
	// inititalize table sort
	trackSort = new tableSort('trackTable',0);
}

/** Start PING Timer to get status every second */
function pingMPD(reset) {
    clearTimeout(pingTimer);
	url = 'include/controller-ping.php?value='+oldStatus.playlist;
	var request = new Json.Remote(url, {
		onComplete: function(jsonObj) {
		  if (jsonObj.error) {
		  	modalBox("<h3>Error</h3><p>"+language.error_connect+"</p>",true);
		  } else {
 	        refreshPlaylist(jsonObj); // File to add / change in the playlist
		    setPlayerStatus(jsonObj.status); // set new status
		    oldStatus = jsonObj.status; // save status
		    pingTimer = setTimeout("pingMPD()", 1000); // start new Timer
		  }
		}
	}).send();
}

// Open a directory from treeview
function getDir(e) {
  e.cancelBubble = true;
  if (e.stopPropagation) e.stopPropagation();
  dNode = e.target || e.srcElement;
  /* ignore empty list elements */
  if (dNode.className.search(/empty/)==-1) {
  	  dChild = dNode.nextSibling;       	  
  	  /* get subdirs as hml and insert to doom tree */
  	  if ((!dChild) || (dChild.tagName!='UL')) {
  	  	 var newUL = new Element('ul');  	  	 
  	  	 dNode.parentNode.insertBefore(newUL,dNode.nextSibling);
  	  	 dChild = dNode.nextSibling;
  	  	 new Ajax('include/controller-database.php?action=extendTree&dir='+dNode.title,
  	  	          {method: 'get', update: dChild }).request();
  	  	 dNode.className = "selected open";
  	  } else {         
  	     if (dNode.className.search(/open/)!=-1) {  	
         	dChild.className = "closed";
         	dNode.className = "selected";
  	   } else {	
         	dChild.className = "open";  
			dNode.className = "selected open";
  	   } 	
  	  } 		
  } else {
       dNode.className = "empty selected";  	 
  }	
  if (current_dir!=dNode) {
  	 refreshTracklist('',dNode.title);
  	 current_dir.className = current_dir.className.replace("selected", "");	 
  }	 
  current_dir = dNode;
}

// Get a new tracklist from directory, search or playlist
function refreshTracklist(action,target) {
	switch (action) {
      case "search":
	    url = 'include/controller-database.php?' + Object.toQueryString({action: action, type: target.target.value, search: target.search.value});
		break;
      case "listPlaylistInfo":
		url = 'include/controller-playlist.php?' + Object.toQueryString({action: action, value: target});
		break;
      default:
        url = 'include/controller-database.php?action=directory&dir='+target;
	}
	var request = new Json.Remote(url, {
		onComplete: function(jsonObj) {
			var tbl = "";
			i=0;
			if (jsonObj.file) {
 			  jsonObj.file.each(function(track) {
  			    rclass = (i % 2) ? "odd" : "even";
    			i++;
    			if ((!track.Artist) && (!track.Title)) { track = buildTag(track); }
    			tbl +="<tr id=\""+encodeURIComponent(track.file)+"\" class='"+rclass+"' " +
    					" ondblclick='controllRemote(\"addSong\",this.id,true,\"playlist\");' "+ IEsucks+" >";
    			trcolumns.each(function(item){  	 
    				if (track[item]) {
    					tbl += "<td>"+ ((item=="Time") ? convertTime(track[item]) : track[item] ) +"</td>";
    				} else {
    					tbl += "<td></td>";
    				}	    		
			    });	
    			tbl +="</tr>";
			  });
		    } else {
				tbl +="<tr id='0' class='even'><td colspan='"+(trcolumns.length+1)+"' onmouseover='current_row=false' align='center'>"+language.error_nofiles+"</td></tr>";
			}
	        newBody = new Element('div').setHTML("<table><tbody>"+tbl+"</tbody></table>");
            $('trackTable').replaceChild(newBody.firstChild.firstChild,$('trackTable').lastChild);
	        recalcTable('tracklist');
	        // reset sort to 1st column
	        trackSort.reset(0);
		}
	}).send();
}

// Refresh the current Playlist
function refreshPlaylist(jsonObj) {
	plStatus = jsonObj.status;
	plChanges = jsonObj.playlist;	
	if ((plStatus.playlistlength==oldStatus.playlistlength) && (!plChanges)) return;
	oldStatus.playlistlength = parseInt(oldStatus.playlistlength);
	plStatus.playlistlength = parseInt(plStatus.playlistlength);
    tBody =  $$('#plTable tbody')[0];
	/** Playlist is empty */
    if (plStatus.playlistlength==0) {
        newBody = new Element('div').setHTML("<table><tbody><tr id='pl0' class='even' onmouseover='current_row=false'><td colspan='"+(plcolumns.length+1)+"' align='center'>"+language.error_notracks+"</td></tr></tbody></table>");
  	    $('plTable').replaceChild(newBody.firstChild.firstChild,$('plTable').lastChild);
  	    current_row=false;
	/** ADD or replace entries */
    } else if (plChanges) {
        i=0;
	    plChanges.file.each(function(track) {
  	        rclass = (i % 2) ? "odd" : "even";
  	        newRow = makePlaylistRow(track,rclass);
  	        $('pl'+track.Pos) ? tBody.replaceChild(newRow,$('pl'+track.Pos)) : tBody.appendChild(newRow);
    	    i++;
	    });
	    /** remove appending rows */
	    lastTrack = plChanges.file.pop();
	   	if ((plStatus.playlistlength-1) == lastTrack.Pos) {
	   		n = tBody.childNodes.length
	   		for (var i = 0; i < n; ++i) {
    			if ((i>lastTrack.Pos) && $('pl'+i)) tBody.removeChild($('pl'+i));
   			}
    	}
	/** Entrie(s)) were removed */
    } else if ((oldStatus.playlistlength>plStatus.playlistlength) && (plStatus.playlistlength!=0)) {
  	    for (i=plStatus.playlistlength;i<oldStatus.playlistlength;i++) if ($('pl'+i)) tBody.removeChild($('pl'+i));
	}

    i=0;
    /** refresh row pattern */
   	$$('#plTable tBody tr').each(function(row) {
    	row.className = (i % 2) ? row.className.replace('odd' , 'even') : row.className.replace('even' , 'odd') ;
    	i++;
   	});

    oldStatus.songid = -1; // Reset songstatus
    recalcTable('playlist');
}

// Recalc table dimensions for fixed tableheader layouts
function recalcTable(tblContainer) {
    newSize = $(tblContainer).getSize();
    container = $(tblContainer).firstChild;
    container.setStyle('width', newSize.size.x);
    container.setStyle('height', $(tblContainer).clientHeight);
    table = $$('#'+tblContainer+' table')[0];
    if (window.gecko) {
       container.setStyle('overflow', 'hidden');
       table.setStyle('width', newSize.size.x);
       if(table.lastChild.scrollHeight>=(newSize.size.y-20)) {
        	border = (tblContainer == 'playlist') ? 5 : 0;
        	table.lastChild.setStyle('height', ( newSize.size.y-table.firstChild.getSize().size.y-border));
       } else {
       	    table.lastChild.setStyle('height', 'auto' );
       }
     } else if (window.ie) {
       container.setStyle('height', $(tblContainer).clientHeight);
       scrollMargin = (container.scrollHeight>=container.offsetHeight) ? (container.offsetWidth-container.clientWidth) : 0;
       table.setStyles('width:'+(newSize.size.x-scrollMargin)+'px;');
    }
}

// Generates a table ROW for the playlist
function makePlaylistRow(track,rclass) {
	// guess title if file is not tagged
	if ((!track.Artist) && (!track.Title)) { track = buildTag(track); }
	/** Internet exlorer doesnt support write into tr.innerHTML
	 *  Therefore we need a complicate solution  */
	var newRow = new Element('div');
   	row ="<table><tr id='pl"+track.Pos+"' plid='"+track.Id+"' class='"+rclass+"' " +
					" ondblclick='controllRemote(\"play\",this.attributes[\"plid\"].nodeValue,true,\"playback\");' "+ IEsucks+" >";
    plcolumns.each(function(item){   
    	if (track[item]) {    	 	 
    		if (item=="Time") {
    	   		row +="<td>"+convertTime(track[item])+"</td>";    	   		
    		} else if (item=="Pos") {
   		   		row +="<td style='padding-left:15px;'>"+track[item]+"</td>";    		
    		} else {   			
    			row +="<td>"+track[item]+"</td>";    		
    		}
    	} else {
   			row += "<td></td>";
    	}	
    });	
   	newRow.innerHTML = row+"</tr></table>";
   	return newRow.getElementsByTagName('tr')[0];
}

// try to get infos from filename if not tagged or raido stream without name
function buildTag(track) {
	if (!track["Time"]) { // time is unknown.... mus be a stream
		if (track["Name"]) track["Title"] = track["Name"];
		if (!track["Title"]) track["Title"] = track["file"];
		track["Time"] = "stream";
	} else {	
		var rawTitle = track.file.substr(track["file"].lastIndexOf("/")+1);
		n = rawTitle.indexOf("-");
		if (n) track.Artist =  rawTitle.substr(0,n-1);
		track.Title =  rawTitle.substr(n+1);
	}	
	return track;
}

// Mark one or multiple rows with shift-click
function markRows(evt,target){
	$(target.id).toggleClass('marked');
	if ((evt.shiftKey) && (target.parentNode == last_marked.parentNode)) { // shift pressed and same table
	   rows = $$('#'+current_element+' table tbody tr');
	   found = false;
	   for (var i = 0; i < rows.length; ++i) {
            if ((rows[i].id==target.id) || (rows[i].id==last_marked.id)) {
            	rows[i].addClass('marked');
            	if (found) { return; } else found=true;
            } else if(found) rows[i].addClass('marked');
	   }
	}
	last_marked = target;
}

// Activate current row on playlist or tracklist
function activateRow(event,target) {
	testcounter++;
	current_row=target.id;
	target.mousex = event.clientX;
	target.mousey = event.clientY;	 
    if (window.ie) target.className += " hover";	
    infoTimer = showFileinfo.delay(2000);
    $(current_row).addListener('mousemove', delayPopUp);
}

// Deactivate current row on playlist or tracklist
function deactivateRow(target) {
    infoTimer = $clear(infoTimer);
    if (current_row) {
    	$(current_row).removeListener('mousemove', delayPopUp);
    	current_row=false;
    }    	
    if (window.ie) target.className = target.className.replace(" hover", "");
    popInfo.style.display = 'none';
}

// Captures mousepostion while waiting for popup
// todo: make a real class for the rowhandling 
function delayPopUp(event) {
	this.mousex = event.clientX;
	this.mousey = event.clientY;
}

// Show the fileinfo dialog
function showFileinfo() {
  if (current_row) {	
	popInfo.setStyles({'top': $(current_row).mousey-20, 'left': $(current_row).mousex+20 });
	$(current_row).removeListener('mousemove', delayPopUp);
    if (current_element=='tracklist') {
       	popFileinfo($(current_row).id);  
    } else if (current_element=='playlist') {
	  	var songInfo = new Json.Remote('include/controller-playlist.php?action=getPlaylistInfo&value='+parseInt($(current_row).id.substr(2)),
  	       {method: 'get', async: 'false',
            onComplete: function(jsonObj) {	popFileinfo(jsonObj[0].file,jsonObj[0].Name); }
           }).send();
    }
  } 
}

// Popup the informations
function popFileinfo(filename,station) {
	popInfo.innerHTML = "";
	var parts = unescape(decodeURI(filename));
	/** special handling for radio streams */
	if (parts.substr(4,3)=="://") {
       popInfo.innerHTML += "<div style='background-image: url("+imgpath+"radio.gif)'>"+station+"</div><div style='background-image: url("+imgpath+"url-info.gif)'>"+parts+"</div>"; 
	} else {
  	  parts = parts.split("/");
  	  for (var i = 0; i < (parts.length-1); i++){
   	       popInfo.innerHTML += "<div>"+parts[i]+"</div>"; 
	   }
       popInfo.innerHTML += "<div style='background-image: url("+imgpath+"song-info.gif); border-bottom: 0px;'>"+parts[parts.length-1]+"</div>"; 
	}
    popInfo.style.display = 'block';
}    

// Get the keycodes
function handleKeys(evt,key){
   if (current_element=='input') return;
   var event = (!key) ? new Event(evt) : { key : key };
   if ((event.control) && (event.key=='a')) event.stop();
   if ((current_row) && (current_element=='playlist')) {
     plid = $(current_row).getAttribute('plid');
     plpos = parseInt($(current_row).id.substr(2));
     switch (event.key) {
       case "delete":
       	removeSelected();
        break;
      case "up":
        if (plpos>0) controllRemote("moveSong",plpos+":"+(plpos-1),true,'playlist');
      case "down":
        if (plpos<(oldStatus.playlistlength-1)) controllRemote("moveSong",plpos+":"+(plpos+1),true,'playlist')
        break;
      case "p":
        controllRemote('play',$(current_row).getAttribute('plid'),true,'playback');
        break;
     }
   }
   switch (event.key) {
      case "esc":
		if ($('infobox').style.display=='block') $('infobox').style.display = "none";
  	    if ((current_element=='playlist') || (current_element=='tracklist')) toggleSelected(current_element,true);
        break;
      case "b":
       if ((current_row) && (current_element=='tracklist')) {      	  
       	   var audioplayer = new Ajax('include/controller-plugin.php?plugin=audioplayer&filename='+$(current_row).id+"&title="+encodeURIComponent($(current_row).childNodes[0].innerHTML+" &bull; "+$(current_row).childNodes[1].innerHTML),
  	       {method: 'get', async: 'false',
            onComplete: function(htmlObj) {
					modalBox(htmlObj,false,350,80);       	            	            	
             }
           }).request();       	
       }
        break;
      case "1":
       controllRemote('prevSong','',true,'playback');
        break;
      case "2":
        togglePlay();
        break;
      case "3":
        controllRemote('nextSong','',true,'playback');
         break;
      case "r":
	    addStream();
        break;
      case "q":
        vol = Math.abs(oldStatus.volume)-5;
		controllRemote('setVolume',vol,true,'playback');
        break;
      case "w":
        vol = Math.abs(oldStatus.volume)+5;
		controllRemote('setVolume',vol,true,'playback');
        break;
     case "c":
        if (current_element=='playlist') controllRemote('clear','',true,'playlist');
        break;
     case "o":
        removeOld();
        break;
      case "n":
        savePlaylist();
        break;
      case "d":
         if ((current_element=='playlist') || (current_element=='tracklist')) toggleSelected(current_element,true);
         break;
      case "s":
      case "a":
         if ((current_element=='playlist') || (current_element=='tracklist')) toggleSelected(current_element,false);
         break;
      case "i":
        if ((current_row) && (current_element=='tracklist')) {
        	  // show complete filename
            modalBox("<h1>"+language.file+"</h1><p align='left'>"+unescape(decodeURI($(current_row).id))+"</p>",true);
         } else if ((plpos) && (current_element=='playlist')) {
		  	var songInfo = new Json.Remote('include/controller-playlist.php?action=getPlaylistInfo&value='+plpos,
		  	       {method: 'get', async: 'false',
		            onComplete: function(jsonObj) {
		            	 modalBox("<h1>"+language.file+"</h1><p align='left'>"+unescape(decodeURI(jsonObj[0].file))+"</p>",true);
		            }}).send();
         }
        break;
      case "space":
        if ((current_row) && (current_element=='tracklist')) { addSelected(); }
        break;
   }
}

// Controll player and playlist functions via ajax
function controllRemote(action,value,ping,controller) {
	clearTimeout(pingTimer); // stop timer	
	clearTimeout(infoTimer);
	 url = "include/controller-"+controller+".php?action="+action+"&value=";
	 // Songnames must not be encoded
	 url += ('addSong') ? value : encodeURI(value);
	 var request = new Json.Remote(url, {
	 	method: 'get', async: 'false',
		onComplete: function(jsonObj) {
		  if (jsonObj=='error') {
		  	error = (adminName == "anonymous") ? language.error_allowed : language.error_mpd;
		  	modalBox("<h3>Error</h3><p>"+error+"</p>",true);
		  } else {
            if (ping) pingMPD();
		  }
		}
	}).send();
}

// Toggle random and repeat status
function toggleStatus(element) {
	value = (element.className.search(/marked/g) == -1) ? 1 : 0;
	controllRemote(element.id, value, true,'playback');
}

// Toggle playstaus
function togglePlay() {
  if (oldStatus.playlistlength>0) {
	 songId = (!oldStatus.songid) ? $('pl0').getAttribute('plid') : oldStatus.songid;
	 action = ((!oldStatus.songid) || (oldStatus.state=='stop')) ? 'continue' : 'pause';
	 controllRemote(action,songId,true,'playback');
  }
}

// set crossfade value in seconds
function setCrossfade(increase) {
	var xfade = (increase) ?  Math.abs(oldStatus.xfade)+1 :  Math.abs(oldStatus.xfade-1);
	if (xfade>20) xfade=20;
	controllRemote('setCrossfade',xfade,true,'playback');
}

// AddSelected tracks to playlist
function addSelected() {
	i=0;
   	$$('#trackTable tbody tr').each(function(row) {
   		if (row.className.search('marked')!=-1) {
   		   i++;
   		   controllRemote('addSong',row.id,false,'playlist');
   		   $(row).removeClass('marked');
  		}
   	});
   	/* Take the current row if nothing selected */
   	if (i==0) { controllRemote('addSong',$(current_row).id,false,'playlist'); }
  	pingMPD(); // Start Timer
   	return i;
}

// RemoveSelected tracks from playlist
function removeSelected() {
    var value = "";
   	$$('#plTable tbody tr').each(function(row) {
  	  if (row.className.search(/marked/)!=-1) value += row.getAttribute('plid') + ":";
   	});
   	if ((current_row) && (value=="")) value = $(current_row).getAttribute('plid');
   	controllRemote('deleteSong',value,false,'playlist');
   	pingTimer = setTimeout("pingMPD()", 1000);
}

// Remove old tracks from playlist
function removeOld() {
	clearTimeout(pingTimer); //clear ping
    var value = "";
   	$$('#plTable tbody tr').each(function(row) {
   		if (parseInt(row.id.substr(2))<oldStatus.song) value += row.getAttribute('plid') + ":";
   	});
   	controllRemote('deleteSong',value,false,'playlist');
   	pingTimer = setTimeout("pingMPD()", 1000);
}

// Toggles selection state of a table
function toggleSelected(tblContainer,deselect) {
   	$$('#'+tblContainer+' div table tbody tr').each(function(row) {
   		deselect ?  $(row).removeClass('marked') : $(row).addClass('marked');
   	});
}

// Selects the current ellement and deblur input field
function selectElement(el) {
	if ($('infobox').style.display!="block" && popAdm.closed) {
		$(el).focus();
		$('searchField').blur();
		$('playlistSelect').blur();
		current_element = el;
	}	
}

// Load / refresshes Playlists into selector
function loadPlaylists() {;
	url = "include/controller-playlist.php?action=getPlaylists";
	var request = new Json.Remote(url, {
    	onComplete: function(jsonObj) {
    	  $('playlistSelect').options.length = 0;
    	  // IE does not implement set innerHTML correct
    	  if ((jsonObj) && (jsonObj!='error')) {
    	  	i=0;
    	    jsonObj.each( function(list) { $('playlistSelect').options[i] = new Option(list, list, false, true); i++; });
    	    $('playlistSelect').getFirst().selected='selected';
    	  }
    	}
   	 }).send();
}

// Saves a playlist with the given name
function savePlaylist() {;
     // open name request
     modalBox("<h1>"+language.pl_save+"</h1><br />" +
	  		"<form id='newPlaylist' action='index.php' method='get'><table class='normTable'>" +
	  		"<tr><th>" +language.name + "<td><input name='plName' style='width:300px' onclick='this.focus();' onkeydown='current_element=\"input\"'/>" +
	  		"<tr><td><td><button type='submit' class='positive' />"+language.save+"</button>"+
	  		"&nbsp;<button type='reset' class='negative' />"+language.cancel+"</button></table></form>",false);
	 $('newPlaylist').addEvent('submit', function(e) {
    	     new Event(e).stop();
   	 	$('infobox').style.display = 'none';
   	 	if (this.plName.value!="") { controllRemote('savePlaylist',this.plName.value,false,'playlist');  loadPlaylists(); }
	 });
	 $('newPlaylist').addEvent('reset', function(e) { $('infobox').style.display = 'none'; });
}

// Add internet radio Stream to PL as URL
function addStream() {;
     // open URL request
     modalBox("<h1>"+language.dialog_radio+"</h1><br/>" +
	  		"<form id='addURL' action='index.php' method='get'><table class='normTable' style='width:300px'>" +
	  		"<tr><th width=50>" +language.url + "<td><input name='stream' value='http://' style='width:300px' onclick='this.focus();' onkeydown='current_element=\"input\"'/>" +
	  		"<tr><td> <td><div style='text-align:right; font-size:10px'>(pls,m3u,asx,xspf,mp3,ogg,url:port)</div>"+	  		
	  		"<tr><td> <td><button type='submit' class='positive' />"+language.add+"</button>"+
	  		"&nbsp;<button type='reset' class='negative' />"+language.cancel+"</button></table></form>",false);
	 $('addURL').addEvent('submit', function(e) {
    	     new Event(e).stop();
   	 	$('infobox').style.display =  'none';
   	 	if (this.stream.value!="") {   	 		       	 		      
                  url = 'include/controller-netradio.php?playlist='+escape(this.stream.value);
                  var request = new Json.Remote(url, {
                   onComplete: function(jsonObj) {
		     if (!jsonObj.error) {
                         controllRemote('addSong',jsonObj.url,true,'playlist');
                        loadPlaylists();
                     }
                   }
                 }).send();                      
                }
	 });
	 $('addURL').addEvent('reset', function(e) { $('infobox').style.display = 'none'; });
}

// Set the player status and display
function setPlayerStatus(plStatus, reset) {
	if ((plStatus.songid!=oldStatus.songid) || (!oldStatus.songid)) {
	  if (plStatus.playlistlength==0) { // No track
	  	$('trackinfo').innerHTML = language.error_notracks;
	  }	else {
		if ($('pl'+plStatus.song)){
  		   // update "Now Playing" display
		   plTrack = $('pl'+plStatus.song).childNodes;
		   trInfo = "# "+plStatus.song+" ... "+language.artist+": "+plTrack[1].innerHTML+ " ... " + language.title+": "+plTrack[2].innerHTML+ " ... " + language.album+": "+plTrack[3].innerHTML + "... "
		   $('trackinfo').innerHTML = trInfo;
		   document.title = "#"+plStatus.song+" : "+plTrack[1].innerHTML+" : "+plTrack[2].innerHTML+" : RelaXX";
		   document.title =  document.title.replace('&amp;','&');		   		   
		}  else {
			$('trackinfo').innerHTML = language.error_notracks;
		   document.title = language.error_notracks+" : RelaXX";
		}
         // remove active song mark
         if ($('pl'+oldStatus.song)){
		        $('pl'+oldStatus.song).className = $('pl'+oldStatus.song).className.replace(' playing', '');
		        $('pl'+oldStatus.song).childNodes[0].className = '';
     	}
		// mark active song in playlist
		if ($('pl'+plStatus.song)){
 		    $('pl'+plStatus.song).className +=' playing';
		    $('pl'+plStatus.song).childNodes[0].className = 'playing';
		}
	  }
	  //Reset marquee
	  $('trackinfo').direction='right';
	  $('trackinfo').direction='left'
	}

	// Toggle play button
	if ((plStatus.state!=oldStatus.state) || (!oldStatus.state)) {
		if (plStatus.state== "play") {
			$('play_button').src = $('play_button').src.replace('play.gif','pause.gif');
		} else {
			$('play_button').src = $('play_button').src.replace('pause.gif','play.gif');
		}
	}
	// Toggle switches
	if ((plStatus.random!=oldStatus.random) || (!oldStatus.random))
		(plStatus.random==1) ? $('random').addClass('marked') : $('random').removeClass('marked');
	if ((plStatus.repeat!=oldStatus.repeat) || (!oldStatus.repeat))
		(plStatus.repeat==1) ? $('repeat').addClass('marked') : $('repeat').removeClass('marked');

	// Set slider postion
    if (plStatus.state== "play") {
    	var remaining = plStatus.time;
	    remaining = remaining.split(":");
	    pos = playPos.toPosition(Math.round((remaining[0]/remaining[1]) * 100));
	    if ((pos!=playPos.step) && (remaining[1]>0)) playPos.knob.setStyle(playPos.p, pos);
   	   // Update remaining time display
	    if (remaining[1]==0) {
	        $('remaining').firstChild.nodeValue = "+ "+convertTime(remaining[0]);	    	
	    } else {
	        $('remaining').firstChild.nodeValue = "- "+convertTime((remaining[1]-remaining[0])) + " | " +convertTime(remaining[1]);
	    }
    }

   // Set volume position
	if ((plStatus.volume!=oldStatus.volume) || (!oldStatus.volume)) {
		volPos.knob.setStyle(volPos.p, volPos.toPosition(plStatus.volume));
	}

   // Set cropssfade position
	if ((plStatus.xfade!=oldStatus.xfade) || (!oldStatus.xfade)) {
		$('xfade').firstChild.nodeValue = plStatus.xfade;
	}
}

// Login and out
function loginOut(openConfig) {
	if (adminName == "anonymous") { // login
	  modalBox("<h1>"+language.login+"</h1>" +
	  		"<form id='login' action='include/controller-admin.php?openConfig="+openConfig+"' method='get'>"+
	  		"<table class='normTable'>" +
	  		"<tr><th>" +language.username + "<td><input name='admin' value='admin' onclick='this.focus();' onkeydown='current_element=\"input\"'/><br />" +
	  		"<tr><th>" +language.password + "<td><input name='password' type='password' onclick='this.focus();' onkeydown='current_element=\"input\"'/><br />" +
	  		"<tr><td><td><button type='submit' class='positive' />"+language.login+"</button>" +
	  		"&nbsp;<button type='reset' class='negative' />"+language.cancel+"</button></table></form>",false);
	  $('login').addEvent('submit', function(e) {
     	   new Event(e).stop();
     	   this.send({
     	     onComplete: function(response) {
   	   			$('infobox').style.display = 'none';
   	   			var jsonObj = eval(response);
   	   			if(jsonObj.error) {
   	   				modalBox("<h3>"+language.error+"</h3><p>"+language.error_password+"</p>",true);
   	   			} else {
   	   				adminName = jsonObj.user;
   	   				$('menu_login').innerHTML= language.logout;
   	   				(jsonObj.openConfig=="true") ? doAdmin() : modalBox("<h1>"+language.login+"</h1><p>"+language.success_login+"</p>",true);
   	   			}
     	   	  }
     	   });
       });
	  $('login').addEvent('reset', function(e) { $('infobox').style.display = 'none';  });
	} else { // logout
	   	request = new Json.Remote('include/controller-admin.php', {
	  			onComplete: function() {
	  				adminName = "anonymous";
	  				$('menu_login').innerHTML= language.login;
   	   				modalBox("<h1>"+language.logout+"</h1><p>"+language.success_logout+"</p>",true);
	  			}
  			}).send();
    }
}

// open admin-page
function doAdmin() {
	if (adminName == "anonymous") { // Login if not registered
	    loginOut(true);
	} else {  // logout
		popAdm = window.open( "admin.php", "Administration", "width=400,height=400,scrollbars=1,resizable=1");
	    if (popAdm)
	      if (popAdm.opener==null)
             popAdm.opener = self;
	}	
}


// Time converter to min:sec
function convertTime(sec) {
	if (Number(sec)) {
		m = parseInt(sec/60); s = Math.abs(sec%60);	h = parseInt(m/60);
		if (h>0) m = Math.abs(m%60);
		return (sec<0?"-":"") + (h>0?h+":":"") + (m<10?"0"+m:m) +":" + (s<10?"0"+s:s);
	} else {
		return sec;
	}
}

// show songinfo and mpd stats
function showStats() {
	 url = "include/controller-common.php?action=getStats";
	 var request = new Json.Remote(url, {
	 	method: 'get', async: 'false',
		onComplete: function(jsonObj) {
		  if (jsonObj.songs) {
		  	modalBox("<h1>"+language.dialog_info+"</h1>"
		  	         +"<div style='font-size:12px'><b>"+language.stat_current+"</b><br />"+language.stat_bit+": "+oldStatus.bitrate+" - "
		  	         +language.stat_audio+": "+oldStatus.audio+"<br />"
		  	         +"<b>"+language.stat_db+"</b><br />"+language.stat_songs+": "+jsonObj.songs+" - "
		  	         +language.stat_artists+": "+jsonObj.artists+" - "
		  	         +language.stat_albums+": "+jsonObj.albums+"<br />"
		  	         +language.stat_playtime+" (hh:mm:ss) : "+convertTime(jsonObj.db_playtime)+"</div>",true);
		  }
		}
	}).send();
}

// open about-page
function aboutRelaxx() {
	modalBox("<h1>relaXXPlayer</h1><img src='./images/relaxx.png' align='right' />"
	         +"<p align='left'>version: "+version+" &copy; 2009 "
	         +"<br>Brought to you by Dirk Hoeschen"
	         +"<br>Web: <a href='http://relaxx.sourceforge.net'>relaxx.sourceforge.net</a></p>",true);
}

// Displays a box at the center of the screen
function modalBox(infoMsg,closeBtn,width,height) {
	if (!width) width=490;
	if (!height) height=170;	
    Wwidth = window.getWidth();
    Wheight = window.getHeight();
    if (Wwidth==0) { // IE quirks mode
    	Wwidth = document.body.offsetWidth;
    	Wheight = document.body.offsetHeight;
    }
    $('infobox_content').innerHTML = infoMsg;
    $('infobox').style.top = Math.round((Wheight/2)-(height/2))+'px';
    $('infobox').style.left = Math.round((Wwidth/2)-(width/2))+'px';
    $('infobox').style.height = height+'px';
    $('infobox').style.width = width+'px';
    $('infobox_close').style.display = (closeBtn==false) ? "none" : "block";
    $('infobox').style.display = 'block';
}

 
