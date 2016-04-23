"use strict";

var React = require("react");
var ReactDOM = require("react-dom");
require("../css/sign_in.css");

var UserNameField = React.createClass({
	render: function() {
		return (
			<div className="field">
				<div className="ui left icon input">
					<i className="user icon" />
					<input id="account_field" type="text" name="username" placeholder="User Name" />
				</div>

			</div>
		);
	}
});

var PasswordField = React.createClass({
	render: function() {
		return (
			<div className="field">
				<div className="ui left icon input">
					<i className="lock icon" />
					<input id="password_field" type="password" name="password" placeholder="Password"/>
				</div>
			</div>
		);
	}
});

var LogoHeader = React.createClass({
	render: function() {
		return (
			<h2 className="ui blue image header">
				<img className="image" src={this.props.src} alt={this.props.alt} />
				<div className="content">{this.props.content}</div>
			</h2>
		);
	}
});

var SignInView = React.createClass({
	getInitialState: function() {
		return {
			btnState: ""
		}
	},
	componentDidMount: function() {
		$('#form').form({
			fields: {
				username: {
					identifier	: 'username',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please enter your username'
						}
					]
				},
				password: {
					identifier  : 'password',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please enter your password'
						}
					]
				}
			}
		});
	},
	handleSubmit: function(event) {

		if (!$("#form").hasClass("error")) {
			this.setState({btnState: " disabled loading"});
		}
	},
	render: function() {
		return (
			<div className="column" >
				<LogoHeader src="/imgs/favicon.png" alt="logo" content="Sign In To Your Account" />
				<form id="form" method="POST" action="/handle_login" className="ui large form">
					<div className="ui stacked segment">
						<UserNameField />
						<PasswordField />
						<div className={"ui fluid large blue submit button" + this.state.btnState} onClick={this.handleSubmit}>
						Sign In
						</div>
					</div>
					<div className="ui error message">
						<ul className="list">
						</ul>
					</div>		
				</form>
				<div className="ui message">
					New to us?&nbsp;
					<a href="/signup">Sign Up</a>
				</div>
			</div>
		);
	}
});

$(function() {
	ReactDOM.render(<SignInView />, $("#wrapper")[0], null);
});