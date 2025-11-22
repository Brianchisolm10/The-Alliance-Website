# Packet Storage Quick Start Guide

## Overview

The packet storage system handles PDF generation, storage, and retrieval for health packets. It ensures that only published packets are visible to clients while admins can manage all packet statuses.

## Setup

### 1. Configure Storage (Vercel Blob)

Add to your `.env` file:

```bash
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

Get your token from: https://vercel.com/dashboard/stores

### 2. Install Dependencies

```bash
npm install @vercel/blob
```

## How It Works

### Packet Lifecycle

1. **DRAFT** → Packet is auto-generated from assessment
2. **Admin Reviews** → Admin edits and reviews packet
3. **PUBLISHED** → Admin publishes packet
   - PDF is automatically generated
   - Client receives email notification
   - Packet becomes visible in client portal
4. **Client Downloads** → Client can view and download PDF

### Storage Flow

```
Assessment Data → Generate Packet Content → Create PDF → Upload to Storage → Store URL in DB
```

## Usage

### For Admins

#### View All Packets

Navigate to `/admin/packets` to see all packets with any status:
- DRAFT (yellow badge)
- UNPUBLISHED (orange badge)
- PUBLISHED (green badge)
- ARCHIVED (gray badge)

#### Generate PDF Manually

1. Go to `/admin/packets`
2. Find packet without PDF
3. Click "Generate PDF" button
4. Wait for generation to complete

#### Edit and Publish Packet

1. Go to `/admin/packets/[id]`
2. Edit packet content using the editor
3. Click "📤 Publish & Notify Client"
4. PDF is automatically generated (if not already exists)
5. Client receives email notification

#### Regenerate PDF After Edits

1. Go to `/admin/packets/[id]`
2. Make your edits
3. Click "🔄 Regenerate PDF"
4. New PDF replaces old one

### For Clients

#### View Published Packets

Navigate to `/packets` to see only PUBLISHED packets:
- Only packets with PUBLISHED status are shown
- DRAFT and UNPUBLISHED packets are hidden
- Each packet shows published date

#### Download Packet

1. Go to `/packets`
2. Click "Preview" to view in browser
3. Click "Download" to save PDF

## API Reference

### Server Actions

```typescript
// Get user's published packets (client-side)
import { getUserPublishedPackets } from '@/app/actions/packet-storage';
const result = await getUserPublishedPackets();

// Get all packets (admin-side)
import { getAllPacketsForAdmin } from '@/app/actions/packet-storage';
const result = await getAllPacketsForAdmin({
  status: [PacketStatus.DRAFT, PacketStatus.UNPUBLISHED],
});

// Generate PDF
import { generatePacketPDF } from '@/app/actions/packet-storage';
const result = await generatePacketPDF(packetId);

// Regenerate PDF
import { regeneratePDF } from '@/app/actions/packet-storage';
const result = await regeneratePDF(packetId);

// Download packet
import { downloadPacket } from '@/app/actions/packet-storage';
const result = await downloadPacket(packetId);
```

### API Routes

```typescript
// Download packet (redirects to file URL)
GET /api/packets/[packetId]/download
```

## Security

### Client Access Rules

- ✅ Can view only PUBLISHED packets
- ✅ Can only access their own packets
- ❌ Cannot see DRAFT or UNPUBLISHED packets
- ❌ Cannot generate or regenerate PDFs

### Admin Access Rules

- ✅ Can view all packet statuses
- ✅ Can view all users' packets
- ✅ Can generate and regenerate PDFs
- ✅ Can publish and unpublish packets

## Troubleshooting

### PDF Not Generating

**Problem**: PDF generation fails or takes too long

**Solutions**:
1. Check storage configuration: `BLOB_READ_WRITE_TOKEN` is set
2. Check packet has valid content data
3. Check server logs for errors
4. Try regenerating PDF manually

### Client Can't See Packet

**Problem**: Client doesn't see their packet

**Possible Causes**:
1. Packet status is not PUBLISHED
2. Packet belongs to different user
3. Client not logged in

**Solution**: Admin should check packet status and publish if needed

### Download Link Not Working

**Problem**: Download link returns error

**Possible Causes**:
1. PDF not generated yet
2. Storage URL expired (shouldn't happen with Vercel Blob)
3. User not authorized

**Solution**: Regenerate PDF or check user permissions

## Best Practices

### For Admins

1. **Review Before Publishing**: Always review packet content before publishing
2. **Generate PDFs Early**: Generate PDFs during review to catch any issues
3. **Test Downloads**: Test PDF downloads before notifying clients
4. **Regenerate After Edits**: Always regenerate PDF after making edits to published packets

### For Development

1. **Check Storage Config**: Always verify storage is configured before deploying
2. **Handle Errors Gracefully**: PDF generation failures shouldn't block publishing
3. **Monitor Storage Usage**: Track storage costs and usage patterns
4. **Test Both Paths**: Test both automatic (on publish) and manual PDF generation

## Storage Costs

### Vercel Blob Pricing

- **Free Tier**: 500 MB storage, 5 GB bandwidth/month
- **Pro**: $0.15/GB storage, $0.30/GB bandwidth
- **Enterprise**: Custom pricing

### Estimated Usage

- Average PDF size: 500 KB - 2 MB
- 100 packets = 50-200 MB storage
- 1000 downloads/month = 0.5-2 GB bandwidth

## Future Enhancements

1. **PDF Caching**: Cache generated PDFs to reduce regeneration
2. **Batch Generation**: Generate PDFs for multiple packets at once
3. **AWS S3 Support**: Complete AWS S3 implementation
4. **PDF Versioning**: Keep historical versions of PDFs
5. **Compression**: Compress PDFs to reduce storage costs
6. **CDN Integration**: Use CDN for faster PDF delivery

## Support

For issues or questions:
1. Check server logs for errors
2. Verify storage configuration
3. Test with a simple packet first
4. Contact development team if issues persist

## Related Documentation

- [Task 14.10 Completion](.kiro/specs/afya-client-portal/TASK_14.10_COMPLETION.md)
- [PDF Generation Guide](lib/pdf/PACKET_GENERATION_GUIDE.md)
- [Packet Publishing Workflow](PACKET_PUBLISHING_WORKFLOW.md)
