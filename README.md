![logicloom](https://socialify.git.ci/monis07/logicloom/image?description=1&descriptionEditable=Solve%20and%20Level%20up%20your%20coding%20skills!&font=Inter&language=1&name=1&owner=1&pattern=Signal&theme=Light)

## ✅ Introduction

Logicloom is a platform where you can test your coding skills by solving numerous data structures and algorithms questions. TypeScript, React and SCSS is used to create the frontend. Express.js and MongoDB is used to create the backend. 

Moreover, Judge0 code execution system is used to execute the codebase submitted by the user.

## 🚀 Why did I build this?

I was looking for unique project idea to build after i finished learning TypeScript. I got curious of how to build a platform like leetcode, hackerrank, etc. which are used by millions of people in the tech community. So thought of creating one of my own to upskill!

## 👨‍💻 Local development

That is pretty easy. Make sure u have <b>Git</b>, <b>Node.js</b>, <b>npm</b>, <b>MongoDB compass</b> and <b>Postman API</b> installed in your system.

First we will clone the repo in our local system

```sh
git clone https://github.com/monis07/logicloom.git
cd server
```

Backend setup for local development(/server):

 - After navigating to server folder, create a .env file in the server folder. .env file needs to 2 values. One the MongoDB connection url which will be copied from MongoDB Compass and other the secret key for jwt tokens used for generation and verification of tokens. Generate 2 variables named as MONGO_DB_URL and SECRET_KEY respectively.

 - Run these commands to run the backend of the application. Note: You can use Postman API to test the routes and response received from each route.
   
```sh
npm install
npm install ts-node
ts-node index.ts
```

Frontend setup for local development(/client):

 - Run these commands to run the frontend of the application.
   
```sh
cd ../client
npm install
npm run dev
```

Once you follow all the steps above sequentially, your full stack app is running 🔥 and you can test it on localhost:5173

## ⚙️ Features

- Logicloom provides signup and signin authentication system.
- Logicloom have a tiered system for categorizing coding challenges based on their difficulty levels: easy, medium, and hard.
- The project is powered by Judge0(Code execution system) api which has a limit of 50 api request per day in free tier plan.
- This project can be used by 10 users simultaneously and can easily be scaled to 100+ users.
- Contains features like error handling, test cases acceptance status and support for Java language.
