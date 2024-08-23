var dataFieldsToSubmit={name:"",emailAddress:"",phoneNumber:""},messageSubmissionTypes={ERROR_SUBMISSION_TYPE:"Error",SUCCESS_SUBMISSION_TYPE:"Success"},messageIconsByType={Error:{icon:'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" style="color:red;" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>',message:"Could not sign up. Please Try again",resetButtonText:"Try Again"},Success:{icon:'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/></svg>',message:"Your data has been submitted!",resetButtonText:"Make New Submission"}},FORM_VALIDATOR=function(){return[{fieldName:"name",message:"Field is required",rules:[function(e){return oneFieldIsFilledOut(e)}]},{fieldName:"emailAddress",message:"Either this field or phone number is required and the email must be a valid email ",rules:[function(e){return textIsEmail(e)},function(e){return oneOrAnotherFieldIsFilledOut(dataFieldsToSubmit.emailAddress,dataFieldsToSubmit.phoneNumber)}]},{fieldName:"phoneNumber",message:"Either email or this Field is required, and must be in xxx-xxx-xxxx format",rules:[function(e){return phoneNumberIsCorrect(e)},function(e){return oneOrAnotherFieldIsFilledOut(dataFieldsToSubmit.emailAddress,dataFieldsToSubmit.phoneNumber)}]}]};function setupForm(){var e=[...document.getElementsByClassName("text-input")],t=document.getElementById("loadingMessage"),n=document.getElementById("submissionMessage");t.style.display="none",n.style.display="none",e.forEach(function(e){document.getElementById(e.id).addEventListener("change",updateDataFieldsToSubmit)})}function updateDataFieldsToSubmit(e){dataFieldsToSubmit[e.target.id]=e.target.value}function submitForm(e){e.preventDefault();Object.values(dataFieldsToSubmit);(validateForm()?sendData:invalidateData)()}function sendData(){clearFormValidations();var e=document.getElementById("loadingMessage"),t=document.getElementById("loadingMessageText"),n=document.getElementById("submissionForm"),s=(e.style.display="flex",t.innerText="Sending Your Data",n.style.display="none","http://localhost:3002/"),i="http://localhost:3000/solution";try{if(!(0<new URLSearchParams(dataFieldsToSubmit).size))throw new Error("Could not submit");fetch(s,{method:"GET",headers:{"Target-URL":i,"App-Name":"japanese-form-host"}}).then(function(e){if(e.ok)return e.json();console.error("NOPE! ",e.statusText),cancelSubmission()}).then(function(e){e={k:e.sol_k,side:e.sid};fetch(s,{method:"POST",body:JSON.stringify(e),headers:{"Content-Type":"application/json","Target-URL":i,"App-Name":"japanese-form-host"}}).then(function(e){if(e.ok)return e.json();console.error("NOPE! ",e.statusText),cancelSubmission()}).then(function(e){fetch(e.$sec.u,{redirect:"follow",method:"POST",mode:"no-cors",body:JSON.stringify(dataFieldsToSubmit),headers:{"Content-Type":"application/json"}}).then(function(){handleFormSumission({responseType:"Success"})}).catch(function(){throw handleFormSumission({responseType:"Error"}),new Error("Could not submit")})}).catch(function(){throw new Error("Could not submit")})}).catch(function(){throw new Error("Could not submit")})}catch(e){console.log("Oops! "+e),cancelSubmission()}}function cancelSubmission(){var e=document.getElementById("submissionForm");document.getElementById("loadingMessage").style.display="none",e.style.display="flex"}function invalidateData(){[...document.getElementsByClassName("text-input")].forEach(function(e){document.getElementById(e.id).style.display="block"})}function clearFormValidations(){var e=document.getElementById("name"),t=document.getElementById("emailAddress"),n=document.getElementById("phoneNumber");e.classList.contains("not-valid")&&e.classList.remove("not-valid"),t.classList.contains("not-valid")&&t.classList.remove("not-valid"),n.classList.contains("not-valid")&&n.classList.remove("not-valid")}function clearFieldValidationOnClick(e){document.getElementById(e.target.id).classList.remove("not-valid")}function validateForm(){var e=FORM_VALIDATOR(),i=0,t=[...document.getElementsByClassName("text-input")].length;return e.forEach(function(e){for(var t=document.getElementById(e.fieldName),n=document.getElementById(e.fieldName+"Validator"),s=0;s<=e.rules.length-1;s++){if(!1===e.rules[s](dataFieldsToSubmit[e.fieldName])){t.classList.add("not-valid"),n.innerText=e.message,n.style.display="block";break}s+1===e.rules.length&&i++}}),i===t}function makeNewSubmission(){var e=document.getElementById("submissionForm"),t=document.getElementById("submissionMessage"),n=document.getElementById("name"),s=document.getElementById("emailAddress"),i=document.getElementById("phoneNumber"),o=document.getElementById("nameValidator"),a=document.getElementById("emailAddressValidator"),l=document.getElementById("phoneNumberValidator");dataFieldsToSubmit={name:"",emailAddress:"",phoneNumber:""},o.display="none",a.display="none",l.display="none",o.innerText="",a.innerText="",n.value=l.innerText="",s.value="",i.value="",t.style.display="none",e.style.display="flex"}function oneOrAnotherFieldIsFilledOut(e,t){return void 0!==e&&""!==e&&null!==e||void 0!==t&&""!==t&&null!==t}function phoneNumberIsCorrect(e){return""===e||/^([0-9][0-9][0-9])-([0-9][0-9][0-9])-([0-9][0-9][0-9][0-9])/g.test(e)}function textIsEmail(e){return""===e||/(.*)(@)(.*)/g.test(e)}function oneFieldIsFilledOut(e){return void 0!==e&&""!==e&&null!==e}function handleFormSumission(e){var t=document.getElementById("loadingMessage"),n=document.getElementById("loadingMessageText"),s=document.getElementById("submissionMessage"),i=document.getElementById("submissionMessageText"),o=document.getElementById("submissionIconImage"),a=document.getElementById("newSubmissionButton");o.innerHTML=messageIconsByType[e.responseType].icon,i.innerText=messageIconsByType[e.responseType].message,a.innerText=messageIconsByType[e.responseType].resetButtonText,t.style.display="none",n.innerText="",s.style.display="flex"}window.addEventListener("load",function(){setupForm()}),document.getElementById("submissionForm").addEventListener("submit",submitForm),document.getElementById("name").addEventListener("click",clearFieldValidationOnClick),document.getElementById("emailAddress").addEventListener("click",clearFieldValidationOnClick),document.getElementById("phoneNumber").addEventListener("click",clearFieldValidationOnClick),document.getElementById("newSubmissionButton").addEventListener("click",makeNewSubmission);