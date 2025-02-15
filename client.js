var form = document.getElementById("form-request");
var formLogin = document.getElementById("form-login-request");
var formLoginGroup = document.querySelectorAll(".form-group-login");
var formGroup = document.querySelectorAll(".form-group");
var card = document.getElementById("listOfRequests");
var buttons = document.querySelector(".buttons");
var search = document.getElementById("validationCustom03");
var newDiv = document.createElement("div");
import apiCall from "./Api.js";
const url = "http://localhost:7777";
var api = apiCall(url);
var templateVideo = function (object = {}, newFlag = false) {
  let template = ` <div class="card mb-3">
        <div class="card-body d-flex justify-content-between flex-row">
          <div class="d-flex flex-column">
            <h3>${object.topic_title}</h3>
            <p class="text-muted mb-2">${object.topic_details}</p>
            <p class="mb-0 text-muted">
              <strong>Expected results:</strong> ${object.expected_result}
            </p>
          </div>
          <div class="votes d-flex flex-column text-center">
            <a id="votes_ups_${object._id}" class="btn btn-link ">🔺</a>
            <h3 id="score_${object._id}">${
    object.votes.ups - object.votes.downs
  }</h3>
            <a id="votes_downs_${object._id}" class="btn btn-link">🔻</a>
          </div>
        </div>
        <div class="card-footer d-flex flex-row justify-content-between">
          <div>
            <span class="text-info">${object.status.toUpperCase()}</span>
            &bullet; added by <strong>${object.author_name}</strong> on
            <strong>${new Date(
              object.submit_date
            ).toLocaleDateString()}</strong>
          </div>
          <div
            class="d-flex justify-content-center flex-column 408ml-auto mr-2"
          >
            <div class="badge badge-success">
              ${object.target_level.toUpperCase()}
            </div>
          </div>
        </div>
        </div>`;
  newDiv.innerHTML += template;

  let cardInside = document.querySelectorAll(".votes");

  if (cardInside) {
    cardInside.forEach((div) => {
      div.querySelectorAll("a").forEach((button) => {
        button.addEventListener("click", function (e) {
          //   // console.log(this.id.startsWith('votes_up'));
          //   // console.log(this)

          const userId = localStorage.getItem("userId");
          if(userId){

          } 
          let data = {
            id: this.id.split("_")[2],
            vote_type: this.id.startsWith("votes_up") ? "ups" : "downs",
          };


          if(userId){
            button.classList.add("disabled");
          } 

          

          api
            .updateVote(data)
            .then((data) => {
            
              let score = document.getElementById(`score_${data._id}`);
              score.innerHTML = data.votes.ups - data.votes.downs;

            })
            .catch((err) => console.log(err));
        });
      });
    });
  }
  if (newFlag) {
    card.prepend(newDiv);
  } else {
    card.appendChild(newDiv);
  }
  return;
};

function fetchData(sortby = "newFirst", searchTerm = "") {
  api
    .getData(sortby, searchTerm)
    .then((data) => {
      newDiv.innerHTML = ``;

      data.forEach((user) => {
        templateVideo(user);
      });
    })

    .catch((error) => {
      throw new Error("error while fetching" + error);
    });
}




document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  
  if (isLoggedIn === "true") {
    
    document.querySelector(".login-container").classList.add("d-none");
    document.querySelector(".app-content").classList.remove("d-none");
  }
  
  fetchData();



  buttons.childNodes.forEach(function (button) {
    button.addEventListener("click", function () {
      card.innerHTML = "";
      fetchData(this.value);
      this.classList.add("active");
      if (this.value === "newFirst") {
        document.getElementById("sort_by_top").classList.remove("active");
      } else {
        document.getElementById("sort_by_new").classList.remove("active");
      }
    });
  });

  formLogin.onsubmit = function (e) {
    e.preventDefault();
    let dataMap = new Map();

    formLoginGroup.forEach(function (singleGroup) {
      for (const element of singleGroup.children) {
        if (element.name) {
          dataMap.set(element.name, element.value);
        }
      }
    });

    const dataObject = Object.fromEntries(dataMap);

    if (validation.login(dataObject)) {
      api
        .postData("users/login", "POST", dataObject)
        .then((data) => {
          if (data.success) {
            
            localStorage.setItem("isLoggedIn",true);
            localStorage.setItem("userId",data.id);


            document.querySelector(".login-container").classList.add("d-none");
            document.querySelector(".app-content").classList.remove("d-none");
            
            window.location.href = `http://localhost:5500?id=${data.id}`;
          } else {
            console.error("Login failed:", data.error);
          }
        })
        .catch((error) => {
          console.log(error, "error");
        });
    }
  };

  form.onsubmit = function (event) {
    event.preventDefault();

    let dataMap = new Map();

    formGroup.forEach(function (singleGroup) {
      for (const element of singleGroup.children) {
        if (element.name) {
          dataMap.set(element.name, element.value);
        }
      }
    });

    const dataObject = Object.fromEntries(dataMap);
    if (validation.appContent(dataObject)) {
      api
        .postData("video-request", "POST", dataObject)
        .then((data) => {
          templateVideo(data, true);
          console.log("Data has been sent successfully:", data);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  };
});




function debounce(fn, time) {
  let timeout;
  return function (args) {
    clearTimeout(timeout);

    timeout = setTimeout(() => fn.call(this, args), time);
  };
}

const validation = {
  regName: /^[a-zA-Z0-9_]+$/,
  regEmail: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  login: function (form) {
    if (!form.author_name || !this.regName.test(form.author_name)) {
      document.querySelector(`[name=author_name]`).classList.add("is-invalid");
    }

    if (!form.author_email || !this.regEmail.test(form.author_email)) {
      document.querySelector(`[name=author_email]`).classList.add("is-invalid");
    }

    const is_invalid = document
      .getElementById("form-login-request")
      .querySelectorAll(".is-invalid");
    if (is_invalid.length) {
      is_invalid.forEach(function (element) {
        element.addEventListener("input", function () {
          element.classList.remove("is-invalid");
        });
      });
      return false;
    }

    return true;
  },
  appContent: function (form) {
    if (!form.topic_title || !this.regName.test(form.topic_title)) {
      document.querySelector(`[name=topic_title]`).classList.add("is-invalid");
    }
    if (!form.topic_details || form.topic_details.length > 100) {
      document
        .querySelector(`[name=topic_details]`)
        .classList.add("is-invalid");
    }
    const is_invalid = document
      .getElementById("form-request")
      .querySelectorAll(".is-invalid");
    if (is_invalid.length) {
      is_invalid.forEach(function (element) {
        element.addEventListener("input", function () {
          element.classList.remove("is-invalid");
        });
      });
      return false;
    }

    return true;
  },
};

search.addEventListener(
  "input",
  debounce((e) => {
    fetchData(undefined, e.target.value);
  }, 300)
);
