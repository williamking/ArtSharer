/**
 * Created by zhoujihao on 16-3-21.
 */

var React = require("react");
var ReactDOM = require("react-dom");

require("../css/personal_center.css");

var UserInfo = React.createClass({
    render:function() {
        return (
            <div className="ui segment" id="user-info">
                <div id="simple-info">
                    <h2 className="ui header">
                        <img id="avatar" src="/imgs/avatar.jpg" alt="user avatar"/>
                        <div className="content">
                            {username}
                            <div id="description">{'\"' + descript + '\"'}</div>
                        </div>
                    </h2>
                </div>
                <hr/>
                <div className="ui horizontal list">
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
                        <div className="content">
                            <a> My Homepage </a>
                        </div>
                    </div>
                </div>
                <hr/>
                <div id="sff-list" className="ui horizontal list">
                    <div className="item">
                        <div className="content">
                            <a href="#myartworks">My Artworks</a>
                        </div>
                    </div>
                    <div className="item">
                        <div className="content">
                            <a href="#mystars">My Stars</a>
                        </div>
                    </div>
                    <div className="item">
                        <div className="content">
                            <a href="#myfollower">My Follower</a>
                        </div>
                    </div>
                    <div className="item">
                        <div className="content">
                            <a href="#myfollowing">My Following</a>
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
                    <div className="header">
                        <i className="camera retro icon"/>&nbsp;
                        <a href={this.props.href}>{this.props.item.workTitle}</a>
                    </div>
                    <div className="description">
                        <p>Artwork Description Here</p>
                    </div>
                    <div className="meta">
                        <p className="">Created By <span>{this.props.item.author}</span></p>
                        <p className="">Create Time: <span>{this.props.item.createTime}</span></p>
                        <p className="">Last Modified: <span>{this.props.item.lastModified}</span></p>

                    </div>
                </div>
                <div className="extra content">
                    <div className="left floated">
                        <div className="ui label"><i className="star icon"/>20</div>
                        <div id="" className="ui basic label star_btn">
                            Star
                        </div>
                    </div>
                    <div className="left floated">
                        <span className="ui label"><i className="fork icon"/>15</span>
                        <div id="" className="sf_btn ui basic label fork_btn">
                            Fork
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var ArtworkPanel = React.createClass({
    getInitialState: function() {
        return {
            currentList: []
        }
    },
    componentDidMount: function() {
        var url = "/handle_artwork_query_with_username";
        var queryForm = new FormData();
        queryForm.append('author', username);
        queryForm.append('startFrom', 1);
        queryForm.append('endAt', 9999);
        $.ajax({
            url: url,
            method: 'POST',
            data: queryForm,
            contentType: false,
            processData: false
        }).done(function(list) {
            console.log(list);
            this.setState({
                currentList: list
            });
        }.bind(this));
    },
    render: function() {
        var artworkItems = this.state.currentList.map(function(item, key) {
            var href = '/user/' + username + '/' + item.workTitle;
            return (
                <ArtworkItem key={key} item={item} href={href}/>
            );
        });
        return (
            <div id="myartworks" className="ui segment">
                <h2 className="ui header">My Artworks</h2>
                <div className="ui three stackable cards">
                    {artworkItems}
                </div>
            </div>
        );
    }
});

var MyStarsPanel = React.createClass({
    render: function() {
        return (
            <div id="mystars" className="ui segment">
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
            <div className="ui grid" id="personal-center">
                <div className="row"><UserInfo /></div>
                <div className="row"><ArtworkPanel /></div>
                <div className="row"><MyStarsPanel /></div>
                <div className="row"><MyFollowerPanel /></div>
                <div className="row"><MyFollowingPanel /></div>
            </div>
        );
    }
});
$(function() {
    ReactDOM.render(<PersonalCenter />, $("#wrapper")[0], null);
});
