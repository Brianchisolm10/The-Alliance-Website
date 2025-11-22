# Contact Page Implementation

## Overview
Created a comprehensive contact page with AFYA's information, social media links, and an interactive wellness resources finder.

## Features Implemented

### 1. Contact Information Section
- **Email**: info@theafya.org with clickable mailto link
- **Phone**: +1 (234) 567-890 with clickable tel link
- **Address**: Physical location display
- **Business Hours**: Operating hours for each day
- Clean card-based layout with icons

### 2. Social Media Integration
- **Facebook**: Link to AFYA's Facebook page
- **Instagram**: Link to AFYA's Instagram profile
- **Twitter/X**: Link to AFYA's Twitter account
- **LinkedIn**: Link to AFYA's LinkedIn company page
- Interactive hover effects with brand colors
- Social media icons with proper branding

### 3. Contact Form
- Fields: Name, Email, Subject, Message
- Form validation
- Success/error messaging
- Saves submissions to database (ContactSubmission model)
- Clean, user-friendly interface

### 4. Wellness Resources Map
**Interactive Location-Based Finder:**
- "Use My Precise Location" button with geolocation API
- Browser location permission handling
- Loading states and error handling

**Resource Categories:**
- 🏋️ Gyms & Fitness Centers
- 🏥 Hospitals & Clinics
- 🌳 Parks & Recreation
- 🛒 Grocery Stores
- 💊 Pharmacies

**Features:**
- Category filtering with visual buttons
- Map placeholder (ready for Google Maps integration)
- Resource list with:
  - Name and address
  - Distance from user
  - Ratings
  - Open/closed status
  - Directions button
- Responsive design

## Files Created

### Pages
- `app/contact/page.tsx` - Main contact page with layout

### Components
- `components/contact/contact-info.tsx` - Contact details and social media
- `components/contact/contact-form.tsx` - Contact form with validation
- `components/contact/wellness-resources-map.tsx` - Location-based resource finder

### Actions
- `app/actions/contact.ts` - Server action for form submission

## Technical Details

### Geolocation API
- Uses browser's native `navigator.geolocation` API
- Requests user permission for precise location
- Handles permission denial gracefully
- Shows loading states during location fetch

### Database Integration
- Saves contact form submissions to `ContactSubmission` table
- Includes name, email, subject, and message
- Timestamps for tracking

### Responsive Design
- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly buttons and links
- Sidebar shows only on large screens

### User Experience
- Clear visual hierarchy
- Intuitive navigation
- Helpful error messages
- Success confirmations
- Loading indicators
- Hover effects and transitions

## Future Enhancements

### Google Maps Integration
To add real Google Maps functionality:

1. **Get Google Maps API Key**:
   - Visit Google Cloud Console
   - Enable Maps JavaScript API and Places API
   - Create API key

2. **Add to Environment Variables**:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

3. **Install Google Maps Package**:
   ```bash
   npm install @googlemaps/js-api-loader
   ```

4. **Update Map Component**:
   - Replace map placeholder with actual Google Maps embed
   - Use Places API to fetch real nearby locations
   - Add markers for each resource
   - Implement directions functionality

### Additional Features
- Email notifications to admin on form submission
- Auto-reply email to user
- Save favorite locations
- Filter by distance radius
- Show business hours for each location
- Add photos for locations
- User reviews and ratings
- Directions integration with Google Maps/Apple Maps

## Usage

### Accessing the Page
Navigate to `/contact` to view the contact page.

### Using Location Services
1. Click "Use My Precise Location" button
2. Allow browser location permission when prompted
3. Select a resource category (Gyms, Parks, etc.)
4. View nearby resources in the list
5. Click "Directions" to get navigation (future feature)

### Submitting Contact Form
1. Fill in all required fields
2. Click "Send Message"
3. Wait for success confirmation
4. Form clears automatically on success

## Notes
- Social media links are placeholder URLs - update with actual AFYA social media accounts
- Contact information (phone, address) should be updated with real AFYA details
- Map currently shows mock data - integrate with Google Places API for production
- Consider adding reCAPTCHA to prevent spam submissions
