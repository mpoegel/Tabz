
function tabSelect() {
	var tab_num = this.id.substring(4);

	chrome.tabs.query( {}, function(the_tabs) {
		chrome.tabs.update( the_tabs[tab_num].id, {active:true} );
	});
	
}

function deleteMulti(list)
{
	var removing = []; 
	for(var i = 0; i < list.length; i++){
		var removing = []; 
		for(var j = 0; j < list.length; j++){
			if(i == j){
				continue;
			}
			if(list[i].url == list[j].url){
				removing.push(j);
			}
			
		}
		chrome.tabs.remove(removing);
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