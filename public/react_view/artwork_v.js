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
            url: '',
            createTime: '',
            lastModefied: '',
            mode: 'normal',
            author: '',
            height: 0,
            width: 0
        }
    },
    
    componentDidMount: function() {
        var url = '/handle_artwork_query';
        var queryForm = new FormData();
        queryForm.append("author", author);
        queryForm.append("workTitle", title);
        this.serverRequest = $.ajax({
            url: url,
            type: 'POST',
            cache: false,
            data: queryForm,
            contentType: false,
            processData: false
        })
        .done((function(data) {
            this.setState({
               title: data[0].workTitle,
               url: data[0].url,
               createTime: data[0].workCreateTime,
               lastModified: data[0].lastModified,
               author: data[0].author || 'unknown'
            });
        }).bind(this));
    },

    changeToEditMode: function() {
        var img = this.refs.img;
        this.setState({
            mode: 'editor',
            height: img.height,
            width: img.width
        });
    },

    resetToNormal: function() {
        if (this.state.mode == 'normal') return;
        this.setState({
            mode: 'normal'
        });
    },

    handleSubmit: function() {
        var callback = (function(data) {
            var form = new FormData();
            form.append("workTitle", this.state.title);
            form.append("tag", this.state.tag);
            form.append("img", data, this.state.title + '_' + username);
            var url = '/' + username + '/handle_artwork_update';
            $.ajax({
                url: url,
                type: 'POST',
                data: form,
                cache: false,
                contentType: false,
                processData: false
            }).done((function(obj) {
                alert('Update success!');
                console.log(obj);
                this.setState({
                    url: obj.url
                });
                this.resetToNormal(); 
            }).bind(this));
        }).bind(this);
        this.refs.editor.getData(callback);
    },

    render: function() {
        return(
            <div id="artwork-detail">
                <header className="ui dividing header">
                    <h1>{this.state.author}/Artworks/{this.state.title}</h1>
                </header>
                <div id="artwork-status">
                    <div id="artwork-info">
                        <p>Last edited at <span>{this.state.lastModified}</span></p>
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
                        {
                        this.state.mode == 'editor' ? 
                        <button onClick={this.handleSubmit} className="ui button green">Save</button> :
                        <div></div>
                        }
                    </div>
                </div>
                <div id="artwork-main">
                    {this.state.mode == 'editor' ?
                    <ImageEditor width={1200} height={800} src={this.state.url} filterItems={filters} ref='editor' /> :
                    <div id="artwork-image-wrapper">
                        <img src={this.state.url} alt='This is an image' ref='img'></img>
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

