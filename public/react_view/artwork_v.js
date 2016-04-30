/**
 * Create by William on 16-4-28.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var ed = require('../components/editor.js');
var ImageEditor = ed.editor, filters = ed.filters;

require('../css/artworkDetail.css');

var Artwork = React.createClass({

    getInitialState: function() {
        return {
            title: '',
            url: '#',
            createTime: '',
            lastModefied: '',
            mode: 'normal',
            author: 'unknown'
        }
    },
    
    componentDidMount: function() {
        var url = 'user/' + username + '/' + title;
        this.serverRequest = $.getJSON(url, function(data) {
            this.setState({
                title: data.workTitle,
                url: data.workUrl,
                createTime: data.workCreateTime,
                lastModefied: data.lastModefied,
                author: data.author || 'unknown'
            });
        });
    },

    changeToEditMode: function() {
        this.setState({
            mode: 'editor'
        });
    },

    resetToNormal: function() {
        this.setState({
            mode: 'normal'
        });
    },

    render: function() {
        return(
            <div id="artwork-detail">
                <header className="ui dividing header">
                    <h1>{this.state.author}/Artworks/{this.state.title}</h1>
                </header>
                <div id="artwork-status">
                    <div id="artwork-info">
                        <p>Last edited at <span>{this.state.createTime}</span></p>
                    </div>
                    <div id="artwork-process">
                        <div className="ui labeled button">
                            <div className="ui basic blue button">
                                <i className="fork icon"></i>
                                Forks
                            </div>
                            <a className="ui basic left pointing blue label">0</a>
                        </div>
                        <div className="ui labeled button">
                            <div className="ui basic red button">
                                <i className="fork icon"></i>
                                Star
                            </div>
                            <a className="ui basic left pointing red label">0</a>
                        </div>
                        { this.state.mode == 'normal' ?
                        <button onClick={this.changeToEditMode} className="ui button green">Edit</button> :
                        <button onClick={this.resetToNormal} className="ui blue button">View</button>
                        }
                    </div>
                </div>
                <div id="artwork-main">
                    {this.state.mode == 'editor' ?
                    <ImageEditor width={1200} height={800} src={this.state.url} filterItems={filters} /> :
                    <div id="image-artwork-image-wrapper">
                        <img src={this.state.url} alt='This is an image' ></img>
                    </div>
                    }
                </div>
            </div>
        );
    }
});

$(function() {
    ReactDOM.render(<Artwork />, $('#artwork-wrapper')[0], null);
});

