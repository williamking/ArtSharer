/**
 * Created by zhoujihao on 16-3-21.
 */

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
                        <div className="content"><a href={"mailto:" + email}>{email}</a></div>
                    </div>
                    <div className="item">
                        <i className="linkify icon"/>
                        <div className="content"><a>https://github.com</a></div>
                    </div>
                </div>
                <hr/>
                <div id="sff_list" className="ui middle aligned animated relaxed divided list">
                    <div className="item">
                        <div className="content">
                            <a href="#mystars" className="header">My Stars</a>
                        </div>
                    </div>
                    <div className="item">
                        <div className="content">
                            <a href="#myfollower" className="header">My Follower</a>
                        </div>
                    </div>
                    <div className="item">
                        <div className="content">
                            <a href="#myfollowing" className="header">My Following</a>
                        </div>
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
                <div className="content">
                    <a className="header">My Artwork</a>
                    <div className="description">Artwork Description Here</div>
                </div>
                <div id="extra_content" className="extra content">
                    <div className="left floated">
                        <div className="ui label"><i className="star icon"/>20</div>
                        <div id="star_btn" className="ui basic label">
                            Star
                        </div>
                    </div>
                    <div className="right floated">
                        <span className="ui label"><i className="fork icon"/>15</span>
                        <div id="fork_btn" className="sf_btn ui basic label">
                            Fork
                        </div>
                    </div>
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

var MyStarsPanel = React.createClass({
    render: function() {
        return (
            <div id="mystars" className="ui stacked segment">
                <h2 className="ui header">My Stars</h2>
                <table className="ui celled table">
                    <thead>
                    <tr>
                        <th>Artwork Name</th><th>Author</th><th>Public Time</th><th>Category</th><th>And so on</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                    </tbody>
                </table>
            </div>
        );
    }
});

var MyFollowerPanel = React.createClass({
    render: function() {
        return (
            <div id="myfollower" className="ui stacked segment">
                <h2 className="ui header">My Follower</h2>
            </div>
        );
    }
});

var MyFollowingPanel = React.createClass({
    render: function() {
        return (
            <div id="myfollowing" className="ui stacked segment">
                <h2 className="ui header">My Following</h2>
            </div>
        );
    }
});

var PersonalCenter = React.createClass({
    render: function() {
        return (
            <div className="ui grid">
                <div className="four wide column">
                    <UserInfo />
                </div>
                <div className="twelve wide column">
                    <ArtworkPanel />
                    <MyStarsPanel />
                    <MyFollowerPanel />
                    <MyFollowingPanel />
                </div>
            </div>
        );
    }
});
$(function() {
    ReactDOM.render(<PersonalCenter />, $("#wrapper")[0], null);
});