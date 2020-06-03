## EnTrack App

Link to live site: https://entrack-app.now.sh/
Link to Client repo: https://github.com/antonibrivera/entrack-app-client

### How to Use the API

The API itself runs on the root endpoint as follows: https://secret-cove-63111.herokuapp.com/
There are 3 main paths to interact with. The '/tasks' and '/preset-tasks' routes are the routes to interact with to get set tasks that are left to complete along with preset tasks to choose from to set as a task. The '/auth' route is made to interact with the user through authentication.

Making a GET request on the 'tasks' routes will return a list of tasks.
Making a GET request to a '/(tasks)/:id' route will return an individual task.
A POST request on the 'tasks' routes will add a new task to the database.
Making a PATCH request to a '/(task)/:id' route will update the task with the given ID.
Finally, a DELETE request to a '/(task)/:id' route will delete the given task.

A POST request to '/auth/login' will return a JSON Web Token to be stored in the user's browser for authentication.
A GET request to '/auth/user' will return the current user's first and last name to be used in the greeting on the dashboard.

All of the '/tasks' and '/preset-tasks' routes are protected endpoints, so a user must be logged in to their own account to access any information from the database.

### Screenshots

![EnTrack_App5](https://user-images.githubusercontent.com/26678591/83586650-04b6a480-a51b-11ea-80fb-090167b4dc77.png)
![EnTrack_App3](https://user-images.githubusercontent.com/26678591/83586664-113afd00-a51b-11ea-9428-90a97d0f9056.png)
![EnTrack_App1](https://user-images.githubusercontent.com/26678591/83586568-d5079c80-a51a-11ea-8193-7051473b68da.png)
![EnTrack_App2](https://user-images.githubusercontent.com/26678591/83586589-e2bd2200-a51a-11ea-9edb-dbee3fa4380a.png)
![EnTrack_App4](https://user-images.githubusercontent.com/26678591/83586684-1f891900-a51b-11ea-963c-7efb91a037e6.png)

### Summary

EnTrack was made to help business owners and entrepreneurs keep track of the time they have to work. Part of owning your own business is making your own schedule, but it's not always easy to know exactly how many hours of work you need to put in. With EnTrack, you can create tasks and give them a total amount of time it takes to complete it. You can also create new or select from a list of preset tasks you know you always have to get done. Instead of typing in the same task every time, you can pick a task and it's date to get done. Each day you'll get a summary of the total hours to work for that day and you can filter your list of tasks to today's tasks or all your tasks.

### Technologies Used

- HTML/JSX
- CSS
- JavaScript
- React.js
- Node.js
- Express.js
- PostgreSQL
