/**
 * Created by William on 16-4-26.
 */

var React = require('react');
var ReactDom = require('react-dom');

require('../css/createArtwork.css');

var ArtInfo = React.createClass({

    getInitialState: function() {
        console.log(username);
        return {
            workTitle: "",
            tag: ""
        }
    },

    handleChange: function(e) {
        var name = e.target.name;
        var st = {};
        st[name] = e.target.value;
        this.setState(st);
        console.log(this.state);
        console.log('change');
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var form = this.refs.form;
        var formData = new FormData(form);
        console.log(username);
        $.ajax({
            url: '/' + username + '/handle_artwork_create',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data, textStatus) {
                alert('Create success!');
            },
            error: function(err) {
                console.log(err);
            }
        });
    },

    render: function() {
        return(
            <div id="art-info-wrapper">
                <h2 className="ui dividing header art-form-header">
                    Create Your Artwork
                </h2>
                <form id="art-info-form" ref="form" className="ui form">
                    <div className="field">
                        <label>Title</label>
                        <input type="text" name="workTitle" placeholder="Title"
                        onChange={this.handleChange} value={this.state.workTitle} />
                    </div>
                    <div className="field">
                        <label>Tag</label>
                        <input type="text" name="tag" placeholder="Title"
                        onChange={this.handleChange} value={this.state.tag} />
                    </div>
                    <div className="field">
                        <label>Image</label>
                        <input type="file" name="img" />
                    </div>
                    <button className="ui button art-form-submit" type="submit" onClick={this.handleSubmit} >Create</button>
                </form>
            </div>
        );
    }
});

$(function() {
    ReactDom.render(<ArtInfo />, $('#art-form')[0], null);
});
