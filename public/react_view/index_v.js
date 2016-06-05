/**
 * Create by William on 16-4-28.
 */

var React = require('react');
var ReactDOM = require('react-dom');

require('../css/index.css');

var CurrentArtoworkList = React.createClass({

    getInitialState: function() {
        return {
            currentList: [
            {title:'work-1', created: '2016-12-13'},
            {title:'work-1', created: '2016-12-13'},
            {title:'work-1', created: '2016-12-13'},
            {title:'work-1', created: '2016-12-13'},
            {title:'work-1', created: '2016-12-13'}
            ]
        }
    },

    componentDidMount: function() {
        var url = '/handle_artwork_query_with_username';
        var queryForm = new FormData();
        queryForm.append('author', username);
        queryForm.append('startFrom', 1);
        queryForm.append('endAt', 5);
        this.serverRequest = $.ajax({
            url: url,
            method: 'POST',
            data: queryForm,
            contentType: false,
            processData: false
        })
        .done((function(list) {
            console.log(list);
            this.setState ({
                currentList: list
            });
        }).bind(this));
    },
    
    render: function() {
        var items = this.state.currentList.map(function(item, key) {
            var href = '/user/' + username + '/' + item.workTitle;
            return (
                <div className="item" key={key}>
                    <div className="content">
                        <a className="header" href={href}>{item.workTitle}</a>
                        <div className="description">Created at {item.createTime}</div>
                    </div>
                </div>
            );
        });
        var url = '/user/' + username + '/worklist';
        return (
            <div id="current-artworks">
                <header>
                    <h3 className="ui h3">Current Artworks</h3>
                    <button className="ui green button"><a href={url}>More...</a></button>
                </header>
                <div id="current-artworks-list" className="ui relaxed divided list">
                    {items}       
                </div>
            </div>
        );
    }
});

var UserInfo = React.createClass({
    render: function() {
        var createLink = '/user/' + username + '/artwork_create';
        var url = '/user/' + username;
        return (
            <div id="user-info">
                <div id="user-info-detail">
                    <div className="info-item">
                        <a className="io tag label">Name</a>
                        <p>William</p>
                    </div>
                    <div className="info-item">
                        <a className="io tag label">email</a>
                        <p>williamjwking@gmail.com</p>
                    </div>
                    <div className="info-item">
                        <a className="io tag label">description</a>
                        <p>A handsome boy</p>
                    </div>
                </div>
                <div id="user-link">
                    <button className="ui button red"><a href={createLink}>Create Artwork</a></button>
                    <button className="ui button orange"><a href={url}>My Personal Center</a></button>
                </div>
            </div>
        );
    }
});

var Artists = React.createClass({

    getInitialState: function() {
        return {
            userList: [
                { name: 'william', artworks: 100},
                { name: 'william', artworks: 100},
                { name: 'william', artworks: 100},
                { name: 'william', artworks: 100},
                { name: 'william', artworks: 100}
            ]
        }
    },

    render: function() {
        users = this.state.userList.map(function(item, key) {
            var url = '/user/' + item.name;
            return (
                <div className="item" key={key}>
                    <i className="large user middle aligned icon"></i>
                    <div className="content">
                        <a className="header" href={url}>item.name</a>
                        <div className="description">Has <span>{item.artworks}</span> artworks</div>
                    </div>
                </div>
            );
        });

        return (
            <div id="hot-artists">
                <header>
                    <h3 className="ui h3">Current Hot Artists(constrcting....)</h3>
                    <div className="ui search" id="user-search">
                        <input className="prompt" type="text" placeholder="Search Artists..."></input>
                        <i className="search icon" onClick={this.searchUser}></i>
                    </div>
                    <div className="ui relaxed divided list">
                        {users}                        
                    </div>
                </header>
            </div>
        );
    }
});

var Index = React.createClass({
    render: function() {
        return (
        <div id="index-main" className="ui internally celled grid">
            <div className="row">
                <div className="eight wide column">
                    <CurrentArtoworkList />
                </div>
                <div className="eight wide column">
                    <UserInfo />
                </div>
            </div>
            <div className="row" id="artists-row">
                <div className="sixteen wide column">
                    <Artists />
                </div>
            </div>
        </div>
        );
    }
});

ReactDOM.render(<Index />, $('#index-wrapper')[0], null);
