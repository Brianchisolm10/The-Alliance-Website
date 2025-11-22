# Packet Review and Editing System - Implementation Guide

## Overview

The packet review and editing system provides administrators with comprehensive tools to review, edit, and publish health packets before they are delivered to clients. This system implements task 14.8 from the implementation plan.

## Features Implemented

### 1. Packet Review Dashboard (`/admin/packets`)

A centralized dashboard for reviewing all draft and unpublished packets:

- **Filtering**: Filter by status (Draft, Unpublished, Published, Archived), packet type, and search by client
- **Statistics**: Quick overview of packet counts by status
- **Packet Cards**: Display key information including:
  - Packet type and status
  - Client information
  - Population assignment
  - Creation and modification dates
  - Last modifier
  - Version number

### 2. Packet Editor (`/admin/packets/[id]`)

Comprehensive editing interface with multiple capabilities:

#### Exercise Management
- **View Exercises**: Display all exercises in the packet with sets, reps, duration, and intensity
- **Edit Parameters**: Modify sets, reps, duration, intensity, and notes for each exercise
- **Swap Exercises**: Replace exercises with alternatives from the exercise library
  - Search and filter exercises by population
  - Preview exercise details before swapping
  - Maintains existing sets/reps when swapping

#### Nutrition Management
- **View Nutrition Items**: Display meal plans with foods, portions, and macros
- **Edit Nutrition**: Modify foods, portions, calories, macros, notes, and alternatives
- **Macro Tracking**: Edit protein, carbs, and fats for each meal

#### General Content Editing
- **Introduction**: Edit packet introduction text
- **Goals**: Modify client goals
- **Coach Notes**: Add internal notes and guidance for clients

#### Version Control
- **Version History**: View all previous versions of the packet
- **Version Comparison**: Compare two versions side-by-side
- **Restore Versions**: Roll back to any previous version
- **Automatic Versioning**: Every edit creates a new version automatically

#### Publishing Workflow
- **Publish**: Change status from DRAFT/UNPUBLISHED to PUBLISHED
- **Unpublish**: Revert published packets to unpublished for revisions
- **Status Tracking**: Track who published and when

## File Structure

```
app/
├── actions/
│   └── packet-editing.ts              # Server actions for packet editing
├── admin/
│   ├── packets/
│   │   ├── page.tsx                   # Packet review dashboard
│   │   └── [id]/
│   │       └── page.tsx               # Individual packet editor
│   └── libraries/
│       └── page.tsx                   # Libraries landing page

components/
└── admin/
    ├── packet-editor.tsx              # Main packet editing component
    ├── exercise-swap-dialog.tsx       # Exercise swap interface
    ├── nutrition-editor.tsx           # Nutrition editing dialog
    └── packet-version-history.tsx     # Version history viewer
```

## Server Actions

### Packet Retrieval
- `getPacketsForReview()`: Fetch packets for admin review with filters
- `getPacketForEditing()`: Get single packet with full details

### Content Editing
- `updatePacketContent()`: Update packet data with versioning
- `updateExerciseParameters()`: Modify exercise sets/reps/notes
- `swapExercise()`: Replace exercise with library alternative
- `updateNutritionItem()`: Edit nutrition item details
- `addCoachNotes()`: Add coach notes to packet

### Publishing
- `publishPacket()`: Publish packet to client
- `unpublishPacket()`: Unpublish for revisions

### Version Control
- `getPacketVersionHistory()`: Fetch version history
- `restorePacketVersion()`: Restore previous version

## Usage Guide

### For Administrators

#### Reviewing Packets

1. Navigate to `/admin/packets`
2. Use filters to find packets needing review
3. Click "Review & Edit" on any packet

#### Editing Exercises

1. In the packet editor, find the exercise to edit
2. Click "Edit" to modify sets, reps, duration, intensity, or notes
3. Click "Swap" to replace with a different exercise from the library
4. Changes are saved automatically and create a new version

#### Editing Nutrition

1. Find the nutrition item in the packet
2. Click "Edit" to modify foods, portions, macros, or notes
3. Save changes to update the packet

#### Adding Coach Notes

1. Click "Add Coach Notes" button
2. Enter notes for the client or internal team
3. Save notes - they will be included in the packet

#### Publishing Workflow

1. Review all packet content
2. Make necessary edits
3. Click "Publish Packet" when ready
4. Packet becomes visible to the client
5. To make changes after publishing, click "Unpublish Packet" first

#### Version Management

1. Switch to "Version History" tab
2. View all previous versions with timestamps
3. Click "View" to see version details
4. Click "Compare" to compare two versions
5. Click "Restore" to roll back to a previous version

## Technical Details

### Data Flow

1. **Packet Creation**: Generated by auto-generation engine with DRAFT status
2. **Admin Review**: Admin accesses packet through review dashboard
3. **Editing**: Admin makes changes, each creating a new version
4. **Publishing**: Status changes to PUBLISHED, packet visible to client
5. **Revisions**: Can unpublish, edit, and republish as needed

### Version Control

- Every edit creates a `PacketVersion` record
- Versions store complete packet data snapshot
- Version numbers increment automatically
- Restore creates new version with old content

### Status Workflow

```
DRAFT → (admin edits) → UNPUBLISHED → (publish) → PUBLISHED
                            ↑              ↓
                            └──(unpublish)─┘
```

### Security

- All actions require ADMIN or SUPER_ADMIN role
- Authorization checked on every server action
- User ID tracked for all modifications
- Audit trail through version history

## Integration Points

### Exercise Library
- Swap functionality integrates with exercise library
- Filters exercises by population
- Maintains safety rules and contraindications

### Nutrition Library
- Future enhancement: swap nutrition items from library
- Currently supports manual editing

### PDF Generation
- After publishing, packet can be generated as PDF
- PDF generation uses published packet data

## Future Enhancements

### Phase Modification
- Add ability to modify training phases
- Adjust phase duration and frequency
- Reorder phases

### Alternative Templates
- Apply different packet templates
- Convert between packet types
- Template preview before applying

### Bulk Operations
- Edit multiple packets at once
- Bulk publish/unpublish
- Batch exercise swaps

### Advanced Comparison
- Visual diff highlighting
- Field-by-field comparison
- Change summary

### Collaboration
- Comments on packets
- Review assignments
- Approval workflows

## Testing Checklist

- [ ] Can view packet review dashboard
- [ ] Filters work correctly
- [ ] Can open packet editor
- [ ] Can edit exercise parameters
- [ ] Can swap exercises
- [ ] Can edit nutrition items
- [ ] Can add coach notes
- [ ] Can publish packet
- [ ] Can unpublish packet
- [ ] Version history displays correctly
- [ ] Can view version details
- [ ] Can compare versions
- [ ] Can restore previous version
- [ ] Authorization checks work
- [ ] Changes persist correctly

## Troubleshooting

### Packet Not Loading
- Check user has ADMIN or SUPER_ADMIN role
- Verify packet ID is correct
- Check database connection

### Exercise Swap Not Working
- Ensure exercise library has items for the population
- Check exercise library permissions
- Verify exercise ID is valid

### Version History Empty
- Versions are created on first edit
- New packets won't have history until edited

### Publishing Fails
- Check packet has required content
- Verify user has publish permissions
- Ensure packet is in DRAFT or UNPUBLISHED status

## API Reference

See `app/actions/packet-editing.ts` for complete server action signatures and documentation.

## Related Documentation

- [Packet Generation Guide](lib/pdf/PACKET_GENERATION_GUIDE.md)
- [Exercise Library Setup](lib/libraries/SETUP.md)
- [Assessment System](lib/assessments/README.md)
