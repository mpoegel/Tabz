function main() {
	alert("hellooooooooooooooooo again!");
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
	
	var my_div = document.createElement('div');
	my_div.innerHTML('HELLO WORLD');
	
	document.body.appendChild(my_div, document.body.firstChild);
	
});