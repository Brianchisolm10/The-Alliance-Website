/**
 * PDF Generation Test Script
 * 
 * Simple test to verify PDF generation works correctly
 */

import { generatePDFBuffer, validatePDFPrerequisites } from './generator';
import { PACKET_EXAMPLES } from './examples';

async function testPDFGeneration() {
  console.log('🧪 Testing PDF Generation Library...\n');

  let successCount = 0;
  let failCount = 0;

  for (const [type, content] of Object.entries(PACKET_EXAMPLES)) {
    try {
      console.log(`📄 Testing ${type} packet...`);

      // Validate content first
      const validation = validatePDFPrerequisites(content);
      if (!validation.valid) {
        console.error(`  ❌ Validation failed:`, validation.errors);
        failCount++;
        continue;
      }

      // Generate PDF
      const pdfBuffer = await generatePDFBuffer(content);

      if (pdfBuffer && pdfBuffer.length > 0) {
        console.log(`  ✅ ${type} packet generated successfully (${pdfBuffer.length} bytes)`);
        successCount++;
      } else {
        console.error(`  ❌ ${type} packet generation returned empty buffer`);
        failCount++;
      }
    } catch (error) {
      console.error(`  ❌ ${type} packet generation failed:`, error);
      failCount++;
    }
  }

  console.log(`\n📊 Test Results:`);
  console.log(`  ✅ Passed: ${successCount}`);
  console.log(`  ❌ Failed: ${failCount}`);
  console.log(`  📈 Total: ${successCount + failCount}`);

  if (failCount === 0) {
    console.log('\n🎉 All PDF generation tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
  }

  return failCount === 0;
}

// Run tests if executed directly
if (require.main === module) {
  testPDFGeneration()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

export { testPDFGeneration };
