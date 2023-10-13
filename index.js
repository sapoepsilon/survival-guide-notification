const express = require('express');
const admin = require('firebase-admin');

const app = express();
const cors = require('cors');

// Load your Firebase admin credentials
const serviceAccount = require("/etc/secrets/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
app.use(cors());
app.use(express.json());

/**
 * @openapi
 * /sendNotification:
 *   post:
 *     summary: Send a notification to a specific device.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token from the client app.
 *               title:
 *                 type: string
 *                 description: Title of the notification.
 *               body:
 *                 type: string
 *                 description: Body content of the notification.
 *     responses:
 *       '200':
 *         description: Notification sent successfully.
 *       '500':
 *         description: Error sending the notification.
 */
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

/**
 * @openapi
 * /sendTopicNotification:
 *   post:
 *     summary: Send a notification to all devices subscribed to a specified topic.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *                 description: Topic to send the notification to. Default is 'all'.
 *                 example: "your_topic_here"
 *               title:
 *                 type: string
 *                 description: Title of the notification.
 *                 example: "Topic Notification Title"
 *               body:
 *                 type: string
 *                 description: Body content of the notification.
 *                 example: "Topic Notification Body Content"
 *     responses:
 *       '200':
 *         description: Notification sent successfully.
 *       '500':
 *         description: Error sending the notification.
 */
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

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'FCM Notification Server',
    version: '1.0.0',
    description: 'An API to send Firebase Cloud Messaging (FCM) notifications.',
  },
  servers: [
    {
      url: 'https://survival-guide-notification-backend.onrender.com/',
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./index.js'], // path to the API docs
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
