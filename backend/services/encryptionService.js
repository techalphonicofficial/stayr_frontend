import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

/**
 * Ensures the encryption key is derived to exactly 32 bytes
 */
const getKey = () => {
  const secret = process.env.ENCRYPTION_KEY || 'default_secret_please_change_in_production';
  return crypto.scryptSync(secret, 'salt', 32);
};

/**
 * Encrypts a plaintext string
 * @param {string} text - The text to encrypt
 * @returns {string} - The encrypted string format: iv:tag:encryptedText
 */
export const encrypt = (text) => {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = getKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

/**
 * Decrypts an encrypted string
 * @param {string} encryptedData - The format: iv:tag:encryptedText
 * @returns {string|null} - The decrypted plaintext string
 */
export const decrypt = (encryptedData) => {
  if (!encryptedData || typeof encryptedData !== 'string') return encryptedData;
  if (!encryptedData.includes(':')) return encryptedData; // Not in our encrypted format
  
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) return encryptedData;
    
    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encryptedText = Buffer.from(parts[2], 'hex');
    
    const key = getKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null; // Return null if decryption fails (e.g. wrong key)
  }
};
