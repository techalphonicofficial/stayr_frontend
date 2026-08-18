import prisma from '../config/prisma.js';

// ==========================================
// GET /api/public/settings
// ==========================================
export const getPublicSettings = async (req, res) => {
  try {
    const settings = await prisma.crmSetting.findFirst();
    const activeTheme = await prisma.crmTheme.findFirst({
      where: { isActive: true }
    });
    
    // Only return safe public fields
    const publicData = {
      companyName: settings?.companyName || 'STAYR',
      phone: settings?.phone || '',
      whatsapp: settings?.whatsapp || '',
      email: settings?.email || '',
      address: settings?.address || '',
      mapUrl: settings?.mapUrl || '',
      socialLinks: {
        facebook: settings?.facebookLink || '',
        twitter: settings?.twitterLink || '',
        youtube: settings?.youtubeLink || '',
        instagram: settings?.instagramLink || ''
      },
      forexEnabled: settings?.forexEnabled || false,
      baseCurrency: settings?.baseCurrency || 'USD',
      theme: activeTheme?.variables || null
    };

    res.status(200).json({
      success: true,
      data: publicData
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving public settings' });
  }
};

// ==========================================
// GET /api/public/settings/taxes
// ==========================================
export const getPublicTaxes = async (req, res) => {
  try {
    const taxes = await prisma.tax.findMany({
      where: { active: true }
    });
    
    res.status(200).json({
      success: true,
      data: taxes
    });
  } catch (error) {
    console.error('Error fetching taxes:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving taxes' });
  }
};

// ==========================================
// GET /api/public/settings/cancellation
// ==========================================
export const getPublicCancellationRules = async (req, res) => {
  try {
    const rules = await prisma.cancellationRule.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' }
    });
    
    res.status(200).json({
      success: true,
      data: rules
    });
  } catch (error) {
    console.error('Error fetching cancellation rules:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving cancellation rules' });
  }
};
