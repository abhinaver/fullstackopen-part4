# Full Stack Open 2024 – Part 4: Testing Express Servers, User Administration

This repository contains my solutions for **Part 4** of the [Full Stack Open 2024](https://fullstackopen.com/en/part4) course, focusing on:

- Structure of a backend application
- Testing with Jest and Supertest
- User administration with password hashing
- Token-based authentication using JWT
- Middleware implementation
- Bloglist backend and its evolution

## 📁 Project Structure

- `/models` – Mongoose schemas for Blogs and Users
- `/controllers` – Route handlers for blogs and users
- `/utils` – Custom middleware (e.g., errorHandler, tokenExtractor)
- `/tests` – Unit and integration tests using Jest
- `app.js` – Main Express app
- `index.js` – Entry point

## 🧪 Exercises Covered

| Exercise Range   | Description                               |
|------------------|-------------------------------------------|
| 4.1 – 4.7        | Refactor to Express app, blog testing     |
| 4.8 – 4.12       | Add tests using Jest and Supertest        |
| 4.13 – 4.14      | Add DELETE and PUT functionality          |
| 4.15 – 4.23      | User model, password hashing, JWT, tests  |

## ⚙️ How to Run Locally

```bash
npm install
npm run dev   # or node index.js
