# AFYA Wellness - Requirements (Compressed)

## Overview
AFYA is a wellness platform making elite fitness, nutrition, and health education universally accessible. Three core layers: Public Website (programs, shop, discovery), Discovery Pipeline (minimal data → scheduling), AFYA Portal (assessments, packets, tools).

**Mission:** Science-backed programs rooted in equity, powered by automation, guided by empathy.  
**Status:** 5+ U.S. states, 24 clients, goal 100 by Q3 2025.  
**Alignment:** UN SDGs 3, 4, 10.

## Philosophy
Build Like Lego: Simple foundations first, then complexity. Modular, testable, stable components before expanding.

## Key Terms
- **System**: AFYA platform
- **Client**: Community member
- **User Account**: Authenticated (USER, ADMIN, SUPER_ADMIN)
- **Health Packet**: Personalized PDF from assessment
- **Discovery Form**: Name, email, goal, notes → scheduling
- **Discovery Call**: Program assignment, sponsorship check, pathway selection
- **Assessment Module**: Nutrition, training, performance, youth, recovery, lifestyle
- **Packet Types**: General, Nutrition, Training, Athlete, Youth, Recovery
- **AFYA Portal**: Client portal (assessments, packets, tools)
- **Impact Area**: Foundations, Equipment, Gear Drive, Sponsorship
- **Health Tool**: Free calculator (BMR/TDEE, Plate Builder, etc.)

## Core Requirements

| # | Feature | Key Acceptance Criteria |
|---|---------|------------------------|
| 1 | Public Website | One-word nav, hero, stats, programs, impact, testimonials |
| 2 | About Page | Mission, values, team, metrics, SDG alignment, partnerships |
| 3 | Value Prop | Differentiators, automation, testimonials, evidence-based |
| 4 | Discovery | Form (name, email, goal, notes) → Calendly scheduling |
| 5 | Assessments | Modular: nutrition, training, performance, youth, recovery, lifestyle |
| 6 | Programs | Listing, filtering, detail pages, enrollment |
| 7 | Health Tools | BMR/TDEE, Plate Builder, Heart Rate Zones, Recovery Check-in, Youth Corner, Hydration/Sleep |
| 8 | Shop | Products, cart, Stripe checkout, order confirmation |
| 9 | Impact Hub | 4 impact areas, donation flow, gear drive, metrics |
| 10 | Packets | 9 types (General, Nutrition, Training, Athlete, Youth, Recovery, Pregnancy, Postpartum, Older Adult) |
| 11 | Portal | Dashboard, assessments, packets, saved tools, notifications |
| 12 | Admin | Users, clients, content, products, orders, analytics, activity logs |
| 13 | Email | Setup, orders, donations, gear drive, status updates, confirmations |
| 14 | Security | CSRF, rate limiting, headers, sessions, TLS 1.3 |
| 15 | Performance | Lighthouse 90+, LCP <2.5s, FID <100ms, CLS <0.1 |
| 16 | Accessibility | WCAG 2.1 AA, keyboard nav, ARIA labels, 4.5:1 contrast |
| 17 | Mobile | Responsive 320-2560px, touch-friendly, 44px targets |
| 18 | Testing | Unit, component, integration, E2E tests |
| 19 | Monitoring | Sentry error tracking, activity logs, analytics |
| 20 | Contact | Form, email, social links, partnerships, wellness map |
| 21 | Populations | General, Athlete, Youth, Senior, Pregnancy, Postpartum, Recovery, Chronic Conditions |
| 22 | Roles | USER, ADMIN, SUPER_ADMIN with role-based access |
| 23 | Status | PENDING, ACTIVE, INACTIVE, SUSPENDED |
| 24 | Packet Status | DRAFT, UNPUBLISHED, PUBLISHED, ARCHIVED |
| 25 | Discovery Status | SUBMITTED, CALL_SCHEDULED, CALL_COMPLETED, CONVERTED, CLOSED |
| 26 | Order Status | PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED |
| 27 | Gear Drive Status | SUBMITTED, REVIEWED, SCHEDULED, COMPLETED, DECLINED |
| 28 | Auth | NextAuth.js v5, email/password, password reset, session timeout 30min |
| 29 | Database | PostgreSQL + Prisma ORM, 30+ models, connection pooling |
| 30 | Storage | Vercel Blob for PDFs/images, Stripe for payments, Resend for email |

## Implementation Notes
- All 30 requirements are implemented and tested
- See tasks.md for detailed implementation breakdown
- See design.md for technical architecture
- Reference COMPREHENSIVE_PLATFORM_SPEC.md for full feature details
