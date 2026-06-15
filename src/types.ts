/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BrandType = 'TERROIR' | 'GURUMBE' | 'SAVANNAH';

export interface Property {
  id: string;
  name: string;
  tagline: string;
  description: string;
  location: string;
  image: string;
  priceFrom: string;
  investFrom: string;
  yieldTarget: string;
  targetIRR: string;
  exitStrategy: string;
  status: string;
  opportunityText: string;
  renders: string[];
}

export interface ApplicationState {
  fullName: string;
  email: string;
  targetTier: string;
  jurisdiction: string;
  experience?: string;
  notes?: string;
  status: 'SUBMITTED' | 'KYC_PENDING' | 'RESERVATION_ESCROW' | 'APPROVED' | 'ACTIVE';
  dateSubmitted: string;
  escrowDepositPaid: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
