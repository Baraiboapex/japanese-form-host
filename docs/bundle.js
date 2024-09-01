var dataFieldsToSubmit = {
    name:"",
    emailAddress:"",
    phoneNumber:"",
  };
  
  var messageSubmissionTypes = {
    ERROR_SUBMISSION_TYPE:"Error",
    SUCCESS_SUBMISSION_TYPE:"Success"
  }
  
  var messageIconsByType = {
    Error:{
      icon:'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" style="color:red;" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>',
      message:"Could not sign up. Please Try again",
      resetButtonText:"Try Again"
    },
    Success:{
      icon:'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/></svg>',
      message:"Your data has been submitted!",
      resetButtonText:"Make New Submission"
    }
  }
  
  var FORM_VALIDATOR = function(){
    var allFieldsFilledOut = [
      {
        fieldName:"name",
        message:"Field is required",
        rules:[
          function(field){return oneFieldIsFilledOut(field);}
        ]          
      },
      {
        fieldName:"emailAddress",
        message:"Either this field or phone number is required and the email must be a valid email ",
        rules:[
          function(field){return textIsEmail(field)},
          function(field){return oneOrAnotherFieldIsFilledOut(dataFieldsToSubmit.emailAddress, dataFieldsToSubmit.phoneNumber);}
        ]
      },
      {
        fieldName:"phoneNumber",
        message:"Either email or this Field is required, and must be in xxx-xxx-xxxx format",
        rules:[
          function(field){return phoneNumberIsCorrect(field);},
          function(field){return oneOrAnotherFieldIsFilledOut(dataFieldsToSubmit.emailAddress, dataFieldsToSubmit.phoneNumber);}
        ]
      },
    ];
    
    return allFieldsFilledOut;
  };
  
  window.addEventListener("load",function(){
    setupForm();
  });
  
  function setupForm(){
    var itemsToLoopThrough = [...document.getElementsByClassName("text-input")];
    var loadingMessage = document.getElementById("loadingMessage");
    var submissionMessage = document.getElementById("submissionMessage");
  
    loadingMessage.style.display = "none";
    submissionMessage.style.display = "none";
  
    itemsToLoopThrough.forEach(function(item){
      let currentValidator = document.getElementById(item.id).addEventListener("change",updateDataFieldsToSubmit);
    });
  }
  
  function updateDataFieldsToSubmit(e){
    dataFieldsToSubmit[e.target.id] = e.target.value;
  }
  
  function submitForm(e){
    e.preventDefault();
    var dataToSubmit = Object.values(dataFieldsToSubmit);
    var formIsValid = validateForm();
  
    if(formIsValid){
      sendData();
    }else{
      invalidateData();
    }
  }
  
  function sendData(){
    clearFormValidations();
  
    var loadingMessage = document.getElementById("loadingMessage");
    var loadingMessageText = document.getElementById("loadingMessageText");
    var form = document.getElementById("submissionForm");
  
    loadingMessage.style.display = "flex";
    loadingMessageText.innerText = "Sending Your Data";
    form.style.display = "none";
  
    var proxyUrl = "https://mb-cors-proxy.fly.dev/";
    var targetUrl = "https://sum-auth-server-aged-smoke-7979.fly.dev/solution";
      
    try{
      if(new URLSearchParams(dataFieldsToSubmit).size > 0){
  
        fetch(proxyUrl,{
          method:"GET",
          headers:{
            "Target-URL":targetUrl,
              "App-Name":"japanese-form-host"
          }
        }).then(function(res){
          if(res.ok){
            return res.json();
          }else{
            console.error("NOPE! ",res.statusText);
            cancelSubmission();
          }
        }).then(function(solution){
          let item = {
            k:solution.sol_k,
            side:solution.sid
          }
          fetch(proxyUrl,{
            method:"POST",
            body:JSON.stringify(item),
            headers: {
              "Content-Type": "application/json",
              "Target-URL":targetUrl,
              "App-Name":"japanese-form-host"
            }
          }).then(function(res){
              if(res.ok){
                return res.json();
              }else{
                console.error("NOPE! ",res.statusText);
                cancelSubmission();
              }
          }).then(function(solution2){
            fetch(solution2.$sec.u,{
              redirect: "follow",
              method: "POST",
              mode:"cors",
              body:JSON.stringify(dataFieldsToSubmit),
              headers: {
                "Content-Type": "application/json",
              }
            }).then(function() {
              //REACTIVATE THIS WHEN DONE!!!
              handleFormSumission({
                responseType:"Success"
              });
            }).catch(function(){
              handleFormSumission({
                responseType:"Error"
              });
              throw new Error("Could not submit");
            }) 
          }).catch(function(){
            throw new Error("Could not submit");
          });
        }).catch(function(){
          throw new Error("Could not submit");
        });
      }else{
        throw new Error("Could not submit");
      }
    }catch(err){
      console.log("Oops! "+err);
      cancelSubmission();
    }
  }
  
  function cancelSubmission(){
    var form = document.getElementById("submissionForm");
    var loadingMessage = document.getElementById("loadingMessage");
  
    loadingMessage.style.display = "none";
    form.style.display = "flex";
  }
  
  function invalidateData(){
     var itemsToLoopThrough = [...document.getElementsByClassName("text-input")];
     itemsToLoopThrough.forEach(function(item){
      document.getElementById(item.id).style.display="block";
    });
  }
  
  function clearFormValidations(){
    var nameField = document.getElementById("name");
    var emailAddressField = document.getElementById("emailAddress");
    var phoneNumberField = document.getElementById("phoneNumber");
  
    if(nameField.classList.contains("not-valid")) nameField.classList.remove("not-valid");
    if(emailAddressField.classList.contains("not-valid")) emailAddressField.classList.remove("not-valid");
    if(phoneNumberField.classList.contains("not-valid")) phoneNumberField.classList.remove("not-valid");
  }
  
  document.getElementById("submissionForm").addEventListener("submit", submitForm);
  document.getElementById("name").addEventListener("click", clearFieldValidationOnClick);
  document.getElementById("emailAddress").addEventListener("click", clearFieldValidationOnClick);
  document.getElementById("phoneNumber").addEventListener("click", clearFieldValidationOnClick);
  
  function clearFieldValidationOnClick(e){
    var currentField = document.getElementById(e.target.id);
    currentField.classList.remove("not-valid");
  }
  
  function validateForm(){
    var allFieldsToValidate = FORM_VALIDATOR();
    var fieldsValidated = 0;
    var allAvailableFields = [...document.getElementsByClassName("text-input")].length;
  
    allFieldsToValidate.forEach(function(item){
      var itemElement = document.getElementById(item.fieldName);
      var itemInputValidator = document.getElementById(item.fieldName+"Validator");
      
      for(var i = 0; i <= item.rules.length-1; i++){
  
        if(item.rules[i](dataFieldsToSubmit[item.fieldName]) === false){
          itemElement.classList.add("not-valid");
          itemInputValidator.innerText = item.message;
          itemInputValidator.style.display = "block";
          break;
        }
  
        if(i+1 === item.rules.length){
          fieldsValidated++;
        }
  
      }
    });
  
    var formIsValid = fieldsValidated === allAvailableFields;
  
    return formIsValid;
  }
  
  document.getElementById("newSubmissionButton").addEventListener("click",makeNewSubmission);
  
  function makeNewSubmission(){
    var form = document.getElementById("submissionForm");
    var submissionMessage = document.getElementById("submissionMessage");
    var nameField = document.getElementById("name");
    var emailAddressField = document.getElementById("emailAddress");
    var phoneNumberField = document.getElementById("phoneNumber");
    var nameFieldValidator = document.getElementById("nameValidator");
    var emailAddressFieldValidator = document.getElementById("emailAddressValidator");
    var phoneNumberFieldValidator = document.getElementById("phoneNumberValidator");
  
    dataFieldsToSubmit = {
      name:"",
      emailAddress:"",
      phoneNumber:"",
    };
  
    nameFieldValidator.display = "none";
    emailAddressFieldValidator.display = "none";
    phoneNumberFieldValidator.display = "none";
    nameFieldValidator.innerText="";
    emailAddressFieldValidator.innerText="";
    phoneNumberFieldValidator.innerText="";
    nameField.value = "";
    emailAddressField.value="";
    phoneNumberField.value="";
    submissionMessage.style.display = "none";
    form.style.display = "flex";
  }
  
  function oneOrAnotherFieldIsFilledOut(field1,field2){
      var condition = (
          (field1 !== undefined && field1 !== "" && field1 !== null)
          ||
          (field2 !== undefined && field2 !== "" && field2 !== null)
      );
      return condition;
  };
  
  function phoneNumberIsCorrect(phoneNumber){
      var regex = /^([0-9][0-9][0-9])-([0-9][0-9][0-9])-([0-9][0-9][0-9][0-9])/g;
      return phoneNumber !== "" ? regex.test(phoneNumber) : true;
  }
  
  function textIsEmail(email){ 
      var regex = /(.*)(@)(.*)/g;
      return email !== "" ? regex.test(email) : true;
  }
  
  function oneFieldIsFilledOut(field){
      var condition = (
          field !== undefined && field !== "" && field !== null
      );
      return condition;
  };
  
  function handleFormSumission(messageType){
    var loadingMessage = document.getElementById("loadingMessage");
    var loadingMessageText = document.getElementById("loadingMessageText");
    var submissionMessage = document.getElementById("submissionMessage");
    var submissionMessageText = document.getElementById("submissionMessageText");
    var submissionIconContainer = document.getElementById("submissionIconImage");
    var newSubmissionButton = document.getElementById("newSubmissionButton");
  
    submissionIconContainer.innerHTML =  messageIconsByType[messageType.responseType].icon;
    submissionMessageText.innerText = messageIconsByType[messageType.responseType].message;
    newSubmissionButton.innerText = messageIconsByType[messageType.responseType].resetButtonText;
    loadingMessage.style.display = "none";
    loadingMessageText.innerText = "";
    submissionMessage.style.display = "flex";
  }