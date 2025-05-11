const express = require('express');
const cors = require('cors');
// const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.router');
const { swaggerUi, swaggerSpec } = require('./config/swagger');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);

const onRoadServiceRoutes = require('./routes/onroad-service.routes');
app.use('/api/onroad-service', onRoadServiceRoutes);
app.use('/api/users', userRoutes);
const serviceRoutes = require('./routes/service.routes');
app.use('/api/services', serviceRoutes);
const serviceCenterRoutes = require('./routes/serviceCenter.routes');
app.use('/api/service-centers', serviceCenterRoutes);
const serviceBookingRoutes = require('./routes/serviceBooking.routes');
app.use('/api/bookings', serviceBookingRoutes);
const vehicleRoutes = require('./routes/vehicle.routes');
app.use('/api/vehicles', vehicleRoutes);
const reviewRoutes = require('./routes/review.routes');
app.use('/api/reviews', reviewRoutes);
const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);
const productCategoryRoutes = require('./routes/product-category.routes');
app.use('/api/product-categories', productCategoryRoutes);

const notificationRoutes = require('./routes/notification.routes');
app.use('/api/notifications', notificationRoutes);
const orderRoutes = require('./routes/order.routes');
app.use('/api/orders', orderRoutes);
const orderItemRoutes = require('./routes/orderItem.routes');
app.use('/api/order-items', orderItemRoutes);

const _2fa = require('./routes/2fa.router');
app.use('/api/auth',_2fa);

const faceAuthRoutes = require('./routes/faceAuth.routes'); // Adjust the path as necessary
// Register the routes
app.use('/api/faceauth', faceAuthRoutes);

// app.get('/', (req, res) => res.send('🚗 Vehicle Service API'));
app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>MOTORELLO - Vehicle Service Platform API</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
            color: #333333;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 100vh;
            text-align: center;
            padding: 20px;
          }
          h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            color: #ff4c4c;
          }
          p {
            font-size: 1.2rem;
            margin-bottom: 20px;
            line-height: 1.8;
            max-width: 700px;
          }
          .btn {
            padding: 12px 24px;
            font-size: 1.1rem;
            font-weight: 600;
            background-color: #ff4c4c;
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            text-decoration: none;
          }
          .btn:hover {
            background-color: #e03232;
          }
          .image-container {
            margin-bottom: 30px;
          }
          .image-container img {
            width: 100%;
            max-width: 350px;


          }
        </style>
      </head>
      <body>
        <div class="image-container">
          <img src="https://media-hosting.imagekit.io/2030f828445b40ea/Motorello.png?Expires=1839308790&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=FcTHh5hEhOnvOFbbxjLn6L-glzFf-7UEUXMsZmX01vwYJIs236wFbOrByQ1eVqF9tI5Y8u6LrJE3m4OQoAf7s~JSChJPukjYL7LaTiPJBc1CSvFdV-QDlB~vAf1FBRYjS~ndwwkhdRdxIVLr4pju6XybkGqm7wSzwIpI4H7JlubB27XAMg78s9bvnoTPlAcwA0SrLrXkDMW80f~2Edzc7BGSVBt6z9yBB4kI5hwq-vCc5VaDGkEjNkDdvonUeg9rdnJdL-CTqY-elLpeEbmztzBlB9nr2Puomw4n3qcn2TLkIRGZDoSpL-NLCp3i8wTnx~oCIcOvXklu9gEDXHJf2g__" alt="MOTORELLO - Vehicle Service Platform" />
        </div>
        <p>Your all-in-one solution for managing vehicle servicing, parts ordering, and real-time mechanic communication.</p>
        <a href="/api/docs" class="btn">View API Docs</a>
      </body>
      </html>
    `);
  });
  
  
module.exports = app;

