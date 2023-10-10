# FCM Node.js Server

This repository contains a Node.js server designed to send Firebase Cloud Messaging (FCM) notifications.

## Prerequisites

- Docker installed on your deployment environment.
- Firebase `serviceAccountKey.json` containing your service account credentials.

## Deployment Instructions

1. **Clone the Repository**

```git clone https://github.com/ensign-college/urvival-guide-notification.git```
```cd urvival-guide-notification```

2. **Set up Firebase Service Account Key**

Place your `serviceAccountKey.json` in the root of the project directory. This file is ignored by Git for security reasons. It is available in https://console.firebase.com

3. **Build the Docker Image**

```docker build -t fcm-node-app .```

4. **Run the Docker Container**


Your server should now be running and listening on port `3000`.

5. **Send a Notification**

To send a notification, make a POST request to the `/sendNotification` endpoint with the required data (like token, title, and body).

Example using cURL:
```
curl -X POST http://localhost:3000/sendNotification
-H "Content-Type: application/json"
-d '{"token": "YOUR_FCM_TOKEN", "title": "Your Notification Title", "body": "Your Notification Body"}'
```