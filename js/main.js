"use strict";
var currentTab = 0;
var panels = [document.getElementsByClassName("panel")[0], document.getElementsByClassName("panel")[1]];
var helpBarState = [{
  selectionList: false,
  settings: true,
  expand: false,
  panel: true
}, {
  selectionList: false,
  settings: false,
  expand: true,
  panel: false
}, {
  selectionList: false,
  settings: true,
  expand: false,
  panel: true
}, {
  selectionList: false,
  settings: false,
  expand: true,
  panel: false
}]
var myData = {
  data: [
    [{
      name: '',
      url: ''
    }, {
      name: '',
      url: ''
    }, {
      name: '',
      url: ''
    }],
    [{
      name: '',
      url: ''
    }, {
      name: '',
      url: ''
    }, {
      name: '',
      url: ''
    }]
  ]
};

function setPage() {
  currentTab = 0;
  /*Set help bar*/
  getConfigData();
  getLocalData();
  setInput();
  initialTab();
  function setInput() {
    /*setReport(0,0,"Ynet", "http://ynet.com");
    setReport(0,1,"Walla", "http://walla.com");
    setReport(0,2,"Isreali Ynet", "http://ynet.co.il");

    setReport(1,0,"My Comverse1!!", "http://gil7788.github.io/comverse/");*/

    for (var i = 0; i < 2; i++) {
      var panel = document.getElementsByClassName("panel")[i];
      for (var j = 0; j < 3; j++) {
        var report = panel.getElementsByClassName("report")[j];
        var name = report.getElementsByTagName("input")[0];
        var url = report.getElementsByTagName("input")[1];
        name.setAttribute('value', myData.data[i][j].name);
        url.setAttribute('value', myData.data[i][j].url);
      }
    }

    function setReport(panel, report, name, url) {
      panels[panel].getElementsByTagName("input")[report * 2].setAttribute("value", name);
      panels[panel].getElementsByTagName("input")[report * 2 + 1].setAttribute("value", url);
    }

  }

  function getConfigData() {
    function done(res) {
      if (!UTILS.isObject(res)) {
        res = JSON.parse(res);
      }
      getNotification(res);
      getQuickActions(res);
    }
    var options = {
      method: "GET",
      done: done
    };
    var config = UTILS.ajax("data/config.json", options);

    function getNotification(res) {
      var notificationsContent = document.getElementsByClassName("notificationsContent")[0];
      notificationsContent.innerHTML = res.notification;
    }

    function getQuickActions(res) {
      for (var i = 0; i < 3; i++) {
        getQuickAction(res, i);
      }

      function getQuickAction(res, i) {
        var action = res.quickActions[i];
        var nav = document.getElementsByClassName("nav-section")[i];
        /*Get label */
        var label = nav.getElementsByTagName("p")[0];
        label.innerHTML = action.label;
        /*Get icon */
        var icon = "url('../img/icons/" + action.icon + ".png')";
        nav.style.backgroundImage = icon;
        /*Get actions label */
        var actionsLabel = document.getElementsByClassName("menu-caption")[i].getElementsByTagName("p")[0];
        actionsLabel.innerHTML = action.actionsLabel;
        /*Get actions*/
        var actionList = document.getElementsByClassName("action-list")[i];
        for (var i = 0; i < action.actions.length; i++) {
          var listElement = document.createElement("li");
          actionList.appendChild(listElement);
          var name = action.actions[i].label;
          var url = action.actions[i].url;
          var link = document.createElement("a");
          link.innerHTML = name;
          link.href = url;
          listElement.appendChild(link);
        }
      }
    }
  }

  function getLocalData() {
    var temp = localStorage.getItem('data');
    if (temp !== undefined && temp !== null) {
      myData = JSON.parse(temp);
    }
  }

  function initialTab(){
    var url = window.location.href;
    if(url.indexOf("quick-reports") > -1){
      changeTab(0);
        submit();
    }
    else if(url.indexOf("my-folders") > -1){
      changeTab(1);
    }
    else if(url.indexOf("my-team-folders") > -1){
      changeTab(2);
      submit();
    }
    else if(url.indexOf("public-folders") > -1){
      changeTab(3);
    }
    else{
      changeTab(0);
      submit();
    }
  }
}
/*Setting functions*/
function updateHelpBar() {
  if (currentTab == 0 || currentTab == 2) {
    displayElement("selectionList");
    displayElement("settings");
    displayElement("panel");
  }
  displayElement("expand");

  function displayElement(state) {
    var tab = document.getElementsByClassName("tabContent")[currentTab];
    var htmlState = tab.getElementsByClassName(state)[0];
    if (helpBarState[currentTab][state] == true) {
      show(htmlState);
    } else {
      hide(htmlState);
    }
  }
}
/*Setting functions-End*/
function changeTab(i) {
  var oldTab = currentTab;
  currentTab = i;
  if (oldTab != currentTab) {
    uncheckTab(oldTab);
    checkTab(currentTab);
    updateHelpBar();
  }

  function uncheckTab(tabToUncheck) {
    var tabs = document.getElementsByClassName("tabs")[0];
    var tab = tabs.getElementsByTagName("li")[tabToUncheck];
    var link = tab.getElementsByTagName("a")[0];
    tab.className = "darkGrey";
    link.className = "whiteText";
    var tabContent = document.getElementsByClassName("tabContent")[tabToUncheck];
    hide(tabContent);
  }

  function checkTab(i) {
    var tabs = document.getElementsByClassName("tabs")[0];
    var tab = tabs.getElementsByTagName("li")[i];
    var link = tab.getElementsByTagName("a")[0];
    tab.className = "grey";
    link.className = "blackText";
    var tabContent = document.getElementsByClassName("tabContent")[i];
    show(tabContent);
    if(currentTab == 0 || currentTab == 2){
      submit();
    }
  }
}
/*paint the settings color*/
function toggleSettingsIcon() {
  var tab = document.getElementsByClassName("tabContent")[currentTab];
  var settingsIcon = tab.getElementsByClassName("settings")[0];
  if (helpBarState[currentTab].panel == true) {
    remove(settingsIcon, "white");
    add(settingsIcon, "grey");
    helpBarState[currentTab].panel = false;
  } else {
    remove(settingsIcon, "grey");
    add(settingsIcon, "white");
    helpBarState[currentTab].panel = true;
  }
  updateHelpBar();
}

function showPageInNewTab() {
  var tab = document.getElementsByClassName("tabContent")[currentTab];
  var url = tab.getElementsByClassName("iframe")[0].src;
  var expandIcon = tab.getElementsByClassName("expand")[0];
  expandIcon.setAttribute("href", url);
}

function expand() {
  /*get url from Iframe*/
  var url = document.getElementsByClassName("tabContent")[currentTab].getElementsByClassName("iframe")[0].contentWindow.location.href;
  var link = document.getElementsByClassName("expand")[0].setAttribute('href', url);
  //window.open(url, '_blank');
}
/*Not finished*/
function submit() {
  var settingsIcon = document.getElementsByClassName("settings")[0];
  var tab = document.getElementsByClassName("tabContent")[currentTab];
  var urls = tab.getElementsByClassName("urls")[0];
  var iframe = document.getElementsByClassName("iframe")[currentTab];
  if (isValidForm()) {
    getUrlLinks();
    if (urls.innerHTML != '') {
      showPageInIframe();
      toggleSettingsIcon();
      helpBarState[currentTab].expand = true;
      helpBarState[currentTab].selectionList = true;
      helpBarState[currentTab].panel = false;
      updateHelpBar();
      show(iframe);
    } else {
      helpBarState[currentTab].selectionList = false;
      helpBarState[currentTab].expand = false;
      helpBarState[currentTab].panel = true;
      updateHelpBar();
      hide(iframe);
    }
    saveData();
  }

  function isValidForm() {
    for (var i = 0; i < 3; i++) {
      if (!isValidReport(i)) {
        return false;
      }
    }
    return true;

    function isValidReport(i) {
      var nameInput = tab.getElementsByClassName("report")[i].getElementsByTagName("input")[0];
      var urlInput = tab.getElementsByClassName("report")[i].getElementsByTagName("input")[1];
      var name = nameInput.value;
      var url = urlInput.value;
      var expresion = "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?";
      var exp = new RegExp(expresion);

      /*hide old errors*/
      var error0 = document.getElementsByClassName("error")[i * 3];
      var error1 = document.getElementsByClassName("error")[i * 3 + 1];
      var error2 = document.getElementsByClassName("error")[i * 3 + 2];
      hide(error0);
      hide(error1);
      hide(error2);
      remove(nameInput, "redBorder");
      remove(urlInput, "redBorder");

      if (name.length == 0 && url.length > 0) {
        var error = document.getElementsByClassName("error")[i * 3];
        show(error);
        add(nameInput, "redBorder");
        return false;
      } else if (name.length > 0 && url.length == 0) {
        var error = document.getElementsByClassName("error")[i * 3 + 1];
        show(error);
        add(urlInput, "redBorder");
        return false;
      } else if (!url.match(exp) && !url.length == 0) {
        var error = document.getElementsByClassName("error")[i * 3 + 2];
        show(error);
        add(urlInput, "redBorder");
        return false;
      }
      return true;
    }
  }

  function getUrlLinks() {
    urls.innerHTML = '';
    for (var i = 0; i < 3; i++) {
      getUrlLink(i);
    }

    function getUrlLink(i) {
      if (!emptyReport(i)) {
        var name = tab.getElementsByClassName("report")[i].getElementsByTagName("input")[0].value;
        var url = tab.getElementsByClassName("report")[i].getElementsByTagName("input")[1].value;
        var urls = tab.getElementsByClassName("urls")[0];
        /*Create a new option*/
        var optionTag = document.createElement("option");
        var urlName = document.createTextNode(name);
        optionTag.appendChild(urlName);
        urls.appendChild(optionTag);
        /*Create hidden element with url under its option tag*/
        var pTag = document.createElement("p");
        pTag.className = "hide";
        pTag.setAttribute("value", i);
        var urlValue = document.createTextNode(url);
        pTag.appendChild(urlValue);
        urls.appendChild(pTag);
      }

      function emptyReport(i) {
        var name = tab.getElementsByClassName("report")[i].getElementsByTagName("input")[0].value;
        var url = tab.getElementsByClassName("report")[i].getElementsByTagName("input")[1].value;
        return name.length == 0 && url.length == 0;
      }
    }
  }

  function saveData() {
    /**/
    for (var i = 0; i < 2; i++) {
      var panel = document.getElementsByClassName("panel")[i];
      for (var j = 0; j < 3; j++) {
        var report = panel.getElementsByClassName("report")[j];
        var name = report.getElementsByTagName("input")[0].value;
        var url = report.getElementsByTagName("input")[1].value;
        myData.data[i][j].name = name;
        myData.data[i][j].url = url;
      }
    }
    localStorage.setItem("data", JSON.stringify(myData));
  }
}

function showPageInIframe() {
  var tab = document.getElementsByClassName("tabContent")[currentTab];
  /*select*/
  var urls = tab.getElementsByClassName("urls")[0];
  /*url index in select*/
  var index = urls.selectedIndex;
  /*The url itself*/
  var url = urls.getElementsByTagName("p")[index].innerHTML;
  /*Iframe*/
  var iframe = tab.getElementsByClassName("iframe")[0];
  iframe.setAttribute('src', url);
  show(iframe);
}

function search(e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    var searchString = document.getElementsByClassName("search-box")[0].getElementsByTagName("input")[0].value;
    getAllUrls();
    function getAllUrls() {
      if(helpBarState[0].selectionList){
        var panel = document.getElementsByClassName("panel")[0];
        var selectionList = document.getElementsByClassName("urls")[0];
          for (var j = 0; j < selectionList.options.length; j++) {
            var report = panel.getElementsByClassName("report")[j];
            var name = report.getElementsByTagName("input")[0].value;
            var p = name.search(searchString) > -1;
            if (p) {
              selectionList.selectedIndex = j;
              changeTab(0);
              showPageInIframe();
            }
          }
      }
      if(helpBarState[2].selectionList){
        var panel = document.getElementsByClassName("panel")[1];
        var selectionList = document.getElementsByClassName("urls")[1];
          for (var j = 0; j < selectionList.options.length; j++) {
            var report = panel.getElementsByClassName("report")[j];
            var name = report.getElementsByTagName("input")[0].value;
            var p = name.search(searchString) > -1;
            if (p) {
              selectionList.selectedIndex = j;
              changeTab(2);
              showPageInIframe();
            }
          }
      }

    }
  }
}
/***********Utilities****************/
/*DOM element*/
function emptyClassList(element) {
  var classes = element.className;
  return classes.length == 0;
}
/*DOM element*/
/*string*/
function contains(element, newClass) {
  var classes = element.className;
  return classes.indexOf(newClass) > -1;
};
/*DOM element*/
/*string[]*/
function containsAllClasses(element, classes) {
  for (var i = 0; i < classes.length; i++) {
    if (!contains(element, classes[i])) {
      return false;
    }
  }
  return true;
};
/*DOM element*/
/*string[]*/
function containsOneClass(element, classes) {
  for (var i = 0; i < classes.length; i++) {
    if (contains(element, classes[i])) {
      return true;
    }
  }
  return false;
};
/*DOM element*/
function show(element) {
  remove(element, " hide");
}
/*DOM element*/
function hide(element) {
  add(element, "hide");
}

function remove(element, removeClass) {
  if (contains(element, " " + removeClass))
    element.className = element.className.replace(" " + removeClass, '');
  else
    element.className = element.className.replace(removeClass, '');
}

function add(element, addClass) {
  if (!contains(element, addClass)) {
    element.className += " " + addClass;
  }
}

function replace(element, addClass) {
  element.className = addClass;
}
/***********Utilities****************/
