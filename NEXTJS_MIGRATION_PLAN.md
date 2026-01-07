# Next.js Migration Plan - Complete Guide

## 📋 Table of Contents
1. [Pre-Migration Setup](#pre-migration-setup)
2. [Phase 1: Project Setup](#phase-1-project-setup)
3. [Phase 2: File Structure](#phase-2-file-structure)
4. [Phase 3: Configuration](#phase-3-configuration)
5. [Phase 4: Component Migration](#phase-4-component-migration)
6. [Phase 5: Routing & Pages](#phase-5-routing--pages)
7. [Phase 6: API Routes](#phase-6-api-routes)
8. [Phase 7: SSR/SSG Implementation](#phase-7-ssrssg-implementation)
9. [Phase 8: Testing & Deployment](#phase-8-testing--deployment)
10. [Troubleshooting](#troubleshooting)

---

## Pre-Migration Setup

### Prerequisites Checklist
- [ ] Backup current project (Git commit everything)
- [ ] Create new branch: `git checkout -b nextjs-migration`
- [ ] Document all environment variables
- [ ] Test current site thoroughly (have baseline)
- [ ] Set up Vercel account (free tier is fine)

### Environment Variables to Document
Copy these from your current `.env` or Netlify:
```
VITE_FIREBASE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
VITE_MEASUREMENT_ID=
VITE_ADMIN_EMAIL=
VITE_RECAPTCHA_KEY=
MAILCHIMP_API_KEY=
MAILCHIMP_SERVER_PREFIX=
MAILCHIMP_LIST_ID=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=
```

---

## Phase 1: Project Setup

### Step 1: Create Next.js Project
```bash
# Create new Next.js project with TypeScript
npx create-next-app@latest cp-website-nextjs --typescript --tailwind=no --eslint --app=no --src-dir

# Navigate to project
cd cp-website-nextjs
```

**Options to select:**
- ✅ TypeScript: Yes
- ✅ ESLint: Yes
- ❌ Tailwind CSS: No (we're using SCSS)
- ❌ `src/` directory: No (we'll use pages/)
- ❌ App Router: No (use Pages Router for easier migration)
- ❌ Import alias: No

### Step 2: Install Dependencies
```bash
npm install firebase sass
npm install @mailchimp/mailchimp_marketing nodemailer
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend
npm install lucide-react
npm install react-quill-new
npm install cloudinary

# Dev dependencies
npm install -D @types/nodemailer
```

### Step 3: Clean Up Default Files
```bash
# Remove unnecessary files
rm pages/api/hello.ts
rm styles/Home.module.css
```

---

## Phase 2: File Structure

### Create This Folder Structure
```
cp-website-nextjs/
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx (Home)
│   ├── services.tsx
│   ├── experience.tsx
│   ├── contact.tsx
│   ├── login.tsx
│   ├── blogs/
│   │   ├── index.tsx (Blog list)
│   │   └── [slug].tsx (Blog detail)
│   ├── admin/
│   │   ├── index.tsx
│   │   ├── blogs/
│   │   │   ├── index.tsx
│   │   │   ├── new.tsx
│   │   │   └── edit/[id].tsx
│   └── api/
│       ├── mailchimp-subscribe.ts
│       ├── send-blog-notification.ts
│       └── uploadImage.ts
├── components/
│   ├── header/
│   ├── footer/
│   ├── button/
│   ├── contactForm/
│   ├── admin/
│   └── ... (all your components)
├── contexts/
│   ├── user.context.tsx
│   ├── recaptcha.context.tsx
│   └── language.context.tsx
├── hooks/
│   ├── useBlogManagement.ts
│   └── ... (all your hooks)
├── utils/
│   └── firebase/
│       ├── config.ts
│       └── auth.ts
├── styles/
│   ├── globals.scss
│   └── ... (all your SCSS files)
├── public/
│   ├── images/
│   ├── data/
│   └── locales/
├── next.config.js
└── tsconfig.json
```

### Step 4: Create Folders
```bash
mkdir -p pages/blogs pages/admin/blogs/edit pages/api
mkdir -p components contexts hooks utils/firebase styles public/images public/data public/locales
```

---

## Phase 3: Configuration

### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // SCSS support
  sassOptions: {
    includePaths: ['./styles'],
  },

  // Environment variables (client-side)
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_AUTH_DOMAIN: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
    NEXT_PUBLIC_STORAGE_BUCKET: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    NEXT_PUBLIC_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID,
    NEXT_PUBLIC_MEASUREMENT_ID: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
    NEXT_PUBLIC_ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    NEXT_PUBLIC_RECAPTCHA_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_KEY,
  },

  // Image optimization
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // i18n configuration
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    localeDetection: true,
  },

  // Compression
  compress: true,

  // Power by header
  poweredByHeader: false,
}

module.exports = nextConfig
```

### `.env.local` (Create this file)
```bash
# Copy from your Netlify/current .env but change prefix
# Client-side variables (accessible in browser)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_PROJECT_ID=your_project
NEXT_PUBLIC_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_APP_ID=your_app_id
NEXT_PUBLIC_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_ADMIN_EMAIL=your_admin@email.com
NEXT_PUBLIC_RECAPTCHA_KEY=your_recaptcha_key

# Server-side only variables (NOT accessible in browser)
MAILCHIMP_API_KEY=your_mailchimp_key
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_LIST_ID=your_list_id
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
EMAIL_FROM=your_email
```

**IMPORTANT:** 
- Client variables: `NEXT_PUBLIC_*` prefix (accessible in browser)
- Server variables: No prefix (only in API routes)

### Update `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["components/*"],
      "@/contexts/*": ["contexts/*"],
      "@/hooks/*": ["hooks/*"],
      "@/utils/*": ["utils/*"],
      "@/styles/*": ["styles/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

---

## Phase 4: Component Migration

### Step 1: Copy Components (No Changes Needed)
```bash
# From your current project, copy these folders as-is:
cp -r ../cp_webSite/src/components/* ./components/
```

Most components work without changes! Just verify imports.

### Step 2: Update Import Paths in Components
Change from:
```typescript
// OLD (Vite)
import Button from '../../components/button/Button';
```

To:
```typescript
// NEW (Next.js with path aliases)
import Button from '@/components/button/Button';
```

**Search & Replace Tips:**
- Find: `from '../../components`
- Replace: `from '@/components`
- Find: `from '../../../utils`
- Replace: `from '@/utils`

### Step 3: Copy Contexts
```bash
cp -r ../cp_webSite/src/contexts/* ./contexts/
```

### Step 4: Copy Hooks
```bash
cp -r ../cp_webSite/src/hooks/* ./hooks/
```

### Step 5: Copy Utils
```bash
cp -r ../cp_webSite/src/utils/* ./utils/
```

### Step 6: Update Firebase Config
Edit `utils/firebase/config.ts`:

```typescript
// Change all import.meta.env to process.env.NEXT_PUBLIC_*
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};
```

### Step 7: Copy Styles
```bash
cp -r ../cp_webSite/src/styles/* ./styles/
mv ./styles/index.scss ./styles/globals.scss
```

---

## Phase 5: Routing & Pages

### `pages/_app.tsx` (Root Component)
```typescript
import type { AppProps } from 'next/app';
import { UserProvider } from '@/contexts/user.context';
import { RecaptchaProvider } from '@/contexts/recaptcha.context';
import { LanguageProvider } from '@/contexts/language.context';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import '@/styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <UserProvider>
        <RecaptchaProvider siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY || ''}>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </RecaptchaProvider>
      </UserProvider>
    </LanguageProvider>
  );
}

export default MyApp;
```

### `pages/_document.tsx` (HTML Document)
```typescript
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect hints */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://firebase.googleapis.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### `pages/index.tsx` (Home Page)
```typescript
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Home from '@/components/pages/Home/Home'; // Your existing Home component

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Camilo Pinzón - Frontend Developer</title>
        <meta name="description" content="Freelance front-end developer specializing in React, WordPress Expert." />
      </Head>
      <Home />
    </>
  );
}

// Static Generation - Pre-render at build time
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 3600, // Revalidate every hour
  };
};
```

### `pages/services.tsx`
```typescript
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Services from '@/components/pages/Services/Services';

export default function ServicesPage() {
  return (
    <>
      <Head>
        <title>Services - Camilo Pinzón</title>
        <meta name="description" content="Professional web development services" />
      </Head>
      <Services />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
```

### `pages/blogs/index.tsx` (Blog List - SSG)
```typescript
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/utils/firebase/config';
import BlogsList from '@/components/pages/Blogs/Blogs';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage?: string;
  publishedDate: string;
  // ... other fields
}

interface BlogsPageProps {
  blogs: BlogPost[];
}

export default function BlogsPage({ blogs }: BlogsPageProps) {
  return (
    <>
      <Head>
        <title>Blog - Camilo Pinzón</title>
        <meta name="description" content="Articles about web development, React, and more" />
      </Head>
      <BlogsList initialBlogs={blogs} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const blogsRef = collection(db, 'blogs');
    const q = query(
      blogsRef,
      where('publishedStatus', '==', 'published'),
      orderBy('publishedDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const blogs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedDate: doc.data().publishedDate?.toDate().toISOString() || new Date().toISOString(),
    }));

    return {
      props: {
        blogs,
      },
      revalidate: 60, // Revalidate every 60 seconds (ISR)
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {
      props: {
        blogs: [],
      },
      revalidate: 60,
    };
  }
};
```

### `pages/blogs/[slug].tsx` (Blog Detail - SSG with ISR)
```typescript
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase/config';
import BlogDetail from '@/components/pages/Blog/Blog';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  coverImage?: string;
  publishedDate: string;
  // ... other fields
}

interface BlogPageProps {
  blog: BlogPost;
}

export default function BlogPage({ blog }: BlogPageProps) {
  return (
    <>
      <Head>
        <title>{blog.title} - Camilo Pinzón</title>
        <meta name="description" content={blog.summary} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.summary} />
        {blog.coverImage && <meta property="og:image" content={blog.coverImage} />}
      </Head>
      <BlogDetail blog={blog} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, where('publishedStatus', '==', 'published'));
    const querySnapshot = await getDocs(q);
    
    const paths = querySnapshot.docs.map(doc => ({
      params: { slug: doc.data().slug },
    }));

    return {
      paths,
      fallback: 'blocking', // Generate pages on-demand if not pre-rendered
    };
  } catch (error) {
    console.error('Error generating paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, where('slug', '==', params?.slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        notFound: true,
      };
    }

    const blogDoc = querySnapshot.docs[0];
    const blog = {
      id: blogDoc.id,
      ...blogDoc.data(),
      publishedDate: blogDoc.data().publishedDate?.toDate().toISOString() || new Date().toISOString(),
    };

    return {
      props: {
        blog,
      },
      revalidate: 60, // ISR: Revalidate every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return {
      notFound: true,
    };
  }
};
```

### `pages/admin/index.tsx` (Admin - Client Side Only)
```typescript
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { UserContext } from '@/contexts/user.context';
import Admin from '@/components/pages/Admin/Admin';

export default function AdminPage() {
  const { currentUser, isAdmin, loading } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [currentUser, isAdmin, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Camilo Pinzón</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Admin />
    </>
  );
}
```

### Update Navigation Links
Change all `react-router-dom` Links to Next.js Links:

**OLD:**
```typescript
import { Link } from 'react-router-dom';

<Link to="/blogs">Blogs</Link>
```

**NEW:**
```typescript
import Link from 'next/link';

<Link href="/blogs">Blogs</Link>
```

### Update Navigation Hooks
**OLD:**
```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/blogs');
```

**NEW:**
```typescript
import { useRouter } from 'next/router';

const router = useRouter();
router.push('/blogs');
```

---

## Phase 6: API Routes

### `pages/api/mailchimp-subscribe.ts`
```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import mailchimp from '@mailchimp/mailchimp_marketing';
import nodemailer from 'nodemailer';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, firstName, lastName } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Copy your existing mailchimp-subscribe logic here
    // Just change the response format from Netlify to Next.js

    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_LIST_ID as string,
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName || 'New Subscriber',
          LNAME: lastName || '',
        },
        tags: ['newsletter'],
      }
    );

    // Your nodemailer logic here...

    return res.status(200).json({
      message: 'Successfully subscribed',
      id: response.id,
    });
  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({
      message: 'Error subscribing to newsletter',
      error: error.message,
    });
  }
}
```

### `pages/api/send-blog-notification.ts`
Copy your existing logic, just change:
- Remove `Handler` type from `@netlify/functions`
- Use `NextApiRequest` and `NextApiResponse` instead
- Change response format from Netlify to Next.js

### `pages/api/uploadImage.ts`
Same pattern - copy logic and adapt response format.

---

## Phase 7: SSR/SSG Implementation

### Key Concepts

**Static Site Generation (SSG)** - Best for:
- Home page
- About/Services
- Blog list
- Blog detail pages
- Experience page

```typescript
export const getStaticProps: GetStaticProps = async () => {
  // Fetch data at build time
  return {
    props: { data },
    revalidate: 60, // ISR: Regenerate every 60 seconds
  };
};
```

**Server-Side Rendering (SSR)** - Best for:
- User-specific content
- Real-time data
- Admin dashboard (or use client-side only)

```typescript
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data on every request
  return {
    props: { data },
  };
};
```

**Client-Side Only** - Best for:
- Admin panel
- Login page
- Interactive forms

```typescript
// No getStaticProps or getServerSideProps
// Just regular React component with useEffect
```

---

## Phase 8: Testing & Deployment

### Step 1: Test Locally
```bash
npm run dev
```

**Test Checklist:**
- [ ] Home page loads
- [ ] All pages accessible
- [ ] Navigation works
- [ ] Blog list shows posts
- [ ] Blog detail pages work
- [ ] Forms submit
- [ ] Login works
- [ ] Admin panel accessible
- [ ] Styles look correct
- [ ] Images load
- [ ] i18n works

### Step 2: Build for Production
```bash
npm run build
npm run start
```

Check for:
- [ ] No TypeScript errors
- [ ] No build errors
- [ ] All pages generate correctly
- [ ] Static files created

### Step 3: Deploy to Vercel

#### Option A: Via GitHub (Recommended)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repo
5. Configure:
   - Framework: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: (leave default)
6. Add Environment Variables (all from `.env.local`)
7. Click "Deploy"

#### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
# Follow prompts
```

### Step 4: Configure Domain
1. In Vercel dashboard → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### Step 5: Post-Deployment Testing
- [ ] Visit production URL
- [ ] Test all pages
- [ ] Test forms
- [ ] Test blog creation/editing
- [ ] Test newsletter signup
- [ ] Test contact form
- [ ] Check Google Analytics
- [ ] Check mobile responsiveness

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: "Cannot find module '@/components/...'"
**Solution:** Check `tsconfig.json` path aliases are configured correctly.

#### Issue: "window is not defined"
**Solution:** Wrap window-dependent code:
```typescript
if (typeof window !== 'undefined') {
  // window-dependent code
}
```

#### Issue: Firebase Auth not working
**Solution:** Make sure environment variables have `NEXT_PUBLIC_` prefix for client-side.

#### Issue: API routes not working
**Solution:** 
- Check `/pages/api/` folder location
- Verify environment variables (server-side don't need prefix)
- Check CORS if calling from external domain

#### Issue: Styles not loading
**Solution:** 
- Check import in `_app.tsx`
- Verify SCSS compilation in `next.config.js`

#### Issue: Build fails with Firestore errors
**Solution:** Add fallback data or error handling in `getStaticProps`

#### Issue: Blog pages show 404
**Solution:** Check `getStaticPaths` is returning correct slugs

---

## Performance Optimization Tips

### 1. Image Optimization
Use Next.js Image component:
```typescript
import Image from 'next/image';

<Image 
  src="/images/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // for above-the-fold images
/>
```

### 2. Code Splitting
Use dynamic imports for heavy components:
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### 3. Font Optimization
In `_document.tsx`:
```typescript
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### 4. ISR Configuration
For blog posts that update frequently:
```typescript
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { data },
    revalidate: 60, // Revalidate every minute
  };
};
```

For static pages:
```typescript
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { data },
    revalidate: 3600, // Revalidate every hour
  };
};
```

---

## Migration Checklist

### Pre-Migration
- [ ] Backup everything
- [ ] Document environment variables
- [ ] Create Git branch
- [ ] Set up Vercel account

### Setup
- [ ] Create Next.js project
- [ ] Install dependencies
- [ ] Configure `next.config.js`
- [ ] Set up `.env.local`
- [ ] Create folder structure

### Migration
- [ ] Copy components
- [ ] Copy contexts
- [ ] Copy hooks
- [ ] Copy utils
- [ ] Copy styles
- [ ] Update imports (path aliases)
- [ ] Update Firebase config
- [ ] Create pages
- [ ] Convert API routes
- [ ] Update navigation (Link, useRouter)
- [ ] Add SEO meta tags
- [ ] Implement SSG/SSR

### Testing
- [ ] Test locally
- [ ] Build for production
- [ ] Test all pages
- [ ] Test forms
- [ ] Test admin panel
- [ ] Test API routes

### Deployment
- [ ] Deploy to Vercel
- [ ] Add environment variables
- [ ] Configure domain
- [ ] Test production site
- [ ] Monitor for errors

### Post-Deployment
- [ ] Update documentation
- [ ] Monitor performance
- [ ] Check Google Search Console
- [ ] Verify analytics working

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Vercel Deployment](https://vercel.com/docs)
- [Next.js with Firebase](https://firebase.google.com/docs/hosting/nextjs)
- [Next.js with TypeScript](https://nextjs.org/docs/basic-features/typescript)

---

## Estimated Timeline

- **Setup & Configuration:** 1-2 hours
- **Component Migration:** 2-3 hours
- **Page Creation & Routing:** 3-4 hours
- **API Routes:** 1-2 hours
- **SSG/SSR Implementation:** 2-3 hours
- **Testing:** 2-3 hours
- **Deployment & Tweaking:** 1-2 hours

**Total: ~15-20 hours** (spread over several days)

---

## Need Help?

If you get stuck:
1. Check the Troubleshooting section
2. Review Next.js documentation
3. Check Vercel forums
4. Ask me for specific help!

Good luck with your migration! 🚀

