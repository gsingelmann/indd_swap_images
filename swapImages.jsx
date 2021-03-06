// ------------------------------------------------------------------------------------------------------------------
//Description:Installs context menus to swap images
// [Ver. 1]  
// [Autor: Gerald Singelmann. ] 
// [Lang: DE]  
// [Getestet mit: InDesign CC2020]  
// [Creat: 19-10-09]  
// Bugs & Feedback : gs@cuppascript.com
// www.cuppascript.com
// ------------------------------------------------------------------------------------------------------------------
#targetengine "com.cuppascript.imageswap" 

var dbg = false;
var flog;	// log-file

var _l = {
  swapImage: { 
      de: 'Bilder tauschen',
      en: 'Swap Images',
  },
  swapFrame: { 
      de: 'Rahmen tauschen',
      en: 'Swap Frames',
  },
  reloadGun: { 
      de: 'In Platziercursor laden',
      en: 'Reload Place Gun',
  },
  missingLink: { 
      de: 'Mindestens ein Bild fehlt',
      en: 'At least on image is missing',
  },
  twoFrames: { 
      de: 'Markieren Sie bitte zwei Bilderrahmen',
      en: 'Please select two image frames',
  },
}

var myLayoutContextMenu = app.menus.item("$ID/RtMouseLayout"); 
log( "Got context menu", myLayoutContextMenu.isValid );

try{ 
	var mySwapAction = app.scriptMenuActions.item( localize( _l.swapImage ) ); 
	mySwapAction.name; 
	log( "swap-action reused");
} catch(myError){
	var mySwapAction = app.scriptMenuActions.add(localize( _l.swapImage ) ); 
	log( "swap-action created");
} 
try{ 
	var mySwapAction2 = app.scriptMenuActions.item(localize( _l.swapFrame ) ); 
	mySwapAction2.name; 
	log( "swap frame reused");
} catch(myError){
	var mySwapAction2 = app.scriptMenuActions.add(localize( _l.swapFrame )); 
	log( "swap frame created");
} 
try{ 
	var mySwapAction3 = app.scriptMenuActions.item(localize( _l.reloadGun )); 
	mySwapAction3.name; 
	log( "reload reused");
} catch(myError){
	var mySwapAction3 = app.scriptMenuActions.add(localize( _l.reloadGun )); 
	log( "reload created");
} 
var myEL1 = mySwapAction.eventListeners.add("onInvoke", swapImages, false); 
var myEL2 = mySwapAction2.eventListeners.add("onInvoke", swapPlaces, false); 
var myEL3 = mySwapAction3.eventListeners.add("onInvoke", loadCursor, false); 
log( "event-listeners ok", ( myEL1.isValid && myEL2.isValid && myEL3.isValid ));

var myLSep = myLayoutContextMenu.menuSeparators.add();
var myMI1 = myLayoutContextMenu.menuItems.add(mySwapAction); 
var myMI2 = myLayoutContextMenu.menuItems.add(mySwapAction2); 
var myMI3 = myLayoutContextMenu.menuItems.add(mySwapAction3); 
log( "menu-items ok", ( myMI1.isValid && myMI2.isValid && myMI3.isValid ));

function swapImages(myEvent){ 
	log( "swapping images" )
	var mySelection = app.selection; 
		
	if (mySelection.length == 2 && mySelection[0].allGraphics.length > 0 && mySelection[1].allGraphics.length > 0) 
	{ 
		if (mySelection[0].allGraphics[0].itemLink.status == LinkStatus.NORMAL && mySelection[1].allGraphics[0].itemLink.status == LinkStatus.NORMAL) {
			var firstLink = mySelection[0].allGraphics[0].itemLink.filePath; 
			var secondLink = mySelection[1].allGraphics[0].itemLink.filePath; 
			mySelection[0].place(secondLink); 
			mySelection[1].place(firstLink); 
			log("ok")
		} else {
			log( "link missing");
			alert(localize( _l.missingLink ));
		}
	} else {
		log( "no selection of 2")
		alert(localize( _l.twoFrames ));
	}
}
function swapPlaces(myEvent){ 
	log( "swapping frames");
	var mySelection = app.selection 
	if (mySelection.length == 2) 
	{ 
		var gb1 = mySelection[0].geometricBounds; 
		var gb2 = mySelection[1].geometricBounds;	 
		var trp = app.activeDocument.layoutWindows[0].transformReferencePoint;
		log( "crnt transform reference point: ", trp.toString() );
		switch(trp) {
			case AnchorPoint.TOP_LEFT_ANCHOR:
				var x1 = gb1[1];
				var x2 = gb2[1];
				var y1 = gb1[0];
				var y2 = gb2[0];
				break;
			case AnchorPoint.TOP_CENTER_ANCHOR:
				var x1 = gb1[1] + (gb1[3] - gb1[1])/2;
				var x2 = gb2[1] + (gb2[3] - gb2[1])/2;
				var y1 = gb1[0];
				var y2 = gb2[0];
				break;
			case AnchorPoint.TOP_RIGHT_ANCHOR:
				var x1 = gb1[3];
				var x2 = gb2[3];
				var y1 = gb1[0];
				var y2 = gb2[0];
				break;
			case AnchorPoint.LEFT_CENTER_ANCHOR:
				var x1 = gb1[1];
				var x2 = gb2[1];
				var y1 = gb1[0] + (gb1[2] - gb1[0])/2;
				var y2 = gb2[0] + (gb2[2] - gb2[0])/2;
				break;
			case AnchorPoint.CENTER_ANCHOR:
				var x1 = gb1[1] + (gb1[3] - gb1[1])/2;
				var x2 = gb2[1] + (gb2[3] - gb2[1])/2;
				var y1 = gb1[0] + (gb1[2] - gb1[0])/2;
				var y2 = gb2[0] + (gb2[2] - gb2[0])/2;
				break;
			case AnchorPoint.RIGHT_CENTER_ANCHOR:
				var x1 = gb1[3];
				var x2 = gb2[3];
				var y1 = gb1[0] + (gb1[2] - gb1[0])/2;
				var y2 = gb2[0] + (gb2[2] - gb2[0])/2;
				break;
			case AnchorPoint.BOTTOM_LEFT_ANCHOR:
				var x1 = gb1[1];
				var x2 = gb2[1];
				var y1 = gb1[2];
				var y2 = gb2[2];
				break;
			case AnchorPoint.BOTTOM_CENTER_ANCHOR:
				var x1 = gb1[1] + (gb1[3] - gb1[1])/2;
				var x2 = gb2[1] + (gb2[3] - gb2[1])/2;
				var y1 = gb1[2];
				var y2 = gb2[2];
				break;
			case AnchorPoint.BOTTOM_RIGHT_ANCHOR:
				var x1 = gb1[3];
				var x2 = gb2[3];
				var y1 = gb1[2];
				var y2 = gb2[2];
				break;
		}
		var diff = [x1-x2, y1-y2]; 
		mySelection[1].move(undefined, diff); 
		diff[0] = diff[0]*-1; 
		diff[1] = diff[1]*-1; 
		mySelection[0].move(undefined, diff); 
		log( "moved by", diff.join("x") );
	} else {
		log( "no selection of 2");
		alert(localize( _l.twoFrames ));
	}
}
function loadCursor(myEvent){ 
	log("removing images and loading cursor");
	var mySelection = app.selection; 
	var loadedImages = new Array();
	for (var n = 0; n < mySelection.length; n++) {
		for (var m = 0; m < mySelection[n].allGraphics.length; m++) {
			if (mySelection[n].allGraphics[m].itemLink.status == LinkStatus.NORMAL) {
				loadedImages.push( File(mySelection[n].allGraphics[m].itemLink.filePath));
				mySelection[n].allGraphics[m].remove();
			}
		}
	}
	if (app.selection.length == 1) {
		app.select(NothingEnum.NOTHING);
	}
	app.place(loadedImages);
}

function log( a, b ) {
	if ( ! dbg ) return;
	if ( ! flog ) {
		flog = new File( Folder.desktop.fullName + "/swap_image_log.txt" );
		flog.encoding = "UTF-8";
		flog.open("w");
	}
	var now = new Date();
	now = now.getFullYear() + r2( now.getMonth() ) + r2( now.getDate() ) + "-" + r2( now.getHours() ) + r2( now.getMinutes() ) + r2( now.getSeconds() ) + " - ";
	if ( b ) {
		flog.writeln( now + a + ": " + b );
	} else if ( a ) {
		flog.writeln( now + a );
	}

	function r2( str ) {
		return ("00" + str).substr(-2);
	}
}