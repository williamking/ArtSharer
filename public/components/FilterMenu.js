var React = require("react");
var FilterMenu = React.createClass({

    componentDidMount: function() {
        $(this.refs.menu).dropdown({
            action: 'hide'
        });
    },
    
    render: function() {
        var that = this;
        var items = this.props.filterItems.map(function(item, key) {
            return (<div className="item" key={key} onClick={that.handleClick(item.func)} >{item.name}</div>);
        });

        return (
            <div className="ui dropdown filter-menu" ref='menu'>
                <div className="text">Filters</div>
                <i className="dropdown icon"></i>
                <div className="menu transition hidden">
                    {items}
                </div>
            </div>
        );
    },

    handleClick: function(name) {
        var that = this;
        return function(e) {
            that.props.handleImageFilter(name);
        }
    }

});

module.exports = FilterMenu;
