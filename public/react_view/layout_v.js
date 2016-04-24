"use strict";

var React = require("react");
var ReactDOM = require("react-dom");
require("../css/layout.css");

var Header = React.createClass({
	render:function() {
		return(
		<div className="ui top fixed menu">
			<a className="item" href="/">
				<img src="imgs/favicon.png"/>
			</a>
			<a className="item" href="/">
				<i className="home icon"/>
				Home
			</a>
			<a className="item" href="/personal_center">
				<i className="user icon"/>
				Personal Center
			</a>
			<div className="right menu">
				<a className="ui item" href="/login">
					<i className="sign in icon"/>
					Sign In
				</a>
			</div>
		</div>);
	}
});

var Footer = React.createClass({
	render: function() {
		return (
			<div className="ui basic center aligned segment">
				<a href="#">
					<i className="info icon"/>
					<span>About us</span>
				</a>
				<a href="#">
					<i className="comment icon"/>
					<span>Give us some advice</span>
				</a>
			</div>
		);
	}
});

$(function() {
	ReactDOM.render(<Header />, $("#header")[0], null);
	ReactDOM.render(<Footer />, $("#footer")[0], null);
});