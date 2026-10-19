import { db } from '../config/firebase';
import { COLLECTIONS, Block, DeliveryPartnerUser } from '@taazatokri/shared';

export interface AssignedPartnerResult {
  partnerId: string;
  partnerName: string;
}

/**
 * Resolves the primary active delivery partner mapped to a block.
 * Per PRD:
 * - Hierarchy: City -> Sector -> Block
 * - 1 primary active partner per Block in V1
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
    if (!blockData.active || !blockData.primaryPartnerId) {
      return null;
    }

    // Verify partner is currently active
    const partnerDoc = await db
      .collection(COLLECTIONS.DELIVERY_PARTNERS)
      .doc(blockData.primaryPartnerId)
      .get();

    if (!partnerDoc.exists) {
      return null;
    }

    const partnerData = partnerDoc.data() as DeliveryPartnerUser;
    if (partnerData.status !== 'active') {
      return null;
    }

    return {
      partnerId: partnerData.id || blockData.primaryPartnerId,
      partnerName: partnerData.name || blockData.primaryPartnerName || 'Assigned Partner',
    };
  } catch (error) {
    console.error(`[AutoAssign] Error resolving partner for block ${blockId}:`, error);
    return null;
  }
}
