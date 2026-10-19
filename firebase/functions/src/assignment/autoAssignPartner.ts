import { db } from '../config/firebase';
import { COLLECTIONS, Block, DeliveryPartnerUser } from '@taazatokri/shared';

export interface AssignedPartnerResult {
  partnerUid: string; // Authoritative Firebase Auth UID for security
  partnerId: string; // Human-readable Partner ID (e.g. "DP001") for display
  partnerName: string;
}

/**
 * Resolves the primary active delivery partner mapped to a block.
 * Per PRD & Security Architecture:
 * - Hierarchy: City -> Sector -> Block
 * - 1 primary active partner per Block in V1
 * - Primary partner's Firebase Auth UID (primaryPartnerUid) is stored for security checks.
 * - Human-readable Partner ID (e.g. "DP001") is stored for display reference.
 * - If no mapping exists or partner is inactive, returns null (order remains Unassigned for Attention Required queue).
 */
export async function findPrimaryPartnerForBlock(
  blockId: string
): Promise<AssignedPartnerResult | null> {
  if (!blockId) {
    return null;
  }

  try {
    const blockDoc = await db.collection(COLLECTIONS.BLOCKS).doc(blockId).get();
    if (!blockDoc.exists) {
      return null;
    }

    const blockData = blockDoc.data() as Block;
    const targetPartnerUid = blockData.primaryPartnerUid || blockData.primaryPartnerId;
    if (!blockData.active || !targetPartnerUid) {
      return null;
    }

    // Verify partner is currently active in 'deliveryPartners' collection (keyed by authUid)
    const partnerDoc = await db
      .collection(COLLECTIONS.DELIVERY_PARTNERS)
      .doc(targetPartnerUid)
      .get();

    if (!partnerDoc.exists) {
      return null;
    }

    const partnerData = partnerDoc.data() as DeliveryPartnerUser;
    if (partnerData.status !== 'active') {
      return null;
    }

    return {
      partnerUid: partnerData.authUid || targetPartnerUid,
      partnerId: partnerData.partnerId || blockData.primaryPartnerId || 'DP001',
      partnerName: partnerData.name || blockData.primaryPartnerName || 'Assigned Partner',
    };
  } catch (error) {
    console.error(`[AutoAssign] Error resolving partner for block ${blockId}:`, error);
    return null;
  }
}
