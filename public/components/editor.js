var React = require('react');
//var ReactCanvas = require('react-canvas');
var ReactDOM = require('react-dom');
var cssLayout = require('css-layout');

//var Surface = ReactCanvas.Surface;
//var Text = ReactCanvas.Text;
//var Group = ReactCanvas.Group;
//var FontFace = ReactCanvas.FontFace;
//var CImage = ReactCanvas.Image;

/*-----Load JS------*/
require('../libs/alloyimage-1.1.js');
require('../libs/semantic/components/dropdown.min.js');

/*-----Load css-----*/
require('../css/imageEditor.css');
require('../libs/semantic/components/dropdown.min.css');

var ImageButton = require("./ImageButton.js");
var EditorMenu = require("./EditorMenu.js");
var EditorCanvas = require("./EditorCanvas.js");


var ImageEditor = React.createClass({

    getInitialState: function() {
        var image = new Image();
        image.src = this.props.src;
        return {
            width: this.props.width,
            height: this.props.height,
            image: image,
            tool: 'normal'
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

    getData: function(callback) {
        this.refs.canvas.getData(callback);
    },

    render: function() {
        var surfaceWidth = this.state.width;
        var surfaceHeight = this.state.height;
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
            'eraser': that.setTool('eraser'),
            'pen': that.setTool('pen'),
            'select': that.setTool('select'),
            'text': that.setTool('text'),
            'turnback': function(that) {
                return function() {
                    that.restoreState();
                }
            }(that),
            'arrow-rotate-left': (function() {
                this.rotateLeft();
            }).bind(this),
            'arrow-rotate-right': (function() {
                this.rotateRight();
            }).bind(this)
        };

        return (
            <div className="image-editor" style={divStyle} >
                <EditorMenu width={surfaceWidth} height={surfaceHeight * 0.05} events={this.editEvents} setInput={this.setInput}
                updateTextState={this.setTextState} handleTextChange = {this.handleTextChange} editor={this}
                filterItems={this.props.filterItems} handleImageFilter={this.handleImageFilter} handleClick={handleClick}
                textColorListener={this.getTextColor} tool={this.state.tool}
                updatePenState={this.setPenState} updateEraserState={this.setEraserState} />
                <EditorCanvas width={surfaceWidth} height={surfaceHeight * 0.95} image={this.state.image} imageOnload={this.setInitState} handleOverflow = {this.handleOverflow} ref='canvas' />
            </div>
        );
    },

    handleOverflow: function(w, h) {
        this.setState({
            width: w,
            height: h * 1.0 / 0.95
        });
    },

    setInitState: function() {
        var canvas = this.canvas;
        var context = canvas.getContext('2d');
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        this.initState = imageData;
        this.saveToCache();
    },

    setTool: function(name) {
        var that = this;
        return function() {
            if (that.state.tool != 'normal')
                that.onLeaveTool[that.state.tool](that);
            var state = that.state;
            state.tool = name;
            that.setState(state);
        }
    },

    onLeaveTool: {
        pen: function(editor) {
            editor.handleMouseDown = function() {};
            editor.handleDragging = function() {};
            editor.handleMouseUp = function() {};
        },
        select: function(editor) {
            editor.canvas.style.cursor = 'default';
            editor.restoreFromCache();
            editor.handleMouseDown = function() {};
            editor.handleDragging = function() {};
            editor.handleMouseUp = function() {};
        },
        eraser: function(editor) {
            editor.canvas.style.cursor = 'default';
            editor.handleMouseDown = function() {};
            editor.handleDragging = function() {};
            editor.handleMouseUp = function() {};
        },
        text: function(editor) {
            editor.canvas.style.cursor = 'default';
            editor.handleMouseDown = function() {};
            editor.handleDragging = function() {};
            editor.handleMouseUp = function() {};
            if (editor.textState.blinkingInterval != null) {
                editor.restoreFromTextCache();
                clearInterval(editor.textState.blinkingInterval);
            }
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
        this.restoreFromCache();
        var act = ['toGray', 'toThresh', 'toReverse', 'embossment', 'corrode', 'noise', 'dotted'];
        var img = this.state.image;
        if (this.state.tool == 'select' && this.selectState.selected == true) {
            img = this.selectState.selectDataImage;
            var ai = AlloyImage(img);
            if (act.indexOf(name) == -1)
                ai.ps(name).replace(img);
            else {
                if (name == 'toThresh') ai.act(name, 128).replace(img);
                else ai.act(name).replace(img);
            }
            this.applySelectState();
            this.restoreFromCache();
        } else {
            img.src = this.canvas.toDataURL();
            img.onload = function(that, act, name) {
                return function() {
                    var ai = AlloyImage(this);
                    if (act.indexOf(name) == -1)
                        ai.ps(name).replace(this);
                    else {
                        if (name == 'toThresh') ai.act(name, 128).replace(this);
                        else ai.act(name).replace(this);
                    }
                    that.setState({
                        image: this,
                        tool: 'normal'
                    });
                };
            }(this, act, name);
        }
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
                var mousedown = this.mousedown;
                if (that.dragging) that.handleDragging(e, mousedown);
                if (that.handleMouseMove) that.handleMouseMove(e, mousedown);
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
        this.handleMouseDown = function() {};
        this.handleMouseMove = function() {};
        this.handleDragging = function() {};
        this.handleMouseUp = function() {};
        if (this.state.tool == 'select') {
            this.setToSelect();
        }
        if (this.state.tool == 'pen') {
            this.setToPen();
        }
        if (this.state.tool == 'eraser') {
            this.setToEraser();
        }
        if (this.state.tool == 'text') {
            this.setToText();
        }
    },

    setToEraser: function() {
        this.canvas.style.cursor = 'default';
        var canvas = this.canvas;
        this.saveToCache();
        this.initEraserState();
        this.handleMouseDown = function(e) {
            this.restoreFromCache();
            this.saveState();
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.saveToCache();
            this.eraserState.x = loc.x;
            this.eraserState.y = loc.y;
        }
        this.handleMouseMove = function(e) {
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.restoreFromCache();
            this.drawEraser(loc);
            this.eraserState.x = loc.x;
            this.eraserState.y = loc.y;
        }
        this.handleDragging = function(e) {
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.eraseLast();
            this.saveToCache();
        },
        this.handleMouseUp = function(e) {
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.eraseLast();
            this.saveToCache();
            this.drawEraser(loc);
        }
    },

    initEraserState: function() {
        this.eraserState = {
            width: 40,
            x: 0,
            y: 0
        }
    },

    setEraserState: function(name ,value) {
        this.eraserState[name] = value;
    },

    eraseLast: function() {
        var context = this.canvas.getContext('2d');
        context.save();
        var x = this.eraserState.x;
        var y = this.eraserState.y;
        var width = this.eraserState.width
        var lineWidth = context.lineWidth;
        context.beginPath();
        context.arc(x, y, width / 2 + lineWidth, 0, Math.PI * 2, false);
        context.clip();
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.restore();
    },

    drawEraser: function(loc) {
        var context = this.canvas.getContext('2d');
        context.save();
        var width = this.eraserState.width
        var lineWidth = context.lineWidth;
        context.beginPath();
        context.arc(loc.x, loc.y, width / 2, 0, Math.PI * 2, false);
        context.stroke();
        context.restore();
    },

    setToPen: function() {
        var canvas = this.canvas;
        this.imageDataCache = null;
        this.saveToCache();
        this.initDrawingState();
        this.handleMouseDown = function(e) {
            this.restoreFromCache();
            this.saveState();
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.drawPen(loc);
            this.saveToCache();
            this.drawingState.pos.x = loc.x;
            this.drawingState.pos.y = loc.y;
            this.drawingState.startPoint.x = loc.x;
            this.drawingState.startPoint.y = loc.y;
        }
        this.handleMouseMove = function(e) {
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.restoreFromCache();
            this.drawPen(loc);
            this.drawingState.pos.x = loc.x;
            this.drawingState.pos.y = loc.y;
        }
        this.handleDragging = function(e) {
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            if (!this.drawingState.on) {
                this.drawingState.on = true;
                this.drawingState.pos.x = this.drawingState.startPoint.x;
                this.drawingState.pos.y = this.drawingState.startPoint.y;
           }
            this.drawPath(loc);
            this.saveToCache();
        },
        this.handleMouseUp = function(e) {
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.saveToCache();
            this.drawingState.on = false;
        }
    },
    
    initDrawingState: function() {
        this.drawingState = {
            color: 'black',
            size: 4,
            on: false,
            pos: {
                x: 0,
                y: 0
            },
            startPoint: {
                x: 0,
                y: 0
            }
        }
    },

    setPenState: function(name, value) {
        this.drawingState[name] = value;
    },

    drawPen: function(loc) {
        var context = this.canvas.getContext('2d');
        var width = this.drawingState.size;
        context.save();
        context.fillStyle = this.drawingState.color;
        context.beginPath();
        context.arc(loc.x, loc.y, width/2, 0, Math.PI * 2, false);
        context.fill();
        context.restore();
    },

    drawPath: function(loc) {
        var context = this.canvas.getContext('2d');
        var width = this.drawingState.size;
        var pos = this.drawingState.pos;
        context.save();
        context.strokeStyle = this.drawingState.color;
        context.lineWidth = width;
        context.beginPath();
        context.moveTo(pos.x, pos.y);
        context.lineTo(loc.x, loc.y);
        context.stroke();
        context.restore();
    },

    setToText: function()  {
        var canvas = this.canvas;
        this.disableInput();
        this.textState = {
            textStyle: 'normal',
            textSize: 5,
            textValue: '',
            textSize: 'serif',
            pos: {},
            blinkingInterval: null,
            cache: null,
            input: null,
            textColor: '#000'
        };
        this.saveToCache();
        this.saveToTextCache();
        this.handleMouseDown = function(e) {
            this.enableInput();
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.updateTextPos(loc);
            this.restoreFromCache();
            this.drawTextCursor();
            this.blinkTextCursor();
        };
    },

    enableInput: function() {
        $("#text-input").removeClass("disabled");
        $("#text-input").find("input").focus();
    },

    disableInput: function() {
        $("#text-input").addClass("disabled");
    },

    updateTextPos: function(loc) {
        this.restoreFromTextCache();
        this.saveToCache();
        this.saveState();
        this.textState.pos = loc;
        if (this.textState.input) this.textState.input.clearText();
    },

    blinkTextCursor: function() {
        var context = this.canvas.getContext('2d');
        this.textState.blinkingInterval = setInterval(function(that) {
            return function(e) {
                that.restoreFromTextCache();
                setTimeout(function(that) {
                    return function(e) {
                        that.drawTextCursor();
                    };
                }(that), 500);
            };
        }(this), 1000);
    },

    drawTextCursor: function() {
        if (this.state.tool != 'text') return;
        var context = this.canvas.getContext('2d');
        context.save();
        context.fillStyle = 'rgba(0, 0, 0, 0.5)'; 
        context.beginPath();
        var height = context.measureText('W').width;
        var textWidth = context.measureText(this.textState.textValue).width;
        context.fillRect(this.textState.pos.x + textWidth, this.textState.pos.y, 2, height);
        context.restore();
    },

    setTextState: function(textStyle, textSize, textFont) {
        this.textState.textStyle = textStyle;
        this.textState.textSize = textSize;
        this.textState.textFont = textFont;
        var context = this.canvas.getContext('2d');
        context.font = textStyle + ' ' + textSize + 'px ' + textFont;
        this.handleTextChange(this, this.textState.textValue, this.textState.input);
        $("#text-input").find("input").focus();
    },

    getTextColor: function(textColor) {
        this.textState.textColor = textColor;
        this.handleTextChange(this, this.textState.textValue, this.textState.input);
        $("#text-input").find("input").focus();
    },

    handleTextChange: function(that, text, input) {
        that.textState.textValue = text;
        that.restoreFromCache();
        var context = that.canvas.getContext('2d');
        context.save();
        context.fillStyle = that.textState.textColor;
        context.textBaseline = 'hanging';
        context.fillText(text, that.textState.pos.x, that.textState.pos.y);
        context.restore();
        that.saveToTextCache();
        that.textState.input = input;
    },

    saveToTextCache: function() {
        var context = this.canvas.getContext('2d');
        this.textState.cache = context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    },
    
    restoreFromTextCache: function() {
        if (this.textState.cache == null) return;
        var canvas = this.canvas;
        var context = canvas.getContext('2d');
        context.putImageData(this.textState.cache, 0, 0); 
    },

    setToSelect: function() {
        var canvas = this.canvas;
        this.imageDataCache = null;
        this.initSelectState();
        this.handleMouseDown = function(e) {
            this.restoreFromCache();
            this.saveToCache();
        };
        this.handleDragging = function(e) {
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.restoreFromCache();
            this.updateRubberBand(loc);
        };
        this.handleMouseUp = function(e) {
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.restoreFromCache();
            this.updateRubberBand(loc, true, true);
        };

    },

    initSelectState: function() {
        this.selectState = {
            selectData: null,
            selectDataImage: new Image(),
            selected: false,
            rubberBand: {
                width: 0,
                height: 0,
                left: 0,
                top: 0
            }
        }
    },

    stretchImage: function() {
        var context = this.canvas.getContext('2d');
        var rubberBand = this.selectState.rubberBand;
        if (rubberBand.width == 0 || rubberBand.height == 0) {
            this.selectState.selected = false;
            return;
        } else {
            this.selectState.selected = true;
        }
        this.selectState.selectData = context.getImageData(rubberBand.left, rubberBand.top,
        rubberBand.width, rubberBand.height);
        var retCanvas = document.createElement('canvas');
        retCanvas.width = rubberBand.width;
        retCanvas.height = rubberBand.height;
        retCanvas.getContext('2d').putImageData(this.selectState.selectData, 0, 0);
        this.selectState.selectDataImage.src = retCanvas.toDataURL();
    }, 

    applySelectState: function() {
        var context = this.canvas.getContext('2d');
        var rubberBand = this.selectState.rubberBand;
        this.restoreFromCache();
        this.saveState();
        context.drawImage(this.selectState.selectDataImage, rubberBand.left, rubberBand.top, rubberBand.width, rubberBand.height);
        this.saveToCache();
        context.save();
        context.setLineDash([10, 10]);
        context.beginPath();
        context.strokeRect(rubberBand.left, rubberBand.top, rubberBand.width, rubberBand.height);
        context.restore();
    },

    rotateLeft: function() {
        var context = this.canvas.getContext('2d');
        this.saveState();
        var w = this.state.image.width, h = this.state.image.height;
        var left = this.refs.canvas.left, top = this.refs.canvas.top;
        var data = context.getImageData(left, top, w, h);
        var resultData = context.createImageData(data.height, data.width);
        for (var i = 0; i < data.width; ++i) {
            for (var j = 0; j < data.height; ++j) {
                var x = data.width - i - 1, y = j, index = (i * data.height + j) * 4;
                var index2 = (y * data.width + x) * 4; 
                resultData.data[index] = data.data[index2];
                resultData.data[index + 1] = data.data[index2 + 1];
                resultData.data[index + 2] = data.data[index2 + 2];
                resultData.data[index + 3] = 255;
            }
        }

        var resultImage = new Image(), retCanvas = document.createElement('canvas');
        retCanvas.width = h;
        retCanvas.height = w;
        retCanvas.getContext('2d').putImageData(resultData, 0, 0);
        resultImage.src = retCanvas.toDataURL();
        this.setState({
            image: resultImage
        });
        this.saveState();
    },

    rotateRight: function() {
        var context = this.canvas.getContext('2d');
        this.saveState();
        var w = this.state.image.width, h = this.state.image.height;
        var left = this.refs.canvas.left, top = this.refs.canvas.top;
        var data = context.getImageData(left, top, w, h);
        var resultData = context.createImageData(data.height, data.width);
        for (var i = 0; i < data.width; ++i) {
            for (var j = 0; j < data.height; ++j) {
                var x = i, y = data.height - 1 - j, index = (i * data.height + j) * 4;
                var index2 = (y * data.width + x) * 4; 
                resultData.data[index] = data.data[index2];
                resultData.data[index + 1] = data.data[index2 + 1];
                resultData.data[index + 2] = data.data[index2 + 2];
                resultData.data[index + 3] = 255;
            }
        }

        var resultImage = new Image(), retCanvas = document.createElement('canvas');
        retCanvas.width = h;
        retCanvas.height = w;
        retCanvas.getContext('2d').putImageData(resultData, 0, 0);
        resultImage.src = retCanvas.toDataURL();
        this.setState({
            image: resultImage
        });
        this.saveState();
    },

    updateRubberBand: function(loc, dash, stretch) {
        var context = this.canvas.getContext('2d');
        dash = false || dash;
        stretch = false || stretch;
        context.save();
        if (dash) context.setLineDash([10, 10]);
        this.drawRubberBandRect(loc, stretch);
        context.restore();
    },

    drawRubberBandRect: function(loc, stretch) {
        var context = this.canvas.getContext('2d');
        var rubberBand = this.selectState.rubberBand;
        if (stretch) this.stretchImage();
        rubberBand.width = Math.abs(loc.x - this.mousedown.x);
        rubberBand.height = Math.abs(loc.y - this. mousedown.y);
        rubberBand.left = this.mousedown.x < loc.x ? this.mousedown.x : loc.x;
        rubberBand.top = this.mousedown.y < loc.y ? this.mousedown.y : loc.y;
        context.beginPath();
        context.strokeRect(rubberBand.left, rubberBand.top, rubberBand.width, rubberBand.height);
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
        var imageData = this.imageDataCache;
        this.imageDataStack.push(imageData);
    },

    restoreState: function() {
        if (this.imageDataStack.length <= 0) {
            var imageData = this.initState;
            var canvas = this.canvas;
            var context = canvas.getContext('2d');
            context.putImageData(imageData, 0, 0); 
            this.saveToCache();
            return;
        }
        var imageData = this.imageDataStack.pop();
        var canvas = this.canvas;
        var context = canvas.getContext('2d');
        context.putImageData(imageData, 0, 0); 
        this.saveToCache();
    },

    saveToCache: function() {
        var canvas = this.canvas;
        var context = canvas.getContext('2d');
        this.imageDataCache = context.getImageData(0, 0, canvas.width, canvas.height);
    },

    restoreFromCache: function() {
        if (this.imageDataCache == null) return;
        var canvas = this.canvas;
        var context = canvas.getContext('2d');
        context.putImageData(this.imageDataCache, 0, 0); 
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
    {func: 'rough', name: '粗糙'},
    {func: 'toGray', name: '灰度处理'},
    {func: 'toThresh', name: '二值化'},
    {func: 'toReverse', name: '反色'},
    {func: 'embossment', name: '浮雕'},
    {func: 'corrode', name: '腐蚀'},
    {func: 'dotted', name: '喷点'}
];

/*$(function() {
    ReactDOM.render(
        <div>
            <ImageEditor width={1200} height={800} src="/imgs/test.jpg" filterItems={FILTERS}/>,
        </div>,
        $("#editor-wrapper")[0], null);
})();
*/

module.exports = {
    editor: ImageEditor,
    filters: FILTERS
};
