-- Real estate Buy & Sell: additive only (new enums values + new tables). No existing data is modified.
-- AlterTable
ALTER TABLE `Notification` MODIFY `type` ENUM('BOOKING_CREATED', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'PAYMENT_SUCCESS', 'PAYMENT_REFUND', 'NEW_REVIEW', 'PROPERTY_CREATED', 'PROPERTY_UPDATED', 'PROPERTY_APPROVED', 'PROPERTY_REJECTED', 'SALE_INQUIRY_RECEIVED', 'SALE_LISTING_APPROVED', 'SALE_LISTING_REJECTED', 'SYSTEM') NOT NULL;

-- CreateTable
CREATE TABLE `SaleListing` (
    `id` VARCHAR(191) NOT NULL,
    `sellerId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `category` ENUM('Residential', 'Commercial') NOT NULL DEFAULT 'Residential',
    `propertyType` VARCHAR(191) NOT NULL,
    `status` ENUM('Draft', 'PendingReview', 'Published', 'ChangesRequested', 'Rejected', 'Sold', 'Withdrawn') NOT NULL DEFAULT 'Draft',
    `price` DOUBLE NOT NULL,
    `priceNegotiable` BOOLEAN NOT NULL DEFAULT false,
    `additionalCharges` VARCHAR(191) NULL,
    `possessionStatus` VARCHAR(191) NULL,
    `availableFrom` DATETIME(3) NULL,
    `area` DOUBLE NOT NULL,
    `areaUnit` VARCHAR(191) NOT NULL DEFAULT 'sq ft',
    `carpetArea` DOUBLE NULL,
    `builtUpArea` DOUBLE NULL,
    `superBuiltUpArea` DOUBLE NULL,
    `plotArea` DOUBLE NULL,
    `bedrooms` INTEGER NULL,
    `bhk` VARCHAR(191) NULL,
    `bathrooms` INTEGER NULL,
    `balconies` INTEGER NULL,
    `furnishingStatus` VARCHAR(191) NULL,
    `floor` INTEGER NULL,
    `totalFloors` INTEGER NULL,
    `propertyAge` VARCHAR(191) NULL,
    `parking` VARCHAR(191) NULL,
    `facingDirection` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `locality` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL DEFAULT 'India',
    `postalCode` VARCHAR(191) NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `featuredImage` VARCHAR(191) NULL,
    `amenities` JSON NULL,
    `ownershipType` VARCHAR(191) NULL,
    `sellerType` VARCHAR(191) NULL,
    `reraNumber` VARCHAR(191) NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `isApproved` BOOLEAN NOT NULL DEFAULT false,
    `rejectionReason` TEXT NULL,
    `verifiedAt` DATETIME(3) NULL,
    `verifiedById` VARCHAR(191) NULL,
    `reviewedAt` DATETIME(3) NULL,
    `reviewedById` VARCHAR(191) NULL,
    `viewsCount` INTEGER NOT NULL DEFAULT 0,
    `inquiriesCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SaleListing_slug_key`(`slug`),
    INDEX `SaleListing_price_idx`(`price`),
    INDEX `SaleListing_city_idx`(`city`),
    INDEX `SaleListing_propertyType_idx`(`propertyType`),
    INDEX `SaleListing_category_idx`(`category`),
    INDEX `SaleListing_status_idx`(`status`),
    INDEX `SaleListing_isApproved_idx`(`isApproved`),
    INDEX `SaleListing_bedrooms_idx`(`bedrooms`),
    INDEX `SaleListing_area_idx`(`area`),
    FULLTEXT INDEX `SaleListing_title_description_city_country_idx`(`title`, `description`, `city`, `country`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleListingImage` (
    `id` VARCHAR(191) NOT NULL,
    `saleListingId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NULL,
    `caption` VARCHAR(191) NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SaleListingImage_saleListingId_idx`(`saleListingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleInquiry` (
    `id` VARCHAR(191) NOT NULL,
    `saleListingId` VARCHAR(191) NOT NULL,
    `sellerId` VARCHAR(191) NOT NULL,
    `buyerId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `inquiryType` VARCHAR(191) NOT NULL DEFAULT 'General',
    `preferredContactMethod` VARCHAR(191) NOT NULL DEFAULT 'Phone',
    `status` VARCHAR(191) NOT NULL DEFAULT 'New',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SaleInquiry_saleListingId_idx`(`saleListingId`),
    INDEX `SaleInquiry_sellerId_idx`(`sellerId`),
    INDEX `SaleInquiry_buyerId_idx`(`buyerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SavedSaleListing` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `saleListingId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SavedSaleListing_userId_idx`(`userId`),
    INDEX `SavedSaleListing_saleListingId_idx`(`saleListingId`),
    UNIQUE INDEX `SavedSaleListing_userId_saleListingId_key`(`userId`, `saleListingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleListingReport` (
    `id` VARCHAR(191) NOT NULL,
    `saleListingId` VARCHAR(191) NOT NULL,
    `reporterId` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `details` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Open',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SaleListingReport_saleListingId_idx`(`saleListingId`),
    INDEX `SaleListingReport_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SaleListing` ADD CONSTRAINT `SaleListing_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleListingImage` ADD CONSTRAINT `SaleListingImage_saleListingId_fkey` FOREIGN KEY (`saleListingId`) REFERENCES `SaleListing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleInquiry` ADD CONSTRAINT `SaleInquiry_saleListingId_fkey` FOREIGN KEY (`saleListingId`) REFERENCES `SaleListing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleInquiry` ADD CONSTRAINT `SaleInquiry_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleInquiry` ADD CONSTRAINT `SaleInquiry_buyerId_fkey` FOREIGN KEY (`buyerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedSaleListing` ADD CONSTRAINT `SavedSaleListing_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedSaleListing` ADD CONSTRAINT `SavedSaleListing_saleListingId_fkey` FOREIGN KEY (`saleListingId`) REFERENCES `SaleListing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleListingReport` ADD CONSTRAINT `SaleListingReport_saleListingId_fkey` FOREIGN KEY (`saleListingId`) REFERENCES `SaleListing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleListingReport` ADD CONSTRAINT `SaleListingReport_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

