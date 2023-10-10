const express = require('express');
const admin = require('firebase-admin');

const app = express();

// Load your Firebase admin credentials
const serviceAccount = require("./serviceAccountKey.json");

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
