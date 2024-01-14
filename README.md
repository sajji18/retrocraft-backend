
# RetrocraftHub
RetrocraftHub is a platform for professional networking and job seeking made with MERN Stack. Some of it's key features are: 
* Authentication: The users consists of two types -  Freelancers (Job Seekers) and Producers (Job Providers). The authentication takes place with issuing of JSON Web tokens, which serves as the identity of the authenticated user.
* Routes Protection: It is ensured that the freelancers and producers cannot access each others routes, as well as an unauthorized user cannot access the routes created for authenticated users.
* Freelancer Dashboard: It is the default landing page for a freelancer. It displays all the Job Posts created by other producer, the pending connection requests, the Jobs applied by the freelancer and some random blog posts. 
* Producer Dashboard: It is the default landing page for a producer. It displays all the Job Posts created by the logged in producer with option to view the detailed view as well as the applicants who have applied for the job, the pending connection requests, and a form to Create New Job posts.
* Job Post Detail View: This View differs for the Job Owner, a Freelancer and a Producer who is not the Job Owner. The Owner view the Preview/Edit View of this Post, the Freelancers and other Producers view the notice like display, in addition the freelancers have an apply button to apply for the Job.
* Profile Detail View: This View is again separate for Profile Owner and Other Users. The Profile Owner views the Preview/Edit View of the profile page, while others have access to notice-like view.
* Connection: Freelancers and Producers can connect between one another. The Connection request will sent using the connect button on the profile page of the other user. Once request is sending the button is disabled with 'pending' display, and upon acceptance of the request by the receiver, freelancer or producer are added to each others freelancer-connections and producer-connections respectively. (Only the backend is created for now for this one)  
## Frontend
### Technologies used
* [ReactJS](https://react.dev/): React is the library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript.
* [Material UI](https://mui.com/material-ui/) is an open-source React component library that implements Google's Material Design
* [React Router Dom](https://reactrouter.com/en/main) is used to build single-page applications i.e. applications that have many pages or components but the page is never refreshed instead the content is dynamically fetched based on the URL.
### Installation
* First ensure you have NodeJS installed in your computer. If not, you can get [here](https://nodejs.org/en/)).
* Clone The Frontend-Repository on your local machine: 
    ```bash
    $ git clone https://github.com/sajji18/retrocraft-frontend.git
    ```
* #### Dependencies
    1. Install all the npm packages. Go into the project    folder and type the following command to install all npm packages
        ```bash
            $ npm install
        ```
    2. In order to run the application, Type the following command
        ```bash
            $ npm run dev
        ```
* #### Run It
    You can now access the file api service on your browser by using
    ```
        http://localhost:5173/
    ```
## Backend
### Technologies Used
* [Node.js](https://nodejs.org/en) is an open-source, cross-platform JavaScript runtime environment.
* [Express.js](https://expressjs.com/) is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
* [MongoDB](https://www.mongodb.com/) MongoDB is a source-available, cross-platform, document-oriented database program.
### Installation
* First ensure you have NodeJS installed in your computer. If not, you can get [here](https://nodejs.org/en/)).
* Clone The Backend-Repository on your local machine: 
    ```bash
    $ git clone https://github.com/sajji18/retrocraft-backend.git
    ```
* #### Dependencies
    1. First change the current directory to the root directory which consists of the index.js
        ```bash
            $ cd backend/
        ```
    2. Install all the npm packages. Go into the project    folder and type the following command to install all npm packages
        ```bash
            $ npm install
        ```
* #### Run It
    You can start the backend server using the following command on localhost:3000 - 
    ```bash
        $ node index.js
    ```
## Video Demonstration
* Click on the following link to access the video demonstration: [Video Link](https://drive.google.com/drive/u/1/folders/1BHauXEPc24btMv8Qt1ahxvFsouChOQKs)
## Challenges Faced
* Implementation of Protection/Segregation of Routes: Based on Authentication as well as User Roles
* Integrating Connection Feature in the frontend
* Creating Database Schemas, as well as referencing one another in order to achieve required functionalities

## Future Scope of the Project
* Messaging Utility between Connected Users
* Channeli Login For Freelancers (PS: Project was not approved :( )

Sajal Chauhan :D
