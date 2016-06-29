




/*
 Source code adapted by Hector Cadavid. - hector.cadavid@escuelaing.edu.co
 Original sources: Racing car example, author: Silver Moon (m00n.silv3r@gmail.com)
 */

var randomIdentifier=Math.random().toString(36).slice(2);

var obstacles=[];
var seeds=[];

//sonar sensors maximum distance range. Distance from the 
//ray's generation point is included
var center_ray_lenght=4.27;
var left_ray_lenght=4.31;
var right_ray_lenght=4.31;

//Get the objects of Box2d Library
var b2Vec2 = Box2D.Common.Math.b2Vec2
        , b2AABB = Box2D.Collision.b2AABB
        , b2BodyDef = Box2D.Dynamics.b2BodyDef
        , b2Body = Box2D.Dynamics.b2Body
        , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        , b2Fixture = Box2D.Dynamics.b2Fixture
        , b2World = Box2D.Dynamics.b2World
        , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
        , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
        , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
        , b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef
        , b2Shape = Box2D.Collision.Shapes.b2Shape
        , b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
        , b2Joint = Box2D.Dynamics.Joints.b2Joint
        , b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef
        ,      b2RayCastInput = Box2D.Collision.b2RayCastInput
        ,      b2RayCastOutput = Box2D.Collision.b2RayCastOutput
        ;


var plan_finished=false;
var plan_execution_error=false;

var center_car_raycast_origin = new b2Vec2( 0,0);
var center_car_raycast_destiny = new b2Vec2();
var center_car_raycast_intersectionPoint=new b2Vec2();

var left_car_raycast_origin = new b2Vec2( 0,0);
var left_car_raycast_destiny = new b2Vec2();
var left_car_raycast_intersectionPoint=new b2Vec2();

var right_car_raycast_origin = new b2Vec2( 0,0);
var right_car_raycast_destiny = new b2Vec2();
var right_car_raycast_intersectionPoint=new b2Vec2();

var closest_right_obstacle=1;
var closest_left_obstacle=1;
var closest_center_obstacle=1;

var last_known_closest_right_obstacle=1;
var last_known_closest_left_obstacle=1;
var last_known_closest_center_obstacle=1;

var current_heading=0;
var last_known_heading=0;

var communication_channel_ready=false;


var game = {
    'rover_commands':function(code)
    {
        
        if (code === "m")
        {
            steering_angle = -30*(Math.PI/180);
            console.log('steering angle:'+steering_angle);
        }
        if (code === "n")
        {
            steering_angle = -15*(Math.PI/180);
            console.log('steering angle:'+steering_angle);
        }
        if (code === "o")
        {
            steering_angle = 0;        
            console.log('steering angle:'+steering_angle);
        }
        if (code === "p")
        {
            steering_angle = 15*(Math.PI/180);
            console.log('steering angle:'+steering_angle);
        }
        if (code === "q")
        {
            steering_angle = 30*(Math.PI/180);
            console.log('steering angle:'+steering_angle);            
        }
        if (code === "M")
        {
            rear_steering_angle = -30*(Math.PI/180);
            console.log('steering angle:'+rear_steering_angle);
        }
        if (code === "N")
        {
            rear_steering_angle = -15*(Math.PI/180);
            console.log('steering angle:'+rear_steering_angle);
        }
        if (code === "O")
        {
            rear_steering_angle = 0;        
            console.log('steering angle:'+rear_steering_angle);
        }
        if (code === "P")
        {
            rear_steering_angle = 15*(Math.PI/180);
            console.log('steering angle:'+rear_steering_angle);
        }
        if (code === "Q")
        {
            rear_steering_angle = 30*(Math.PI/180); 
            console.log('steering angle:'+rear_steering_angle);
        }
        if (code === "v")
        {            
            seeds.push({"x":(car.body.GetPosition().x*scale),"y":(canvas_height -(car.body.GetPosition().y*scale))});        
        }        
            
        
        
        //0: STOP
        if (code === "0")
        {
            car.stop_engine();
        }        
        
        if (code === "a")
        {
            car.gear = 1;
            car.start_engine_at_power(20);            
        }
        if (code === "b")
        {
            car.gear = 1;
            car.start_engine_at_power(40);            
        }
        if (code === "c")
        {
            car.gear = 1;
            car.start_engine_at_power(60);            
        }
        if (code === "d")
        {
            car.gear = 1;
            car.start_engine_at_power(80);            
        }
        if (code === "e")
        {
            car.gear = 1;
            car.start_engine_at_power(100);            
        }

        if (code === "a")
        {
            car.gear = 1;
            car.start_engine_at_power(20);            
        }
        if (code === "b")
        {
            car.gear = 1;
            car.start_engine_at_power(40);            
        }
        if (code === "c")
        {
            car.gear = 1;
            car.start_engine_at_power(60);            
        }
        if (code === "d")
        {
            car.gear = 1;
            car.start_engine_at_power(80);            
        }
        if (code === "e")
        {
            car.gear = 1;
            car.start_engine_at_power(100);            
        }        

        
        //backwards
        if (code === "f")
        {
            car.gear = -1;
            car.start_engine_at_power(20);            
        }
        if (code === "g")
        {
            car.gear = -1;
            car.start_engine_at_power(40);            
        }
        if (code === "h")
        {
            car.gear = -1;
            car.start_engine_at_power(60);            
        }
        if (code === "i")
        {
            car.gear = -1;
            car.start_engine_at_power(80);            
        }
        if (code === "j")
        {
            car.gear = -1;
            car.start_engine_at_power(100);            
        }
        
        
        //up
        
        /*if (code === "38")
        {
            var jsonstr = JSON.stringify({'destiny': 'servidor', 'body':'acuse de recibo' }); 
            //var jsonstr = JSON.stringify({'name': 'position', 'value': '33'});            
            stompClient.send("/app/rutaMensajesEntrantes", {}, jsonstr);
            
            car.gear = 1;
            car.start_engine();
        }*/

    },        
    'screen_width': 0,
    'screen_height': 0,
};

var engine_speed = 0;
var steering_angle = 0;
var rear_steering_angle = 0;
var steer_speed = 30.0;
var max_steer_angle = Math.PI / 3;    //60 degrees to be precise
var world;
var ctx;
var canvas_height;

var carbody;

var min_rotation_unit = Math.PI / 180;


//1 metre of box2d length becomes 50 pixels on canvas
var scale = 50;

//The car object
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



function draw_water_drop(){
    //car.body.GetPosition().x;

}

/*
 Draw a world
 this method is called in a loop to redraw the world
 */
function redraw_world(world, context)
{
    //convert the canvas coordinate directions to cartesian
    ctx.save();
    ctx.translate(0, canvas_height);
    ctx.scale(1, -1);
    world.DrawDebugData();
    ctx.restore();

    ctx.font = 'bold 15px arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
        
    ctx.strokeStyle = "rgb(255, 255, 255)";

    
    
    ctx.setLineDash([10]);
    
    //draw left raytracing
    ctx.beginPath(); // Start the path    
    ctx.moveTo(left_car_raycast_origin.x * scale, canvas_height - (left_car_raycast_origin.y * scale)); // Set the path origin
    ctx.lineTo(left_car_raycast_intersectionPoint.x * scale, canvas_height - (left_car_raycast_intersectionPoint.y * scale));
    //ctx.closePath(); // Close the path
    ctx.stroke();

    //draw right raytracing
    ctx.beginPath(); // Start the path
    ctx.moveTo(right_car_raycast_origin.x * scale, canvas_height - (right_car_raycast_origin.y * scale)); // Set the path origin
    ctx.lineTo(right_car_raycast_intersectionPoint.x * scale, canvas_height - (right_car_raycast_intersectionPoint.y * scale));
    //ctx.closePath(); // Close the path
    ctx.stroke();

    //draw central raytracing
    ctx.beginPath(); // Start the path
    ctx.moveTo(center_car_raycast_origin.x * scale, canvas_height - (center_car_raycast_origin.y * scale)); // Set the path origin
    ctx.lineTo(center_car_raycast_intersectionPoint.x * scale, canvas_height - (center_car_raycast_intersectionPoint.y * scale));
    //ctx.closePath(); // Close the path
    ctx.stroke();

    
    ctx.setLineDash([]);

    //draw planted seeds
    for (i=0;i<seeds.length;i++){
        ctx.beginPath();
        ctx.arc(seeds[i].x, seeds[i].y, 3, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.fill();
    }
    
    



}

function draw_ray(ctx, raycast_origin,scale,canvas_height,raycast_intersectionPoint){
    ctx.setLineDash([10]);
    ctx.beginPath(); // Start the path
    ctx.moveTo(raycast_origin.x * scale, canvas_height - (raycast_origin.y * scale)); // Set the path origin
    ctx.lineTo(raycast_intersectionPoint.x * scale, canvas_height - (raycast_intersectionPoint.y * scale));
    //ctx.closePath(); // Close the path
    ctx.stroke();
    ctx.setLineDash([]);
}

//Create box2d world object
function createWorld()
{
    var gravity = new b2Vec2(0, 0);
    var doSleep = true;

    world = new b2World(gravity, doSleep);

    //setup debug draw
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
    debugDraw.SetDrawScale(scale);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

    world.SetDebugDraw(debugDraw);

    //createBox(world, game.screen_width / 2, 0.5, game.screen_width / 2 - 1, 0.1, {'type': b2Body.b2_staticBody, 'restitution': 0.5});
    //createBox(world, game.screen_width - 1, game.screen_height / 2, 0.1, game.screen_height / 2 - 1, {'type': b2Body.b2_staticBody, 'restitution': 0.5});

    //few lightweight boxes
    var free = {'restitution': 1.0, 'linearDamping': 1.0, 'angularDamping': 1.0, 'density': 0.2};
    
    for (var i=0;i<obstacles_def.length;i++){
        obstacles.push(createBox(world, obstacles_def[i].x, obstacles_def[i].y, obstacles_def[i].width, obstacles_def[i].height, free));
    }

    
    return world;
}

//Create standard boxes of given height , width at x,y
function createBox(world, x, y, width, height, options)
{
    //default setting
    options = $.extend(true, {
        'density': 1.0,
        'friction': 0.0,
        'restitution': 0.2,
        'linearDamping': 0.0,
        'angularDamping': 0.0,
        'gravityScale': 1.0,
        'type': b2Body.b2_dynamicBody
    }, options);

    var body_def = new b2BodyDef();
    var fix_def = new b2FixtureDef;

    fix_def.density = options.density;
    fix_def.friction = options.friction;
    fix_def.restitution = options.restitution;

    fix_def.shape = new b2PolygonShape();

    fix_def.shape.SetAsBox(width, height);
    
    body_def.position.Set(x, y);

    body_def.linearDamping = options.linearDamping;
    body_def.angularDamping = options.angularDamping;

    body_def.type = options.type;

    var b = world.CreateBody(body_def);
    var f = b.CreateFixture(fix_def);

    return b;
}

/*
 This method will draw the world again and again
 called by settimeout , self looped ,
 game_loop
 */
function game_loop()
{
    var updateDelta=0.1;
    var fps = 60;
    var time_step = 1.0 / fps;

    update_car();
    
        
    if (closest_left_obstacle!==last_known_closest_left_obstacle){
        encodeAndSend(LEFT_SENSOR_ID,Math.floor(closest_left_obstacle*proximity_sensor_range));
        last_known_closest_left_obstacle=closest_left_obstacle;
        console.log("Left obstacle at:"+(closest_left_obstacle*proximity_sensor_range));
    }
    if (closest_right_obstacle!==last_known_closest_right_obstacle){
        encodeAndSend(RIGHT_SENSOR_ID,Math.floor(closest_right_obstacle*proximity_sensor_range));
        last_known_closest_right_obstacle=closest_right_obstacle;
        console.log("Encoding and sending:"+(closest_right_obstacle*proximity_sensor_range));
    }
    if (closest_center_obstacle!==last_known_closest_center_obstacle){
        encodeAndSend(CENTER_SENSOR_ID,Math.floor(closest_center_obstacle*proximity_sensor_range));
        last_known_closest_center_obstacle=closest_center_obstacle;
        console.log("CENTER obstacle at:"+(closest_center_obstacle*proximity_sensor_range));
    }
    
    current_heading=car.body.GetAngle();
    
    if (Math.abs(current_heading-last_known_heading)>0.001){
        last_known_heading=current_heading;
        if (communication_channel_ready){
            encodeAndSend(HEADING_ID,Math.abs(Math.round(((current_heading*(180/Math.PI))%360))));
            //console.log("Sending:"+Math.round(((current_heading*(180/Math.PI))%360)));
        } 
    }
    
    
    /*if (Math.abs(car.body.GetPosition().x-carxpos) >= updateDelta){
        carxpos=car.body.GetPosition().x;    
        //console.log("Distance to obstacle:"+(carxpos-obsxpos));
        sendEvent("pos.updated",car.body.GetPosition().x+","+car.body.GetPosition().y);                
    } */   
    
    
    //move the world ahead , step ahead man!!
    world.Step(time_step, 8, 3);
    //Clear the forces , Box2d 2.1a 
    world.ClearForces();

    //redraw the world
    redraw_world(world, ctx);

    //call this function again after 10 seconds
    setTimeout('game_loop()', 2000 / 60);
}

var encodeAndSend = function (sensorId, value) {
    var encoded_sensor_values = [];
    encodeData(value, sensorId, encoded_sensor_values);
    
    //sendEvent("encoded.sensor.data",encoded_sensor_values[0]);
    //sendEvent("encoded.sensor.data",encoded_sensor_values[1]);
    //sendEvent("encoded.sensor.data",encoded_sensor_values[2]);
    sendEncodedEvent("encoded.sensor.data",encoded_sensor_values);
};


// main entry point
$(function ()
{
    game.ctx = ctx = $('#canvas').get(0).getContext('2d');
    var canvas = $('#canvas');

    game.canvas_width = canvas_width = parseInt(canvas.width());
    game.canvas_height = canvas_height = parseInt(canvas.height());

    game.screen_width = game.canvas_width / scale;
    game.screen_height = game.canvas_height / scale;

    //first create the world
    world = createWorld();

    _thecar=create_car();
         
    //Start the Game Loop!!!!!!!
    game_loop();
});


function reset(){
    
    
    game.ctx = ctx = $('#canvas').get(0).getContext('2d');
    var canvas = $('#canvas');
    
    game.ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.canvas_width = canvas_width = parseInt(canvas.width());
    game.canvas_height = canvas_height = parseInt(canvas.height());

    game.screen_width = game.canvas_width / scale;
    game.screen_height = game.canvas_height / scale;

    //first create the world
    world = createWorld();

    _thecar=create_car();
    car.stop_engine();
    steering_angle = 0;  
    rear_steering_angle = 0;
    seeds=[];     
    //Start the Game Loop!!!!!!!
    game_loop();
}




function createSmallBox(v) {
    createBox(world, (game.screen_width / 2), (game.screen_height / 2), 0.1, 0.1, {'type': b2Body.b2_staticBody, 'restitution': 0.5});

}


function create_car()
{
    car_pos = new b2Vec2(carxpos, carypos);
    
    
    
    car_dim = new b2Vec2(0.35, 0.54);
    car.body = createBox(world, car_pos.x, car_pos.y, car_dim.x, car_dim.y, {'linearDamping': 10.0, 'angularDamping': 10.0});
            
    var wheel_dim = new b2Vec2(0.07, 0.14);
    //wheel_dim.Multiply(0.2);

    //front wheels
    left_wheel = createBox(world, car_pos.x - car_dim.x, car_pos.y + car_dim.y - 0.08, wheel_dim.x, wheel_dim.y, {});
    right_wheel = createBox(world, car_pos.x + car_dim.x, car_pos.y + car_dim.y - 0.08, wheel_dim.x, wheel_dim.y, {});

    //center wheels
    left_center_wheel = createBox(world, car_pos.x - car_dim.x, car_pos.y, wheel_dim.x, wheel_dim.y, {});
    right_center_wheel = createBox(world, car_pos.x + car_dim.x, car_pos.y, wheel_dim.x, wheel_dim.y, {});

    //rear wheels
    left_rear_wheel = createBox(world, car_pos.x - car_dim.x, car_pos.y - car_dim.y + 0.08, wheel_dim.x, wheel_dim.y, {});
    right_rear_wheel = createBox(world, car_pos.x + car_dim.x, car_pos.y - car_dim.y + 0.08, wheel_dim.x, wheel_dim.y, {});

    var front_wheels = {'left_wheel': left_wheel, 'right_wheel': right_wheel};

    var rear_wheels = {'left_rear_wheel': left_rear_wheel, 'right_rear_wheel': right_rear_wheel};

    //Wheels with freedoom degrees (front,rear)
    for (var i in front_wheels)
    {
        var wheel = front_wheels[i];

        var joint_def = new b2RevoluteJointDef();
        joint_def.Initialize(car.body, wheel, wheel.GetWorldCenter());

        //after enablemotor , setmotorspeed is used to make the joins rotate , remember!
        joint_def.enableMotor = true;
        joint_def.maxMotorTorque = 100000;

        //this will prevent spinning of wheels when hit by something strong
        joint_def.enableLimit = true;
        joint_def.lowerAngle = -1 * max_steer_angle;
        joint_def.upperAngle = max_steer_angle;

        //create and save the joint
        car[i + '_joint'] = world.CreateJoint(joint_def);
    }

    for (var i in rear_wheels)
    {
        var wheel = rear_wheels[i];

        var joint_def = new b2RevoluteJointDef();
        joint_def.Initialize(car.body, wheel, wheel.GetWorldCenter());

        //after enablemotor , setmotorspeed is used to make the joins rotate , remember!
        joint_def.enableMotor = true;
        joint_def.maxMotorTorque = 100000;

        //this will prevent spinning of wheels when hit by something strong
        joint_def.enableLimit = true;
        joint_def.lowerAngle = -1 * max_steer_angle;
        joint_def.upperAngle = max_steer_angle;

        //create and save the joint
        car[i + '_joint'] = world.CreateJoint(joint_def);
    }


    //Wheels without freedoom degrees     
    var center_wheels = {
        'left_center_wheel': left_center_wheel,
        'right_center_wheel': right_center_wheel
    };

    for (var i in center_wheels)
    {
        var wheel = center_wheels[i];

        var joint_def = new b2PrismaticJointDef();
        joint_def.Initialize(car.body, wheel, wheel.GetWorldCenter(), new b2Vec2(1, 0));

        joint_def.enableLimit = true;
        joint_def.lowerTranslation = joint_def.upperTranslation = 0.0;

        car[i + '_joint'] = world.CreateJoint(joint_def);
    }

    car.body.SetAngle(initialCarAngle);
    
    

    car.left_wheel = left_wheel;
    car.right_wheel = right_wheel;
    car.left_rear_wheel = left_rear_wheel;
    car.right_rear_wheel = right_rear_wheel;

    
    
    return car;
}

//Method to update the car
function update_car()
{
    var wheels = ['left', 'right'];

    var rear_wheels = ['left_rear', 'right_rear'];

    var motorized_wheels = ['left', 'right', 'left_rear', 'right_rear'];

    //Driving
    for (var i in motorized_wheels)
    {
        var d = motorized_wheels[i] + '_wheel';
        var wheel = car[d];

        //get the direction in which the wheel is pointing
        var direction = wheel.GetTransform().R.col2.Copy();

        //console.log(direction.y);
        direction.Multiply(car.engine_speed);

        //apply force in that direction
        wheel.ApplyForce(direction, wheel.GetPosition());
    }

    //Steering
    for (var i in wheels)
    {
        var d = wheels[i] + '_wheel_joint';
        var wheel_joint = car[d];

        //max speed - current speed , should be the motor speed , so when max speed reached , speed = 0;
        var angle_diff = steering_angle - wheel_joint.GetJointAngle();
        wheel_joint.SetMotorSpeed(angle_diff * steer_speed);
    }

    //Rear wheels Steering
    for (var i in rear_wheels)
    {
        var d = rear_wheels[i] + '_wheel_joint';
        var wheel_joint = car[d];

        //max speed - current speed , should be the motor speed , so when max speed reached , speed = 0;
        var angle_diff = rear_steering_angle - wheel_joint.GetJointAngle();
        wheel_joint.SetMotorSpeed(angle_diff * steer_speed);
    }


    closest_left_obstacle=generateRay(left_ray_lenght,car,left_car_raycast_origin,left_car_raycast_destiny,left_car_raycast_intersectionPoint,(-20/180)*Math.PI);
    
    closest_right_obstacle=generateRay(right_ray_lenght,car,right_car_raycast_origin,right_car_raycast_destiny,right_car_raycast_intersectionPoint,(20/180)*Math.PI);
    
    closest_center_obstacle=generateRay(center_ray_lenght,car,center_car_raycast_origin,center_car_raycast_destiny,center_car_raycast_intersectionPoint,0);
            
    
    
    
   
}


/*
 * 
 * RAYTRACING
 * 
 */
function generateRay(rayLength,car,raycast_origin,raycast_destiny,raycast_intersectionPoint,angleFactor){
    
    car_angle=car.body.GetAngle();
    raycast_origin.x = car.body.GetPosition().x;
    raycast_origin.y = car.body.GetPosition().y;

    //10 degrees aprox    
    currentRayAngle = (car_angle*-1)+(angleFactor); 
    
    //calculate points of ray
    raycast_destiny.x = raycast_origin.x + rayLength * Math.sin(currentRayAngle);
    raycast_destiny.y = raycast_origin.y + rayLength * Math.cos(currentRayAngle);

    input = new b2RayCastInput();
    output = new b2RayCastOutput();


    input.p1 = raycast_origin;
    input.p2 = raycast_destiny;
    input.maxFraction = 1;
    closestFraction = 1;

  
    var b = new b2BodyDef();
    var f = new b2FixtureDef();

    for (var i = 0; i < obstacles.length; i++) {
        b = obstacles[i];
        for (f = b.GetFixtureList(); f; f = f.GetNext()) {
            if (!f.RayCast(output, input))
                continue;
            else if (output.fraction < closestFraction) {
                closestFraction = output.fraction;
                intersectionNormal = output.normal;
            }
        }
    }
    


    raycast_intersectionPoint.x = raycast_origin.x + closestFraction * (raycast_destiny.x - raycast_origin.x);
    raycast_intersectionPoint.y = raycast_origin.y + closestFraction * (raycast_destiny.y - raycast_origin.y);

    return closestFraction;    
}


/*----------------------------*/


var socket = new SockJS("/roversim/sockets/ws");
var stompClient = Stomp.over(socket);

// Callback function to be called when stomp client is connected to server
var connectCallback = function () {
    
    stompClient.subscribe('/queue/command/'+randomIdentifier,
            function (data) {
                //console.log("GOT COMMAND:" + data);
                var message=JSON.parse(data.body);                
                game.rover_commands(message.commandCode);
                
                //var message = JSON.parse(data.body);
                //console.log("got:" + message.destiny + "," + message.body);
            }
    );
    
    stompClient.subscribe('/queue/messages/'+randomIdentifier,
            function (data) {
                //console.log("got message:" + data);
                var message=JSON.parse(data.body); 
                
                showError(message.body);                
                
                if (message.messageId===3){
                    console.log(">>>>>> Plan is finshed");
                    plan_finished=true;
                }
                else if (message.messageId===2){
                    plan_execution_error=true;
                }

                //game.rover_commands(message.commandCode);
                
                //var message = JSON.parse(data.body);
                //console.log("got:" + message.destiny + "," + message.body);
            }
    ); 
    
    communication_channel_ready = true;
    
};

// Callback function to be called when stomp client could not connect to server
var errorCallback = function (error) {
    alert(error.headers.message);
};

// Connect to server via websocket
stompClient.connect("guest", "guest", connectCallback, errorCallback);


sendEvent = function (name,value) {
    
                //avoid messaging when the plan has stopped (after a success exection or an error).
                if (!plan_finished && !plan_execution_error){
                    var jsessionId = randomIdentifier;                
                    var jsonstr = JSON.stringify({'clientSessionId': jsessionId, 'name': name, 'value':value});
                    //console.log('>>>>>Sending '+jsonstr)
                    stompClient.send("/app/event", {}, jsonstr); 
                    
                }
            };


sendEncodedEvent = function (name,values) {
    
                //avoid messaging when the plan has stopped (after a success exection or an error).
                if (!plan_finished && !plan_execution_error){
                    var jsessionId = randomIdentifier;                
                    console.log('Sending:'+values);
                    var part1=JSON.stringify({'clientSessionId': jsessionId, 'name': name, 'values':[values[0],values[1],values[2]]});
                    
                    stompClient.send("/app/encodedevent", {}, part1);                     
                }
            };

