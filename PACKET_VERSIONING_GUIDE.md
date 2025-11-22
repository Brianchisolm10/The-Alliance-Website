# Packet Versioning System - Quick Reference Guide

## Overview

The packet versioning system automatically tracks all changes made to packets, allowing admins to view history, compare versions, and restore previous versions when needed.

## Key Features

✅ **Automatic Version Tracking** - Every edit creates a version snapshot  
✅ **Complete History** - View all versions with modification details  
✅ **Smart Diff Comparison** - See exactly what changed between versions  
✅ **Safe Restoration** - Restore any previous version without data loss  
✅ **User Tracking** - Know who made each change and when  

## How It Works

### Automatic Version Creation

Versions are automatically created when you:
- Swap an exercise
- Update exercise parameters (sets, reps, duration, intensity)
- Modify nutrition items
- Add or edit coach notes
- Make any content changes to a packet

**No manual action required!** The system handles versioning automatically.

### Accessing Version History

1. Navigate to any packet in the admin panel: `/admin/packets/[id]`
2. Click the **"Version History"** tab
3. View the complete list of all versions

## Using the Version History Interface

### Version List

Each version shows:
- **Version number** (e.g., Version 5)
- **Current badge** (for the active version)
- **Modification date and time**
- **Modified by** (admin name)
- **Content summary** (e.g., "8 exercises, 5 nutrition items")

**Actions:**
- **View** - See detailed version content
- **Compare** - Compare with another version
- **Restore** - Restore this version (if not current)

### Viewing a Single Version

Click **"View"** on any version to see:

#### Structured Content Display
- Content summary
- Introduction text
- Coach notes
- Exercise list with sets/reps
- Nutrition plan items

#### Raw Data
- Expandable JSON view for technical details

#### Actions
- **Restore This Version** - Restore the packet to this state
- **Compare with Another Version** - Start a comparison
- **Close** - Return to version list

### Comparing Two Versions

**Method 1: From Version List**
1. Click "View" on first version
2. Click "Compare with Another Version"
3. Select second version from list

**Method 2: Sequential Selection**
1. Click "View" on first version
2. Click "Compare" on second version

#### Comparison View Shows:

**Change Statistics**
- Number of additions (green)
- Number of modifications (blue)
- Number of removals (red)

**Detailed Diff**
- Field-by-field comparison
- Color-coded changes:
  - 🟢 Green = Added
  - 🔵 Blue = Modified
  - 🔴 Red = Removed
- Side-by-side old vs. new values

**Example Changes Detected:**
- `exercises[0].sets`: 3 → 4
- `exercises[2].name`: "Push-ups" → "Diamond Push-ups"
- `nutrition[1]`: Added new meal
- `coachNotes`: Modified text

### Restoring a Previous Version

**When to Restore:**
- Undo unwanted changes
- Revert to a known good state
- Recover from editing mistakes
- Return to client-approved version

**How to Restore:**

1. View the version you want to restore
2. Click **"Restore This Version"**
3. Confirm the restoration

**What Happens:**
- Current packet state is saved to version history (no data loss!)
- Selected version's content is restored
- Version number increments (e.g., v8 → v9)
- Packet status changes to **UNPUBLISHED**
- You can review and edit before republishing

**Safety Features:**
- Confirmation dialog prevents accidental restoration
- Current state always saved before restoration
- Packet marked UNPUBLISHED for review
- Can restore again if needed

## Common Workflows

### Workflow 1: Review Recent Changes

**Scenario:** You want to see what changed in the last edit.

1. Go to packet edit page
2. Click "Version History" tab
3. Click "View" on the most recent version
4. Click "Compare with Another Version"
5. Select the previous version
6. Review the diff

### Workflow 2: Undo Last Edit

**Scenario:** The last edit was incorrect and needs to be undone.

1. Go to packet edit page
2. Click "Version History" tab
3. Find the version before the incorrect edit
4. Click "Restore"
5. Confirm restoration
6. Review the restored content
7. Publish when ready

### Workflow 3: Compare Multiple Edits

**Scenario:** You want to see how the packet evolved over several edits.

1. Go to packet edit page
2. Click "Version History" tab
3. Compare v1 with v3 to see early changes
4. Compare v3 with v5 to see middle changes
5. Compare v5 with current to see recent changes

### Workflow 4: Find When a Change Was Made

**Scenario:** A client mentions an exercise that's no longer in their packet.

1. Go to packet edit page
2. Click "Version History" tab
3. View older versions one by one
4. Look for the exercise in each version
5. Identify when it was removed
6. Check who made the change and when
7. Restore if needed or explain to client

## Best Practices

### For Admins

✅ **Review Before Publishing**
- Check version history before publishing
- Ensure all changes are intentional
- Compare with previous published version

✅ **Use Descriptive Coach Notes**
- Add notes explaining significant changes
- Document why changes were made
- Help future reviewers understand decisions

✅ **Restore with Confidence**
- Don't fear restoration - current state is always saved
- Test changes after restoration
- Republish only after review

✅ **Track Client Feedback**
- Note version number when sharing with client
- Reference version in client communications
- Restore to client-approved version if needed

### For Developers

✅ **Automatic Versioning**
- Use provided server actions for all edits
- Don't bypass versioning system
- Ensure all edit paths create versions

✅ **Version Data Integrity**
- Store complete packet data in versions
- Include all necessary fields
- Preserve file URLs

✅ **Performance**
- Limit version list display when needed
- Use pagination for large histories
- Optimize diff calculations

## Technical Details

### Version Numbering
- Starts at 1 for new packets
- Increments by 1 for each change
- Never reused or skipped
- Restoration creates new version

### Data Storage
- Complete packet data snapshot (JSON)
- File URL preserved
- User ID tracked
- Timestamp recorded
- Cascade delete with packet

### Security
- Admin/Super Admin access only
- User tracking for audit trail
- No version deletion capability
- Restoration requires confirmation

## Troubleshooting

### "No version history available yet"
**Cause:** Packet hasn't been edited since versioning was implemented.  
**Solution:** Make any edit to create first version.

### "Version not found"
**Cause:** Version was deleted or doesn't exist.  
**Solution:** Check version number and try again.

### "Failed to restore version"
**Cause:** Database error or permission issue.  
**Solution:** Check logs, verify permissions, try again.

### Diff shows no changes
**Cause:** Comparing identical versions.  
**Solution:** Select different versions to compare.

### User shows as ID instead of name
**Cause:** User account deleted or name not set.  
**Solution:** Normal behavior - ID is fallback display.

## FAQ

**Q: How many versions are stored?**  
A: All versions are stored indefinitely. No automatic cleanup.

**Q: Can I delete old versions?**  
A: No, version history is permanent for audit purposes.

**Q: Does versioning affect performance?**  
A: Minimal impact. Versions are stored efficiently and queried with indexes.

**Q: What happens if I restore then restore again?**  
A: Each restoration creates a new version. You can restore multiple times.

**Q: Can clients see version history?**  
A: No, version history is admin-only. Clients only see published packets.

**Q: Are file URLs versioned?**  
A: Yes, each version stores the file URL at that time.

**Q: Can I compare non-sequential versions?**  
A: Yes, compare any two versions regardless of order.

**Q: What if two admins edit simultaneously?**  
A: Last edit wins. Both edits create versions, so no data is lost.

## Support

For issues or questions about the versioning system:
1. Check this guide first
2. Review the completion document: `.kiro/specs/afya-client-portal/TASK_14.11_COMPLETION.md`
3. Check application logs for errors
4. Contact the development team

## Summary

The packet versioning system provides:
- 🔒 **Safety** - Never lose data, always restorable
- 👁️ **Visibility** - See exactly what changed and when
- 🔄 **Flexibility** - Restore any version at any time
- 📊 **Accountability** - Track who made each change
- 🎯 **Confidence** - Edit without fear of mistakes

Use it to maintain quality, track changes, and provide the best possible service to clients!
