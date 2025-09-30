module.exports = (io, socket) => {

    // socket.on("account-auth:server", (payload) => {
    //     console.log("[account-auth:server]", payload);
    //     socket.emit("account-auth", payload);
    // });

    // socket.on("create-account:server", (payload) => {
    //     console.log("[create-account:server]", payload);
    //     socket.emit("create-account", payload);
    // });

    socket.on("new-task:server", (payload) => {
        console.log("[new-task:server]", payload);
        socket.broadcast.emit("new-task", payload)
    })

    socket.on("received-new-task:server", (payload) => {
        console.log("[received-new-task:server]", payload);
        //TODO: updated the isdelivered attribute
        socket.broadcast.emit("received-new-task", payload);// Include  updated list
    })

    socket.on("get-task-list:server", (payload) => {
        console.log("[get-task-list:server]", payload);
        socket.broadcast.emit("get-task-list", payload);
    })
    
    socket.on("task-list:server", (payload) => {
        console.log("[get-task-list:server]", payload);
        socket.broadcast.emit("task-list", payload);
    })

    socket.on("delete-task:server", (payload) => {
        console.log("[delete-task:server]", payload);
        socket.broadcast.emit("delete-task", payload)
    });

    socket.on("edit-task:server", (payload) => {
        console.log("[edit-task:server]", payload);
        socket.broadcast.emit("edit-task", payload);
    })

    socket.on("task-updated:server", (payload) => {
        console.log("[edit-task:server]", payload);
        socket.broadcast.emit("task-updated", payload); // Include  updated list
    })

    // socket.on("take-screenshot:server", (payload) => {
    //     console.log("[take-screenshot:server]", payload);
    //     socket.emit("take-screenshot", payload);
    // });

}