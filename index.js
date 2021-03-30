const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5055

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ghclx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log(uri)


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log("error", err);
  const eventCollection = client.db("volunteer").collection("events");
  // perform actions on the collection object

 

  app.get('/events', (req, res) => {
    eventCollection.find().toArray((err, items) => {
      res.send(items);
    })
  })

  app.post("/addEvent", (req, res) => {
    const newEvent = req.body;
    console.log("adding new event", newEvent);
    eventCollection.insertOne(newEvent)
      .then(result => {
        console.log('inserted count', result);
        res.send(result.insertedCount > 0);
      })

  })


app.delete('/deleteEvent/:id', (req, res) => {
  eventCollection.deleteOne({ _id: ObjectId(req.params.id) })
  .then(result => {
    res.send(result.deletedCount > 0);

  })
})

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})