/**
 * Create by William on 16-4-28.
 */

var React = require('react');
var ReactDOM = require('react-dom');

require('../css/artwork_list.css');

var ArtworkList = React.createClass({
    getInitialState: function() {
        return {
            currentPage: 1,
            list: [],
            pages: 1
        }
    },

    getPage: function() {
        var url = '/handle_artwork_query_with_username';
        var queryForm = new FormData();
        queryForm.append('author', username);
        queryForm.append('startFrom', (this.state.page - 1) * 10 + 1);
        queryForm.append('endAt', (this.state.page - 1) * 10 + 10);
        this.serverRequest = $.ajax({
            url: url,
            method: 'POST',
            data: queryForm,
            contentType: false,
            processData: false
        })
        .done((function(list) {
            this.setState ({
                list: list
            });
        }).bind(this));
    },

    componentDidMount: function() {
        this.getPage();
    },

    componentDidUpdate: function() {
        //this.getPage();
    },

    changePage: function(num) {
        this.setState({
            currentPage: num
        });
        this.getPage();
    },

    render: function() {
        var listUrl = '/user/' + username + '/worklist';
        return (
            <div id="artwork-list-page">
                <header className="ui header breadcrumb">
                    <a className="section" href="#">{username}</a>
                    <div className="divider"> / </div>
                    <a className="section" href={listUrl}>Artworks</a>
                </header>
                <ArtworkPage list={this.state.list} />
                <PageNav num={this.state.pages} active={this.state.currentPage} handleChange={this.changePage} />
            </div>
        );
    }
});
            
var ArtworkPage = React.createClass({
    render: function() {
        var items = this.props.list.map(function(item, key) {
            var url = '/user/' + username + '/' + item.workTitle;
            return (
                <div className="item" key={key}>
                    <div className="content">
                        <a className="header" href={url} >{item.workTitle}</a>
                        <div className="description">Created at {item.creatTime}</div>
                    </div>
                </div>
            );
        });
        return (
            <div className="artwork-page ui relaxed divided list">
                {items}
            </div>
        );
    }
});

var PageNav = React.createClass({

    produce: function(number, active) {
        var callback = (function() {
            this.props.handleChange(number);
        }).bind(this);
        if (active) {
            return (
                <a className="disable item" key={number}>
                {number}
                </a>
            );
        } else {
            return (
                <a className="item page-item" onClick={callback} key={number}>
                {number}
                </a>
            );
        }
    },

    render: function() {
        var items = [];
        for (var i = 1; i <= this.props.num; ++i) {
            var active = false;
            if (i == this.props.active) active = true;
            items.push(this.produce(i, active));
        }
        return (
            <div id="pagination-wrapper">
                <div className="ui pagination menu center aligned middle grid" id="page-nav">
                    {items}
                </div>
            </div>
        );
    }
});

ReactDOM.render(<ArtworkList />, $("#artwork-list")[0], null);



