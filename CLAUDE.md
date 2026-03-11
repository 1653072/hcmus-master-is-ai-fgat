# Project: H-HFGAT Fashion Recommendation — Next.js Frontend

## Mô tả dự án
Frontend Next.js cho hệ thống gợi ý trang phục dựa trên paper:
"Hybrid-hierarchical fashion graph attention network for compatibility-oriented
and personalized outfit recommendation" (Saed & Teimourpour, 2026)

Model H-HFGAT đã được train sẵn. Backend Flask đang chạy tại http://localhost:5000.
Frontend này chỉ cần gọi API — KHÔNG cần tự chạy model.

---

## Tech Stack
- Framework : Next.js 14+ (App Router)
- Language  : TypeScript
- Styling   : Tailwind CSS
- Font      : Cormorant Garamond (heading) + DM Mono (body) — Google Fonts
- State     : React useState/useEffect (không dùng Redux/Zustand)
- HTTP      : fetch() native — không cài axios

---

## Backend API (Flask tại http://localhost:5000)

| Method | Endpoint                   | Response                                      |
|--------|----------------------------|-----------------------------------------------|
| GET    | /api/users                 | [{user_id, n_outfits}]                        |
| GET    | /api/user/:uid/history     | {user_id, history: [outfit]}                  |
| GET    | /api/recommend/:uid        | {user_id, recommendations: [outfit]}          |
| GET    | /api/categories            | [string]                                      |
| GET    | /api/items/:category       | [{item_id, category, title, image_url}]       |
| POST   | /api/fitb                  | body: {item_ids, target_category}             |
|        |                            | response: {results: [item]}                   |

### Outfit object shape
```ts
interface Outfit {
  outfit_id: number
  score?: number
  items: Array<{
    item_id: number
    category: string
    title: string
    image_url?: string
  }>
}
```

### Item object shape
```ts
interface Item {
  item_id: number
  category: string
  title: string
  image_url?: string
  score?: number
}
```

---

## Cấu trúc thư mục (tuân thủ nghiêm ngặt)
```
src/
├── app/
│   ├── layout.tsx          ← font import + global wrapper
│   ├── page.tsx            ← trang chính (redirect về /recommend)
│   ├── recommend/
│   │   └── page.tsx        ← Tab 1: Top-K Recommendation
│   └── fitb/
│       └── page.tsx        ← Tab 2: Fill-in-the-Blank
├── components/
│   ├── NavBar.tsx          ← header + tab navigation
│   ├── UserCard.tsx        ← card hiển thị 1 user
│   ├── UserGrid.tsx        ← grid 100 users
│   ├── OutfitCard.tsx      ← card hiển thị 1 outfit + items
│   ├── OutfitGrid.tsx      ← grid các outfit cards
│   ├── CategorySelect.tsx  ← dropdown chọn category
│   ├── ItemSelector.tsx    ← list chọn item trong category
│   └── FitbResultItem.tsx  ← 1 dòng kết quả FITB
├── hooks/
│   ├── useUsers.ts         ← fetch /api/users
│   ├── useRecommend.ts     ← fetch /api/recommend/:uid
│   ├── useHistory.ts       ← fetch /api/user/:uid/history
│   └── useFitb.ts          ← POST /api/fitb
└── lib/
    ├── api.ts              ← tất cả fetch functions
    └── types.ts            ← tất cả TypeScript interfaces
```

---

## Design System (KHÔNG được thay đổi)
```css
--bg       : #0a0a0a   /* đen sâu */
--surface  : #111111
--surface2 : #161616
--border   : #1e1e1e
--accent   : #c8a96e   /* vàng gold — màu chủ đạo */
--accent2  : #e8d5a8
--text     : #e8e4de
--muted    : #444444
--green    : #7ec8a0   /* score tốt */
```
Tất cả màu dùng CSS variable, khai báo trong globals.css.
Tất cả component dùng dark theme. KHÔNG dùng light mode.

### Category → màu (dùng nhất quán)
```ts
const CAT_COLORS: Record<string, string> = {
  tops        : '#e8a87c',
  bottoms     : '#7ab3d4',
  shoes       : '#7ec8a0',
  bags        : '#c98ddb',
  accessories : '#e87c7c',
  outerwear   : '#d4c87a',
  dresses     : '#8dd4c8',
  knitwear    : '#d48da0',
}
```
Đặt file này tại `src/lib/constants.ts`.

---

## Quy tắc code bắt buộc
1. Mỗi component một file — KHÔNG viết nhiều component trong 1 file
2. Dùng `'use client'` chỉ khi component có state/effect
3. API calls chỉ trong `src/lib/api.ts` — KHÔNG fetch trực tiếp trong component
4. Loading state: dùng skeleton placeholder, KHÔNG dùng spinner text
5. Error state: hiển thị message rõ ràng, không để crash
6. KHÔNG dùng `any` trong TypeScript
7. Tất cả interface export từ `src/lib/types.ts`

---

## next.config.ts — cần có để proxy API
```ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ]
  },
}
export default nextConfig
```
Không cần CORS khi đã có rewrite này.

---

## Thứ tự build (QUAN TRỌNG — làm theo đúng thứ tự này)
1. `src/lib/types.ts`        — interfaces trước
2. `src/lib/constants.ts`    — colors, categories
3. `src/lib/api.ts`          — fetch functions
4. `next.config.ts`          — proxy rewrite
5. `src/app/globals.css`     — CSS variables + base styles
6. `src/app/layout.tsx`      — font + wrapper
7. `src/components/NavBar.tsx`
8. `src/components/UserCard.tsx` + `UserGrid.tsx`
9. `src/components/OutfitCard.tsx` + `OutfitGrid.tsx`
10. `src/app/recommend/page.tsx`
11. `src/components/CategorySelect.tsx` + `ItemSelector.tsx` + `FitbResultItem.tsx`
12. `src/app/fitb/page.tsx`
13. `src/app/page.tsx`       — redirect về /recommend
