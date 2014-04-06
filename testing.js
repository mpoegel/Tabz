
function tabSelect() {
	var tab_num = this.id.substring(4);

	chrome.tabs.query( {}, function(the_tabs) {
		chrome.tabs.update( the_tabs[tab_num].id, {active:true} );
	});
	
}

function deleteMulti() {
	
	chrome.tabs.query( {}, function(tabs) {
	
		var removing = []; 
		for(var i = 0; i < tabs.length; i++){
			var removing = []; 
			for(var j = 0; j < tabs.length; j++){
				if(i == j){
					continue;
				}
				if(tabs[i].url == tabs[j].url){
					removing.push(j.id);
				}
				
			}
			chrome.tabs.remove(removing);
		}	
		
	}
}


document.addEventListener('DOMContentLoaded', function() {
	
	
	
	
	chrome.tabs.query({}, function (tabs) {
		for (var i = 0; i < tabs.length; i++) {
			if (tabs[i] != null) {
				var this_div = document.createElement('div');
				this_div.id = 'tab_' + i;
				this_div.class = 'tab_class';
				this_div.addEventListener('click', tabSelect);
				var to_add = document.createTextNode(tabs[i].title);
				this_div.appendChild(to_add);
				document.body.appendChild(this_div);
			}
		}
	});


});


function TabTag(tab)
{
	var value = tab.url;
	
	if (value == "") { return "New Tab"; }
	
	if(value.search("www.") >= 0)
	{
		value = value.substring(value.search("www.") + 4);
	}
	else if(value.search("://") >= 0){
		value = value.substring(value.search("://") + 3 );
	}
	if(value.search(".com") >= 0){
		value = value.substring(0,value.search(".com"));
	}
	else if(value.search(".edu") >= 0){
		value = value.substring(0,value.search(".edu"));
	}
	else if(value.search(".net") >= 0){
		value = value.substring(0,value.search(".net"));
	}
	else if(value.search(".org") >= 0){
		value = value.substring(0,value.search(".org"));
	}
	
	for(var i = value.length - 1; i >= 0; i--){
		if(value[i] == "."){
			return value.substring(i);
		}
	}
	return value;

}

