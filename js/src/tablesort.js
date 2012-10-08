/*
   tablesoort.js
   Javascript - fast sortable tables
*/

tableSort = new Class({
	options:{
		table: 'sorttable', column : 0, firstsort: false
	},
	initialize: function (table, column) {
		this.table = table;
		this.column = column;
		// prepare table header cells
		this.titles = $$('#'+table+' thead th'); 
		this.titles[this.column].className = "asc";
		i=0;
		this.titles.each(function(cell) {
			cell.setProperty('column',i);
			cell.addEvent('click',function(){ this.sort(cell); }.bind(this));
			i++;
		}.bind(this));
	},
	reset: function(column) {
	    this.titles[this.column].className = "";
		this.column = column;	
		this.titles[column].className = 'desc'
	},
	sort: function(cell) {	        		                 
		var column = cell.getProperty('column');
		var rows = $$('#'+this.table+' tbody tr');		
		if(!rows[0].childNodes[column]) return;
        // Fill array with - values and IDs *fast*
        var values = new Array;
        i=0;
        rows.each( function(row) {
        	values.push(row.childNodes[column].innerHTML+"|"+i); i++;
        });
        this.asc = (cell.className == 'desc') ?  false : true;

        // reverse only if already sorted
   	   if (this.firstsort && column==this.column) { 
   	   	   values.reverse();   
	   } else {
		 this.firstsort=true;  
         // use internal array sort -  special handling for numeric values
         switch (cell.getProperty('axis')) {
        	case 'string':      	 
        	   values.sort();
        	   break;       	     
        	case 'number':       	
        	   values.sort(this.numsort);
        	   break;       	     
	     }
	   }   
               
        // rebuild table body into string *fast*
        var tBody = new Element('tbody');
        if (!window.ie) { tBody.setStyle('height', $(this.table).lastChild.getSize().size.y);  }       			                
        i=0;        
        values.each( function(value) {
        	n = value.split("|").pop(); // get index;
        	rows[n].className = (i % 2) ? rows[n].className.replace('odd' , 'even') : rows[n].className.replace('even' , 'odd') ;        	
        	tBody.appendChild(rows[n])
        	i++;
        });

        /* IE doesnt allow replace table innerHTML... therefore we use a trick */
        $(this.table).replaceChild(tBody,$(this.table).lastChild);
		if (column!=this.column) this.titles[this.column].className = "";
		this.column = column;
        // Change table header class	
        cell.className = (this.asc) ? "desc" : "asc";
	},
	numsort: function(a,b) {		
		a = parseInt(a.split("|").shift());
		b = parseInt(b.split("|").shift());
		return a-b;
	}
});
