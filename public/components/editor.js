var React = require('react');
vasr ReactCanvas = require('react-canvas');

var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;

var ImageEditor = React.createClass({

    render: function() {
        var surfaceWidth = this.props.width;
        var surfaceHeight = this.props.height;

        return (
            <Surface width={surfaceWidth} height={surfaceHeight} left={0} top={0}>
                <Text>233333</Text>
            </Surface>
        );
    }

}); 

React.render(
    <ImageEditor width="400px" height="400px" />
);
