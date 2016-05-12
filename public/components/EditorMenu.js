var React = require("react");
var ButtonState = require("./ButtonState.js");
var FilterMenu = require("./FilterMenu.js");
var ImageButton = require("./ImageButton.js");

var EditorMenu = React.createClass({

    src: {
        pen: '/imgs/editor-icons/iconfont-pen',
        eraser: '/imgs/editor-icons/iconfont-eraser',
        text: '/imgs/editor-icons/iconfont-text',
        select: '/imgs/editor-icons/iconfont-select',
        rotateLeft: '/imgs/editor-icons/arrow-rotate-left',
        rotateRight: '/imgs/editor-icons/arrow-rotate-right'
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
                    <ImageButton size={this.props.height} name='arrow-rotate-left' />
                    <ImageButton size={this.props.height} name='arrow-ratate-right' />
                    <FilterMenu filterItems={this.props.filterItems} handleImageFilter={this.props.handleImageFilter} />
                </div>
                <ButtonState tool={this.props.tool} editor={this.props.editor} updateTextState={this.props.updateTextState} handleTextChange={this.props.handleTextChange}
                textColorListener={this.props.textColorListener} updatePenState={this.props.updatePenState} 
                updateEraserState={this.props.updateEraserState} />
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

module.exports = EditorMenu;
