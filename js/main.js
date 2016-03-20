"use strict";
var currentTab = 0;
var settingsIconIsClicked = true;
function setPage() {
  /*Set tabs*/
  //setTabs();
  /*Set first content tab*/
  setFirstTab();
  /*Set second content tab*/
  setSecondTab();
  /*Set third content tab*/
  setThirdTab();
  /*Set fourth content tab*/
  setFourthTab();
  /*Set help bar*/
  updateHelpBar();
}

function setTabs() {
  currentTab = 0;
  var tabs = document.getElementsByClassName("tabs")[0];
  for (var i = 0; i < 4; i++) {
    var tab = tabs.getElementsByTagName("li")[i];
    var link = tab.getElementsByTagName("a")[0];
    if (emptyClassList(tab) && i == 0) {
      tab.className = "grey";
      link.className = "blackText";
    } else {
      tab.className = "darkGrey";
      link.className = "whiteText";
    }
  }
}
/*Setting functions*/
function setFirstTab(){
  var iframe = document.getElementById("quick-reports").getElementsByTagName("iframe")[0];
  hide(iframe);
}
function setSecondTab(){
  var tabContent = document.getElementById("my-folders");
  hide(tabContent);
}
function setThirdTab(){
  var tabContent = document.getElementById("my-team-folders");
  hide(tabContent);
}
function setFourthTab(){
  var tabContent = document.getElementById("public-folders");
  hide(tabContent);
}
function updateHelpBar(){
  var bar = document.getElementsByClassName("helpBar")[0];
  var settingsIcon = document.getElementsByClassName("settings")[0];
  var expendIcon = document.getElementsByClassName("expand")[0];

  if(currentTab == 0 || currentTab == 2){
    show(settingsIcon);
    if(contains(settingsIcon,"white")){
      hide(expendIcon);
    }
    else{
      show(expendIcon);
    }
    if(settingsIconIsClicked == true){
      remove(settingsIcon,"grey");
      add(settingsIcon,"white");
    }
    else{
      remove(settingsIcon,"white");
      add(settingsIcon,"grey");
    }
  }
  if(currentTab == 1 || currentTab == 3){
    hide(settingsIcon);
    show(expendIcon);
  }
}

/*Setting functions-End*/



function changeTab(i) {
  var oldTab = currentTab;
  currentTab = i;
  if(oldTab != currentTab){
    uncheckTab(oldTab);
    checkTab(currentTab);
  }
  updateHelpBar();
  function uncheckTab(i) {
    var tabs = document.getElementsByClassName("tabs")[0];
    var tab = tabs.getElementsByTagName("li")[i];
    var link = tab.getElementsByTagName("a")[0];
    tab.className = "darkGrey";
    link.className = "whiteText";
    var tabContent = document.getElementsByClassName("tabContent")[i];
    hide(tabContent);
  }
  function checkTab(i){
    var tabs = document.getElementsByClassName("tabs")[0];
    var tab = tabs.getElementsByTagName("li")[i];
    var link = tab.getElementsByTagName("a")[0];
    if (contains(tab, "darkGrey")) {
      tab.className = "grey";
      link.className = "blackText";
    }
    var tabContent = document.getElementsByClassName("tabContent")[i];
    show(tabContent);
  }
}
function toggleSettingsIcon(){
  if(settingsIconIsClicked == true)
    settingsIconIsClicked = false;
  else
    settingsIconIsClicked = true;
  updateHelpBar();
}
function expand(){
  /*get url from Iframe*/
  var url =  document.getElementsByClassName("tabContent")[currentTab].getElementsByClassName("iframe")[0].contentWindow.location.href;
  var link = document.getElementsByClassName("expand")[0].setAttribute('href', url);
  //window.open(url, '_blank');
}
function submit(){
  if(isValidForm()){
    getUrlLink(1);
  }
  else{

  }
  function isValidForm(){
      for(var i=0;i<3;i++){
        if(!isValidReport(i)){
          return false;
        }
      }
      return true;
  }
  function isValidReport(i){
    var name = document.getElementsByClassName("report")[i].getElementsByTagName("input")[0].value;
    var url = document.getElementsByClassName("report")[i].getElementsByTagName("input")[1].value;

    if(name.length > 0 && url.length == 0 || name.length == 0 && url.length > 0){
      return false;
    }
    var expresion = "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?";
    var exp = new RegExp(expresion);
    if(!url.match(exp) && ! url.length == 0){
      return false;
    }
    return true;
  }
  function getUrlLink(i){
    var name = document.getElementsByClassName("report")[i].getElementsByTagName("input")[0].value;
    var url = document.getElementsByClassName("report")[i].getElementsByTagName("input")[1].value;
    var selectionList = document.getElementsByClassName("selectionList")[0];

    var fragment = document.createElement("option");
    fragment.innerHTML = name;
    // You can use native DOM methods to insert the fragment:
    fragment.insertAfter(fragment, selectionList.lastChild);
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
function show(element){
  remove(element," hide");
}
/*DOM element*/
function hide(element){
  add(element,"hide");
}

function remove(element,removeClass){
  if(contains(element," "+removeClass))
    element.className = element.className.replace(" "+removeClass , '' );
  else
    element.className = element.className.replace(removeClass , '' );
}
function add(element,addClass){
  if(!contains(element,addClass)){
      element.className += " "+addClass;
  }
}
function replace(element,addClass){
  element.className = addClass;
}
/***********Utilities****************/
