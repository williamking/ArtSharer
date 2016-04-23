var React = require("react");
var ColorPicker = require("../libs/color-picker/ColorPicker.js");
var TextState = require("./TextState.js");
var PenState = require("./PenState.js");
var EraserState = require("./EraserState.js");
require("../libs/color-picker/ColorPicker.css");

var ButtonState = React.createClass({

    render: function() {
        if (this.props.tool == 'text') {
            return(
                <div className="text-state button-state">
                    <TextState editor={this.props.editor} updateTextState={this.props.updateTextState} handleTextChange={this.props.handleTextChange}
                    textColorListener={this.props.textColorListener} />
                </div>
            );
        }
        if (this.props.tool == 'pen') {
            return(
                <div className="pen-state button-state">
                    <PenState updatePenState={this.props.updatePenState} />
                </div>
            );
        };
        if (this.props.tool == 'eraser') {
            return(
                <div className="eraser-state button-state">
                    <EraserState updateEraserState={this.props.updateEraserState} />
                </div>
            );
        }
        return (
            <div className="other">
            </div>
        );
    }

});

module.exports = ButtonState;
