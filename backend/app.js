import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cmsRoutes from './routes/cmsRoutes.js';
import footerRoutes from './routes/footerRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import crmSettingsRoutes from './routes/crmSettingsRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import experienceStoryRoutes from './routes/experienceStoryRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import saleListingRoutes from './routes/saleListingRoutes.js';
import saleInquiryRoutes from './routes/saleInquiryRoutes.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const app = express();

// Load swagger.json
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'docs/swagger.json'), 'utf8')
);

// Security HTTP headers
app.use(helmet());

// Enable CORS (Should be configured before other middlewares and routes)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true
}));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: process.env.NODE_ENV === 'production' ? 500 : 10000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Static folder
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'backend/uploads')));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/crm/settings', crmSettingsRoutes);
app.use('/api/admin/blogs', blogRoutes);
app.use('/api/admin/pages', cmsRoutes);
app.use('/api/admin/footer', footerRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/experience-stories', experienceStoryRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/sale-listings', saleListingRoutes);
app.use('/api/sale-inquiries', saleInquiryRoutes);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;

