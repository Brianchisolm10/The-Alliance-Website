# Packet Publishing Workflow - Testing Guide

## Prerequisites

1. **Environment Setup**
   ```env
   EMAIL_FROM="noreply@theafya.org"
   RESEND_API_KEY="re_your_api_key_here"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

2. **Database Setup**
   - Run migrations: `npx prisma migrate dev`
   - Ensure you have test users and packets

3. **Admin Access**
   - Log in as ADMIN or SUPER_ADMIN user

## Test Scenarios

### Test 1: Publish a Draft Packet

**Steps:**
1. Navigate to `/admin/packets`
2. Find a packet with status "DRAFT"
3. Click "Review & Edit"
4. Review the packet content
5. Click "📤 Publish & Notify Client"
6. Confirm the action in the dialog
7. Wait for success message

**Expected Results:**
- ✅ Status changes from DRAFT to PUBLISHED
- ✅ Green success alert appears
- ✅ `publishedAt` timestamp is set
- ✅ `publishedBy` is set to current admin
- ✅ Email is sent to client
- ✅ Packet appears in client's portal
- ✅ Success message mentions email notification

**Verification:**
```sql
SELECT id, status, publishedAt, publishedBy 
FROM "Packet" 
WHERE id = 'packet_id';
```

### Test 2: Unpublish a Published Packet

**Steps:**
1. Navigate to a PUBLISHED packet
2. Click "Unpublish for Revisions"
3. Confirm the action
4. Wait for success message

**Expected Results:**
- ✅ Status changes from PUBLISHED to UNPUBLISHED
- ✅ Orange alert appears showing unpublished status
- ✅ Packet is hidden from client portal
- ✅ No email is sent to client
- ✅ Admin can still see and edit packet

**Verification:**
```sql
SELECT id, status, publishedAt 
FROM "Packet" 
WHERE id = 'packet_id';
-- publishedAt should still be set (historical record)
```

### Test 3: Edit and Republish

**Steps:**
1. Unpublish a packet (see Test 2)
2. Make edits to exercises or nutrition
3. Click "Save Changes"
4. Click "📤 Publish & Notify Client"
5. Confirm the action

**Expected Results:**
- ✅ Version number increments
- ✅ Status changes to PUBLISHED
- ✅ New `publishedAt` timestamp
- ✅ Email sent to client again
- ✅ Client sees updated packet
- ✅ Version history shows all changes

**Verification:**
```sql
SELECT id, version, status, publishedAt 
FROM "Packet" 
WHERE id = 'packet_id';

SELECT version, createdAt, modifiedBy 
FROM "PacketVersion" 
WHERE packetId = 'packet_id' 
ORDER BY version DESC;
```

### Test 4: Email Notification Content

**Steps:**
1. Publish a packet
2. Check the client's email inbox
3. Open the email

**Expected Results:**
- ✅ Email received within 30 seconds
- ✅ Subject: "Your Personalized Wellness Packet is Ready!"
- ✅ Contains client name
- ✅ Contains packet type (formatted nicely)
- ✅ Contains "View Your Packet" button
- ✅ Button links to dashboard
- ✅ Professional AFYA branding
- ✅ Plain text version available

**Email Content Checklist:**
- [ ] Greeting with client name
- [ ] Packet type mentioned
- [ ] Clear next steps (numbered list)
- [ ] Call-to-action button
- [ ] AFYA branding
- [ ] Footer with contact info
- [ ] Mobile-responsive design

### Test 5: Version History Tracking

**Steps:**
1. Create a new packet (DRAFT)
2. Edit exercises → Save
3. Edit nutrition → Save
4. Publish packet
5. Unpublish packet
6. Edit again → Save
7. Republish
8. Navigate to "Version History" tab

**Expected Results:**
- ✅ All versions listed in descending order
- ✅ Each version shows timestamp
- ✅ Each version shows who modified it
- ✅ Can view version details
- ✅ Can restore previous version
- ✅ Version numbers increment correctly

**Verification:**
```sql
SELECT packetId, version, modifiedBy, createdAt 
FROM "PacketVersion" 
WHERE packetId = 'packet_id' 
ORDER BY version DESC;
```

### Test 6: Permission Checks

**Steps:**
1. Log out as admin
2. Log in as regular USER
3. Try to access `/admin/packets`

**Expected Results:**
- ✅ Access denied or redirect
- ✅ Cannot see admin routes
- ✅ Cannot publish/unpublish packets

### Test 7: Email Service Failure Handling

**Steps:**
1. Temporarily set invalid `RESEND_API_KEY`
2. Publish a packet
3. Check console logs

**Expected Results:**
- ✅ Packet still publishes successfully
- ✅ Status changes to PUBLISHED
- ✅ Error logged in console
- ✅ Admin sees success message (packet published)
- ✅ Note about email failure (optional)

### Test 8: Client Portal View

**Steps:**
1. Publish a packet for a client
2. Log in as that client
3. Navigate to dashboard/packets

**Expected Results:**
- ✅ Published packet is visible
- ✅ Can download PDF
- ✅ Unpublished packets are hidden
- ✅ Draft packets are hidden
- ✅ Only sees their own packets

### Test 9: Multiple Admins Workflow

**Steps:**
1. Admin A creates and edits packet
2. Admin B reviews and publishes packet
3. Check metadata

**Expected Results:**
- ✅ `lastModifiedBy` shows Admin A
- ✅ `publishedBy` shows Admin B
- ✅ Both admins tracked correctly
- ✅ Version history shows both admins

### Test 10: Status Alerts Display

**Steps:**
1. View DRAFT packet → Check for yellow alert
2. View UNPUBLISHED packet → Check for orange alert
3. View PUBLISHED packet → Check for green alert

**Expected Results:**
- ✅ DRAFT: Yellow alert with "Review and edit" message
- ✅ UNPUBLISHED: Orange alert with "Client cannot see" message
- ✅ PUBLISHED: Green alert with "Live and visible" message
- ✅ Alerts are visually distinct
- ✅ Messages are clear and actionable

## Performance Tests

### Test 11: Cache Revalidation

**Steps:**
1. Open client portal in one browser
2. Publish packet in admin panel (different browser)
3. Refresh client portal

**Expected Results:**
- ✅ Packet appears immediately after refresh
- ✅ No stale cache issues
- ✅ Status updates reflected

### Test 12: Concurrent Edits

**Steps:**
1. Two admins open same packet
2. Admin A makes edits and saves
3. Admin B makes different edits and saves

**Expected Results:**
- ✅ Both edits are saved
- ✅ Version numbers increment correctly
- ✅ No data loss
- ✅ Last save wins (expected behavior)

## Edge Cases

### Test 13: Invalid Packet ID

**Steps:**
1. Try to publish non-existent packet
2. Use API or direct URL manipulation

**Expected Results:**
- ✅ Error message: "Packet not found"
- ✅ No crash
- ✅ Graceful error handling

### Test 14: Missing Client Email

**Steps:**
1. Create user without email (if possible)
2. Try to publish packet

**Expected Results:**
- ✅ Packet publishes
- ✅ Email send fails gracefully
- ✅ Error logged
- ✅ Admin notified of email failure

### Test 15: Rapid Publish/Unpublish

**Steps:**
1. Publish packet
2. Immediately unpublish
3. Immediately publish again
4. Repeat 5 times

**Expected Results:**
- ✅ All actions complete successfully
- ✅ No race conditions
- ✅ Final state is correct
- ✅ Version history accurate

## Regression Tests

### Test 16: Existing Functionality

**Steps:**
1. Exercise swap still works
2. Nutrition editing still works
3. Coach notes still work
4. Version restore still works

**Expected Results:**
- ✅ All previous features work
- ✅ No breaking changes
- ✅ UI remains functional

## Automated Test Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build

# Start dev server
npm run dev
```

## Success Criteria

All tests must pass with:
- ✅ No TypeScript errors
- ✅ No console errors (except expected email failures)
- ✅ Proper status transitions
- ✅ Email notifications sent
- ✅ Version history tracked
- ✅ Client visibility correct
- ✅ Admin permissions enforced
- ✅ Graceful error handling

## Troubleshooting

### Email Not Sending
1. Check `RESEND_API_KEY` is set
2. Check `EMAIL_FROM` is configured
3. Check Resend dashboard for logs
4. Verify email address is valid

### Status Not Updating
1. Check database connection
2. Verify Prisma client is up to date
3. Check for TypeScript errors
4. Clear Next.js cache

### Client Can't See Published Packet
1. Verify status is PUBLISHED
2. Check user ID matches
3. Clear browser cache
4. Check route protection

### Version History Not Saving
1. Check PacketVersion model exists
2. Verify foreign key constraints
3. Check database migrations

## Reporting Issues

When reporting issues, include:
1. Test scenario number
2. Steps to reproduce
3. Expected vs actual results
4. Console logs
5. Database state (SQL queries)
6. Environment details

## Sign-Off

- [ ] All 16 tests passed
- [ ] No critical bugs found
- [ ] Email notifications working
- [ ] Version history accurate
- [ ] Client visibility correct
- [ ] Admin workflow smooth
- [ ] Documentation complete

**Tested By:** _________________
**Date:** _________________
**Environment:** _________________
**Notes:** _________________
