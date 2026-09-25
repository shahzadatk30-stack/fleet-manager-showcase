# Fleet Manager

### Multi-Company Fleet, Rental & Business Management Platform

A production-oriented Flutter application designed to manage vehicles, rentals, financial records, vendors, payments and operational reporting across multiple company environments.

**Built with Flutter + Firebase | Role-Based Access | Multi-Company Architecture | Secure Company Isolation**

A working reference implementation of a **multi-tenant SaaS architecture built with Flutter and Firebase**.

Fleet Manager demonstrates how a centralized platform can manage multiple companies while keeping company authentication, business data and Firebase environments separated.

> **Source code is private. This repository is a portfolio showcase of the application architecture, features and user experience.**

---

## Product Demo

A 1 minute 50 second walkthrough showcasing the Fleet Manager application.

**Demo video:** [Watch Fleet Manager Demo](https://www.youtube.com/watch?v=Buat7V-SND8)

---

## Platform Overview

Fleet Manager is designed around a centralized **Super Admin + multi-company architecture**.



The same Flutter application foundation can support different companies and business workflows while maintaining isolated company environments.

---

## Architecture

### Central Platform

- Super Admin authentication
- Company directory
- Company management
- Package and feature management
- Entitlement management
- Centralized administration
- Company environment configuration

### Company Environment

Each company can operate through its own Firebase environment containing:

- Company authentication
- Company users
- Role-based access
- Firestore business data
- Storage
- Company-specific configuration
- Business operations

---

## Architecture Overview

```mermaid
flowchart TB
    U[Users] --> A[Fleet Manager Flutter App]

    A --> S[Super Admin]
    A --> C[Company Selection]
    C --> L[Company Login]

    S --> P[Central Platform Firebase]
    P --> D[Company Directory & Configuration]

    L --> E[Selected Company Firebase]
    E --> F[Company Data]
    E --> AU[Company Authentication]

    F --> CAR[Cars & Fleet]
    F --> REN[Rentals]
    F --> FIN[Income & Expenses]
    F --> VEN[Vendors & Bills]
    F --> REP[Reports]
```

## User Roles

Fleet Manager uses role-based access to separate platform administration, company management and daily operational workflows.

| Role | Responsibilities |
|---|---|
| **Super Admin** | Manage companies, platform configuration, packages and company-level administration |
| **Admin** | Manage fleet, rentals, finances, vendors, payments, reports and company users |
| **Worker** | Access assigned vehicles and operational workflows according to permissions |

Each role operates within the appropriate company environment and access scope.

## Core Capabilities

### Multi-Company Management

- Centralized company selection
- Multiple company environments
- Super Admin company management
- Company-specific configuration
- Company-isolated business data

### Authentication & Access

- Super Admin authentication
- Company-specific authentication
- Role-based access
- Admin and worker workflows
- Device management and registration

### Fleet Management

- Vehicle management
- Vehicle brand identification
- Vehicle details
- Assignment workflows
- Daily vehicle history
- Financial history per vehicle

### Financial Management

- Income tracking
- Expense tracking
- Transaction history
- Profit calculation
- Vehicle-level financial summaries

### Rental Management

- Rental creation
- Customer information
- Rental details
- Rental agreement generation
- Signature workflow
- PDF documentation

### Reporting

- Daily reports
- Vehicle-level reports
- Income and expense summaries
- Profit overview
- Historical financial records

### User Experience

- Modern Flutter UI
- Light and dark themes
- Responsive dashboards and cards
- Consistent design system
- Animated splash experience
- Centralized error and feedback handling

---

### Vendor Management

Manage vendors, bills, payments and outstanding balances within the selected company environment.

### Help & Support

A centralized support area providing FAQ, application information, Privacy Policy, Terms & Conditions and direct Contact Support options.

## Technology Stack

| Technology | Purpose |
|---|---|
| Flutter | Cross-platform application |
| Dart | Application development |
| Firebase Authentication | Authentication |
| Cloud Firestore | Business data |
| Firebase Storage | File storage |
| Dynamic Firebase environments | Company-specific environments |
| PDF generation | Rental and reporting documents |

---

## Security & Data Architecture

Fleet Manager is structured around company-level isolation and controlled access.

- **Central platform:** Super Admin authentication and company directory/configuration
- **Company environments:** Separate Firebase environments for company users and operational data
- **Role-based access:** Access is controlled according to the authenticated user role
- **Company scoping:** Company data is associated with the active company context
- **Device security:** Company access can be restricted to the registered device
- **Local data handling:** Selected operational records can be maintained locally where appropriate to reduce unnecessary cloud usage
- **Entitlement controls:** Feature availability can be managed according to company plans and permissions

This separation provides a scalable foundation for supporting multiple businesses from a single Flutter application while keeping company environments logically isolated.

## Performance & Data Management

The application is designed with practical Firestore usage and mobile performance in mind.

- Company-specific data access instead of unnecessary cross-company queries
- Local caching for frequently accessed fleet data
- Controlled synchronization to reduce repeated reads and writes
- Reusable application architecture across multiple company environments
- Composite Firestore indexes for commonly used filtered and sorted queries

## Screenshots

Selected screens from the Fleet Manager application, covering platform administration, company workflows, fleet operations, financial records, rentals, reporting, vendor management and support.

The screenshots represent the current application UI and selected completed modules.

### Company Selection

Multi-company entry point with company search and selection.

![Company Selection](screenshots/company-selection.png)

### Super Admin Login

Secure entry point for centralized platform administration.

![Super Admin Login](screenshots/super-admin-login.png)

### Super Admin — Company Management

Centralized company management, details and configuration.

![Company Details](screenshots/super-admin-company-details-view.png)

![Company Details — Management](screenshots/super-admin-company-details.png)

### Super Admin — Edit Company

Company configuration and management workflow.

![Edit Company](screenshots/super-admin-edit-company.png)

### Super Admin – Add Company

Create and configure a new company environment.

![Add Company](screenshots/add-company.png)

### Super Admin – Packages

Package and feature configuration for companies.

![Packages Details](screenshots/packages-details.png)

### Admin Dashboard

Business overview with fleet information and financial summaries.

![Admin Dashboard](screenshots/admin-dashboard.png)

### Navigation

Full application navigation menu for accessing business modules.

![Navigation Menu](screenshots/navigation-menu.png)

### Fleet & Car Management

Vehicle management workflow including car deletion controls.

![Delete Car](screenshots/delete-car.png)

### Income & Expense

Financial transaction management for business income and expenses.

![Add Income Expense](screenshots/add-income-expense.png)

### Edit Entry

Transaction editing workflow from the reports interface.

![Edit Entry](screenshots/edit-entry.png)

### Rental Management

Rental creation workflow and agreement process.

![Create Rental](screenshots/create-rental.png)

### Daily Reports
Daily financial reporting with income, expense and profit information.

![Daily Reports](screenshots/daily-reports.png)

### View Reports
Historical financial reporting and transaction review.

![View Reports](screenshots/view-reports.png)

### Device Management
Registered device administration and access control.

![Device Management](screenshots/device-management.png)

### Vendor Bills & Payments
Vendor management, bills, payments and outstanding balance tracking.

![Vendor Bills & Payments](screenshots/vendor-bills-payments-1.jpeg)

![Vendor Bills & Payments](screenshots/vendor-bills-payments-2.jpeg)

### Help & Support
Centralized support area with FAQ, About Fleet Manager, Privacy Policy, Terms & Conditions and Contact Support.

![Help & Support](screenshots/help-and-support.jpeg)

---

## Potential Business Applications

The architecture can be adapted beyond fleet and rental management.

Possible applications include:

- Fleet and vehicle management
- Rental businesses
- Inventory and warehouse systems
- Education management
- Restaurant management
- Real estate management
- Service businesses
- Equipment management
- Custom business SaaS platforms

These represent potential adaptations of the architecture and are not claims that every listed domain is currently implemented.

---

## Development Approach

The platform follows a reusable business-application architecture:

1. Centralized platform administration
2. Company-specific environments
3. Role-based authentication
4. Modular business features
5. Configurable entitlements
6. Local caching where appropriate
7. Consistent UI and design system
8. Centralized error handling
9. Reporting and document workflows
10. Cross-platform Flutter foundation

---

## Project Status

**Active Development**

Fleet Manager is a working reference implementation focused on demonstrating modern Flutter and Firebase business application development.

The platform continues to evolve as new capabilities, workflows and operational modules are designed, implemented and refined.

---

## About

**Fleet Manager**

Smart Fleet, Rental & Business Management

**Designed & Developed by Shahzad**

A portfolio project focused on building practical Flutter and Firebase applications around real business workflows, with emphasis on scalable architecture, company-level data separation and role-based access.

---

## Contact

For custom Flutter, Firebase and business application development:

**Email:** shahzad.atk30@gmail.com

**WhatsApp:** +92 331 5757557

---

## Source Code

The source code for Fleet Manager is private.

This repository intentionally contains only portfolio material, documentation, architecture information and selected screenshots.

For development inquiries or architecture discussions, please get in touch.
