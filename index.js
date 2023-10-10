const express = require('express');
const admin = require('firebase-admin');

const app = express();

// Load your Firebase admin credentials
const serviceAccount = require("/etc/secrets/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(express.json());

app.post('/sendNotification', (req, res) => {
  const registrationToken = req.body.token; // Token from the client app
  const message = {
    notification: {
      title: req.body.title || 'Default Title',
      body: req.body.body || 'Default Body',
    },
    token: registrationToken,
  };

  // Send a message to the device corresponding to the provided registration token
  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string
      console.log('Successfully sent message:', response);
      res.send('Successfully sent message');
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      res.status(500).send('Error sending message');
    });
});

app.post('/sendTopicNotification', (req, res) => {
  const topic = req.body.topic || 'all'; // Default topic is 'all'
  const message = {
    notification: {
      title: req.body.title || 'Default Title',
      body: req.body.body || 'Default Body',
    },
    topic: topic,
  };

  // Send a message to the specified topic
  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent topic message:', response);
      res.send('Successfully sent topic message');
    })
    .catch((error) => {
      console.log('Error sending topic message:', error);
      res.status(500).send('Error sending topic message');
    });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
