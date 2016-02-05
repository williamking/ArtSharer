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
- react/JSX for server side rendering
- nodejs/express to establish a MVC framework for the app
- MongoDB as the Database

### Src Structure
- public/ (static file, front-end)
	- dist/ (minified css and js for distribution)
	- scss/
	- js/
	- libs/ (front-end library)
	- imgs/
- router/
- controller/
- model/
- view/ (jade files)
	- includes/
	- pages/
	- layout.jade
	- and so on
- node modules/ (npm packages)
- app.js (app entrance)
- gulpfile.js
- package.json

### Current Mission
- UI Design (Jiawei)
- API and DataStructure Design (Yifan)
- Simple Coding Structure of express and react (Jihao)	