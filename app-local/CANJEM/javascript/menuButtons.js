
  var element = document.getElementById("header");
  element.parentNode.removeChild(element);
  
// set event listener to menu buttons



function createMenuClickListener(node){
   
   return function(e){

          // ensure the event object is defined
          if (!e) e = window.event;
          
          unclickAllOthers(node);
          applyClick(node);
          console.log(node.children[0].id);

        };
}


function createMainTitleClickListener(node){
   
   return function(e){

          // ensure the event object is defined
          if (!e) e = window.event;
          
          closeCollapsibleList();
          unclickAllOthers(node);
          applyClick(node);
          console.log(node.children[0].id);

        };
}

function closeCollapsibleList(){
  
  var openLists = document.getElementsByClassName('collapsibleListOpen');
  console.log(openLists)
  if(openLists.length > 0){
    console.log('in')
    for(var i_list = 0; i_list < openLists.length; i_list ++){
      openLists[i_list].className.replace('collapsibleListOpen','collapsibleListClosed');
      var listChildren = openLists[i_list].children;
      
      if(listChildren.length > 0){
        for(var i_listC = 0; i_listC < openLists.length; i_listC ++){
          listChildren[i_listC].style.display = 'none';
        }
      }
    }
  }
  
}

function unclickAllOthers(node){
  
  var openLeafsArray = document.getElementById('list').getElementsByClassName('clickableElement leafOpen');
          
  // close all leafs
  for(var i_leaf = 0; i_leaf < openLeafsArray.length; i_leaf ++){
    openLeafsArray[i_leaf].className = openLeafsArray[i_leaf].className.replace('clickableElement leafOpen', 'clickableElement leafClosed');
  }
  
  var nonSelected = document.getElementById("textDisplay").getElementsByClassName("descrText");
  
  for(var index = 0; index < nonSelected.length; index ++){
    
    nonSelected[index].style.display = "none";
  }
          
          
  var menuOptions = document.getElementById('rowMenu').children;
  
   for(var i_opt = 0; i_opt < menuOptions.length; i_opt ++){
     menuOptions[i_opt].children[0].style.color = '#777';
   }
  
  
}


function applyClick(node){
  document.getElementById(node.children[0].id).style.color = '#0083FF';
  
  var clickIdDescr = 'dd' + node.children[0].id;
  console.log(clickIdDescr);
  document.getElementById(clickIdDescr).style.display = 'inline';
  document.getElementById('useless').innerHTML = document.getElementById(node.children[0].id).textContent;
}



window.onload = function () {
  

  var menuOptions = document.getElementById('rowMenu').children;
  
  for(var i_opt = 0; i_opt < menuOptions.length; i_opt ++){
    
    if (menuOptions[i_opt].addEventListener){
      menuOptions[i_opt].addEventListener(
          'click', createMenuClickListener(menuOptions[i_opt]), false);
    }else{
      menuOptions[i_opt].attachEvent(
          'onclick', createMenuClickListener(menuOptions[i_opt]));
    }
  }
  
  // add click listener to link in oveview to developpement
  
  var overviewLink = document.getElementById('goToDevel');
  
  if (overviewLink.addEventListener){
      overviewLink.addEventListener(
          'click', createMenuClickListener(menuOptions[2]), false);
    }else{
      overviewLink.attachEvent(
          'onclick', createMenuClickListener(menuOptions[2]));
    }
  
  // add click listener to link in user guide to developpement 
  
  var overviewLink = document.getElementById('goToDefinition1');
  
  if (overviewLink.addEventListener){
      overviewLink.addEventListener(
          'click', createMenuClickListener(menuOptions[2]), false);
    }else{
      overviewLink.attachEvent(
          'onclick', createMenuClickListener(menuOptions[2]));
    }
    
  var overviewLink = document.getElementById('goToDefinition2');
  
  if (overviewLink.addEventListener){
      overviewLink.addEventListener(
          'click', createMenuClickListener(menuOptions[2]), false);
    }else{
      overviewLink.attachEvent(
          'onclick', createMenuClickListener(menuOptions[2]));
    }
  
  /*var nameDisplay = document.getElementById('nameDisplay');
  
  if (nameDisplay.addEventListener){
      nameDisplay.addEventListener(
          'click', createMainTitleClickListener(menuOptions[0]), false);
    }else{
      nameDisplay.attachEvent(
          'onclick', createMainTitleClickListener(menuOptions[0]));
    }*/
  
  
 applyClick(menuOptions[0]);

}