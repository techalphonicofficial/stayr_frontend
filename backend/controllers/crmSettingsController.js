import prisma from '../config/prisma.js';
import { encrypt, decrypt } from '../services/encryptionService.js';
import crypto from 'crypto';

// Helper to get or create the single CRM settings document
const getOrCreateSettings = async () => {
  let settings = await prisma.crmSetting.findFirst();
  if (!settings) {
    settings = await prisma.crmSetting.create({ data: {} });
  }
  return settings;
};

// ==========================================
// CORE CRM SETTINGS
// ==========================================

export const getCrmSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    
    // Decrypt fields if present
    const decryptedSettings = { ...settings };
    
    // Mask sensitive fields for frontend response
    if (decryptedSettings.smtpPassword) {
      decryptedSettings.smtpPassword = '********';
    }
    if (decryptedSettings.razorpaySecret) {
      decryptedSettings.razorpaySecret = '********';
    }

    res.status(200).json({ success: true, data: decryptedSettings });
  } catch (error) {
    console.error('Error fetching CRM settings:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving settings', error: error.message });
  }
};

export const updateCrmSettings = async (req, res) => {
  try {
    const { 
      defaultAssignee, autoAssignRule, partialBooking, partialPercent,
      smtpHost, smtpPort, smtpSecure, fromName, fromEmail, smtpUser, smtpPassword,
      baseCurrency, forexEnabled, forexProvider, forexAutoMode, forexMarkup,
      companyName, razorpayKeyId, razorpaySecret, phone, whatsapp, email, address, mapUrl,
      facebookLink, twitterLink, youtubeLink, instagramLink
    } = req.body;

    const settings = await getOrCreateSettings();
    
    const updateData = {
      defaultAssignee, autoAssignRule, partialBooking, partialPercent: Number(partialPercent) || 0,
      smtpHost, smtpPort: Number(smtpPort) || 587, smtpSecure: Boolean(smtpSecure), fromName, fromEmail, smtpUser,
      baseCurrency, forexEnabled: Boolean(forexEnabled), forexProvider, forexAutoMode: Boolean(forexAutoMode), forexMarkup: Number(forexMarkup) || 0,
      companyName, razorpayKeyId, phone, whatsapp, email, address, mapUrl,
      facebookLink, twitterLink, youtubeLink, instagramLink
    };

    // Only update passwords if they are provided and not masked
    if (smtpPassword && smtpPassword !== '********') {
      updateData.smtpPassword = encrypt(smtpPassword);
    }
    if (razorpaySecret && razorpaySecret !== '********') {
      updateData.razorpaySecret = encrypt(razorpaySecret);
    }

    const updated = await prisma.crmSetting.update({
      where: { id: settings.id },
      data: updateData
    });

    res.status(200).json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating CRM settings:', error);
    res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

// ==========================================
// TAXES
// ==========================================

export const getTaxes = async (req, res) => {
  try {
    const taxes = await prisma.tax.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data: taxes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve taxes' });
  }
};

export const createTax = async (req, res) => {
  try {
    const { name, defaultPercentage, active } = req.body;
    
    if (!name || isNaN(defaultPercentage)) {
      return res.status(400).json({ success: false, message: 'Name and valid percentage are required' });
    }
    
    const existing = await prisma.tax.findUnique({ where: { name } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Tax name already exists' });
    }

    const tax = await prisma.tax.create({
      data: { name, defaultPercentage: Number(defaultPercentage), active: Boolean(active) }
    });
    res.status(201).json({ success: true, data: tax });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create tax' });
  }
};

export const updateTax = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, defaultPercentage, active } = req.body;
    
    const tax = await prisma.tax.update({
      where: { id },
      data: { name, defaultPercentage: Number(defaultPercentage), active: Boolean(active) }
    });
    res.status(200).json({ success: true, data: tax });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update tax' });
  }
};

export const deleteTax = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.tax.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Tax deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete tax' });
  }
};

// ==========================================
// CANCELLATION RULES
// ==========================================

export const getCancellationRules = async (req, res) => {
  try {
    const rules = await prisma.cancellationRule.findMany({ orderBy: { sortOrder: 'asc' } });
    res.status(200).json({ success: true, data: rules });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve cancellation rules' });
  }
};

export const createCancellationRule = async (req, res) => {
  try {
    const { minDays, maxDays, refundPercentage, cancelPercentage, description, active, sortOrder } = req.body;
    const rule = await prisma.cancellationRule.create({
      data: { 
        minDays: Number(minDays), maxDays: Number(maxDays), 
        refundPercentage: Number(refundPercentage), cancelPercentage: Number(cancelPercentage), 
        description, active: Boolean(active), sortOrder: Number(sortOrder) || 0 
      }
    });
    res.status(201).json({ success: true, data: rule });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create cancellation rule' });
  }
};

export const updateCancellationRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { minDays, maxDays, refundPercentage, cancelPercentage, description, active, sortOrder } = req.body;
    const rule = await prisma.cancellationRule.update({
      where: { id },
      data: { 
        minDays: Number(minDays), maxDays: Number(maxDays), 
        refundPercentage: Number(refundPercentage), cancelPercentage: Number(cancelPercentage), 
        description, active: Boolean(active), sortOrder: Number(sortOrder) || 0 
      }
    });
    res.status(200).json({ success: true, data: rule });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update cancellation rule' });
  }
};

export const deleteCancellationRule = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cancellationRule.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Cancellation rule deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete cancellation rule' });
  }
};

// ==========================================
// API KEYS
// ==========================================

export const getApiKeys = async (req, res) => {
  try {
    const keys = await prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, keyPrefix: true, active: true, lastUsedAt: true, createdBy: true, createdAt: true }
    });
    res.status(200).json({ success: true, data: keys });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve API keys' });
  }
};

export const createApiKey = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'API key name is required' });

    // Generate a secure random key
    const rawKey = 'sk_' + crypto.randomBytes(32).toString('hex');
    const keyPrefix = rawKey.substring(0, 8) + '...';
    
    // Hash it for DB storage
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        keyPrefix,
        keyHash,
        createdBy: req.user?.id || 'system'
      }
    });

    // ONLY return the raw key once upon creation
    res.status(201).json({ 
      success: true, 
      data: { id: apiKey.id, name: apiKey.name, rawKey, keyPrefix: apiKey.keyPrefix } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create API key' });
  }
};

export const deleteApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.apiKey.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'API key revoked' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to revoke API key' });
  }
};

// ==========================================
// THEME
// ==========================================

export const getTheme = async (req, res) => {
  try {
    let theme = await prisma.crmTheme.findFirst({ where: { isActive: true } });
    if (!theme) {
      // Return default empty variables if not found
      return res.status(200).json({ success: true, data: { variables: {} } });
    }
    res.status(200).json({ success: true, data: theme });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve theme' });
  }
};

export const getThemes = async (req, res) => {
  try {
    const themes = await prisma.crmTheme.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: themes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve themes' });
  }
};

export const createTheme = async (req, res) => {
  try {
    const { name, variables } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Theme name is required' });
    }

    // Deactivate all other themes
    await prisma.crmTheme.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    const theme = await prisma.crmTheme.create({
      data: {
        name,
        variables,
        isActive: true
      }
    });

    res.status(201).json({ success: true, data: theme });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create theme' });
  }
};

export const activateTheme = async (req, res) => {
  try {
    const { id } = req.params;

    // Deactivate all themes
    await prisma.crmTheme.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    // Activate the requested theme
    const theme = await prisma.crmTheme.update({
      where: { id },
      data: { isActive: true }
    });

    res.status(200).json({ success: true, data: theme });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to activate theme' });
  }
};

export const deleteTheme = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting if it's the very last theme available
    const count = await prisma.crmTheme.count();
    if (count <= 1) {
      return res.status(400).json({ success: false, message: "Cannot delete the only remaining theme" });
    }

    const theme = await prisma.crmTheme.findUnique({ where: { id } });
    await prisma.crmTheme.delete({ where: { id } });

    // If we deleted the active theme, activate the newest remaining one
    if (theme?.isActive) {
      const fallback = await prisma.crmTheme.findFirst({ orderBy: { createdAt: 'desc' } });
      if (fallback) {
        await prisma.crmTheme.update({ where: { id: fallback.id }, data: { isActive: true } });
      }
    }

    res.status(200).json({ success: true, message: 'Theme deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete theme' });
  }
};

export const updateTheme = async (req, res) => {
  try {
    const { variables } = req.body;
    
    let theme = await prisma.crmTheme.findFirst({ where: { isActive: true } });
    
    if (theme) {
      theme = await prisma.crmTheme.update({
        where: { id: theme.id },
        data: { variables }
      });
    } else {
      theme = await prisma.crmTheme.create({
        data: { name: 'Default Theme', variables, isActive: true }
      });
    }
    
    res.status(200).json({ success: true, data: theme });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update theme' });
  }
};

// ==========================================
// CATEGORY MAPPING
// ==========================================
export const getCategoryMappings = async (req, res) => {
  try {
    const mappings = await prisma.categoryMapping.findMany();
    res.status(200).json({ success: true, data: mappings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve mappings' });
  }
};

export const createCategoryMapping = async (req, res) => {
  try {
    const { sourceCategory, targetCategory } = req.body;
    const mapping = await prisma.categoryMapping.create({
      data: { sourceCategory, targetCategory }
    });
    res.status(201).json({ success: true, data: mapping });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create mapping' });
  }
};

export const deleteCategoryMapping = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.categoryMapping.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Mapping deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete mapping' });
  }
};
