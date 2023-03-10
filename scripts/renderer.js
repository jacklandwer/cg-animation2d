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

        // Spinning Polygon
        this.polygon1coords = [
            { x: 200, y: 150, w: 1 },
            { x: 100, y: 250, w: 1 },
            { x: 250, y: 200, w: 1 },
            { x: 350, y: 200, w: 1 }
        ];
        this.polygon1speed = .5;
        this.polygon1angle = Math.PI / 30;
        this.polygon1rotation = this.polygon1angle * (Math.PI / 180);
        this.polygon1center = { x: 225, y: 200 };

        this.polygon2coords = [
            { x: 350, y: 475, w: 1 },
            { x: 425, y: 500, w: 1 },
            { x: 475, y: 550, w: 1 },
            { x: 400, y: 525, w: 1 }
        ];
        this.polygon2speed = 1;
        this.polygon2angle = Math.PI / 60;
        this.polygon2rotation = this.polygon2angle * 2 * (Math.PI / 180);
        this.polygon2center = { x: 412, y: 512 };

        this.polygon3coords = [
            { x: 510, y: 220, w: 1 },
            { x: 475, y: 150, w: 1 },
            { x: 400, y: 100, w: 1 },
            { x: 550, y: 75, w: 1 },
            { x: 600, y: 150, w: 1 }
        ];
        this.polygon3speed = 2;
        this.polygon3angle = Math.PI / 90;
        this.polygon3rotation = this.polygon3angle * 3 * (Math.PI / 180);
        this.polygon3center = { x: 500, y: 150 };

        // Scale
        this.scale = 1
        this.scalex = 1
        this.scaley = 1
        this.scale_dir = 0.002
        this.scale_dir2 = 0.001

        // Fun slide
        this.finalx = 200;
        this.finald = { x: 1 / this.fps };
        this.finalbp1 = { x: 300, y: 300 };
        this.finalbp2 = { x: 350, y: 300 };
        this.finalbp3 = { x: 400, y: 300 };
        this.finalbp4 = { x: 450, y: 300 };
        this.finalbp5 = { x: 500, y: 300 };
        this.finalbr = 15;
        this.finals1 = 1.5;
        this.finals2 = 1.375;
        this.finals3 = 1.25;
        this.finals4 = 1.125;
        this.finals5 = 1;
        this.finalsd1 = 0.0006;
        this.finalsd2 = 0.0006;
        this.finalsd3 = 0.0006;
        this.finalsd4 = 0.0006;
        this.finalsd5 = 0.0006;
        this.finalLoad = { x: 400, y: 450 };
        this.finalLoadAngle = 0;
        this.finalLoadScale = 1;
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
        // Slide 0 - bouncing ball 
        if (this.slide_idx == 0) {
            this.ball_pos.x += this.ball_dir.x * delta_time;
            this.ball_pos.y += this.ball_dir.y * delta_time;
            // Check for collision with edges and reverse direction if necessary
            if (this.ball_pos.x + this.ball_radius > this.canvas.width || this.ball_pos.x - this.ball_radius < 0) {
                this.ball_dir.x *= -1;
            }
            if (this.ball_pos.y + this.ball_radius > this.canvas.height || this.ball_pos.y - this.ball_radius < 0) {
                this.ball_dir.y *= -1;
            }
        }

        if (this.slide_idx == 1) {
            // COMPUTE POLYGON1
            let sumX = 0;
            let sumY = 0;
            let numVertices = this.polygon1coords.length;
            for (let i = 0; i < numVertices; i++) {
                sumX += this.polygon1coords[i].x;
                sumY += this.polygon1coords[i].y;
            }
            let centerX = sumX / numVertices;
            let centerY = sumY / numVertices;
            let translatedPoly1 = this.polygon1coords.map(({ x, y, w }) => ({ x: x - centerX, y: y - centerY, w }));
            let theta = this.polygon1angle;
            let rotatedPoly1 = translatedPoly1.map(({ x, y, w }) => ({
                x: x * Math.cos(theta) - y * Math.sin(theta),
                y: x * Math.sin(theta) + y * Math.cos(theta),
                w
            }));
            let transBackPoly1 = rotatedPoly1.map(({ x, y, w }) => ({ x: x + centerX, y: y + centerY, w }));
            this.polygon1coords = transBackPoly1;
            // COMPUTE POLYGON2
            let sumX2 = 0;
            let sumY2 = 0;
            let numVertices2 = this.polygon2coords.length;
            for (let i = 0; i < numVertices2; i++) {
                sumX2 += this.polygon2coords[i].x;
                sumY2 += this.polygon2coords[i].y;
            }
            let centerX2 = sumX2 / numVertices2;
            let centerY2 = sumY2 / numVertices2;
            let translatedPoly2 = this.polygon2coords.map(({ x, y, w }) => ({ x: x - centerX2, y: y - centerY2, w }));
            theta = this.polygon2angle;
            let rotatedPoly2 = translatedPoly2.map(({ x, y, w }) => ({
                x: x * Math.cos(theta) - y * Math.sin(theta),
                y: x * Math.sin(theta) + y * Math.cos(theta),
                w
            }));
            let transBackPoly2 = rotatedPoly2.map(({ x, y, w }) => ({ x: x + centerX2, y: y + centerY2, w }));
            this.polygon2coords = transBackPoly2;
            // COMPUTE POLYGON3
            let sumX3 = 0;
            let sumY3 = 0;
            let numVertices3 = this.polygon3coords.length;
            for (let i = 0; i < numVertices3; i++) {
                sumX3 += this.polygon3coords[i].x;
                sumY3 += this.polygon3coords[i].y;
            }
            let centerX3 = sumX3 / numVertices3;
            let centerY3 = sumY3 / numVertices3;
            let translatedPoly3 = this.polygon3coords.map(({ x, y, w }) => ({ x: x - centerX3, y: y - centerY3, w }));
            theta = this.polygon3angle * -1; //rotates clockwise 
            let rotatedPoly3 = translatedPoly3.map(({ x, y, w }) => ({
                x: x * Math.cos(theta) - y * Math.sin(theta),
                y: x * Math.sin(theta) + y * Math.cos(theta),
                w
            }));
            let transBackPoly3 = rotatedPoly3.map(({ x, y, w }) => ({ x: x + centerX3, y: y + centerY3, w }));
            this.polygon3coords = transBackPoly3;
        }

        // Slide 2 - scale
        if (this.slide_idx == 2) {
            this.scale += this.scale_dir * delta_time;
            this.scalex += this.scale_dir * delta_time;
            this.scaley += this.scale_dir2 * delta_time;
            if (this.scale > 1.5 || this.scale < -1.5) {
                this.scale_dir *= -1;
            }
            if (this.scalex > 1.5 || this.scalex < -1.5) {
                this.scale_dir2 *= -1;
            }
            if (this.scaley > 1.5 || this.scaley < -1.5) {
                this.scale_dir2 *= -1;
            }
        }

        // Slide 3 - fun
        if (this.slide_idx == 3) {
            this.finalx += this.finald.x * delta_time;
            if (this.finalx > 600) {
                this.finalx = 200;
            }
            this.finals1 += this.finalsd1 * delta_time;
            if (this.finals1 > 1.5 || this.finals1 < 1) {
                this.finalsd1 *= -1;
            }
            this.finals2 += this.finalsd2 * delta_time;
            if (this.finals2 > 1.5 || this.finals2 < 1) {
                this.finalsd2 *= -1;
            }
            this.finals3 += this.finalsd3 * delta_time;
            if (this.finals3 > 1.5 || this.finals3 < 1) {
                this.finalsd3 *= -1;
            }
            this.finals4 += this.finalsd4 * delta_time;
            if (this.finals4 > 1.5 || this.finals4 < 1) {
                this.finalsd4 *= -1;
            }
            this.finals5 += this.finalsd5 * delta_time;
            if (this.finals5 > 1.5 || this.finals5 < 1) {
                this.finalsd5 *= -1;
            }
            this.finalLoadAngle += Math.PI / 12;
            this.finalLoadScale = (this.finalLoadScale + .1) % 1.5;
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
        let blue = [0, 0, 0, 255];
        let numSegments = 30; // number of line segments used to approximate the circle
        let vertices = [];
        for (let i = 0; i < numSegments; i++) {
            let angle = 2 * Math.PI * i / numSegments;
            let x = this.ball_pos.x + this.ball_radius * Math.cos(angle);
            let y = this.ball_pos.y + this.ball_radius * Math.sin(angle);
            vertices.push(Vector3(x, y, 1));
        }
        this.drawConvexPolygon(vertices, blue);
    }

    //
    drawSlide1() {
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction

        let polygon1vertices = [];
        let numVertices = 4;
        for (let i = 0; i < numVertices; i++) {
            let x = this.polygon1coords[i].x;
            let y = this.polygon1coords[i].y;
            polygon1vertices.push(Vector3(x, y, 1));
        }
        let polygon1color = [0, 100, 64, 220];
        this.drawConvexPolygon(polygon1vertices, polygon1color);

        let polygon2vertices = [];
        numVertices = 4;
        for (let i = 0; i < numVertices; i++) {
            let x = this.polygon2coords[i].x;
            let y = this.polygon2coords[i].y;
            polygon2vertices.push(Vector3(x, y, 1));
        }
        let polygon2color = [100, 5, 200, 230];
        this.drawConvexPolygon(polygon2vertices, polygon2color);

        let polygon3vertices = [];
        numVertices = 5;
        for (let i = 0; i < numVertices; i++) {
            let x = this.polygon3coords[i].x;
            let y = this.polygon3coords[i].y;
            polygon3vertices.push(Vector3(x, y, 1));
        }
        let polygon3color = [55, 33, 155, 215];
        this.drawConvexPolygon(polygon3vertices, polygon3color);

    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions
        let polygon1 = [
            //center = 350, 333
            new Vector3(150 - this.scale * 50, 333 - this.scale * 33, 1),
            new Vector3(150 + this.scale * 50, 333 - this.scale * 33, 1),
            new Vector3(150, 333 + this.scale * 67, 1)
        ];
        let polygon2 = [
            //center = 600, 325
            new Vector3(600 - this.scalex * 125, 325 - this.scaley * 25, 1),
            new Vector3(600 - this.scalex * 25, 325 - this.scaley * 75, 1),
            new Vector3(600 + this.scalex * 125, 325 + this.scaley * 25, 1),
            new Vector3(600 - this.scalex * 75, 325 + this.scaley * 75, 1),
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
        let blue = [0, 0, 0, 255];
        let loadbar = [
            new Vector3(200, 200, 1),
            new Vector3(200, 150, 1),
            new Vector3(0 + this.finalx, 150, 1),
            new Vector3(0 + this.finalx, 200, 1),
        ];
        this.drawConvexPolygon(loadbar, blue);

        let numSegments = 30; // number of line segments used to approximate the circle

        let ball1 = [];
        for (let i = 0; i < numSegments; i++) {
            let angle = 2 * Math.PI * i / numSegments;
            let x = this.finalbp1.x + this.finalbr * Math.cos(angle) * this.finals1;
            let y = this.finalbp1.y + this.finalbr * Math.sin(angle) * this.finals1;
            ball1.push(Vector3(x, y, 1));
        }
        this.drawConvexPolygon(ball1, blue);

        let ball2 = [];
        for (let i = 0; i < numSegments; i++) {
            let angle = 2 * Math.PI * i / numSegments;
            let x = this.finalbp2.x + this.finalbr * Math.cos(angle) * this.finals2;
            let y = this.finalbp2.y + this.finalbr * Math.sin(angle) * this.finals2;
            ball2.push(Vector3(x, y, 1));
        }
        this.drawConvexPolygon(ball2, blue);

        let ball3 = [];
        for (let i = 0; i < numSegments; i++) {
            let angle = 2 * Math.PI * i / numSegments;
            let x = this.finalbp3.x + this.finalbr * Math.cos(angle) * this.finals3;
            let y = this.finalbp3.y + this.finalbr * Math.sin(angle) * this.finals3;
            ball3.push(Vector3(x, y, 1));
        }
        this.drawConvexPolygon(ball3, blue);

        let ball4 = [];
        for (let i = 0; i < numSegments; i++) {
            let angle = 2 * Math.PI * i / numSegments;
            let x = this.finalbp4.x + this.finalbr * Math.cos(angle) * this.finals4;
            let y = this.finalbp4.y + this.finalbr * Math.sin(angle) * this.finals4;
            ball4.push(Vector3(x, y, 1));
        }
        this.drawConvexPolygon(ball4, blue);

        let ball5 = [];
        for (let i = 0; i < numSegments; i++) {
            let angle = 2 * Math.PI * i / numSegments;
            let x = this.finalbp5.x + this.finalbr * Math.cos(angle) * this.finals5;
            let y = this.finalbp5.y + this.finalbr * Math.sin(angle) * this.finals5;
            ball5.push(Vector3(x, y, 1));
        }
        this.drawConvexPolygon(ball5, blue);

        let ball6 = [];
        let ball6color = [221, 160, 221, 200];
        let numSides = 12;
        let polygonRadius = 40;
        for (let i = 0; i < numSides / 4; i++) {
            let x = this.finalLoad.x + polygonRadius * Math.cos((2 * Math.PI / numSides) * i);
            let y = this.finalLoad.y + polygonRadius * Math.sin((2 * Math.PI / numSides) * i);
            ball6.push(Vector3(x, y, 1));
        }
        for (let i = 0; i < numSides * 4; i++) {
            let rotation = (2 * Math.PI / numSides) * i + this.finalLoadAngle;
            let copy = [...ball6]; 
            copy.forEach(vertex => {
                let x = vertex.values[0][0] - this.finalLoad.x;
                let y = vertex.values[1][0] - this.finalLoad.y;
                vertex.values[0][0] = x * Math.cos(rotation) - y * Math.sin(rotation) + this.finalLoad.x;
                vertex.values[1][0] = x * Math.sin(rotation) + y * Math.cos(rotation) + this.finalLoad.y;
            });
            this.drawConvexPolygon(copy, ball6color); 
        }

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
