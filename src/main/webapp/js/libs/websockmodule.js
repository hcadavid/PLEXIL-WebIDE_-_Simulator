$( document ).ready(function () {
    //Create stomp client over sockJS protocol
    var socket = new SockJS("/roversim/sockets/ws");
    var stompClient = Stomp.over(socket);

    // Callback function to be called when stomp client is connected to server
    var connectCallback = function () {
        stompClient.subscribe('/topic/newmessage',
                function (data) {
                    console.log("got:" + data);
                    var message = JSON.parse(data.body);
                    console.log("got:" + message.destiny + "," + message.body);
                }
        );
    };

    // Callback function to be called when stomp client could not connect to server
    var errorCallback = function (error) {
        alert(error.headers.message);
    };

    // Connect to server via websocket
    stompClient.connect("guest", "guest", connectCallback, errorCallback);
});


