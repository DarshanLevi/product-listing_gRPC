const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const connectDB = require('./db');
const Product = require('./productModel');

const packageDefinition = protoLoader.loadSync('product.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const { ProductService } = grpc.loadPackageDefinition(packageDefinition);

const generateUniqueId = () => Date.now().toString();
const server = new grpc.Server();

server.addService(ProductService.service, {
  GetAllProducts: async (_, callback) => {
    try {
      const products = await Product.find({});
      callback(null, { products });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: 'Internal Server Error',
      });
    }
  },

  CreateProduct: async (call, callback) => {
    try {
      const newProduct = new Product({
        id: generateUniqueId(),
        name: call.request.name,
        description: call.request.description,
        price: call.request.price,
      });

      const savedProduct = await newProduct.save();
      callback(null, savedProduct);
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: 'Internal Server Error',
      });
    }
  },

  GetProductById: async (call, callback) => {
    try {
      const product = await Product.findById(call.request.id);
      if (product) {
        callback(null, product);
      } else {
        callback({
          code: grpc.status.NOT_FOUND,
          details: 'Product not found',
        });
      }
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: 'Internal Server Error',
      });
    }
  },
});

connectDB();

const PORT = 50051;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(`Server binding failed: ${err}`);
  } else {
    console.log(`Server running at http://0.0.0.0:${port}`);
    server.start();
  }
});
