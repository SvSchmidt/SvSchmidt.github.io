define(["require", "exports"], function (require, exports) {
    var illuminator = (function () {
        function illuminator(sizeX, sizeY) {
            this.sizeX = sizeX;
            this.sizeY = sizeY;
            // we only need one instance of illuminator
            if (illuminator.instance)
                return;
            // save instance for references
            illuminator.instance = this;
            window['illuminator'] = illuminator;
        }
        Object.defineProperty(illuminator.prototype, "playgroundContext", {
            get: function () {
                return this._playground.getContext('2d');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(illuminator.prototype, "playgroundRect", {
            get: function () {
                return this._playground.getBoundingClientRect();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(illuminator.prototype, "pixelSize", {
            get: function () {
                return 3;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * start application
         */
        illuminator.prototype.start = function () {
            this._generatePlayground();
        };
        /**
         * generate the playground (the canvas)
         * and fill it with black pixels
         */
        illuminator.prototype._generatePlayground = function () {
            var _this = this;
            // initiate fields
            this._pixels = new Uint16Array(this.sizeX * this.sizeY);
            this._playground = document.createElement('canvas');
            this._playground.width = this.sizeX;
            this._playground.height = this.sizeY;
            // append playground canvas to document body and add mouse listener
            document.body.appendChild(this._playground);
            this._playground.addEventListener('mousemove', this._colorize.bind(this));
            // fill canvas with black pixels
            Array.prototype.forEach.call(this._pixels, function (elem, index) {
                _this._pixels[index] = 0;
                _this._renderPixel(_this._pixels[index], index % _this.sizeX, Math.floor(index / _this.sizeY));
            });
        };
        /**
         * mouse handler to colorize the pixels the mouse is crossing
         * @param e: MouseEvent
         */
        illuminator.prototype._colorize = function (e) {
            this._isPositionOverPlayground(e.x, e.y) && this._renderRandomPixel(e.x, e.y);
        };
        /**
         * check if the given position (in pixels) is within the playground
         * @param x:  number x-coordinate to check
         * @param y:  number y-coordinate to check
         * @return boolean
         */
        illuminator.prototype._isPositionOverPlayground = function (x, y) {
            return (x > this.playgroundRect.left && x < this.playgroundRect.right)
                && (y > this.playgroundRect.top && y < this.playgroundRect.bottom);
        };
        /**
         * render a pixel with a random color at the given position
         * @param x: number  x-coordinate
         * @param y: number  y-coordinate
         */
        illuminator.prototype._renderRandomPixel = function (x, y) {
            x = Math.round(x / this.pixelSize);
            y = Math.round(y / this.pixelSize);
            var index = x * y;
            var value = this._pack(this._getRandom(0, 60), this._getRandom(15, 25), this._getRandom(0, 25));
            this._renderPixel(value, x, y);
            this._pixels[index] = value;
        };
        /**
         * render the given pixel specified by its value, x and y coordinates
         * within the canvas
         * @param value: number  the packed value
         * @param x: number  x-coordinate
         * @param y: number  y-coordinate
         */
        illuminator.prototype._renderPixel = function (value, x, y) {
            var pixel = this._unpack(value);
            this.playgroundContext.fillStyle = "hsl(" + pixel.hue * 6 + ", " + pixel.saturation * 4 + "%, " + pixel.lightning * 4 + "%)";
            this.playgroundContext.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
        };
        /**
         * pack the hue, saturation and lightning value into a single number
         * using fancy bitwise operations
         * @param hue: number  hue value of HSL color
         * @param saturation: number  saturation value of HSL color
         * @param lightning: number  lightning value of HSL color
         * @return number  HSL values packed to a single number
         */
        illuminator.prototype._pack = function (hue, saturation, lightning) {
            var packaged = 0;
            packaged |= hue;
            packaged <<= 5;
            packaged |= saturation;
            packaged <<= 5;
            packaged |= lightning;
            return packaged;
        };
        /**
         * unpack a value previously packed with _pack
         * to get an object representing a HSL color
         * @param packaged: number  the packed value of HSL
         * @return HSLColor  object containing hue, saturation and lightning
         */
        illuminator.prototype._unpack = function (packaged) {
            return {
                hue: (packaged >> 5 >> 5) & 63,
                saturation: (packaged >> 5) & 31,
                lightning: packaged & 31
            };
        };
        /**
         * helper method to get a random number between min and max
         * @param min: number  min value
         * @param max: number  max value
         * @return number  number between min and max
         */
        illuminator.prototype._getRandom = function (min, max) {
            return (Math.random() * (max - min) + min) | 0;
        };
        return illuminator;
    })();
    return illuminator;
});
//# sourceMappingURL=illuminator.js.map