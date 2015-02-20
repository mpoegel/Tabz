function StorageTest() {

	var url = "key3";
		chrome.storage.local.get(url, function(result) {	
			console.log(result);
	});
}

 $(document).ready(function() {
	$('#TestButton').click(StorageTest);
});