"use strict";

var React = require("react");
var ReactDOM = require("react-dom");
require("../css/sign_in.css");


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

var EmailField = React.createClass({
    getInitialState: function() {
        return {
            ifError: ""
        };
    },
    handleChange: function(event) {
        if ($("#email").val() == "") {
            this.setState({ifError: " error"});
        } else {
            this.setState({ifError: ""});
        }
    },
    render: function() {
        return (
            <div className={"email field" + this.state.ifError}>
                <div className="ui left icon input">
                    <i className="mail icon" />
                    <input id="email" type="text" name="email" placeholder="E-mail Address" onChange={this.handleChange}/>
                </div>

            </div>
        );
    }
});

var UsernameField = React.createClass({
    getInitialState: function() {
        return {
            ifError: ""
        };
    },
    handleChange: function(event) {
        if ($("#username").val() == "") {
            this.setState({ifError: " error"});
        } else {
            this.setState({ifError: ""});
        }
    },
    render: function() {
        return (
            <div className = {"username field" + this.state.ifError}>
                <div className="ui left icon input">
                    <i className="user icon"/>
                    <input id="username" type="text" name="username" placeholder="User Name" onChange={this.handleChange}/>
                </div>
            </div>
        );
    }
});

var PasswordField = React.createClass({
    getInitialState: function() {
        return {
            ifError: ""
        };
    },
    handleChange: function(event) {
        if ($("#password").val() == "") {
            this.setState({ifError: " error"});
        } else {
            this.setState({ifError: ""});
        }
    },
    render: function() {
        return (
            <div className={"password field" + this.state.ifError}>
                <div className="ui left icon input">
                    <i className="lock icon" />
                    <input id="password" type="password" name="password" placeholder="Password" onChange={this.handleChange}/>
                </div>
            </div>
        );
    }
});

var DescriptionField = React.createClass({
    getInitialState: function() {
        return {
            ifError: ""
        };
    },
    handleChange: function(event) {
        if ($("#description").val() == "") {
            this.setState({ifError: " error"});
        } else {
            this.setState({ifError: ""});
        }
    },
    render: function() {
        return (
            <div className={"description field" + this.state.ifError}>
                <textarea id="description" name="description" rows="2" placeholder="Description of Yourself" onChange={this.handleChange}></textarea>
            </div>
        )
    }
});

var Modal = React.createClass({
    render: function() {
        return (
            <div id={this.props.id} className="ui small modal">
                <i className="close icon"/>
                <div className="header">{this.props.title}</div>
                <div className="actions">
                    <div className="ui positive button">OK</div>
                </div>
            </div>
        );
    }
});

var SignUpView = React.createClass({
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
                            prompt : 'Please enter your email'
                        },
                        {
                            type: 'email',
                            prompt: 'Your email is not valid'
                        }
                    ]
                },
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
                        },
                        {
                            type: "length[6]",
                            prompt: "Your password's length is less than 6"
                        }
                    ]
                },
                description: {
                    identifier	: 'description',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your description'
                        }
                    ]
                }
            }
        });
    },
    handleSubmit: function(event) {
        //console.log(event);
        event.preventDefault();
        if (!event.isDefaultPrevented()) {
            event.preventDefault();
        }
        var form = $("#form");
        var username = $("#username").val();
        var password = $("#password").val();
        var email = $("#email").val();
        var description = $("#description").val();

        form.addClass("error");
        if (username == "") {
            $(".username.field").addClass("error");
        }
        if (password == "") {
            $(".password.field").addClass("error");
        }
        if (email == "") {
            $(".email.field").addClass("error");
        }
        if (description == "") {
            $(".description.field").addClass("error");
        }
        if (!(username == "" || password == "" || email == "" || description == "")) {
            form.removeClass("error");
        }

        if (!form.hasClass("error")) {
            this.setState({btnState: " disabled loading"});

            $.ajax({
                type: "POST",
                async: true,
                url: "/handle_sign_up",
                data: {
                    username: username,
                    password: password,
                    email: email,
                    description: description
                },
                success: function(html, success, xhr) {
                    //console.log(arguments);
                    if (xhr.status == 200 && xhr.readyState == 4) {
                        console.log("Sign Up Success!");
                        $("#success-modal").modal("show");
                        $(".ui.blue.button").removeClass("disabled loading");
                    } else {
                        console.log("Error");
                    }
                },
                error: function(xhr) {
                    // console.log(xhr);
                    // alert(xhr.status + ": " + xhr.responseText);
                    $("#fail-modal").modal("show");
                    $(".ui.blue.button").removeClass("disabled loading");
                }
            });
        }
    },
    render: function() {
        return (
            <div className="column" >
                <LogoHeader src="/imgs/favicon.png" alt="logo" content="Create Your Account" />
                <form id="form" className="ui large form">
                    <div className="ui stacked segment">
                        <EmailField />
                        <UsernameField />
                        <PasswordField />
                        <DescriptionField />
                        <div className={"ui fluid large blue button" + this.state.btnState} onClick={this.handleSubmit}>
                            Sign Up
                        </div>
                    </div>
                    <div className="">
                        <ul className="list">
                        </ul>
                    </div>
                </form>

                <Modal id="success-modal" title="Sign Up Success!" />

                <Modal id="fail-modal" title="User Already Exist!" />
            </div>
        );
    }
});

$(function() {

    ReactDOM.render(<SignUpView />, $("#wrapper")[0], null);
});