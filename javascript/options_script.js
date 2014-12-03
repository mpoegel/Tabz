function StorageTest() {

	var url = "key2";
	var returned;
		chrome.storage.local.get(url, function(result) {	
			console.log(result);
		});
}

 $(document).ready(function() {
	$('#TestButton').click(StorageTest);
});