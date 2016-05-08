/**
 * Create by William on 16-4-28.
 */

var React = require('react');
var ReactDOM = require('react-dom');

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
    },

    render: function() {
        return (
            <div id="artwork-list-page">
                <header className="uio dividing header">
                    <h1>{username}/Artworks</h1>
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
            return (
                <div className="item" key={key}>
                    <div className="content">
                        <a className="header">{item.title}</a>
                        <div className="description">Created at {item.created}</div>
                    </div>
                </div>
            );
        });
        return (
            <div className="artwork-page">
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
                <a className="active item" key={number}>
                {number}
                </a>
            );
        } else {
            return (
                <a className="item" onClick={callback} key={number}>
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
            <div className="ui pagination menu">
                {items}
            </div>
        );
    }
});

ReactDOM.render(<ArtworkList />, $("#artwork-list")[0], null);



