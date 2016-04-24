"use strict";

var React = require("react");
var ReactDOM = require("react-dom");
require("../css/signin.css");

var AccountField = React.createClass({
	getInitialState: function() {
		return {
			value: ""
		}
	},
	handleChange: function(event) {
		this.setState({
			value: event.target.value
		})
	},
	render: function() {
		var value = this.state.value;
		return (
			<div className="field">
				<div className="ui left icon input">
					<i className="user icon" />
					<input id="account_field" type="text" name="email" placeholder="E-mail Address" onChange={this.handleChange} value={value}/>
				</div>
				<div className="ui message">Account: {value}</div>
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
				email: {
					identifier	: 'email',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please enter your e-mail'
						},
						{
							type   : 'email',
							prompt : 'Please enter a valid e-mail'
						}
					]
				},
				password: {
					identifier  : 'password',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please enter your password'
						},
						{
							type   : 'length[6]',
							prompt : 'Your password must be at least 6 characters'
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
						<AccountField />
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
					<a href="#">Sign Up</a>
				</div>
			</div>
		);
	}
});



window.onload = function() {
	ReactDOM.render(<SignInView />, $("#wrapper")[0]);
}();