const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationButton = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
button = wrapper.querySelector("button");

let api;

inputField.addEventListener("keyup", e => {
  // if the user pressed enter and the input is not empty
  if(e.key == "Enter" && inputField.value != ""){
  //  console.log("Hello");
  requestApi(inputField.value); // call the weather api for the input value
  }
});

locationButton.addEventListener("click", () =>{
  if(navigator.geolocation){ // if the browser supports geolocation api
    navigator.geolocation.getCurrentPosition(onSuccess, onError); // if the method is successful then OnSuccess function will call, and if any error occured while geting the user location then onError function will call
  }else{
    alert("This browser does not support geolocation api");
  }
});

function onSuccess(position){
  const {latitude, longitude} = position.coords; // get the lat and long of the device
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=c32e725eb1808e8066cd72f8b69f30cb`;
  fetchData();
}

function onError(error){
  // console.log(error);
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=c32e725eb1808e8066cd72f8b69f30cb`;
  fetchData();
}

function fetchData() {
  // set the .pending class to the <p> element
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  // get api response and return it with parsing into js obj
  // then function call weatherDetails function with passing api result as an argument
  // console.log(fetch(api).then(response => response.json()));
  fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
  // if there is an error
  if(info.cod == "404"){
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
  }else{ // if there is data from the API then 

    // get the required properties value from the object
    const city = info.name;
    const country = info.sys.country;
    const {description, id} = info.weather[0];
    const {feels_like, humidity, temp} = info.main;
    
    // custom icons matching the id from the api
    if(id == 800){
      wIcon.src = "icons/clear-animated.svg";
    }else if(id >= 200 && id <= 232){
      wIcon.src = "icons/storm-animated.svg";
    }else if(id >= 600 && id <= 622){
      wIcon.src = "icons/snow-animated.svg";
    }else if(id >= 701 && id <= 781){
      wIcon.src = "icons/haze-animated.svg";
    }else if(id >= 801 && id <= 804){
      wIcon.src = "icons/clouds-animated.svg";
    }else if((id >= 300 && id <= 321) || (id >= 500 && id <=531)){
      wIcon.src = "icons/rain-animated.svg";
    }

    // pass the values to the dom elements
    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp); // rounds down the number
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    // hide the message and show weather
    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
    // console.log(info);
  }
}

// after user enters city, if clicks on device location, the input will be erased
button.addEventListener("click", () => {
  inputField.value = '';
});