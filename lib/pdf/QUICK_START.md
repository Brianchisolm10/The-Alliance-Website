# PDF Generation Quick Start Guide

## Installation

The PDF generation library is already installed with `@react-pdf/renderer`. No additional setup required!

## Basic Usage

### 1. Import the library

```typescript
import {
  generatePDFBuffer,
  GeneralPacketContent,
  PacketType,
} from '@/lib/pdf';
```

### 2. Create packet content

```typescript
const content: GeneralPacketContent = {
  id: 'packet-123',
  type: PacketType.GENERAL,
  userId: 'user-456',
  userName: 'John Doe',
  userEmail: 'john@example.com',
  generatedAt: new Date(),
  version: 1,
  introduction: 'Welcome to your wellness journey!',
  goals: ['Improve fitness', 'Eat healthier'],
  recommendations: ['Exercise 3x per week', 'Drink more water'],
};
```

### 3. Generate PDF

```typescript
try {
  const pdfBuffer = await generatePDFBuffer(content);
  
  // Save to file system
  await fs.writeFile('packet.pdf', pdfBuffer);
  
  // Or upload to storage
  // await uploadToStorage(pdfBuffer, 'packets/user-123.pdf');
  
} catch (error) {
  console.error('PDF generation failed:', error);
}
```

## Using in API Routes

### Example: Generate and Download PDF

```typescript
// app/api/packets/[id]/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generatePDFBuffer, generatePDFFilename } from '@/lib/pdf';
import { getPacketContent } from '@/lib/packets'; // Your function

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch packet content from database
    const content = await getPacketContent(params.id);
    
    if (!content) {
      return NextResponse.json(
        { error: 'Packet not found' },
        { status: 404 }
      );
    }
    
    // Generate PDF
    const pdfBuffer = await generatePDFBuffer(content);
    const filename = generatePDFFilename(content);
    
    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
```

### Example: Generate and Store PDF

```typescript
// app/actions/packets.ts
'use server';

import { generatePDFBuffer, generatePDFFilename } from '@/lib/pdf';
import { prisma } from '@/lib/db';
import { uploadToStorage } from '@/lib/storage'; // Your storage function

export async function generateAndStorePacket(
  userId: string,
  content: AnyPacketContent
) {
  try {
    // Generate PDF
    const pdfBuffer = await generatePDFBuffer(content);
    const filename = generatePDFFilename(content);
    
    // Upload to storage (e.g., Vercel Blob, S3)
    const fileUrl = await uploadToStorage(pdfBuffer, filename);
    
    // Save packet record to database
    const packet = await prisma.packet.create({
      data: {
        userId,
        type: content.type,
        fileUrl,
        data: content,
        status: 'DRAFT',
        version: content.version,
      },
    });
    
    return { success: true, packet };
  } catch (error) {
    console.error('Error generating packet:', error);
    return { success: false, error: 'Failed to generate packet' };
  }
}
```

## Available Packet Types

### 1. General Packet
```typescript
import { GeneralPacketContent, PacketType } from '@/lib/pdf';

const content: GeneralPacketContent = {
  type: PacketType.GENERAL,
  // ... required fields
  introduction: 'Welcome message',
  goals: ['Goal 1', 'Goal 2'],
  recommendations: ['Rec 1', 'Rec 2'],
  exercises: [/* optional */],
  nutrition: [/* optional */],
  lifestyle: {/* optional */},
};
```

### 2. Nutrition Packet
```typescript
import { NutritionPacketContent, PacketType } from '@/lib/pdf';

const content: NutritionPacketContent = {
  type: PacketType.NUTRITION,
  // ... required fields
  nutritionGoals: ['Goal 1', 'Goal 2'],
  mealPlan: [
    {
      id: 'meal-1',
      mealType: 'Breakfast',
      foods: ['Eggs', 'Toast'],
      macros: { protein: 20, carbs: 30, fats: 10 },
      calories: 300,
    },
  ],
  guidelines: ['Guideline 1', 'Guideline 2'],
  restrictions: ['Restriction 1'],
};
```

### 3. Training Packet
```typescript
import { TrainingPacketContent, PacketType } from '@/lib/pdf';

const content: TrainingPacketContent = {
  type: PacketType.TRAINING,
  // ... required fields
  trainingGoals: ['Build strength', 'Improve endurance'],
  program: [
    {
      phase: 'Phase 1',
      duration: '4 weeks',
      frequency: '3x per week',
      exercises: [
        {
          id: 'ex-1',
          name: 'Squats',
          description: 'Bodyweight squats',
          sets: 3,
          reps: '10-12',
        },
      ],
    },
  ],
  progressionPlan: ['Progress 1', 'Progress 2'],
  safetyNotes: ['Safety 1', 'Safety 2'],
};
```

## Validation

Always validate content before generating:

```typescript
import { validatePDFPrerequisites } from '@/lib/pdf';

const validation = validatePDFPrerequisites(content);

if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
  // Handle errors - don't generate PDF
  return;
}

// Proceed with PDF generation
const pdf = await generatePDFBuffer(content);
```

## Examples

See `lib/pdf/examples.ts` for complete example content objects for each packet type.

```typescript
import { PACKET_EXAMPLES } from '@/lib/pdf/examples';

// Use example content for testing
const pdf = await generatePDFBuffer(PACKET_EXAMPLES.GENERAL);
```

## Testing

To test PDF generation:

```typescript
// Create a test script
import { generatePDFBuffer } from '@/lib/pdf';
import { PACKET_EXAMPLES } from '@/lib/pdf/examples';
import fs from 'fs/promises';

async function testPDFGeneration() {
  try {
    // Test each packet type
    for (const [type, content] of Object.entries(PACKET_EXAMPLES)) {
      console.log(`Generating ${type} packet...`);
      const pdf = await generatePDFBuffer(content);
      await fs.writeFile(`test-${type.toLowerCase()}.pdf`, pdf);
      console.log(`✓ ${type} packet generated successfully`);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testPDFGeneration();
```

## Common Issues

### Issue: "Template not found"
**Solution**: Make sure the packet type is valid and matches a PacketType enum value.

### Issue: "Missing required fields"
**Solution**: Use `validatePDFPrerequisites()` to check what fields are missing.

### Issue: "PDF generation is slow"
**Solution**: PDF generation is CPU-intensive. Consider:
- Using a queue for bulk generation
- Generating PDFs asynchronously
- Caching generated PDFs

### Issue: "Out of memory"
**Solution**: Use `generatePDFStream()` instead of `generatePDFBuffer()` for large PDFs.

## Next Steps

1. **Integrate with packet generation workflow** (Task 14.6)
2. **Add file storage** for generated PDFs
3. **Create admin review interface** (Task 14.8)
4. **Implement publishing workflow** (Task 14.9)

## Resources

- [React-PDF Documentation](https://react-pdf.org/)
- [Full API Documentation](./README.md)
- [Example Content](./examples.ts)
