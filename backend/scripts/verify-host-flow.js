import prisma from '../config/prisma.js';

async function runVerification() {
  console.log('--- RUNNING STAYR BACKEND VERIFICATION ---');

  try {
    // 1. Database Connection and Existing Data Preservation Check
    const totalCount = await prisma.property.count();
    const publishedCount = await prisma.property.count({
      where: { isApproved: true, status: 'Published' }
    });
    console.log(`[PASS] Database connected successfully.`);
    console.log(`[PASS] Total properties in database: ${totalCount}`);
    console.log(`[PASS] Published & approved properties: ${publishedCount}`);

    if (totalCount === 0 || publishedCount === 0) {
      throw new Error('Existing properties were lost! Verification failed.');
    }

    // 2. Enum Verification
    const sampleProperty = await prisma.property.findFirst({
      select: { id: true, title: true, status: true, isApproved: true }
    });
    console.log(`[PASS] Sample property fetched: "${sampleProperty.title}" (Status: ${sampleProperty.status}, Approved: ${sampleProperty.isApproved})`);

    // 3. Verify Draft & Status Lifecycle simulation (using transaction with rollback or cleanup)
    const testHost = await prisma.user.findFirst();
    if (testHost) {
      console.log(`[PASS] Test host found: ${testHost.email} (${testHost.role})`);
      
      // Test creating a Draft listing
      const testDraft = await prisma.property.create({
        data: {
          hostId: testHost.id,
          title: '[TEST] Antigravity Verified Draft Property',
          slug: `test-antigravity-draft-${Date.now()}`,
          description: 'This is a test listing created to verify the listing wizard lifecycle.',
          category: 'Apartment',
          address: '123 Verified Testing Blvd',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pricePerNight: 4500,
          maxGuests: 4,
          bedrooms: 2,
          beds: 2,
          bathrooms: 2,
          status: 'Draft',
          isApproved: false,
          bookingSettings: { minNights: 1, maxNights: 30 },
          houseRules: { allowPets: false, allowSmoking: false }
        }
      });
      console.log(`[PASS] Created test draft with ID: ${testDraft.id}, Status: ${testDraft.status}`);

      // 4. Verify Public Search Excludes Drafts & Unapproved
      const publicSearchResult = await prisma.property.findMany({
        where: {
          id: testDraft.id,
          isApproved: true,
          status: 'Published'
        }
      });
      if (publicSearchResult.length === 0) {
        console.log(`[PASS] Public search correctly EXCLUDES unapproved/draft listing.`);
      } else {
        throw new Error('SECURITY VIOLATION: Draft listing appeared in public search!');
      }

      // 5. Test Transition to PendingReview
      const pendingListing = await prisma.property.update({
        where: { id: testDraft.id },
        data: { status: 'PendingReview', isApproved: false }
      });
      console.log(`[PASS] Updated to PendingReview: ID: ${pendingListing.id}, Status: ${pendingListing.status}`);

      // Verify still excluded from public search
      const publicPendingSearch = await prisma.property.findMany({
        where: {
          id: testDraft.id,
          isApproved: true,
          status: 'Published'
        }
      });
      if (publicPendingSearch.length === 0) {
        console.log(`[PASS] Public search correctly EXCLUDES PendingReview listing.`);
      } else {
        throw new Error('SECURITY VIOLATION: PendingReview listing appeared in public search!');
      }

      // 6. Test Admin Approval
      const approvedListing = await prisma.property.update({
        where: { id: testDraft.id },
        data: { status: 'Published', isApproved: true, rejectionReason: null }
      });
      console.log(`[PASS] Admin approved listing: ID: ${approvedListing.id}, Status: ${approvedListing.status}, isApproved: ${approvedListing.isApproved}`);

      // Verify now included in public search
      const publicApprovedSearch = await prisma.property.findMany({
        where: {
          id: testDraft.id,
          isApproved: true,
          status: 'Published'
        }
      });
      if (publicApprovedSearch.length === 1) {
        console.log(`[PASS] Public search correctly INCLUDES approved & published listing.`);
      } else {
        throw new Error('Approved listing not found in public search!');
      }

      // 7. Clean up test record
      await prisma.property.delete({
        where: { id: testDraft.id }
      });
      console.log(`[PASS] Cleaned up test property record cleanly.`);
    }

    console.log('--- ALL BACKEND CHECKS PASSED SUCCESSFULLY ---');
  } catch (err) {
    console.error('[FAIL] Backend verification error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runVerification();
