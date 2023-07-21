

function getdata(element)
{
    const makediv = document.createElement("div");
        makediv.innerHTML = ` <div class="card mb-3">
        <div class="card-body d-flex justify-content-between flex-row">
          <div class="d-flex flex-column">
            <h3>${element.topic_title}</h3>
            <p class="text-muted mb-2">${element.author_name}</p>
            <p class="mb-0 text-muted">
              <strong>Expected results : </strong>${element.expected_result}
            </p>
          </div>
          <div class="d-flex flex-column text-center">
            <a id="votes_up_${element._id}" class="btn btn-link">🔺</a>
            <h3 id="score_${element._id}">${element.votes.ups - element.votes.downs}</h3>
            <a id="votes_down_${element._id}" class="btn btn-link">🔻</a>
          </div>
        </div>
        <div class="card-footer d-flex flex-row justify-content-between">
          <div>
            <span class="text-info">NEW</span>
            &bullet; added by <strong>${element.author_name.toUpperCase()}</strong> on
            <strong>${new Date(element.submit_date).toLocaleDateString()}</strong>
          </div>
          <div
            class="d-flex justify-content-center flex-column 408ml-auto mr-2"
          >
            <div class="badge badge-success">
              ${element.target_level.toUpperCase()}
            </div>
          </div>
        </div>
        </div>`
        ;
        return makediv;
}

document.addEventListener("DOMContentLoaded",function()
      {
        const listofconatiers = document.getElementById("listOfRequests");
    
        fetch("http://localhost:7777/video-request").then(bold=>bold.json())
        .then((data)=>
        {
            
            data.forEach(element=>
               {
            
                
            listofconatiers.appendChild(getdata(element));
            
            const votes_up_elm = document.getElementById(`votes_up_${element._id}`);
            const score_elm = document.getElementById(`score_${element._id}`);
            const votes_down_elm = document.getElementById(`votes_down_${element._id}`) 

            votes_up_elm.addEventListener('click',(e)=>{
                fetch("http://localhost:7777/video-request/vote",{method:'PUT',
                headers:{'content-Type':'application/json'},
                body:JSON.stringify({id:element._id,vote_type:"ups"})},
                ).then(bold=>bold.json()).then(data=>score_elm.innerText = data.votes.ups-data.votes.downs)
            })

            votes_down_elm.addEventListener('click',(e)=>{
                fetch("http://localhost:7777/video-request/vote",{method:'PUT',
                headers:{'content-Type':'application/json'},
                body:JSON.stringify({id:element._id,vote_type:"downs"})},
                ).then(bold=>bold.json()).then(data=>score_elm.innerText = data.votes.ups-data.votes.downs)
            })
            
               })
        }
        );






        const  form_requset = document.getElementById("form-request");
        form_requset.addEventListener("submit",(e)=>
        {
            const form_Data= new FormData(form_requset);
            console.log(form_Data);
            e.preventDefault();
            
            
            
          fetch("http://localhost:7777/video-request",{method :"POST"
          ,
          body:form_Data 
        }).then((data)=>
        {
           listofconatiers.ap(getdata(data))
        })
        })
      })
      