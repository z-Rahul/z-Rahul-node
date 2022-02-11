# Welcome to Round 3 of your NodeJS Interview
# ![Codebuddy Pvt. Ltd. Round 3 Interview](https://codebuddy.co/assets/img/logo.png)

> This round is to test your **Debugging capabilities, Code optimization skills and Code quality** in a real world application.

> This repo uses express js and mongooose to create a backend server and perform DB(MongoDB) operations.

> **_Please read the below instructions carefully_**

# Tasks
1. `npm run seeder` creates 100 users and 2 posts per user. Find out why this is not working, fix the seeder and seed data.


2. `[POST] http://localhost:3000/posts` with data 
    ``` json
    {
        "userId": "{userId}",
        "title": "Post Title",
        "description": "Post description"
    }
    ``` 

    **Should create a post and return the newly created post in the response. Validate userId, title, description. Validation criteria:**
    1. userId must be a valid ObjectId
    2. title must be a string and minimum of 10 characters after trimming
    3. description must be a string and minimum of 50 characters after trimming

    **Success response should be in the format:**
    ``` json
    {
        "data": {
            "_id": "{ObjectId}",
            "userId": "{userId}",
            "title": "Post Title",
            "description": "Post description"
        }
    }
    ```
    **Error response should be in the format:**
    ``` json
    {
        error: "Error message"
    }
    ```

3. `[GET] http://localhost:3000/users` is an existing API that is used in front-end to show list of all users with their post count. Optimize the API to achieve minimum execution time and smallest load on server. You can introduce additional parameters in the request to restrict and control your result set.