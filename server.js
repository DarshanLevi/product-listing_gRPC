const grpc = require('@grpc/grpc-js');
const { loadPackageDefinition } = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('product.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const { ProductService } = grpc.loadPackageDefinition(packageDefinition);

// In-memory data store for simplicity
const products = [];

// Function to generate unique IDs
const generateUniqueId = () => Date.now().toString();

const server = new grpc.Server();

server.addService(ProductService.service, {
  GetAllProducts: (_, callback) => {
    // Return all products
    callback(null, { products });
  },
  AddProduct: (product, callback) => {
    // Add a product to the data store
    const newProduct = {
      id: generateUniqueId(),
      name: product.name,
      description: product.description,
      price: product.price,
    };
    products.push(newProduct);
    // Return the added product
    callback(null, newProduct);
  },
  CreateProduct: (request, callback) => {
    // Create a product in the data store
    const newProduct = {
      id: generateUniqueId(),
      name: request.name,
      description: request.description,
      price: request.price,
    };
    products.push(newProduct);
    // Return the created product
    callback(null, newProduct);
  },
});

const PORT = 50051;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(`Server binding failed: ${err}`);
  } else {
    console.log(`Server running at http://0.0.0.0:${port}`);
    server.start();
  }
});
