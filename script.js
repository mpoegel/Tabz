
function tabSelect() {
	var tab_num = this.id.substring(4);

	chrome.tabs.query( {}, function(the_tabs) {
		chrome.tabs.update( the_tabs[tab_num].id, {active:true} );
	});
	
}


function deleteMulti() {
	
	chrome.tabs.query( {}, function(tabs) {
	
		for (var i = 0; i < tabs.length; i++) {
		var ids = [];
			for (var j = 0; j < tabs.length; j++) {
				if (i == j) { continue; }
				if (tabs[i].url == tabs[j].url) {
					chrome.tabs.remove(tabs[j].id);
					updateTabList();
					deleteMulti();
					return;
				}
			}
		}
	});
	
}



function removeTab() {
	var tab_num = this.id.substring(6);
	
	// close the tab
	chrome.tabs.remove(open_tabs[tab_num].id);
	// update the list
	open_tabs.splice(tab_num, 1);
	// update the display
	updateTabList();
}

// returns the div class that the url should be placed in
function classify(tab) {

	var value = tab.url;
	
	if (value == "") { return "New Tab"; }
	
	if(value.search("www.") >= 0) {
		value = value.substring(value.search("www.") + 4);
	}
	else if (value.search("://") >= 0) {
		value = value.substring(value.search("://") + 3 );
	}
	else if (value.search("sites.") >= 0) {
		value = value.substring(value.search("sites.") + 6 );
	}
	
	
	if(value.search(".com") >= 0){
		value = value.substring(0,value.search(".com"));
	}
	else if(value.search(".org") >= 0){
		value = value.substring(0,value.search(".org"));
	}
	else if(value.search(".edu") >= 0){
		value = value.substring(0,value.search(".edu"));
	}
	else if(value.search(".tv") >= 0){
		value = value.substring(0,value.search(".tv"));
	}
	else if(value.search(".net") >= 0){
		console.log(value.search(".net"));
	}
	else if(value.search(".io") >= 0){
		value = value.substring(0,value.search(".io"));
	}
	else if(value.search(".co") >= 0){
		value = value.substring(0,value.search(".co"));
	}
	
	for(var i = value.length - 1; i >= 0; i--){
		if(value[i] == "."){
			value = value.substring(i+1);
		}
	}
	if(value[value.length-1] == "/"){
		value = value.substring(0, value.length-1);
	}
	
	value = value.charAt(0).toUpperCase() + value.slice(1);
	value = value.trim()
	return value;
		
}


function toggle() {
	var k = this.id.search('_header');
	var section = this.id.substring(0,k);
	// toggle the visibility
	document.getElementById(section).classList.toggle('hide_group');
	console.log("toggled "+section)
	
	// update the memory state
	chrome.storage.local.get(section, function(result) {
		
		var status = result[section];
		chrome.storage.local.remove(section);
		var dataObj = {};
		
		if (status) {
			dataObj[section] = false;
			chrome.storage.local.set(dataObj);
		}
		else {
			dataObj[section] = true;
			chrome.storage.local.set(dataObj);
		}
		
	});
	
}

function checkStates() {
	
	var groups = new Array();
	
	chrome.tabs.query({}, function(tabs) {
		for (var i=0; i<tabs.length; i++) {
			var name = classify(tabs[i]);
			if (groups.indexOf(name) == -1) {
				groups.push(name);
			}
		}
				
	chrome.storage.local.get(groups, function(result) {
		for (var k=0; k<groups.length; k++) {
			var g = groups[k];
			// create new if not found
			console.log(result[g]);
			if (result[g] == null) {
				var dataObj = {};
				dataObj[g] = true;
				chrome.storage.local.set(dataObj);
			}
			// if its false then make the group hidden
			else if (result[g] == false) {
				document.getElementById(g).classList.toggle('hide_group');
			}
			// else true do nothing
		}
	});
			
		
		
	});
	
}

function updateTabList() {
	
	//looks for open tabs and puts tab elements in open tabs array
	open_tabs = new Array();
	chrome.tabs.query( {}, function(tabs){
		for (var i=0; i<tabs.length; i++) {
			open_tabs.push(tabs[i]);
		}
	});
	var TABS_NODE = document.getElementById('tab_list');
	// clear the current list 
	while (TABS_NODE.hasChildNodes()) {
		TABS_NODE.removeChild(TABS_NODE.lastChild);
	}

	chrome.tabs.query({}, function (tabs) {
		for (var i = 0; i < tabs.length; i++) {
			if (tabs[i] != null) {
				var container_div = document.createElement('div');
				
				var tab_div = document.createElement('div');
				tab_div.id = 'tab_' + i;
				tab_div.className = 'tab_class';
				tab_div.addEventListener('click', tabSelect);
				var name = tabs[i].title;
				if(name.length > 50){
					name = name.substring(0,50);
				}
				var to_add = document.createTextNode(name);
				tab_div.appendChild(to_add);
				
				// classify the current tab by url
				var section_name = classify(tabs[i]);
				var section_div;
				
				// if that classifcation doesn't exist then create it
				if (document.getElementById(section_name) == null) {
					
					// create a header node for the div
					var section_header = document.createTextNode(section_name);
					var header_div = document.createElement('div');
					header_div.className = 'group_header';
					header_div.id = section_name + '_header';
					header_div.appendChild(section_header);
					header_div.addEventListener('click', toggle);
					TABS_NODE.appendChild(header_div);
	
			
					// create the section node under the header that will get toggled
					section_div = document.createElement('div');
					section_div.id = section_name;
					section_div.className = 'tab_group';
										
					TABS_NODE.appendChild(section_div);
					
				}
				// if it does then retrieve it
				else { section_div = document.getElementById(section_name);  }
				
				// add the tab to the appropriate section
				container_div.appendChild(tab_div);
				
				// add an X button
				var del_div = document.createElement('div');
				del_div.className = 'tab_x';
				del_div.id = 'tab_x_' + i;
				del_div.addEventListener('click', removeTab);
				del_div.appendChild(document.createTextNode('x'));
				container_div.appendChild(del_div);
				
				section_div.appendChild(container_div);
				
			}
		}
	});
	
	// does stuff
	checkStates();

}


/* -------------------------------------------------------------------- */
/*  Main run code for popup */

var open_tabs = new Array();

document.addEventListener('DOMContentLoaded', function() {
	
	//event listener for delete duplicate button, will run on click
	document.getElementById('deleteButton').addEventListener('click', deleteMulti);
	
	// container to hold all the tabs
	var tab_list_div = document.createElement('div');
	tab_list_div.id = 'tab_list';
	document.body.appendChild(tab_list_div);
	
	// update that display bro
	updateTabList();

});





