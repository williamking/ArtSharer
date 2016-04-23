var React = require("react");
var ColorPicker = require("../libs/color-picker/ColorPicker.js");
require("../libs/color-picker/ColorPicker.css");

var PenState = React.createClass({

    handleSizeChange: function(value) {
        console.log(this);
        this.props.updatePenState('size', value);
    },

    handleColorChange: function(value) {
        this.props.updatePenState('color', value);
    },

    componentDidMount: function() {
        var handleSizeChange = this.handleSizeChange;
        $("#pen-size").dropdown({
            onChange: handleSizeChange   
        });

        this.colorPicker.addTo(document.getElementById('color-picker')); 
        this.colorPicker.listen(this.handleColorChange);
        $("#color-picker").css("display", "inline-block");
    },

    sizes: [5, 7, 10, 14, 20, 30],

    colorPicker: new ColorPicker.RGB_picker(50, 20),

    render: function() {
        var sizes = this.sizes.map(function(size, key) {
            return (<div className="item pen-size" key={key} data-value={size} >{size + 'px'}</div>);
        });
        return(
            <div id="button-state">
                <div className="ui dropdown filter-menu" id="pen-size">
                    <div className="text">Size</div>
                    <i className="dropdown icon"></i>
                    <div className="menu">
                        {sizes}
                    </div>
                </div>
                <div id="color-picker"></div>
            </div>
        );
    }
});

module.exports = PenState;
