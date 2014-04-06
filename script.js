
function tabSelect() {
	var tab_num = this.id.substring(4);

	chrome.tabs.query( {}, function(the_tabs) {
		chrome.tabs.update( the_tabs[tab_num].id, {active:true} );
	});
	
}


function deleteMulti() {
	
	chrome.tabs.query( {}, function(tabs) {
	
		for (var i = 0; i < tabs.length; i++) {
			for (var j = 0; j < tabs.length; j++) {
				if (i == j) { continue; }
				if (tabs[i].url == tabs[j].url) {
					chrome.tabs.remove(tabs[j].id);
					j--;
				}
			}
		}
	});
	
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
	
	for (var i = 0; i < value.length; i++) {
		if(value[i] == ".") {
			return value.substring(0, i);
		}
	}
	
	console.log(value);
	return value;
		
}


document.addEventListener('DOMContentLoaded', function() {
	
	document.getElementById('deleteButton').addEventListener('click', deleteMulti);
	
	console.log('hello world');
	
	chrome.tabs.query({}, function (tabs) {
		for (var i = 0; i < tabs.length; i++) {
			if (tabs[i] != null) {
				var tab_div = document.createElement('div');
				tab_div.id = 'tab_' + i;
				tab_div.className = 'tab_class';
				tab_div.addEventListener('click', tabSelect);
				var to_add = document.createTextNode(tabs[i].title);
				tab_div.appendChild(to_add);
				
				// classify the current tab by url
				var section_name = classify(tabs[i]);
				var section_div;
				
				// if that classifcation doesn't exist then create it
				if (document.getElementById(section_name) == null) {
					
					// create a header node for the div
					var section_header = document.createTextNode(section_name);
					var header_div = document.createElement('div');
					header_div.id = section_name + '_header';
					document.body.appendChild(header_div);
					
					// create the section node under the header that will get toggled
					section_div = document.createElement('div');
					section_div.id = section_name;
					section_div.className = 'tab_group';
					
					section_div.appendChild(section_header);
					
					document.body.appendChild(section_div);
					
				}
				// if it does then retrieve it
				else { section_div = document.getElementById(section_name);  }
				
				// add the tab to the appropriate section
				section_div.appendChild(tab_div);
			}
		}
	});


});