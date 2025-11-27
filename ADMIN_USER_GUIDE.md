# AFYA Wellness Platform - Admin User Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [User Management](#user-management)
4. [Client Management](#client-management)
5. [Packet Management](#packet-management)
6. [Content Management](#content-management)
7. [Product & Order Management](#product--order-management)
8. [Library Management](#library-management)
9. [Analytics & Reporting](#analytics--reporting)
10. [Activity Logs](#activity-logs)
11. [Best Practices](#best-practices)

## Getting Started

### Accessing the Admin Panel

1. Navigate to the AFYA website
2. Click "Login" in the top navigation
3. Enter your admin credentials
4. You'll be redirected to the admin dashboard

### Admin Roles

**ADMIN**
- Manage users and clients
- Edit content and products
- Process orders
- View analytics
- Cannot manage other admins

**SUPER_ADMIN**
- All ADMIN permissions
- Manage admin accounts
- Access system settings
- View activity logs

## Dashboard Overview

The admin dashboard provides a quick overview of platform activity and key metrics.

### Key Metrics

**Active Users**: Total number of active client accounts
**Pending Actions**: Items requiring your attention
**Recent Activity**: Latest user actions and system events
**System Health**: Platform performance indicators

### Quick Actions

- **Create User**: Add a new client or admin account
- **View Submissions**: Review discovery form submissions
- **Process Orders**: Manage pending orders
- **Manage Content**: Update programs and testimonials

### Notifications Center

The notifications panel shows:
- New discovery form submissions
- Pending orders requiring processing
- System alerts and updates
- Client messages requiring response

## User Management

### Viewing Users

1. Navigate to **Admin → Users**
2. View the user list with status indicators
3. Use search to find specific users
4. Apply filters:
   - Role (USER, ADMIN, SUPER_ADMIN)
   - Status (PENDING, ACTIVE, INACTIVE, SUSPENDED)
   - Population type

### Creating a New User

1. Click **"Create User"** button
2. Fill in the user details:
   - **Name**: Full name
   - **Email**: Valid email address
   - **Role**: Select appropriate role
   - **Population**: Assign population type (optional)
3. Click **"Create User"**
4. System automatically:
   - Generates a setup token
   - Sends setup email to the user
   - Creates the account in PENDING status

**Note**: The user will receive an email with a link to set their password and complete their profile.

### Editing User Information

1. Find the user in the user list
2. Click on the user's name or **"Edit"** button
3. Update the following:
   - Name
   - Email
   - Role
   - Status
   - Population assignment
4. Click **"Save Changes"**

### Managing User Status

**PENDING**: Account created, awaiting user setup
**ACTIVE**: Account fully set up and active
**INACTIVE**: Account temporarily disabled
**SUSPENDED**: Account suspended due to policy violation

To change status:
1. Open user details
2. Select new status from dropdown
3. Add a note explaining the change (optional)
4. Click **"Update Status"**

### Bulk Actions

Select multiple users to:
- Update status in bulk
- Assign population types
- Export user data

## Client Management

### Viewing Client Profiles

1. Navigate to **Admin → Clients**
2. View all clients with status indicators:
   - **New**: Recently signed up
   - **Active**: Engaged with platform
   - **Inactive**: No recent activity
   - **Needs Attention**: Requires follow-up

### Client Detail View

Click on a client to view:
- **Profile Information**: Name, email, population
- **Discovery Form**: Initial submission details
- **Assessments**: Completed and in-progress assessments
- **Packets**: Generated wellness packets
- **Orders**: Purchase history
- **Communications**: Email history and notes

### Adding Internal Notes

1. Open client profile
2. Scroll to **"Internal Notes"** section
3. Click **"Add Note"**
4. Enter your note (visible only to team members)
5. Click **"Save Note"**

**Use notes for**:
- Call summaries
- Client preferences
- Follow-up reminders
- Special considerations

### Sending Emails to Clients

1. Open client profile
2. Click **"Send Email"** button
3. Select email template or write custom message
4. Review and edit content
5. Click **"Send"**

**Available Templates**:
- Welcome message
- Assessment reminder
- Packet notification
- General follow-up

### Assigning Clients to Team Members

1. Open client profile
2. Find **"Assignment"** section
3. Select team member from dropdown
4. Click **"Assign"**

This helps distribute client management across your team.

### Discovery Call Management

Track discovery call status:
1. View **"Discovery Call"** section in client profile
2. Update call status:
   - **Scheduled**: Call booked
   - **Completed**: Call finished
   - **Rescheduled**: New time set
   - **Cancelled**: Call cancelled
3. Add call notes after completion
4. Update population assignment based on call

## Packet Management

### Viewing Packets

1. Navigate to **Admin → Packets**
2. View all packets with filters:
   - Status (DRAFT, UNPUBLISHED, PUBLISHED, ARCHIVED)
   - Type (General, Nutrition, Training, etc.)
   - Client name

### Packet Statuses

**DRAFT**: Auto-generated, needs review
**UNPUBLISHED**: Edited but not sent to client
**PUBLISHED**: Sent to client, visible in their portal
**ARCHIVED**: Old version, replaced by newer packet

### Reviewing and Editing Packets

1. Click on a packet to open the editor
2. Review auto-generated content
3. Make edits:
   - **Exercise Swaps**: Replace exercises with alternatives
   - **Sets/Reps**: Adjust workout parameters
   - **Phases**: Modify program phases
   - **Nutrition**: Edit meal plans and guidelines
   - **Notes**: Add coach notes and instructions

### Exercise Swap Feature

1. In packet editor, find exercise to replace
2. Click **"Swap Exercise"**
3. Search library for alternatives
4. Filter by:
   - Equipment available
   - Difficulty level
   - Movement pattern
   - Body part
5. Select replacement exercise
6. Click **"Apply Swap"**

### Publishing Packets

1. Complete all edits
2. Review packet content
3. Click **"Publish Packet"**
4. Confirm publication
5. System automatically:
   - Changes status to PUBLISHED
   - Generates PDF
   - Sends notification to client
   - Creates version history entry

**Important**: Once published, clients can view and download the packet.

### Unpublishing for Revisions

1. Open published packet
2. Click **"Unpublish"**
3. Make necessary edits
4. Republish when ready

### Version History

View packet history:
1. Open packet
2. Click **"View History"**
3. See all versions with:
   - Timestamp
   - Editor name
   - Changes made
4. Compare versions side-by-side
5. Restore previous version if needed

## Content Management

### Managing Programs

1. Navigate to **Admin → Content → Programs**
2. View all programs

**Create New Program**:
1. Click **"Create Program"**
2. Fill in details:
   - Name
   - Description
   - Type (Strength, Cardio, Flexibility, etc.)
   - Intensity (Beginner, Intermediate, Advanced)
   - Duration
   - Image
3. Click **"Create"**

**Edit Program**:
1. Click on program
2. Update information
3. Click **"Save Changes"**

**Publish/Unpublish**:
- Toggle publish status to show/hide on public website

### Managing Testimonials

1. Navigate to **Admin → Content → Testimonials**

**Approval Workflow**:
1. Review submitted testimonials
2. Check content appropriateness
3. Click **"Approve"** or **"Reject"**
4. Approved testimonials appear on website

**Create Testimonial**:
1. Click **"Add Testimonial"**
2. Enter:
   - Client name
   - Quote
   - Program/service
   - Image (optional)
3. Click **"Save"**

### Managing Impact Areas

1. Navigate to **Admin → Content → Impact Areas**
2. Edit descriptions and metrics for:
   - Foundations
   - Equipment
   - Gear Drive
   - Sponsorship
3. Update impact statistics
4. Click **"Save Changes"**

## Product & Order Management

### Managing Products

1. Navigate to **Admin → Products**

**Create Product**:
1. Click **"Create Product"**
2. Fill in details:
   - Name
   - Description
   - Price
   - Images
   - Inventory quantity
   - Category
3. Set up Stripe integration
4. Click **"Create"**

**Edit Product**:
1. Click on product
2. Update information
3. Adjust inventory
4. Click **"Save"**

**Manage Inventory**:
- Track stock levels
- Set low stock alerts
- Update quantities as needed

### Processing Orders

1. Navigate to **Admin → Orders**
2. View orders by status:
   - **Pending**: Awaiting processing
   - **Processing**: Being prepared
   - **Shipped**: Sent to customer
   - **Delivered**: Received by customer
   - **Cancelled**: Order cancelled

**Process an Order**:
1. Click on order
2. Review order details:
   - Customer information
   - Items ordered
   - Payment status
   - Shipping address
3. Update order status
4. Add tracking information (if applicable)
5. Click **"Update Order"**

**System automatically sends email to customer when status changes.**

### Handling Donations

View donation allocations in order details:
- Donation amount
- Impact area allocation
- Tax receipt sent status

## Library Management

### Exercise Library

1. Navigate to **Admin → Libraries → Exercises**

**Add Exercise**:
1. Click **"Add Exercise"**
2. Fill in details:
   - Name
   - Description
   - Equipment required
   - Difficulty level
   - Movement pattern
   - Body part targeted
   - Video URL (optional)
   - Cues and instructions
3. Add progressions and regressions
4. Set population-specific contraindications
5. Click **"Save"**

**Edit Exercise**:
1. Search for exercise
2. Click to edit
3. Update information
4. Click **"Save Changes"**

### Nutrition Library

1. Navigate to **Admin → Libraries → Nutrition**

**Add Nutrition Item**:
1. Click **"Add Item"**
2. Fill in details:
   - Name
   - Category (protein, carb, fat, vegetable, fruit)
   - Serving size
   - Macros (protein, carbs, fats)
   - Calories
   - Population-specific notes
3. Click **"Save"**

**Population Constraints**:
- Mark items safe/unsafe for specific populations
- Add preparation notes
- Include alternatives

## Analytics & Reporting

### Viewing Analytics

1. Navigate to **Admin → Analytics**

**Key Metrics**:
- User engagement (daily/weekly/monthly active users)
- Program enrollments
- Assessment completions
- Packet generations
- Revenue (shop + donations)
- Conversion rates

### Date Range Filters

1. Select date range:
   - Last 7 days
   - Last 30 days
   - Last 90 days
   - Custom range
2. Click **"Apply"**

### Charts and Visualizations

- User growth over time
- Revenue trends
- Popular programs
- Assessment completion rates
- Geographic distribution

### Exporting Data

1. Select data to export
2. Choose format (CSV, Excel)
3. Click **"Export"**
4. Download file

## Activity Logs

### Viewing Activity Logs

1. Navigate to **Admin → Activity Logs**
2. View all system activities:
   - User logins
   - Form submissions
   - Transactions
   - Admin actions
   - System events

### Filtering Logs

Filter by:
- **User**: Specific user actions
- **Action Type**: Login, submission, transaction, etc.
- **Date Range**: Specific time period
- **Resource**: Affected resource (user, packet, order, etc.)

### Audit Trail

Use activity logs for:
- Security auditing
- Troubleshooting issues
- Understanding user behavior
- Compliance reporting

## Best Practices

### User Management

✅ **Do**:
- Verify email addresses before creating accounts
- Use descriptive notes when changing user status
- Assign appropriate roles based on needs
- Regularly review inactive accounts

❌ **Don't**:
- Create duplicate accounts for the same person
- Share admin credentials
- Leave accounts in PENDING status indefinitely

### Client Communication

✅ **Do**:
- Respond to discovery forms within 24 hours
- Add notes after every client interaction
- Use email templates for consistency
- Follow up on inactive clients

❌ **Don't**:
- Send generic, impersonal emails
- Forget to update call status
- Leave client questions unanswered

### Packet Management

✅ **Do**:
- Review all auto-generated packets before publishing
- Add personalized coach notes
- Check exercise appropriateness for client
- Verify nutrition recommendations
- Keep version history for reference

❌ **Don't**:
- Publish packets without review
- Make major changes without client consultation
- Delete old versions (use archive instead)

### Content Management

✅ **Do**:
- Keep program descriptions clear and accurate
- Use high-quality images
- Update content regularly
- Review testimonials for appropriateness

❌ **Don't**:
- Publish incomplete program information
- Use copyrighted images without permission
- Leave outdated content published

### Order Processing

✅ **Do**:
- Process orders promptly
- Update tracking information
- Communicate delays to customers
- Verify shipping addresses

❌ **Don't**:
- Leave orders in pending status
- Forget to update order status
- Ship without confirmation

### Security

✅ **Do**:
- Log out when finished
- Use strong passwords
- Report suspicious activity
- Keep client information confidential

❌ **Don't**:
- Share login credentials
- Access admin panel on public computers
- Discuss client information publicly

## Troubleshooting

### Common Issues

**Can't create user**
- Check email is not already in use
- Verify email format is correct
- Ensure all required fields are filled

**Packet won't publish**
- Verify all required sections are complete
- Check for validation errors
- Ensure PDF generation is successful

**Order status not updating**
- Refresh the page
- Check internet connection
- Verify you have permission to update orders

**Email not sending**
- Verify email address is correct
- Check spam folder
- Contact technical support if persistent

### Getting Help

- Check this guide first
- Contact technical support: support@theafya.org
- Report bugs through the admin panel
- Request new features through feedback form

## Keyboard Shortcuts

- `Ctrl/Cmd + K`: Quick search
- `Ctrl/Cmd + S`: Save changes
- `Esc`: Close modal/dialog
- `Tab`: Navigate form fields

## Tips for Efficiency

1. **Use Search**: Quickly find users, clients, or content
2. **Bulk Actions**: Process multiple items at once
3. **Email Templates**: Save time with pre-written messages
4. **Filters**: Narrow down lists to find what you need
5. **Notes**: Document everything for team collaboration
6. **Keyboard Shortcuts**: Navigate faster

---

**Need Help?**
Contact: support@theafya.org
Website: theafya.org

**Last Updated**: November 2025
