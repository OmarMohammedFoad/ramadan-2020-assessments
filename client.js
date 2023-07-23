
const VideoContainerelm = document.getElementById("listOfRequests");
var getdata = function (data, flag) {
  const Onevideoelm = document.createElement("div");


  Onevideoelm.innerHTML = `
        <div class="card mb-3">
        <div class="card-body d-flex justify-content-between flex-row">
          <div class="d-flex flex-column">
            <h3>${data.topic_title}</h3>
            <p class="text-muted mb-2">${data.topic_details}</p>
            <p class="mb-0 text-muted">
              <strong>Expected results:</strong> ${data.expected_result}
            </p>
          </div>
          <div class="d-flex flex-column text-center">
            <a id="votes_ups_${data._id}" class="btn btn-link">🔺</a>
            <h3 id="score_${data._id}">${data.votes.ups - data.votes.downs}</h3>
            <a id="votes_downs_${data._id}" class="btn btn-link">🔻</a>
          </div>
        </div>
        <div class="card-footer d-flex flex-row justify-content-between">
          <div>
            <span class="text-info">${data.status.toUpperCase()}</span>
            &bullet; added by <strong>${data.author_name}</strong> on
            <strong>${new Date(data.submit_date).toLocaleDateString()}</strong>
          </div>
          <div
            class="d-flex justify-content-center flex-column 408ml-auto mr-2"
          >
            <div class="badge badge-success">
              ${data.target_level.toUpperCase()}
            </div>
          </div>
        </div>
        </div>
        `





  if (flag == true) {
    VideoContainerelm.prepend(Onevideoelm);
  } else {
    VideoContainerelm.appendChild(Onevideoelm);
  }


  const votes_ups = document.getElementById(`votes_ups_${data._id}`);
  const votes_downs = document.getElementById(`votes_downs_${data._id}`);
  const score = document.getElementById(`score_${data._id}`);


  votes_ups.addEventListener('click', (e) => {

    fetch("http://localhost:7777/video-request/vote", {
      method: 'PUT', headers: { "content-Type": "application/json" },

      body: JSON.stringify({ id: data._id, vote_type: "ups" })
    }).then(bolb => bolb.json()).then(data => {


      score.innerText = data.votes.ups - data.votes.downs;

    }
    )
  });

  votes_downs.addEventListener('click', (e) => {

    fetch("http://localhost:7777/video-request/vote", {
      method: 'PUT', headers: { "content-Type": "application/json" },

      body: JSON.stringify({ id: element._id, vote_type: "downs" })
    }).then(bolb => bolb.json()).then(data => {


      score.innerText = data.votes.ups - data.votes.downs;

    }
    )
  });

  const searchelm = document.getElementById("search");
  searchelm.addEventListener("input", e => {
    fetch("http://localhost:7777/video-request").then(blob => blob.json()).then(data => {

      VideoContainerelm.innerHTML = ''
      data.filter(d => e.target.value === d.topic_title).forEach(y => getdata(y))



    })
  })
}


var FetchData = function (sortdata = "NewFirst") {
  fetch(`http://localhost:7777/video-request?sortdata=${sortdata}`).then(bold => bold.json())
    .then(
      data => {
        data.forEach(element => {
          getdata(element);

        })
      })

}


function toggleButtons() {
  // Get references to the buttons using their IDs
  const button1 = document.getElementById("FirstVoted");
  const button2 = document.getElementById("FirstEdited");

  if (button1.disabled) {
    button1.disabled = false;
    button2.disabled = true;
    fetch(`http://localhost:7777/video-request?sortdata=${button2.value}`).then(bolb => bolb.json()).then(data => {
      VideoContainerelm.innerHTML = ''
      data.forEach(el => getdata(el))
    })
  } else {
    button1.disabled = true;
    button2.disabled = false;
    fetch(`http://localhost:7777/video-request?sortdata=${button1.value}`).then(bolb => bolb.json()).then(data => {
      VideoContainerelm.innerHTML = ''


      data.forEach(el => getdata(el))
    })
  }
}



document.addEventListener("DOMContentLoaded", function () {


  FetchData();


  document.getElementById("FirstVoted").addEventListener("click", toggleButtons);
  document.getElementById("FirstEdited").addEventListener("click", toggleButtons);






  const formDataelm = document.getElementById("Formdata");
  formDataelm.addEventListener("submit", (e) => {

    const formData = new FormData(formDataelm);
    e.preventDefault();
    fetch(" http://localhost:7777/video-request",
      {
        method: 'POST',
        body: formData
      }).then(bold => bold.json()).then(
        data => getdata(data, true)
      )
  })
})