# React + Vite
 
 # BookWizards app

-  It is a web application that allows users to search for books using the Open Library API,   
-  It allows users to save their favorite books, and manage tasks. 
-  The application features a user authentication system,  book management, and a task scheduler.

# Technologies used

- React.js: For building the user interface.

- Axios: HTTP client for making API requests.

- React Router: For handling navigation.

- CSS: For styling components.

- Vite: Development build tool for faster performance.


## Features

*User Authentication:*

- Login and Signup forms for user authentication.

*Book Search:*

- Search for books using the Open Library API.

 -View book details and editions.

*Saved Books:*

- Save favorite books to the user's profile.

- Delete saved books.

*Task Scheduler:*

- Add and manage tasks with a due date.

- Delete tasks.


## Kids-Specific Search:

*The query string includes kids books to ensure results are focused on children's literature.*

- searchQuery = `${query} kids books`;

*Search Levels:*

- Users can now search by terms like Level 1 kids books, and the Open Library API will filter results accordingly.

*Description:*

- The description field uses the first sentence if available, providing a summary for the user.

*Error Handling:*

- Returns an error message if no query is provided.

*Example Queries*

- Here are examples of how users can search:

- "Level 1": To find beginner-level books for kids.
- "Level 2": To find intermediate-level books.
- "fairy tales": For books about fairy tales targeted at children.
- "science kids books": For children's books related to science.

## Live Site

[Click here to view the live site](#)(https://mern-client-dmny.onrender.com/).

## Backend site

[Click here for the Backend](#)(https://mern-server-9nl3.onrender.com/).

## git repo

- FrontEnd: https://github.com/semhar-z/MERN-client.git
- BackEnd:  https://github.com/semhar-z/MERN-server.git





