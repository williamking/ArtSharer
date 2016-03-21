/*
    Author: William
    Description: A plug-in component for picking color
*/

function windowTocanvas(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
}

var ColorPicker =   {
    RGB_picker: function() {
	    this.pickerRG = document.createElement("canvas");
	    this.pickerB = document.createElement("canvas");
	    this.dom = document.createElement("div");
        this.sample = document.createElement("div");
        this.watcher = document.createElement("div");
        this.watcher.className = "color-watcher";
        this.sample.className = "color-sample"
        this.dom.className = "color-picker";
        this.pickerRG.className = "rg-picker";
        this.pickerB.className = 'b-picker';
        this.dom.appendChild(this.pickerRG);
        this.dom.appendChild(this.pickerB);
        this.dom.appendChild(this.sample);
        this.dom.appendChild(this.watcher);

        this.currentColor = '#000000';

        this.onWatch = 0;
 
        this.RGCanvas = this.pickerRG.getContext('2d');
        this.BCanvas = this.pickerB.getContext('2d');

        this.colorHex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B' , 'C', 'D', 'E', 'F'];

        this.pickRGEvent = (function(that) {
            return function(e) {
                var loc = windowTocanvas(that.pickerRG, e.clientX, e.clientY);
                var colorData = that.RGCanvas.getImageData(loc.x, loc.y, 1, 1);
                var hexColor = that.getColorHex(colorData.data[0], colorData.data[1], colorData.data[2]);

                that.updateBCanvas(hexColor);
            }
        })(this);

        this.moveBEvent = (function(that) {
            return function(e) {
                if (that.onWatch == 0) return;
                var loc = windowTocanvas(that.pickerB, e.clientX, e.clientY);
                var colorData = that.BCanvas.getImageData(loc.x, loc.y, 1, 1);
                var color = that.getColorHex(colorData.data[0], colorData.data[1], colorData.data[2]);
                that.updateWatcher(color, e.clientX, e.clientY);
            }
        })(this);

        this.overBEvent = (function(that) {
            return function(e) {
                that.onWatch = 1;
                that.pickerB.addEventListener('mousemove', that.moveBEvent, false);
                that.watcher.style.display = 'block';
            };
        })(this);

        this.outBEvent = (function(that) {
            return function(e) {
                that.onWatch = 0;
                that.pickerB.removeEventListener('mousemove', that.moveBEvent, false);
                that.watcher.style.display = 'none';
            };
        })(this);

        this.pickBEvent = (function(that) {
            return function(e) {
                var loc = windowTocanvas(that.pickerB, e.clientX, e.clientY);
                var colorData = that.BCanvas.getImageData(loc.x, loc.y, 1, 1);
                that.currentColor = that.getColorHex(colorData.data[0], colorData.data[1], colorData.data[2]);

                that.updateSample();
            };
        })(this);

        this.init();
    }   
}

ColorPicker.RGB_picker.prototype = {
	addTo: function(element) {
		element.appendChild(this.dom);
	},
    init: function(height, width) {
        this.pickerRG.style.height = this.pickerB.style.height = (height || 40) + 'px';
        this.pickerRG.style.width = this.pickerB.style.width = (width || 100) + 'px';
        this.pickerRG.height = this.pickerB.height = ((height || 40));
        this.pickerRG.width = this.pickerB.width = ((width || 100));

        this.initCanvas();
        this.updateSample();
        this.addEvent();
    },
    addEvent: function() {
        this.pickerRG.addEventListener('click', this.pickRGEvent, false);
        this.pickerB.addEventListener('click', this.pickBEvent, false);
        this.pickerB.addEventListener('mouseover', this.overBEvent, false);
        this.pickerB.addEventListener('mouseout', this.outBEvent, false);
    },
    initCanvas: function() {
        var gradient = this.RGCanvas.createLinearGradient(0, 0, this.pickerRG.width, 0);
        gradient.addColorStop(0, '#F00');
        gradient.addColorStop(0.2, '#FF0');
        gradient.addColorStop(0.4, '#0F0');
        gradient.addColorStop(0.6, '#0FF');
        gradient.addColorStop(0.8, '#00F');
        gradient.addColorStop(1, '#F0F');
        this.RGCanvas.fillStyle = gradient;
        this.RGCanvas.fillRect(0, 0, this.pickerRG.width, this.pickerRG.height);

        this.updateBCanvas('#F00');
    },
    getColorHex: function(r, g, b) {
        return '#' + this.colorHex[parseInt(r / 16)] + this.colorHex[r % 16] +  this.colorHex[parseInt(g / 16)] + this.colorHex[g % 16]
        + this.colorHex[parseInt(b / 16)] + this.colorHex[b % 16];
    },
    updateSample: function() {
        this.sample.style.backgroundColor = this.currentColor;
    },
    updateBCanvas: function(color) {
        var gradient = this.BCanvas.createLinearGradient(0, 0, this.pickerB.width, 0);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(1, color);
        this.BCanvas.fillStyle = gradient;
        this.BCanvas.fillRect(0, 0, this.pickerB.width, this.pickerB.height);
    },
    updateWatcher: function(color, x, y) {
        this.watcher.style.backgroundColor = color;
        this.watcher.style.left = x + 'px';
        this.watcher.style.top = (y - parseInt(this.watcher.height)) + 'px';
    }
}

module.exports = ColorPicker;
