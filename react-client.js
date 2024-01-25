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

const client = new ProductService('localhost:50051', grpc.credentials.createInsecure());

// Get All Products
client.GetAllProducts({}, (error, response) => {
  if (!error) {
    console.log('All Products:', response.products);
  } else {
    console.error(error);
  }
});

// Add Product
const newProduct = {
  name: 'New Product',
  description: 'Description of the new product',
  price: 19.99,
};

client.AddProduct(newProduct, (error, response) => {
  if (!error) {
    console.log('Added Product:', response);
  } else {
    console.error(error);
  }
});
