# Requirements Document

## Introduction

AFYA is a wellness-tech platform on a mission to make elite-level fitness, nutrition, and health education universally accessible. Built with the ethos of community, discipline, and joy, AFYA delivers automated, science-backed programs to youth, adults, and educators—rooted in equity, powered by automation, and guided by empathy.

The AFYA platform operates as a unified wellness system with three core layers:

1. **Public Website** - Simplified one-word navigation serving three purposes: high-level program explanations, merchandise sales with donation allocation, and initiation of the discovery process
2. **Discovery Pipeline** - A streamlined entry point with minimal data collection (name, email, primary goal, optional notes) leading to discovery call scheduling
3. **AFYA Portal** - Authenticated client portal centralizing all assessment workflows, packet outputs, health tools, and long-term resources

As global health inequities rise and misinformation dominates online spaces, AFYA bridges the gap by offering structured, evidence-based fitness and wellness resources for free, with scalable monetization pathways. All complex assessments have been removed from public pages in favor of a discovery-call-first approach that ensures proper client onboarding and program fit.

The platform supports role-based access for users, administrators, and super administrators, with seamless account management and personalized experiences. AFYA operates across 5+ U.S. states, serving 24 clients with a goal of 100 by Q3 2025, utilizing fully automated onboarding and program delivery systems. The platform aligns with UN Sustainable Development Goals 3 (Good Health and Well-Being), 4 (Quality Education), and 10 (Reduced Inequalities).

## Development Philosophy

**Build Like Lego: Simple Foundation, Then Complexity**

The platform prioritizes stability and simplicity over feature completeness. Each component should be built as a solid, independent block that can be tested and validated before adding complexity. Start with the essentials, ensure they work flawlessly, then layer on advanced features. This approach minimizes bugs, reduces technical debt, and creates a reliable foundation for growth.

Key principles:
- Simple implementations first, complex features later
- Each feature must be stable before moving to the next
- Modular architecture that allows independent development and testing
- Think smarter, not harder - validate core functionality before expanding

## Glossary

- **System**: The Afya Wellness Website platform
- **Client**: A community member using the platform to access wellness resources
- **User Account**: An authenticated account with role-based permissions (USER, ADMIN, SUPER_ADMIN)
- **Health Packet**: A personalized PDF document generated from intake assessment responses
- **Discovery Form**: A minimal entry form capturing name, email, primary goal, and optional notes that leads to discovery call scheduling
- **Discovery Call**: An operational decision step for assigning programs, determining sponsorship eligibility, and selecting assessment pathways
- **Assessment Module**: Modular assessment flows within the AFYA Portal for nutrition, training, performance, youth, recovery, and lifestyle profiling
- **Packet**: A personalized document generated from assessment data (General, Nutrition, Training, Athlete Performance, Youth, Recovery)
- **AFYA Portal**: The authenticated client portal containing assessments, packets, tools, and resources
- **AFYA Studio**: Admin interface for AI-assisted content generation using AFYA system prompts
- **AI Wrapper**: Backend service with predefined AFYA prompts for generating packet text, exercise cues, and guidance
- **Impact Area**: One of four donation categories (Foundations, Equipment, Gear Drive, Sponsorship)
- **Admin**: Staff member with elevated permissions for content and user management
- **Session**: An authenticated user session managed by NextAuth
- **Community Stats**: Real-time metrics showing members served and programs offered
- **Health Tool**: An interactive calculator requiring no authentication (BMR/TDEE, Plate Builder, etc.)

## Requirements

### Requirement 1: Public Website Navigation and Structure

**User Story:** As a visitor, I want simplified one-word navigation and clear purpose-driven sections, so that I can quickly understand AFYA and take action.

#### Acceptance Criteria

1. THE System SHALL display simplified one-word navigation menu items
2. THE System SHALL display a hero section containing the mission statement "A Happier, Healthier You. Your Way" and "Start Your Journey" call-to-action button
3. THE System SHALL display community statistics showing the count of members served and programs offered with real-time updates
4. THE System SHALL provide high-level program explanations without complex assessment forms
5. THE System SHALL display impact statistics in a showcase format with numerical metrics
6. THE System SHALL display a testimonials carousel with client feedback that rotates automatically
7. THE System SHALL limit public website purposes to: program explanations, merchandise sales, and discovery process initiation

### Requirement 2: About Afya Section

**User Story:** As a visitor, I want to learn about Afya's identity, mission, and impact, so that I understand the organization's purpose and commitment to health equity.

#### Acceptance Criteria

1. THE System SHALL display an "About AFYA" section containing the mission statements: "A Happier, Healthier You. Your Way" and "to make elite-level fitness, nutrition, and health education universally accessible"
2. THE System SHALL display the organization's core values: community, discipline, and joy
3. THE System SHALL display information about AFYA's service areas across 5+ U.S. states
4. THE System SHALL display traction metrics including clients served (24+) and growth goals (100 by Q3 2025)
5. THE System SHALL display AFYA's approach: science-backed programs rooted in equity, powered by automation, and guided by empathy
6. THE System SHALL display information about founder Brian L Chisolm II and his credentials (Master's in Exercise Science)
7. THE System SHALL display AFYA's alignment with UN Sustainable Development Goals (SDGs 3, 4, and 10)
8. THE System SHALL display the problem AFYA addresses: health inequities, misinformation, and lack of accessible quality fitness education
9. THE System SHALL provide navigation to a dedicated about page with comprehensive organizational information including team, partnerships, and ESG commitments

### Requirement 3: Competitive Advantages and Value Proposition

**User Story:** As a visitor comparing wellness platforms, I want to understand AFYA's unique advantages, so that I can see why AFYA is the best choice for my wellness journey.

#### Acceptance Criteria

1. THE System SHALL display AFYA's key differentiators: high personalization, free tier access, strong community focus, education-first approach, and high automation
2. THE System SHALL display information about AFYA's integrated and mission-led approach compared to competitors
3. THE System SHALL display the platform's commitment to science-backed, evidence-based programming
4. THE System SHALL display information about AFYA's fully automated onboarding and program delivery system
5. THE System SHALL display testimonials and success stories demonstrating AFYA's effectiveness

### Requirement 4: Discovery Form and Call Scheduling

**User Story:** As a new client, I want to complete a simple discovery form and schedule a call, so that I can start my wellness journey with personalized guidance.

#### Acceptance Criteria

1. WHEN a client clicks "Start Your Journey", THE System SHALL navigate to "/start" with a discovery form
2. THE System SHALL display a discovery form capturing name, email, primary goal, and optional notes
3. WHEN a client submits the discovery form, THE System SHALL redirect to a scheduling interface for booking a discovery call
4. THE System SHALL allow clients to complete the discovery form without creating an account
5. THE System SHALL send a confirmation email with discovery call details after scheduling

### Requirement 5: Portal Assessment Modules

**User Story:** As an authenticated client, I want to complete modular assessments within the portal, so that I receive personalized wellness packets.

#### Acceptance Criteria

1. WHEN an authenticated client accesses the portal, THE System SHALL display available assessment modules: Nutrition, Training, Performance, Youth, Recovery, and Lifestyle
2. WHEN a client selects an assessment module, THE System SHALL display relevant questions for that specific area
3. WHEN a client completes an assessment module, THE System SHALL generate a corresponding packet (General, Nutrition, Training, Athlete Performance, Youth, or Recovery)
4. THE System SHALL store completed assessments and generated packets in the client's portal
5. THE System SHALL allow clients to download packets in PDF format

### Requirement 6: Programs Exploration

**User Story:** As a client exploring wellness options, I want to browse all available programs with filtering capabilities, so that I can find programs matching my needs and preferences.

#### Acceptance Criteria

1. WHEN a client navigates to "/programs", THE System SHALL display all wellness programs in a card-based layout
2. THE System SHALL provide filter controls for program type, intensity level, and duration
3. WHEN a client applies filters, THE System SHALL update the displayed programs to match the selected criteria within 500 milliseconds
4. THE System SHALL display detailed program cards containing descriptions, intensity indicators, and duration information
5. THE System SHALL display "Learn More" and "Get Started" call-to-action buttons on each program card

### Requirement 7: Health Tools Access

**User Story:** As any visitor, I want to access interactive health calculators without logging in, so that I can quickly use wellness tools without barriers.

#### Acceptance Criteria

1. WHEN a visitor navigates to "/tools", THE System SHALL display a suite of interactive calculators including BMR/TDEE Energy Calculator, Plate Builder, Heart Rate Zones Calculator, Hydration & Sleep Snapshot, Youth Corner, and Recovery Check-in
2. THE System SHALL allow visitors to use all health tools without authentication
3. WHEN a visitor interacts with a health tool, THE System SHALL provide real-time calculations and visual feedback within 200 milliseconds
4. THE System SHALL render all health tools with mobile-optimized layouts and touch-friendly controls
5. WHERE a user has an authenticated account, THE System SHALL offer to save tool results to their dashboard

### Requirement 9: E-Commerce Shop

**User Story:** As a client, I want to browse and purchase health products with secure payment processing, so that I can obtain wellness items and optionally support the organization.

#### Acceptance Criteria

1. WHEN a client navigates to "/shop", THE System SHALL display browsable health products, supplements, and gear with images and descriptions
2. WHEN a client selects a product, THE System SHALL add the item to a shopping cart with quantity controls
3. WHEN a client proceeds to checkout, THE System SHALL integrate with Stripe for secure payment processing
4. WHEN a client completes checkout, THE System SHALL display an optional donation allocation interface
5. WHEN a client completes a purchase, THE System SHALL display an order confirmation page and send a confirmation email with tracking information

### Requirement 10: Impact Hub and Donation Areas

**User Story:** As a supporter, I want to view impact areas and make targeted donations, so that I can contribute to specific organizational needs and understand AFYA's social commitment.

#### Acceptance Criteria

1. WHEN a visitor navigates to "/impact", THE System SHALL display four impact areas: Foundations, Equipment, Gear Drive, and Sponsorship with descriptions
2. THE System SHALL provide navigation to the donation flow for each impact area
3. THE System SHALL display impact metrics showing how donations are utilized
4. THE System SHALL display AFYA's social commitment including free access to underserved communities, transparent operations, inclusive design, and multilingual adaptability
5. THE System SHALL display alignment with ESG (Environmental, Social, and Governance) principles
6. WHEN a visitor selects an impact area, THE System SHALL provide detailed information about that area's needs and outcomes

### Requirement 11: Monetary Donation Processing

**User Story:** As a donor, I want to make financial contributions with flexible allocation options, so that I can support the organization according to my preferences.

#### Acceptance Criteria

1. WHEN a donor navigates to "/impact/donate", THE System SHALL display a multi-tier donation form with preset amounts ($25, $50, $100) and a custom amount option
2. THE System SHALL allow donors to allocate their donation across multiple impact areas
3. WHEN a donor submits a donation, THE System SHALL process payment through Stripe integration
4. WHEN a donation is completed, THE System SHALL display a confirmation page with receipt information
5. WHEN a donation is completed, THE System SHALL send a confirmation email with tax receipt to the donor

### Requirement 12: Gear Drive Physical Donations

**User Story:** As a donor, I want to donate physical athletic gear, so that I can support the community with equipment contributions.

#### Acceptance Criteria

1. WHEN a donor navigates to "/impact/gear-drive", THE System SHALL display a physical donation form capturing item details, condition assessment, and pickup or dropoff preferences
2. WHEN a donor submits the gear drive form, THE System SHALL display a confirmation message with coordination instructions
3. WHEN a gear drive donation is submitted, THE System SHALL send a confirmation email to the donor with next steps
4. THE System SHALL store gear drive submissions for admin review and coordination

### Requirement 13: Account Creation by Admin

**User Story:** As an admin, I want to create user accounts for clients, so that they can access personalized features and health packets.

#### Acceptance Criteria

1. WHEN an admin creates a user account, THE System SHALL generate a unique setup token and send a setup email to the user's email address
2. WHEN a user receives the setup email, THE System SHALL include a link to "/setup/[token]" for account activation
3. THE System SHALL assign a role (USER, ADMIN, SUPER_ADMIN) to each created account based on admin selection
4. THE System SHALL set the account status to pending until the user completes setup

### Requirement 14: User Account Setup

**User Story:** As a new user who received a setup email, I want to set my password and complete my profile, so that I can access my personalized dashboard.

#### Acceptance Criteria

1. WHEN a user navigates to "/setup/[token]", THE System SHALL validate the token and display the account setup form if valid
2. WHEN a user submits the setup form with password and profile information, THE System SHALL create the user credentials and activate the account
3. IF the setup token is invalid or expired, THEN THE System SHALL display an error message and provide contact information
4. WHEN account setup is complete, THE System SHALL redirect the user to the login page with a success message

### Requirement 15: User Authentication

**User Story:** As an existing user, I want to log in with my email and password, so that I can access my personalized dashboard and saved content.

#### Acceptance Criteria

1. WHEN a user navigates to "/login", THE System SHALL display an email and password login form
2. WHEN a user submits valid credentials, THE System SHALL create an authenticated session using NextAuth and redirect to the dashboard
3. IF a user submits invalid credentials, THEN THE System SHALL display an error message without revealing which field is incorrect
4. THE System SHALL provide a password reset link on the login page
5. WHEN a user requests password reset, THE System SHALL send a reset email with a time-limited token

### Requirement 16: User Dashboard

**User Story:** As an authenticated user, I want to access my personalized dashboard, so that I can view my health packets, download PDFs, track progress, and access saved tools.

#### Acceptance Criteria

1. WHEN an authenticated user navigates to "/dashboard", THE System SHALL display personalized health packets associated with their account
2. THE System SHALL provide download buttons for each health packet in PDF format
3. THE System SHALL display progress tracking metrics based on user activity
4. THE System SHALL display saved tool calculations and results from previous health tool usage
5. THE System SHALL display a notification center with system messages and updates

### Requirement 17: Admin Dashboard and Overview

**User Story:** As an admin, I want a centralized dashboard with key metrics and quick actions, so that I can efficiently manage the platform and understand its performance at a glance.

#### Acceptance Criteria

1. WHEN an admin logs in, THE System SHALL display a comprehensive dashboard with key performance indicators
2. THE System SHALL display real-time metrics including active users, pending actions, recent activity, and system health
3. THE System SHALL provide quick action buttons for common tasks: create user, view submissions, process orders, manage content
4. THE System SHALL display notifications for items requiring attention: new discovery forms, pending orders, system alerts
5. THE System SHALL provide navigation to all admin sections with clear labeling and organization

### Requirement 18: Admin User Management

**User Story:** As an admin, I want to manage user accounts seamlessly, so that I can create, edit, and control access for community members and staff.

#### Acceptance Criteria

1. WHEN an admin accesses user management, THE System SHALL display a searchable and filterable user list with status indicators
2. THE System SHALL allow admins to create new user accounts with role assignment and automated setup email delivery
3. THE System SHALL allow admins to edit user roles (USER, ADMIN, SUPER_ADMIN) and account status (active, inactive, suspended)
4. THE System SHALL allow admins to view detailed user profiles including activity logs, completed assessments, and engagement metrics
5. THE System SHALL provide bulk actions for managing multiple users simultaneously
6. THE System SHALL restrict user management functions based on admin role permissions

### Requirement 19: Admin Content Management

**User Story:** As an admin, I want to manage website content including programs and impact sections, so that I can keep information current and relevant.

#### Acceptance Criteria

1. WHEN an admin accesses content management, THE System SHALL display interfaces for editing programs, impact areas, and testimonials
2. THE System SHALL allow admins to create, edit, and delete program entries with rich text descriptions
3. THE System SHALL allow admins to update impact area descriptions and metrics
4. THE System SHALL allow admins to manage testimonials including approval workflow
5. WHEN an admin publishes content changes, THE System SHALL update the live website within 5 seconds

### Requirement 20: Admin Product and Order Management

**User Story:** As an admin, I want to manage shop inventory and process orders, so that I can maintain accurate product information and fulfill customer purchases.

#### Acceptance Criteria

1. WHEN an admin accesses product management, THE System SHALL display all shop products with inventory levels
2. THE System SHALL allow admins to create, edit, and delete product listings with images, descriptions, and pricing
3. THE System SHALL allow admins to view and process customer orders with status tracking
4. THE System SHALL display order details including customer information, items, payment status, and shipping information
5. WHEN an admin updates order status, THE System SHALL send notification emails to customers

### Requirement 21: Admin Communication and Client Management

**User Story:** As an admin, I want to communicate with clients and manage their journey, so that I can provide personalized support and track their progress.

#### Acceptance Criteria

1. WHEN an admin views a client profile, THE System SHALL display all client interactions: discovery forms, assessments, packets, purchases, and communications
2. THE System SHALL allow admins to add internal notes to client profiles visible only to team members
3. THE System SHALL provide a messaging interface for communicating with clients via email
4. THE System SHALL display client status indicators: new, active, inactive, needs attention
5. THE System SHALL allow admins to assign clients to specific team members for personalized support
6. THE System SHALL track and display discovery call scheduling and completion status

### Requirement 22: Admin Analytics Dashboard

**User Story:** As an admin, I want to view analytics and performance metrics, so that I can monitor platform usage and make data-driven decisions.

#### Acceptance Criteria

1. WHEN an admin accesses the analytics dashboard, THE System SHALL display key performance indicators including user engagement, program enrollments, and donation metrics
2. THE System SHALL display performance monitoring data including page load times and error rates
3. THE System SHALL provide date range filters for all analytics data
4. THE System SHALL display visual charts and graphs for trend analysis
5. THE System SHALL allow admins to export analytics data in CSV format

### Requirement 23: Mobile Responsiveness

**User Story:** As a mobile user, I want the entire website to function seamlessly on my device, so that I can access all features regardless of screen size.

#### Acceptance Criteria

1. THE System SHALL render all pages with responsive layouts that adapt to screen widths from 320 pixels to 2560 pixels
2. THE System SHALL provide touch-friendly controls with minimum tap target sizes of 44 pixels by 44 pixels
3. THE System SHALL optimize images and assets for mobile bandwidth constraints
4. THE System SHALL achieve a mobile Lighthouse performance score of 90 or higher
5. THE System SHALL maintain functionality across iOS Safari, Android Chrome, and mobile Firefox browsers

### Requirement 24: Performance Optimization

**User Story:** As any user, I want the website to load quickly and respond instantly, so that I have a smooth and efficient experience.

#### Acceptance Criteria

1. THE System SHALL achieve a Lighthouse performance score of 90 or higher on desktop and mobile
2. THE System SHALL render the largest contentful paint within 2.5 seconds on 3G connections
3. THE System SHALL achieve a first input delay of less than 100 milliseconds
4. THE System SHALL achieve a cumulative layout shift score of less than 0.1
5. THE System SHALL implement code splitting and lazy loading for non-critical resources

### Requirement 25: Accessibility Compliance

**User Story:** As a user with disabilities, I want the website to be fully accessible, so that I can navigate and use all features with assistive technologies.

#### Acceptance Criteria

1. THE System SHALL comply with WCAG 2.1 Level AA accessibility standards
2. THE System SHALL provide keyboard navigation for all interactive elements with visible focus indicators
3. THE System SHALL provide appropriate ARIA labels and semantic HTML for screen reader compatibility
4. THE System SHALL maintain a color contrast ratio of at least 4.5:1 for normal text and 3:1 for large text
5. THE System SHALL provide alternative text for all images and meaningful content

### Requirement 26: Security and Data Protection

**User Story:** As a user providing personal and payment information, I want my data to be secure, so that I can trust the platform with sensitive information.

#### Acceptance Criteria

1. THE System SHALL encrypt all data transmissions using TLS 1.3 or higher
2. THE System SHALL store passwords using bcrypt hashing with a minimum cost factor of 12
3. THE System SHALL process all payment transactions through PCI-compliant Stripe integration without storing card details
4. THE System SHALL implement CSRF protection on all form submissions
5. THE System SHALL enforce session timeout after 30 minutes of inactivity

### Requirement 27: Email Notifications

**User Story:** As a user, I want to receive email notifications for important actions, so that I stay informed about my account and activities.

#### Acceptance Criteria

1. WHEN a user account is created, THE System SHALL send a setup email with activation link
2. WHEN a user completes a purchase, THE System SHALL send an order confirmation email with receipt
3. WHEN a user makes a donation, THE System SHALL send a donation confirmation email with tax receipt
4. WHEN a user submits a gear drive donation, THE System SHALL send a confirmation email with coordination details
5. WHEN an admin updates an order status, THE System SHALL send a status update email to the customer

### Requirement 28: Activity Logging

**User Story:** As an admin, I want all significant user actions to be logged, so that I can audit system usage and troubleshoot issues.

#### Acceptance Criteria

1. WHEN a user logs in, THE System SHALL log the authentication event with timestamp and IP address
2. WHEN a user completes an assessment or form, THE System SHALL log the submission with user identifier and timestamp
3. WHEN a transaction occurs, THE System SHALL log the transaction details with amount, type, and status
4. WHEN an admin performs management actions, THE System SHALL log the action with admin identifier and affected resources
5. THE System SHALL retain activity logs for a minimum of 90 days

### Requirement 29: Error Handling

**User Story:** As any user, I want clear and helpful error messages when something goes wrong, so that I understand the issue and know how to proceed.

#### Acceptance Criteria

1. WHEN a system error occurs, THE System SHALL display a user-friendly error message without exposing technical details
2. WHEN a form validation fails, THE System SHALL display specific field-level error messages with correction guidance
3. WHEN a payment fails, THE System SHALL display the failure reason and provide retry options
4. WHEN a network error occurs, THE System SHALL display a connection error message with retry functionality
5. THE System SHALL log all errors with stack traces and context for admin review

### Requirement 30: Contact and Partnership Information

**User Story:** As a visitor or potential partner, I want to easily find contact information and social media channels, so that I can connect with AFYA for support or collaboration.

#### Acceptance Criteria

1. THE System SHALL display contact email (afya@theafya.org) in the footer and contact page
2. THE System SHALL display links to AFYA's social media channels: Instagram (@the.afya) and TikTok (@theafya)
3. THE System SHALL provide a contact form for general inquiries with fields for name, email, subject, and message
4. THE System SHALL display information about partnership opportunities including university partnerships and corporate wellness programs
5. WHEN a visitor submits a contact form, THE System SHALL send the inquiry to afya@theafya.org and display a confirmation message
6. THE System SHALL display information about current partnerships including university outreach to Nova and Georgetown
