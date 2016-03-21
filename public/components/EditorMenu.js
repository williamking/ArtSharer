var React = require("react");
var ButtonState = require("./ButtonState.js");
var FilterMenu = require("./FilterMenu.js");
var ImageButton = require("./ImageButton.js");

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
                <ButtonState buttonName="text" editor={this.props.editor} updateTextState={this.props.updateTextState} handleTextChange={this.props.handleTextChange} />
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
