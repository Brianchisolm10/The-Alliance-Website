# Admin Quick Start: Packet Publishing

## Overview
This guide shows you how to review, edit, and publish personalized wellness packets to clients.

## Quick Steps

### 1. Access Packet Dashboard
```
Navigate to: Admin Panel → Packets
URL: /admin/packets
```

### 2. Review Packets
- **Yellow Badge (DRAFT)**: New packets ready for review
- **Orange Badge (UNPUBLISHED)**: Edited packets not yet published
- **Green Badge (PUBLISHED)**: Live packets visible to clients

### 3. Edit a Packet
1. Click "Review & Edit" on any packet
2. Review the content:
   - General information
   - Exercise program
   - Nutrition plan
   - Coach notes
3. Make edits as needed:
   - Click "Edit" on exercises to adjust sets/reps
   - Click "Swap" to replace exercises
   - Edit nutrition items
   - Add coach notes

### 4. Publish the Packet
1. Click "📤 Publish & Notify Client" button
2. Confirm the action
3. Wait for success message
4. Client receives email notification automatically

### 5. Unpublish for Revisions
1. Open a published packet
2. Click "Unpublish for Revisions"
3. Make your edits
4. Republish when ready

## Status Meanings

| Status | Color | Meaning | Client Can See? |
|--------|-------|---------|-----------------|
| DRAFT | Yellow | New packet, needs review | ❌ No |
| UNPUBLISHED | Orange | Has edits, not published | ❌ No |
| PUBLISHED | Green | Live and available | ✅ Yes |
| ARCHIVED | Gray | Old version, archived | ❌ No |

## What Happens When You Publish?

1. ✅ Status changes to PUBLISHED
2. ✅ Timestamp recorded
3. ✅ Your name recorded as publisher
4. ✅ Email sent to client
5. ✅ Packet appears in client portal
6. ✅ Client can download PDF

## Email Notification

When you publish, the client receives:
- Subject: "Your Personalized Wellness Packet is Ready!"
- Professional AFYA-branded email
- Link to their portal
- Instructions on next steps

## Tips

### Before Publishing
- ✅ Review all exercises for safety
- ✅ Check nutrition plan is appropriate
- ✅ Verify client information is correct
- ✅ Add coach notes if needed
- ✅ Check for any errors or typos

### After Publishing
- Client receives email within 30 seconds
- Packet is immediately visible in their portal
- You can still unpublish if needed
- Version history is preserved

### Making Revisions
1. Unpublish the packet
2. Make your changes
3. Republish
4. Client gets new notification

## Common Tasks

### Swap an Exercise
1. Open packet editor
2. Find the exercise
3. Click "Swap"
4. Search for replacement
5. Select new exercise
6. Save changes

### Adjust Sets/Reps
1. Open packet editor
2. Find the exercise
3. Click "Edit"
4. Change sets, reps, duration, or intensity
5. Save changes

### Edit Nutrition
1. Open packet editor
2. Find nutrition section
3. Click "Edit" on meal
4. Modify foods or macros
5. Save changes

### Add Coach Notes
1. Open packet editor
2. Click "Add Coach Notes"
3. Type your notes
4. Save
5. Notes appear in packet

### View Version History
1. Open packet editor
2. Click "Version History" tab
3. See all previous versions
4. Can restore if needed

## Keyboard Shortcuts

- `Ctrl/Cmd + S` - Save changes (in editors)
- `Esc` - Close dialogs
- `Tab` - Navigate between fields

## Troubleshooting

### Email Not Sent?
- Check your internet connection
- Verify client email is correct
- Check Resend API key is configured
- Email failure doesn't block publishing

### Can't Publish?
- Ensure you're logged in as admin
- Check packet isn't already published
- Verify you have ADMIN or SUPER_ADMIN role

### Client Can't See Packet?
- Verify status is PUBLISHED (green)
- Check client is logged in
- Ask client to refresh their browser
- Verify packet belongs to that client

### Changes Not Saving?
- Check your internet connection
- Ensure you clicked "Save"
- Look for error messages
- Try refreshing the page

## Best Practices

1. **Review Before Publishing**
   - Always review the entire packet
   - Check for errors or inconsistencies
   - Verify exercises are appropriate

2. **Use Coach Notes**
   - Add context for the client
   - Explain any special considerations
   - Provide encouragement

3. **Version Control**
   - Don't worry about making mistakes
   - All versions are saved
   - You can always restore previous versions

4. **Communication**
   - Publishing sends automatic email
   - Follow up with clients if needed
   - Track if they've viewed the packet

5. **Quality Over Speed**
   - Take time to review thoroughly
   - Better to delay than publish errors
   - Client safety is priority #1

## Support

Need help?
- Check the full documentation
- Contact technical support
- Review the test guide for examples

## Quick Reference

| Action | Button | Result |
|--------|--------|--------|
| Publish | 📤 Publish & Notify Client | Status → PUBLISHED, Email sent |
| Unpublish | Unpublish for Revisions | Status → UNPUBLISHED |
| Edit Exercise | Edit button | Modify sets/reps/notes |
| Swap Exercise | Swap button | Replace with different exercise |
| Add Notes | Add Coach Notes | Include personal message |
| View History | Version History tab | See all changes |

## Remember

- ✅ Publishing is reversible (can unpublish)
- ✅ All changes are tracked
- ✅ Email failures don't block publishing
- ✅ Clients only see PUBLISHED packets
- ✅ You can edit and republish anytime

---

**Questions?** Check the full documentation or contact support.
