var localDatabase = window.localStorage;

var apiAccess = "http://173.249.49.169:88/api/test/consulta/";
var userID;
var userPlace;
var userOrganization;
window.onload = function(){
    this.showUser();
}

function formVerification() {
userID =document.getElementById("clientID");
userPlace =document.getElementById("clientLocation");
userOrganization = document.getElementById("clientOrganization");
var formStatus = true;
var errorMessage ="";

    var userFormData =[userID,userPlace,userOrganization];
    for (let index = 0; index < userFormData.length; index++) {
        const element = userFormData[index];
        if(index == 0){
            if (element.value.length < 11){
                element.setAttribute("class","form-control is-invalid");
                
                formStatus = false;
            }
            else{
                element.setAttribute("class","form-control is-valid");
                
                
            }


        }else{
            if(element.value.length < 3){
                element.setAttribute("class","form-control is-invalid");
               
                formStatus = false;
            }
            else{
                element.setAttribute("class","form-control is-valid");
                
            }


        }
        if(formStatus==true){
            //createUser(userFormData);
            userValidation(userFormData);
        }
    }
    
}
function userValidation(data){
   var listOfUsers = JSON.parse(localDatabase.getItem('listOfUsers'));
   if(listOfUsers == null){
       createUser(data);
   } else{
    var searchResult = listOfUsers.map((objectData) => {return objectData.clientID}).indexOf(data[0].value);
    console.log(listOfUsers);
    console.log(searchResult);
    if(searchResult >= 0){
        alert('El candidato' + listOfUsers[searchResult].clientName + ', portador de la cedula de identidad: ' + listOfUsers[searchResult].clientID + ' ya se encuentra registrado en nuestro sistema ');
    } else{
        createUser(data);
    }
   }
  
}




async function createUser(data){
    console.log( data[0].value);
    const apiRequest = await fetch(apiAccess + data[0].value);
    const finalData = await apiRequest.json();
    const dateInfo = new Date();
    const regDate = (dateInfo.getDate() + '/' + (dateInfo.getMonth() + 1) + '/' + dateInfo.getFullYear() );
    if(finalData.Ok == true){
        var politicData = {
            clientID: data[0].value,
            clientName: finalData.Nombres +' ' + finalData.Apellido1,
            clientOrganization: data[2].value,
            clientLocation: data[1].value,
            clientPhoto: finalData.Foto ,
            clientRegisterDate: regDate,
        }
        var listOfIDs = JSON.parse(localDatabase.getItem("listOfIDs"));
        var listOfUsers = [ ];
        if(listOfIDs == null){
            localDatabase.setItem("listOfIDs", 0);
            listOfUsers.push(politicData);
            localDatabase.setItem("listOfUsers", JSON.stringify(listOfUsers));
            location.reload();
            alert('Candidato guardado exitosamente');
        } else{
            listOfUsers = JSON.parse(localDatabase.getItem('listOfUsers'));
            listOfUsers.push(politicData);

            localDatabase.setItem("listOfUsers", JSON.stringify(listOfUsers));
            listOfIDs = JSON.parse(localDatabase.getItem("listOfIDs"));
            localDatabase.setItem("listOfIDs", listOfIDs + 1);
            console.log (listOfUsers);
            location.reload();
            alert('Candidato guardado exitosamente');
        }
        


    }
    
}

function showUser(){
    var listOfUsers = "";
    listOfUsers = JSON.parse(localDatabase.getItem("listOfUsers"));
    var listOfCols = document.getElementById("listOfCols");
    for (let index = 0; index < listOfUsers.length; index++) {
        const element = listOfUsers[index];
        console.log(element);

        var appColumn = document.createElement("div");
        appColumn.setAttribute("class","col-10 col-sm-9 col-md-6 col-lg-5 col-xl-4");
        var appCard = document.createElement("div");
        appCard.setAttribute("class","card mb-4 shadow-sm");
        var appImage = document.createElement("img");
        appImage.setAttribute("class", "cardImage");
        appImage.setAttribute("src", element.clientPhoto);

        var appCardBody = document.createElement("div");
        appCardBody.setAttribute("class","card-body");
        
        var appCardTitle = document.createElement("h6");
        appCardTitle.setAttribute("class", "card-title");
        appCardTitle.innerText = element.clientName;

        var pTang1 = document.createElement("p");
        pTang1.setAttribute("class","p-0 m-0");
        pTang1.innerText = 'Cedula: '+ element.clientID;

        var pTang2 = document.createElement("p");
        pTang2.setAttribute("class","p-0 m-0");
        pTang2.innerText = 'Localidad: '+ element.clientLocation;

        var pTang3 = document.createElement("p");
        pTang3.setAttribute("class","p-0 m-0");
        pTang3.innerText = 'Partido: '+ element.clientOrganization;

        var buttonContainer = document.createElement("div");
        buttonContainer.setAttribute("class","d-flex justify-content-between align-items-center mt-3");

        var buttonGroup = document.createElement("div");
        buttonGroup.setAttribute("class", "btn-group");

        var cardButton1 = document.createElement("button");
        cardButton1.innerText = "Editar";
        cardButton1.setAttribute("class", "btn btn-sm btn-outline-secondary");
        cardButton1.setAttribute("onclick","editUser("+ index +")");

        var cardButton2 = document.createElement("button");
        cardButton2.innerText = "Eliminar";
        cardButton2.setAttribute("class", "btn btn-sm btn-outline-secondary");
        cardButton2.setAttribute("onclick","deleteUser("+ index +")");


        var registerDate = document.createElement("small");
        registerDate.setAttribute("class","text-muted");
        registerDate.innerText =element.clientRegisterDate;


         appCard.appendChild(appImage);
         appCard.appendChild(appCardBody);
         appCardBody.appendChild(appCardTitle);
         appCardBody.appendChild(pTang1);
         appCardBody.appendChild(pTang2);
         appCardBody.appendChild(pTang3);
         appCardBody.appendChild(buttonContainer);
         buttonContainer.appendChild(buttonGroup);
         buttonGroup.appendChild(cardButton1);
         buttonGroup.appendChild(cardButton2);
         buttonContainer.appendChild(registerDate);
         appColumn.appendChild(appCard);
         listOfCols.appendChild(appColumn);
       

    }


}
function editUser(data) {
   
    var listOfUsers = JSON.parse(localDatabase.getItem('listOfUsers'));
    
   var editionButton = document.getElementById("editionButton");
   editionButton.setAttribute("class","btn btn-block btn-lg bg-dark text-white  mb-3 d-initial");

   userID = document.getElementById("clientID");
   userPlace = document.getElementById("clientLocation");
   userOrganization = document.getElementById("clientOrganization");
   userPlace.setAttribute("class", "form-control border-primary");
   userOrganization.setAttribute("class", "form-control border-primary");
   userID.setAttribute("class", "form-control disabled");

  
      editionButton.addEventListener("click",() =>{
        var formStatus = true;


        var userFormData =[userPlace,userOrganization];
        for (let index = 0; index < userFormData.length; index++) {
            const element = userFormData[index];
          
               
                if(element.value.length < 3){
                    element.setAttribute("class","form-control is-invalid");
                   
                    formStatus = false;
                }
                else{
                    element.setAttribute("class","form-control is-valid");
                    
                }
     
     
            }
            if(formStatus==true){
                
                listOfUsers[data].clientLocation = userPlace.value;
                listOfUsers[data].clientOrganization = userOrganization.value;
                localDatabase.setItem("listOfUsers", JSON.stringify(listOfUsers));
                alert('Edicion satisfactoria Actualize la pagina para ver los resultados.');
                showUser();
            }


      });


  }



function deleteUser(data){
    var listOfUsers = JSON.parse(localDatabase.getItem('listOfUsers'));
    var listOfIDs = JSON.parse(localDatabase.getItem('listOfIDs'));
    listOfUsers.splice(data, 1);
    localDatabase.setItem("listOfUsers", JSON.stringify(listOfUsers));
    localDatabase.setItem("listOfIDs", listOfIDs - 1);
    alert('Registro Eliminado Actualize la pagina para ver los resultados.');
    showUser();
    
 


}
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}