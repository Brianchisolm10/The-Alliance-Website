# Population Routing System

The Population Routing System provides population-based classification and assessment routing for the AFYA wellness platform.

## Overview

The system allows admins to assign users to specific populations (e.g., ATHLETE, YOUTH, PREGNANCY) during the discovery call process. Each population has a customized set of required and optional assessments that are automatically displayed to users in their portal.

## Populations

The system supports the following populations:

- **GENERAL**: General wellness and health optimization
- **ATHLETE**: Athletic performance and training optimization
- **YOUTH**: Age-appropriate wellness for young athletes
- **RECOVERY**: Injury recovery and rehabilitation
- **PREGNANCY**: Prenatal wellness and fitness
- **POSTPARTUM**: Postpartum recovery and wellness
- **OLDER_ADULT**: Age-appropriate wellness for older adults
- **CHRONIC_CONDITION**: Wellness management for chronic conditions

## Features

### 1. Population Classification

The `classifyPopulation()` function provides automated population classification based on discovery call data:

```typescript
import { classifyPopulation } from '@/lib/population/routing'

const population = classifyPopulation({
  age: 25,
  isAthlete: true,
  hasInjury: false,
})
// Returns: 'ATHLETE'
```

### 2. Population Assignment

Admins can assign populations to users during discovery call conversion:

```typescript
import { convertDiscoveryWithPopulation } from '@/app/actions/population'

const result = await convertDiscoveryWithPopulation({
  discoverySubmissionId: 'abc123',
  population: 'ATHLETE',
  notes: 'Competitive runner, training for marathon',
})
```

### 3. Assessment Routing

Users see only the assessments relevant to their population:

```typescript
import { getPopulationAssessments } from '@/lib/population/routing'

const config = getPopulationAssessments('ATHLETE')
// Returns:
// {
//   required: ['NUTRITION', 'TRAINING', 'PERFORMANCE', 'RECOVERY'],
//   optional: ['LIFESTYLE'],
//   description: 'Athletic performance and training optimization'
// }
```

### 4. Population Switching

Admins can update a user's population for multi-classification clients:

```typescript
import { updateUserPopulation } from '@/app/actions/population'

const result = await updateUserPopulation({
  userId: 'user123',
  population: 'RECOVERY',
  reason: 'Client sustained injury, switching to recovery focus',
})
```

## Assessment Configuration

Each population has a specific set of assessments:

### GENERAL
- **Required**: Nutrition, Lifestyle
- **Optional**: Training, Recovery

### ATHLETE
- **Required**: Nutrition, Training, Performance, Recovery
- **Optional**: Lifestyle

### YOUTH
- **Required**: Youth, Nutrition, Lifestyle
- **Optional**: Training, Performance

### RECOVERY
- **Required**: Recovery, Nutrition, Lifestyle
- **Optional**: Training

### PREGNANCY
- **Required**: Nutrition, Lifestyle, Recovery
- **Optional**: Training

### POSTPARTUM
- **Required**: Nutrition, Lifestyle, Recovery
- **Optional**: Training

### OLDER_ADULT
- **Required**: Nutrition, Lifestyle, Recovery
- **Optional**: Training

### CHRONIC_CONDITION
- **Required**: Nutrition, Lifestyle, Recovery
- **Optional**: Training

## Usage in Components

### Admin: Discovery Conversion

The `PopulationAssignment` component is used in the admin panel to assign populations during discovery call conversion:

```tsx
import { PopulationAssignment } from '@/components/admin/population-assignment'

<PopulationAssignment
  discoverySubmissionId={submissionId}
  mode="convert"
  onSuccess={() => router.refresh()}
/>
```

### Client Portal: Assessment Display

The assessments page automatically filters assessments based on the user's population:

```tsx
// app/(portal)/assessments/page.tsx
const user = await populationQueries.getUserWithPopulation(userId)
const populationConfig = getPopulationAssessments(user.population)

// Display only required and optional assessments for this population
```

### Dashboard: Population Info

The dashboard displays the user's current population pathway:

```tsx
import { PopulationInfo } from '@/components/portal/population-info'

{user?.population && (
  <PopulationInfo population={user.population} showDetails={true} />
)}
```

## API Reference

### Server Actions

#### `assignPopulation(data)`
Assign a population to an existing user.

**Parameters:**
- `userId`: string - User ID
- `population`: Population - Population to assign
- `adminNotes`: string (optional) - Admin notes

#### `updateUserPopulation(data)`
Update a user's population (for multi-classification).

**Parameters:**
- `userId`: string - User ID
- `population`: Population - New population
- `reason`: string (optional) - Reason for change

#### `convertDiscoveryWithPopulation(data)`
Convert a discovery submission to a user account with population assignment.

**Parameters:**
- `discoverySubmissionId`: string - Discovery submission ID
- `population`: Population - Population to assign
- `role`: UserRole (optional) - User role (default: USER)
- `notes`: string (optional) - Admin notes

#### `getUserPopulation()`
Get the current user's population.

**Returns:**
- `population`: Population | null

### Utility Functions

#### `getPopulationAssessments(population)`
Get assessment configuration for a population.

#### `getAllAssessmentTypes(population)`
Get all assessment types (required + optional) for a population.

#### `isAssessmentAvailable(population, assessmentType)`
Check if an assessment is available for a population.

#### `isAssessmentRequired(population, assessmentType)`
Check if an assessment is required for a population.

#### `classifyPopulation(data)`
Automatically classify population based on discovery data.

#### `formatPopulationName(population)`
Format population enum to display name.

#### `getAllPopulations()`
Get all available populations with their info.

## Database Schema

The population field is stored in the User model:

```prisma
model User {
  id         String      @id @default(cuid())
  email      String      @unique
  name       String?
  population Population?
  // ... other fields
}

enum Population {
  GENERAL
  ATHLETE
  YOUTH
  RECOVERY
  PREGNANCY
  POSTPARTUM
  OLDER_ADULT
  CHRONIC_CONDITION
}
```

## Activity Logging

All population-related actions are logged:

- `POPULATION_ASSIGNED`: When a population is first assigned
- `POPULATION_UPDATED`: When a population is changed
- `DISCOVERY_CONVERTED`: When a discovery submission is converted with population

## Future Enhancements

- Multi-population support (users can have multiple active populations)
- Population-specific packet templates
- Population-based exercise and nutrition library filtering
- Automated population suggestions based on assessment responses
- Population transition workflows (e.g., PREGNANCY → POSTPARTUM)
