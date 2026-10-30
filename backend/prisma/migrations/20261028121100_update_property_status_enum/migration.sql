-- AlterTable
ALTER TABLE `Property` MODIFY `status` ENUM('Draft', 'PendingReview', 'Published', 'Rejected', 'ChangesRequested', 'Unlisted') NOT NULL DEFAULT 'Published';
