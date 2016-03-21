/**
 * Created by zhoujihao on 16-3-21.
 */
"use strict";

var React = require("react");
var ReactDOM = require("react-dom");
require("../css/personal_center.css");

var UserInfo = React.createClass({
    render:function() {
        return (
            <div className="ui piled segment">
                <h2 className="ui header">My Profile</h2>
                <img className="ui bordered fluid rounded centered image" src="/imgs/avatar.gif" alt="user avatar"/>
                <div className="ui ul list">
                    <div className="item">
                        <i className="user icon"/>
                        <div className="content">User Name</div>
                    </div>
                    <div className="item">
                        <i className="marker icon"/>
                        <div className="content">GuangZhou China</div>
                    </div>
                    <div className="item">
                        <i className="mail icon"/>
                        <div className="content">user_name@qq.com</div>
                    </div>
                    <div className="item">
                        <i className="linkify icon"/>
                        <div className="content">https://github.com</div>
                    </div>
                </div>
            </div>
        );
    }
});

$(function() {
    ReactDOM.render(<UserInfo />, $("#left-side")[0], null);
    ReactDOM.render(<UserInfo />, $("#right-side")[0], null);
});