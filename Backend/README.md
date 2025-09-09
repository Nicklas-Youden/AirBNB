# Express API with TypeScript and MongoDB

This project is a RESTful API built with Express.js and TypeScript, designed to connect to a MongoDB database. Below are the details for setting up and running the project.

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB (either locally or a cloud instance)
- npm (Node Package Manager)

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```
   cd express-api
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your MongoDB connection string:

   ```
   MONGODB_URI=<your-mongodb-connection-string>
   ```

## Running the Application

To start the server, run the following command:

```
npm run start
```

The server will start and listen on the specified port (default is 3000).

## Project Structure

- `src/app.ts`: Main application file that initializes the Express app and sets up middleware.
- `src/server.ts`: Starts the server and listens for incoming requests.
- `src/config/database.ts`: Contains the MongoDB connection logic.
- `src/controllers/index.ts`: Exports controller functions for handling API logic.
- `src/routes/index.ts`: Sets up the API routes and links them to controllers.
- `src/models/index.ts`: Defines Mongoose models for the database.
- `src/types/index.ts`: Contains TypeScript interfaces and types for type safety.

## License

This project is licensed under the MIT License.