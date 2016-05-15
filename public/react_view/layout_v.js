"use strict";

var React = require("react");
var ReactDOM = require("react-dom");
require("../css/layout.css");

var Header = React.createClass({
	getInitialState: function() {
		return null;
	},
	componentDidMount: function() {
		if (username != "") {
			$("#header_sign_in").hide();
			$("#header_sign_out").show();
			$("#header_user").show();
			$("#header_pc").show();
		} else {
			$("#header_sign_in").show();
			$("#header_sign_out").hide();
			$("#header_user").hide();
			$("#header_pc").hide();
		}
	},
	render:function() {
		return(
			<div className="ui top fixed menu">
			<a className="item" href="/">
			<img src="/imgs/favicon.png"/>
			</a>
			<a className="item" href="/">
			<i className="home icon"/>
			Home
			</a>
			<a id="header_pc" className="item" href={"/user/" + username}>
			<i className="user icon"/>
			Personal Center
		</a>
		<div className="right menu">
			<a id="header_sign_in" className="ui item" href="/login">
			<i className="sign in icon"/>
			Sign In
		</a>
		<a id="header_user" className="ui item" href={"/user/" + username}>
			<i className="user icon"/>
			{username}
			</a>
			<a id="header_sign_out" className="ui item" href="/logout">
			<i className="sign out icon"/>
			Sign Out
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