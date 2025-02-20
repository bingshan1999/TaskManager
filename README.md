# Task Manager Application

This is a full-stack Task Manager application that uses Spring Boot for the backend and React for the frontend. The React production build has been integrated into Spring Boot's static resources, allowing you to run the entire application with just Java and Maven.

## Features

- **Backend (Spring Boot):**
  - CRUD operations for tasks (Create, Read, Update, Delete)
  - Global exception handling and logging (using SLF4J/Logback)
  - Uses SQLite as a file-based database

- **Frontend (React):**
  - Responsive, card-based UI for task management
  - Filtering, sorting, and search functionalities
  - Modal for creating new tasks with input validation
  - Styled with Tailwind CSS

- **SQLite**
  - Schema can be found in /src/main/resources

## Prerequisites

- Java 21
- Maven
  (Note: To run the deployed application, you only need Java and Maven. If you wish to modify the frontend code, you will also need Node.js and npm.)

## Setup Instructions

1. Clone the Repository:
    ```
    git clone https://github.com/bingshan1999/TaskManager.git
    cd TaskManager
    ```
2. Build and Run the Backend:
   ```
    .\mvnw clean install
    .\mvnw spring-boot:run
   ```

   The application will start on port 8080.

3. Access the Frontend ***http://localhost:8080/***

4. For Frontend Development (Optional):
   If you wish to modify the React frontend:
   - Navigate to the frontend directory:
    ``` 
    cd frontend
    ```
   - Install dependencies:
    ```
    npm install
    ```
   - Run the React development server:
    ```
    npm start
    ```
   This will launch the React app on port 3000 with hot reloading. When you make changes, rebuild the production build and copy the files to src/main/resources/static.

___

# Scalability Challenges and Concurrency

In a multi-user environment, challenges arise when multiple users attempt to modify the same task simultaneously. For example, if two users try to change a task’s status at the same time, without proper concurrency control, one update might override the other. To address these issues, potential solutions include:

- **Login System:** Only the user assigned to a task can update its status, which limits conflicts and ensures that only authorized users make changes.
- **Optimistic Locking:** Using a version field (via JPA’s @Version annotation) enables the system to reject an update if the task has been modified since it was last read, thus preventing lost updates.

# Architectural Considerations – Builder Design Pattern

The Builder Pattern offers a fluent, chainable approach to constructing complex objects. This is particularly useful when an object has many optional attributes. In the context of our Task application, if we want to allow users to add extra custom fields, the Builder Pattern scales more easily because:

- **Chainable Construction:** The builder allows setting various fields step by step. For instance, you can have a method like `setAttribute(key, value)` that adds dynamic fields into a map.
- **Incremental Object Assembly:** Optional fields are added only when needed, making the construction process flexible and readable.
- **Centralized Validation:** The builder’s final `build()` method can enforce validation rules (e.g., ensuring required fields like title and assignedTo are present).

## Adapting the Schema for Extra Attributes

When supporting additional dynamic fields, the database schema might need to evolve. Two common approaches are:

- **JSON Storage:** Add a column to the tasks table (e.g., `attributes`) that stores a JSON object with dynamic key/value pairs. This allows flexibility without altering the table structure.
- **Separate Attributes Table:** Create a new table (e.g., `task_attributes`) where each row stores an attribute’s key and value along with a foreign key to the main task. This normalized approach separates static and dynamic data.

The Builder Pattern facilitates assembling these optional values into a Task object regardless of the chosen schema adaptation.

# Technologies Used and Rationale

- **Spring Boot:** Simplifies Java web development with built-in support for REST APIs, dependency injection, and auto-configuration, making it ideal for rapid application development.
- **React:** Offers a modular, component-based UI framework that integrates seamlessly with Spring Boot’s static resource serving, enabling a dynamic and responsive user interface.
- **SQLite:** A lightweight, file-based relational database that requires minimal configuration, perfect for small-scale applications and demos.
- **Tailwind CSS:** A utility-first CSS framework that accelerates UI development and ensures consistent styling across the application. CDN is used for demo purposes.


# Assumptions and Limitations

- **Lack of User Authentication:**  
  The current implementation does not include a user login system. In a production environment, robust authentication and authorization (e.g., using Spring Security) would be necessary to ensure that only authorized users can modify tasks.

- **Concurrency Issues:**  
  The application implements minimal concurrency control. Without advanced measures like optimistic locking, simultaneous updates from multiple users could lead to lost updates or inconsistent data.

- **No Real-Time Updates:**  
  The UI does not automatically refresh to reflect changes made by other users. Implementing real-time updates would require additional technologies such as WebSockets or periodic polling.

- **Limited Dynamic Fields:**  
  The design currently supports only a limited number of extra custom fields. To support an arbitrary set of dynamic attributes, the database schema would need to be modified (for example, by using a JSON column or a separate attributes table), along with more complex object creation logic.




