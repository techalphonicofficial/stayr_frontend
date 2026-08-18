import 'dotenv/config.js'; // This loads env vars synchronously BEFORE other imports
import app from './app.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, (err) => {
  if (err) {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});



// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
 
 
