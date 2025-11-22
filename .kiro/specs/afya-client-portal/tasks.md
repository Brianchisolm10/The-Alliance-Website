# Implementation Plan

This implementation plan breaks down the AFYA Wellness Website into discrete, manageable coding tasks. Each task builds incrementally on previous work, following the "build like lego" philosophy - simple foundations first, then complexity.

## Task List

- [x] 1. Project Setup and Foundation
  - Initialize Next.js 14+ project with TypeScript and App Router
  - Configure Tailwind CSS with custom design system tokens
  - Set up ESLint, Prettier, and TypeScript strict mode
  - Configure environment variables structure
  - _Requirements: All requirements depend on solid foundation_

- [x] 2. Database Schema and ORM Setup
  - Install and configure Prisma ORM
  - Define complete database schema in `prisma/schema.prisma` based on design document
  - Create initial migration
  - Set up database connection utilities
  - _Requirements: 13.1, 14.1, 15.1, 16.1, 17.1, 18.1_

- [x] 3. Authentication System
  - [x] 3.1 Install and configure NextAuth.js v5
    - Set up NextAuth configuration with credentials provider
    - Create auth API route handler
    - Implement session management
    - _Requirements: 15.1, 15.2_

  - [x] 3.2 Build login page and form
    - Create login page at `/login`
    - Implement login form with email/password fields
    - Add form validation with Zod
    - Integrate with NextAuth
    - _Requirements: 15.1, 15.2, 15.3_

  - [x] 3.3 Implement password reset flow
    - Create password reset request page
    - Build token generation and email sending
    - Create password reset confirmation page
    - _Requirements: 15.4, 15.5_

  - [x] 3.4 Build account setup flow
    - Create setup page at `/setup/[token]`
    - Implement token validation
    - Build setup form for password and profile
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [x] 4. Core UI Component Library
  - [x] 4.1 Create base UI primitives
    - Button component with variants
    - Input, Textarea, Select components
    - Card component
    - Modal/Dialog component
    - Toast notification system
    - _Requirements: 21.2, 23.2_

  - [x] 4.2 Build form components
    - Form wrapper with validation
    - Field components with error display
    - Loading states
    - Success/error feedback
    - _Requirements: 27.2_

  - [x] 4.3 Create layout components
    - Public site header with simplified navigation
    - Footer with contact info and social links
    - Portal layout with sidebar
    - Admin layout with navigation
    - _Requirements: 1.1, 28.1, 28.2_

- [x] 5. Public Website - Home Page
  - [x] 5.1 Build hero section
    - Create hero component with mission statement
    - Add "Start Your Journey" CTA button
    - Implement responsive design
    - _Requirements: 1.2_

  - [x] 5.2 Implement community stats counter
    - Create stats component with real-time data
    - Connect to database for member count and programs offered
    - Add animation for number counting
    - _Requirements: 1.3_

  - [x] 5.3 Build featured programs section
    - Create program card component
    - Fetch and display featured programs
    - Add carousel/grid layout
    - _Requirements: 1.4_

  - [x] 5.4 Create impact showcase
    - Build impact metrics display
    - Add visual elements for statistics
    - _Requirements: 1.5_

  - [x] 5.5 Implement testimonials carousel
    - Create testimonial card component
    - Build auto-rotating carousel
    - Add navigation controls
    - _Requirements: 1.6_

- [x] 6. About Page
  - Build About AFYA page with mission, values, and team information
  - Display traction metrics and growth goals
  - Show UN SDG alignment and ESG commitments
  - Add founder information and credentials
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_

- [x] 7. Programs Page
  - [x] 7.1 Create programs listing page
    - Build program card grid layout
    - Fetch programs from database
    - Implement responsive design
    - _Requirements: 6.1, 6.4_

  - [x] 7.2 Implement program filtering
    - Create filter sidebar with type, intensity, duration
    - Add filter logic and state management
    - Update program list based on filters
    - _Requirements: 6.2, 6.3_

  - [x] 7.3 Add program detail view
    - Create program detail modal or page
    - Display full program information
    - Add "Get Started" CTA integration
    - _Requirements: 6.5_

- [x] 8. Health Tools Page
  - [x] 8.1 Create tools landing page
    - Build tool cards grid
    - Add tool descriptions and icons
    - Implement navigation to individual tools
    - _Requirements: 7.1_

  - [x] 8.2 Build BMR/TDEE Calculator
    - Create calculator form with inputs
    - Implement calculation logic
    - Display results with visual feedback
    - _Requirements: 7.3, 7.4_

  - [x] 8.3 Build Plate Builder tool
    - Create interactive plate visualization
    - Add food selection interface
    - Implement portion calculations
    - _Requirements: 7.3, 7.4_

  - [x] 8.4 Build Heart Rate Zones Calculator
    - Create input form for age and resting HR
    - Calculate and display HR zones
    - Add visual zone chart
    - _Requirements: 7.3, 7.4_

  - [x] 8.5 Build remaining health tools
    - Hydration & Sleep Snapshot
    - Youth Corner
    - Recovery Check-in
    - _Requirements: 7.3, 7.4_

  - [x] 8.6 Add save functionality for authenticated users
    - Implement save tool results feature
    - Store results in database
    - Display saved results in dashboard
    - _Requirements: 7.5_

- [x] 9. Discovery Form and Scheduling
  - [x] 9.1 Create discovery form page
    - Build form at `/start` with name, email, goal, notes fields
    - Add Zod validation
    - Implement form submission
    - _Requirements: 4.2, 4.3, 4.4_

  - [x] 9.2 Implement scheduling interface
    - Integrate calendar scheduling (Calendly or custom)
    - Handle scheduling confirmation
    - Send confirmation email
    - _Requirements: 4.3, 4.5_

  - [x] 9.3 Create discovery submission management
    - Build database model for submissions
    - Create admin view for submissions
    - Add status tracking
    - _Requirements: 4.1, 4.5_

- [x] 10. E-Commerce Shop
  - [x] 10.1 Create shop page and product listing
    - Build product grid layout
    - Fetch products from database
    - Display product cards with images and prices
    - _Requirements: 8.1_

  - [x] 10.2 Implement shopping cart
    - Create cart state management
    - Build cart UI component
    - Add/remove items functionality
    - Persist cart in localStorage or session
    - _Requirements: 8.2_

  - [x] 10.3 Integrate Stripe checkout
    - Set up Stripe SDK
    - Create checkout session endpoint
    - Build checkout page
    - Handle payment success/failure
    - _Requirements: 8.3, 8.5_

  - [x] 10.4 Add donation allocation during checkout
    - Create donation allocation UI
    - Implement donation calculation
    - Store donation preferences
    - _Requirements: 8.4_

  - [x] 10.5 Build order confirmation
    - Create confirmation page
    - Send order confirmation email
    - Display order details and tracking
    - _Requirements: 8.5, 25.2_

- [x] 11. Impact and Donations
  - [x] 11.1 Create impact hub page
    - Build impact areas showcase
    - Display four impact areas with descriptions
    - Show impact metrics
    - Add ESG and social commitment information
    - _Requirements: 9.1, 9.3, 9.4, 9.5, 9.6_

  - [x] 11.2 Build monetary donation flow
    - Create donation form with preset amounts
    - Implement custom amount input
    - Add allocation across impact areas
    - Integrate Stripe payment
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 11.3 Implement donation confirmation
    - Create confirmation page
    - Generate tax receipt
    - Send confirmation email
    - _Requirements: 10.4, 10.5, 25.3_

  - [x] 11.4 Build gear drive donation form
    - Create physical donation form
    - Capture item details, condition, preferences
    - Store submissions for admin review
    - Send confirmation email
    - _Requirements: 11.1, 11.2, 11.3, 25.4_

- [x] 12. Client Portal - Dashboard
  - [x] 12.1 Create portal layout and navigation
    - Build authenticated portal layout
    - Add sidebar navigation
    - Implement route protection
    - _Requirements: 16.1_

  - [x] 12.2 Build dashboard home page
    - Create welcome section
    - Display personalized health packets
    - Show progress tracking metrics
    - Add notifications center
    - _Requirements: 16.1, 16.3, 16.5_

  - [x] 12.3 Implement packet viewing and download
    - Create packet list view
    - Build PDF preview component
    - Add download functionality
    - _Requirements: 16.2_

  - [x] 12.4 Display saved tool results
    - Fetch and display saved health tool calculations
    - Add navigation to tools
    - _Requirements: 16.4_

- [x] 13. Client Portal - Assessments
  - [x] 13.1 Create assessment module framework
    - Build modular assessment structure
    - Implement progress tracking
    - Add save and resume functionality
    - _Requirements: 5.1, 5.4_

  - [x] 13.2 Build nutrition assessment
    - Create nutrition-specific questions
    - Implement form validation
    - Store assessment data
    - _Requirements: 5.2_

  - [x] 13.3 Build training assessment
    - Create training experience questions
    - Add dynamic branching logic
    - Store assessment data
    - _Requirements: 5.2_

  - [x] 13.4 Build performance assessment
    - Create athlete performance questions
    - Add position and benchmark inputs
    - Store assessment data
    - _Requirements: 5.2_

  - [x] 13.5 Build youth assessment
    - Create youth-specific questions
    - Add age-appropriate logic
    - Store assessment data
    - _Requirements: 5.2_

  - [x] 13.6 Build recovery assessment
    - Create injury and recovery questions
    - Add condition tracking
    - Store assessment data
    - _Requirements: 5.2_

  - [x] 13.7 Build lifestyle assessment
    - Create lifestyle habit questions
    - Add sleep, hydration, stress tracking
    - Store assessment data
    - _Requirements: 5.2_

- [-] 14. Modular Packet Generation System
  - [x] 14.1 Update database schema for modular architecture
    - Add Population enum (GENERAL, ATHLETE, YOUTH, RECOVERY, PREGNANCY, POSTPARTUM, OLDER_ADULT, CHRONIC_CONDITION)
    - Add PacketStatus enum (DRAFT, UNPUBLISHED, PUBLISHED, ARCHIVED)
    - Add population field to User model
    - Add status, version, lastModifiedBy, publishedAt, publishedBy to Packet model
    - Create PacketVersion model for version history
    - Create ExerciseLibrary and NutritionLibrary models
    - Create PopulationModule model for pluggable assessment modules
    - _Requirements: 5.3, 5.5, 13.1_

  - [x] 14.2 Build population routing system
    - Create population classification logic based on discovery call
    - Implement population assignment during onboarding
    - Build population-specific assessment routing
    - Add population switching capability for multi-classification clients
    - _Requirements: 4.1, 5.1, 13.1_

  - [x] 14.3 Create modular assessment framework
    - Build base assessment module interface
    - Create population-specific assessment modules (pregnancy trimester, postpartum stage, elderly functional screening, athlete metrics, youth markers, injury history)
    - Implement dynamic module loading based on population
    - Add dietary restrictions, lifestyle habits, movement readiness, equipment availability modules
    - Store all assessment data in unified client profile
    - _Requirements: 5.1, 5.2, 5.4_

  - [x] 14.4 Build exercise and nutrition libraries
    - Create Exercise Library with regressions/progressions
    - Create Nutrition Library with population-specific constraints
    - Add safety rules and contraindications per population
    - Implement search and filter functionality
    - Add admin interface for library management
    - _Requirements: 5.3, 19.2_

  - [x] 14.5 Set up PDF generation library
    - Install and configure PDF library (e.g., react-pdf, puppeteer)
    - Create modular PDF template structure
    - Build template system for all population types
    - _Requirements: 5.3, 5.5_

  - [x] 14.6 Build auto-generation engine
    - Create packet generation service with population-specific logic
    - Implement template selection based on population and assessment data
    - Apply safety rules and constraints per population
    - Generate exercise progressions/regressions from library
    - Apply nutrition constraints from library
    - Map unified client profile to packet content
    - Generate draft packets with DRAFT status
    - _Requirements: 5.3_

  - [x] 14.7 Implement all packet type templates
    - General Packet template
    - Nutrition Packet template
    - Training Packet template
    - Athlete Performance Packet template
    - Youth Packet template
    - Recovery Packet template
    - Pregnancy Packet template
    - Postpartum Packet template
    - Older Adult Packet template
    - Create extensible template system for future populations
    - _Requirements: 5.3, 5.5_

  - [x] 14.8 Build admin review and editing interface
    - Create packet review dashboard showing all DRAFT/UNPUBLISHED packets
    - Build packet editor with exercise swap functionality
    - Add sets/reps adjustment controls
    - Implement phase modification tools
    - Add coach notes and override capabilities
    - Build meal structure editor
    - Add alternative template application
    - Implement version comparison view
    - _Requirements: 5.3, 17.1, 19.2_

  - [x] 14.9 Implement packet publishing workflow
    - Add "Publish" action that changes status from UNPUBLISHED to PUBLISHED
    - Implement "Unpublish" action for revisions
    - Add version history tracking on each edit
    - Store lastModifiedBy and publishedBy user references
    - Add timestamp tracking (createdAt, updatedAt, publishedAt)
    - Send notification to client when packet is published
    - _Requirements: 5.4, 5.5, 19.5_

  - [ ] 14.10 Add packet storage and retrieval
    - Upload generated PDFs to storage
    - Store packet metadata in database with status
    - Implement download endpoints (only for PUBLISHED packets)
    - Add client-side packet visibility filtering (hide DRAFT/UNPUBLISHED)
    - Create admin-side view for all packet statuses
    - _Requirements: 5.4, 5.5, 16.2_

  - [ ] 14.11 Build packet versioning system
    - Create version history table
    - Store snapshots of packet content on each edit
    - Add "View History" interface in admin panel
    - Implement "Restore Version" functionality
    - Display version diff comparison
    - Track who made each change and when
    - _Requirements: 5.5, 17.1_

- [ ] 15. Admin Panel - Dashboard
  - [ ] 15.1 Create admin layout and navigation
    - Build admin panel layout
    - Add role-based navigation
    - Implement admin route protection
    - _Requirements: 17.1_

  - [ ] 15.2 Build admin dashboard home
    - Create KPI cards (users, revenue, engagement)
    - Display recent activity feed
    - Add quick action buttons
    - Show system health indicators
    - _Requirements: 17.2, 17.3, 17.4_

  - [ ] 15.3 Implement notifications center
    - Display pending actions
    - Show new discovery forms
    - Alert for pending orders
    - _Requirements: 17.4_

- [ ] 16. Admin Panel - User Management
  - [ ] 16.1 Create user management page
    - Build user table with search and filters
    - Display user list with status indicators
    - Add pagination
    - _Requirements: 18.1_

  - [ ] 16.2 Build create user functionality
    - Create user form
    - Generate setup token
    - Send setup email
    - _Requirements: 13.1, 13.2, 18.2, 25.1_

  - [ ] 16.3 Implement edit user functionality
    - Create edit user form
    - Update roles and status
    - Handle permission restrictions
    - _Requirements: 18.3, 18.6_

  - [ ] 16.4 Build user detail view
    - Display complete user profile
    - Show activity logs
    - Display engagement metrics
    - _Requirements: 18.4_

  - [ ] 16.5 Add bulk user actions
    - Implement multi-select functionality
    - Add bulk status updates
    - Add bulk role assignments
    - _Requirements: 18.5_

- [ ] 17. Admin Panel - Client Communication
  - [ ] 17.1 Create client management interface
    - Build client list with status indicators
    - Add search and filter capabilities
    - Display client journey overview
    - _Requirements: 21.1, 21.4_

  - [ ] 17.2 Implement internal notes system
    - Create note creation form
    - Display notes timeline
    - Add note editing and deletion
    - _Requirements: 21.2_

  - [ ] 17.3 Build email communication interface
    - Create email composer
    - Add email templates
    - Send emails to clients
    - _Requirements: 21.3_

  - [ ] 17.4 Add client assignment feature
    - Implement team member assignment
    - Display assigned clients
    - Track assignment history
    - _Requirements: 21.5_

  - [ ] 17.5 Build discovery call tracking
    - Display call scheduling status
    - Track call completion
    - Add call notes
    - _Requirements: 21.6_

- [ ] 18. Admin Panel - Content Management
  - [ ] 18.1 Create program management interface
    - Build program CRUD interface
    - Add rich text editor for descriptions
    - Upload program images
    - _Requirements: 19.2_

  - [ ] 18.2 Build testimonial management
    - Create testimonial approval workflow
    - Add testimonial CRUD
    - Implement publish/unpublish
    - _Requirements: 19.4_

  - [ ] 18.3 Create impact area editor
    - Build impact area update interface
    - Edit descriptions and metrics
    - _Requirements: 19.3_

  - [ ] 18.4 Implement content publishing
    - Add publish/unpublish functionality
    - Real-time website updates
    - _Requirements: 19.5_

- [ ] 19. Admin Panel - Product and Order Management
  - [ ] 19.1 Create product management interface
    - Build product CRUD interface
    - Add image upload
    - Manage inventory levels
    - Integrate with Stripe products
    - _Requirements: 20.1, 20.2_

  - [ ] 19.2 Build order management interface
    - Display order list with filters
    - Show order details
    - Track payment and shipping status
    - _Requirements: 20.3, 20.4_

  - [ ] 19.3 Implement order processing
    - Update order status
    - Send status notification emails
    - Track fulfillment
    - _Requirements: 20.5, 25.5_

- [ ] 20. Admin Panel - Analytics
  - [ ] 20.1 Build analytics dashboard
    - Display key performance indicators
    - Show user engagement metrics
    - Display program enrollment data
    - Show donation metrics
    - _Requirements: 22.1_

  - [ ] 20.2 Implement performance monitoring
    - Display page load times
    - Show error rates
    - Track API response times
    - _Requirements: 22.2_

  - [ ] 20.3 Add data visualization
    - Create charts for trend analysis
    - Add date range filters
    - Implement custom reports
    - _Requirements: 22.3, 22.4_

  - [ ] 20.4 Build data export functionality
    - Export analytics to CSV
    - Generate custom reports
    - _Requirements: 22.5_

- [ ] 21. Email System
  - [ ] 21.1 Set up email service integration
    - Configure Resend or SendGrid
    - Create email templates
    - Set up email sending utilities
    - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5_

  - [ ] 21.2 Build email templates
    - Account setup email
    - Order confirmation email
    - Donation receipt email
    - Gear drive confirmation email
    - Order status update email
    - Discovery form confirmation email
    - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5_

  - [ ] 21.3 Implement email sending logic
    - Create email service functions
    - Add error handling and retries
    - Log email sending activity
    - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5_

- [ ] 22. Activity Logging and Monitoring
  - [ ] 22.1 Implement activity logging system
    - Create logging utility
    - Log authentication events
    - Log form submissions
    - Log transactions
    - Log admin actions
    - _Requirements: 26.1, 26.2, 26.3, 26.4_

  - [ ] 22.2 Build activity log viewer
    - Create admin interface for viewing logs
    - Add search and filter capabilities
    - Display log details
    - _Requirements: 26.5_

  - [ ] 22.3 Set up error tracking
    - Integrate Sentry for error monitoring
    - Configure error boundaries
    - Add error logging
    - _Requirements: 27.5_

- [ ] 23. Contact and Partnership Pages
  - Build contact page with form
  - Display contact email and social media links
  - Show partnership opportunities
  - Display current partnerships
  - Implement contact form submission and email sending
  - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5, 28.6_

- [ ] 24. Security Hardening
  - [ ] 24.1 Implement CSRF protection
    - Add CSRF tokens to all forms
    - Validate tokens on submission
    - _Requirements: 24.4_

  - [ ] 24.2 Add rate limiting
    - Implement rate limiting on API routes
    - Add rate limiting on authentication endpoints
    - _Requirements: 24.5_

  - [ ] 24.3 Configure security headers
    - Set up CSP headers
    - Add security middleware
    - Configure TLS settings
    - _Requirements: 24.1_

  - [ ] 24.4 Implement session management
    - Configure session timeout
    - Add session refresh logic
    - _Requirements: 24.5_

- [ ] 25. Performance Optimization
  - [ ] 25.1 Optimize images
    - Use next/image for all images
    - Add lazy loading
    - Optimize image formats
    - _Requirements: 21.3, 23.1_

  - [ ] 25.2 Implement code splitting
    - Split code by routes
    - Lazy load non-critical components
    - _Requirements: 22.5_

  - [ ] 25.3 Add caching strategies
    - Implement API response caching
    - Add static page caching
    - Configure CDN caching
    - _Requirements: 22.1, 22.2_

  - [ ] 25.4 Optimize database queries
    - Add database indexes
    - Optimize N+1 queries
    - Implement connection pooling
    - _Requirements: 22.2, 22.3_

- [ ] 26. Accessibility Compliance
  - [ ] 26.1 Add ARIA labels and semantic HTML
    - Review all components for accessibility
    - Add appropriate ARIA labels
    - Use semantic HTML elements
    - _Requirements: 23.3_

  - [ ] 26.2 Implement keyboard navigation
    - Add keyboard support to all interactive elements
    - Add visible focus indicators
    - Test tab order
    - _Requirements: 23.2_

  - [ ] 26.3 Ensure color contrast compliance
    - Audit color contrast ratios
    - Update colors to meet WCAG AA standards
    - _Requirements: 23.4_

  - [ ] 26.4 Add alternative text
    - Add alt text to all images
    - Add descriptive labels to icons
    - _Requirements: 23.5_

- [ ] 27. Mobile Responsiveness
  - [ ] 27.1 Implement responsive layouts
    - Test all pages on mobile devices
    - Adjust layouts for small screens
    - Ensure touch-friendly controls
    - _Requirements: 21.1, 21.2, 21.5_

  - [ ] 27.2 Optimize for mobile performance
    - Reduce mobile bundle size
    - Optimize images for mobile
    - Test on 3G connections
    - _Requirements: 21.3, 22.2_

- [ ] 28. Testing and Quality Assurance
  - [ ] 28.1 Write unit tests for utilities
    - Test helper functions
    - Test validation schemas
    - Test calculation logic
    - _Requirements: All_

  - [ ] 28.2 Write component tests
    - Test form components
    - Test UI components
    - Test page components
    - _Requirements: All_

  - [ ] 28.3 Write integration tests
    - Test API routes
    - Test Server Actions
    - Test database operations
    - _Requirements: All_

  - [ ] 28.4 Write E2E tests for critical flows
    - Test user registration and login
    - Test discovery form submission
    - Test checkout flow
    - Test admin user creation
    - _Requirements: All_

- [ ] 29. Documentation
  - [ ] 29.1 Write developer documentation
    - Document setup instructions
    - Document architecture decisions
    - Document API endpoints
    - _Requirements: All_

  - [ ] 29.2 Write user documentation
    - Create admin user guide
    - Create client portal guide
    - _Requirements: All_

- [ ] 30. Deployment and Launch
  - [ ] 30.1 Set up production environment
    - Configure production database
    - Set up environment variables
    - Configure domain and SSL
    - _Requirements: All_

  - [ ] 30.2 Deploy to Vercel
    - Connect GitHub repository
    - Configure build settings
    - Deploy to production
    - _Requirements: All_

  - [ ] 30.3 Post-launch monitoring
    - Monitor error rates
    - Track performance metrics
    - Monitor user feedback
    - _Requirements: 22.1, 22.2_
