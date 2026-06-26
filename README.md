# Shiva Refresh 🌿

**Shiva Refresh** is a premium web application for a healthy refreshment cafe located in Tirupati, India. It offers certified organic refreshments, gym-friendly high-protein bowls, sugar-free smoothies, PCOS/hormonal wellness options for women, and artisan Middle-Eastern & traditional desserts (Kunafa, Malai, Brownies).

The website integrates a direct-to-WhatsApp order compiler and an operational Chef Dashboard to manage inventory and view simulated customer orders.

---

## 🌟 Key Features

### 1. Curated Health & Wellness Zones
- **Health Zone (Gym & Fitness)**: Meticulously designed high-protein salads, weight-loss/gain oatmeal bowls, and diabetic-safe options.
- **Women's Health Zone**: Specialized formulations (PCOS/PCOD friendly, cramp busters, and biotin-rich skin glow support) crafted with organic berries, spearmint, and seeds.
- **Organic Smoothies**: 100% natural, sugar-free fruit, dryfruit, and super-berry smoothies.
- **Delights & Traditional Bakes**: Layered pulpy fruit purées, slow-simmered Malai cups, and artisan vermicelli-nested Akkawi cheese Kunafas.

### 2. Zero-Login WhatsApp Ordering
- Customers can select multiple items to compile into a visual shopping cart.
- Cart checkout compiles the order details (product names, quantities, custom instructions, and estimated total) into a single pre-filled message and routes the client directly to the Chef's WhatsApp to complete delivery.

### 3. Administrative Chef Portal
- Fully integrated, passcode-protected administrative dashboard.
- **Passcode**: `6301` (Enter by clicking the Lock icon in the header).
- **Core Operations**:
    - **Operational Desk**: Dynamic analytics for revenue, pending queues, and category stock counts.
    - **Menu Catalogue CRUD**: Add, edit, or delete items, tweak prices/descriptions, and toggle live availability (in stock/sold out).
    - **Order Queue**: Track active incoming WhatsApp order streams and progress them from pending -> preparing -> delivered.

---

## 🛠️ Technical Stack
- **Framework**: React 19 (TypeScript)
- **Bundler & Server**: Vite 6
- **Styling**: Tailwind CSS v4 & custom animations
- **Icons**: Lucide React
- **Animations**: Framer Motion / Motion

---

## 💻 Local Development

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

3. **Check & Typecheck**:
   ```bash
   npm run lint
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```
