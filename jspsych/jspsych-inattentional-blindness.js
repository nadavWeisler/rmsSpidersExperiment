//Create New Canvas
function CreateNewCanvas(_id, _className, _width, _height, _position, _visibility) {
    let newCanvas = document.createElement('canvas');
    newCanvas.id = _id;
    newCanvas.className = _className;
    newCanvas.width = _width;
    newCanvas.height = _height;
    newCanvas.style.position = _position;
    newCanvas.style.visibility = _visibility;
    return newCanvas;
}

class Line {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "#0000FF";
        this.draw = function (context) {
            context.save();
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
            context.restore();
        };
    }
}

class Fixation {
    constructor(x, y, thickness) {
        this.x = x;
        this.y = y;
        this.color = "#0000FF";
        this.thickness = thickness;
        this.draw = function (context) {
            context.save();
            context.beginPath();
            context.lineWidth = "3";
            context.strokeStyle = "#0000FF";
            context.fillStyle = "#777777";
            context.rect(this.x, this.y, this.thickness, this.thickness);
            context.stroke();
            context.fill();
            context.restore();
        };
    }
}

class Target {
    constructor(x, y, dx, target_width, target_thickness) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.target_width = target_width;
        this.target_thickness = target_thickness;
        this.cmVel = 3;
        this.color = "#b2b2b2";
        this.draw = function (context) {
            context.save();
            context.fillStyle = this.color;
            context.fillRect(
                this.x + (this.target_width / 2) - (this.target_thickness / 2),
                this.y,
                this.target_thickness,
                this.target_width
            );
            context.fillRect(
                this.x,
                this.y + (this.target_width / 2) - (this.target_thickness / 2),
                this.target_width,
                this.target_thickness
            );
            context.restore();
        };
        this.move = function () {
            this.x += this.cmVel * this.dx;
        };
    }
}

class L {
    constructor(posX, posY, color, dX, dY, thickness, width, vertical_limit, canvas) {
        this.speedSwitchTime = Math.floor(((Math.random() * 300) + 100) * 10);
        this.newSpeedStartTime = new Date().getTime();
        this.thickness = thickness;
        this.width = width;
        this.boxLeft = 0;
        this.boxRight = canvas.width;
        this.boxTop = canvas.height / 2 - vertical_limit;
        this.boxBottom = canvas.height / 2 + vertical_limit - this.width;
        this.color = color;
        this.vel = 0;
        this.cmVel = Math.floor((Math.random() * 5) + 3);
        this.dY = dY;
        this.dX = dX;
        this.posX = posX;
        this.posY = posY;
        this.hit = false;
        this.onTop = null;
        this.onBottom = null;
        this.hits = 0;
        this.move = function () {
            if (this.posX > this.boxRight - this.width) {
                this.posX = this.boxRight - this.width;
                this.dX *= -1;
            }
            if (this.posX < this.boxLeft) {
                this.posX = this.boxLeft;
                this.dX *= -1;
            }
            if (this.posY > this.boxBottom) {
                this.posY = this.boxBottom;
                this.dY *= -1;
                this.hit = false;
            }
            if (this.posY < this.boxTop) {
                this.posY = this.boxTop;
                this.dY *= -1;
                this.hit = false;
            }
            this.time = new Date().getTime();
            this.newSpeedTime = this.time - this.newSpeedStartTime;
            if (this.newSpeedTime >= this.speedSwitchTime) {
                this.newSpeedStartTime = new Date().getTime();
                this.cmVel = Math.floor((Math.random() * 5) + 3);
                if ((this.posY < this.boxBottom) && (this.posY > this.boxTop) &&
                    (this.posX > this.boxLeft) && (this.posX < this.boxRight)) {
                    if (Math.random() * 10 > 5) {
                        this.dX *= -1;
                    }
                    if (Math.random() * 10 > 5) {
                        this.dY *= -1;
                    }
                }
            }
            this.vel = this.cmVel;
            this.posX += this.vel * this.dX;
            this.posY += this.vel * this.dY;
            if ((this.posY + this.width < canvas.height / 2) && (this.onTop != true)) {
                if (this.onBottom == true) {
                    this.hits++;
                }
                this.onTop = true;
                this.onBottom = false;
            }
            if ((this.posY > canvas.height / 2) && (this.onBottom != true)) {
                if (this.onTop == true) {
                    this.hits++;
                }
                this.onTop = false;
                this.onBottom = true;
            }
        };
        this.draw = function (context) {
            this.bottomX = this.posX;
            this.bottomY = this.posY + this.width - this.thickness;
            this.topX = this.posX;
            this.topY = this.posY;
            context.save();
            context.fillStyle = this.color;
            context.fillRect(this.topX, this.topY, this.thickness,
                this.width - this.thickness);
            context.fillRect(this.bottomX, this.bottomY, this.width,
                this.thickness);
            context.restore();
        };
    }
}

class T {
    constructor(posX, posY, color, dX, dY, thickness, width, vertical_limit, canvas) {
        this.speedSwitchTime = Math.floor(((Math.random() * 300) + 100) * 10);
        this.newSpeedStartTime = new Date().getTime();
        this.thickness = thickness;
        this.width = width;
        this.boxLeft = 0;
        this.boxRight = canvas.width;
        this.boxTop = canvas.height / 2 - vertical_limit;
        this.boxBottom = canvas.height / 2 + vertical_limit - this.width;
        this.color = color;
        this.vel = 0;
        this.cmVel = Math.floor((Math.random() * 5) + 3);
        this.dY = dY;
        this.dX = dX;
        this.posX = posX;
        this.posY = posY;
        this.onTop = null;
        this.onBottom = null;
        this.hits = 0;
        this.move = function () {
            if (this.posX > this.boxRight - this.width) {
                this.posX = this.boxRight - this.width;
                this.dX *= -1;
            }
            if (this.posX < this.boxLeft) {
                this.posX = this.boxLeft;
                this.dX *= -1;
            }
            if (this.posY > this.boxBottom) {
                this.posY = this.boxBottom;
                this.dY *= -1;
                this.hit = false;
            }
            if (this.posY < this.boxTop) {
                this.posY = this.boxTop;
                this.dY *= -1;
                this.hit = false;
            }
            this.time = new Date().getTime();
            this.newSpeedTime = this.time - this.newSpeedStartTime;
            if (this.newSpeedTime >= this.speedSwitchTime) {
                this.newSpeedStartTime = new Date().getTime();
                this.cmVel = Math.floor((Math.random() * 5) + 3);
                if ((this.posY + this.width < this.boxBottom) && (this.posY > this.boxTop) &&
                    (this.posX > this.boxLeft) && (this.posX + this.width < this.boxRight)) {
                    if (Math.random() * 10 > 5) {
                        this.dX *= -1;
                    }
                    if (Math.random() * 10 > 5) {
                        this.dY *= -1;
                    }
                }
            }
            this.vel = this.cmVel;
            this.posX += this.vel * this.dX;
            this.posY += this.vel * this.dY;
            if ((this.posY + this.width < canvas.height / 2) && (this.onTop != true)) {
                if (this.onBottom == true) {
                    this.hits++;
                }
                this.onTop = true;
                this.onBottom = false;
            }
            if ((this.posY > canvas.height / 2) && (this.onBottom != true)) {
                if (this.onTop == true) {
                    this.hits++;
                }
                this.onTop = false;
                this.onBottom = true;
            }
        };
        this.draw = function (context) {
            this.topX = this.posX;
            this.topY = this.posY;
            this.bottomX = this.posX + this.width / 2 - this.thickness / 2;
            this.bottomY = this.posY + this.thickness;
            context.save();
            context.fillStyle = this.color;
            context.fillRect(this.topX, this.topY, this.width, this.thickness);
            context.fillRect(this.bottomX, this.bottomY, this.thickness, this.width - this.thickness);
            context.restore();
        };
    }
}

function get_target(target_position, frame_width, frame_height, target_width, cm, target_thickness) {
    if (target_position == TARGET_POSITIONS.pvfar) {
        return new Target(
            x = frame_width,
            y = frame_height / 2 - cm * 5.9 - target_width / 2,
            dx = -1,
            target_width = target_width,
            target_thickness = target_thickness
        );
    }
    if (target_position == TARGET_POSITIONS.pfar) {
        return new Target(
            x = frame_width,
            y = frame_height / 2 - cm * 4.8 - target_width / 2,
            dx = -1,
            target_width = target_width,
            target_thickness = target_thickness
        );
    }
    if (target_position == TARGET_POSITIONS.pnear) {
        return new Target(
            x = frame_width,
            y = frame_height / 2 - cm * 2.4 - target_width / 2,
            dx = -1,
            target_width = target_width,
            target_thickness = target_thickness
        );
    }
    if (target_position == TARGET_POSITIONS.line) {
        return new Target(
            x = frame_width,
            y = frame_height / 2 - target_width / 2,
            dx = -1,
            target_width = target_width,
            target_thickness = target_thickness
        );
    }
    if (target_position == TARGET_POSITIONS.nnear) {
        return new Target(
            x = frame_width,
            y = frame_height / 2 + cm * 2.4 - target_width / 2,
            dx = -1,
            target_width = target_width,
            target_thickness = target_thickness
        );
    }
    if (target_position == TARGET_POSITIONS.nfar) {
        return new Target(
            x = frame_width,
            y = frame_height / 2 + cm * 4.8 - target_width / 2,
            dx = -1,
            target_width = target_width,
            target_thickness = target_thickness
        );
    }
    if (target_position == TARGET_POSITIONS.nvfar) {
        return new Target(
            x = frame_width,
            y = frame_height / 2 + cm * 5.9 - target_width / 2,
            dx = -1,
            target_width = target_width,
            target_thickness = target_thickness
        );
    }
}

const TARGET_POSITIONS = {
    pvfar: "pvfar",
    pfar: "pfar",
    pnear: "pnear",
    line: "line",
    nnear: "nnear",
    nfar: "nfar",
    nvfar: "nvfar"
}

jsPsych.plugins["inattentional-blindness"] = (function () {
    let plugin = {};

    plugin.info = {
        name: 'inattentional-blindness',
        description: '',
        parameters: {
            cm: {
                type: jsPsych.plugins.parameterType.INT,
                default: 43
            },
            background_color: {
                type: jsPsych.plugins.parameterType.STRING,
                default: "#777777"
            },
            show_target: {
                type: jsPsych.plugins.parameterType.BOOL,
                default: false
            },
            target_position: {
                type: jsPsych.plugins.parameterType.INT,
                default: 0
            },
            target_shape: {
                type: jsPsych.plugins.parameterType.STRING,
                default: "T"
            },
            target_shape_color: {
                type: jsPsych.plugins.parameterType.STRING,
                default: "green"
            },
            distractors_shapes: {
                type: jsPsych.plugins.parameterType.COMPLEX,
                default: ["L", "T"]
            },
            distractors_shape_colors: {
                type: jsPsych.plugins.parameterType.COMPLEX,
                default: ["red", "blue"]
            },
            distractors_count: {
                type: jsPsych.plugins.parameterType.INT,
                default: 8,
                description: 'Number of distractors total, must be even.'
            },
            distractor_width: {
                type: jsPsych.plugins.parameterType.INT,
                default: 43
            },
            shape_size: {
                type: jsPsych.plugins.parameterType.INT,
                default: 100
            },
            line_color: {
                type: jsPsych.plugins.parameterType.STRING,
                default: "#0000FF"
            },
            line_width: {
                type: jsPsych.plugins.parameterType.INT,
                default: 5
            },
            line_height: {
                type: jsPsych.plugins.parameterType.INT,
                default: 2
            },
            fixation_shape: {
                type: jsPsych.plugins.parameterType.COMPLEX,
                default: []
            },
            fixation_color: {
                type: jsPsych.plugins.parameterType.STRING,
                default: "#0000FF"
            },
            question: {
                type: jsPsych.plugins.parameterType.STRING,
                default: "Did you see a green T?"
            },
            frame_width: {
                type: jsPsych.plugins.parameterType.INT,
                default: 666
            },
            frame_height: {
                type: jsPsych.plugins.parameterType.INT,
                default: 546
            },
            frame_time: {
                type: jsPsych.plugins.parameterType.INT,
                default: 33,
                description: 'frameTime of 33 results in FPS of 30.'
            },
            trial_duration: {
                type: jsPsych.plugins.parameterType.INT,
                default: 15000
            },
            trial_waiting_time: {
                type: jsPsych.plugins.parameterType.INT,
                default: 1000
            },
            target_width: {
                type: jsPsych.plugins.parameterType.INT,
                default: 43
            },
            target_thickness: {
                type: jsPsych.plugins.parameterType.INT,
                default: 5
            },
        }
    };

    plugin.trial = function (display_element, trial) {
        // Clear previous
        display_element.innerHTML = '';
        setTimeout(function () {
            // Start timing for within trial ITI
            display_element.innerHTML = '';
            let startCompute = Date.now();
            // Set up canvas
            window.requestAnimationFrame = function (callback) {
                return window.setTimeout(callback, trial.frame_time);
            }
            window.cancelAnimationFrame = window.clearTimeout;

            // Hide mouse
            document.body.style.cursor = "none";

            // this array holds handlers from setTimeout calls
            // that need to be cleared if the trial ends early
            let setTimeoutHandlers = [];

            // store response
            let response = {
                rt: -1,
                count: 0,
                key: -1
            };

            const frame_width = Number(trial.frame_width);
            const frame_height = Number(trial.frame_height);
            const distractor_width = Number(trial.distractor_width);
            const cm = Number(trial.cm);

            const frame_canvas = CreateNewCanvas('frame_canvas', 'frame_canvas',
                frame_width, frame_height, "block", "visible");
            frame_canvas.style.backgroundColor = trial.background_color;

            display_element.append(frame_canvas);

            const frame_context = frame_canvas.getContext("2d");
            const distractor_vertical_limit = frame_height / 2
            const top_limit = frame_height / 2 - distractor_vertical_limit
            const bottom_limit = frame_height / 2 + distractor_vertical_limit - distractor_width
            const distractor_thickness = Math.round(0.25 * cm)
            const target_width = Number(trial.target_width);

            function get_distractors() {
                let distractors = [];
                var positions = [];
                for (i = 0; i < trial.distractors_count; i++) {
                    var xDir = 1;
                    if (Math.random() * 10 > 5) {
                        xDir *= -1
                    }
                    valid_position = false;
                    let x = 0
                    let y = 0
                    while (!valid_position) {
                        valid_position = true;

                        x = Math.floor(Math.random() * (frame_width - distractor_width));
                        y = Math.floor(Math.random() * (frame_width - distractor_width));

                        positions.forEach(function (element) {
                            var xDist = x - element[0],
                                yDist = y - element[1],
                                distractor_distance = Math.sqrt((xDist * xDist) + (yDist * yDist));
                            if (distractor_distance < trial.distractor_width * 2) {
                                valid_position = false;
                            }
                            else if ((x < trial.distractor_width * 2) || (y < trial.distractor_width * 2)) {
                                valid_position = false;
                            }
                        });

                        if ((y < top_limit) || (y > bottom_limit)) {
                            valid_position = false;
                        }
                        else if ((y + distractor_width > frame_height / 2 - distractor_width * 3) &&
                            (y < frame_height / 2 + distractor_width * 3)) {
                            valid_position = false
                        }
                        if (y > frame_canvas.height / 2) {
                            yDir = -1
                        }
                        else {
                            yDir = 1
                        }
                    }

                    if (i % 2 == 0) {
                        color = "#FFFFFF";
                    }
                    else {
                        color = "#000000";
                    }
                    positions.push([x, y]);
                    if (i >= trial.distractors_count / 2) {
                        distractors.push(new T(x, y, color, xDir, yDir, distractor_thickness, distractor_width, distractor_vertical_limit, frame_canvas));
                    }
                    else {
                        distractors.push(new L(x, y, color, xDir, yDir, distractor_thickness, distractor_width, distractor_vertical_limit, frame_canvas));
                    }
                }

                return distractors;
            }

            const distractors = get_distractors();
            const line = new Line(
                x = 0,
                y = frame_canvas.height / 2 - trial.line_height / 2,
                width = frame_canvas.width,
                height = trial.line_height
            );
            const fixation = new Fixation(
                x = frame_canvas.width / 2 - distractor_thickness / 2,
                y = frame_canvas.height / 2 - distractor_thickness / 2,
                thickness = distractor_thickness
            );

            const target = trial.show_target ? get_target(
                trial.target_position,
                frame_width,
                frame_height,
                target_width,
                cm,
                distractor_thickness
            ) : undefined;

            console.log(target);
            let last_call_time = undefined;
            let fps_array = [];
            let trial_fps_array = [];
            let fps_sum = 0;
            let fps_mean = 0;
            let trial_start_time = 0;

            function run_animation_loop() {
                // Clear the canvas
                frame_context.clearRect(0, 0, frame_width, frame_height);

                // Draw line and fixation
                line.draw(frame_context, frame_canvas);
                fixation.draw(frame_context);

                let current_time = new Date().getTime();

                // Check the condition for showing the target
                if (trial.show_target && ((current_time - trial_start_time) >= 5000)) {
                    // Debugging: Log to console to check if this block is reached
                    console.log('Showing target');
                    // Move and draw the target
                    target.move();
                    target.draw(frame_context);
                }

                // Move and draw distractors
                distractors.forEach(function (distractor) {
                    distractor.move();
                    distractor.draw(frame_context);
                });

                



                animation = window.requestAnimationFrame(run_animation_loop);
            }

            //Function for start experiment
            const start_trial = function () {
                // start the response listener
                if (JSON.stringify(trial.choices) !== JSON.stringify(["none"])) {
                    let keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                        callback_function: after_response,
                        valid_responses: trial.choices,
                        rt_method: 'performance',
                        persist: false,
                        allow_held_key: false
                    });
                }

                frame_context.clearRect(0, 0, frame_canvas.width, frame_canvas.height);

                setTimeout(function () {
                    trial_start_time = new Date().getTime();
                    run_animation_loop();
                }, trial.trial_waiting_time);

                setTimeout(function () {
                    window.cancelAnimationFrame(animation);
                    frame_context.clearRect(0, 0, frame_canvas.width, frame_canvas.height);
                    end_trial();
                }, trial.trial_duration + trial.trial_waiting_time);
            };

            // function to handle responses by the subject
            let after_response = function (info) {

                // only record the first response
                if (response.key === -1) {
                    response = info;
                }
                end_trial();
            };

            const get_hit_count = function () {
                white_count = 0;
                black_count = 0;
                distractors.forEach(function (distractor) {
                    if (distractor.color === "#FFFFFF") {
                        white_count += distractor.hits;
                    }
                    else {
                        black_count += distractor.hits;
                    }
                });
                return [white_count, black_count];
            };

            const end_trial = function () {
                let i;

                // kill any remaining setTimeout handlers
                for (i = 0; i < setTimeoutHandlers.length; i++) {
                    clearTimeout(setTimeoutHandlers[i]);
                }

                // kill keyboard listeners
                if (typeof keyboardListener !== 'undefined') {
                    jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                }

                // clear the display
                display_element.innerHTML = '';

                hits = get_hit_count();
                white_hit_count = hits[0];
                black_hit_count = hits[1];

                trial_data = {
                    "white_hit_count": white_hit_count,
                    "black_hit_count": black_hit_count,
                    "is_target": trial.show_target,
                    "target_position": trial.target_position,
                }

                // move on to the next trial
                setTimeout(function () {
                    jsPsych.finishTrial(trial_data);
                }, 10);
            };

            start_trial();
        }, 10);
    };

    return plugin;
})();