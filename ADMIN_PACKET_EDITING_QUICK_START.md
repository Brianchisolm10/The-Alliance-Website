# Admin Packet Editing - Quick Start Guide

## Accessing the Packet Review Dashboard

1. Log in to the admin panel
2. Click "Packets" in the left sidebar
3. You'll see all packets that need review (Draft and Unpublished status)

## Reviewing a Packet

### Dashboard View
- **Status Badge**: Shows if packet is Draft, Unpublished, Published, or Archived
- **Version Number**: Current version of the packet
- **Client Info**: Client name, email, and population
- **Dates**: When created and last updated
- **Last Modified By**: Who made the last changes

### Filtering Packets
- **Search**: Type client name or email
- **Type Filter**: Select specific packet type (General, Nutrition, Training, etc.)
- **Status Filter**: Choose which statuses to display
- **Clear Filters**: Reset all filters

## Editing a Packet

### Opening the Editor
1. Click "Review & Edit" on any packet card
2. You'll see the full packet editor with two tabs:
   - **Edit Content**: Make changes to the packet
   - **Version History**: View and restore previous versions

### Editing Exercises

#### Modify Exercise Parameters
1. Find the exercise in the Exercise section
2. Click "Edit" button
3. Change any of:
   - Sets (number)
   - Reps (e.g., "10-12")
   - Duration (e.g., "30 seconds")
   - Intensity (e.g., "Moderate")
   - Notes (additional instructions)
4. Click "Save Changes"

#### Swap an Exercise
1. Find the exercise to replace
2. Click "Swap" button
3. Search for a replacement exercise
4. Click on the exercise you want
5. Click "Swap Exercise"
6. The new exercise keeps the same sets/reps

### Editing Nutrition

1. Find the nutrition item in the Nutrition section
2. Click "Edit" button
3. Modify:
   - Meal type (Breakfast, Lunch, Dinner, Snack)
   - Foods (comma-separated list)
   - Portions (e.g., "1 cup, 4 oz")
   - Calories
   - Macros (Protein, Carbs, Fats in grams)
   - Notes
   - Alternatives
4. Click "Save Changes"

### Editing General Content

#### Introduction
- Click in the Introduction text area
- Edit the text
- Changes save automatically

#### Goals
- Edit any goal in the list
- Changes save automatically

### Adding Coach Notes

1. Click "Add Coach Notes" button
2. Type your notes (visible to client or internal team)
3. Click "Save Notes"
4. Notes appear in the packet

## Publishing Workflow

### Publishing a Packet

1. Review all content thoroughly
2. Make any necessary edits
3. Click "Publish Packet" button
4. Confirm the action
5. Packet status changes to PUBLISHED
6. Client can now see and download the packet

### Unpublishing a Packet

If you need to make changes after publishing:

1. Click "Unpublish Packet" button
2. Confirm the action
3. Status changes to UNPUBLISHED
4. Make your edits
5. Publish again when ready

## Version History

### Viewing History

1. Click "Version History" tab
2. See all previous versions with:
   - Version number
   - Modification date and time
   - Who modified it
   - Content summary

### Viewing a Version

1. Click "View" on any version
2. See the complete packet data from that version
3. Click "Close" to return

### Comparing Versions

1. Click "View" on first version
2. Click "Compare" on second version
3. See both versions side-by-side
4. Click "Close" when done

### Restoring a Version

1. Find the version you want to restore
2. Click "Restore" button
3. Confirm the action
4. A new version is created with the old content
5. Status changes to UNPUBLISHED
6. Review and publish when ready

## Tips and Best Practices

### Before Publishing
- ✅ Review all exercises for appropriate difficulty
- ✅ Check sets/reps are suitable for client
- ✅ Verify nutrition aligns with dietary restrictions
- ✅ Read through all content for accuracy
- ✅ Add coach notes if needed

### When Editing
- 💡 Each edit creates a new version automatically
- 💡 You can always restore previous versions
- 💡 Unpublish before making changes to published packets
- 💡 Use coach notes to communicate with clients

### Exercise Swapping
- 🎯 Search by exercise name or muscle group
- 🎯 Check difficulty level matches client
- 🎯 Review contraindications for client's population
- 🎯 Sets/reps carry over automatically

### Nutrition Editing
- 🥗 Verify allergens are avoided
- 🥗 Check macros align with goals
- 🥗 Provide alternatives when possible
- 🥗 Include portion sizes

## Common Workflows

### New Packet Review
1. Open packet from dashboard
2. Review auto-generated content
3. Swap any inappropriate exercises
4. Adjust sets/reps as needed
5. Edit nutrition for preferences
6. Add coach notes
7. Publish

### Updating Published Packet
1. Unpublish the packet
2. Make necessary changes
3. Review all content
4. Publish again

### Fixing a Mistake
1. Go to Version History
2. Find the correct version
3. Restore that version
4. Review and publish

## Keyboard Shortcuts

- **Tab**: Navigate between fields
- **Enter**: Submit forms
- **Esc**: Close dialogs

## Troubleshooting

### Can't Find a Packet
- Check your filters
- Try searching by email instead of name
- Verify the packet exists in the database

### Exercise Swap Not Working
- Ensure exercise library has items for the client's population
- Try a different search term
- Check if you have the right permissions

### Changes Not Saving
- Check your internet connection
- Verify you're still logged in
- Try refreshing the page

### Version History Empty
- New packets won't have history until first edit
- History is created automatically on edits

## Need Help?

- Check the full documentation: `PACKET_EDITING_GUIDE.md`
- Contact the development team
- Review the requirements document

## Quick Reference

| Action | Location | Button |
|--------|----------|--------|
| View packets | Sidebar | Packets |
| Edit packet | Dashboard | Review & Edit |
| Edit exercise | Exercise card | Edit |
| Swap exercise | Exercise card | Swap |
| Edit nutrition | Nutrition card | Edit |
| Add notes | Top of editor | Add Coach Notes |
| Publish | Top of editor | Publish Packet |
| Unpublish | Top of editor | Unpublish Packet |
| View history | Editor tabs | Version History |
| Restore version | Version card | Restore |

---

**Remember**: Every edit is tracked and can be undone. Don't be afraid to make changes!
