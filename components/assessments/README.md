# Assessment Module Framework

This directory contains the reusable assessment framework for the AFYA Client Portal.

## Overview

The assessment system provides a modular, multi-section form framework with:
- Progress tracking across sections
- Save and resume functionality
- Dynamic question branching based on previous answers
- Form validation
- Persistent storage in the database

## Components

### AssessmentForm
The main reusable component that renders multi-section assessments with:
- Section-based navigation
- Progress bar
- Save progress functionality
- Form validation
- Dynamic question rendering based on conditions

### Assessment Types

Six assessment modules are available:

1. **Nutrition Assessment** (`/assessments/nutrition`)
   - Dietary habits and goals
   - Food preferences and restrictions
   - Eating patterns and challenges

2. **Training Assessment** (`/assessments/training`)
   - Training experience and background
   - Current program and frequency
   - Goals and preferences
   - Health limitations

3. **Performance Assessment** (`/assessments/performance`)
   - Athletic background and sport
   - Performance metrics and benchmarks
   - Competition goals
   - Training schedule

4. **Youth Assessment** (`/assessments/youth`)
   - Age-appropriate questions
   - Activity levels and sports
   - Health habits (sleep, nutrition)
   - Goals and support system

5. **Recovery Assessment** (`/assessments/recovery`)
   - Injury history and current status
   - Medical care and treatment
   - Pain levels and limitations
   - Recovery goals and timeline

6. **Lifestyle Assessment** (`/assessments/lifestyle`)
   - Sleep habits and quality
   - Hydration patterns
   - Stress levels and management
   - Daily routines and habits

## Usage

Each assessment follows the same pattern:

1. Server component page loads existing assessment data
2. Client component renders the AssessmentForm with sections
3. User completes sections with auto-save
4. On completion, data is stored and user redirected

## Data Storage

All assessment data is stored in the `Assessment` table with:
- `userId`: Link to the user
- `type`: Assessment type enum
- `data`: JSON object with all responses
- `completed`: Boolean flag
- Timestamps for tracking

## Dynamic Branching

Questions can be conditionally shown based on previous answers using the `condition` property:

```typescript
{
  id: 'follow_up',
  question: 'Follow-up question',
  type: 'text',
  condition: (data) => data.previous_answer === 'Yes'
}
```

## Future Enhancements

- Packet generation from completed assessments
- Assessment analytics and insights
- Multi-language support
- Accessibility improvements
