function write_storage(removed){
    var instance = $('#Storage_Removal');
    var url = "key12313";
        chrome.storage.local.get(url, function(result) {    
            try{
                for(var i = 0; i < result[url].length; i++){
                        place = true;
                        for(var j = 0; j < removed.length; j++){
                            if(removed[j].trim() == result[url][i][result[url][i].length-1].trim()){
                                place = false;
                            }
                        }
                        if(place){
                            var noChars = result[url][i][result[url][i].length-1].replace(/ |@|#|\$|\\|\'|\"|,|\.|\//g, "_");
                            var button = '<li><button class="removal_buttons" id="'+noChars + "___TABZUSE" + '"  >' +  result[url][i][result[url][i].length-1] + ' </button></li>';
                            instance.append(button);
                        }
                    
                }
            }
            catch(err){}
    });
}

function remove_storage(name){
    var url = "key12313";
    var new_name = String(name);
    var index = -1;
    new_name = name.substring(0, name.length - 1);
    chrome.storage.local.get(url, function(result) {    
        for(var i = 0; i < result[url].length; i++){
            if(result[url][i][result[url][i].length-1].trim() == new_name.trim()){
                index = i;
            }
        }
        result[url].splice(index, 1);
        chrome.storage.local.set( result );
        }); 
}

function clear_stored(){
    $("#Storage_Removal").remove();
    var instance = $('#Storage_spot');
    var to_add = '<ul style="list-style-type:none" id="Storage_Removal"></ul>'
    instance.append(to_add);
}

 $(document).ready(function() {
    var removed = [];
    write_storage(removed);

    $("#windowOnlyMode").click(function(e) {
        if(!this.checked) {
            chrome.storage.local.set({"TABZKEY1": false}, function()  {
                console.log("Turned Mode to False");
                $("#windowOnlyMode").prop("checked", false);
            });
        }
        else {
            chrome.storage.local.set({"TABZKEY1": true}, function()  {
                console.log("Turned Mode to True");
                $("#windowOnlyMode").prop("checked", true);

            });
        }
    });

    $(document).on('click', '.removal_buttons', function() {
        var obj_id = this.id;
        var to_close = $('#'+obj_id).html();
        remove_storage(to_close);
        $( '#'+obj_id).remove();
        removed.push(to_close.trim());
        clear_stored();
        write_storage(removed);
    });
});
