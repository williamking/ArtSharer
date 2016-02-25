var React = require('react');
var ReactCanvas = require('react-canvas');
var ReactDOM = require('react-dom');
var cssLayout = require('css-layout');

var Surface = ReactCanvas.Surface;
var Text = ReactCanvas.Text;
var Group = ReactCanvas.Group;
var FontFace = ReactCanvas.FontFace;

/*-----Load css-----*/
require('../css/imageEditor.css');

var ImageEditor = React.createClass({

    render: function() {
        var surfaceWidth = this.props.width;
        var surfaceHeight = this.props.height;
        var textStyle = {
            left: 0,
            width: window.innerWidth,
            height: 20,
            lineHeight: 20,
            fontSize: 12
        };
        var imageStyle = this.getImageStyle();
        var menuStyle = this.getMenuStyle();
        var divStyle={ width: surfaceWidth + 5 + 'px', height: surfaceHeight + 5 + 'px'};

        return (
            <div className="image-editor" style={divStyle} >
                <EditorMenu width={surfaceWidth} height={surfaceHeight * 0.05}/>
                <EditorCanvas width={surfaceWidth} height={surfaceHeight * 0.95} src={this.props.src} />
            </div>
        );
    },

    getSize: function() {
        return {
            width: this.props.width,
            height: this.props.height
        }
    },


    getMenuStyle: function() {
        var size = this.getSize();
        return {
            position: 'relative',
            width: size.width,
            height: size.height * 0.1,
            flex: 1,
            backgroundColor: '#f7f7f7',
        };
    },

    getImageGroupStyle: function() {
        return {
            position: 'relative',
            flex: 9,
            backgroundColor: '#eee'
        };
    },

    getImageStyle: function() {
        var size = this.getSize();
        return {
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
        };    
    }

}); 

var EditorMenu = React.createClass({

    render: function() {
        return(
            <Surface width={this.props.width} height={this.props.height} left={0} top={0} enableCSSLayout={true}>
                <Group style={this.getPageStyle()}>
                </Group>
            </Surface>
        );
    },

    getSize: function() {
        return {
            width: this.props.width,
            height: this.props.height
        }
    },

    getPageStyle: function() {
        var size = this.getSize();
        return {
            position: 'relative',
            padding: 0,
            width: size.width,
            height: size.height,
            backgroundColor: '#f7f7f7',
            flexDirection: 'column'
        };
    }

}); 

var EditorCanvas = React.createClass({

    image : new Image(),

    getInitialState: function() {
        return {
            imageSrc: this.props.src
        }
    },

    componentDidMount: function() {
        this.renderBackground();
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
        var image = this.image;
        image.src = this.state.imageSrc;
        var that = this;
        image.onload = function(e) {
            var width = that.props.height * (image.width / image.height), height = that.props.height;
            var left = 0;
            if (width < that.props.width) left = (that.props.width - width) / 2;
            context.drawImage(image, left, 0, width, height);
        }
    },

    getContext: function() {
        return this.refs.canvas.getContext('2d');
    },
    
    render: function() {
        return(
            <canvas ref='canvas' imageSrc={this.state.imageSrc} width={this.props.width} height={this.props.height} />
        );
    }

});

window.onload = function() {
    ReactDOM.render(
        <div>
            <ImageEditor width={1200} height={800} src="/imgs/test.jpg"/>,
        </div>,
        document.getElementById("main")
    );
}();
