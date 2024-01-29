// react-client.js

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('product.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const { ProductService } = grpc.loadPackageDefinition(packageDefinition);

const client = new ProductService('localhost:50051', grpc.credentials.createInsecure());

// Get All Products
client.GetAllProducts({}, (error, response) => {
  if (!error) {
    console.log('All Products:', response.products);
  } else {
    console.error(error);
  }
});

// Create Product
const newProduct = {
  name: 'New ',
  description: ' new product',
  price: 5000,
};

client.CreateProduct(newProduct, (error, response) => {
  if (!error) {
    console.log('Added Product:', response);
  } else {
    console.error(error);
  }
});
