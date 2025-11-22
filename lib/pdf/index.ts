/**
 * PDF Generation Library
 * 
 * Main entry point for PDF generation functionality
 */

// Export types
export * from './types';

// Export generator functions
export {
  generatePDFBuffer,
  generatePDFStream,
  generatePDFFilename,
  validatePDFPrerequisites,
} from './generator';

// Export template registry
export {
  TEMPLATE_REGISTRY,
  getTemplateForPacketType,
  validatePacketContent,
  getPacketTypeName,
} from './template-registry';

// Export base components for custom templates
export * from './components/base';

// Export packet generation engine
export {
  generatePacketContent,
  createDraftPacket,
  getPacketTypeForPopulation,
} from './packet-generator';

// Export packet storage functions
export {
  generateAndUploadPacketPDF,
  regeneratePacketPDF,
  deletePacketPDF,
  getPacketDownloadUrl,
} from './storage';
