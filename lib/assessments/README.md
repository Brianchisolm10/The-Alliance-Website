# Modular Assessment Framework

## Overview

The modular assessment framework provides a flexible, population-specific approach to collecting client data. Instead of fixed assessment forms, the system dynamically loads assessment modules based on the user's population type.

## Architecture

### Core Components

1. **Assessment Modules** - Self-contained assessment units with questions, validation, and data extraction
2. **Module Registry** - Central registry managing all available modules
3. **Unified Client Profile** - Consolidated data structure storing all assessment data
4. **Profile Service** - Service layer for storing and retrieving profile data
5. **Dynamic Module Loader** - React components for rendering modules

## Module Types

### Population-Specific Modules (Required)

These modules are automatically assigned based on the user's population:

- **Pregnancy Module** (`pregnancy`) - Trimester-specific assessment
- **Postpartum Module** (`postpartum`) - Recovery and wellness tracking
- **Elderly Module** (`elderly`) - Functional screening for older adults
- **Athlete Module** (`athlete`) - Sport-specific performance assessment
- **Youth Module** (`youth`) - Age-appropriate assessment with parental consent
- **Recovery Module** (`recovery`) - Injury and rehabilitation tracking

### Common Modules (Optional)

These modules are available to all populations:

- **Dietary Module** (`dietary`) - Food preferences, allergies, and restrictions
- **Lifestyle Module** (`lifestyle`) - Sleep, stress, hydration habits
- **Movement Module** (`movement`) - Current fitness level and movement readiness
- **Equipment Module** (`equipment`) - Available equipment and training environment

## Usage

### Creating a New Module

```typescript
import { Population } from '@prisma/client'
import { BaseAssessmentModule } from './base'
import { AssessmentSection, UnifiedClientProfile } from '../types'

export class MyCustomModule extends BaseAssessmentModule {
  id = 'my-module'
  name = 'My Custom Assessment'
  description = 'Description of what this assesses'
  populations = [Population.GENERAL, Population.ATHLETE]
  priority = 20
  category = 'lifestyle' as const
  required = false

  sections: AssessmentSection[] = [
    {
      id: 'section1',
      title: 'Section Title',
      description: 'Section description',
      questions: [
        {
          id: 'question1',
          question: 'Your question here?',
          type: 'select',
          options: ['Option 1', 'Option 2'],
          required: true,
        },
      ],
    },
  ]

  extractProfileData(formData: Record<string, any>): Partial<UnifiedClientProfile> {
    return {
      // Map form data to unified profile structure
      lifestyle: {
        sleepHours: formData.sleep_hours,
      },
    }
  }
}
```

### Registering a Module

Add your module to `lib/assessments/registry.ts`:

```typescript
import { MyCustomModule } from './modules/my-custom'

function initializeRegistry() {
  // ... existing modules
  assessmentRegistry.register(new MyCustomModule())
}
```

### Using Modules in Components

```typescript
import { assessmentRegistry } from '@/lib/assessments'

// Get modules for a specific population
const modules = assessmentRegistry.getModulesForPopulation(Population.ATHLETE)

// Get a specific module
const module = assessmentRegistry.getModule('pregnancy')

// Check if module is applicable
if (module.isApplicable(userPopulation)) {
  // Render module
}
```

### Server Actions

```typescript
import { saveModuleData, getModuleData } from '@/app/actions/modular-assessments'

// Save module data
await saveModuleData('dietary', formData, completed)

// Get module data
const data = await getModuleData('dietary')
```

## Data Flow

1. **User completes module** → Form data collected
2. **Module validation** → Data validated against module rules
3. **Data extraction** → Form data mapped to unified profile structure
4. **Profile merge** → New data merged with existing profile
5. **Database storage** → Stored in both raw form and unified profile

## Unified Client Profile Structure

```typescript
interface UnifiedClientProfile {
  demographics?: { age, gender, height, weight }
  populationData?: { /* population-specific fields */ }
  dietary?: { restrictions, allergies, preferences }
  lifestyle?: { sleep, stress, hydration }
  movement?: { fitness level, injuries, limitations }
  equipment?: { location, available equipment }
  goals?: { primary, secondary, timeline }
  medical?: { conditions, medications, clearance }
}
```

## Routes

- `/assessments/modules` - List all available modules
- `/assessments/modules/[moduleId]` - Complete a specific module

## Database Schema

The framework uses the existing `Assessment` model with a unique constraint on `userId` and `type`:

```prisma
model Assessment {
  id        String         @id @default(cuid())
  userId    String
  type      AssessmentType
  data      Json
  completed Boolean        @default(false)
  
  @@unique([userId, type])
}
```

## Benefits

1. **Flexibility** - Easy to add new modules without changing core code
2. **Population-Specific** - Only show relevant assessments
3. **Unified Data** - All data consolidated in one profile structure
4. **Reusability** - Common modules shared across populations
5. **Validation** - Built-in validation at module level
6. **Progressive** - Users can complete modules over time

## Migration from Old System

The old assessment system (nutrition, training, etc.) can coexist with the modular system. The modular system stores data in the unified profile while maintaining backward compatibility with existing assessment types.

## Future Enhancements

- Dynamic question branching based on previous answers
- Module dependencies (complete A before B)
- Progress tracking per module
- Module versioning for updates
- Export profile data for packet generation
- Admin interface for creating modules without code
