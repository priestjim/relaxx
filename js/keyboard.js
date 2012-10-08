/*
   keyboard.js
   OnScreen-Keyboard for RelaXXPlayer
   Autor: Dirk Hoeschen www.dirk-hoeschen.de
   This code is public domain
*/

var osKeys = new Array(2)

osKeys[0] = new Array ('1','2','3','4','5','6','7','8','9','0',
                          'q','w','e','r','t','y','u','i','o','p',
                          'a','s','d','f','g','h','j','k','l','#',
                          'z','x','c','v','b','n','m',',','.','-');
osKeys[1] = new Array ('!','@','$','%','&amp;','*',':','_','"','=',
                          'Q','W','E','R','T','Y','U','I','O','P',
                          'A','S','D','F','G','H','J','K','L','?',
                          'Z','X','C','V','B','N','M',';',':','+');

osKeyboard = new Class({
   options:{
           position: 'bottom', className: 'keyboard', id: 'keyboard'
   },
   initialize: function (op) {
      this.setOptions(op);
      this.cont=new Element('div',{'class': this.options.className, 'id': this.options.id,'styles': {'display':'none'}});
      this.shift=0;
      // fill container with keys
      line=new Element('div');
      // lines 1 .. 4 .... innerHTML is much faster
      for (var i = 0; i < 10; ++i) { line.innerHTML += '<button style="width:20px;padding:1px" value=".">.</button>'; }
      for (var n = 0; n < 4; ++n) { this.cont.innerHTML += '<div style="display:block; white-space:ignore;">'+line.innerHTML+"</div>"; }

      // last Line
      this.cont.innerHTML += '<div style="display:block; white-space:ignore;">'
                       +'<button id="shiftKey" class="" style="width:20px;padding:1px" value="&#8593;">&uarr;</button>'
                       +'<button value=" " style="width:130px;padding:1px">space</button>'
                       +'<button value="enter" style="width:42px;padding:1px">enter</button>'
                       +'<button value="&#8592;" style="width:20px;padding:1px">&larr;</button></div>';           

      $(document.body).adopt(this.cont);
      // add clik events to the keys
      $$('#'+this.options.id+' button').each(function(button) {
         button.addEvent('click', this.onClick.bindWithEvent(this,[button]));
      }.bind(this));

      this.bound = { 'hide': this.hide.bindWithEvent(this) }
      this.cont.addEvent('click', function(e) { e.stop(); }.bindWithEvent(this));
   },
   doShift: function() { // insert key values
      $('shiftKey').className = (this.shift) ? "pushed" : "";
      keys = $$('#'+this.options.id+' button');
      for (var i = 0; i < (10*4); ++i) {
         keys[i].value = osKeys[this.shift][i];           
         keys[i].innerHTML = osKeys[this.shift][i];
      }
   },
   hide: function(e) {  // hide keyboard
           if (e.target!=this.target) {
            this.cont.style.display = 'none';
            document.removeEvent('click', this.bound.hide);
           }
   },
   show: function(e) { // show keyboard
      if (this.cont.style.display == 'none') {
         e.stop();
         var eCoordinates=e.target.getCoordinates();
         this.target = e.target;
         this.shift=0;
         this.doShift();
         this.cont.style.display = 'block';
         switch (this.options.position) {
            case "top":
            lPos = eCoordinates.left; tPos = (eCoordinates.top  - this.cont.getSize().size.y);
            break;
            case "right":
            lPos = eCoordinates.right; tPos = eCoordinates.top;
            break;
            case "bottom":
            lPos = eCoordinates.left; tPos = eCoordinates.bottom;
            break;
            case "mouse":
            lPos = (e.page.x+10);  tPos = (e.page.y - this.cont.getSize().size.y);;
            break;
          }
         this.cont.setStyles({ left: lPos, top:  tPos });
         this.coordinates = this.cont.getCoordinates();
         document.addEvent('click', this.bound.hide );
    }
   },
   onClick:function(e,target){  // handle keyclick
        e.stop();
        keyCode = null; charCode=null;
        if (target.value.charCodeAt(0)==8593) {
                this.shift = Math.abs(this.shift-1);
                this.doShift();
                return;
        } else if (target.value.charCodeAt(0)==8592) {
                keyCode = 0x08;
        } else if (target.value=='space') {
                charCode = 0x20;
        } else if (target.value=='enter') {
                keyCode = 0x0D;
        } else {
                charCode = target.value.charCodeAt(0);
        }
   this.target.focus();
   if (!window.gecko) { // the stupid IE does not support real simulation of keypress
      if (charCode) this.target.value += String.fromCharCode(charCode) 
      else if ((keyCode==0x08) && (this.target.value!="")) this.target.value = this.target.value.substr(0,(this.target.value.length-1))
      else if (keyCode==0x0D) this.target.value += "\n";
   } else {
     var evtObj = document.createEvent("KeyboardEvent");
     if(evtObj.initKeyEvent && this.target.dispatchEvent)   {
         evtObj.initKeyEvent("keypress",false,false,null,false,false,true,false,keyCode,charCode);
         this.target.dispatchEvent(evtObj);
       }
     }
   }
});

osKeyboard.implement(new Options());
var screenKeyboard = null;

/** init on screen keyboard on load */
window.addEvent('domready', function() {
    screenKeyboard = new osKeyboard();
    $$('input').each(function(input) {
        if ((input.type=="text") || (input.type=="password")) {
          input.addEvent('click', function(e){ screenKeyboard.show(e); }.bindWithEvent(this));
          input.setAttribute("autocomplete","off");
        }
    });
});
