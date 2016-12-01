function generateArgs(result) {
  if(result["TABZKEY1"]){
      return {currentWindow: true};
  } else {
    return {};
  }
}

function tabSelect() {
    var tab_num = this.id.substring(4);
    chrome.storage.local.get("TABZKEY1", function(result)  {
      chrome.tabs.query( generateArgs(result) , function(the_tabs) {
          order(the_tabs);
          chrome.tabs.update( the_tabs[tab_num].id, {active:true} );
      });
    });
}


function deleteMulti() {
  chrome.storage.local.get("TABZKEY1", function(result)  {
    chrome.tabs.query( generateArgs(result), function(tabs) {
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
  });
}


function removeTab() {
  var tab_num = this.id.substring(6);
  chrome.storage.local.get("TABZKEY1", function(result)  {
    chrome.tabs.query( generateArgs(result), function(tabs){
        var open_tabs = [];
        for (var i=0; i<tabs.length; i++) {
            open_tabs.push(tabs[i]);
        }
        order(open_tabs);
        var checker = open_tabs[tab_num].id;
        // close the tab
        chrome.tabs.remove(open_tabs[tab_num].id);
        closed_tabs.push(open_tabs[tab_num].id);
        // update the display
        updateTabList();
    });
  });
}

// returns the div class that the url should be placed in
function classify(tab) {

    var value = tab.url;
    if(value.search('chrome://') >= 0){
        return "Chrome";
    }
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
    else if(value.search(".net") >= 0){
        value = value.substring(0,value.search(".net"));
    }
    else if(value.search(".me") >= 0){
        value = value.substring(0,value.search(".me"));
    }
    else if(value.search(".gov") >= 0){
        value = value.substring(0,value.search(".gov"));
    }
    else if(value.search(".fr") >= 0){
        value = value.substring(0,value.search(".fr"));
    }
    else if(value.search(".tv") >= 0){
        value = value.substring(0,value.search(".tv"));
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

    var groups = [];

    chrome.storage.local.get("TABZKEY1", function(result)  {
      chrome.tabs.query( generateArgs(result) , function(tabs) {
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
  });

}

/* THIS FUNCTION MUST BE CALLED BEFORE TRYING TO CHANGE ANY TABS  OR ELSE BAD THINGS*/
function order(tabs_){
    for(var i = 0; i < tabs_.length; i++){
        for(var j = 0; j < i; j++){
            if(classify(tabs_[i]) < classify(tabs_[j])){
                var tmp = tabs_[i];
                tabs_[i] = tabs_[j];
                tabs_[j] = tmp;
            }
        }
    }
    return tabs_
}

function updateTabList() {
    /* looks for open tabs and puts tab elements in open tabs array */

    // clear the current list
    $('#tab_list').empty();

    // build the groups and sort the tabs
    chrome.storage.local.get("TABZKEY1", function(result)  {
      chrome.tabs.query( generateArgs(result) , function(tabs) {
        var open_tabs = [];
        for (var i=0; i<tabs.length; i++) {
            if(closed_tabs.indexOf(tabs[i].id) == -1){
                open_tabs.push(tabs[i]);
            }
        }
        // alphabetize the tabs
        open_tabs = order(open_tabs);
        // loop over all the tabs
        for (var i = 0; i < open_tabs.length; i++) {

            // double check to make sure the tab is valid
            if (open_tabs[i] != null) {

                // create a container div to contain the tab's div
                var container_div = document.createElement('div');

                // get the name for the tab
                var name = open_tabs[i].title;
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
                var section_name = classify(open_tabs[i]);

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
  });

    // Checks whether tab should be collapsed
    checkStates();

}

function Storage() {
    var array = [];
    var url = "key12313";
    chrome.storage.local.get("TABZKEY1", function(result)  {
      chrome.tabs.query( generateArgs(result) , function(tabs) {
        var title = prompt("Please enter the title of this tab set");
        while (!title || title == ""){
            if(title == null){
                return;
            }
            title = prompt("Please enter the title, none was given");
        }
        for (var i=0; i<tabs.length; i++) {
            array.push(tabs[i].url);
        }
        array.push(title);
        chrome.storage.local.get(url, function(result) {
            try{
                var good = false;
                var flag = false;
                var print = true;
                while(!good){
                    var count = 0;
                    for(var i = 0; i < result[url].length; i++){
                        if(result[url][i][result[url][i].length-1].trim() == array[array.length-1].trim() ){
                            var new_title = "";
                            if(flag){
                                new_title = prompt("Please enter a new title, a valid one wasn't submitted");
                                flag = false;
                            }
                            else{
                                new_title = prompt("Please enter a new title, given one is already taken");
                                console.log(new_title.length);
                            }
                            if(new_title.length == 0){
                                flag = true;
                                break;
                            }
                            if (new_title == null){
                                print = false;
                                count = result[url].length;
                                break;
                            }
                            result[url][i][result[url][i].length-1] = new_title;
                            break;
                        }
                        else{
                            count++;
                        }
                    }
                    if(count == result[url].length){
                        good = true;
                    }
                }
                if(print){
                    value = result[url];
                    value.push(array);
                    result[url] = value;
                    chrome.storage.local.set( result, function(){
                      var instance = $('#activeStorage');
                      appendButton(instance, new_title);
                    });
                    $('#TheModal').modal('show');
                }
            }
            catch(err){
                try{
                    for(var i = 0; i < result[url].length; i++){
                        if(result[url][i][result[url][i].length-1].trim() == array[array.length-1].trim() ){
                            print = false;
                        }
                    }
                }
                catch(err){}
                if(print){
                    var obj = {};
                    obj[url] = [array];
                    chrome.storage.local.set( obj, function(result) {
                      console.log(result);
                      var instance = $('#activeStorage');
                      appendButton(instance, new_title);
                    } );
                    $('#TheModal').modal('show');
                }
            }
        });
    });
  });
}

function appendButton(instance, name) {
  var spaceName = name.replace(/ |@|#|\$|\\|\'|\"|,|\.|\//g, "_");
  var button = '<li><button class="dropdown_button_group" id="' + spaceName + "___TABZUSE" + '"  >' +  name + ' </button></li>';
  instance.append(button);
}


function addToDropdown() {
    var instance = $('#activeStorage');
    var url = "key12313";
        chrome.storage.local.get(url, function(result) {
            try{
                for(var i = 0; i < result[url].length; i++){
                    appendButton(instance, result[url][i][result[url][i].length-1])
                }
            }
            catch(err){}
    });
}

function open_storage(name){
    var url = "key12313";
    var new_name = String(name);
    new_name = name.substring(0, name.length - 1);
        chrome.storage.local.get(url, function(result) {
        var strings = [];
            for(var i = 0; i < result[url].length; i++){
                if(result[url][i][result[url][i].length-1].trim() == new_name.trim()){
                    for(var j = 0; j < result[url][i].length - 1; j++){
                        strings.push(result[url][i][j]);
                    }
                }
            }
            chrome.windows.create({url: strings});
    });
}

/* -------------------------------------------------------------------- */
/*  Main run code for popup */

// global variable containing all closed Tabs
closed_tabs = []

$(document).ready(function() {
    // add event listener to the delete button to call deleteMulti function
    $('#deleteButton').click(deleteMulti);
    $('#TestButton').click(Storage);
    addToDropdown();
    $(document).on('click', '.dropdown_button_group', function() {
        var obj_id = this.id;
        var to_open = $('#'+obj_id).html();
        open_storage(to_open);
    });

    // container to hold all the tabs
    $('<div/>', {
        id: 'tab_list'
    }).appendTo('body');

    // update that display bro
    updateTabList();
    var url = "key12313";
        chrome.storage.local.get(url, function(result) {
            try{
                if($( window ).height() <= (result[url].length*26 + 50)){
                    var number = result[url].length*26 + 45;
                    var string  = number.toString();
                    $('body').css({height: string});
                }
            } catch(err){
            }
    });
});
