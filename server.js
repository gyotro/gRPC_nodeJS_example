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
// instanziamo il server
const server = new grpc.Server();
// binding del server
server.bind('0.0.0.0:40000', grpc.ServerCredentials.createInsecure());
// registro il servizio (nel nostro caso Todo)
server.addService(todopackage.Todo.service, 
    {
        // metodo create (la chiave dovrà avere il nome del metodo definito nella nostra protobuffer)
        "createTodo" : createTodo,
        // metodo read (la chiave dovrà avere il nome del metodo definito nella nostra protobuffer)
        "getTodos" : getTodos,
        "streamTodos" : streamTodos
    });

server.start();
const todos = [];
// i metodi in grpc prendono sempre 2 parametrini: il primo è il request, il secondo è una callback
function createTodo(call, callback) {
    console.log(`Received request: ${JSON.stringify(call.request)}`);
    
    const TodoItem = {
        id: Math.floor(Math.random() * 1000),
        description: 'Some Title: ' + call.request.description,
        status: "true"
    }
    console.log(`Sending response: ${JSON.stringify(TodoItem)}`);
    todos.push(TodoItem);
    callback(null, TodoItem);
}

function getTodos(call, callback) {
    console.log(`Sending response: ${JSON.stringify(todos)}`);
    callback(null, { items: todos });
}

function streamTodos(call, callback) {
    // per gli stream non avremo una callback
    todos.forEach(todo => {
        call.write(todo);
    });
    call.end();
 }