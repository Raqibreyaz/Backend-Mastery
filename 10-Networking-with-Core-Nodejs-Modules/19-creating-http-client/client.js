import http from "node:http";

const client_request = http.request({
  method: "POST",
  port: "4000",
  hostname: "127.0.0.1",
});

client_request.write("hi from http client");

// when server's response comes
client_request.on("response", (response) => {
  // when server sends data
  response.on("data", (data) => console.log(data.toString()));
  client_request.end();
});
