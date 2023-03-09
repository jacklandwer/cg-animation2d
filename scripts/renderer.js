class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // limit_fps_flag:      bool 
    // fps:                 int
    constructor(canvas, limit_fps_flag, fps) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.limit_fps = limit_fps_flag;
        this.fps = fps;
        this.start_time = null;
        this.prev_time = null;

        // Ball properties
        this.ball_pos = { x: 50, y: 50 };
        this.ball_dir = { x: 5 / this.fps, y: 5 / this.fps };
        this.ball_radius = 20;

        this.scale = 1
        this.scalex = 1
        this.scaley = 1
        this.scale_dir = 0.002
        this.scale_dir2 = 0.001
    }

    // flag:  bool
    limitFps(flag) {
        this.limit_fps = flag;
    }

    // n:  int
    setFps(n) {
        this.fps = n;
    }

    // idx: int
    setSlideIndex(idx) {
        this.slide_idx = idx;
    }

    animate(timestamp) {
        // Get time and delta time for animation
        if (this.start_time === null) {
            this.start_time = timestamp;
            this.prev_time = timestamp;
        }
        let time = timestamp - this.start_time;
        let delta_time = timestamp - this.prev_time;
        //console.log('animate(): t = ' + time.toFixed(1) + ', dt = ' + delta_time.toFixed(1));

        // Update transforms for animation
        this.updateTransforms(time, delta_time);

        // Draw slide
        this.drawSlide();

        // Invoke call for next frame in animation
        if (this.limit_fps) {
            setTimeout(() => {
                window.requestAnimationFrame((ts) => {
                    this.animate(ts);
                });
            }, Math.floor(1000.0 / this.fps));
        }
        else {
            window.requestAnimationFrame((ts) => {
                this.animate(ts);
            });
        }

        // Update previous time to current one for next calculation of delta time
        this.prev_time = timestamp;
    }

    //
    updateTransforms(time, delta_time) {
        // TODO: update any transformations needed for animation
        this.ball_pos.x += this.ball_dir.x * delta_time;
        this.ball_pos.y += this.ball_dir.y * delta_time;
 
        // Check for collision with edges and reverse direction if necessary
        if (this.ball_pos.x + this.ball_radius > this.canvas.width || this.ball_pos.x - this.ball_radius < 0) {
            this.ball_dir.x *= -1;
        }
        if (this.ball_pos.y + this.ball_radius > this.canvas.height || this.ball_pos.y - this.ball_radius < 0) {
            this.ball_dir.y *= -1;
        }
 
        this.scale += this.scale_dir * delta_time;
        this.scalex += this.scale_dir * delta_time;
        this.scaley += this.scale_dir2 * delta_time;

        if(this.scale > 1.5 || this.scale < -1.5 ){
            this.scale_dir *= -1;
        }
        if(this.scalex > 1.5 || this.scalex < -1.5 ){
            this.scale_dir2 *= -1;
        }
        if(this.scaley > 1.5 || this.scaley < -1.5 ){
            this.scale_dir2 *= -1;
        }
    }
    
    //
    drawSlide() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0();
                break;
            case 1:
                this.drawSlide1();
                break;
            case 2:
                this.drawSlide2();
                break;
            case 3:
                this.drawSlide3();
                break;
        }
    }

    //
    drawSlide0() {
        // TODO: draw bouncing ball (circle that changes direction whenever it hits an edge)
        
        
        // Following line is example of drawing a single polygon
        // (this should be removed/edited after you implement the slide)
        let blue = [0, 0, 0, 255];
        let numSegments = 30; // number of line segments used to approximate the circle

        let vertices = [];

        for (let i = 0; i < numSegments; i++) {
            let angle = 2 * Math.PI * i / numSegments;
            let x = this.ball_pos.x + this.ball_radius * Math.cos(angle);
            let y = this.ball_pos.y + this.ball_radius * Math.sin(angle);
            vertices.push(Vector3(x, y, 1));
        }
        this.drawConvexPolygon(vertices, blue)
    }

    //
    drawSlide1() {
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction
        
        
    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions
        let polygon1 = [
            //center = 350, 333
            new Vector3(150-this.scale*50, 333-this.scale*33, 1),
            new Vector3(150+this.scale*50, 333-this.scale*33, 1),
            new Vector3(150, 333 + this.scale*67, 1)
        ];
        let polygon2 = [
            //center = 600, 325
            new Vector3(600 - this.scalex*125, 325 - this.scaley*25, 1),
            new Vector3(600 - this.scalex*25, 325 - this.scaley*75, 1),
            new Vector3(600 + this.scalex *125, 325 + this.scaley*25, 1),
            new Vector3(600 - this.scalex*75, 325 + this.scaley*75, 1),

        ];

        let color1 = [255, 0, 0, 255];
        let color2 = [0, 255, 0, 255];

        this.drawConvexPolygon(polygon1, color1);
        this.drawConvexPolygon(polygon2, color2);

    }

    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)
        
        
    }
    
    // vertex_list:  array of object [Matrix(3, 1), Matrix(3, 1), ..., Matrix(3, 1)]
    // color:        array of int [R, G, B, A]
    drawConvexPolygon(vertex_list, color) {
        this.ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
        this.ctx.beginPath();
        let x = vertex_list[0].values[0][0] / vertex_list[0].values[2][0];
        let y = vertex_list[0].values[1][0] / vertex_list[0].values[2][0];
        this.ctx.moveTo(x, y);
        for (let i = 1; i < vertex_list.length; i++) {
            x = vertex_list[i].values[0][0] / vertex_list[i].values[2][0];
            y = vertex_list[i].values[1][0] / vertex_list[i].values[2][0];
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
};
