function main() {
	
}




// if (document.title.indexOf("Google") != -1) {
    // Creating Elements
    // var btn = document.createElement("BUTTON")
    // var t = document.createTextNode("CLICK ME");
    // btn.appendChild(t);
    // Appending to DOM 
    // document.body.appendChild(btn);
		// document.write("hello world");
// }

document.addEventListener('DOMContentLoaded', function() {

	document.querySelector('button').addEventListener('click', main);
	
	chrome.tabs.query({}, function (tabs) {
	for (var i = 0; i < tabs.length; i++) {
		if (tabs[i] != null) {
			var this_div = document.createElement('div');
			var to_add = document.createTextNode(tabs[i].title);
			this_div.appendChild(to_add);	
			document.body.appendChild(this_div);
		}
	}
	});


});