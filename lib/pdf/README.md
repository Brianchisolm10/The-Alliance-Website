# PDF Generation Library

This library provides a modular, extensible system for generating personalized wellness packets as PDF documents.

## Overview

The PDF generation system is built on `@react-pdf/renderer` and provides:

- **Modular Templates**: Population-specific PDF templates for all packet types
- **Type Safety**: Full TypeScript support with strict typing
- **Reusable Components**: Base components for consistent styling
- **Extensibility**: Easy to add new templates or modify existing ones
- **Validation**: Built-in content validation before PDF generation

## Architecture

```
lib/pdf/
├── types.ts                    # TypeScript type definitions
├── generator.ts                # PDF generation service
├── template-registry.tsx       # Template mapping and registry
├── components/
│   └── base.tsx               # Reusable PDF components
└── templates/
    ├── general-packet.tsx     # General wellness template
    ├── nutrition-packet.tsx   # Nutrition-specific template
    ├── training-packet.tsx    # Training program template
    ├── athlete-packet.tsx     # Athlete performance template
    ├── youth-packet.tsx       # Youth wellness template
    ├── recovery-packet.tsx    # Recovery/rehab template
    ├── pregnancy-packet.tsx   # Pregnancy wellness template
    ├── postpartum-packet.tsx  # Postpartum recovery template
    └── older-adult-packet.tsx # Active aging template
```

## Usage

### Basic PDF Generation

```typescript
import { generatePDFBuffer, GeneralPacketContent } from '@/lib/pdf';

const content: GeneralPacketContent = {
  id: 'packet-123',
  type: 'GENERAL',
  userId: 'user-456',
  userName: 'John Doe',
  userEmail: 'john@example.com',
  generatedAt: new Date(),
  version: 1,
  introduction: 'Welcome to your personalized wellness journey...',
  goals: ['Improve cardiovascular health', 'Build strength'],
  recommendations: ['Exercise 3-4 times per week', 'Stay hydrated'],
  exercises: [
    {
      id: 'ex-1',
      name: 'Squats',
      description: 'Bodyweight squats for lower body strength',
      sets: 3,
      reps: '10-12',
      notes: 'Keep your chest up and knees tracking over toes',
    },
  ],
};

// Generate PDF as buffer
const pdfBuffer = await generatePDFBuffer(content);

// Save to file or upload to storage
```

### Generate PDF Stream

```typescript
import { generatePDFStream } from '@/lib/pdf';

const pdfStream = await generatePDFStream(content);

// Pipe to response or file
pdfStream.pipe(response);
```

### Validate Content Before Generation

```typescript
import { validatePDFPrerequisites } from '@/lib/pdf';

const validation = validatePDFPrerequisites(content);

if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
  // Handle errors
}
```

### Generate Filename

```typescript
import { generatePDFFilename } from '@/lib/pdf';

const filename = generatePDFFilename(content);
// Returns: "john_doe-general-2024-11-22-v1.pdf"
```

## Packet Types

### 1. General Packet
For general wellness guidance covering multiple areas.

**Required Fields:**
- `introduction`: Welcome message
- `goals`: Array of wellness goals
- `recommendations`: Key recommendations

**Optional Fields:**
- `exercises`: Exercise recommendations
- `nutrition`: Nutrition guidance
- `lifestyle`: Sleep, hydration, stress management

### 2. Nutrition Packet
Focused on nutrition planning and dietary guidance.

**Required Fields:**
- `nutritionGoals`: Nutrition-specific goals
- `mealPlan`: Array of meals with foods and macros
- `guidelines`: Nutrition guidelines

**Optional Fields:**
- `restrictions`: Dietary restrictions
- `supplements`: Supplement recommendations

### 3. Training Packet
Structured training programs with phases.

**Required Fields:**
- `trainingGoals`: Training objectives
- `program`: Array of training phases with exercises

**Optional Fields:**
- `progressionPlan`: How to progress over time
- `safetyNotes`: Safety guidelines

### 4. Athlete Performance Packet
Sport-specific performance training.

**Required Fields:**
- `sport`: Sport name
- `performanceGoals`: Performance objectives
- `strengthProgram`: Strength exercises
- `conditioningProgram`: Conditioning exercises

**Optional Fields:**
- `position`: Player position
- `recoveryProtocol`: Recovery strategies
- `nutritionStrategy`: Performance nutrition

### 5. Youth Packet
Age-appropriate wellness for children and adolescents.

**Required Fields:**
- `age`: Child's age
- `developmentStage`: Development stage description
- `goals`: Youth-appropriate goals
- `parentGuidance`: Guidance for parents

**Optional Fields:**
- `exercises`: Fun movement activities
- `nutrition`: Healthy eating guide
- `safetyGuidelines`: Safety rules

### 6. Recovery Packet
Injury recovery and rehabilitation.

**Required Fields:**
- `injuryType`: Type of injury
- `recoveryStage`: Current recovery stage
- `goals`: Recovery goals
- `contraindications`: Activities to avoid

**Optional Fields:**
- `exercises`: Rehabilitation exercises
- `progressionCriteria`: When to progress
- `returnToActivityPlan`: Return-to-play timeline

### 7. Pregnancy Packet
Trimester-specific pregnancy wellness.

**Required Fields:**
- `trimester`: 1, 2, or 3
- `goals`: Pregnancy wellness goals
- `warningSign`: When to stop and call doctor
- `contraindications`: Activities to avoid

**Optional Fields:**
- `exercises`: Safe pregnancy exercises
- `nutrition`: Pregnancy nutrition
- `trimesterGuidance`: Trimester-specific tips

### 8. Postpartum Packet
Postpartum recovery and return to exercise.

**Required Fields:**
- `weeksPostpartum`: Weeks since delivery
- `deliveryType`: Vaginal or C-section
- `goals`: Recovery goals
- `coreRehab`: Core rehabilitation guidance
- `pelvicFloorGuidance`: Pelvic floor recovery

**Optional Fields:**
- `exercises`: Safe postpartum exercises
- `nutrition`: Recovery nutrition
- `returnToExercise`: Timeline for returning to exercise

### 9. Older Adult Packet
Active aging and functional fitness.

**Required Fields:**
- `functionalGoals`: Functional independence goals
- `safetyConsiderations`: Safety guidelines

**Optional Fields:**
- `exercises`: Functional fitness exercises
- `nutrition`: Nutrition for healthy aging
- `fallPrevention`: Fall prevention strategies
- `balanceTraining`: Balance exercises
- `mobilityWork`: Mobility and flexibility

## Base Components

The library provides reusable components for consistent styling:

### PDFHeader
```typescript
<PDFHeader
  title="Packet Title"
  subtitle="Subtitle"
  userName="John Doe"
  date={new Date()}
/>
```

### PDFFooter
```typescript
<PDFFooter pageNumber={1} totalPages={5} />
```

### Section
```typescript
<Section title="Section Title">
  <Text>Content goes here</Text>
</Section>
```

### List
```typescript
<List items={['Item 1', 'Item 2', 'Item 3']} ordered={false} />
```

### Table
```typescript
<Table
  headers={['Exercise', 'Sets', 'Reps']}
  rows={[
    ['Squats', '3', '10-12'],
    ['Push-ups', '3', '8-10'],
  ]}
/>
```

### Disclaimer
```typescript
<Disclaimer text="Custom disclaimer text..." />
```

## Styling

All templates use the `baseStyles` from `components/base.tsx`. To customize:

1. Modify `baseStyles` for global changes
2. Override styles in individual templates for specific customization
3. Use inline styles for one-off adjustments

## Adding New Templates

To add a new packet type:

1. **Define Types** in `types.ts`:
```typescript
export interface NewPacketContent extends PacketData {
  type: 'NEW_TYPE';
  // Add specific fields
}
```

2. **Create Template** in `templates/new-packet.tsx`:
```typescript
export const NewPacketTemplate: React.FC<{ content: NewPacketContent }> = ({
  content,
}) => {
  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <PDFHeader title="New Packet" />
        {/* Add content */}
        <Disclaimer />
        <PDFFooter />
      </Page>
    </Document>
  );
};
```

3. **Register Template** in `template-registry.tsx`:
```typescript
export const TEMPLATE_REGISTRY = {
  // ...existing templates
  [PacketType.NEW_TYPE]: NewPacketTemplate,
};
```

4. **Add Validation** in `generator.ts`:
```typescript
case PacketType.NEW_TYPE:
  if (!content.requiredField) errors.push('Missing required field');
  break;
```

## Best Practices

1. **Always validate content** before generating PDFs
2. **Use type-safe content objects** to catch errors at compile time
3. **Include disclaimers** on all health-related packets
4. **Test templates** with various content scenarios
5. **Keep templates modular** - use base components for consistency
6. **Handle errors gracefully** - provide meaningful error messages
7. **Version packets** - include version numbers in filenames

## Error Handling

The library throws descriptive errors for:
- Missing required fields
- Invalid packet types
- Template not found
- Rendering failures

Always wrap PDF generation in try-catch blocks:

```typescript
try {
  const pdf = await generatePDFBuffer(content);
  // Handle success
} catch (error) {
  console.error('PDF generation failed:', error);
  // Handle error
}
```

## Performance Considerations

- PDF generation is CPU-intensive - consider using a queue for bulk generation
- Cache generated PDFs when possible
- Use streams for large PDFs to reduce memory usage
- Generate PDFs asynchronously to avoid blocking the main thread

## Future Enhancements

Potential improvements:
- [ ] Multi-page support with automatic pagination
- [ ] Image embedding from URLs
- [ ] Charts and graphs for progress tracking
- [ ] Internationalization support
- [ ] Custom branding/theming per organization
- [ ] PDF compression for smaller file sizes
- [ ] Watermarking for draft packets
