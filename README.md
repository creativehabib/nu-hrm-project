# NU HRM (React + Supabase)

বাংলায় HRM ড্যাশবোর্ড, ডিপার্টমেন্ট, কর্মী, হাজিরা এবং ছুটি ব্যবস্থাপনা মডিউলসহ একটি স্টার্টার প্রজেক্ট।

## Feature highlights
- Department, employee, attendance management
- Leave management dashboard (bonus feature)
- Payroll run tracking (schema only)
- Supabase-ready schema and optional live data fetch

## Setup
1. `.env` ফাইলে Supabase কনফিগার করুন (একটি উদাহরণ নিচে)।
2. `supabase/schema.sql` ফাইলটি Supabase SQL editor এ রান করুন।
3. ডেভ সার্ভার চালান।

```bash
npm install
npm run dev
```

## Environment variables
`.env` ফাইলে যোগ করুন:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Pages
- Dashboard
- Departments
- Employees
- Attendance
- Leaves

