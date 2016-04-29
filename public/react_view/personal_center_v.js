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

                <img className="ui bordered fluid rounded centered image" src="/imgs/avatar.gif" alt="user avatar"/>
                <h2 className="ui header">
                    <div className="content">{username}</div>
                </h2>
                <hr/>
                <div className="ui relaxed ul list">
                    <div className="item">
                        <i className="marker icon"/>
                        <div className="content">GuangZhou China</div>
                    </div>
                    <div className="item">
                        <i className="mail icon"/>
                        <div className="content"><a>user_name@qq.com</a></div>
                    </div>
                    <div className="item">
                        <i className="linkify icon"/>
                        <div className="content"><a>https://github.com</a></div>
                    </div>
                </div>
                <hr/>
                <div className="ui two column grid">
                    <div className="center aligned column">
                        <a className="ui basic button">20 Followers</a>
                    </div>
                    <div className="center aligned column">
                        <a className="ui basic button">34 Following</a>
                    </div>
                </div>
            </div>
        );
    }
});

var ArtworkItem = React.createClass({
    render: function() {
        return (
            <div className="card">
                <div className="image">
                    <img className="ui bordered rounded centered image" src="/imgs/avatar.gif"/>
                </div>
                <div className="content">
                    <a className="header">My Artwork</a>
                    <div className="description">Artwork Description Here</div>
                </div>
                <div className="extra content">
                    <span className="left floated">
                        <span className="ui label">20</span>
                        <i className="star icon"></i>
                        <a>Star</a>
                    </span>
                    <span className="right floated">
                        <span className="ui label">15</span>
                        <i className="fork icon"></i>
                        <a>Fork</a>

                    </span>
                </div>
            </div>
        );
    }
});

var ArtworkPanel = React.createClass({
    render: function() {
        return (
            <div className="ui stacked segment">
                <h2 className="ui header">My Artwork List</h2>
                <div className="ui three stackable cards">
                    <ArtworkItem />
                    <ArtworkItem />
                    <ArtworkItem />
                    <ArtworkItem />
                    <ArtworkItem />
                </div>
            </div>
        );
    }
});

$(function() {
    ReactDOM.render(<UserInfo />, $("#left-side")[0], null);
    ReactDOM.render(<ArtworkPanel />, $("#right-side")[0], null);
});
