var React = require('react');
var ReactCanvas = require('react-canvas');
var ReactDOM = require('react-dom');
var cssLayout = require('css-layout');

var Surface = ReactCanvas.Surface;
var Text = ReactCanvas.Text;
var Group = ReactCanvas.Group;
var FontFace = ReactCanvas.FontFace;
var CImage = ReactCanvas.Image;

/*-----Load JS------*/
require('../libs/alloyimage-1.1.js');
require('../libs/semantic/components/dropdown.min.js');

/*-----Load css-----*/
require('../css/imageEditor.css');
require('../icons/editor/iconfont.css');
require('../libs/semantic/components/dropdown.min.css');

var ImageButton = React.createClass({

    render: function() {
        var className = 'iconfont icon-' + this.props.name;
        return (
            <div style={this.getButtonStyle()} className="my-icon" onClick={this.props.handleClick} >
               <i className={className}></i> 
            </div>
        );
    },

    getButtonStyle: function() {
        var height = this.props.size;
        var width = this.props.size;
        return {
            position: 'relative',
            width: width,
            height: height
        };
    },

    getImageStyle: function() {
        return {
            position: 'relative',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            height: this.props.size,
            width: this.props.size
        };
    }

});

var ImageEditor = React.createClass({

    getInitialState: function() {
        var image = new Image();
        image.src = this.props.src;
        return {
            image: image,
            tool: 'pen'
        }
    },

    componentDidMount: function() {
        this.canvas = ReactDOM.findDOMNode(this.refs.canvas);
        this.updateCursor();
        this.setEvents();
        this.listenToMouse();
    },

    componentDidUpdate: function() {
        this.updateCursor();
        this.setEvents();
        this.listenToMouse();
    },

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
        var that = this;
        var handleClick =  {
            'pen': that.setTool('pen'),
            'select': that.setTool('select')
        };

        return (
            <div className="image-editor" style={divStyle} >
                <EditorMenu width={surfaceWidth} height={surfaceHeight * 0.05} filterItems={this.props.filterItems} handleImageFilter={this.handleImageFilter} handleClick={handleClick} />
                <EditorCanvas width={surfaceWidth} height={surfaceHeight * 0.95} image={this.state.image} ref='canvas' />
            </div>
        );
    },

    setTool: function(name) {
        var that = this;
        return function() {
            var state = that.state;
            state.tool = name;
            that.setState(state);
        }
    },

    imageDataStack: [],

    imageDataCache: null,

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
            flex: 1,
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
    },

    mousedown: {
        x: 0,
        y: 0
    },

    dragging: false,

    handleImageFilter: function(name) {
        var img = this.state.image;
        var ai = AlloyImage(img);
        ai.ps(name).replace(img);
        this.setState({
            image: img
        });
    },

    updateCanvas: function() {
        updateCursor();
    },

    listenToMouse: function() {
        var canvas = this.canvas;
        canvas.onmousedown = function(that) {
            return function(e) {
                var loc = that.windowToCanvas(e.clientX, e.clientY);

                e.preventDefault();
                that.mousedown.x = loc.x;
                that.mousedown.y = loc.y;
                that.dragging = true;
                
                that.handleMouseDown(e);
            }
        }(this);
        canvas.onmousemove = function(that) {
            return function(e) {
                e.preventDefault();
                if (that.dragging) that.handleDragging(e);
            }
        }(this);
        canvas.onmouseup = function(that) {
            return function(e) {
                that.dragging = false;
                that.handleMouseUp(e);
            }
        }(this);
    },

    updateCursor: function() {
        var canvas = this.canvas;
        if (this.state.tool == 'eraser' || this.state.tool == 'select') {
            canvas.style.cursor = 'crosshair';
        }
        if (this.state.tool == 'text') {
            canvas.style.cursor = 'text';
        }
    },

    setEvents: function() {
        var canvas = this.canvas;
        console.log(this.state.tool);
        if (this.state.tool == 'select') {
            this.setToSelect();
        }
    },

    setToSelect: function() {
        var canvas = this.canvas;
        this.handleMouseDown = function(e) {
            this.saveToCache();
        };
        this.handleDragging = function(e) {
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.restoreFromCache();
            this.updateRubberBand(loc);
        };
        this.handleMouseUp = function(e) {
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.updateRubberBand(loc, true);
        };
    },

    updateRubberBand: function(loc, dash) {
        var context = this.canvas.getContext('2d');
        dash = false || dash;
        context.save();
        if (dash) context.setLineDash([2, 5]);
        this.drawRubberBandRect(loc);
        context.restore();
    },

    drawRubberBandRect: function(loc) {
        var context = this.canvas.getContext('2d');
        var width = Math.abs(loc.x - this.mousedown.x);
        var height = Math.abs(loc.y - this. mousedown.y);
        var left = this.mousedown.x < loc.x ? this.mousedown.x : loc.x;
        var top = this.mousedown.y < loc.y ? this.mousedown.y : loc.y;
        context.beginPath();
        context.strokeRect(left, top, width, height);
    },

    windowToCanvas: function(x, y) {
        var canvas = this.canvas;
        var bbox = canvas.getBoundingClientRect();
        return {
            x: x - bbox.left * (canvas.width / bbox.width),
            y: y - bbox.top * (canvas.height / bbox.height) };
    },

    saveState: function() {
        var canvas = this.canvas;
        var context = canvas.getContext('2d');
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        this.imageDataStack.push(imageData);
    },

    restoreState: function() {
        var imageData = this.imageDataStack.pop();
        var canvas = this.canvas;
        var context = canvas.getContext('2d');
        context.putImageData(imageData, 0, 0); 
    },

    saveToCache: function() {
        var canvas = this.canvas;
        var context = canvas.getContext('2d');
        this.imageDataCache = context.getImageData(0, 0, canvas.width, canvas.height);
    },

    restoreFromCache: function() {
        var canvas = this.canvas;
        var context = canvas.getContext('2d');
        context.putImageData(this.imageDataCache, 0, 0); 
    }

}); 

var EditorMenu = React.createClass({

    src: {
        pen: '/imgs/editor-icons/iconfont-pen',
        eraser: '/imgs/editor-icons/iconfont-eraser',
        text: '/imgs/editor-icons/iconfont-text',
        select: '/imgs/editor-icons/iconfont-select'
    },

    getInitialState: function() {
        return {
            src: this.src
        }
    },

    render: function() {
        return(
            <div width={this.props.width} height={this.props.height} left={0} top={0} >
                    <ImageButton size={this.props.height} name='pen' handleClick={this.props.handleClick['pen']} />
                    <ImageButton size={this.props.height} name='eraser' />
                    <ImageButton size={this.props.height} name='text' />
                    <ImageButton size={this.props.height} name='jietu' handleClick={this.props.handleClick['select']} />
                    <ImageButton size={this.props.height} name='jietu' />
                    <FilterMenu filterItems={this.props.filterItems} handleImageFilter={this.props.handleImageFilter} />
            </div>
        );
    },

    getSize: function() {
        return {
            width: this.props.width,
            height: this.props.height
        }
    }

}); 

var FilterMenu = React.createClass({
    
    render: function() {
        var that = this;
        var items = this.props.filterItems.map(function(item, key) {
            return (<div className="item" key={key} onClick={that.handleClick(item.func)} >{item.name}</div>);
        });

        return (
            <div className="ui dropdown filter-menu">
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

var EditorCanvas = React.createClass({

    componentDidMount: function() {
        this.renderBackground();
        this.renderImage();
    },

    componentDidUpdate: function() {
        var image = this.props.image;
        //image.loadOnce(function() {
            //var ai = AlloyImage(image);
            //ai.show();
        //});
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

var FILTERS = [
    {func: 'softenFace', name: '美肤'},
    {func: 'sketch', name: '素描'},
    {func: 'softEnhancement', name: '自然增强'},
    {func: 'purpleStyle', name: '紫调'},
    {func: 'soften', name: '柔焦'},
    {func: 'vintage', name: '复古'},
    {func: 'gray', name: '黑白'},
    {func: 'lomo', name: '防lomo'},
    {func: 'strongEnhancement', name: '亮白增强'},
    {func: 'strongGray', name: '灰白'},
    {func: 'lightGray', name: '灰色'},
    {func: 'warmAutumn', name: '暖秋'},
    {func: 'carveStyle', name: '木雕'},
    {func: 'rough', name: '粗糙'}
];

window.onload = function() {
    ReactDOM.render(
        <div>
            <ImageEditor width={1200} height={800} src="/imgs/test.jpg" filterItems={FILTERS}/>,
        </div>,
        document.getElementById("main")
    );
    $('.ui.dropdown').dropdown({
        action: 'hide'
    });
}();
