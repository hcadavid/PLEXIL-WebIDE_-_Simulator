//Not integrated into roversim yet

var car = {
    'top_engine_speed': 2.5,
    'engine_on': false,
    'start_engine_at_power': function (powerpercent)
    {
        car.engine_on = true;
        car.engine_speed = car.gear * (powerpercent*(car.top_engine_speed/100));
    },
    'start_engine': function ()
    {
        car.engine_on = true;
        car.engine_speed = car.gear * car.top_engine_speed;
    },
    'stop_engine': function ()
    {
        car.engine_on = false;
        car.engine_speed = 0;
    },
    'gear': 1
};



var commands = [];

commands["m"] = function () {
    steering_angle = -30 * (Math.PI / 180);
    console.log('steering angle:' + steering_angle);
};
commands["n"] = function () {
    steering_angle = -15 * (Math.PI / 180);
    console.log('steering angle:' + steering_angle);
};
commands["o"] = function () {
    steering_angle = 0;
    console.log('steering angle:' + steering_angle);
};
commands["p"] = function () {
    steering_angle = 15 * (Math.PI / 180);
    console.log('steering angle:' + steering_angle);
};
commands["q"] = function () {
    steering_angle = 30 * (Math.PI / 180);
    console.log('steering angle:' + steering_angle);
};
commands["M"] = function () {
    rear_steering_angle = -30 * (Math.PI / 180);
    console.log('steering angle:' + rear_steering_angle);
};
commands["N"] = function () {
    rear_steering_angle = -15 * (Math.PI / 180);
    console.log('steering angle:' + rear_steering_angle);
};
commands["O"] = function () {
    rear_steering_angle = 0;
    console.log('steering angle:' + rear_steering_angle);
};
commands["P"] = function () {
    rear_steering_angle = 15 * (Math.PI / 180);
    console.log('steering angle:' + rear_steering_angle);
};
commands["Q"] = function () {
    rear_steering_angle = 30 * (Math.PI / 180);
    console.log('steering angle:' + rear_steering_angle);
};
commands["v"] = function () {
    seeds.push({"x": (car.body.GetPosition().x * scale), "y": (canvas_height - (car.body.GetPosition().y * scale))});
};
commands["0"] = function () {
    car.stop_engine();
};
commands["a"] = function () {
    car.gear = 1;
    car.start_engine_at_power(20);

};
commands["b"] = function () {
    car.gear = 1;
    car.start_engine_at_power(40);

};
commands["c"] = function () {
    car.gear = 1;
    car.start_engine_at_power(60);

};
commands["d"] = function () {
    car.gear = 1;
    car.start_engine_at_power(80);

};
commands["e"] = function () {
    car.gear = 1;
    car.start_engine_at_power(100);

};
commands["f"] = function () {
    car.gear = -1;
    car.start_engine_at_power(20);

};
commands["g"] = function () {
    car.gear = -1;
    car.start_engine_at_power(40);

};
commands["h"] = function () {
    car.gear = -1;
    car.start_engine_at_power(60);
};
commands["i"] = function () {
    car.gear = -1;
    car.start_engine_at_power(80);

};
commands["j"] = function () {
    car.gear = -1;
    car.start_engine_at_power(100);
};



