# CRM Management System (MERN Stack)

A full-stack **CRM (Customer Relationship Management) system** built using the MERN stack with **role-based access** for Admin and Sales users.

This project follows a real-world CRM workflow including leads, follow-ups, customers, deals, tasks, and reports.

---

##  Features

###  Admin Role
- Create, edit, and delete leads
- View all sales users
- Assign leads to sales users
- View all leads
- View all customers (Active & Completed)
- View sales reports (Total Leads / Won / Lost deals / Total Revenue )

###  Sales User Role
- View only assigned leads
- Add follow-ups to assigned leads
- Convert leads to customers
- Create deals for own customers
- Move deal stages (New → Contacted → Proposal → Negotiation →  Won/Lost)
- View only own customers
  - Active customers
  - Completed customers
- View tasks created from follow-ups and also view follow-ups title

---

##  CRM Workflow

1. Admin creates a lead  
2. Admin assigns lead to sales user  
3. Sales user adds follow-ups  
4. Sales user converts lead to customer  
5. Sales user creates deal  
6. Deal moves through stages  
7. Deal is closed (Won / Lost)  
8. Customer automatically moves to Completed

---

##  Tech Stack

### Frontend
- React (Vite)
- JavaScript (ES6+)
- Tailwind CSS
- Axios
- React Router DOM
- Context API (AuthContext)
- Role-based UI Rendering
- Responsive UI Design
- Conditional Rendering
- Component-based Architecture



### Backend
- Node.js
- ES6 Modules (import / export)
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Role-based Authorization (Admin / Sales User)
- RESTful APIs
- Middleware Architecture
- MVC Folder Structure
- Environment Variables (dotenv)

---

##  Authentication & Authorization

- JWT-based authentication
- Role-based access control
- Secure API Access
- Roles:
  - Admin
  - Sales User

