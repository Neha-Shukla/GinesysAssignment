
# Dog Images API Documentation

*** I am adding images directly in uploads/dogs folder but in real scenerio need to use S3 bucket
*** Implemented - Swagger for documentation, written unit testcases, added authorization, added image compression, docker containerization

## Prerequisites
1. Install Node.js (https://nodejs.org/).
2. Install `npm` (comes with Node.js).

## Steps to Run the API
1. Clone the repository to your local machine.
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory.
   ```bash
   cd <project-directory>
   ```
3. Install dependencies.
   ```bash
   npm install
   ```
4. Create a `.env` file in the root of the project and configure the following variables:
   ```plaintext
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/dogImagesDB // your connection string
   JWT_SECRET=your-secret-key
   ```
5. Start the server.
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`.

## Accessing the API
### Using Swagger
1. Open your browser and navigate to `http://localhost:3000/api-docs`.
2. Use the Swagger UI to explore the API endpoints:
   - Generate and use a JWT token for authentication.
   - Test Upload, list, fetch, update, and delete dog images.

### Using Postman
1. Open Postman.
2. Create a new collection and add the following requests:

   #### 1. Generate JWT Token
   - **Method:** GET
   - **URL:** `http://localhost:3000/auth/token`
   - **Headers:** None
   - **Body:** any email id for now
   - **Response:** Use the `token` field in the response for the next steps.

   #### 2. Upload a Dog Image
   - **Method:** POST
   - **URL:** `http://localhost:3000/dogs`
   - **Headers:** 
     ```
     Authorization: Bearer <your-token>
     ```
   - **Body:** Form-data
     - Key: `dogImage` (type: file)
     - Value: Select an image file.
   - **Response:** Returns the uploaded image details.

   #### 3. Fetch All Dog Images
   - **Method:** GET
   - **URL:** `http://localhost:3000/dogs`
   - **Headers:** 
     ```
     Authorization: Bearer <your-token>
     ```

   #### 4. Fetch a Specific Dog Image
   - **Method:** GET
   - **URL:** `http://localhost:3000/dogs/{id}`
   - **Headers:** 
     ```
     Authorization: Bearer <your-token>
     ```

   #### 5. Update a Dog Image
   - **Method:** PUT
   - **URL:** `http://localhost:3000/dogs/{id}`
   - **Headers:** 
     ```
     Authorization: Bearer <your-token>
     ```
   - **Body:** Form-data
     - Key: `dogImage` (type: file)
     - Value: Select a new image file.

   #### 6. Delete a Dog Image
   - **Method:** DELETE
   - **URL:** `http://localhost:3000/dogs/{id}`
   - **Headers:** 
     ```
     Authorization: Bearer <your-token>
     ```

## Notes
1. Replace `{id}` in URLs with the actual ID of the dog image you want to fetch, update, or delete.
2. The uploaded images will be stored in the `uploads/` directory on your server.
3. Swagger UI provides a convenient way to explore and test the API endpoints.

## Troubleshooting
- Verify that the `.env` file contains correct values.
- Check the console logs for error details if any endpoint fails.
- If getting error port already in use, kill all ports and then retry eg. npx kill-port 3000


## For Docker
  ## Prerequisites
  - install docker and docker-compose

- docker-compose build
- docker-compose up
After testing http://localhost:3000 stop and remove container
- docker-compose down