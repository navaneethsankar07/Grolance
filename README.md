# **Grolance – Freelancing Platform**

Grolance is a full-stack freelancing platform inspired by modern gig marketplaces.
It connects clients with freelancers through a secure, role-based system for project posting, bidding, collaboration, and payments.

The platform is designed with **scalability, security, and real-world production patterns** in mind, using a modern React + Django architecture.

---

## 🚧 Project Status

**Under Active Development**

Grolance is being developed incrementally following a milestone-driven roadmap.
Core authentication, role handling, and admin foundations are stable. Marketplace, communication, and payment workflows are actively in progress.

---

## ✨ Key Capabilities

* Secure authentication with OTP & JWT
* Role-based access (Client, Freelancer, Admin)
* Modular backend with Django REST Framework
* Modern React frontend with scalable state management
* Admin-controlled platform governance
* Background task processing for email & async operations

---

## 🧩 Functional Modules

### 1. Authentication & User Roles

* Email-based signup with OTP verification
* Login, logout, password reset
* JWT authentication (access + refresh token strategy)
* All users start as **Clients**
* Switch to **Freelancer** role
* Phone OTP verification during freelancer onboarding

---

### 2. Client Modules

#### Client Dashboard

* Recommended freelancers
* Top-rated freelancers

#### Project Management

* Post and edit projects
* View proposals
* Hire freelancers
* Invitation system
* View contracts
* Raise disputes
* Notifications
* Contact support

#### Client Profile & Settings

* Profile overview
* Skills & interests
* Account settings
* Account deletion with verification

---

### 3. Freelancer Modules

#### Freelancer Onboarding (Multi-Step)

1. Basic information
2. Skills & expertise
3. Starter & Pro packages
4. Portfolio upload
5. Review & profile completion
6. Bank details for payments

#### Freelancer Dashboard

* Pending invitations
* Recommended jobs
* Task / todo list
* Active contracts

#### Job Interaction

* Job discovery with filters
* Job detail view
* Proposal submission (bid + cover letter)
* Accept / reject invitations
* Agreement confirmation before starting
* Delivery submission
* Dispute creation

#### Freelancer Profile

* Public freelancer profile
* Edit profile details
* Manage skills, packages, and portfolio

---

### 4. Communication System

* Chat interface (text-only)
* Conversation list
* Chat unlocks only after hiring
* Chat locked after order completion
* Contact-sharing restrictions

---

### 5. Payment Module

* Razorpay integration (test mode)
* Client pre-payment before work starts
* Contract-level payment tracking
* Automatic commission calculation
* Admin-controlled payment release
* Freelancer earnings overview

---

### 6. Order Workflow

* Order lifecycle:

  * Pending → In Progress → Submitted → Under Review → Completed
* Timeline tracking
* Delivery submission system
* Automatic and manual state transitions

---

### 7. Dispute Management

* Dispute submission by users
* Evidence upload
* Status timeline
* Admin decision panel
* Final resolution handling

---

### 8. Notification System

* Notification modal
* Mark-all-as-read functionality

---

### 9. Admin Panel

#### Admin Dashboard

* Total users
* Total projects
* Active contracts
* Proposal count
* Dispute count
* Platform revenue
* Recent activity
* Charts & analytics

#### User Management

* User listing
* View user details
* Block / unblock users
* Soft delete users

#### Category & Skill Management

* Add / delete categories
* Add / delete general skills

#### Dispute Management

* Dispute listing
* Detailed review
* Admin resolution

#### Payments & Transactions

* Revenue overview
* Transaction list
* Manual payment release
* Refund handling

#### Support System

* Support ticket list
* Ticket replies (email-based)
* Ticket closure

#### Admin Settings

* Platform commission configuration
* Support email configuration

---

## 🧱 Technology Stack

### Frontend

* React (Vite)
* React Router
* **TanStack Query** (server-state management)
* Redux Toolkit (auth & global state)
* Redux Persist
* Axios with interceptors
* Tailwind CSS

### Backend

* Django
* Django REST Framework
* SimpleJWT
* PostgreSQL
* Redis (OTP, caching)
* **Celery** (background tasks & email)
* Django Channels (planned)

---

## 📁 Project Structure

```
GROLANCE/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── utils/
│   ├── main.jsx
│   ├── App.jsx
│   └── vite.config.js
│
└── server/
    ├── accounts/
    ├── adminpanel/
    ├── categories/
    ├── communication/
    ├── contracts/
    ├── payments/
    ├── profiles/
    ├── projects/
    ├── grolance_backend/
    ├── manage.py
    └── requirements.txt
```

---

## ▶️ Running Locally

### Backend

```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 👤 Author

**Navaneeth Sankar**
Full-Stack Developer (Django + React)

---

## 📄 License

This project is built for educational and learning purposes.
Commercial usage will require further review and licensing decisions.

---

