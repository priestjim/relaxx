/*
   contextmenu.js
   Javascript - Custom Contextmenu for RelaXX
*/

contextMenu = new Class({
	options:{
		selector: '.contextmenu', className: '.protoMenu', pageOffset: 25, title: false, marktarget: true
	},
	initialize: function (op) {
		this.setOptions(op);
		this.cont=new Element('div',{'class': this.options.className});
		if (this.options.title) this.cont.adopt(new Element('div', {'class': 'title'}).setHTML(this.options.title));
		this.options.menuItems.each(function(item){
			var icon = (item.icon) ? 'url('+imgpath+item.icon+'.gif)' : 'url('+imgpath+'clean.gif)';
			this.cont.adopt(item.separator ?
			     new Element('div', {'class': 'separator'}) :
			     new Element('a', { 'styles': { 'backgroundImage': icon }, 'href': '#', 'title': item.name, 'class': item.disabled ? 'disabled' : ''}).addEvent('click', this.onClick.bindWithEvent(this,[item.callback])).setHTML(item.name))
		}.bind(this));
		this.cont.style.display = 'none';
		$(document.body).adopt(this.cont);
		document.addEvents({
			'click':this.hide.bind(this),  'contextmenu' :this.hide.bind(this)
		});

		$(this.options.selector).addEvent(window.opera?'mousedown':'contextmenu',function(e){
			this.show(e);
		}.bind(this));
	},
	hide: function(){ this.cont.style.display = 'none'; if(this.marked) { this.marked.className=this.marked.className.replace(' hover',''); current_row = this.marked; this.marked =false;} },
	show: function(event) {
		e=new Event(event);
        if(window.opera && !e.rightClick) return;
		e.cancelBubble = true;
		e.stop();

		if(this.marked) { this.marked.className=this.marked.className.replace(' hover',''); }
		if ((this.options.marktarget) && (e.target.tagName=='TD')) {
			this.marked = e.target.parentNode;
			this.marked.className += " hover";
		}
		var oCont=this.cont.getCoordinates(),
		size = {'height':window.getHeight(), 'width':window.getWidth(), 'top': window.getScrollTop(),'cW':oCont.width, 'cH':oCont.height};
        if (size.width==0) { // Fix IE quirks mode
    	    size.width = document.body.offsetWidth;
    	    size.height = document.body.offsetHeight;
        }
		this.cont.setStyles({
			left: ((e.page.x + size.cW + this.options.pageOffset) > size.width ? (size.width - size.cW - this.options.pageOffset) : e.page.x),
			top: ((e.page.y - size.top + size.cH) > size.height && (e.page.y - size.top) > size.cH ? (e.page.y - size.cH) : e.page.y)
		});
		this.cont.style.display = 'block'
	},
	onClick:function(e,args){
		if (args && !e.target.hasClass('disabled'))	this.hide(); args();
	}
});
contextMenu.implement(new Options());

/** init relaxx-player context menu on load */
window.addEvent('domready', function() {
    
    /* playlist context menu */      		
	var plMenu = [
			{name: language.menu_play_current, icon: 'playback' , callback: function(){controllRemote('play', $(current_row).attributes['plid'].nodeValue,true,'playback');}},
			{name: language.menu_up, icon: 'up', callback: function(){current_element='playlist'; handleKeys(null, 'up');}},
			{name: language.menu_down, icon: 'down', callback: function(){current_element='playlist'; handleKeys(null, 'down');}},
			{separator: true},
			{name: language.menu_select, icon: 'select', callback: function(){ toggleSelected('playlist',false);}},
			{name: language.menu_deselect, icon: 'deselect', callback: function(){ toggleSelected('playlist',true);}},
			{name: language.menu_rem_selected, icon: 'cut', callback: function(){removeSelected();}},
			{separator: true},
			{name: language.menu_radio, icon: 'radio', callback: function(){addStream();}},
			{name: language.menu_savepl, icon: 'save', callback: function(){savePlaylist();}},
			{name: language.menu_clear_old, icon: 'clean', callback: function(){removeOld()}},
			{name: language.menu_clear, icon: 'delete', callback: function(){controllRemote('clear','',true,'playlist');}}
		];				
		
     var plContext = new contextMenu({
				selector: 'playlist',
				className: 'ccmenu',
				fade: false,
     	        title: language.playlist,
				menuItems: plMenu
			});			

    /* tracklist context menu */ 
	var trackMenu = [
			{name: language.menu_select, icon: 'select', callback: function(){ toggleSelected('tracklist',false); }},
			{name: language.menu_deselect, icon: 'deselect', callback: function(){ toggleSelected('tracklist',true);}},
			{separator: true},
			{name: language.menu_append, icon: 'append', callback: function(){ addSelected(); }},
			{separator: true},
			{name: "Play in browser.... [B]", icon: 'song-info', callback: function(){current_element='tracklist'; handleKeys(null, 'b');}}		
		];				
     var trackContext = new contextMenu({
				selector: 'tracklist',
				className: 'ccmenu',
				fade: false,
     	        title: language.tab_tracks,
				menuItems: trackMenu
			});
});
