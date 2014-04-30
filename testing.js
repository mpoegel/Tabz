
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
					open_tabs = new Array();
					chrome.tabs.query( {}, function(tabs){
						for (var i=0; i<tabs.length; i++) {
							open_tabs.push(tabs[i]);
						}
					});
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
	if(value.search(".com") >= 0){
		value = value.substring(0,value.search(".com"));
	}
	else if(value.search(".org") >= 0){
		value = value.substring(0,value.search(".org"));
	}
	else if(value.search(".edu") >= 0){
		value = value.substring(0,value.search(".edu"));
	}
	else if(value.search(".net") >= 0){
		value = value.substring(0,value.search(".net"));
	}
	else if(value.search(".tv") >= 0){
		value = value.substring(0,value.search(".tv"));
	}
	else if(value.search(".io") >= 0){
		value = value.substring(0,value.search(".io"));
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
	// console.log(value);
	return value;
		
}


function toggle() {
	var k = this.id.search('_header');
	var section = this.id.substring(0,k);
	// toggle the visibility
	document.getElementById(section).classList.toggle('hide_group');
	console.log("toggled "+section)
	// update the memory state
	chrome.storage.sync.get(section, function(result) {
		
		// foo
		
	});
}


function updateTabList() {
	
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
				if(name.length > 75){
					name = name.substring(0,75);
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
					
					// set the state of the new group
					console.log(section_name);
					var data = {};
					data[section_name] = true;
					chrome.storage.sync.set(data);
					
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
	

}

var open_tabs = new Array();

document.addEventListener('DOMContentLoaded', function() {
	
	document.getElementById('deleteButton').addEventListener('click', deleteMulti);
	
	// container to hold all the tabs
	var tab_list_div = document.createElement('div');
	tab_list_div.id = 'tab_list';
	document.body.appendChild(tab_list_div);
	
	chrome.tabs.query( {}, function(tabs){
		for (var i=0; i<tabs.length; i++) {
			open_tabs.push(tabs[i]);
		}
	});
	
	// temp!!
	chrome.storage.sync.clear();
	
	// check storage status
	chrome.storage.sync.set( {'value' : 6 } );
	chrome.storage.sync.get( 'value', function(items) {
		console.log(items.value);
	});
	
	// update that display bro
	updateTabList();
	
	chrome.storage.sync.get( function(items) {
		console.log(items);
	});

});





