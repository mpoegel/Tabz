
function tabSelect() {
	var tab_num = this.id.substring(4);

	chrome.tabs.query( {}, function(the_tabs) {
		chrome.tabs.update( the_tabs[tab_num].id, {active:true} );
	});
	
}




document.addEventListener('DOMContentLoaded', function() {
	
	chrome.tabs.query({}, function (tabs) {
	for (var i = 0; i < tabs.length; i++) {
		if (tabs[i] != null) {
			var this_div = document.createElement('div');
			this_div.id = 'tab_' + i;
			this_div.className = 'tab_class';
			this_div.addEventListener('click', tabSelect);
			var to_add = document.createTextNode(tabs[i].title);
			this_div.appendChild(to_add);
			document.body.appendChild(this_div);
		}
	}
	});
	
	


});