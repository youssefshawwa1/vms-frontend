## Project Description

This full-stack application is a **Volunteering Management System** built with the goal of supporting **local NGOs**.  
The main purpose of the project is to solve common challenges faced by small organizations, such as tracking volunteer data, managing volunteering activities, and organizing teams and tasks efficiently.

Many local NGOs still rely on spreadsheets or manual processes, which makes data inconsistent and difficult to maintain.  
This system aims to provide a **centralized, secure, and scalable platform** to manage volunteers and their contributions.

---

## Project Architecture

The project is structured as a **monorepo** and consists of two main parts:

- **Frontend:** A modern, dynamic web application for administrators and managers.
- **Backend:** A RESTful API that handles business logic, authentication, data persistence, and document generation.

---

## Technology Stack

### Frontend

- **React.js** – Component-based UI development
- **Tailwind CSS** – Utility-first styling
- **Material UI** – Reusable UI components
- **Axios** – API communication
- **React Icons** – Icon library
- **React Router DOM** – Client-side routing

### Backend

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MySQL** – Relational database
- **EJS** – Template engine for documents and emails
- **Puppeteer** – PDF generation and image previews
- **Nodemailer** – Email delivery
- **Dotenv** – Environment configuration

---

## Core Functionalities

- **CRUD Operations** for:

  - Volunteers
  - Teams
  - Volunteering activities
  - Tasks
  - Certificates

  - **Dynamically updates:** This system dynamically look at what it recived and updates the fields that only been recived, no need to update the whole record.
  - **Search/Filters:** In each endpoint there is a search and filter query, you can use them as u which, and they are secure, there are onlly few filterss are allowed.
  - **Pagination:** All gett requet comes with paginatoin and limit, and ssortBy orderBy.

  - **Uing Grid from MUI** Ussing the grid, with customizaion on the filters and search to ue the backend, and also paginatoin with the abackend directly.
  - **Search, and paginatioin** All tabless are uing paginatoins from backend, limit, filter search. all from backend. Jut consuming the functionalities.

- **Certificate Generation**

  - Dynamic certificate creation
  - PDF generation and email delivery
  - Certificate preview as an image before download

- **Authentication & Security**

  - Secure login system
  - **Two-step authentication (OTP)**
  - Token-based protected routes

- **Dynamic & Scalable UI**
  - Reusable, robust components
  - Configuration-driven pages
  - Minimal code repetition
  - New pages and entities can be added by updating configuration files instead of duplicating code

---

## Design Philosophy

The system was designed with:

- **Scalability** – easy to extend with new features
- **Maintainability** – clean structure and reusable logic
- **User Experience** – fast, intuitive, and responsive UI
- **Security** – protected data access and authentication flows

---

## Project Status & Future Work

This project is **still under active development**.

Planned improvements include:

- **Role-Based Access Control (RBAC)** to ensure:
  - Admins, managers, and volunteers only access their permitted data
- More granular permissions
- Enhanced analytics and reporting
- Performance optimizations

The long-term goal is to deliver a **seamless and secure experience** for all user roles while remaining lightweight and practical for small and medium-sized NGOs.
