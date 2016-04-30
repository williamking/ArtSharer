/**
 * Create by William on 16-4-28.
 */

var React = require('react');
var ReactDOM = require('react-dom');

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
    
    render: function() {
        var items = this.state.currentList.map(function(item, key) {
            return (
                <div className="item">
                    <div className="content">
                        <a className="header">{item.title}</a>
                        <div className="description">Created at {item.created}</div>
                    </div>
                </div>
            );
        };
        return (
            <div id="current-artworks">
                <header>
                    <h3 className="ui h3">Current Artworks</h3>
                    <button className="ui green button"></button>
                </header>
                <div id="current-artworks-list" className="ui relaxed divided list">
                    {items}       
                </div>
            </div>
        );
    }
});


