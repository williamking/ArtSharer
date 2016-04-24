var React = require('react');

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

module.exports = ImageButton;
