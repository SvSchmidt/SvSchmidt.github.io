interface HSLColor {
    hue: number;
    saturation: number;
    lightning: number;
}

class illuminator {
    public static instance: illuminator;

    private _pixels: Uint16Array;
    private _playground: HTMLCanvasElement;
    
    public get playgroundContext() {
        return this._playground.getContext('2d');
    }

    public get playgroundRect() {
        return this._playground.getBoundingClientRect();
    }

    public get pixelSize() {
        return 3;
    }

    constructor(public sizeX, public sizeY) {
        // we only need one instance of illuminator
        if(illuminator.instance) return;

        // save instance for references
        illuminator.instance = this;
        window['illuminator'] = illuminator;
    }

    /**
     * start application
     */
    public start() {
        this._generatePlayground();
    }

    /**
     * generate the playground (the canvas)
     * and fill it with black pixels
     */
    private _generatePlayground() {
        // initiate fields
        this._pixels = new Uint16Array(this.sizeX * this.sizeY);
        this._playground = document.createElement('canvas');
        this._playground.width = this.sizeX;
        this._playground.height = this.sizeY;

        // append playground canvas to document body and add mouse listener
        document.body.appendChild(this._playground);
        this._playground.addEventListener('mousemove', this._colorize.bind(this));
        
        // fill canvas with black pixels
        Array.prototype.forEach.call(this._pixels, (elem, index) => {
            this._pixels[index] = 0;
            this._renderPixel(this._pixels[index], index % this.sizeX, Math.floor(index / this.sizeY));
        });
    }

    /**
     * mouse handler to colorize the pixels the mouse is crossing
     * @param e: MouseEvent
     */
    private _colorize(e: MouseEvent) {
        this._isPositionOverPlayground(e.x, e.y) && this._renderRandomPixel(e.x, e.y);
    }

    /**
     * check if the given position (in pixels) is within the playground
     * @param x:  number x-coordinate to check
     * @param y:  number y-coordinate to check
     * @return boolean
     */
    private _isPositionOverPlayground(x: number, y: number) {
        return (x > this.playgroundRect.left && x < this.playgroundRect.right) 
            && (y > this.playgroundRect.top && y < this.playgroundRect.bottom);
    }

    /**
     * render a pixel with a random color at the given position
     * @param x: number  x-coordinate
     * @param y: number  y-coordinate
     */
    private _renderRandomPixel(x: number, y: number) {
        x = Math.round(x / this.pixelSize);
        y = Math.round(y / this.pixelSize);

        let index = x * y;
        let value = this._pack(this._getRandom(0, 60), this._getRandom(15, 25), this._getRandom(0, 25));

        this._renderPixel(value, x, y);

        this._pixels[index] = value;
    }

    /**
     * render the given pixel specified by its value, x and y coordinates
     * within the canvas
     * @param value: number  the packed value
     * @param x: number  x-coordinate
     * @param y: number  y-coordinate
     */
    private _renderPixel(value: number, x: number, y: number) {
        let pixel = this._unpack(value);

        this.playgroundContext.fillStyle = `hsl(${pixel.hue * 6}, ${pixel.saturation * 4}%, ${pixel.lightning * 4}%)`;
        this.playgroundContext.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
    }

    /**
     * pack the hue, saturation and lightning value into a single number
     * using fancy bitwise operations
     * @param hue: number  hue value of HSL color
     * @param saturation: number  saturation value of HSL color
     * @param lightning: number  lightning value of HSL color
     * @return number  HSL values packed to a single number
     */
    private _pack(hue: number, saturation: number, lightning: number) {
        let packaged = 0;
        packaged |= hue;
        packaged <<= 5;
        packaged |= saturation;
        packaged <<= 5;
        packaged |= lightning;

        return packaged;
    }

    /**
     * unpack a value previously packed with _pack
     * to get an object representing a HSL color
     * @param packaged: number  the packed value of HSL
     * @return HSLColor  object containing hue, saturation and lightning
     */
    private _unpack(packaged: number) {
        return <HSLColor>{
            hue: (packaged >> 5 >> 5) & 63,
            saturation: (packaged >> 5) & 31,
            lightning: packaged & 31
        };
    }

    /**
     * helper method to get a random number between min and max
     * @param min: number  min value
     * @param max: number  max value
     * @return number  number between min and max
     */
    private _getRandom(min: number, max: number) {
        return (Math.random() * (max - min) + min) | 0;
    }
}

export = illuminator;