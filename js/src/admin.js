/*
   admin.js
   Javascript - admin functions
*/

// intit on load
window.addEvent('domready', function() {
	  getOutputs();
	  /* Init Directory Tabs */
      var myTabs = new mootabs('dirTabs', {height: '100%', width: '100%'});
      mtitles = $$('#dirTabs ul.mootabs_title li');
      $('dirTabs').setStyle('height', (260 + mtitles[0].getSize().size.y) +10);   
  });

// Reload player
function closeAndReload() {
   	if (opener) { opener.location='index.php'; }
   	self.close();
}

// update Database
function updateDatabase() {
	 url = "include/controller-mpdadmin.php?action=updateDatabase";
	 new Ajax(url, {method: 'get'}).request();
	 alert('Update may take several minutes.\nPlease wait a while and refresh player.');
}

// get Output data
function getOutputs() {
   url = "include/controller-mpdadmin.php?action=getOutputs";
   var request = new Json.Remote(url, {
    	onComplete: function(jsonObj) {
    	  if ((jsonObj) && (jsonObj!='error')) {    	  
    	  	i=0;
    	    jsonObj.outputs.each( function(output) {
    	    	if (output.outputid) {
    	    	   $('outputSelect').options[i] = new Option(output.outputid, output.outputid); 
    	    	   i++;
    	    	} else {
      	       	   $('outputSelect').getLast().text +=  ": "+output.outputname
    	           if (output.outputenabled=="1") $('outputSelect').getLast().selected='selected';   	
    	        }        	    
    	   });  
    	  }
    	}	
   	 }).send();
 }

// toggle Outputs
function toggleOutput() {
	for (var i = 0; i < $('outputSelect').length; ++i) {
	   action = ($('outputSelect').options[i].selected!="") ? 'enableOutput' : 'disableOutput';
	   url = "include/controller-mpdadmin.php?action="+action+"&value="+i;
	   request = new Ajax(url, {method: 'get'}).request();
	}  	
}	