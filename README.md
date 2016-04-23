# ArtSharer

ArtSharer is an application for sharing image/picture work among different users.



### App Function
- user sign in/sign up
- user create and upload his image work
- user edit his own work by a simple online image processor
- user can follow other users and make comment on their work
- user can fork other's work and also pull request


### Technology Stack
- (jade，sass，jquery，gulp) (optional)
- react for view layer
- webpack as the module bundler
- nodejs/express to establish a MVC framework for the app
- MongoDB as the Database

### Src Structure
- public/ (static file, front-end)
	- dist/ (minified css and js for distribution)
	- scss(css)/
	- js/
	- libs/ (front-end library)
	- imgs/
	- react_view(js:control the view layer using react)
- router/
- controller/
- model/
- views/ (jade files)
	- includes/
	- pages/
	- layout.jade
	- and so on
- node modules/ (npm packages)
- app.js (app entrance)
- gulpfile.js
- package.json
- webpack.config.js

### How To Run
1. sudo npm install
2. In one terminal:  **gulp**
3. In another terminal:  **node app.js**
4. localhost:3000/sign_in

### Current Mission
- UI Design (Jiawei)
- API and DataStructure Design (Yifan)
- Simple Coding Structure of express and react (Jihao)	