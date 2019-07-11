// https://stackoverflow.com/questions/51831824/where-to-store-class-instance-for-reusability-in-redux

const createMySocketMiddleware = (url) => {
  let socket;

  return storeAPI => next => action => {
      switch(action.type) {
          case "LOGIN" : {
              socket = createMyWebsocket(url);

              socket.on("message", (message) => {
                  storeAPI.dispatch({
                      type : "SOCKET_MESSAGE_RECEIVED",
                      payload : message
                  });
              });
              break;
          }
          case "SEND_WEBSOCKET_MESSAGE": {
              socket.send(action.payload);
              return;
          }
      }

      return next(action);
  }
}
