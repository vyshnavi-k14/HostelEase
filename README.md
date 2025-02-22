# HostelEase

## Overview
The **HostelEase** is a web application developed to streamline the process of hostel room reservations. Students can easily reserve a bed and hostel room through the website. The system implements a color-coded interface that visually indicates the status of each room and bed, making it user-friendly to check availability.

## Key Features

### For Students
- **Color-Coded Room and Bed Status**: 
  - ![#6c757d](https://img.shields.io/badge/-Grey-6c757d?style=flat-square) **Grey**: Available
  - ![#FFFF00](https://img.shields.io/badge/-Yellow-FFFF00?style=flat-square) **Yellow**: Reserved
  - ![#FF0000](https://img.shields.io/badge/-Red-FF0000?style=flat-square) **Red**: Occupied
- **Status Tracking**: Easily check the status of your reservation requests.

### For Admins
- **Approve/Reject Requests**: Manage student requests by approving or rejecting them.
- **View Approved Requests**: Easily access a list of all approved requests.
- **View Rejected Requests**: Access and review all rejected requests.

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL

## Project Structure
- **node_modules/**: Contains all the project dependencies.
- **public/**: Public-facing assets such as HTML, CSS, JavaScript, images, fonts, and other static files that are served directly to the client.
- **routes/**: API routes for handling requests.
- **db.js**: Database connection and queries.
- **package.json**: Contains metadata about the project and its dependencies.
- **server.js**: Main server file where the Express app is set up and the server is started.
