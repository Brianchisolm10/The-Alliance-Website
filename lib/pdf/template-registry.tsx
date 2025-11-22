/**
 * PDF Template Registry
 * 
 * Central registry for all PDF templates mapped to packet types
 */

import React from 'react';
import { PacketType } from '@prisma/client';
import { AnyPacketContent } from './types';

// Import all templates
import { GeneralPacketTemplate } from './templates/general-packet';
import { NutritionPacketTemplate } from './templates/nutrition-packet';
import { TrainingPacketTemplate } from './templates/training-packet';
import { AthletePacketTemplate } from './templates/athlete-packet';
import { YouthPacketTemplate } from './templates/youth-packet';
import { RecoveryPacketTemplate } from './templates/recovery-packet';
import { PregnancyPacketTemplate } from './templates/pregnancy-packet';
import { PostpartumPacketTemplate } from './templates/postpartum-packet';
import { OlderAdultPacketTemplate } from './templates/older-adult-packet';

/**
 * Template registry mapping packet types to their React components
 */
export const TEMPLATE_REGISTRY: Record<
  PacketType,
  React.FC<{ content: any }>
> = {
  [PacketType.GENERAL]: GeneralPacketTemplate,
  [PacketType.NUTRITION]: NutritionPacketTemplate,
  [PacketType.TRAINING]: TrainingPacketTemplate,
  [PacketType.ATHLETE_PERFORMANCE]: AthletePacketTemplate,
  [PacketType.YOUTH]: YouthPacketTemplate,
  [PacketType.RECOVERY]: RecoveryPacketTemplate,
  [PacketType.PREGNANCY]: PregnancyPacketTemplate,
  [PacketType.POSTPARTUM]: PostpartumPacketTemplate,
  [PacketType.OLDER_ADULT]: OlderAdultPacketTemplate,
};

/**
 * Get the appropriate template component for a packet type
 */
export function getTemplateForPacketType(
  packetType: PacketType
): React.FC<{ content: any }> {
  const template = TEMPLATE_REGISTRY[packetType];

  if (!template) {
    throw new Error(`No template found for packet type: ${packetType}`);
  }

  return template;
}

/**
 * Validate that content matches the expected packet type
 */
export function validatePacketContent(
  content: AnyPacketContent,
  expectedType: PacketType
): boolean {
  if (content.type !== expectedType) {
    throw new Error(
      `Content type mismatch: expected ${expectedType}, got ${content.type}`
    );
  }

  // Basic validation - ensure required fields exist
  if (!content.id || !content.userId || !content.userName) {
    throw new Error('Missing required packet content fields');
  }

  return true;
}

/**
 * Get human-readable name for packet type
 */
export function getPacketTypeName(packetType: PacketType): string {
  const names: Record<PacketType, string> = {
    [PacketType.GENERAL]: 'General Wellness Packet',
    [PacketType.NUTRITION]: 'Nutrition Packet',
    [PacketType.TRAINING]: 'Training Packet',
    [PacketType.ATHLETE_PERFORMANCE]: 'Athlete Performance Packet',
    [PacketType.YOUTH]: 'Youth Wellness Packet',
    [PacketType.RECOVERY]: 'Recovery & Rehabilitation Packet',
    [PacketType.PREGNANCY]: 'Pregnancy Wellness Packet',
    [PacketType.POSTPARTUM]: 'Postpartum Recovery Packet',
    [PacketType.OLDER_ADULT]: 'Active Aging Wellness Packet',
  };

  return names[packetType] || packetType;
}
