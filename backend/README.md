# Volunteering Management System (Backend API)

## 🚀 Overview

The VMS Backend is a robust **Node.js** and **Express.js** REST API designed to power the Volunteering Management System. It handles complex business logic, secure authentication with 2FA, and automated document generation. The system leverages **Puppeteer** for high-fidelity PDF rendering and **Nodemailer** for secure communication.

## 🛠 Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (via `db.js` configuration)
- **Templating:** EJS (for PDF & Email templates)
- **PDF Generation:** Puppeteer (Headless Chrome)
- **Email Service:** Nodemailer
- **Security:** JWT (JSON Web Tokens), Bcrypt for password hashing

## ⚙️ Core Functionalities

### 🛡 Authentication & Security

- **Secure Login:** Password hashing and validation.
- **Two-Step Verification (2FA):** Automatic generation and emailing of 6-digit verification codes using **Nodemailer**.
- **Role-Based Access Control (RBAC): (will implement it later)** Middleware-driven permission checks for Admins, Managers, and Volunteers.

### 📜 Certificate Generation & Dispatch

- **Dynamic Templating:** Uses **EJS** to inject volunteer data into HTML templates located in `views/pdf-templates`.
- **PDF Rendering:** Utilizes **Puppeteer** to convert HTML/EJS designs into professional PDF documents, supporting custom fonts stored in `assets`. Also converst it to an imge for usesr preview before download.

### 📊 System Management

- **Dashboard Analytics:** Aggregated data for team performance and task completion rates.
- **CRUD:** CRUD operations for volunteerss, tasks, teams, volunteering, certificates.

## 📁 Project Structure

- **Dynamic Templating:** This project usses controllers and models in the logic, and all the endpoints are in the app, temperarrely.

## 🚀 Installation and Setup

### Prerequisites

- **Node.js (v18.0 or higher)**
- **MySQL database**

### Setup innstructions

#### Clone the repository

```bash
git clone https://github.com/youssefshawwa1/vms-frontend.git
cd vms-frontend/backend
```

#### Installing Dependenciess

```bash
npm install
```

#### Environment Configuration Create a .env file in the root directory:

```bash
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=vms_db

JWT_SECRET=your_jwt_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

#### Start the server

```bash
npm start
```

# API Endpoints Documentation

---

## Authentication

- `POST` `/auth/login`
- `POST` `/auth/verify-otp`
- `GET` `/auth/validate-token` **(Protected)**

---

## Dashboard

- `GET` `/dashboard` **(Protected)**

---

## Users

- `GET` `/users` **(Protected)**
- `POST` `/users` **(Protected)**
- `GET` `/users/:userId` **(Protected)**
- `PATCH` `/users/:userId` **(Protected)**
- `DELETE` `/users/:userId`

---

## Profile

- `GET` `/profile` **(Protected)**
- `PATCH` `/profile` **(Protected)**

---

## Roles

- `GET` `/roles` **(Protected)**

---

## Certificates

- `GET` `/certificates` **(Protected)**
- `GET` `/certificates/:certificateId` **(Protected)**
- `PATCH` `/certificates/:certificateId` **(Protected)**
- `GET` `/certificates/:certificateId/pdf` **(Protected)**
- `GET` `/certificates/:certificateId/preview` **(Protected)**
- `POST` `/certificates/:certificateId/send` **(Protected)**

---

## Volunteers

- `GET` `/volunteers` **(Protected)**
- `POST` `/volunteers` **(Protected)**
- `GET` `/volunteers/:volunteerId` **(Protected)**
- `PATCH` `/volunteers/:volunteerId` **(Protected)**

### Volunteer Relations

- `GET` `/volunteers/:volunteerId/tasks` **(Protected)**
- `GET` `/volunteers/:volunteerId/volunteering` **(Protected)**
- `GET` `/volunteers/:volunteerId/certificates` **(Protected)**
- `POST` `/volunteers/:volunteerId/certificates` **(Protected)**

---

## Teams

- `GET` `/teams` **(Protected)**
- `POST` `/teams`
- `GET` `/teams/:teamId` **(Protected)**
- `PATCH` `/teams/:teamId` **(Protected)**

### Team Relations

- `GET` `/teams/:teamId/tasks` **(Protected)**
- `GET` `/teams/:teamId/volunteering` **(Protected)**

---

## Volunteering (Team Volunteers)

- `GET` `/volunteering` **(Protected)**
- `POST` `/volunteering` **(Protected)**
- `GET` `/volunteering/:teamVolunteerId` **(Protected)**
- `PATCH` `/volunteering/:teamVolunteerId` **(Protected)**
- `PATCH` `/volunteering/:teamVolunteerId/end` **(Protected)**

### Volunteering Tasks

- `GET` `/volunteering/:teamVolunteerId/tasks` **(Protected)**
- `POST` `/volunteering/:teamVolunteerId/tasks` **(Protected)**

---

## Tasks

- `GET` `/tasks` **(Protected)**
- `GET` `/tasks/:taskId` **(Protected)**
- `PATCH` `/tasks/:taskId` **(Protected)**
- `PATCH` `/tasks/:taskId/complete` **(Protected)**
