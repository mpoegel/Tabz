function updateTabList2() {
	
	var TABS_NODE = document.getElementById('tab_list');
	// clear the current list 
	while (TABS_NODE.hasChildNodes()) {
		TABS_NODE.removeChild(TABS_NODE.lastChild);
	}

		for (var i = 0; i < open_tabs.length; i++) {
			if (open_tabs[i] != null) {
				var container_div = document.createElement('div');
				
				var tab_div = document.createElement('div');
				tab_div.id = 'tab_' + i;
				tab_div.className = 'tab_class';
				tab_div.addEventListener('click', tabSelect);
				var name = open_tabs[i].title;
				if(name.length > 50){
					name = name.substring(0,50);
				}
				var to_add = document.createTextNode(name);
				tab_div.appendChild(to_add);
				
				// classify the current tab by url
				var section_name = classify(open_tabs[i]);
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
	// does stuff
	checkStates();

}

function tabSelect() {
	order(open_tabs);
	var tab_num = this.id.substring(4);

	chrome.tabs.query( {}, function(the_tabs) {
		order(the_tabs);
		chrome.tabs.update( the_tabs[tab_num].id, {active:true} );
	});
	
}


function deleteMulti() {
	
	chrome.tabs.query( {}, function(tabs) {
		order(tabs);
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
	order(open_tabs);
	var tab_num = this.id.substring(6);
	var checker = open_tabs[tab_num].id;
	// close the tab
	chrome.tabs.remove(open_tabs[tab_num].id);
	// update the list
	open_tabs.splice(tab_num, 1);
	// update the display
	updateTabList2();
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
		value = value.substring(0,value.search(".net"));
	}
	else if(value.search(".io") >= 0){
		value = value.substring(0,value.search(".io"));
	}
	else if(value.search(".co") >= 0){
		value = value.substring(0,value.search(".co"));
	}
	else if(value.search(".html") >= 0){
		value = value.substring(0,value.search(".html"));
	}
	if(value.search("/") >= 0){
		value = value.substring(value.search("/") + 1);
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
	order(open_tabs);
	var k = this.id.search('_header');
	var section = this.id.substring(0,k);
	// toggle the visibility
	document.getElementById(section).classList.toggle('hide_group');
	
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

/* THIS FUNCTION MUST BE CALLED BEFORE TRYING TO CHANGE ANY TABS  OR ELSE BAD THINGS*/
function order(tabs){

	for(var i = 0; i < tabs.length; i++){
		for(var j = 0; j < i; j++){
			if(classify(tabs[i]) < classify(tabs[j])){
				var tmp = tabs[i];
				tabs[i] = tabs[j];
				tabs[j] = tmp;
			}
		}
	}
}

function updateTabList() {
	/* looks for open tabs and puts tab elements in open tabs array */
	
	// reset the open_tabs array
	open_tabs = new Array();
	
	// add all the open tabs to the list
	// WARNING: ASYNCRONOUS CALL! 
	chrome.tabs.query( {}, function(tabs){
		for (var i=0; i<tabs.length; i++) {
			open_tabs.push(tabs[i]);
		}
	});
	
	// largest div container for all the tabs
	// DEPRECIATED
	var TABS_NODE = document.getElementById('tab_list');
	
	// clear the current list 
	$('#tab_list').empty();

	// build the groups and sort the tabs
	chrome.tabs.query({}, function (tabs) {
		
		// alphabetize the tabs (WHY?)
		order(tabs);
		
		// loop over all the tabs
		for (var i = 0; i < tabs.length; i++) {
			
			// double check to make sure the tab is valid
			if (tabs[i] != null) {
				
				// create a container div to contain the tab's div
				var container_div = document.createElement('div');
				
				// get the name for the tab
				var name = tabs[i].title;
				if(name.length > 50){
					name = name.substring(0,50);
				}
				// create a container for the tab itself
				$('<div/>', {
					id: 'tab_'+i,
					'class': 'tab_class',
					click: tabSelect,
					text: name
				}).appendTo(container_div);
				
				// classify the current tab by its URL
				var section_name = classify(tabs[i]);
				
				// if that section doesn't exist then create it
				if (document.getElementById(section_name) == null) {
					
					// create a header for the section
					$('<div/>', {
						id: section_name + '_header',
						'class': 'group_header',
						click: toggle,
						text: section_name
					}).appendTo('#tab_list');						
			
					// create the section node under the header that will get toggled
					$('<div/>', {
						id: section_name,
						'class': 'tab_group'
					}).appendTo('#tab_list');
					
				} // end section creation
				
				// add an X button
				// this is gross--replace this
				$('<div/>', {
					id: 'tab_x_' + i,
					'class': 'tab_x',
					click: removeTab,
					text: 'x'
				}).appendTo(container_div);
				
				// add the tab (and x) to the section
				$('#'+section_name).append(container_div);				
			}
		}
	});
	
	// does stuff
	// ??
	checkStates();

}

function StorageTest() {
	var array = new Array;
	var url = "key2";
	chrome.tabs.query({},  function(tabs) {
		var title = prompt("Please enter the title of this tab set");
		while (!title && title != null){
			title = prompt("Please enter the title, none was given");
		}
		if(title == null){
				return;
		}
		for (var i=0; i<tabs.length; i++) {
			array.push(tabs[i].url);
		}
		array.push(title);
		chrome.storage.local.get(url, function(result) {
			try{
				console.log(result);
				value = result[url];
				value.push(array);
				result[url] = value;
				chrome.storage.local.set( result );
			}
			catch(err){
				var obj = {};
				obj[url] = [array];
				chrome.storage.local.set( obj );
			}
		});
	});

}

/* -------------------------------------------------------------------- */
/*  Main run code for popup */

// global variable containing all the open tabs... eh
var open_tabs = new Array();
$(document).ready(function() {
	
	// add event listener to the delete button to call deleteMulti function
	$('#deleteButton').click(deleteMulti);
	$('#TestButton').click(StorageTest);
	
	// container to hold all the tabs
	$('<div/>', {
		id: 'tab_list'
	}).appendTo('body');
	
	// update that display bro
	updateTabList();

});
