# Training Point Management

Welcome to the Training Point Management Mobile App repository! This app is designed to streamline and facilitate the process of managing and tracking student conduct points in an educational institution. The system provides different levels of access and functionalities for student affairs specialists, student assistants, and students. It offers features such as account management, activity registration, point tracking, and comprehensive reporting.

## Features

1. Student Affairs Specialist (SAS)

   -  Account Management: Create and manage accounts for student assistants. Students can register using their school-provided email and upload an avatar.
   -  Statistics and Reports: View conduct point statistics across the institution by department, class, and achievement. Export reports in PDF or CSV format.
   -  Student Assistant Privileges: Access all functionalities available to student assistants.

2. Student

   -  Activity Registration: Register for upcoming extracurricular activities listed on the bulletin board.
   -  Point Tracking: View conduct points by criteria, total points, and report missing points for activities with proof if necessary.
   -  Activity History: View a history of activities registered for and participated in.
   -  Interaction: Like or comment on activities listed on the bulletin board.

3. Student Assistant

   -  Performance Review: Access a student’s extracurricular achievements and the list of activities with reported missing points.
   -  Point Verification: Verify or reject reported points with provided evidence.
   -  Activity Creation: Create new activities for students to register for.
   -  Attendance Upload: Upload attendance lists in CSV format to update conduct points.
   -  Statistics and Reports: View conduct point statistics by class and achievement level, and export detailed point lists in PDF or CSV format.

4. Additional Features
   -  Bulletin Board: A centralized platform for posting upcoming activities created by student assistants. Allows students to register, like, and comment on activities.
   -  Real-Time Chat: Integrated real-time chat using Firebase to facilitate communication between students and student assistants.

## Installation

1. Clone the project

```shell
git clone https://github.com/HiepThanhTran/TPM-Mobile-App.git
cd TPM-Mobile-App
```

2. Install dependencies

   -  Ensure npm is installed on your machine, and then run:

```shell
npm install
```

3. Set Up Firebase

   -  Create a Firebase project in your Firebase account.
   -  Copy the Firebase configuration and paste it into the **src/Configs/Firebase.js**.

4. Environment Variables

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

5. Run the project

-  Run on Android:

```shell
npx react-native run-android
```

-  Run on iOS:

```shell
npx react-native run-ios
```
