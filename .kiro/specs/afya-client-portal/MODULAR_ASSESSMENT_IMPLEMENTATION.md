# Modular Assessment Framework Implementation

## Overview

Task 14.3 has been completed. A comprehensive modular assessment framework has been implemented that allows dynamic loading of population-specific assessment modules.

## What Was Built

### 1. Core Framework (`lib/assessments/`)

#### Type System (`types.ts`)
- `AssessmentQuestion` - Question definition with validation
- `AssessmentSection` - Grouping of related questions
- `AssessmentModule` - Complete module interface
- `UnifiedClientProfile` - Consolidated data structure for all assessment data

#### Base Module System (`modules/base.ts`)
- `BaseAssessmentModule` - Abstract base class for all modules
- `AssessmentModuleRegistry` - Central registry for module management
- Built-in validation and data extraction methods

### 2. Population-Specific Modules

#### Pregnancy Module (`modules/pregnancy.ts`)
- Trimester-specific questions
- Pregnancy complications tracking
- Activity clearance verification
- Due date and previous pregnancy history

#### Postpartum Module (`modules/postpartum.ts`)
- Delivery type and complications
- Recovery status tracking
- Breastfeeding information
- Postpartum checkup status
- Pain and sleep tracking

#### Elderly Module (`modules/elderly.ts`)
- Functional screening (mobility, balance, strength, flexibility)
- Fall history and fear assessment
- Activities of daily living (ADL) evaluation
- Chronic conditions and medications
- Pain assessment

#### Athlete Module (`modules/athlete.ts`)
- Sport and position information
- Competition level tracking
- Training schedule and frequency
- Performance metrics and benchmarks
- Injury history
- Recovery and nutrition practices

#### Youth Module (`modules/youth.ts`)
- Age-appropriate questions
- Parental consent verification
- School sports participation
- Screen time tracking
- Health conditions and development
- Growth stage assessment

#### Recovery Module (`modules/recovery.ts`)
- Injury type and location
- Surgery information
- Current pain levels (rest and activity)
- Range of motion assessment
- Treatment history
- Clearance status from healthcare provider

### 3. Common/Lifestyle Modules

#### Dietary Module (`modules/dietary.ts`)
- Dietary patterns (vegetarian, vegan, keto, etc.)
- Food allergies and intolerances
- Cultural and religious preferences
- Eating habits and meal frequency

#### Lifestyle Module (`modules/lifestyle.ts`)
- Sleep hours and quality
- Hydration tracking
- Stress levels and management
- Daily activity level
- Smoking and alcohol consumption

#### Movement Module (`modules/movement.ts`)
- Current exercise frequency and types
- Fitness level self-assessment
- Pain areas and mobility limitations
- Previous injuries
- Movement goals and timeline

#### Equipment Module (`modules/equipment.ts`)
- Training location preferences
- Available equipment inventory
- Space constraints
- Time availability
- Noise constraints

### 4. Profile Service (`profile-service.ts`)

Functions for managing unified client profiles:
- `saveModuleToProfile()` - Save module data to unified profile
- `getUnifiedProfile()` - Retrieve complete profile
- `updateUnifiedProfile()` - Update profile directly
- `markProfileComplete()` - Mark assessment as complete
- `getCompletedModules()` - Get list of completed modules
- `getRequiredModulesForUser()` - Get required modules for user's population
- `hasCompletedRequiredModules()` - Check completion status
- `getProfileCompletionPercentage()` - Calculate progress

### 5. Module Registry (`registry.ts`)

Central registration system that:
- Initializes all modules on load
- Provides access to modules by ID
- Filters modules by population
- Separates required vs optional modules

### 6. Server Actions (`app/actions/modular-assessments.ts`)

- `getAvailableModules()` - Get modules for current user
- `getModuleById()` - Get specific module details
- `saveModuleData()` - Save module form data
- `getUserProfile()` - Get unified profile
- `getModuleData()` - Get existing module data
- `getAssessmentProgress()` - Get completion progress
- `completeAllAssessments()` - Mark all as complete

### 7. React Components

#### `ModularAssessment` (`components/assessments/modular-assessment.tsx`)
- Renders any assessment module dynamically
- Handles validation and error display
- Manages save and complete actions
- Shows progress and navigation

#### `ModulesListClient` (`app/(portal)/assessments/modules/modules-client.tsx`)
- Displays available modules
- Shows completion status
- Progress bar visualization
- Separates required vs optional modules

### 8. Routes

- `/assessments/modules` - List all available modules
- `/assessments/modules/[moduleId]` - Complete specific module

### 9. Database Changes

Added unique constraint to Assessment model:
```prisma
@@unique([userId, type])
```

This ensures one assessment per type per user.

## Key Features

### Dynamic Module Loading
Modules are loaded based on user's population. Only relevant assessments are shown.

### Unified Data Storage
All assessment data is consolidated into a single `UnifiedClientProfile` structure, making it easy to:
- Generate personalized packets
- Track progress across modules
- Export data for analysis

### Flexible Architecture
New modules can be added by:
1. Creating a new module class extending `BaseAssessmentModule`
2. Registering it in the registry
3. No changes to UI code needed

### Built-in Validation
Each module defines its own validation rules. The framework automatically:
- Validates required fields
- Runs custom validation functions
- Shows user-friendly error messages

### Progressive Completion
Users can:
- Save progress at any time
- Complete modules in any order
- Return to review completed modules

### Population-Specific
Each module declares which populations it applies to:
- `GENERAL`
- `ATHLETE`
- `YOUTH`
- `RECOVERY`
- `PREGNANCY`
- `POSTPARTUM`
- `OLDER_ADULT`
- `CHRONIC_CONDITION`

## Data Flow

1. User navigates to `/assessments/modules`
2. System fetches user's population
3. Registry returns applicable modules
4. User selects a module
5. Module renders with dynamic questions
6. User completes sections
7. Data is validated
8. Data is extracted to unified profile format
9. Stored in database (both raw and unified)
10. Progress updated

## Integration Points

### With Existing System
- Coexists with current assessment pages
- Link added to main assessments page
- Uses same authentication and authorization
- Stores data in existing Assessment model

### With Packet Generation (Future)
The unified profile structure is designed to feed directly into packet generation:
```typescript
const profile = await getUnifiedProfile(userId)
// Use profile.populationData, profile.dietary, etc. for packet generation
```

## Testing Considerations

To test the implementation:

1. **Database Migration**: Run `npx prisma migrate dev` to add unique constraint
2. **Assign Population**: User must have a population assigned
3. **Navigate**: Go to `/assessments/modules`
4. **Complete Module**: Select and complete a module
5. **Verify Storage**: Check unified profile is created
6. **Test Validation**: Try submitting incomplete required fields
7. **Test Progress**: Save progress and return later

## Files Created

```
lib/assessments/
├── types.ts                      # Core type definitions
├── index.ts                      # Main exports
├── registry.ts                   # Module registry
├── profile-service.ts            # Profile management
├── README.md                     # Documentation
└── modules/
    ├── base.ts                   # Base module class
    ├── pregnancy.ts              # Pregnancy module
    ├── postpartum.ts             # Postpartum module
    ├── elderly.ts                # Elderly module
    ├── athlete.ts                # Athlete module
    ├── youth.ts                  # Youth module
    ├── recovery.ts               # Recovery module
    ├── dietary.ts                # Dietary module
    ├── lifestyle.ts              # Lifestyle module
    ├── movement.ts               # Movement module
    └── equipment.ts              # Equipment module

components/assessments/
└── modular-assessment.tsx        # Module renderer component

app/actions/
└── modular-assessments.ts        # Server actions

app/(portal)/assessments/modules/
├── page.tsx                      # Modules list page
├── modules-client.tsx            # Client component
└── [moduleId]/
    ├── page.tsx                  # Module page
    └── module-client.tsx         # Module client component
```

## Next Steps

To fully utilize this framework:

1. **Run Migration**: Apply database schema changes
2. **Test Each Module**: Verify all population-specific modules work
3. **Integrate with Packet Generation**: Use unified profile in task 14.6
4. **Add Admin Interface**: Allow admins to view client profiles (task 14.8)
5. **Create Module Analytics**: Track completion rates per module

## Benefits Delivered

✅ **Modular Architecture** - Easy to add new assessment types
✅ **Population-Specific** - Only show relevant assessments  
✅ **Unified Data Model** - All data in one consolidated structure
✅ **Dynamic Loading** - Modules loaded based on user population
✅ **Built-in Validation** - Each module validates its own data
✅ **Progress Tracking** - Users can see completion status
✅ **Flexible Storage** - Both raw and processed data stored
✅ **Reusable Components** - Common modules shared across populations

## Requirements Met

- ✅ Build base assessment module interface
- ✅ Create population-specific assessment modules (pregnancy, postpartum, elderly, athlete, youth, recovery)
- ✅ Implement dynamic module loading based on population
- ✅ Add dietary restrictions, lifestyle habits, movement readiness, equipment availability modules
- ✅ Store all assessment data in unified client profile
- ✅ Requirements 5.1, 5.2, 5.4 addressed
