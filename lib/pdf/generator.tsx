/**
 * PDF Generation Service
 * 
 * Service for generating PDF documents from packet content
 */

import React from 'react';
import { renderToStream, renderToBuffer } from '@react-pdf/renderer';
import { PacketType } from '@prisma/client';
import {
  getTemplateForPacketType,
  validatePacketContent,
} from './template-registry';
import { AnyPacketContent, PDFGenerationOptions } from './types';

/**
 * Generate PDF as a buffer
 */
export async function generatePDFBuffer(
  content: AnyPacketContent,
  _options?: PDFGenerationOptions
): Promise<Buffer> {
  try {
    // Validate content
    validatePacketContent(content, content.type);

    // Get the appropriate template
    const Template = getTemplateForPacketType(content.type);

    // Render the PDF
    const pdfBuffer = await renderToBuffer(<Template content={content} />);

    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF buffer:', error);
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate PDF as a stream
 */
export async function generatePDFStream(
  content: AnyPacketContent,
  _options?: PDFGenerationOptions
): Promise<NodeJS.ReadableStream> {
  try {
    // Validate content
    validatePacketContent(content, content.type);

    // Get the appropriate template
    const Template = getTemplateForPacketType(content.type);

    // Render the PDF as stream
    const pdfStream = await renderToStream(<Template content={content} />);

    return pdfStream;
  } catch (error) {
    console.error('Error generating PDF stream:', error);
    throw new Error(
      `Failed to generate PDF stream: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate PDF filename based on content
 */
export function generatePDFFilename(content: AnyPacketContent): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const userName = content.userName.replace(/\s+/g, '_').toLowerCase();
  const packetType = content.type.toLowerCase().replace(/_/g, '-');

  return `${userName}-${packetType}-${timestamp}-v${content.version}.pdf`;
}

/**
 * Validate PDF generation prerequisites
 */
export function validatePDFPrerequisites(content: AnyPacketContent): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (!content.id) errors.push('Missing packet ID');
  if (!content.userId) errors.push('Missing user ID');
  if (!content.userName) errors.push('Missing user name');
  if (!content.type) errors.push('Missing packet type');

  // Type-specific validation
  switch (content.type) {
    case PacketType.GENERAL:
      if (!content.introduction) errors.push('Missing introduction');
      break;

    case PacketType.NUTRITION:
      if (!content.mealPlan || content.mealPlan.length === 0) {
        errors.push('Missing meal plan');
      }
      break;

    case PacketType.TRAINING:
      if (!content.program || content.program.length === 0) {
        errors.push('Missing training program');
      }
      break;

    case PacketType.ATHLETE_PERFORMANCE:
      if (!content.sport) errors.push('Missing sport information');
      break;

    case PacketType.YOUTH:
      if (!content.age) errors.push('Missing age information');
      break;

    case PacketType.RECOVERY:
      if (!content.injuryType) errors.push('Missing injury type');
      if (!content.recoveryStage) errors.push('Missing recovery stage');
      break;

    case PacketType.PREGNANCY:
      if (!content.trimester) errors.push('Missing trimester information');
      break;

    case PacketType.POSTPARTUM:
      if (!content.weeksPostpartum) {
        errors.push('Missing weeks postpartum');
      }
      if (!content.deliveryType) errors.push('Missing delivery type');
      break;

    case PacketType.OLDER_ADULT:
      if (!content.functionalGoals || content.functionalGoals.length === 0) {
        errors.push('Missing functional goals');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
