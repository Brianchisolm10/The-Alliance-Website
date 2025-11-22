# PDF Template System - Quick Reference

## Template Overview

| Template | Population | File | Color Theme | Key Features |
|----------|-----------|------|-------------|--------------|
| **General** | GENERAL | `general-packet.tsx` | Blue (#2563eb) | Balanced wellness, lifestyle integration |
| **Nutrition** | All | `nutrition-packet.tsx` | Green (#16a34a) | Meal plans, macros, dietary restrictions |
| **Training** | All | `training-packet.tsx` | Blue (#2563eb) | Multi-phase programs, progression |
| **Athlete** | ATHLETE | `athlete-packet.tsx` | Blue (#2563eb) | Sport-specific, performance focus |
| **Youth** | YOUTH | `youth-packet.tsx` | Yellow (#f59e0b) | Age-appropriate, fun, parent guidance |
| **Recovery** | RECOVERY | `recovery-packet.tsx` | Green (#16a34a) | Rehabilitation, contraindications |
| **Pregnancy** | PREGNANCY | `pregnancy-packet.tsx` | Purple (#c026d3) | Trimester-specific, safety warnings |
| **Postpartum** | POSTPARTUM | `postpartum-packet.tsx` | Orange (#f59e0b) | Core rehab, pelvic floor, timeline |
| **Older Adult** | OLDER_ADULT | `older-adult-packet.tsx` | Blue (#3b82f6) | Fall prevention, functional fitness |

## Common Components

### Base Components (from `components/base.tsx`)

```typescript
// Header
<PDFHeader
  title="Packet Title"
  subtitle="Subtitle"
  userName={content.userName}
  date={content.generatedAt}
/>

// Section
<Section title="Section Title">
  <Text>Content here</Text>
</Section>

// List
<List items={['Item 1', 'Item 2']} ordered={false} />

// Disclaimer
<Disclaimer text="Custom disclaimer text..." />

// Footer
<PDFFooter />
```

### Exercise Block Pattern

```typescript
const ExerciseBlock: React.FC<{ exercise: ExerciseData }> = ({ exercise }) => (
  <View style={{ marginBottom: 12, padding: 10, backgroundColor: '#f8fafc' }}>
    <Text style={{ fontWeight: 'bold', fontSize: 11 }}>{exercise.name}</Text>
    <Text style={{ fontSize: 10 }}>{exercise.description}</Text>
    <View style={{ flexDirection: 'row' }}>
      {exercise.sets && <Text>Sets: {exercise.sets}</Text>}
      {exercise.reps && <Text>Reps: {exercise.reps}</Text>}
    </View>
    {exercise.notes && <Text style={{ fontStyle: 'italic' }}>{exercise.notes}</Text>}
  </View>
);
```

### Nutrition Block Pattern

```typescript
const NutritionBlock: React.FC<{ nutrition: NutritionData }> = ({ nutrition }) => (
  <View style={{ marginBottom: 12, padding: 10, backgroundColor: '#f0fdf4' }}>
    <Text style={{ fontWeight: 'bold' }}>{nutrition.mealType}</Text>
    <List items={nutrition.foods} />
    {nutrition.macros && (
      <Text>
        P: {nutrition.macros.protein}g | C: {nutrition.macros.carbs}g | F: {nutrition.macros.fats}g
      </Text>
    )}
  </View>
);
```

### Warning Block Pattern

```typescript
<View style={{
  padding: 12,
  backgroundColor: '#fef2f2',
  borderLeft: '4 solid #dc2626',
}}>
  <Text style={{ fontWeight: 'bold', color: '#991b1b' }}>⚠ Warning</Text>
  <List items={warnings} />
</View>
```

## Content Type Interfaces

### Base Packet Data
```typescript
interface PacketData {
  id: string;
  type: PacketType;
  userId: string;
  userName: string;
  userEmail: string;
  population?: Population;
  generatedAt: Date;
  version: number;
}
```

### Exercise Data
```typescript
interface ExerciseData {
  id: string;
  name: string;
  description: string;
  sets?: number;
  reps?: string;
  duration?: string;
  intensity?: string;
  notes?: string;
  videoUrl?: string;
  imageUrl?: string;
  modifications?: string[];
  contraindications?: string[];
}
```

### Nutrition Data
```typescript
interface NutritionData {
  id: string;
  mealType: string;
  foods: string[];
  portions?: string[];
  calories?: number;
  macros?: {
    protein?: number;
    carbs?: number;
    fats?: number;
  };
  notes?: string;
  alternatives?: string[];
}
```

## Style Reference

### Typography
```typescript
{
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e40af' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e40af' },
  subsection: { fontSize: 12, fontWeight: 'bold' },
  body: { fontSize: 11, lineHeight: 1.5 },
  small: { fontSize: 9 },
}
```

### Colors
```typescript
{
  primary: '#2563eb',      // Blue
  success: '#16a34a',      // Green
  warning: '#f59e0b',      // Orange
  danger: '#dc2626',       // Red
  purple: '#c026d3',       // Purple
  gray: '#64748b',         // Gray
  lightBg: '#f8fafc',      // Light background
}
```

### Spacing
```typescript
{
  section: { marginBottom: 15 },
  block: { marginBottom: 12, padding: 10 },
  small: { marginBottom: 5 },
}
```

## Generation Flow

```
1. User completes assessments
   ↓
2. Profile service creates unified profile
   ↓
3. Packet generator selects exercises/nutrition from libraries
   ↓
4. Population-specific content generation function
   ↓
5. Template registry selects appropriate template
   ↓
6. PDF generator renders template to buffer/stream
   ↓
7. Packet saved to database with DRAFT status
```

## Key Files

| File | Purpose |
|------|---------|
| `types.ts` | Type definitions for all packet content |
| `template-registry.tsx` | Maps packet types to templates |
| `generator.tsx` | Renders templates to PDF |
| `packet-generator.ts` | Auto-generates packet content |
| `components/base.tsx` | Reusable PDF components |
| `templates/*.tsx` | Individual packet templates |

## Quick Commands

```bash
# Test PDF generation
npm run test:pdf

# Check types
npm run type-check

# Lint templates
npm run lint

# Build
npm run build
```

## Adding a New Template - Checklist

- [ ] Define content interface in `types.ts`
- [ ] Add to `AnyPacketContent` union type
- [ ] Create template file in `templates/`
- [ ] Register in `template-registry.tsx`
- [ ] Add generation function in `packet-generator.ts`
- [ ] Update validation in `generator.tsx`
- [ ] Add example data in `examples.ts`
- [ ] Test PDF generation
- [ ] Update documentation

## Common Patterns

### Conditional Rendering
```typescript
{content.field && content.field.length > 0 && (
  <Section title="Title">
    <List items={content.field} />
  </Section>
)}
```

### Mapping Arrays
```typescript
{content.items.map((item, index) => (
  <ItemBlock key={index} item={item} />
))}
```

### Flexbox Layout
```typescript
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <Text>Left</Text>
  <Text>Right</Text>
</View>
```

### Nested Styling
```typescript
<View style={[baseStyles.section, { backgroundColor: '#f8fafc' }]}>
  <Text style={[baseStyles.body, { color: '#64748b' }]}>Content</Text>
</View>
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| PDF not rendering | Check JSX syntax, verify imports |
| Layout broken | Review flexbox properties, check for unclosed tags |
| Missing content | Validate content object, add fallbacks |
| Type errors | Ensure content matches interface, use type guards |
| Styling issues | Check style object syntax, use baseStyles |

## Resources

- [Full Template System Guide](./TEMPLATE_SYSTEM_GUIDE.md)
- [React-PDF Docs](https://react-pdf.org/)
- [Examples](./examples.ts)
- [Base Components](./components/base.tsx)

---

**Quick Tip:** When in doubt, reference an existing template with similar requirements!
