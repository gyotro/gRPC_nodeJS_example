const grpc = require('grpc');
const proto_loader = require('@grpc/proto-loader');
//carichiamo il file proto
const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
const packageDefinition = proto_loader.loadSync('./service.proto', options);

const grpcObject = grpc.loadPackageDefinition(packageDefinition);
//carichiamo il package
const todopackage = grpcObject.todopackage;
// instanziamo il client (puntiamo al service Todo)
const client = new todopackage.Todo('localhost:40000', grpc.credentials.createInsecure());
const TodoItem = { 
    id: -1,
    description: 'initiailize',
    status: 'false'
};
client.createTodo( TodoItem , 
    (err, response) => { 
    console.log(`Received response: ${JSON.stringify(response)}`);
    if (err) {
        console.log(`Error: ${err}`);
    }
});
console.log("--------------getTodos----------------");
client.getTodos( {}, (err, response) => {
    console.log(`Received response: ${JSON.stringify(response)}`);
    if (err) {
        console.log(`Error: ${err}`);
    }
});

// in questo caso non ci sarà callback, ma un stream
const call = client.streamTodos();
call.on("data", (todo) => {
    console.log(`Received response from server: ${JSON.stringify(todo)}`);
});
call.on("end", () => {
    console.log("Stream ended");
});

