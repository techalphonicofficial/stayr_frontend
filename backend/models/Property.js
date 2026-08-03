import mongoose from 'mongoose';
import slugify from 'slugify';

const propertySchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a property title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: [
        'Apartment',
        'House',
        'Villa',
        'Cabin',
        'Hotel',
        'Resort',
        'Farmhouse',
        'Cottage',
      ],
    },
    propertyType: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Published',
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
    },
    country: {
      type: String,
      required: [true, 'Please add a country'],
    },
    postalCode: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please add a price per night'],
      min: [0, 'Price must be a positive number'],
    },
    cleaningFee: {
      type: Number,
      default: 0,
    },
    serviceFee: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    maxGuests: {
      type: Number,
      required: [true, 'Please specify maximum guests'],
      min: [1, 'Must allow at least 1 guest'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please specify number of bedrooms'],
      min: [0, 'Bedrooms cannot be negative'],
    },
    beds: {
      type: Number,
      default: 1,
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please specify number of bathrooms'],
      min: [0, 'Bathrooms cannot be negative'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
        },
      },
    ],
    featuredImage: {
      type: String,
    },
    averageRating: {
      type: Number,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
propertySchema.pre('save', function () {
  if (!this.isModified('title')) return;

  const baseSlug = slugify(this.title, {
    lower: true,
    strict: true,
    trim: true,
  });

  this.slug = `${baseSlug}-${Date.now().toString(36)}`;
});

// Indexes
propertySchema.index({
  title: 'text',
  description: 'text',
  city: 'text',
  country: 'text',
});

propertySchema.index({ pricePerNight: 1 });
propertySchema.index({ category: 1 });
propertySchema.index({ maxGuests: 1 });
propertySchema.index({ bedrooms: 1 });
propertySchema.index({ bathrooms: 1 });

const Property = mongoose.model('Property', propertySchema);

export default Property;