import { v2 as cloudinary } from 'cloudinary';

// STEP 7 - ADD STARTUP VALIDATION
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME) {
  throw new Error('Missing CLOUDINARY_CLOUD_NAME');
}
if (!CLOUDINARY_API_KEY) {
  throw new Error('Missing CLOUDINARY_API_KEY');
}
if (!CLOUDINARY_API_SECRET) {
  throw new Error('Missing CLOUDINARY_API_SECRET');
}

// STEP 4 - VERIFY CLOUDINARY CONFIG (Centralized, single initialization)
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// STEP 8 - TEST CONNECTION
if (process.env.NODE_ENV === 'development') {
  cloudinary.api.ping()
    .then(() => console.log('✅ Cloudinary connection successful'))
    .catch((error) => {
      console.error('❌ Cloudinary connection failed:', error.message || error);
      // Fail immediately if credentials are bad during startup
      process.exit(1); 
    });
}

export default cloudinary;
