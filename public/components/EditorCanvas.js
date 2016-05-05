var React = require("react");

var EditorCanvas = React.createClass({

    getInitialState: function() {
        return {
            data: ''
        }
    },

    componentDidMount: function() {
        this.renderBackground();
        this.first = true;
        this.renderImage();
    },

    getData: function(callback) {
        var canvas = this.refs.canvas;
        var data = canvas.toDataURL('image/jpeg');
        var arr = data.split(','), bin = atob(arr[1]);
        var buffer = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; ++i) {
            buffer[i] = bin.charCodeAt(i);
        }
        callback(new Blob([buffer.buffer], {type:'image/jpeg'}));
    },

    componentDidUpdate: function() {
        var image = this.props.image;
        this.first = false;
        this.renderImage();
    },

    renderBackground: function() {
        var context = this.getContext();
        context.save();
        context.fillStyle = '#FFF';
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
            context.rect(left, 0, width, height);
            context.clip();
            context.save();
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
