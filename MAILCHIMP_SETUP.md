# Mailchimp Blog Newsletter Automation Setup

This guide will help you set up automated email notifications for your newsletter subscribers when you publish a new blog article.

## How It Works

When you publish a blog post in the admin panel:
1. The blog status changes to "published"
2. Automatically triggers a Netlify function
3. Sends a beautiful email to all newsletter subscribers via Mailchimp
4. Email includes the blog title, summary, cover image, and link

## Required Environment Variables

Add these to your Netlify environment variables (Site settings > Environment variables):

### Existing Variables (you should already have these)
```bash
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_SERVER_PREFIX=us1  # or your datacenter prefix (us1, us2, etc.)
MAILCHIMP_LIST_ID=your_list_id
EMAIL_FROM=your-email@example.com
URL=https://camilopinzon.netlify.app  # Your site URL
```

### Optional Variable
```bash
# Optional: If you want to send only to a specific segment (e.g., "blog subscribers")
MAILCHIMP_NEWSLETTER_SEGMENT_ID=12345
```

## Getting Your Mailchimp Credentials

### 1. API Key
1. Log in to Mailchimp
2. Click your profile icon → Account & billing
3. Go to Extras → API keys
4. Create a new API key or copy existing one

### 2. Server Prefix
- Found in your API key URL
- Example: If your Mailchimp URL is `https://us1.admin.mailchimp.com`, your prefix is `us1`

### 3. List ID (Audience ID)
1. Go to Audience → All contacts
2. Click Settings → Audience name and defaults
3. Find "Audience ID" - this is your List ID

### 4. Segment ID (Optional)
If you want to send to a specific segment:
1. Go to Audience → All contacts
2. Click Segments
3. Create a new segment for "Blog Subscribers" or use an existing one
4. The segment ID will be in the URL when you view the segment

## Testing the Automation

### Local Testing
1. Start your dev server: `npm run dev`
2. Log in to admin panel
3. Create or edit a blog post
4. Click "Publish"
5. Check the browser console for: `✅ Newsletter notification sent successfully`

### Production Testing
1. Deploy to Netlify
2. Ensure all environment variables are set
3. Log in to your production admin panel
4. Publish a blog post
5. Check Mailchimp → Campaigns to see the sent campaign

## Features

✅ **Automatic Trigger**: Sends when you click "Publish" on any blog  
✅ **Bilingual Support**: English and Spanish email templates based on blog language  
✅ **Beautiful Design**: Responsive HTML email with your branding  
✅ **Cover Image**: Includes blog cover image if available  
✅ **Safe Failure**: If email fails, blog still publishes successfully  
✅ **Mailchimp Integration**: Uses Mailchimp campaigns for professional delivery  
✅ **Unsubscribe Link**: Automatically includes Mailchimp unsubscribe link  

## Email Preview

The email includes:
- Personalized header with "New Article Published"
- Blog cover image (if available)
- Blog title
- Blog summary
- "Read full article" button linking to your blog
- Your signature
- Professional footer with unsubscribe link

## Troubleshooting

### Email Not Sending
1. Check Netlify function logs for errors
2. Verify all environment variables are set correctly
3. Check Mailchimp dashboard for campaign status
4. Ensure your Mailchimp account has email sending credits

### Wrong Language in Email
- The email language matches the blog's `lng` field (en or es)
- Make sure you set the correct language when creating the blog

### Segment Not Found
- If you get a segment error, the function will automatically send to your entire list
- Either create the segment in Mailchimp or remove the segment ID variable

## Advanced: Custom Email Template

To customize the email template, edit:
`netlify/functions/send-blog-notification.ts`

Look for the `htmlEmail` variable where you can modify:
- Colors (change `#0066cc` to your brand color)
- Layout and styling
- Email copy and text
- Button styles

## Support

For issues or questions, check:
- Netlify function logs
- Browser console for debug messages
- Mailchimp campaign reports

---

**Note**: The first time you publish, it may take a few moments for Mailchimp to process and send the campaign.

