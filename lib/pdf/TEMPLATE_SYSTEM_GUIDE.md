# PDF Template System Guide

## Overview

The AFYA PDF template system is a modular, extensible architecture for generating personalized wellness packets. Each packet type has its own dedicated template that follows consistent design patterns while allowing for population-specific customization.

## Architecture

### Core Components

1. **Template Files** (`lib/pdf/templates/`)
   - Individual React components for each packet type
   - Use `@react-pdf/renderer` for PDF generation
   - Leverage shared base components for consistency

2. **Template Registry** (`lib/pdf/template-registry.tsx`)
   - Central mapping of packet types to templates
   - Validation and helper functions
   - Type-safe template selection

3. **Base Components** (`lib/pdf/components/base.tsx`)
   - Reusable PDF building blocks
   - Consistent styling and layout
   - Header, footer, sections, lists, tables, disclaimers

4. **Type Definitions** (`lib/pdf/types.ts`)
   - TypeScript interfaces for all packet content types
   - Ensures type safety across the system

5. **PDF Generator** (`lib/pdf/generator.tsx`)
   - Service for rendering templates to PDF
   - Buffer and stream generation
   - Validation and error handling

6. **Packet Generator** (`lib/pdf/packet-generator.ts`)
   - Auto-generation engine
   - Population-specific logic
   - Exercise and nutrition library integration

## Implemented Templates

### 1. General Packet (`general-packet.tsx`)
**Population:** GENERAL  
**Purpose:** Balanced wellness program for general population

**Content Sections:**
- Welcome introduction
- Wellness goals
- Key recommendations
- Lifestyle guidance (sleep, hydration, stress)
- Recommended exercises
- Nutrition guidance

**Design Features:**
- Clean, professional layout
- Balanced exercise and nutrition content
- Lifestyle integration

### 2. Nutrition Packet (`nutrition-packet.tsx`)
**Population:** All populations  
**Purpose:** Focused nutrition planning and guidance

**Content Sections:**
- Nutrition goals
- Dietary considerations/restrictions
- Detailed meal plan with macros
- Nutrition guidelines
- Supplement recommendations

**Design Features:**
- Meal blocks with nutritional information
- Macro tracking
- Alternative food suggestions
- Portion guidance

### 3. Training Packet (`training-packet.tsx`)
**Population:** All populations  
**Purpose:** Structured training program with progression

**Content Sections:**
- Training goals
- Multi-phase program structure
- Exercise details with sets/reps
- Progression plan
- Safety guidelines

**Design Features:**
- Phase-based organization
- Progressive overload guidance
- Exercise modifications
- Contraindication warnings

### 4. Athlete Performance Packet (`athlete-packet.tsx`)
**Population:** ATHLETE  
**Purpose:** Sport-specific performance optimization

**Content Sections:**
- Sport and position information
- Performance goals
- Strength & power program
- Conditioning & endurance work
- Recovery protocol
- Performance nutrition strategy

**Design Features:**
- Sport-specific customization
- High-intensity focus
- Recovery emphasis
- Performance-oriented nutrition

### 5. Youth Packet (`youth-packet.tsx`)
**Population:** YOUTH  
**Purpose:** Age-appropriate wellness for children and adolescents

**Content Sections:**
- Parent/guardian guidance
- Age-appropriate goals
- Fun movement activities
- Healthy eating guide
- Safety guidelines

**Design Features:**
- Bright, engaging colors (yellow/orange theme)
- Simplified language
- Emphasis on fun and skill development
- Parent supervision notes
- Safety-first approach

### 6. Recovery Packet (`recovery-packet.tsx`)
**Population:** RECOVERY  
**Purpose:** Injury rehabilitation and safe return to activity

**Content Sections:**
- Recovery goals
- Contraindications (prominent warning)
- Rehabilitation exercises
- Progression criteria
- Return to activity plan

**Design Features:**
- Green theme for healing/recovery
- Prominent contraindication warnings
- Progressive rehabilitation phases
- Clear progression criteria
- Healthcare provider coordination emphasis

### 7. Pregnancy Packet (`pregnancy-packet.tsx`)
**Population:** PREGNANCY  
**Purpose:** Safe exercise and nutrition during pregnancy

**Content Sections:**
- Trimester-specific guidance
- Wellness goals
- Warning signs (prominent)
- Activities to avoid
- Safe pregnancy exercises
- Pregnancy nutrition

**Design Features:**
- Purple/pink theme
- Trimester-specific customization
- Prominent warning signs section
- Safety-focused modifications
- Prenatal care integration

### 8. Postpartum Packet (`postpartum-packet.tsx`)
**Population:** POSTPARTUM  
**Purpose:** Recovery and return to exercise after childbirth

**Content Sections:**
- Recovery goals
- Core rehabilitation guidance
- Pelvic floor recovery
- Return to exercise timeline
- Safe postpartum exercises
- Recovery nutrition

**Design Features:**
- Warm yellow/orange theme
- Delivery type consideration (vaginal/cesarean)
- Weeks postpartum tracking
- Core and pelvic floor emphasis
- Gradual progression timeline

### 9. Older Adult Packet (`older-adult-packet.tsx`)
**Population:** OLDER_ADULT  
**Purpose:** Active aging and functional independence

**Content Sections:**
- Functional goals
- Safety considerations
- Fall prevention strategies
- Balance & stability training
- Mobility & flexibility work
- Functional fitness exercises
- Nutrition for healthy aging

**Design Features:**
- Blue theme for trust and stability
- Functional focus (ADLs)
- Fall prevention emphasis
- Balance training priority
- Safety-first approach
- Easier modification options

## Creating a New Template

### Step 1: Define Content Type

Add a new interface in `lib/pdf/types.ts`:

```typescript
export interface NewPopulationPacketContent extends PacketData {
  type: 'NEW_POPULATION';
  // Add population-specific fields
  specificField: string;
  goals: string[];
  exercises: ExerciseData[];
  nutrition: NutritionData[];
  // ... other fields
}
```

Update the union type:

```typescript
export type AnyPacketContent =
  | GeneralPacketContent
  | NutritionPacketContent
  // ... existing types
  | NewPopulationPacketContent;
```

### Step 2: Create Template Component

Create `lib/pdf/templates/new-population-packet.tsx`:

```typescript
import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import {
  PDFHeader,
  PDFFooter,
  Section,
  List,
  Disclaimer,
  baseStyles,
} from '../components/base';
import { NewPopulationPacketContent, ExerciseData, NutritionData } from '../types';

interface NewPopulationPacketProps {
  content: NewPopulationPacketContent;
}

export const NewPopulationPacketTemplate: React.FC<NewPopulationPacketProps> = ({
  content,
}) => {
  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <PDFHeader
          title="New Population Packet"
          subtitle="Your Personalized Guide"
          userName={content.userName}
          date={content.generatedAt}
        />

        {/* Add your sections here */}
        <Section title="Your Goals">
          <List items={content.goals} ordered />
        </Section>

        {/* Exercises */}
        {content.exercises && content.exercises.length > 0 && (
          <Section title="Recommended Exercises">
            {content.exercises.map((exercise, index) => (
              <ExerciseBlock key={index} exercise={exercise} />
            ))}
          </Section>
        )}

        {/* Custom disclaimer if needed */}
        <Disclaimer
          text="Your custom disclaimer text here..."
        />
        <PDFFooter />
      </Page>
    </Document>
  );
};

// Add helper components as needed
const ExerciseBlock: React.FC<{ exercise: ExerciseData }> = ({ exercise }) => (
  <View style={{ marginBottom: 12, padding: 10, backgroundColor: '#f8fafc' }}>
    <Text style={{ fontWeight: 'bold', fontSize: 11 }}>{exercise.name}</Text>
    <Text style={{ fontSize: 10 }}>{exercise.description}</Text>
    {/* Add more exercise details */}
  </View>
);
```

### Step 3: Register Template

Update `lib/pdf/template-registry.tsx`:

```typescript
import { NewPopulationPacketTemplate } from './templates/new-population-packet';

export const TEMPLATE_REGISTRY: Record<
  PacketType,
  React.FC<{ content: any }>
> = {
  // ... existing templates
  [PacketType.NEW_POPULATION]: NewPopulationPacketTemplate,
};
```

Update the name mapping:

```typescript
export function getPacketTypeName(packetType: PacketType): string {
  const names: Record<PacketType, string> = {
    // ... existing names
    [PacketType.NEW_POPULATION]: 'New Population Packet',
  };
  return names[packetType] || packetType;
}
```

### Step 4: Add Generation Logic

Update `lib/pdf/packet-generator.ts`:

```typescript
// Add population to packet type mapping
export function getPacketTypeForPopulation(population: Population): PacketType {
  const mapping: Record<Population, PacketType> = {
    // ... existing mappings
    [Population.NEW_POPULATION]: PacketType.NEW_POPULATION,
  };
  return mapping[population];
}

// Add generation function
function generateNewPopulationPacket(
  baseData: any,
  profile: UnifiedClientProfile,
  exercises: ExerciseData[],
  nutrition: NutritionData[]
): NewPopulationPacketContent {
  return {
    ...baseData,
    type: PacketType.NEW_POPULATION,
    specificField: 'value',
    goals: [
      profile.goals?.primary || 'Default goal',
      ...(profile.goals?.secondary || []),
    ],
    exercises: exercises.slice(0, 8),
    nutrition: nutrition.slice(0, 6),
    // ... other fields
  };
}

// Add to switch statement in generatePacketContent
switch (packetType) {
  // ... existing cases
  case PacketType.NEW_POPULATION:
    return generateNewPopulationPacket(baseData, profile, exercises, nutrition);
}
```

### Step 5: Add Validation

Update `lib/pdf/generator.tsx`:

```typescript
export function validatePDFPrerequisites(content: AnyPacketContent): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // ... existing validation
  
  switch (content.type) {
    // ... existing cases
    case PacketType.NEW_POPULATION:
      if (!content.specificField) {
        errors.push('Missing specific field');
      }
      break;
  }
  
  return { valid: errors.length === 0, errors };
}
```

## Design Guidelines

### Color Themes

Each template uses a consistent color theme:

- **General:** Blue (`#2563eb`) - Professional, trustworthy
- **Nutrition:** Green (`#16a34a`) - Health, vitality
- **Training:** Blue (`#2563eb`) - Strength, discipline
- **Athlete:** Blue (`#2563eb`) - Performance, power
- **Youth:** Yellow/Orange (`#f59e0b`) - Energy, fun
- **Recovery:** Green (`#16a34a`) - Healing, growth
- **Pregnancy:** Purple/Pink (`#c026d3`) - Care, nurturing
- **Postpartum:** Yellow/Orange (`#f59e0b`) - Warmth, recovery
- **Older Adult:** Blue (`#3b82f6`) - Trust, stability

### Typography

- **Page Title:** 24pt, bold
- **Section Title:** 16pt, bold
- **Subsection:** 12pt, bold
- **Body Text:** 11pt, regular
- **Small Text:** 9-10pt
- **Disclaimer:** 9pt, italic

### Layout Principles

1. **Consistent Spacing:** Use 15-20px margins between sections
2. **Visual Hierarchy:** Clear distinction between headers and content
3. **Readability:** Adequate line height (1.5) and font size
4. **White Space:** Don't overcrowd - let content breathe
5. **Borders:** Use subtle borders (1-4px) for emphasis
6. **Background Colors:** Light backgrounds (#f8fafc, #f0fdf4) for blocks

### Component Patterns

#### Exercise Block
```typescript
<View style={{ marginBottom: 12, padding: 10, backgroundColor: '#f8fafc' }}>
  <Text style={{ fontWeight: 'bold', fontSize: 11 }}>{exercise.name}</Text>
  <Text style={{ fontSize: 10 }}>{exercise.description}</Text>
  <View style={{ flexDirection: 'row' }}>
    <Text>Sets: {exercise.sets}</Text>
    <Text>Reps: {exercise.reps}</Text>
  </View>
  {exercise.notes && <Text style={{ fontStyle: 'italic' }}>{exercise.notes}</Text>}
</View>
```

#### Nutrition Block
```typescript
<View style={{ marginBottom: 12, padding: 10, backgroundColor: '#f0fdf4' }}>
  <Text style={{ fontWeight: 'bold' }}>{nutrition.mealType}</Text>
  <List items={nutrition.foods} />
  {nutrition.macros && (
    <Text>P: {macros.protein}g | C: {macros.carbs}g | F: {macros.fats}g</Text>
  )}
</View>
```

#### Warning/Contraindication Block
```typescript
<View style={{
  padding: 12,
  backgroundColor: '#fef2f2',
  borderLeft: '4 solid #dc2626',
}}>
  <Text style={{ fontWeight: 'bold', color: '#991b1b' }}>
    ⚠ Important Warning
  </Text>
  <List items={warnings} />
</View>
```

## Testing Templates

### Manual Testing

1. Create test data in `lib/pdf/examples.ts`
2. Use the test generation script: `npm run test:pdf`
3. Review generated PDFs for:
   - Layout correctness
   - Content rendering
   - Typography consistency
   - Color scheme
   - Page breaks

### Automated Testing

```typescript
import { generatePDFBuffer } from './generator';
import { exampleGeneralPacket } from './examples';

describe('PDF Generation', () => {
  it('should generate general packet PDF', async () => {
    const buffer = await generatePDFBuffer(exampleGeneralPacket);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });
});
```

## Best Practices

### 1. Type Safety
- Always use TypeScript interfaces
- Validate content before rendering
- Handle optional fields gracefully

### 2. Error Handling
- Wrap PDF generation in try-catch
- Provide meaningful error messages
- Log errors for debugging

### 3. Performance
- Limit content size (8-12 exercises, 6-8 meals)
- Optimize images (compress, resize)
- Use pagination for long content

### 4. Accessibility
- Use semantic structure
- Provide alt text for images
- Ensure sufficient color contrast
- Use readable font sizes

### 5. Maintainability
- Keep templates focused and modular
- Reuse base components
- Document population-specific logic
- Follow consistent naming conventions

### 6. Population-Specific Considerations
- **Safety First:** Always include appropriate disclaimers
- **Age Appropriateness:** Adjust language and complexity
- **Medical Clearance:** Emphasize healthcare provider consultation
- **Progressive Approach:** Start conservative, progress gradually
- **Contraindications:** Clearly highlight what to avoid

## Troubleshooting

### Common Issues

**Issue:** PDF not rendering
- Check for syntax errors in JSX
- Verify all imports are correct
- Ensure content matches type interface

**Issue:** Layout problems
- Review flexbox properties
- Check for missing closing tags
- Verify style object syntax

**Issue:** Missing content
- Validate content object has required fields
- Check for null/undefined values
- Add fallbacks for optional fields

**Issue:** Type errors
- Ensure content type matches template expectations
- Update type definitions if needed
- Use type guards for optional fields

## Future Enhancements

### Planned Features
1. **Multi-page Support:** Automatic pagination for long content
2. **Image Integration:** Exercise demonstration images
3. **Charts/Graphs:** Progress tracking visualizations
4. **QR Codes:** Links to video demonstrations
5. **Localization:** Multi-language support
6. **Themes:** Customizable color schemes
7. **Branding:** Client-specific branding options

### Extensibility Points
- Custom exercise blocks per population
- Population-specific nutrition formatting
- Conditional content based on assessment data
- Dynamic disclaimer text
- Customizable header/footer
- Template variants (print vs digital)

## Resources

- [@react-pdf/renderer Documentation](https://react-pdf.org/)
- [AFYA Design System](../design-system.md)
- [Population Assessment Modules](../assessments/README.md)
- [Exercise Library](../libraries/README.md)
- [Nutrition Library](../libraries/README.md)

## Support

For questions or issues with the template system:
1. Check this documentation
2. Review existing templates for examples
3. Test with example data
4. Consult the development team

---

**Last Updated:** November 22, 2024  
**Version:** 1.0.0
