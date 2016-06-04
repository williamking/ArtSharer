/**
 * Create by William on 16-4-28.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');

require('../css/artwork_list.css');

var ArtworkList = React.createClass({
    getInitialState: function() {
        var count;
        if (workCount % 10 == 0) count = workCount / 10;
        else count = workCount / 10 + 1;
        return {
            currentPage: 1,
            list: [],
            pages: count
        }
    },

    getPage: function(page) {
        var url = '/handle_artwork_query_with_username';
        var queryForm = new FormData();
        queryForm.append('author', username);
        queryForm.append('startFrom', (page - 1) * 10 + 1);
        queryForm.append('endAt', (page - 1) * 10 + 10);
        this.serverRequest = $.ajax({
            url: url,
            method: 'POST',
            data: queryForm,
            contentType: false,
            processData: false
        })
        .done((function(list) {
            this.setState ({
                list: list,
                currentPage: page
            });
        }).bind(this));
    },

    componentDidMount: function() {
        this.getPage(this.state.currentPage);
    },

    changePage: function(num) {
        this.getPage(num);
    },

    render: function() {
        var listUrl = '/user/' + username + '/worklist';
        return (
            <div id="artwork-list-page">
                <header className="ui header breadcrumb dividing">
                    <h1>
                    <a className="section" href="#">{username}</a>
                    <div className="divider"> / </div>
                    <a className="section" href={listUrl}>Artworks</a>
                    </h1>
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
            var createTime = moment(item.createTime).format('YYYY-MM-DD h:mm:ss');
            return (
                <div className="item artwork-item" key={key}>
                    <div className="content">
                        <a className="header" href={url} >{item.workTitle}</a>
                        <div className="description">Created at {createTime}</div>
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

    getInitialState: function() {
        return {
            active: 1
        }
    },

    produce: function(number, active) {
        var callback = (function(e) {
            e.currentTarget.classList.add('active');
            this.refs['page' + this.state.active].classList.remove('active');
            this.props.handleChange(number);
        }).bind(this);
        var ref = 'page' + number;
        if (active) {
            return (
                <a className="disable item" key={number} ref={ref}>
                {number}
                </a>
            );
        } else {
            return (
                <a className="item page-item" onClick={callback} key={number} ref={ref}>
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



