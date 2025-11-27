# Documentation Organization Guide

This guide helps you navigate and manage the extensive documentation created for the AFYA Wellness Platform rebuild.

## 📚 Documentation Structure

### Tier 1: Quick Start (Read First)
- **START_HERE.md** - Entry point, 3 rebuild options, quick checklist
- **REBUILD_QUICK_START.md** - 30-minute rebuild method
- **INSTALL_COMMANDS.md** - All npm commands organized by category

### Tier 2: Comprehensive Guides (Reference)
- **COMPLETE_REBUILD_GUIDE.md** - Full technical details, all features, troubleshooting
- **COMPREHENSIVE_PLATFORM_SPEC.md** - 64 pages, 12 populations, 200+ services
- **ARCHITECTURE_OVERVIEW.md** - System diagrams, data flow, component hierarchy

### Tier 3: Specialized Documentation (As Needed)
- **NEW_PLATFORM_SUMMARY.md** - Concise feature summary for new sessions
- **KIRO_SPEC_GUIDE.md** - How to use Kiro specs for building
- **PROJECT_REBUILD_GUIDE.md** - Original rebuild guide (reference)

### Tier 4: Existing Project Docs (Already in Project)
- DEVELOPER_GUIDE.md
- ADMIN_USER_GUIDE.md
- CLIENT_PORTAL_GUIDE.md
- DEPLOYMENT_GUIDE.md
- And 50+ other specialized guides

---

## 🎯 How to Use This Documentation

### Scenario 1: Starting Fresh
1. Read: **START_HERE.md** (5 min)
2. Read: **REBUILD_QUICK_START.md** (10 min)
3. Run: Commands from **INSTALL_COMMANDS.md**
4. Reference: **COMPLETE_REBUILD_GUIDE.md** as needed

### Scenario 2: Understanding the Full Platform
1. Read: **COMPREHENSIVE_PLATFORM_SPEC.md** (all pages and features)
2. Reference: **ARCHITECTURE_OVERVIEW.md** (system design)
3. Check: **NEW_PLATFORM_SUMMARY.md** (concise overview)

### Scenario 3: Building with Kiro
1. Read: **KIRO_SPEC_GUIDE.md** (how specs work)
2. Copy: **NEW_PLATFORM_SUMMARY.md** (paste into new Kiro session)
3. Reference: **COMPREHENSIVE_PLATFORM_SPEC.md** (detailed requirements)

### Scenario 4: Troubleshooting
1. Check: **COMPLETE_REBUILD_GUIDE.md** → Troubleshooting section
2. Check: **DEVELOPER_GUIDE.md** → Troubleshooting section
3. Check: Specific feature guides (PACKET_EDITING_GUIDE.md, etc.)

---

## 📊 File Size Reference

### Large Files (Reference/Archive)
- COMPREHENSIVE_PLATFORM_SPEC.md (~50KB) - Complete platform specification
- COMPLETE_REBUILD_GUIDE.md (~40KB) - Full technical guide
- DEVELOPER_GUIDE.md (~35KB) - Developer documentation

### Medium Files (Regular Use)
- NEW_PLATFORM_SUMMARY.md (~15KB) - Feature summary
- ARCHITECTURE_OVERVIEW.md (~20KB) - System design
- REBUILD_QUICK_START.md (~8KB) - Quick instructions

### Small Files (Quick Reference)
- START_HERE.md (~5KB) - Entry point
- INSTALL_COMMANDS.md (~6KB) - Installation steps
- KIRO_SPEC_GUIDE.md (~8KB) - Spec system guide

---

## 🗂 Recommended File Organization

### In Your Project Root
Keep these for quick access:
- START_HERE.md
- REBUILD_QUICK_START.md
- INSTALL_COMMANDS.md
- NEW_PLATFORM_SUMMARY.md

### In a `/docs` Folder (Optional)
Archive these for reference:
- COMPREHENSIVE_PLATFORM_SPEC.md
- COMPLETE_REBUILD_GUIDE.md
- ARCHITECTURE_OVERVIEW.md
- KIRO_SPEC_GUIDE.md
- PROJECT_REBUILD_GUIDE.md
- DOCUMENTATION_ORGANIZATION.md (this file)

### Already in Project
Leave these where they are:
- DEVELOPER_GUIDE.md
- ADMIN_USER_GUIDE.md
- CLIENT_PORTAL_GUIDE.md
- DEPLOYMENT_GUIDE.md
- And all other existing guides

---

## 🎯 Quick Reference by Task

### "I want to rebuild the website"
→ START_HERE.md → REBUILD_QUICK_START.md → INSTALL_COMMANDS.md

### "I want to understand the full platform"
→ COMPREHENSIVE_PLATFORM_SPEC.md → ARCHITECTURE_OVERVIEW.md

### "I want to build with Kiro"
→ KIRO_SPEC_GUIDE.md → NEW_PLATFORM_SUMMARY.md

### "I need to deploy"
→ DEPLOYMENT_GUIDE.md → DEPLOYMENT_QUICK_START.md

### "I'm a developer"
→ DEVELOPER_GUIDE.md → ARCHITECTURE_OVERVIEW.md

### "I'm an admin"
→ ADMIN_USER_GUIDE.md → ADMIN_USER_GUIDE.md

### "I'm a client"
→ CLIENT_PORTAL_GUIDE.md

### "Something is broken"
→ COMPLETE_REBUILD_GUIDE.md (Troubleshooting) → DEVELOPER_GUIDE.md (Troubleshooting)

---

## 📝 Document Purposes

| Document | Purpose | Length | Audience |
|----------|---------|--------|----------|
| START_HERE.md | Entry point, quick decisions | 5KB | Everyone |
| REBUILD_QUICK_START.md | Fast rebuild method | 8KB | Developers |
| INSTALL_COMMANDS.md | All npm commands | 6KB | Developers |
| COMPLETE_REBUILD_GUIDE.md | Full technical reference | 40KB | Developers |
| COMPREHENSIVE_PLATFORM_SPEC.md | Complete platform spec | 50KB | Architects, Developers |
| ARCHITECTURE_OVERVIEW.md | System design & diagrams | 20KB | Developers, Architects |
| NEW_PLATFORM_SUMMARY.md | Concise feature summary | 15KB | Kiro sessions, Planning |
| KIRO_SPEC_GUIDE.md | How to use Kiro specs | 8KB | Developers using Kiro |
| PROJECT_REBUILD_GUIDE.md | Original rebuild guide | 30KB | Reference/Archive |
| DEVELOPER_GUIDE.md | Developer onboarding | 35KB | Developers |
| ADMIN_USER_GUIDE.md | Admin features | 25KB | Administrators |
| CLIENT_PORTAL_GUIDE.md | Client features | 20KB | End Users |
| DEPLOYMENT_GUIDE.md | Deployment instructions | 15KB | DevOps, Developers |

---

## 💡 Tips for Managing Documentation

### When to Use Each Document

**START_HERE.md**
- First time visiting
- Need quick decision
- Want overview

**REBUILD_QUICK_START.md**
- Ready to rebuild
- Want fastest method
- Need step-by-step

**COMPLETE_REBUILD_GUIDE.md**
- Need comprehensive details
- Troubleshooting issues
- Understanding all features

**COMPREHENSIVE_PLATFORM_SPEC.md**
- Planning new features
- Understanding full scope
- Architectural decisions

**NEW_PLATFORM_SUMMARY.md**
- Starting new Kiro session
- Sharing with team
- Quick reference

### Keeping Documentation Updated

1. **After rebuilding:** Update REBUILD_QUICK_START.md with any new steps
2. **After adding features:** Update COMPREHENSIVE_PLATFORM_SPEC.md
3. **After fixing bugs:** Update COMPLETE_REBUILD_GUIDE.md troubleshooting
4. **After deployment:** Update DEPLOYMENT_GUIDE.md

### Archiving Old Documentation

1. Create `/docs/archive` folder
2. Move old versions there
3. Keep current versions in root
4. Update this file with new structure

---

## 🚀 Getting Started

### For New Developers
1. Read: START_HERE.md (5 min)
2. Read: DEVELOPER_GUIDE.md (20 min)
3. Run: Commands from INSTALL_COMMANDS.md
4. Reference: ARCHITECTURE_OVERVIEW.md

### For Project Managers
1. Read: COMPREHENSIVE_PLATFORM_SPEC.md (overview section)
2. Reference: NEW_PLATFORM_SUMMARY.md (features)
3. Check: DEPLOYMENT_GUIDE.md (timeline)

### For Admins
1. Read: ADMIN_USER_GUIDE.md
2. Reference: ADMIN_USER_GUIDE.md (features)
3. Check: Specific feature guides as needed

### For Clients
1. Read: CLIENT_PORTAL_GUIDE.md
2. Reference: Specific tool guides as needed

---

## 📞 Support

If you can't find what you need:
1. Check this file (DOCUMENTATION_ORGANIZATION.md)
2. Search in COMPLETE_REBUILD_GUIDE.md
3. Check DEVELOPER_GUIDE.md
4. Contact: support@theafya.org

---

**Last Updated:** November 2025
**Total Documentation:** 15+ files, 300+ KB
**Recommended Reading Time:** 1-2 hours for full understanding
