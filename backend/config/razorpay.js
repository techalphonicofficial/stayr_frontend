import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

let razorpayInstance = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } else {
    console.warn('Razorpay keys are missing. Razorpay won\'t be initialized properly.');
  }
} catch (error) {
  console.error('Failed to initialize Razorpay:', error);
}

export default razorpayInstance;
