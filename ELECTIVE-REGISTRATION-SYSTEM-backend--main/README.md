# University Elective Registration System

A centralized platform designed to streamline the elective enrollment process, ensuring students are assigned courses based on prerequisites, academic standing, and department-specific quotas.

## 🚀 Project Overview
This system automates the elective registration process, removing the need for manual spreadsheets and manual quota tracking. It features secure user authentication, real-time prerequisite validation, and automated waitlisting for over-subscribed courses.

## 🏗️ System Architecture
The project is divided into two primary modules:
* **Backend (Core API):** Handles business logic, authentication (JWT), enrollment validation, and database management.
* **Frontend (Dashboard):**  Provides the UI for students to browse courses and for admins to manage enrollment status.

## 🔑 Key Features
* **Secure Authentication:** JWT-based login system for students and administrators.
* **Prerequisite Engine:** Automatically validates if a student has completed required courses before allowing enrollment.
* **Quota Management:** Enforces department-specific seat limits and handles automated waitlisting.
* **Add/Drop Functionality:** Allows students to swap electives within a defined academic window and attendance criteria.

## 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** JSON-based persistent storage (Mock Database)
* **Authentication:** JSON Web Tokens (JWT)

## ⚡ Getting Started (Backend)

### Prerequisites
* Node.js (v16+)
* npm
