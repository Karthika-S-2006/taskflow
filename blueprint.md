# **Blueprint: TaskFlow - Hotel Staff & Task Management System**

## **1. Project Overview**

TaskFlow is a real-time, role-based web application designed to streamline the internal operations of a hotel. It replaces manual task delegation methods with a centralized, digital system, providing two distinct, secure portals for Administrators and Staff. The application is built on Google Firebase, leveraging its real-time capabilities to ensure all user dashboards are instantly synchronized.

## **2. Core Technology Stack**

*   **Backend & Database:** Google Firebase
    *   **Cloud Firestore:** A NoSQL, document-based database for storing all application data (users, tasks, rooms, task types).
    *   **Firebase Authentication:** Manages user accounts, including sign-up, sign-in, and password management.
*   **Frontend:** HTML, CSS, and modern JavaScript (ES Modules, Web Components).

## **3. Database Architecture (Cloud Firestore)**

*   **`users` Collection:** Stores user profile data, keyed by the user's Firebase Authentication UID.
    *   Fields: `username`, `email`, `role` (`admin`/`staff`), `isDefaultPassword` (for admin).
*   **`usernames` Collection:** A unique index for username-based logins, mapping usernames to UIDs.
*   **`tasks` Collection:** Stores all task information and its lifecycle.
    *   Fields: `roomNumber`, `taskName`, `description`, `assignedTo`, `createdBy`, `status` (`pending`, `in_progress`, `completed`, `cancelled`), `timeCreated`, `timeAccepted`, `timeCompleted`.
*   **`rooms` Collection:** A dynamic list of valid room numbers.
*   **`taskTypes` Collection:** A dynamic list of valid service types.

## **4. Application Workflow & Features**

### **4.1. Administrator Workflow**

*   **Initial Login & Setup:**
    *   Admin logs in with a default password.
    *   The system forces a password change on the first login.
*   **Admin Dashboard:**
    *   **Manage Rooms:** Add/delete room numbers.
    *   **Manage Task Types:** Add/delete task types.
    *   **Assign New Task:** Create and assign tasks to staff members.
    *   **Task Lists:** Real-time views of "Pending," "Ongoing," and "Completed" tasks.
    *   **Task Actions:** Cancel assigned or ongoing tasks.

### **4.2. Staff Workflow**

*   **Sign-Up & Login:**
    *   Staff can sign up with a unique username and password.
    *   The system uses a synthetic email for Firebase Authentication.
*   **Staff Dashboard:**
    *   **New Assigned Tasks:** View a list of pending tasks.
    *   **Task Actions:**
        *   **Accept Task:** Change the task status to `in_progress`.
        *   **Mark as Completed:** Change the task status to `completed`.
    *   **Ongoing Tasks:** View a list of tasks currently in progress.

## **5. Current Development Plan**

*   **Task:** Project Scaffolding
*   **Steps:**
    1.  Create the `blueprint.md` file (Completed).
    2.  Create the directory structure: `css`, `js`, `views`.
    3.  Create placeholder HTML files for all views.
    4.  Update `index.html` to include Firebase SDKs and basic routing.
    5.  Create `firebase-config.js` for Firebase initialization.

## **6. UI/UX Enhancement Plan**

*   **Objective**: To modernize the application's design, improve usability, and create a more engaging user experience.
*   **Key Initiatives**:
    *   **Consistent Branding**: Establish a consistent color palette, typography, and iconography across the application.
    *   **Improved Layout**: Redesign the layout of each view for better information hierarchy and a more intuitive user flow.
    *   **Modern Components**: Refactor existing HTML into Web Components for reusability and maintainability.
    *   **Visual Polish**: Add subtle animations, shadows, and other visual effects to create a more polished and professional look.
*   **Development Steps**:
    1.  **Style Login/Signup Pages**: Apply the new design to the admin and staff login/signup pages.
    2.  **Refactor Views into Web Components**: Start by creating Web Components for common UI elements like buttons, forms, and lists.
    3.  **Style Admin Dashboard**: Redesign the admin dashboard with the new styling and components.
    4.  **Style Staff Dashboard**: Redesign the staff dashboard with the new styling and components.
