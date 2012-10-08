/* ----------------------------------------------  /
/  Relax Player                                    /
/  Basic Player - Javascript                       /
/  ---------------------------------------------- */

var templateDir = "./templates/default";

var dragObject = null;
var resizeFlag = true;

// Init on load
window.addEvent('load', function() {
    /** Reset element positions */
    calcResizeHor();
    calcResizeVert();

    /** Init the main player */
    initPlayer();

	/** Resizable with horizontal limit */
	$('directory').makeResizable({
	   modifiers: {x: 'width', y: false},
       limit: {x: [210]},
       grid: 20,
       onComplete: function() { if(this.value.begin!=this.value.now.x) { calcResizeHor();  recalcTable('tracklist'); } }, 
       onStart: function() { this.value.begin = this.value.now.x; var el = $('directory').getCoordinates(); if (this.mouse.start.x < (el.right-5)) this.stop(); } 
    });

	/** Resizable with vertical limit */
	$('playlist').makeResizable({
	   modifiers: {x: false, y: 'height'},
       limit: {y: [100]},
       grid: 20,       
       onComplete: function() { 
       	  if(this.value.begin!=this.value.now.y) { 
       	  	calcResizeVert(); recalcTable('playlist'); recalcTable('tracklist');  } }, 
       onStart: function() { this.value.begin = this.value.now.y; el = $('playlist').getCoordinates(); if (this.mouse.start.y < (el.bottom-5)) this.stop(); } 
    });
    
	/** Recalculate player elements on resize */
	window.onresize = redraw;

	/** Set the playlist to 30% of the inner window height */
	nHeight = Math.abs(window.getHeight()*0.3);
	$('playlist').setStyle('height', nHeight);
	calcResizer();
    
});

// Calculate resize dimensions on load and when windowchanges
function calcResizer() {
   // IE6 Bug prevent to be called to fast
   resizeFlag = true;
   
   calcResizeHor();
   calcResizeVert();	

   recalcTable('tracklist');
   recalcTable('playlist');   

}

//Calculate new Dimensions and resize tracklist
function calcResizeHor() {
   Wwidth = window.getWidth();
   if (Wwidth==0) { // IE quirks mode
    	Wwidth = document.body.offsetWidth;
   }   
   $('cont_bottom').setStyle('width',Wwidth); 
   Nwidth = (Wwidth - $('directory').getSize().size.x)
   $('tracklist').setStyle('width',Nwidth);  
   // Set playlist width  
   $('playlist').setStyle('width',Wwidth);
   
   // Set directory container width for ie6
   if(window.ie6) { 
     mtpanels = $$('#dirTabs .mootabs_panel');
     mtpanels.setStyle('width', ($('directory').getSize().size.x -16));   
   }   
   
}

// Calculate new Dimensions and resize tracklist
function calcResizeVert() {
   Wheight = window['innerHeight'] || document.documentElement['clientHeight'] || document.body['clientHeight'];
   Nheight = Wheight - ($('playlist').getSize().size.y) - 75;
   $('cont_bottom').setStyle('height', Nheight);	
   $('tracklist').setStyle('height', Nheight);	 
   // Set directory container height
   mtitles = $$('#dirTabs ul.mootabs_title li');
   mtpanels = $$('#dirTabs .mootabs_panel');
   mtpanels.setStyle('height', (Nheight - mtitles[0].getSize().size.y -12 ));   

}

// Reload on resize
function redraw() {
  if (resizeFlag) {
  	resizeFlag = false;
  	setTimeout("calcResizer()", 100);
  }	
}

