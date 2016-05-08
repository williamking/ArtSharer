var React = require("react");

require('../css/editor_canvas.css');

var EditorCanvas = React.createClass({

    getInitialState: function() {
        return {
            data: '',
            height: this.props.height,
            width: this.props.width
        }
    },

    componentDidMount: function() {
        this.renderBackground();
        this.first = true;
        this.renderImage();
    },

    getData: function(callback) {
        var canvas = this.refs.canvas, context = canvas.getContext('2d');

        var w = this.props.image.width, h = this.props.image.height; 

        var imgData = context.getImageData(this.left, this.top, w, h);
        var retCanvas = document.createElement('canvas');
        retCanvas.width = w;
        retCanvas.height = h;
        retCanvas.getContext('2d').putImageData(imgData, 0, 0);

        var data = retCanvas.toDataURL('image/jpeg');
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
        context.fillStyle = 'white';
        context.fillRect(0, 0, this.state.width, this.state.height);
    },

    renderImage: function() {
        var context = this.getContext();
        var image = this.props.image;
        var that = this;
        image.onload = function(e) {
            var w = image.width, h = image.height;
            if (h > that.state.height) {
                that.setState({
                    height: h
                });
            }
            if (w > that.state.width) {
                that.setState({
                    width: w
                });
            }
            var left = (that.state.width - w) / 2,
                top = (that.state.height - h ) / 2;
            that.left = left;
            that.top = top;
            context.drawImage(image, left, top, w, h);
            context.rect(left, top, w, h);
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
            <canvas className="editor-canvas" ref='canvas' width={this.state.width} height={this.state.height} />
        );
    }

});

module.exports = EditorCanvas;
