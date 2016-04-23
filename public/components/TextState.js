var React = require("react");
var ColorPicker = require("../libs/color-picker/ColorPicker.js");
require("../libs/color-picker/ColorPicker.css");

var TextState = React.createClass({

    getInitialState: function() {
        return {
            textValue: '',
            fontSize: 5,
            fontStyle: 'normal',
            fontFamily: 'sans-serif'
        };
    },

    componentDidMount: function() {
        var editor = this;
        var sizeFunc = function(that) {
            return function(value, text) {
                var state = that.state;
                state.fontSize = value;
                that.setState(state);
                that.handleTextUpdate();
            };
        }(this);

        var styleFunc = function(that) {
            return function(value, text) {
                var state = that.state;
                state.fontStyle = value;
                that.setState(state);
                that.handleTextUpdate();
            };
        }(this);

        var familyFunc = function(that) {
            return function(value, text) {
                var state = that.state;
                state.fontFamily = value;
                console.log(value);
                that.setState(state);
                that.handleTextUpdate();
            };
        }(this);

        if (true) {
            $("#font-size").dropdown({
                onChange: sizeFunc
            });
            $("#font-style").dropdown({
                onChange: styleFunc
            });
            $("#font-family").dropdown({
                onChange: familyFunc
            });
            this.colorPicker.addTo(document.getElementById('color-picker'));
            console.log("Add sucesss!");
            $("#color-picker").css("display", 'inline-block');
            this.colorPicker.listen(this.props.textColorListener);
        }
    },

    colorPicker: new ColorPicker.RGB_picker(50, 20),

    handleTextUpdate: function() {
        this.props.updateTextState(this.state.fontStyle, this.state.fontSize, this.state.fontFamily);
    },

    fontSize: [5, 7, 10, 14, 20, 28, 32],

    fontStyle: ['normal', 'italic', 'oblique'],

    fontFamily: ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy'],

    handleTextChange: function(e) {
        var state = this.state;
        state.textValue = e.target.value;
        this.setState(state);
        this.props.handleTextChange(this.props.editor, this.state.textValue, this);
    },

    clearText: function() {
        this.setState({
            textValue: ''
        });
    },

    render: function() {
            var that = this;
            var sizes = this.fontSize.map(function(size, key) {
                return (<div className="item font-size" key={key} data-value={size} >{size + 'px'}</div>);
            });
            var styles = this.fontStyle.map(function(font, key) {
                return (<div className="item font-style" key={key} data-value={font} >{font}</div>);
            });
            var families = this.fontFamily.map(function(family, key) {
                return (<div className="item font-family" key={key} data-value={family} >{family}</div>);
            });
            var value = this.state.textValue;
            return(
                <div id="button-state">
                <div className="ui input" id="text-input">
                    <input type='text' placeholder='Text content...' value={value} onChange={this.handleTextChange}></input>
                </div>
                <div className="ui dropdown filter-menu" id="font-size">
                    <div className="text">Text Size</div>
                    <i className="dropdown icon"></i>
                    <div className="menu">
                        {sizes}
                    </div>
                </div>
                <div className="ui dropdown filter-menu" id="font-style">
                    <div className="text">Text Font</div>
                    <i className="dropdown icon"></i>
                    <div className="menu">
                        {styles}
                    </div>
                </div>
                <div className="ui dropdown filter-menu" id="font-family">
                    <div className="text">Text Family</div>
                    <i className="dropdown icon"></i>
                    <div className="menu">
                        {families}
                    </div>
                </div>
                <div id="color-picker"></div>
                </div>
            );
    }

});

module.exports = TextState;
