var React = require("react");

var EraserState = React.createClass({

    handleSizeChange: function(value) {
        console.log(this);
        this.props.updateEraserState('width', value);
    },

    componentDidMount: function() {
        var handleSizeChange = this.handleSizeChange;
        $("#pen-size").dropdown({
            onChange: handleSizeChange   
        });
    },

    sizes: [5, 7, 10, 14, 20, 30],

    render: function() {
        var sizes = this.sizes.map(function(size, key) {
            return (<div className="item pen-size" key={key} data-value={size} >{size + 'px'}</div>);
        });
        return(
            <div id="button-state">
                <div className="ui dropdown filter-menu" id="eraser-size">
                    <div className="text">Size</div>
                    <i className="dropdown icon"></i>
                    <div className="menu">
                        {sizes}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = EraserState;
