 
  "use strict";

//
var isLoggedIn = false;
var isLoggedUser, stopSmsDate;

//hospital page 

$('#addUser').on('submit', function(event){
    event.preventDefault();
       // get values of the form
    var xhr; 
     var hospital = document.getElementById("hospital").options[document.getElementById("hospital").selectedIndex].value; 
     var userType = document.getElementById("userType").options[document.getElementById("userType").selectedIndex].value;
     var username = document.getElementById("userName").value;
     var password = document.getElementById("passWord").value;
     var y = { "username": username, "password": password, "userType":userType, "hospitalID":hospital}; 
     var data = JSON.stringify(y);

//IE or less
      if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xhr = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
    xhr.withCredentials = false; 

    xhr.addEventListener("readystatechange", function(){
        if (this.readyState === 4)
        {
           var a = JSON.parse(this.responseText);
            if( a.status === true){

                console.log(a.Message);
                 showAlert2(a.Message);
            }

            else {
                  showAlert("User not created");
            }

        }
         
    });

    xhr.open("POST", "http://hospitals.reminderz.ng/demo_api/functions?addHospitalUser");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(data);

});

//login form 
   $('#loginForm').on('submit', function(event){
   			//prevent default 

   		event.preventDefault();
    
      var username = document.getElementById("userName").value;
      var password = document.getElementById("passWord").value;
      var y = { "username": username, "password": password};
      var data = JSON.stringify(y);
      var xhr; 

       if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xhr = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

   		//cross site access control 
   		xhr.withCredentials= false;
   		xhr.addEventListener("readystatechange", function() {

   			if(this.readyState === 4) 
   			{
   				 var a = JSON.parse(this.responseText);
   					//check status query 
   				if(a.status == true)
   				{
             //check account type 
             if( a.data.accountType === "A")
             {
                  //redirect to admin page type 
                  showAlert2("Page is redirecting");
                  window.location.assign('../admin/dashboard.html');
                  Cookies.set('userdetails', {"userid" : a.data.userID, "username":a.data.username, "actType":a.data.accountType});
                  //session storage 
                  setSession();
                  isLoggedUser = a.data.username;
                  if (typeof(Storage) !== "undefined"){
                    sessionStorage.setItem("isLoggedUser", isLoggedUser);
                  }

                  console.log(Cookies.get())
             }

             else {
                   //normal user 
                   showAlert2("Page is redirecting");
                   window.location.assign('../hospital/dashboard.html');
                   //store hospitalid 
                   Cookies.set('userdetails', {"userid":a.data.userID, "username":a.data.username, "actType":a.data.accountType, "hospitalID": a.data.hospitalID, "hospitalName": a.data.hospitalName});
                   //this will be a session cookie as no expiry date is done 
                   setSession();
                   isLoggedUser = a.data.username;
                  if (typeof(Storage) !== "undefined"){
                    sessionStorage.setItem("isLoggedUser", isLoggedUser);
                  }

             }
   				}

   				else{

              showAlert(a.Error_Message); 
   				}	
   			}

        else {
            console.log(this.readystate);
        }

   		});

   		//make the ajax request 
   		xhr.open("POST", "http://hospitals.reminderz.ng/demo_api/functions?login");
   		xhr.setRequestHeader("content-type", "application/json"); 
   		xhr.send(data);

   });


function getAddUserForm() {

    var xhr, i; 
       if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xhr = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

      //cross site access control 
      xhr.withCredentials= false;
      xhr.addEventListener("readystatechange", function() {

        if(this.readyState === 4) 
        {
          
           var a = JSON.parse(this.responseText);
            // check that hospital array not empty  
             if( a.hospitals.length > 0 )
             {

                  //redirect to admin page type 
                   console.log(Cookies.get())
                   for(i in a.hospitals){
                    // option(text, value)

                      document.getElementById("hospital").append(new Option( a.hospitals[i].hospitalName , a.hospitals[i].hospitalID ));
                   }

             }

             else{
                     showAlert("Add Hospitals");
             }
        }

        else {
            
        }

      });
     //make the ajax request 
      xhr.open("GET", "http://hospitals.reminderz.ng/demo_api/functions?gethospitals");
      xhr.send();
};



// function dataTab(){
//   $("#hospTable").paging();
// }


// change password
$("#chgePwd").on('submit', function(event){

    event.preventDefault();

    //get userid from cookie 
    var userId = Cookies.getJSON('userdetails').userid;
    var password = document.getElementById("passWord").value;
    var z = {"userid" : userId, "password": password};
    var data = JSON.stringify(z);
    var xhr; 
    //connect to server 
    if(window.XMLHttpRequest) {

       xhr = new XMLHttpRequest();

    } else {
            // code for IE6, IE5
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

     xhr.withCredentials = false; 
     xhr.addEventListener("readystatechange", function() {

        if(this.readyState === 4)
        { 
            var a = JSON.parse(this.responseText);
            if(a.status === true)
            {
              showAlert2(a.Message);
            }

            else {
               showAlert("Password Change Failed"); 
            }  
        }
     });
    //send info 
    xhr.open("POST", "http://hospitals.reminderz.ng/demo_api/functions?changepassword");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(data);
});


$("#addHospbtn").on('click', function(event) {
    event.preventDefault();
    console.log("Hello Dear");

       // send all requests to server 
     var hospitalName = document.getElementById("hospName").value;
     var location = document.getElementById("hospLocation").value;
     var xhr; 
     if(hospitalName.value && location.value ){
        var y = { "hospitalName":hospitalName, "location":location };
        var data = JSON.stringify(data);
     //check that window has 
     if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
        
     }
      else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
     }

    xhr.withCredentials = false; 
    xhr.addEventListener("readystatechange", function(){
          if(this.readyState === 4){
          
             var a = JSON.parse(this.responseText);
             var b = a.status;
             console.log(b);
             if(b === true)
             {
                  
                  $("#addhospModal").modal('hide');
                  showAlert2(a.Message);
             }

             else { 

               
             }
          }
    });

    xhr.open("POST", "http://hospitals.reminderz.ng/demo_api/functions?addHospital");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(data);
     }
     else {
         showAlert("Fields can not be empty");
     }
     
     

});


// Reset Paasword 
 function resetPwd(userID){

  console.log(userid);
   var userid = userID;
   var xhr;

  var data = JSON.stringify({"UserID": userID});
       //check that window has 
     if(window.XMLHttpRequest){
         xhr = new XMLHttpRequest();
        
     }
      else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
     }

    xhr.withCredentials = false; 
    xhr.addEventListener("readystatechange", function(){
          if(this.readyState === 4){
          
             var a = JSON.parse(this.responseText);
             var b = a.status;
             console.log(b);
             if(b === true)
             {
                  
                  showAlert2("Password Reset Successful");
             }

             else { 

                 showAlert("Password Reset Failed");
             }
          }
    });

    xhr.open("POST", "http://hospitals.reminderz.ng/demo_api/functions?resetPwd");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(data);
     
 };

//store date for stopSms 
$("#datepicker").on('change',function(){

       stopSmsDate = $(this).val();
       //call a function
    });

// stopSms 
function sendDate(){

   var stopDate = { "stopDate": stopSmsDate};
        var data = JSON.stringify(stopDate);
        var xhr;

    //IE or less
      if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xhr = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
    xhr.withCredentials = false; 
    xhr.addEventListener("readystatechange", function(){
        if (this.readyState === 4)
        {
           var a = JSON.parse(this.responseText);
            if( a.status === true){

                 showAlert2(a.Message);
            }

            else {
                  showAlert("Stop SMS not successful");
                  console.log("Hian");
            }

        }
    });

    xhr.open("POST", "http://hospitals.reminderz.ng/demo_api/functions?stopSMS");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(data);
};

// check that user is logged in
// navigation links to check that user is logged in else redirect to login page 
$("#unifyMenu .nav-href").on('click', function(event) {
        //prevent default 
        event.preventDefault();
        
        //get the href
        var href = $(this).attr("href");
        console.log("testing " + href ); 
        //get value of logged in cookie
        
    //check that user is logged in 
    if(isLoggedIn = sessionStorage.getItem('isLoggedIn')) {
      //load the 
        window.location.href = href;
    }

    else {
      //login page 
      console.log("Please Help");
      window.location.assign('../login.html');
    }

});


//set user name when body loads 
function setActName()
{
   
  
    if(document.getElementsByName("actName")){
        var z = document.getElementsByName("actName").length
       var x
       for (x=0; x<z; x++)
       {
          document.getElementsByName("actName")[x].innerHTML = sessionStorage.getItem("isLoggedUser");
       }

    } 
   else { console.log(" Hello What is Wrong "); isLoggedIn = false; }

};

function setSession() {

  // Check browser support
if (typeof(Storage) !== "undefined"){
  sessionStorage.setItem("isLoggedIn", "true");
  isLoggedIn = true;
}

else { console.log(" Hello What is Wrong "); isLoggedIn = false; }

};



// 
function viewPatient(){

      var t = document.getElementsByClassName("pat__det");
      var dets = Cookies.getJSON('patdetails');
      console.log(dets.patientID);

      //populate data 
      t[0].innerHTML = dets.patient;
      t[1].innerHTML = dets.phone_number;
      t[2].innerHTML = dets.file_no;
      t[3].innerHTML = (dets.date_registered);

      //

};


// edit User details 
$("#updatePatient").on('submit', function(event) {

   event.preventDefault();

   var Id = Cookies.getJSON('patdetails').patientID;


   var patName = document.getElementById("patName");
   var fileNo = document.getElementById("fileNo");
   var phnNum = document.getElementById("phnNum");

   var z = { "patientID": Id, "patientName": patName, "file_no": fileNo, "patientPhone": phnNum };

   var data = JSON.stringify(z);


    //make connection and send value 
     var xhr;
     //check if XMLHttp request exists 
     //IE or less
      if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xhr = new XMLHttpRequest();
        } 
        else {
            // code for IE6, IE5
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

    xhr.withCredentials = false; 

    xhr.addEventListener("readystatechange", function() {
        if (this.readyState === 4)
        {
            var a = JSON.parse(this.responseText);
            if( a.status === true)
            {
                 showAlert2(a.Message);
            }

            else {
                  showAlert("Update not successful");
            }

        }

    });

    xhr.open("POST", "http://hospitals.reminderz.ng/demo_api/functions?updatePatient");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(data);

   

});


// schedule appointment 

$("#scheduleForm").on('submit', function(event) {

      event.preventDefault();

     //get form data
     var phNum = document.getElementById("phNum").value ;
     var appDate = document.getElementById("appDate").value; 
     var apptime = document.getElementById("apptime").value; 
     var sms_lang = document.querySelector('input[name ="sms_lang"]:checked').value; 
     var docName = document.getElementById("docName").value;
     var clType = document.getElementById("clType").value;
     var hospName = Cookies.get('userdetails').hospitalName;

     //stringify 
     var z = { "phone":phNum, "s_time":apptime, "s_date":appDate, "clinic":clType, "doctor":docName, "sms_lang": sms_lang, "hospitalName": hospName};
     var data = JSON.stringify(z);

     console.log(data);
     //make connection and send value 
     var xhr;
     //check if XMLHttp request exists 
     //IE or less
      if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xhr = new XMLHttpRequest();
        } 
        else {
            // code for IE6, IE5
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

    xhr.withCredentials = false; 
    xhr.addEventListener("readystatechange", function(){
        if (this.readyState === 4)
        {
            var a = JSON.parse(this.responseText);
            if( a.status === true)
            {
                 showAlert2("Schedule Set Successful");
            }

            else {
                  showAlert("Schedule Appointment not successful");
            }

        }
    });

    xhr.open("POST", "http://hospitals.reminderz.ng/demo_api/functions?sendreminder");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(data);



});

//Logout 
$("#logOut").on('click', function(){
   //remove loggedUser item
   if (typeof(Storage) !== "undefined"){

      if(Cookies.getJSON('userdetails').actType === "A")
      {
         sessionStorage.removeItem("isLoggedIn");
         isLoggedIn = false;
          //redirect to login 
        window.location.href = "../login.html";
      }

      else {

         Cookies.remove('patpatdetails');
         isLoggedIn = false;
         sessionStorage.removeItem("isLoggedIn");
        window.location.href = "../login.html";
      }

       
      
       
   }

});


function showAlert(msg){
  
        var y = document.getElementById("alertMsg");
       document.getElementsByName("alertMsg")[0].innerHTML = msg;
       if(y.classList.contains("showAlert"))
       {
           y.classList.remove("showAlert");
           //cause a reflow
           y.offsetWidth;
           //call animation again 
           y.classList.add("showAlert");
       }
       else {
            y.classList.add("showAlert");
       }
           
  };

  function showAlert2(msg){
  
        var y = document.getElementById("alertMsg2");
       document.getElementsByName("alertMsg")[1].innerHTML = msg;
       if(y.classList.contains("showAlert"))
       {
           y.classList.remove("showAlert");
           //cause a reflow
           y.offsetWidth;
           //call animation again 
           y.classList.add("showAlert");
       }
       else {
            y.classList.add("showAlert");
       }
           
  };


// get doctors 

    
function getDoctors() {

    var xhr, i; 

    var data = JSON.stringify({ "hospitalID" : Cookies.getJSON('userdetails').hospitalID})
       if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xhr = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

      //cross site access control 
      xhr.withCredentials= false;
      xhr.addEventListener("readystatechange", function() {

        if(this.readyState === 4) 
        {
           var a = JSON.parse(this.responseText);
            // check that hospital array not empty  
             if( a.length > 0 )
             {
                  
                   for(i in a){
                    // option(text, value)
                      document.getElementById("hospDocs").append(new Option(a[i]));
                   }

             }
        }

        else {
            
        }

      });
     //make the ajax request 
      xhr.open("POST", "http://hospitals.reminderz.ng/demo_api/functions?getDoctor");
      xhr.setRequestHeader("content-type", "application/json");
      xhr.send(data);
};

function getClinicType() {

    var xhr, i; 

    var data = JSON.stringify({ "hospitalID" : Cookies.getJSON('userdetails').hospitalID})
       if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xhr = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

      //cross site access control 
      xhr.withCredentials= false;
      xhr.addEventListener("readystatechange", function() {

        if(this.readyState === 4) 
        {
           var a = JSON.parse(this.responseText);
            // check that hospital array not empty  
             if( a.length > 0 )
             {
                  
                   console.log(Cookies.get())
                   for(i in a){
                    // option(text, value)
                      document.getElementById("hospClinic").append(new Option(a[i]));
                   }

             }
        }

        else {
            
        }

      });

     //make the ajax request 
      xhr.open("POST", "http://hospitals.reminderz.ng/demo_api/functions?getClinic");
      xhr.setRequestHeader("content-type", "application/json");
      xhr.send(data);

};



  // HealthTips 
  $("#toWhom").on('change', function(event) {

        var g = document.getElementById("toWhom").options[document.getElementById("toWhom").selectedIndex].value; 

        var t = document.getElementsByClassName("tipOption"); 
        var sp = document.getElementsByClassName("healthspan1")
        var x;

        if (g === "ALL") {

             sp[0].style.display = "none"; 
             t[0].style.display ="none";
             t[1].style.display ="none";
              t[2].style.display ="none";
        }

        else if (g === "DOCTOR")
        {
           
            //clear any showing
               t[0].style.display ="none";
               t[2].style.display ="none";
              t[1].style.display = "flex";
            
        }

        else if ( g === "APPOINTMENT")
        {

           t[1].style.display= "none";
           t[2].style.display= "none"
           t[0].style.display = "flex";
            sp[0].style.display = "block"; 
        }

        else if( g === "CLINIC")
        {
            
            t[2].style.display = "flex";
            

        }
  })

// send health tips 

$("#healthtips").on('submit', function(event){

      event.preventDefault();

      var xhr, z, data; 
      var Id = Cookies.getJSON('userdetails').hospitalID;
      var tip = document.getElementById("hospTip").value;
      var appDate = document.getElementById("appDate").value;
      var clinic = document.getElementById("hospClinic").options[document.getElementById("hospClinic").selectedIndex].text;
      var doc = document.getElementById("hospDocs").options[document.getElementById("hospDocs").selectedIndex].text;

      var Options = document.getElementById("toWhom").options[document.getElementById("toWhom").selectedIndex].value;

      if(Options === "ALL")
      {

          z = { "hospitalID":Id, "tips":tip , "sendToAll":"All" , "sendToClinicType":null, "sendToDoc":null ,"sendToAppDate":null};

      }

      else if (Options === "DOCTOR")
      {
           z = { "hospitalID":Id, "tips":tip , "sendToAll":null, "sendToClinicType": null, "sendToDoc":doc ,"sendToAppDate":null};
      }

      else if ( Options === "CLINIC") {

           z = { "hospitalID": Id, "tips": tip , "sendToAll":null, "sendToClinicType":clinic, "sendToDoc":null ,"sendToAppDate":null};
      }

      else if ( Options === "APPOINTMENT")
      {
          z = { "hospitalID": Id, "tips": tip , "sendToAll":null, "sendToClinicType":null, "sendToDoc":null ,"sendToAppDate":appDate};
      }

      
      data = JSON.stringify(z);

      if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xhr = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

      //cross site access control 
      xhr.withCredentials = false;
      xhr.addEventListener("readystatechange", function() {

        if(this.readyState === 4) 
        {
           var a = JSON.parse(this.responseText);
            // check that hospital array not empty  
             if( a.status === true )
             {
                  
                   showAlert2(a.Message);

             }

             else{
                    console.log("not working");
                     showAlert("Health Tip not Sent");
             }
        }

        else {
            
        }

      });

     //make the ajax request 
      xhr.open("POST", "http://hospitals.reminderz.ng/demo_api/functions?sendTips");
      xhr.setRequestHeader("content-type", "application/json");
      xhr.send(data);

  });

//check that Loggedin is true
function checkLogin()
{
    if(isLoggedIn = false) {

      window.location.href == "../login.html";
    }
}


// main function to set Act name 
$(function(){

    setActName();
    checkLogin();    
});
