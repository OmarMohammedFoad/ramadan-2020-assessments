const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 7777;
const VideoRequestData = require('./data/video-requests.data');
const UserData = require('./data/user.data');
const cors = require('cors');
// app.use(express.json());
const mongoose = require('./models/mongo.config');
const multer = require('multer');
app.use(express.json());

if (!Object.keys(mongoose).length) return;

app.use(cors());
const upload = multer()
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) =>
  res.send('Welcome to semicolon academy APIs, use /video-request to get data')
);

app.post('/video-request' ,upload.none(),async (req, res, next) => {
  const response = await VideoRequestData.createRequest(req.body);
  res.send(response);
  next();
});

app.get('/video-request', async (req, res, next) => {
  const {sortby,searchBy} = req.query;
  
let data;
  if(searchBy){
    data = await VideoRequestData.searchRequests(searchBy);
  }else{
    data = await VideoRequestData.getAllVideoRequests();
  }
   


    console.log(data);
    


  
  if(sortby === "votedFirst")
  {
    data.sort((prev,next)=>
    {
      if(prev.votes.ups - prev.votes.downs > next.votes.ups-next.votes.downs)
      {
        return -1;
      }else
      {
        return 1;
      }
    }
    )
  }
  res.send(data);
  next();
});

app.get('/users', async (req, res, next) => {
  const response = await UserData.getAllUsers(req.body);
  res.send(response);
  next();
});

app.post('/users/login', async (req, res, next) => {
  const response = await UserData.createUser(req.body);
  res.redirect(`http://localhost:5500?id=${response._id}`);
  next();
});


app.put('/video-request/vote', async (req, res, next) => {
  const { id, vote_type } = req.body;
  // console.log(vote_type,"vote_type");
  
  const response = await VideoRequestData.updateVoteForRequest(id, vote_type);
  res.send(response);
  next();
});

app.put('/video-request', async (req, res, next) => {
  const { id, status, resVideo } = req.body;

  const response = await VideoRequestData.updateRequest(id, status, resVideo);
  res.send(response);
  next();
});

app.delete('/video-request', async (req, res, next) => {
  const response = await VideoRequestData.deleteRequest(req.body.id);
  res.send(response);
  next();
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);






