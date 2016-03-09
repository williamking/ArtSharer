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
            'eraser': that.setTool('eraser'),
            'pen': that.setTool('pen'),
            'select': that.setTool('select'),
            'text': that.setTool('text'),
            'turnback': function(that) {
                return function() {
                    that.restoreState();
                }
            }(that)
        };

        return (
            <div className="image-editor" style={divStyle} >
                <EditorMenu width={surfaceWidth} height={surfaceHeight * 0.05} events={this.editEvents}
                updateTextState={this.setTextState} handleTextChange = {this.handleTextChange}
                filterItems={this.props.filterItems} handleImageFilter={this.handleImageFilter} handleClick={handleClick} />
                <EditorCanvas width={surfaceWidth} height={surfaceHeight * 0.95} image={this.state.image} imageOnload={this.setInitState} ref='canvas' />
            </div>
        );
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
        pen: function() {},
        select: function(editor) {
            editor.canvas.style.cursor = 'default';
            editor.restoreFromCache();
            editor.handleMouseDown = function() {};
            editor.handleDragging = function() {};
            editor.handleMouseUp = function() {};
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
            this.saveState();
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.saveToCache();
            this.drawingState.pos.x = loc.x;
            this.drawingState.pos.y = loc.y;
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
            this.drawPath(loc);
            this.saveToCache();
        },
        this.handleMouseUp = function(e) {
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.saveToCache();
        }
    },
    
    initDrawingState: function() {
        this.drawingState = {
            color: 'black',
            width: 4,
            pos: {
                x: 0,
                y: 0
            }
        }
    },

    drawPen: function(loc) {
        var context = this.canvas.getContext('2d');
        var width = this.drawingState.width;
        context.save();
        context.beginPath();
        context.arc(loc.x, loc.y, width/2, 0, Math.PI * 2, false);
        context.fill();
        context.restore();
    },

    drawPath: function(loc) {
        var context = this.canvas.getContext('2d');
        var width = this.drawingState.width;
        var pos = this.drawingState.pos;
        context.save();
        context.strokeStyle = this.drawingState.color;
        context.lineWidth = this.drawingState.width;
        context.beginPath();
        context.moveTo(pos.x, pos.y);
        context.lineTo(loc.x, loc.y);
        context.stroke();
        context.restore();
    },

    setToText: function()  {
        var canvas = this.canvas;
        this.saveToCache();
        this.setTextState('normal', 5, 'serif');
        this.handleMouseDown = function(e) {
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.updateTextPos(loc);
            this.restoreFromCache();
            this.drawTextCursor();
            this.blinkTextCursor();
        };
    },

    updateTextPos: function(loc) {
        this.textState.pos = loc;
    },

    blinkTextCursor: function() {
        var context = this.canvas.getContext('2d');
        this.textState.blinkingInterval = setInterval(function(that) {
            return function(e) {
                that.restoreFromCache();
                setTimeout(function(that) {
                    return function(e) {
                        that.drawTextCursor();
                    };
                }(that), 500);
            };
        }(this), 1000);
    },

    drawTextCursor: function() {
        var context = this.canvas.getContext('2d');
        context.save();
        context.fillStyle = 'rgba(0, 0, 0, 0.5)'; 
        context.beginPath();
        var height = context.measureText('W').width;
        context.fillRect(this.textState.pos.x, this.textState.pos.y, 2, height);
        context.restore();
    },

    setTextState: function(textStyle, textSize, textFont) {
        this.textState = {
            textStyle: textStyle,
            textSize: textSize,
            textFont: textFont
        };
        var context = this.canvas.getContext('2d');
        context.font = this.textState.textSize + 'px ' + this.textState.textFont + ' ' + this.textState.textFont + ' ' + this.textState.textStyle;
    },

    handleTextChange: function(text) {
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
            <div width={this.props.width} height={this.props.height} left={0} top={0} className="editor-menu">
                <div className='buttons'>
                    <ImageButton size={this.props.height} name='pen' handleClick={this.props.handleClick['pen']} />
                    <ImageButton size={this.props.height} name='eraser' handleClick={this.props.handleClick['eraser']} />
                    <ImageButton size={this.props.height} name='text' handleClick={this.props.handleClick['text']} />
                    <ImageButton size={this.props.height} name='jietu' handleClick={this.props.handleClick['select']} />
                    <ImageButton size={this.props.height} name='huitui' handleClick={this.props.handleClick['turnback']}/>
                    <FilterMenu filterItems={this.props.filterItems} handleImageFilter={this.props.handleImageFilter} />
                </div>
                <ButtonState buttonName="text" updateTextState={this.props.updateTextState} handleTextChange={this.props.handleTextChange} />
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

var ButtonState = React.createClass({

    getInitialState: function() {
        return {
            textValue: '' 
        };
    },

    componentDidMount: function() {
        var editor = this;
        if (this.props.buttonName == 'text') {
            $(".font-size").dropdown({
                onChange: function(that) {
                    return function(value, text) {
                        var state = that.state;
                        state.fontSize = value;
                        that.setState(state);
                        that.handleTextUpdate();
                    };
                }(this),
            });
            $(".font-style").dropdown({
                onChange: function(that) {
                    return function(value, text) {
                        var state = that.state;
                        state.fontStyle = value;
                        that.setState(state);
                        that.handleTextUpdate();
                    };
                }(this),
            });
            $(".font-family").dropdown({
                onChange: function(that) {
                    return function(value, text) {
                        var state = that.state;
                        state.fontFamily = value;
                        that.setState(state);
                        that.handleTextUpdate();
                    };
                }(this),
            });
        }
    },

    handleTextUpdate: function() {
        this.props.updateTextState(this.state.fontStyle, this.state.fontSize, this.state.fontFamily);
    },

    fontSize: [5, 7, 10, 14, 20, 28, 32],

    fontStyle: ['normal', 'italic', 'oblique'],

    fontFamily: ['serif', 'san-serif', 'monospace', 'cursive', 'fantasy'],

    handleTextChange: function(e) {
        var state = this.state;
        state.textValue = e.target.value;
        this.setState(state);
        this.props.handleTextChange();
    },

    render: function() {
        if (this.props.buttonName == 'text') {
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
                <div className="ui input">
                    <input type='text' placeholder='Text content...' value={value} onChange={this.handleTextChange}></input>
                </div>
                <div className="ui dropdown filter-menu" id="text-size">
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
                <div className="ui dropdown filter-menu" id="font-style">
                    <div className="text">Text Font</div>
                    <i className="dropdown icon"></i>
                    <div className="menu">
                        {families}
                    </div>
                </div>
                </div>
            );
        }
    }

});

var FilterMenu = React.createClass({

    componentDidMount: function() {
        $(this.refs.menu).dropdown({
            action: 'hide'
        });
    },
    
    render: function() {
        var that = this;
        var items = this.props.filterItems.map(function(item, key) {
            return (<div className="item" key={key} onClick={that.handleClick(item.func)} >{item.name}</div>);
        });

        return (
            <div className="ui dropdown filter-menu" ref='menu'>
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
    {func: 'dotted', name: '喷点'},
];

window.onload = function() {
    ReactDOM.render(
        <div>
            <ImageEditor width={1200} height={800} src="/imgs/test.jpg" filterItems={FILTERS}/>,
        </div>,
        document.getElementById("main")
    );
}();
