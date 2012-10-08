/*
   dragDrop.js
   Custom Drag and Drop for RelaXX
*/

dragDrop = new Class({
	options:{
		container: null, dropzone : false,  dragzone : false, snap: 10
	},
	initialize: function (dragzone,dropzone,container) {
		this.container = new Element('div');
		this.dropzone = dropzone;
		this.dragzone = dragzone;
		this.container.id = container;
		$(document.body).adopt(this.container);
    	this.bound = {
			'start': this.start.bindWithEvent(this),
			'check': this.check.bindWithEvent(this),
			'drag': this.drag.bindWithEvent(this),
			'stop': this.stop.bindWithEvent(this)
		};
		$(this.dragzone).addEvent('mousedown', this.bound.start);
	},
	start: function(event) {
	  if ((this.dragzone=="treemenu") && (event.target.tagName=="LI")) { // special handle for directories
		 this.track = event.target;
	  } else if ((current_row) && (current_element==this.dragzone)) { // only if a track is selected		  
	  	 this.track = $(current_row);
	  } else {  this.track = null }
	  if (this.track) {
		this.startx=event.client.x; this.starty=event.client.y;
		this.fired = false;
		document.addListener('mousemove', this.bound.check);
		document.addListener('mouseup', this.bound.stop);
	  } 
 	  event.stop();
	},
	check: function(event) {
		var distance = Math.abs(this.startx-event.client.x) + Math.abs(this.starty-event.client.y);
		if (distance > this.options.snap){ // start drag if mouse moved while button down
			switch (this.dragzone) {
			case "playlist":
				this.container.innerHTML = this.track.childNodes[1].innerHTML +" - "+this.track.childNodes[2].innerHTML;
				break;
			case "treemenu":
				this.container.innerHTML = this.track.innerHTML;
				break;
			default:
				this.container.innerHTML = this.multiline();
				break;
			}
			this.container.style.display = 'block';
			document.removeListener('mousemove', this.bound.check);
			document.addListener('mousemove', this.bound.drag);
			this.fired = true;
		    this.drag(event);
		}
		event.stop();
	},
	multiline : function() { // display selected tracks in drag container
	    this.track.addClass("marked");
		n=0; opacity = 1; dragText ="";
		tracks = $$('#trackTable tbody tr');
		for (var i = 0, j = tracks.length; i < j; i++) {
   		    if (tracks[i].className.search('marked')!=-1) {
                dragText += "<div style='opacity:"+opacity+"'>"+tracks[i].childNodes[0].innerHTML +" - "+tracks[i].childNodes[1].innerHTML+"</div>";
    		    if (n>=3) return dragText+"<div style='opacity:"+opacity+"'>....</div>";
   		    	n++; opacity = opacity - 0.20;
   		    }
   	    }
   	    return dragText;
	},
	drag: function(event) {
		this.container.setStyles({'top': event.client.y-3, 'left': event.client.x+1 });
		event.stop();
	},
	stop: function(event) {
		document.removeListener('mousemove', this.bound.check);
		document.removeListener('mousemove', this.bound.drag);
		document.removeListener('mouseup', this.bound.stop);
  	    this.container.style.display = 'none';
		if (this.fired) {
			el = $(this.dropzone).getCoordinates();
		    if (event.client.x > el.left && event.client.x < el.right && event.client.y < el.bottom && event.client.y > el.top) {		    	
			switch (this.dragzone) { /* append selected tracks to playlist */
				case "tracklist":		    		   
		    		 addSelected();
					 break;
				case "treemenu":
					controllRemote('addSong',this.track.title,true,'playlist');
					break;
				default:
				 if ($(current_row)) {
    		   	    /* reorder Playlist */
    		   		var i=0; 
    		   		var dropId = parseInt($(current_row).id.substr(2));
    		   		$$('#plTable tbody tr').each(function(row) {
    		   			if (row.className.search('marked')!=-1) {
    		   				rowId = parseInt(row.id.substr(2));
    		   				if (rowId<dropId) rowId = rowId-i; 
    		   				controllRemote("moveSong", rowId+":"+dropId,false,'playlist');
    		   				if (rowId>dropId) dropId++; 
    		   				i++;    		   				
  				  		}
  				     });
   				    /* Take the current row if nothing selected */
   				    if (i==0) controllRemote("moveSong", parseInt(this.track.id.substr(2))+":"+dropId,false,'playlist');    		   	
   				    pingTimer = setTimeout("pingMPD()", 1000); // restart Timer
				 }  
    		   } 
		    }
		}
	}

});

// init drag&drop segments on load
window.addEvent('domready', function() {
    /** initialize drag and drop object */
    var dragDirectory = new dragDrop('treemenu','playlist','dragContainer');    
    var dragTracks = new dragDrop('tracklist','playlist','dragContainer');
    var dragPlaylist = new dragDrop('playlist','playlist','dragContainer');
});

