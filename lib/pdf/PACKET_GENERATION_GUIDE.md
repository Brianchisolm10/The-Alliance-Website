# Packet Auto-Generation Engine Guide

## Overview

The packet auto-generation engine is a sophisticated system that creates personalized health and wellness packets based on:

- User population assignment (GENERAL, ATHLETE, YOUTH, RECOVERY, PREGNANCY, POSTPARTUM, OLDER_ADULT, CHRONIC_CONDITION)
- Unified client profile data from assessment modules
- Exercise library with population-specific safety rules
- Nutrition library with dietary constraints and contraindications
- Population-specific packet templates

## Architecture

### Core Components

1. **Packet Generator** (`lib/pdf/packet-generator.ts`)
   - Main generation engine
   - Population-to-packet-type mapping
   - Exercise and nutrition selection logic
   - Safety rule application
   - Content generation for all packet types

2. **Server Actions** (`app/actions/packet-generation.ts`)
   - `generatePacket()` - Generate specific packet type
   - `generatePacketForPopulation()` - Auto-select packet type based on population
   - `regeneratePacket()` - Update existing packet with new data
   - `getAvailablePacketTypes()` - Get packet types available for user
   - `canGeneratePacket()` - Check if user has completed required assessments

3. **Supporting Services**
   - Profile Service - Retrieves unified client profile
   - Exercise Library Service - Fetches population-appropriate exercises
   - Nutrition Library Service - Fetches dietary-compliant nutrition items

## Population to Packet Type Mapping

| Population | Primary Packet Type | Additional Available Types |
|-----------|-------------------|---------------------------|
| GENERAL | GENERAL | NUTRITION, TRAINING |
| ATHLETE | ATHLETE_PERFORMANCE | GENERAL, NUTRITION, TRAINING |
| YOUTH | YOUTH | GENERAL, NUTRITION, TRAINING |
| RECOVERY | RECOVERY | GENERAL, NUTRITION, TRAINING |
| PREGNANCY | PREGNANCY | GENERAL, NUTRITION |
| POSTPARTUM | POSTPARTUM | GENERAL, NUTRITION |
| OLDER_ADULT | OLDER_ADULT | GENERAL, NUTRITION, TRAINING |
| CHRONIC_CONDITION | GENERAL | NUTRITION, TRAINING |

## Generation Process

### 1. Data Collection

The engine collects data from multiple sources:

```typescript
// User basic info
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id, name, email, population }
});

// Unified profile from assessments
const profile = await getUnifiedProfile(userId);

// Population-appropriate exercises
const exercises = await getExercisesForPacket(population, profile, packetType);

// Dietary-compliant nutrition
const nutrition = await getNutritionForPacket(population, profile, packetType);
```

### 2. Exercise Selection

Exercises are selected based on:

- **Population**: Only exercises marked safe for the population
- **Fitness Level**: Beginner, Intermediate, Advanced, Elite
- **Available Equipment**: Filters by user's equipment access
- **Packet Type**: Different categories for different packet types
  - Athlete: Strength, Plyometric, Cardio
  - Recovery: Mobility, Flexibility, Balance
  - Older Adult: Balance, Functional, Mobility, Strength
  - Pregnancy/Postpartum: Core, Flexibility, Functional, Balance
  - Youth: Functional, Balance, Cardio, Flexibility

**Safety Rules Applied:**
- Contraindications filtered by library service
- Injury history considered
- Progressions/regressions included for adaptation

**Sets and Reps Logic:**
```typescript
// Base values
let sets = 3;
let reps = '10-12';

// Adjust for fitness level
if (fitnessLevel === 'Beginner') {
  sets = 2;
  reps = '8-10';
} else if (fitnessLevel === 'Advanced' || 'Elite') {
  sets = 4;
  reps = '12-15';
}

// Adjust for goals
if (goal.includes('strength')) {
  reps = '6-8';
  sets = 4;
} else if (goal.includes('endurance')) {
  reps = '15-20';
  sets = 3;
}
```

### 3. Nutrition Selection

Nutrition items are selected based on:

- **Population**: Only items marked safe for the population
- **Dietary Restrictions**: Vegan, Vegetarian, Gluten-Free, etc.
- **Allergens**: Excludes items with user's allergens
- **Meal Balance**: Includes breakfast, lunch, dinner, and snacks

**Safety Rules Applied:**
- Contraindications filtered by library service
- Allergen exclusions
- Dietary preference matching
- Alternative suggestions included

### 4. Content Generation

Each packet type has specialized content generation:

#### General Packet
- Introduction and welcome message
- Primary and secondary goals
- General recommendations (hydration, sleep, stress)
- Balanced exercise selection (8 exercises)
- Balanced meal plan (6 items)
- Lifestyle guidance

#### Nutrition Packet
- Nutrition-specific goals
- Comprehensive meal plan
- Dietary guidelines
- Restrictions and allergens list
- Supplement recommendations (if applicable)

#### Training Packet
- Training goals
- Multi-phase program (Foundation → Progressive)
- Progression plan
- Safety notes and warm-up guidance

#### Athlete Performance Packet
- Sport and position information
- Performance goals
- Strength program (8 exercises)
- Conditioning program (4 exercises)
- Recovery protocol
- Nutrition strategy

#### Youth Packet
- Age and development stage
- Age-appropriate goals
- Fun, skill-focused exercises (6 exercises)
- Nutrition guidance (6 items)
- Parent guidance
- Safety guidelines

#### Recovery Packet
- Injury type and recovery stage
- Recovery goals
- Rehabilitation exercises (6 exercises)
- Contraindications
- Progression criteria
- Return-to-activity plan (4 phases)

#### Pregnancy Packet
- Trimester information
- Pregnancy-safe goals
- Modified exercises (6 exercises)
- Pregnancy nutrition (6 items)
- Contraindications
- Warning signs to watch for
- Trimester-specific guidance

#### Postpartum Packet
- Weeks postpartum and delivery type
- Recovery goals
- Core and pelvic floor exercises (6 exercises)
- Postpartum nutrition (6 items)
- Core rehabilitation guidance
- Pelvic floor guidance
- Return-to-exercise timeline

#### Older Adult Packet
- Functional goals
- Balance and mobility exercises (8 exercises)
- Nutrition for aging (6 items)
- Fall prevention strategies
- Mobility work
- Balance training
- Safety considerations

### 5. Draft Packet Creation

Packets are created with DRAFT status:

```typescript
const packet = await prisma.packet.create({
  data: {
    userId,
    type: packetType,
    status: PacketStatus.DRAFT,
    data: content,
    version: 1,
  },
});
```

**Status Workflow:**
1. **DRAFT** - Initial generation, not visible to client
2. **UNPUBLISHED** - Admin reviewed but not released
3. **PUBLISHED** - Released to client, visible in portal
4. **ARCHIVED** - Old version, replaced by newer packet

## Usage Examples

### Generate Packet for User's Population

```typescript
import { generatePacketForPopulation } from '@/app/actions/packet-generation';

// Automatically selects appropriate packet type based on user's population
const result = await generatePacketForPopulation(userId);

if (result.success) {
  console.log('Packet created:', result.packetId);
} else {
  console.error('Error:', result.error);
}
```

### Generate Specific Packet Type

```typescript
import { generatePacket } from '@/app/actions/packet-generation';
import { PacketType } from '@prisma/client';

// Generate a nutrition packet specifically
const result = await generatePacket(userId, PacketType.NUTRITION);
```

### Check if User Can Generate Packet

```typescript
import { canGeneratePacket } from '@/app/actions/packet-generation';

const result = await canGeneratePacket(userId);

if (result.canGenerate) {
  // User has completed required assessments
  await generatePacketForPopulation(userId);
} else {
  // Show missing modules
  console.log('Complete these modules:', result.missingModules);
}
```

### Get Available Packet Types

```typescript
import { getAvailablePacketTypes } from '@/app/actions/packet-generation';

const result = await getAvailablePacketTypes(userId);

if (result.success) {
  // Show options to user
  console.log('Available packets:', result.packetTypes);
}
```

### Regenerate Existing Packet

```typescript
import { regeneratePacket } from '@/app/actions/packet-generation';

// Updates packet with latest profile data and increments version
const result = await regeneratePacket(packetId);
```

## Integration Points

### Assessment Completion

When a user completes an assessment module:

```typescript
// After saving assessment data
await saveModuleToProfile(userId, moduleId, formData);

// Check if ready to generate packet
const eligibility = await canGeneratePacket(userId);

if (eligibility.canGenerate) {
  // Offer to generate packet
  await generatePacketForPopulation(userId);
}
```

### Admin Workflow

Admin can trigger packet generation after discovery call:

```typescript
// After assigning population
await assignPopulation(userId, population);

// Generate initial packet
await generatePacketForPopulation(userId);

// Packet is created with DRAFT status for admin review
```

### Client Portal

Display available packets to generate:

```typescript
// Get available types
const { packetTypes } = await getAvailablePacketTypes(userId);

// Show generation options
packetTypes.forEach(type => {
  // Display button to generate each type
});
```

## Safety and Constraints

### Exercise Safety

1. **Population Filtering**: Only exercises marked for user's population
2. **Contraindication Checking**: Exercises with contraindications are excluded
3. **Equipment Matching**: Only exercises user can perform with available equipment
4. **Difficulty Scaling**: Exercises matched to fitness level
5. **Modifications Included**: Regressions provided for easier variations

### Nutrition Safety

1. **Population Filtering**: Only nutrition items marked for user's population
2. **Allergen Exclusion**: Items with user's allergens are excluded
3. **Dietary Compliance**: Items match dietary restrictions (vegan, gluten-free, etc.)
4. **Alternatives Provided**: Substitutions suggested for restrictions
5. **Contraindication Checking**: Items with contraindications are excluded

### Population-Specific Rules

#### Pregnancy
- No exercises lying flat on back after first trimester
- No contact sports or fall-risk activities
- Avoid overheating and dehydration
- Trimester-specific modifications

#### Postpartum
- Delivery-type considerations (vaginal vs. cesarean)
- Core and pelvic floor focus
- Gradual return-to-exercise timeline
- Weeks postpartum staging

#### Older Adult
- Fall prevention emphasis
- Balance training priority
- Functional movement focus
- Safety considerations for home environment

#### Recovery
- Injury-specific contraindications
- Mobility restrictions respected
- Progressive return-to-activity plan
- Pain-free movement emphasis

#### Youth
- Age-appropriate exercises
- Skill development over performance
- Parent supervision guidance
- Avoid early specialization

#### Athlete
- Sport-specific training
- Position-specific considerations
- Performance optimization
- Recovery protocol emphasis

## Error Handling

The engine handles various error scenarios:

```typescript
// User not found
if (!user) {
  throw new Error('User not found');
}

// Population not set
if (!user.population) {
  return { success: false, error: 'User population not set' };
}

// Insufficient assessment data
if (!profile) {
  return { success: false, error: 'Complete assessments first' };
}

// Authorization failures
if (!session?.user) {
  return { success: false, error: 'Unauthorized' };
}
```

## Performance Considerations

1. **Batch Queries**: Exercise and nutrition fetched in single queries
2. **Selective Fields**: Only required fields retrieved from database
3. **Caching**: Profile data cached during generation
4. **Async Operations**: All database operations are async
5. **Pagination**: Library queries limited to reasonable counts

## Future Enhancements

1. **AI Integration**: Use AI to generate personalized guidance text
2. **Dynamic Progression**: Adjust programs based on user progress
3. **Seasonal Variations**: Adapt programs for different seasons
4. **Goal-Specific Templates**: More specialized packet types
5. **Multi-Language Support**: Generate packets in multiple languages
6. **Video Integration**: Include exercise video links
7. **Progress Tracking**: Compare packets over time
8. **Collaborative Editing**: Multiple admins can review/edit
9. **Client Feedback**: Incorporate client feedback into regeneration
10. **Advanced Analytics**: Track packet effectiveness

## Troubleshooting

### Packet Generation Fails

1. Check user has population assigned
2. Verify assessment data exists
3. Ensure exercise/nutrition libraries are seeded
4. Check database connection
5. Review error logs for specific issues

### Empty Exercise/Nutrition Lists

1. Verify library items exist for population
2. Check contraindication rules aren't too restrictive
3. Ensure equipment filters aren't too narrow
4. Review allergen/dietary restriction combinations

### Incorrect Content

1. Verify profile data is accurate
2. Check population assignment is correct
3. Review library item populations
4. Ensure safety rules are properly configured

## Conclusion

The packet auto-generation engine provides a robust, safe, and personalized approach to creating health and wellness packets. By leveraging population-specific rules, comprehensive libraries, and detailed client profiles, it generates appropriate content while maintaining safety and compliance with best practices.
