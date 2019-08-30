﻿// swapImages.jsx// © cuppascript, 07/2009//// Installs two commands in the contextmenu: swap frame and swap content// Intended to be used with images// swap content replaces the images instead of using copy/paste, thus the result is dependant on the preference on replacing images// Gebrauch wie immer auf eigene Gefahr, // wir können nicht garantieren, dass das Script nicht mal unerwartete Ergebnisse erzeugt// #targetengine "singel" ContextPlace(); function ContextPlace(){ 	var myLayoutContextMenu = app.menus.item("$ID/RtMouseLayout"); 	var myTextContextMenu = app.menus.item("$ID/RtMouseText"); 	try{ 		var mySwapAction = app.scriptMenuActions.item("Bilder tauschen"); 		mySwapAction.name; 	} catch(myError){		var mySwapAction = app.scriptMenuActions.add("Bilder tauschen"); 	} 	try{ 		var mySwapAction2 = app.scriptMenuActions.item("Rahmen tauschen"); 		mySwapAction2.name; 	} catch(myError){		var mySwapAction2 = app.scriptMenuActions.add("Rahmen tauschen"); 	} 	try{ 		var mySwapAction3 = app.scriptMenuActions.item("In Platziercursor laden"); 		mySwapAction3.name; 	} catch(myError){		var mySwapAction3 = app.scriptMenuActions.add("In Platziercursor laden"); 	} 	var myEventListener = mySwapAction.eventListeners.add("onInvoke", swapImages, false); 	var myEventListener2 = mySwapAction2.eventListeners.add("onInvoke", swapPlaces, false); 	var myEventListener3 = mySwapAction3.eventListeners.add("onInvoke", loadCursor, false); 	var myLSep = myLayoutContextMenu.menuSeparators.add();	var myLPlaceMenuItem = myLayoutContextMenu.menuItems.add(mySwapAction); 	var myLPlaceMenuItem2 = myLayoutContextMenu.menuItems.add(mySwapAction2); 	var myLPlaceMenuItem3 = myLayoutContextMenu.menuItems.add(mySwapAction3); 		function swapImages(myEvent){ 		var mySelection = app.selection; 		 		if (mySelection.length == 2 && mySelection[0].allGraphics.length > 0 && mySelection[1].allGraphics.length > 0) 		{ 			if (mySelection[0].allGraphics[0].itemLink.status == LinkStatus.NORMAL && mySelection[1].allGraphics[0].itemLink.status == LinkStatus.NORMAL) {				var firstLink = mySelection[0].allGraphics[0].itemLink.filePath; 				var secondLink = mySelection[1].allGraphics[0].itemLink.filePath; 				mySelection[0].place(secondLink); 				mySelection[1].place(firstLink); 			} else {				alert("Mindestens ein Bild ist nicht aktuell verlinkt.");			}		} else {			alert("Markieren Sie bitte zwei Bildrahmen");		}	}	function swapPlaces(myEvent){ 		var mySelection = app.selection 		if (mySelection.length == 2) 		{ 			var gb1 = mySelection[0].geometricBounds; 			var gb2 = mySelection[1].geometricBounds;	 			switch(app.activeDocument.layoutWindows[0].transformReferencePoint) {				case AnchorPoint.TOP_LEFT_ANCHOR:					var x1 = gb1[1];					var x2 = gb2[1];					var y1 = gb1[0];					var y2 = gb2[0];					break;				case AnchorPoint.TOP_CENTER_ANCHOR:					var x1 = gb1[1] + (gb1[3] - gb1[1])/2;					var x2 = gb2[1] + (gb2[3] - gb2[1])/2;					var y1 = gb1[0];					var y2 = gb2[0];					break;				case AnchorPoint.TOP_RIGHT_ANCHOR:					var x1 = gb1[3];					var x2 = gb2[3];					var y1 = gb1[0];					var y2 = gb2[0];					break;				case AnchorPoint.LEFT_CENTER_ANCHOR:					var x1 = gb1[1];					var x2 = gb2[1];					var y1 = gb1[0] + (gb1[2] - gb1[0])/2;					var y2 = gb2[0] + (gb2[2] - gb2[0])/2;					break;				case AnchorPoint.CENTER_ANCHOR:					var x1 = gb1[1] + (gb1[3] - gb1[1])/2;					var x2 = gb2[1] + (gb2[3] - gb2[1])/2;					var y1 = gb1[0] + (gb1[2] - gb1[0])/2;					var y2 = gb2[0] + (gb2[2] - gb2[0])/2;					break;				case AnchorPoint.RIGHT_CENTER_ANCHOR:					var x1 = gb1[3];					var x2 = gb2[3];					var y1 = gb1[0] + (gb1[2] - gb1[0])/2;					var y2 = gb2[0] + (gb2[2] - gb2[0])/2;					break;				case AnchorPoint.BOTTOM_LEFT_ANCHOR:					var x1 = gb1[1];					var x2 = gb2[1];					var y1 = gb1[2];					var y2 = gb2[2];					break;				case AnchorPoint.BOTTOM_CENTER_ANCHOR:					var x1 = gb1[1] + (gb1[3] - gb1[1])/2;					var x2 = gb2[1] + (gb2[3] - gb2[1])/2;					var y1 = gb1[2];					var y2 = gb2[2];					break;				case AnchorPoint.BOTTOM_RIGHT_ANCHOR:					var x1 = gb1[3];					var x2 = gb2[3];					var y1 = gb1[2];					var y2 = gb2[2];					break;			}			var diff = [x1-x2, y1-y2]; 			mySelection[1].move(undefined, diff); 			diff[0] = diff[0]*-1; 			diff[1] = diff[1]*-1; 			mySelection[0].move(undefined, diff); 		} else {			alert("Markieren Sie bitte zwei Bildrahmen");		}	}	function loadCursor(myEvent){ 		var mySelection = app.selection; 		var loadedImages = new Array();		for (var n = 0; n < mySelection.length; n++) {			for (var m = 0; m < mySelection[n].allGraphics.length; m++) {				if (mySelection[n].allGraphics[m].itemLink.status == LinkStatus.NORMAL) {					loadedImages.push( File(mySelection[n].allGraphics[m].itemLink.filePath));					mySelection[n].allGraphics[m].remove();				}			}		}		if (app.selection.length == 1) {			app.select(NothingEnum.NOTHING);		}		app.place(loadedImages);	}}