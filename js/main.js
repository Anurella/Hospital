

'use strict';

// confirm password for form 

var passW = document.getElementById("passWord");
var conpassW = document.getElementById("conpassword");
var pwdalert = document.getElementById("pwdalert");

function validatePassword()
{
     if (passW.value == conpassW.value ) {

     			
     	       pwdalert.style.display="none";
     	       
     }

     else {

         
     		pwdalert.style.display="block";
     		
     }
}


