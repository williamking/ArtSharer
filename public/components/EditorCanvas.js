var React = require("react");

var EditorCanvas = React.createClass({

    componentDidMount: function() {
        this.renderBackground();
        this.first = true;
        this.renderImage();
    },

    componentDidUpdate: function() {
        var image = this.props.image;
        this.first = false;
        this.renderImage();
    },

    renderBackground: function() {
        var context = this.getContext();
        context.save();
        context.fillStyle = 'black';
        context.fillRect(0, 0, this.props.width, this.props.height);
    },

    renderImage: function() {
        var context = this.getContext();
        var image = this.props.image;
        var that = this;
        image.onload = function(e) {
            var width = that.props.height * (image.width / image.height), height = that.props.height;
            var left = 0;
            if (width < that.props.width) left = (that.props.width - width) / 2;
            context.drawImage(image, left, 0, width, height);
            if (that.first) {
                that.props.imageOnload();
            }
        }
    },

    getContext: function() {
        return this.refs.canvas.getContext('2d');
    },
    
    render: function() {
        return(
            <canvas ref='canvas' width={this.props.width} height={this.props.height} />
        );
    }

});

module.exports = EditorCanvas;
