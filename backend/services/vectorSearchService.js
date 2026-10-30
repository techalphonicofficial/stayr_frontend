import prisma from '../config/prisma.js';

// ============================================================================
// SEMANTIC SYNONYM DICTIONARY & KNOWLEDGE GRAPH
// ============================================================================
const LOCATION_SYNONYMS = {
  noida: ['noida', 'greater noida', 'noida expressway', 'delhi ncr', 'sector 137', 'sector 150', 'sector 18', 'sector 128'],
  delhi: ['delhi', 'new delhi', 'south delhi', 'connaught place', 'saket', 'hauz khas', 'ncr'],
  gurgaon: ['gurgaon', 'gurugram', 'golf course road', 'cyber city', 'dlf', 'sohna road', 'haryana'],
  mumbai: ['mumbai', 'bombay', 'bandra', 'worli', 'juhu', 'south mumbai', 'lower parel', 'marine drive'],
  goa: ['goa', 'north goa', 'south goa', 'candolim', 'calangute', 'baga', 'anjuna', 'vagator', 'panaji'],
  manali: ['manali', 'kullu', 'solang', 'old manali', 'himachal', 'rohtang'],
  rajasthan: ['rajasthan', 'jaipur', 'pink city', 'amer', 'pushkar'],
  udaipur: ['udaipur', 'lake pichola', 'city of lakes', 'fateh sagar'],
  jaisalmer: ['jaisalmer', 'golden city', 'sam sand dunes', 'thar desert'],
  himachal: ['himachal', 'himachal pradesh', 'shimla', 'kullu', 'kasauli', 'dharamshala'],
  darjeeling: ['darjeeling', 'tea gardens', 'tiger hill', 'ghoom', 'west bengal'],
  kerala: ['kerala', 'kochi', 'cochin', 'munnar', 'alleppey', 'alappuzha', 'backwaters', 'wayanad', 'kovalam'],
  kashmir: ['kashmir', 'srinagar', 'dal lake', 'gulmarg', 'pahalgam', 'sonmarg'],
  lonavala: ['lonavala', 'khandala', 'tiger point', 'bhushi dam', 'western ghats'],
  andaman: ['andaman', 'havelock', 'radhanagar beach', 'neil island', 'port blair']
};

const CATEGORY_SYNONYMS = {
  Villa: ['villa', 'villas', 'luxury villa', 'bungalow', 'private villa', 'pool villa', 'mansion', 'estate'],
  Apartment: ['apartment', 'apartments', 'flat', 'flats', 'condo', 'penthouse', 'loft', 'studio', 'bhk', 'high rise', 'sky mansion'],
  House: ['house', 'independent house', 'home', 'residence', 'row house', 'kothi', 'builder floor'],
  Cabin: ['cabin', 'log cabin', 'wooden cabin', 'chalet', 'treehouse', 'woodhouse', 'rustic'],
  Cottage: ['cottage', 'cottages', 'country cottage', 'stone cottage', 'homestay'],
  Resort: ['resort', 'resorts', 'retreat', 'wellness resort', 'spa resort', 'luxury resort'],
  Farmhouse: ['farmhouse', 'farm stay', 'ranch', 'agricultural retreat', 'organic farm']
};

const AMENITY_SYNONYMS = {
  pool: ['pool', 'swimming pool', 'private pool', 'plunge pool', 'infinity pool'],
  wifi: ['wifi', 'wi-fi', 'high speed internet', 'broadband', 'work from home'],
  ac: ['ac', 'air conditioning', 'air conditioned', 'climate control'],
  kitchen: ['kitchen', 'kitchenette', 'chef kitchen', 'cooking', 'modular kitchen'],
  parking: ['parking', 'free parking', 'car park', 'garage', 'valet'],
  pets: ['pet', 'pets', 'pet friendly', 'allows pets', 'dog friendly', 'cat'],
  balcony: ['balcony', 'private balcony', 'terrace', 'sit-out', 'deck'],
  gym: ['gym', 'fitness center', 'workout'],
  tv: ['tv', 'smart tv', 'television', 'home theater'],
  views: ['view', 'views', 'lake view', 'mountain view', 'sea view', 'ocean view', 'valley view']
};

const VIBE_KEYWORDS = {
  luxury: ['luxury', 'luxurious', 'ultra luxury', 'premium', 'high end', 'exclusive', '5 star', 'expensive'],
  budget: ['cheap', 'budget', 'affordable', 'low cost', 'pocket friendly', 'economical'],
  peaceful: ['peaceful', 'quiet', 'serene', 'tranquil', 'calm', 'nature'],
  romantic: ['romantic', 'couple', 'honeymoon', 'cozy', 'getaway'],
  beach: ['beach', 'beachfront', 'sea', 'ocean', 'coastal', 'sand', 'shore'],
  mountain: ['mountain', 'mountains', 'hills', 'hill station', 'snow', 'peaks', 'valley']
};

// Simple Levenshtein distance for typo tolerance
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Tokenize text into normalized lowercase tokens
function tokenize(text) {
  if (!text) return [];
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

// ============================================================================
// VECTOR CACHE IN-MEMORY FOR INSTANT < 5MS PERFORMANCE
// ============================================================================
class VectorSearchService {
  constructor() {
    this.cachedProperties = null;
    this.cacheTimestamp = 0;
    this.cacheTTL = 60 * 1000; // 60 seconds
  }

  async loadIndex() {
    const now = Date.now();
    if (this.cachedProperties && now - this.cacheTimestamp < this.cacheTTL) {
      return this.cachedProperties;
    }

    // Load both published rental properties
    const properties = await prisma.property.findMany({
      where: { isApproved: true, status: 'Published' },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        amenities: true,
        host: { select: { id: true, name: true, profileImage: true } }
      }
    });

    // Vectorize each property document
    this.cachedProperties = properties.map(p => this.vectorizeProperty(p));
    this.cacheTimestamp = now;
    return this.cachedProperties;
  }

  invalidateCache() {
    this.cachedProperties = null;
    this.cacheTimestamp = 0;
  }

  vectorizeProperty(p) {
    const amenityNames = (p.amenities || []).map(a => (typeof a === 'string' ? a : a.name));
    const fullText = [
      p.title,
      p.category,
      p.propertyType || '',
      p.city,
      p.state || '',
      p.country || '',
      p.address || '',
      p.description || '',
      amenityNames.join(' ')
    ].join(' ').toLowerCase();

    const tokens = tokenize(fullText);
    const tokenFreq = {};
    tokens.forEach(t => {
      tokenFreq[t] = (tokenFreq[t] || 0) + 1;
    });

    return {
      raw: p,
      id: p.id,
      title: p.title,
      city: p.city,
      category: p.category,
      pricePerNight: p.pricePerNight,
      maxGuests: p.maxGuests || 2,
      bedrooms: p.bedrooms || 1,
      amenities: amenityNames,
      tokens,
      tokenFreq,
      normalizedCity: (p.city || '').toLowerCase(),
      normalizedCategory: (p.category || '').toLowerCase()
    };
  }

  // Parse natural language user intent from query string
  parseQueryIntent(queryStr = '') {
    const clean = queryStr.trim().toLowerCase();
    const tokens = tokenize(clean);

    let detectedLocation = null;
    let detectedCategory = null;
    const detectedAmenities = [];
    let detectedVibe = null;
    let maxPriceHint = null;
    let minGuestsHint = null;

    // Check location synonyms and fuzzy matching
    for (const [locKey, synonyms] of Object.entries(LOCATION_SYNONYMS)) {
      for (const syn of synonyms) {
        if (clean.includes(syn)) {
          detectedLocation = locKey;
          break;
        }
      }
      if (detectedLocation) break;
    }

    // Fuzzy location check if not found
    if (!detectedLocation) {
      for (const token of tokens) {
        for (const locKey of Object.keys(LOCATION_SYNONYMS)) {
          if (levenshtein(token, locKey) <= 1 && token.length >= 4) {
            detectedLocation = locKey;
            break;
          }
        }
        if (detectedLocation) break;
      }
    }

    // Check category synonyms
    for (const [catKey, synonyms] of Object.entries(CATEGORY_SYNONYMS)) {
      for (const syn of synonyms) {
        if (clean.includes(syn)) {
          detectedCategory = catKey;
          break;
        }
      }
      if (detectedCategory) break;
    }

    // Check amenity intents
    for (const [amenKey, synonyms] of Object.entries(AMENITY_SYNONYMS)) {
      for (const syn of synonyms) {
        if (clean.includes(syn)) {
          detectedAmenities.push(amenKey);
          break;
        }
      }
    }

    // Check vibe intents
    for (const [vibeKey, keywords] of Object.entries(VIBE_KEYWORDS)) {
      for (const kw of keywords) {
        if (clean.includes(kw)) {
          detectedVibe = vibeKey;
          break;
        }
      }
      if (detectedVibe) break;
    }

    // Guests hint: e.g. "for 4", "4 guests", "4 people", "couple"
    const guestMatch = clean.match(/(\d+)\s*(?:guest|guests|people|person|pax|bhk|bed)/);
    if (guestMatch) {
      minGuestsHint = parseInt(guestMatch[1], 10);
    } else if (clean.includes('couple') || clean.includes('romantic')) {
      minGuestsHint = 2;
    } else if (clean.includes('family') || clean.includes('group')) {
      minGuestsHint = 4;
    }

    // Budget hint: e.g. "under 5000", "below 10k"
    const budgetMatch = clean.match(/(?:under|below|less than)\s*₹?\s*(\d+)(k)?/i);
    if (budgetMatch) {
      maxPriceHint = parseInt(budgetMatch[1], 10) * (budgetMatch[2] ? 1000 : 1);
    } else if (clean.includes('cheap') || clean.includes('budget')) {
      maxPriceHint = 7000;
    }

    return {
      rawQuery: queryStr,
      tokens,
      detectedLocation,
      detectedCategory,
      detectedAmenities,
      detectedVibe,
      minGuestsHint,
      maxPriceHint
    };
  }

  // Vector similarity scoring engine
  scoreProperty(doc, intent) {
    let score = 0;
    const matchReasons = [];

    const queryTokens = intent.tokens;
    if (queryTokens.length === 0) {
      return { score: 1.0, rawScore: 1.0, matchReasons: ['Available listing'] };
    }

    // 1. Semantic Location Alignment (Strongest constraint)
    if (intent.detectedLocation) {
      const locKey = intent.detectedLocation.toLowerCase();
      const docCity = doc.normalizedCity;

      if (docCity === locKey || docCity.includes(locKey)) {
        score += 3.0; // Definitive city match
        matchReasons.push(`${doc.city} destination match`);
      } else if (LOCATION_SYNONYMS[locKey] && LOCATION_SYNONYMS[locKey].some(s => docCity.includes(s))) {
        score += 2.2;
        matchReasons.push(`${doc.city} region match`);
      } else if (LOCATION_SYNONYMS[locKey] && LOCATION_SYNONYMS[locKey].some(s => doc.title.toLowerCase().includes(s))) {
        score += 0.3;
      } else {
        // Query explicitly requested a different location: heavily disqualify
        return { score: 0, rawScore: -10, matchReasons: [] };
      }
    }

    // 2. Semantic Category Alignment
    if (intent.detectedCategory) {
      const reqCat = intent.detectedCategory.toLowerCase();
      const docCat = doc.normalizedCategory;
      if (docCat === reqCat) {
        score += 2.0;
        matchReasons.push(`${doc.category} category match`);
      } else if (doc.title.toLowerCase().includes(reqCat)) {
        score += 1.2;
        matchReasons.push(`${doc.category} style match`);
      } else if (CATEGORY_SYNONYMS[intent.detectedCategory]?.some(s => doc.title.toLowerCase().includes(s))) {
        score += 0.8;
      }
    }

    // 3. Term Overlap & Frequency Match (TF-IDF approximation)
    let tokenMatches = 0;
    for (const qt of queryTokens) {
      if (doc.title.toLowerCase().includes(qt)) {
        score += 0.8;
        tokenMatches++;
      } else if (doc.tokenFreq[qt]) {
        score += 0.4 * Math.min(doc.tokenFreq[qt], 3);
        tokenMatches++;
      } else {
        for (const dt of doc.tokens) {
          if (dt.length >= 4 && levenshtein(qt, dt) <= 1) {
            score += 0.3;
            tokenMatches++;
            break;
          }
        }
      }
    }
    const lexicalRatio = queryTokens.length > 0 ? tokenMatches / queryTokens.length : 0;
    score += lexicalRatio * 1.5;

    // 4. Semantic Amenities Alignment
    if (intent.detectedAmenities.length > 0) {
      for (const reqAmen of intent.detectedAmenities) {
        const syns = AMENITY_SYNONYMS[reqAmen] || [reqAmen];
        const hasAmen = doc.amenities.some(a => syns.some(s => a.toLowerCase().includes(s))) ||
          syns.some(s => doc.title.toLowerCase().includes(s) || (doc.raw.description || '').toLowerCase().includes(s));
        if (hasAmen) {
          score += 1.0;
          matchReasons.push(`${reqAmen.charAt(0).toUpperCase() + reqAmen.slice(1)} verified`);
        }
      }
    }

    // 5. Semantic Vibe Alignment
    if (intent.detectedVibe) {
      if (intent.detectedVibe === 'luxury' && (doc.pricePerNight >= 8000 || doc.title.toLowerCase().includes('luxur'))) {
        score += 0.8;
        matchReasons.push('Luxury rating');
      } else if (intent.detectedVibe === 'budget' && doc.pricePerNight <= 6000) {
        score += 0.8;
        matchReasons.push('Budget friendly');
      } else if (intent.detectedVibe === 'beach' && (doc.normalizedCity.includes('goa') || doc.normalizedCity.includes('andaman') || doc.title.toLowerCase().includes('beach'))) {
        score += 1.0;
        matchReasons.push('Beachfront proximity');
      } else if (intent.detectedVibe === 'mountain' && (['manali', 'himachal', 'darjeeling', 'kashmir'].some(m => doc.normalizedCity.includes(m)))) {
        score += 1.0;
        matchReasons.push('Mountain scenery');
      }
    }

    // 6. Guests & Capacity Alignment
    if (intent.minGuestsHint && doc.maxGuests >= intent.minGuestsHint) {
      score += 0.5;
      matchReasons.push(`Accommodates ${doc.maxGuests} guests`);
    }

    // 7. Price Ceiling Alignment
    if (intent.maxPriceHint && doc.pricePerNight <= intent.maxPriceHint) {
      score += 0.5;
      matchReasons.push(`Within budget`);
    }

    // Rating boost
    if (doc.raw.averageRating >= 4.5) {
      score += 0.3;
    }

    // Normalize semantic score percentage
    // Raw score typically ranges from 1.0 to 8.0
    const normalized = Math.min(0.99, Math.max(0.60, 0.60 + (score / 15)));

    return {
      score: Number(normalized.toFixed(2)),
      rawScore: score,
      matchReasons: matchReasons.slice(0, 3)
    };
  }

  // Execute Vector Search
  async search(queryStr = '', options = {}) {
    const docs = await this.loadIndex();
    const intent = this.parseQueryIntent(queryStr);

    const limit = Math.max(1, Math.min(50, options.limit || 16));
    const page = Math.max(1, options.page || 1);

    const scored = [];

    for (const doc of docs) {
      // Hard filters if explicitly passed in options
      if (options.city && doc.normalizedCity !== options.city.toLowerCase()) {
        continue;
      }
      if (options.category && doc.normalizedCategory !== options.category.toLowerCase()) {
        continue;
      }
      if (options.minPrice && doc.pricePerNight < options.minPrice) {
        continue;
      }
      if (options.maxPrice && doc.pricePerNight > options.maxPrice) {
        continue;
      }
      if (options.guests && doc.maxGuests < options.guests) {
        continue;
      }

      const { score, rawScore, matchReasons } = this.scoreProperty(doc, intent);

      // Only include properties with positive match or if query is empty
      if (rawScore > 0 || !queryStr.trim()) {
        scored.push({
          ...doc.raw,
          _id: doc.raw.id,
          semanticScore: score,
          rawScore,
          matchConfidence: `${Math.round(score * 100)}% Match`,
          matchReasons
        });
      }
    }

    // Sort by raw vector score descending, then by rating & price
    scored.sort((a, b) => b.rawScore - a.rawScore || b.averageRating - a.averageRating);

    const total = scored.length;
    const start = (page - 1) * limit;
    const paginated = scored.slice(start, start + limit);

    return {
      query: queryStr,
      detectedIntent: {
        location: intent.detectedLocation,
        category: intent.detectedCategory,
        amenities: intent.detectedAmenities,
        vibe: intent.detectedVibe,
        guests: intent.minGuestsHint,
        maxPrice: intent.maxPriceHint
      },
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: paginated
    };
  }

  // Real-time suggestions for the navbar search box
  async getLiveSuggestions(queryStr = '', limit = 5) {
    if (!queryStr || queryStr.trim().length < 1) {
      return { suggestions: [], properties: [] };
    }

    const searchResult = await this.search(queryStr, { limit: 5 });
    const intent = searchResult.detectedIntent;

    const suggestions = [];

    if (intent.location) {
      const formattedLoc = intent.location.charAt(0).toUpperCase() + intent.location.slice(1);
      suggestions.push({
        type: 'destination',
        title: formattedLoc,
        subtitle: `Explore stays in ${formattedLoc}`,
        query: formattedLoc
      });

      if (intent.category) {
        suggestions.push({
          type: 'category',
          title: `${intent.category}s in ${formattedLoc}`,
          subtitle: `Verified ${intent.category.toLowerCase()} stays in ${formattedLoc}`,
          query: `${intent.category} in ${formattedLoc}`
        });
      } else {
        suggestions.push({
          type: 'popular',
          title: `Villas in ${formattedLoc}`,
          subtitle: `Top luxury & pool villas in ${formattedLoc}`,
          query: `Villa in ${formattedLoc}`
        });
      }
    } else if (intent.category) {
      suggestions.push({
        type: 'category',
        title: `${intent.category}s Across All Destinations`,
        subtitle: `Find verified ${intent.category.toLowerCase()} properties`,
        query: intent.category
      });
    }

    // Top property previews
    const propertiesPreview = (searchResult.data || []).slice(0, 4).map(p => ({
      id: p.id,
      title: p.title,
      city: p.city,
      category: p.category,
      pricePerNight: p.pricePerNight,
      currency: p.currency || 'USD',
      image: (p.images && p.images[0]?.url) || p.featuredImage || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
      matchConfidence: p.matchConfidence,
      matchReasons: p.matchReasons
    }));

    return {
      query: queryStr,
      detectedIntent: intent,
      suggestions,
      properties: propertiesPreview
    };
  }
}

export const vectorSearchService = new VectorSearchService();
export default vectorSearchService;
