let form = document.getElementById("form-request");
let formGroup = document.querySelectorAll(".form-group");
let card = document.getElementById("listOfRequests");
let buttons = document.querySelector(".buttons");
let search = document.getElementById("validationCustom03");

const url = "http://localhost:7777";

let newDiv = document.createElement("div");
let templateVideo = function (object = {}, newFlag = false) {
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
            <a id="votes_ups_${object._id}" class="btn btn-link">🔺</a>
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

  let cardInside = document.querySelectorAll(".votes");

  if (cardInside) {
    cardInside.forEach((div) => {
      div.querySelectorAll("a").forEach((button) => {
        button.addEventListener("click", function () {
          // console.log(this.id.startsWith('votes_up'));
          // console.log(this);

          let data = {
            id: this.id.split("_")[2],
            vote_type: this.id.startsWith("votes_up") ? "ups" : "downs",
          };

          fetch(`${url}/video-request/vote`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              let score = document.getElementById(`score_${data._id}`);

              score.innerHTML = data.votes.ups - data.votes.downs;
            })
            .catch((err) => console.log(err));
        });
      });
    });
  }

  newDiv.innerHTML += template;

  if (newFlag) {
    card.prepend(newDiv);
  } else {
    card.appendChild(newDiv);
  }
  return;
};

function fetchData(sortby = "newFirst", searchTerm = "") {
  fetch(`${url}/video-request?sortby=${sortby}&searchBy=${searchTerm}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("error while fetching");
      }

      return res.json();
    })

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

  form.onsubmit = function (event) {
    event.preventDefault();

    let dataMap = new Map();

    formGroup.forEach(function (singleGroup) {
      // console.log(singleGroup.children);
      for (const element of singleGroup.children) {
        if (element.name) {
          dataMap.set(element.name, element.value);
        }
      }
    });

    const dataObject = Object.fromEntries(dataMap);

    fetch(`${url}/video-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataObject),
    })
      .then((Response) => {
        if (!Response.ok) {
          throw new Error("Network response was not ok");
        }
        return Response.json();
      })
      .then((data) => {
        templateVideo(data, true);
        console.log("Data has been sent successfully:", data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
});

function debounce(fn, time) {
  let timeout;
  return function (args) {
    clearTimeout(timeout);

    timeout = setTimeout(() => fn.call(this, args), time);
  };
}
search.addEventListener(
  "input",
  debounce((e) => {
    fetchData(undefined, e.target.value);
  }, 300)
);
