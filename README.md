# Trainify - Training Point Management

Welcome to the Training Point Management Mobile App repository! This app is designed to streamline and facilitate the process of managing and tracking student conduct points in an educational institution. The system provides different levels of access and functionalities for student affairs specialists, student assistants, and students. It offers features such as account management, activity registration, point tracking, and comprehensive reporting.

## Installation

1. Clone the project

```shell
git clone https://github.com/HiepThanhTran/Trainify-App.git
```

2. Install dependencies

   -  Ensure npm is installed on your machine, and then run:

```shell
npm install
```

3. Set Up Firebase

   -  Create a Firebase project in your Firebase account.
   -  Copy the Firebase configuration and paste it into the **src/Configs/Firebase.js**.

## Environment Variables

   -  Create a .env file in the root directory and add the following:

`BASE_URL=your-base-url (e.g: https://trainingpoint.vercel.app)`

`URL_TYPE=your-url-type (e.g: api)`

`API_VERSION=your-api-version (e.g: v1)`

`CLIENT_ID=your-client-id (from django-oauth-toolkit)`

`CLIENT_SECRET=your-client-secret (from django-oauth-toolkit)`

`FIREBASE_API_KEY=your-firebase-api-key`

`FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain`

`FIREBASE_PROJECT_ID=your-firebase-project-id`

`FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket`

`FIREBASE_MESSAGING_SENDER_ID=your-firebase-mapping-sender-id`

`FIREBASE_APP_ID=your-firebase-app-id`

`FIREBASE_MEASUREMENT_ID=your-firebase-measurement`

`FIREBASE_DATABASE_URL=your-firebase-database-url`

## Run locally

-  Run on Android:

```shell
npx react-native run-android
```

-  Run on iOS:

```shell
npx react-native run-ios
```
