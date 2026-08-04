# 🏠 Rental Management System - Backend

![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Express](https://img.shields.io/badge/Express-5.x-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-success)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

Backend REST API for the **Rental Management System** built with **Node.js, Express.js, MongoDB, and JWT Authentication**.

The backend allows property owners to manage rental listings while renters can browse, save, and review properties.

---

# Features

## Authentication

- User Registration
- User Login
- User Logout
- JWT Authentication
- HTTP Only Cookies
- Password Hashing using bcrypt
- Role Based Authorization
- Owner & Renter Accounts

---

## Property Management

Owners can

- Create Property
- Update Property
- Delete Property
- View Own Listings

Everyone can

- Browse Properties
- View Property Details
- Search Properties
- Filter by Price
- Sort Listings
- Pagination
- Nearby Property Search using GeoJSON

---

## Reviews

Renters can

- Write Review
- Delete Own Review

Owners can

- Reply to Reviews
- Edit Replies

---

## Favorites

Renters can

- Save Property
- Remove Saved Property
- View Saved Properties

---

# Tech Stack

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| cookie-parser | Cookie Handling |
| dotenv | Environment Variables |
| cors | Cross-Origin Requests |

---

# Project Structure

```
backend
│
├── server.js
├── package.json
│
└── src
    ├── app.js
    │
    ├── controller
    │     ├── auth.controller.js
    │     ├── property.controller.js
    │     ├── review.controller.js
    │     └── favorites.controller.js
    │
    ├── db
    │     └── db.js
    │
    ├── middleware
    │     ├── auth.middleware.js
    │     ├── owner.middleware.js
    │     └── verifyproperty.middleware.js
    │
    ├── model
    │     ├── user.model.js
    │     ├── rental.model.js
    │     ├── review.model.js
    │     └── favorites.model.js
    │
    └── routes
          ├── auth.routes.js
          ├── property.routes.js
          ├── review.routes.js
          └── favorites.routes.js
```

---

# Installation

Clone repository

```bash
git clone <repository-url>
```

Move into backend

```bash
cd backend
```

Install packages

```bash
npm install
```

---

# Environment Variables

Create a `.env`

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

NODE_ENV=development
```

---

# Running Server

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

# API Base URL

```
http://localhost:3000/api
```

---

# Authentication Routes

Base URL

```
/api/auth
```

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /register | Register User |
| POST | /login | Login |
| POST | /logout | Logout |

---

# Property Routes

Base URL

```
/api/properties
```

| Method | Endpoint | Authentication |
|---------|----------|----------------|
| POST | /add-property | Owner |
| GET | /get-all-properties | Public |
| GET | /nearby | Public |
| GET | /get-property/:id | Public |
| PUT | /update-property/:id | Owner |
| DELETE | /delete-property/:id | Owner |
| GET | /view-my-listings | Owner |

---

## Query Parameters

### Get All Properties

```
?page=1
&limit=10
&search=flat
&minPrice=10000
&maxPrice=30000
&sort=price_asc
```

Available sorting

```
price_asc
price_desc
newest
oldest
```

---

## Nearby Properties

```
GET /nearby

Query

lng=
lat=
radius=
page=
limit=
minPrice=
maxPrice=
search=
sort=
```

Radius is measured in **Kilometers**.

---

# Review Routes

Base URL

```
/api/reviews
```

| Method | Endpoint |
|---------|----------|
| POST | /create-review/:propertyid |
| GET | /get-property-review/:propertyid |
| DELETE | /delete-review/:reviewid |
| POST | /reply-review/:reviewid |
| PATCH | /edit-reply/:reviewid |

---

# Favorite Routes

Base URL

```
/api/favorites
```

| Method | Endpoint |
|---------|----------|
| POST | /add-forlater/:propertyid |
| POST | /remove-forlater/:propertyid |
| GET | /get-forlater |

---

# Authentication Flow

```
Register/Login
        │
        ▼
Password Verified
        │
        ▼
JWT Generated
        │
        ▼
Stored in HTTP Only Cookie
        │
        ▼
Protected Routes
        │
        ▼
User Authorized
```

---

# Middleware

## auth.middleware

- Verifies JWT
- Reads HTTP Only Cookie
- Adds user to request

---

## owner.middleware

- Checks logged in user
- Verifies Owner Role

---

## verifyproperty.middleware

- Checks Property Exists
- Confirms Ownership
- Prevents Unauthorized Updates

---

# Database Models

## User

```
name
email
password
role
createdAt
updatedAt
```

---

## Rental

```
title
description
type
location
price
rooms
sizeSqft
furnished
genderPreference
waterSupply
amenities
owner
images
timestamps
```

---

## Review

```
property
reviewer
rating
comment
ownerReply
timestamps
```

---

## Favorite

```
renter
property
timestamps
```

---

# GeoJSON Support

Properties store location using MongoDB GeoJSON.

```json
{
  "type": "Point",
  "coordinates": [
    85.3240,
    27.7172
  ]
}
```

A **2dsphere index** is created to enable efficient nearby searches.

---

# Security Features

- JWT Authentication
- HTTP Only Cookies
- Password Hashing
- Role Based Authorization
- Property Ownership Verification
- Duplicate Review Prevention
- Duplicate Favorite Prevention
- Input Validation
- Protected Routes

---

# HTTP Status Codes

| Code | Meaning |
|------|----------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

# Dependencies

```
express
mongoose
jsonwebtoken
bcrypt
cookie-parser
cors
dotenv
nodemon
```

---

# Future Improvements

- Image Upload (Cloudinary)
- Email Verification
- Password Reset
- Refresh Tokens
- Admin Dashboard
- Property Availability Calendar
- Booking System
- Notifications
- Payment Integration
- Chat Between Owner & Renter
- Property Reports
- Rate Limiting
- API Documentation using Swagger
- Unit & Integration Tests
- Docker Support

---

# License

This project is licensed under the MIT License.

---

# Author

**Sandesh Sharma**

Computer Science Student

MERN Stack Developer

Kathmandu, Nepal