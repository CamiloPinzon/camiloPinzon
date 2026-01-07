# Next.js Migration - Quick Reference Guide

## 🔄 Common Code Changes

### Environment Variables
```typescript
// BEFORE (Vite)
import.meta.env.VITE_FIREBASE_API_KEY

// AFTER (Next.js)
process.env.NEXT_PUBLIC_FIREBASE_API_KEY  // Client-side
process.env.MAILCHIMP_API_KEY             // Server-side (API routes)
```

### Navigation
```typescript
// BEFORE (React Router)
import { Link, useNavigate, useLocation } from 'react-router-dom';

const navigate = useNavigate();
navigate('/blogs');

<Link to="/blogs">Blogs</Link>

// AFTER (Next.js)
import Link from 'next/link';
import { useRouter } from 'next/router';

const router = useRouter();
router.push('/blogs');

<Link href="/blogs">Blogs</Link>
```

### Import Paths
```typescript
// BEFORE
import Button from '../../components/button/Button';
import { db } from '../utils/firebase/config';

// AFTER (with path aliases)
import Button from '@/components/button/Button';
import { db } from '@/utils/firebase/config';
```

### Images
```typescript
// BEFORE
<img src="/images/logo.png" alt="Logo" />

// AFTER (optimized)
import Image from 'next/image';

<Image 
  src="/images/logo.png" 
  alt="Logo" 
  width={200} 
  height={100}
/>
```

### API Calls
```typescript
// BEFORE (Netlify Functions)
fetch('/.netlify/functions/mailchimp-subscribe', {
  method: 'POST',
  body: JSON.stringify(data),
});

// AFTER (Next.js API Routes)
fetch('/api/mailchimp-subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

### Meta Tags
```typescript
// BEFORE (React Helmet or manual)
<Helmet>
  <title>My Page</title>
</Helmet>

// AFTER (Next.js Head)
import Head from 'next/head';

<Head>
  <title>My Page</title>
  <meta name="description" content="..." />
</Head>
```

---

## 📁 File Mapping

| Current (Vite) | Next.js Equivalent |
|----------------|-------------------|
| `src/App.tsx` | `pages/_app.tsx` |
| `src/main.tsx` | `pages/_app.tsx` + `pages/_document.tsx` |
| `src/pages/Home/Home.tsx` | `pages/index.tsx` |
| `src/pages/Blogs/Blogs.tsx` | `pages/blogs/index.tsx` |
| `src/pages/Blog/Blog.tsx` | `pages/blogs/[slug].tsx` |
| `netlify/functions/*.ts` | `pages/api/*.ts` |
| `.env` | `.env.local` |
| `vite.config.ts` | `next.config.js` |

---

## 🎯 Page Types

### Static Page (SSG)
```typescript
// pages/services.tsx
export default function ServicesPage() {
  return <Services />;
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 3600, // ISR: 1 hour
  };
};
```

### Dynamic Page (SSG with paths)
```typescript
// pages/blogs/[slug].tsx
export const getStaticPaths: GetStaticPaths = async () => {
  // Get all blog slugs
  return {
    paths: [...],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Get blog by slug
  return {
    props: { blog },
    revalidate: 60,
  };
};
```

### Client-Side Only
```typescript
// pages/admin/index.tsx
export default function AdminPage() {
  // No getStaticProps or getServerSideProps
  // Use useEffect for data fetching
  return <Admin />;
}
```

---

## 🚀 Deployment Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Test production locally
npm run start

# Deploy to Vercel
vercel --prod
```

---

## 🔍 Debugging

### Check if running on server or client
```typescript
if (typeof window === 'undefined') {
  console.log('Running on server');
} else {
  console.log('Running on client');
}
```

### Access route parameters
```typescript
import { useRouter } from 'next/router';

const router = useRouter();
const { slug } = router.query; // From /blogs/[slug]
```

### Environment variable issues
```typescript
// Client-side: Must use NEXT_PUBLIC_ prefix
console.log(process.env.NEXT_PUBLIC_API_KEY);

// Server-side (API routes): No prefix needed
console.log(process.env.API_KEY);
```

---

## ⚡ Performance Tips

```typescript
// 1. Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('@/components/Heavy'));

// 2. Optimize images
import Image from 'next/image';

// 3. Prefetch links
<Link href="/blogs" prefetch>Blogs</Link>

// 4. ISR for frequently updated content
export const getStaticProps = async () => {
  return {
    props: {},
    revalidate: 60, // Regenerate every minute
  };
};
```

---

## 🐛 Common Errors & Fixes

### Error: "Cannot find module"
**Fix:** Check path aliases in `tsconfig.json`

### Error: "window is not defined"
**Fix:** Wrap in client-side check:
```typescript
if (typeof window !== 'undefined') {
  // window code here
}
```

### Error: "Hydration mismatch"
**Fix:** Ensure server and client render same HTML initially

### Error: "getStaticPaths is required"
**Fix:** Add getStaticPaths for dynamic routes like `[slug].tsx`

---

## 📝 Checklist Template

```markdown
### Page: ___________

- [ ] Created page file
- [ ] Added Head with title/meta
- [ ] Implemented getStaticProps/getServerSideProps
- [ ] Updated all Link components
- [ ] Updated all useNavigate to useRouter
- [ ] Updated import paths
- [ ] Updated env variables
- [ ] Tested locally
- [ ] Works in production build
```

---

## 🎓 Learning Resources

- **Official Docs:** https://nextjs.org/docs
- **Learn Course:** https://nextjs.org/learn
- **Examples:** https://github.com/vercel/next.js/tree/canary/examples
- **Discord:** https://discord.com/invite/bUG2bvbtHy

---

Good luck! 🚀

