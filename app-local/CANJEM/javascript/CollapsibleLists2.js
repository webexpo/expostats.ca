/*

CollapsibleLists.js

An object allowing lists to dynamically expand and collapse

Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

// create the CollapsibleLists object
var CollapsibleLists =
    new function(){

      /* Makes all lists with the class 'collapsibleList' collapsible. The
       * parameter is:
       *
       * doNotRecurse - true if sub-lists should not be made collapsible
       */
      this.apply = function(doNotRecurse){

        // loop over the unordered lists
        var uls = document.getElementsByTagName('ul');
        for (var index = 0; index < uls.length; index ++){

          // check whether this list should be made collapsible
          if (uls[index].className.match(/(^| )collapsibleList( |$)/)){
            
            
            /*var children = new Array();
            console.log(uls[index])
            for(var child in uls[index].childNodes) {
              if(uls[index].childNodes[child].nodeType == 1) {
                  children.push(uls[index].childNode[child]);
              }
            }
            
            lis = uls[index].childNodes[children];
            console.log(lis.leng);*/
            
            
            // make this list collapsible
            this.applyTo(uls[index], true);

            // check whether sub-lists should also be made collapsible
            if (!doNotRecurse){

              // add the collapsibleList class to the sub-lists
              var subUls = uls[index].getElementsByTagName('ul');
              for (var subIndex = 0; subIndex < subUls.length; subIndex ++){
                subUls[subIndex].className += ' collapsibleList';
              }

            }

          }

        }
        
        // display list. The list is invisible while all its elements are being setup. 
        document.getElementById('list').style.display='block';
        
      };

      /* Makes the specified list collapsible. The parameters are:
       *
       * node         - the list element
       * doNotRecurse - true if sub-lists should not be made collapsible
       */
      this.applyTo = function(node, doNotRecurse){

        // loop over the list items within this node
        var lis = node.getElementsByTagName('li');
        for (var index = 0; index < lis.length; index ++){

          // check whether this list item should be collapsible
          if (!doNotRecurse || node == lis[index].parentNode){

            // prevent text from being selected unintentionally
            if (lis[index].addEventListener){
              lis[index].firstElementChild.addEventListener(
                  'mousedown', function (e){ e.preventDefault(); }, false);
            }else{
              lis[index].firstElementChild.attachEvent(
                  'onselectstart', function(){ event.returnValue = false; });
            }
            //console.log(lis[index].getElementsByTagName('span').length);
            // add the click listener
            if (lis[index].addEventListener){
              lis[index].firstElementChild.addEventListener(
                  'click', createClickListener(lis[index]), false);
            }else{
              lis[index].firstElementChild.attachEvent(
                  'onclick', createClickListener(lis[index]));
            }

            // close the unordered lists within this list item
            toggle(lis[index]);

          }

        }

      };

      /* Returns a function that toggles the display status of any unordered
       * list elements within the specified node. The parameter is:
       *
       * node - the node containing the unordered list elements
       */
      function createClickListener(node){
        
        
        // return the function
        return function(e){

          // ensure the event object is defined
          if (!e) e = window.event;

          // find the list item containing the target of the event
          var li = (e.target ? e.target : e.srcElement);
          while (li.nodeName != 'LI') li = li.parentNode;

          // toggle the state of the node if it was the target of the event
          if (li == node) toggle(node);

        };

      }

      /* Opens or closes the unordered list elements directly within the
       * specified node. The parameter is:
       *
       * node - the node containing the unordered list elements
       */
      function toggle(node){

        // determine whether to open or close the unordered lists
        var open = node.className.match(/(^| )collapsibleListClosed( |$)/);

        // loop over the unordered list elements with the node
        var uls = node.getElementsByTagName('ul');
        for (var index = 0; index < uls.length; index ++){

          // find the parent list item of this unordered list
          var li = uls[index];
          while (li.nodeName != 'LI') li = li.parentNode;

          // style the unordered list if it is directly within this node
          if (li == node) uls[index].style.display = (open ? 'block' : 'none');

        }
        
        var spans = node.getElementsByTagName('span');
        //console.log(spans[0].className.match('clickableElement notLeafClosed'))
        if(spans[0].className.match('clickableElement notLeafClosed')){
          //console.log("in")
          spans[0].className = spans[0].className.replace('clickableElement notLeafClosed','clickableElement notLeafOpen');
          //console.log(spans[0].className)
        }
        else if(spans[0].className.match('clickableElement notLeafOpen')){
          //console.log("in")
          spans[0].className = spans[0].className.replace('clickableElement notLeafOpen','clickableElement notLeafClosed');
          //console.log(spans[0].className)
        }
        
        if(spans[0].className.match('clickableElement leafClosed')){
          
          
          var openLeafsArray = document.getElementById('list').getElementsByClassName('clickableElement leafOpen');
          
          // close all leafs
          for(var i_leaf = 0; i_leaf < openLeafsArray.length; i_leaf ++){
            openLeafsArray[i_leaf].className = openLeafsArray[i_leaf].className.replace('clickableElement leafOpen', 'clickableElement leafClosed');
          }
          
          //console.log("in")
          spans[0].className = spans[0].className.replace('clickableElement leafClosed','clickableElement leafOpen');
          var clickId = spans[0].id;

          clickIdDescr = clickId.replace("desc","dd")

          //console.log(document.getElementById("textDisplay").getElementsByClassName("descrText"));
          
          var nonSelected = document.getElementById("textDisplay").getElementsByClassName("descrText");
          
          for(var index = 0; index < nonSelected.length; index ++){
            
            nonSelected[index].style.display = "none";
          }
          
          
          //document.getElementById("textDisplay").getElementsByClassName("descrText").style.display = 'none';
          document.getElementById(clickIdDescr).style.display = 'inline';
          
          // remove coloring from manu buttons
          var menuOptions = document.getElementById('rowMenu').children;
  
         for(var i_opt = 0; i_opt < menuOptions.length; i_opt ++){
           menuOptions[i_opt].children[0].style.color = '#777';
         }
          
          // change title text
          document.getElementById('useless').innerHTML = document.getElementById(node.children[0].id).textContent;
   
        }
        else if(spans[0].className.match('clickableElement leafOpen')){
          //console.log("in")
          spans[0].className = spans[0].className.replace('clickableElement leafOpen','clickableElement leafClosed');
          //console.log(spans[0].className)
        }
        
        // remove the current class from the node
        node.className =
            node.className.replace(
                /(^| )collapsibleList(Open|Closed)( |$)/, '');

        // if the node contains unordered lists, set its class
        if (uls.length > 0){
          node.className += ' collapsibleList' + (open ? 'Open' : 'Closed');
        }

      }

    }();
