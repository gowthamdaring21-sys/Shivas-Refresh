import React, { useState, useMemo } from "react";
import {
  Clock,
  Phone,
  MapPin,
  Instagram,
  ShoppingBag,
  ChefHat,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  Undo,
  Check,
  X,
  Search,
  Lock,
  Activity,
  Sparkles,
  Heart,
  TrendingUp,
  DollarSign,
  PlusCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { Product } from "../types";

export interface SimulatedOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  items: { productName: string; price: number; quantity: number }[];
  totalPrice: number;
  status: "pending" | "preparing" | "delivered" | "cancelled";
  timestamp: string;
  specialInstructions?: string;
  location?: string;
}

interface AdminDashboardProps {
  products: Product[];
  onSaveProducts: (products: Product[]) => void;
  categories: { id: string; name: string; description: string; iconName: string }[];
  businessInfo: {
    ownerName: string;
    ownerTitle: string;
    ownerBio: string;
    aboutParagraphs: string[];
    ownerImage: string;
    shopAddress: string;
    shopPhone: string;
    shopWhatsApp: string;
    instagramLink: string;
    instagramHandle: string;
    openingHours: string;
    mapsEmbedUrl: string;
  };
  onSaveBusiness: (info: any) => void;
  orders: SimulatedOrder[];
  onSaveOrders: (orders: SimulatedOrder[]) => void;
  onBack: () => void;
}

// Preset product image URLs for addition
const PRESET_IMAGES = [
  { url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=500&q=80", label: "Super Nut Blend" },
  { url: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=500&q=80", label: "Dragon Fruit Pitaya" },
  { url: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=500&q=80", label: "Pesticide-Free Green Kiwi" },
  { url: "https://images.unsplash.com/photo-1505252585461-04db1ebb846d?auto=format&fit=crop&w=500&q=80", label: "Cashew Butter Shake" },
  { url: "https://images.unsplash.com/photo-1579954115545-a95591f28bec?auto=format&fit=crop&w=500&q=80", label: "Date & Almond Saffron" },
  { url: "https://images.unsplash.com/photo-1628557102937-b59333a92ce3?auto=format&fit=crop&w=500&q=80", label: "Pineapple Citrus breeze" },
  { url: "https://images.unsplash.com/photo-1624462966581-bc6d768cbce5?auto=format&fit=crop&w=500&q=80", label: "Pomegranate Pearl Booster" },
  { url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=500&q=80", label: "Salad Green Harvest" }
];

export default function AdminDashboard({
  products,
  onSaveProducts,
  categories,
  businessInfo,
  onSaveBusiness,
  orders,
  onSaveOrders,
  onBack
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "menu" | "orders" | "settings">("overview");

  // Filter and search menu state
  const [menuSearch, setMenuSearch] = useState("");
  const [menuFilterCategory, setMenuFilterCategory] = useState("all");

  // Add / Edit Product modal States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // Form Field States (Add/Edit Product)
  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState(129);
  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formCalories, setFormCalories] = useState<number | undefined>(undefined);
  const [formServingSize, setFormServingSize] = useState("250ml");

  // Badges checkboxes
  const [isSugarFree, setIsSugarFree] = useState(false);
  const [isPcodFriendly, setIsPcodFriendly] = useState(false);
  const [isHighProtein, setIsHighProtein] = useState(false);
  const [isGymFriendly, setIsGymFriendly] = useState(false);
  const [isDiabeticFriendly, setIsDiabeticFriendly] = useState(false);
  const [isMostOrdered, setIsMostOrdered] = useState(false);

  // Out of stock product list
  const [soldOutIds, setSoldOutIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("shiva_refresh_soldout_ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveSoldOutIds = (updated: string[]) => {
    setSoldOutIds(updated);
    try {
      localStorage.setItem("shiva_refresh_soldout_ids", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Business settings fields state
  const [settingsOwnerName, setSettingsOwnerName] = useState(businessInfo.ownerName);
  const [settingsOwnerTitle, setSettingsOwnerTitle] = useState(businessInfo.ownerTitle);
  const [settingsOwnerBio, setSettingsOwnerBio] = useState(businessInfo.ownerBio);
  const [settingsShopAddress, setSettingsShopAddress] = useState(businessInfo.shopAddress);
  const [settingsShopPhone, setSettingsShopPhone] = useState(businessInfo.shopPhone);
  const [settingsShopWhatsApp, setSettingsShopWhatsApp] = useState(businessInfo.shopWhatsApp);
  const [settingsInstagramLink, setSettingsInstagramLink] = useState(businessInfo.instagramLink);
  const [settingsInstagramHandle, setSettingsInstagramHandle] = useState(businessInfo.instagramHandle);
  const [settingsOpeningHours, setSettingsOpeningHours] = useState(businessInfo.openingHours);

  // Stats Counters
  const stats = useMemo(() => {
    const totalSales = orders
      .filter((o) => o.status === "delivered" || o.status === "preparing" || o.status === "pending")
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const pendingCount = orders.filter((o) => o.status === "pending").length;
    const activeCount = orders.filter((o) => o.status === "preparing").length;

    const itemsCount = products.length;

    // Category calculation
    const categoryEarnings: Record<string, number> = {};
    orders
      .filter((o) => o.status === "delivered" || o.status === "preparing" || o.status === "pending")
      .forEach((o) => {
        o.items.forEach((item) => {
          categoryEarnings[item.productName] = (categoryEarnings[item.productName] || 0) + item.price * item.quantity;
        });
      });

    return {
      totalSales,
      pendingCount,
      activeCount,
      itemsCount,
      avgOrderValue: orders.length > 0 ? Math.round(totalSales / orders.length) : 0
    };
  }, [orders, products]);

  // Open Edit Dialog
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsAddMode(false);
    setFormId(p.id);
    setFormName(p.name);
    setFormPrice(p.price);
    setFormCategory(p.category);
    setFormDescription(p.description);
    setFormImage(p.image);
    setFormCalories(p.calories);
    setFormServingSize(p.servingSize || "250ml");

    setIsSugarFree(p.isSugarFree || false);
    setIsPcodFriendly(p.isPcodFriendly || false);
    setIsHighProtein(p.isHighProtein || false);
    setIsGymFriendly(p.isGymFriendly || false);
    setIsDiabeticFriendly(p.isDiabeticFriendly || false);
    setIsMostOrdered(p.isMostOrdered || false);
  };

  // Open Add Dialog
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsAddMode(true);
    setFormId("p-" + Date.now());
    setFormName("");
    setFormPrice(129);
    setFormCategory(categories[0]?.id || "health-zone");
    setFormDescription("");
    setFormImage(PRESET_IMAGES[0].url);
    setFormCalories(160);
    setFormServingSize("250ml");

    setIsSugarFree(false);
    setIsPcodFriendly(false);
    setIsHighProtein(false);
    setIsGymFriendly(false);
    setIsDiabeticFriendly(false);
    setIsMostOrdered(false);
  };

  // Save changes to menu
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDescription.trim()) {
      alert("Please provide a name and description");
      return;
    }

    const compiledProduct: Product = {
      id: formId,
      name: formName,
      price: Number(formPrice),
      category: formCategory,
      description: formDescription,
      image: formImage,
      calories: formCalories ? Number(formCalories) : undefined,
      servingSize: formServingSize,
      isSugarFree,
      isPcodFriendly,
      isHighProtein,
      isGymFriendly,
      isDiabeticFriendly,
      isMostOrdered
    };

    if (isAddMode) {
      onSaveProducts([compiledProduct, ...products]);
    } else {
      onSaveProducts(products.map((p) => (p.id === formId ? compiledProduct : p)));
    }

    // Reset modals
    setEditingProduct(null);
    setIsAddMode(false);
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onSaveProducts(products.filter((p) => p.id !== productId));
    }
  };

  // Toggle availability of product
  const handleToggleStock = (productId: string) => {
    if (soldOutIds.includes(productId)) {
      saveSoldOutIds(soldOutIds.filter((id) => id !== productId));
    } else {
      saveSoldOutIds([...soldOutIds, productId]);
    }
  };

  // Handle Order status updates
  const handleUpdateOrderStatus = (orderId: string, status: "pending" | "preparing" | "delivered" | "cancelled") => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    onSaveOrders(updated);
  };

  // Save Store/Business settings
  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedBusiness = {
      ...businessInfo,
      ownerName: settingsOwnerName,
      ownerTitle: settingsOwnerTitle,
      ownerBio: settingsOwnerBio,
      shopAddress: settingsShopAddress,
      shopPhone: settingsShopPhone,
      shopWhatsApp: settingsShopWhatsApp,
      instagramLink: settingsInstagramLink,
      instagramHandle: settingsInstagramHandle,
      openingHours: settingsOpeningHours
    };
    onSaveBusiness(updatedBusiness);
    alert("Store Profile settings successfully updated!");
  };

  // Create simulated incoming WhatsApp pre-order sandbox
  const handleInjectOrder = () => {
    const randomCustomers = [
      { name: "Srinadh Guptha", phone: "+91 93041 20431", loc: "Sri Padmavati Gym Center, Tirupati" },
      { name: "Vaishnavi Patel", phone: "+91 81231 99042", loc: "Women Mahila University Hostel block-3" },
      { name: "Ramesh Chanda", phone: "+91 94391 10045", loc: "Balaji Residency Apt, Tirupati" },
      { name: "Gowtham Dev", phone: "+91 76221 00542", loc: "Tirupati Fitness Palace" }
    ];

    const customer = randomCustomers[Math.floor(Math.random() * randomCustomers.length)];
    const itemCountRange = Math.floor(Math.random() * 2) + 1; // 1 to 2 random products

    const orderItems: { productName: string; price: number; quantity: number }[] = [];
    let totalPrice = 0;

    for (let i = 0; i < itemCountRange; i++) {
      const randProd = products[Math.floor(Math.random() * products.length)];
      if (!orderItems.some((item) => item.productName === randProd.name)) {
        const qty = Math.floor(Math.random() * 2) + 1;
        orderItems.push({
          productName: randProd.name,
          price: randProd.price,
          quantity: qty
        });
        totalPrice += randProd.price * qty;
      }
    }

    const newSimOrder: SimulatedOrder = {
      id: "SR-" + (8100 + orders.length + 1),
      customerName: customer.name,
      customerPhone: customer.phone,
      items: orderItems,
      totalPrice,
      status: "pending",
      timestamp: "Just Now",
      specialInstructions: "Delivery via local bike. Squeeze fresh fruit properly.",
      location: customer.loc
    };

    onSaveOrders([newSimOrder, ...orders]);
  };

  // Clean matched products based on Admin dashboard filters
  const processedProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(menuSearch.toLowerCase()) || p.description.toLowerCase().includes(menuSearch.toLowerCase());
      const matchesCategory = menuFilterCategory === "all" || p.category === menuFilterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, menuSearch, menuFilterCategory]);

  return (
    <div className="min-h-screen bg-[#061813] text-stone-100 font-sans flex flex-col md:flex-row pb-16 md:pb-0">
      
      {/* Sidebar Navigation Panel */}
      <aside className="w-full md:w-64 bg-[#03110E] border-r border-[#0D2d20] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Brand info */}
          <div className="p-6 border-b border-[#0D2d20] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-[#0DFF92]/10 text-[#0DFF92] p-2 rounded-xl">
                <ChefHat className="w-5 h-5 text-[#0DFF92]" />
              </div>
              <span className="text-sm font-manrope font-extrabold tracking-wider text-stone-100 uppercase">
                Chef's Panel
              </span>
            </div>
            <button
              onClick={onBack}
              className="text-stone-400 hover:text-[#0DFF92] p-1 rounded-lg text-xs font-mono border border-stone-800 hover:border-[#0DFF92]/35 transition-all cursor-pointer"
            >
              Exit
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left p-3 rounded-xl text-xs font-manrope font-extrabold flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#0DFF92]/10 text-[#0DFF92] border border-[#0DFF92]/20"
                  : "text-stone-400 hover:bg-stone-900/40 hover:text-stone-200 border border-transparent"
              }`}
            >
              <Activity className="w-4 h-4" />
              Operational Desk
            </button>

            <button
              onClick={() => setActiveTab("menu")}
              className={`w-full text-left p-3 rounded-xl text-xs font-manrope font-extrabold flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === "menu"
                  ? "bg-[#0DFF92]/10 text-[#0DFF92] border border-[#0DFF92]/20"
                  : "text-stone-400 hover:bg-stone-900/40 hover:text-stone-200 border border-transparent"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Manage Menu Menu ({products.length})
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left p-3 rounded-xl text-xs font-manrope font-extrabold flex items-center gap-3 transition-all relative cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#0DFF92]/10 text-[#0DFF92] border border-[#0DFF92]/20"
                  : "text-stone-400 hover:bg-stone-900/40 hover:text-stone-200 border border-transparent"
              }`}
            >
              <Clock className="w-4 h-4" />
              Order Simulator Queue
              {orders.filter((o) => o.status === "pending" || o.status === "preparing").length > 0 && (
                <span className="absolute right-3 top-3 bg-amber-500 text-[#061813] text-[9px] px-1.5 py-0.5 rounded-full font-black">
                  {orders.filter((o) => o.status === "pending" || o.status === "preparing").length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left p-3 rounded-xl text-xs font-manrope font-extrabold flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-[#0DFF92]/10 text-[#0DFF92] border border-[#0DFF92]/20"
                  : "text-stone-400 hover:bg-stone-900/40 hover:text-stone-200 border border-transparent"
              }`}
            >
              <Settings className="w-4 h-4" />
              Store Settings
            </button>
          </nav>
        </div>

        {/* Cafe summary info at footer of sidebar */}
        <div className="p-4 border-t border-[#0D2d20] hidden md:block text-[11px] text-stone-500">
          <p className="font-extrabold text-[#0DFF92]/85 uppercase tracking-wide">Shiva Refresh</p>
          <p className="mt-1 font-mono text-[9px] leading-relaxed">
            Local Tirupati Cafe Ingress <br />
            Status: Active <br />
            Integrity: Balanced
          </p>
        </div>
      </aside>

      {/* Main Panel Area */}
      <main className="flex-1 min-w-0 p-6 md:p-10 flex flex-col overflow-y-auto">
        
        {/* Tab 1: Operational Overview Analytics */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-8 animate-fade-in text-left">
            <div>
              <span className="text-[#0DFF92] font-mono text-xs uppercase tracking-widest font-black">Control Station</span>
              <h1 className="text-2xl sm:text-3xl font-manrope font-black text-stone-100 tracking-tight mt-1">
                Operational Overview
              </h1>
              <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
                Real-time cafe analytics stream for Shiva Refresh. Track simulated orders, cumulative revenue trends, and menu inventory stats.
              </p>
            </div>

            {/* Quick Stats Bento Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Stat 1 */}
              <div className="bg-[#03110E] p-6 rounded-2xl border border-[#0D2d20] flex flex-col gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#0DFF92]" /> Revenue (WhatsApp)
                </span>
                <span className="text-xl sm:text-2xl font-manrope font-black text-stone-100">
                  ₹{stats.totalSales}
                </span>
                <span className="text-[9px] font-mono text-emerald-400">
                  ▲ 14% vs Last Session
                </span>
              </div>

              {/* Stat 2 */}
              <div className="bg-[#03110E] p-6 rounded-2xl border border-[#0D2d20] flex flex-col gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Pending Orders
                </span>
                <span className="text-xl sm:text-2xl font-manrope font-black text-stone-100">
                  {stats.pendingCount + stats.activeCount}
                </span>
                <span className="text-[9px] font-mono text-stone-500">
                  {stats.pendingCount} cooking pending
                </span>
              </div>

              {/* Stat 3 */}
              <div className="bg-[#03110E] p-6 rounded-2xl border border-[#0D2d20] flex flex-col gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-400" /> Active Catalog
                </span>
                <span className="text-xl sm:text-2xl font-manrope font-black text-stone-100">
                  {stats.itemsCount} Items
                </span>
                <span className="text-[9px] font-mono text-sky-400">
                  {soldOutIds.length} currently sold out
                </span>
              </div>

              {/* Stat 4 */}
              <div className="bg-[#03110E] p-6 rounded-2xl border border-[#0D2d20] flex flex-col gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-400" /> Avg Basket Value
                </span>
                <span className="text-xl sm:text-2xl font-manrope font-black text-[#0DFF92]">
                  ₹{stats.avgOrderValue}
                </span>
                <span className="text-[9px] font-mono text-rose-400">
                  ★ High health engagement
                </span>
              </div>

            </div>

            {/* Simulated graph & category chart bento blocks */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Daily Sales Chart Layout */}
              <div className="lg:col-span-8 bg-[#03110E] p-6 rounded-2xl border border-[#0D2d20] flex flex-col justify-between">
                <div>
                  <h3 className="font-manrope font-extrabold text-sm uppercase tracking-wide text-[#0DFF92]">
                    Simulated Volume Curve
                  </h3>
                  <span className="text-[11px] text-stone-500 font-mono">Daily volume metrics for order dispatch checks</span>
                </div>

                {/* Hand crafted customizable elegant SVG graph drawing */}
                <div className="h-48 mt-6 flex items-center justify-center relative">
                  <svg className="w-full h-full" viewBox="0 0 500 150">
                    <defs>
                      <linearGradient id="glow-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0DFF92" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#0DFF92" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid lines */}
                    <line x1="10" y1="20" x2="490" y2="20" stroke="#0D2D20" strokeDasharray="3,3" />
                    <line x1="10" y1="70" x2="490" y2="70" stroke="#0D2D20" strokeDasharray="3,3" />
                    <line x1="10" y1="120" x2="490" y2="120" stroke="#0D2D20" strokeDasharray="3,3" />

                    {/* Shading Area bottom */}
                    <path
                      d="M 10 130 Q 80 80 150 110 T 300 40 T 450 60 L 450 140 L 10 140 Z"
                      fill="url(#glow-grad)"
                    />

                    {/* Line Plot */}
                    <path
                      d="M 10 130 Q 80 80 150 110 T 300 40 T 450 60"
                      fill="none"
                      stroke="#0DFF92"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Chart Dots */}
                    <circle cx="10" cy="130" r="5" fill="#061813" stroke="#0DFF92" strokeWidth="2" />
                    <circle cx="110" cy="95" r="5" fill="#061813" stroke="#0DFF92" strokeWidth="2" />
                    <circle cx="215" cy="80" r="5" fill="#061813" stroke="#0DFF92" strokeWidth="2" />
                    <circle cx="330" cy="42" r="5" fill="#061813" stroke="#0DFF92" strokeWidth="2" />
                    <circle cx="450" cy="60" r="5" fill="#061813" stroke="#0DFF92" strokeWidth="2" />
                  </svg>
                </div>

                <div className="flex justify-between border-t border-[#0D2d20] pt-4 mt-2 text-[10px] text-stone-500 font-mono">
                  <span>06:00 AM</span>
                  <span>10:00 AM</span>
                  <span>02:00 PM</span>
                  <span>06:00 PM</span>
                  <span>11:00 PM (Close)</span>
                </div>
              </div>

              {/* Category Breakdown side block */}
              <div className="lg:col-span-4 bg-[#03110E] p-6 rounded-2xl border border-[#0D2d20] flex flex-col justify-between">
                <div>
                  <h3 className="font-manrope font-extrabold text-sm uppercase tracking-wide text-stone-200">
                    Category Stock Level
                  </h3>
                  <span className="text-[11px] text-stone-500 font-mono">Count of menu items in each family</span>
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  {categories.map((cat, idx) => {
                    const count = products.filter((p) => p.category === cat.id).length;
                    const matchSoldOut = products.filter((p) => p.category === cat.id && soldOutIds.includes(p.id)).length;
                    const percent = Math.min(100, Math.round((count / Math.max(1, products.length)) * 250));
                    
                    return (
                      <div key={`${cat.id}-${idx}`} className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-stone-300 font-extrabold uppercase">{cat.name}</span>
                          <span className="text-stone-500">{count} item{count !== 1 ? 's' : ''} <span className="text-red-400">({matchSoldOut} out)</span></span>
                        </div>
                        <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Quick simulation order alerts stream */}
            <div className="bg-[#03110E] rounded-2xl border border-[#0D2d20] p-6">
              <div className="flex justify-between items-center border-b border-[#0D2d20] pb-4 mb-4">
                <div>
                  <h3 className="font-manrope font-extrabold text-sm uppercase tracking-wide text-[#0DFF92] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Direct Action Order Queue
                  </h3>
                  <p className="text-[11px] text-stone-500 font-mono">Simulate cooking progress for outstanding requests</p>
                </div>
                <button
                  onClick={handleInjectOrder}
                  className="bg-emerald-500 hover:bg-emerald-400 text-[#061813] text-xs font-manrope font-extrabold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Inject Preset Order
                </button>
              </div>

              {orders.filter(o => o.status === "pending" || o.status === "preparing").length === 0 ? (
                <div className="text-center py-8 text-xs font-sans text-stone-500">
                  ✓ Excellent! No active pending orders in queue. Tweak existing orders status via the "Order Simulator Queue" tab, or click "Inject Preset Order" to sandbox test!
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {orders.filter(o => o.status === "pending" || o.status === "preparing").slice(0, 3).map((ord, idx) => (
                    <div key={`${ord.id}-${idx}`} className="bg-[#061813] p-4 rounded-xl border border-[#0D2d20] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-sans">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-[#0DFF92]">{ord.id}</span>
                          <span className="font-extrabold text-[#0DFF92]">{ord.customerName}</span>
                          <span className="text-stone-500 text-[10px] font-mono">({ord.timestamp})</span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-1">
                          {ord.items.map(item => `${item.quantity}x ${item.productName}`).join(", ")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-[11px] text-amber-500 font-extrabold border border-amber-500/25 px-2 py-0.5 rounded uppercase">
                          {ord.status}
                        </span>

                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, ord.status === "pending" ? "preparing" : "delivered")}
                          className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg font-black font-manrope text-[11px] transition-all cursor-pointer"
                        >
                          {ord.status === "pending" ? "Start Preparing" : "Complete Cooking ✓"}
                        </button>
                        
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, "cancelled")}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-1 rounded-lg font-mono text-[10px] transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                  {orders.filter(o => o.status === "pending" || o.status === "preparing").length > 3 && (
                    <button 
                      onClick={() => setActiveTab("orders")}
                      className="text-stone-400 font-extrabold text-[11px] hover:text-[#0DFF92] mt-1 transition-colors text-left"
                    >
                      View All Active Pending Orders (+ {orders.filter(o => o.status === "pending" || o.status === "preparing").length - 3} more) →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Menu Catalogue CRUD */}
        {activeTab === "menu" && (
          <div className="flex flex-col gap-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[#0DFF92] font-mono text-xs uppercase tracking-widest font-black">Core Inventory</span>
                <h1 className="text-2xl sm:text-3xl font-manrope font-black text-stone-100 tracking-tight mt-1">
                  Menu Catalogue Manager
                </h1>
                <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
                  Real-time stock toggles, customization tags (pcod/sugar-free), prices, and creation panel. Changes instantly save to LocalStorage and reflect across entire user-facing storefront.
                </p>
              </div>

              <button
                onClick={handleOpenAdd}
                className="bg-emerald-500 hover:bg-emerald-400 text-[#061813] text-xs font-manrope font-black px-4 py-2.5 rounded-full transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer self-start sm:self-center"
              >
                <Plus className="w-4 h-4 text-stone-900 stroke-[3px]" />
                Add New Product
              </button>
            </div>

            {/* Menu Search Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 bg-[#03110E] p-4 rounded-xl border border-[#0D2d20] justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  placeholder="Search item name, descriptions..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full bg-[#061813] border border-[#0D2d20] focus:border-[#0DFF92]/50 text-stone-100 pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none"
                />
              </div>

              {/* Category selector */}
              <div className="flex gap-2 items-center overflow-x-auto select-none no-scrollbar">
                <button
                  onClick={() => setMenuFilterCategory("all")}
                  className={`text-[10px] font-manrope font-black truncate uppercase px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    menuFilterCategory === "all"
                      ? "bg-[#0DFF92]/10 border-[#0DFF92]/40 text-[#0DFF92]"
                      : "bg-[#061813] border-[#0D2d20] text-stone-400 hover:text-stone-300"
                  }`}
                >
                  All Category
                </button>
                {categories.map((cat, idx) => (
                  <button
                    key={`${cat.id}-${idx}`}
                    onClick={() => setMenuFilterCategory(cat.id)}
                    className={`text-[10px] font-manrope font-black truncate uppercase px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      menuFilterCategory === cat.id
                        ? "bg-[#0DFF92]/10 border-[#0DFF92]/40 text-[#0DFF92]"
                        : "bg-[#061813] border-[#0D2d20] text-stone-400 hover:text-stone-300"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid Table */}
            <div className="bg-[#03110E] rounded-2xl border border-[#0D2d20] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  
                  {/* Table Header */}
                  <thead>
                    <tr className="border-b border-[#0D2d20] text-stone-400 font-mono uppercase bg-[#051713]/50">
                      <th className="py-4 px-6 font-bold">Product Info</th>
                      <th className="py-4 px-4 font-bold">Category</th>
                      <th className="py-4 px-4 font-bold text-right">Price</th>
                      <th className="py-4 px-4 font-bold text-center">Attributes</th>
                      <th className="py-4 px-4 font-bold text-center">Availability</th>
                      <th className="py-4 px-6 font-bold text-center">Operations</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {processedProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-stone-500 font-sans font-extrabold text-sm">
                          No matching items found in live catalog. Modify search criteria.
                        </td>
                      </tr>
                    ) : (
                      processedProducts.map((p, idx) => {
                        const isSoldOut = soldOutIds.includes(p.id);
                        return (
                          <tr key={`${p.id}-${idx}`} className="border-b border-stone-800/25 hover:bg-[#051713]/25 transition-colors font-sans">
                            
                            {/* Product Info */}
                            <td className="py-4 px-6 flex items-center gap-3 min-w-[280px]">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-10 h-10 object-cover rounded-lg border border-[#0D2d20] bg-stone-900"
                              />
                              <div className="min-w-0">
                                <span className={`font-manrope font-extrabold text-stone-100 ${isSoldOut ? 'line-through text-stone-500' : ''}`}>
                                  {p.name}
                                </span>
                                <p className="text-[10px] text-stone-500 truncate max-w-xs mt-0.5" title={p.description}>
                                  {p.description}
                                </p>
                              </div>
                            </td>

                            {/* Category Label */}
                            <td className="py-4 px-4 uppercase font-mono text-[10px] text-stone-400 font-black">
                              {categories.find((c) => c.id === p.category)?.name || p.category}
                            </td>

                            {/* Price */}
                            <td className="py-4 px-4 text-right font-manrope font-black text-stone-100 min-w-[80px]">
                              ₹{p.price}
                            </td>

                            {/* Badges/Attributes */}
                            <td className="py-4 px-4">
                              <div className="flex flex-wrap gap-1 justify-center max-w-[150px] mx-auto select-none">
                                {p.isSugarFree && <span className="text-[8px] font-mono bg-lime-500/10 text-lime-400 border border-lime-500/20 px-1 py-0.5 rounded tracking-tighter cursor-help" title="Sugar Free">SF</span>}
                                {p.isPcodFriendly && <span className="text-[8px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1 py-0.5 rounded tracking-tighter cursor-help" title="PCO/PCOD Special">PCOS</span>}
                                {p.isHighProtein && <span className="text-[8px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1 py-0.5 rounded tracking-tighter cursor-help" title="High Protein">PRO</span>}
                                {p.isGymFriendly && <span className="text-[8px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1 py-0.5 rounded tracking-tighter cursor-help" title="Gym-friendly">GYM</span>}
                                {p.isDiabeticFriendly && <span className="text-[8px] font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20 px-1 py-0.5 rounded tracking-tighter cursor-help" title="Diabetic-friendly">DIA</span>}
                                {p.isMostOrdered && <span className="text-[8px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 py-0.5 rounded tracking-tighter cursor-help" title="Most Ordered Sensation">BEST</span>}
                              </div>
                            </td>

                            {/* Stock Toggle operations */}
                            <td className="py-4 px-4 text-center">
                              <button
                                onClick={() => handleToggleStock(p.id)}
                                className={`text-[10px] font-manrope font-black uppercase px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                                  isSoldOut
                                    ? "bg-red-500/10 border-red-500/35 text-red-400"
                                    : "bg-emerald-500/10 border-emerald-500/35 text-emerald-400"
                                }`}
                              >
                                {isSoldOut ? "● Sold Out" : "● In Stock"}
                              </button>
                            </td>

                            {/* Edit & Delete Buttons */}
                            <td className="py-4 px-6 text-center min-w-[140px]">
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => handleOpenEdit(p)}
                                  className="p-1.5 bg-stone-800 hover:text-[#0DFF92] transition-colors border border-stone-700 hover:border-[#0DFF92]/25 rounded-md cursor-pointer"
                                  title="Edit general product attributes"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-1.5 bg-red-900/20 text-red-400 hover:text-red-300 transition-colors border border-red-900/30 rounded-md cursor-pointer"
                                  title="Remove item from catalogue"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>

                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Orders queue */}
        {activeTab === "orders" && (
          <div className="flex flex-col gap-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[#0DFF92] font-mono text-xs uppercase tracking-widest font-black">Live Desk</span>
                <h1 className="text-2xl sm:text-3xl font-manrope font-black text-stone-100 tracking-tight mt-1">
                  Orders Desk & Revenue Tracker
                </h1>
                <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
                  Analyze active customer orders placed via the WhatsApp buttons on the storefront. Orders are added in real-time when clients redirect to complete their purchase.
                </p>
              </div>
            </div>

            {/* Orders Feed */}
            <div className="flex flex-col gap-4">
              {orders.length === 0 ? (
                <div className="text-center bg-[#03110E] p-12 rounded-2xl border border-[#0D2d20] text-stone-500 font-bold">
                  No active orders recorded yet. When a customer orders via WhatsApp on the storefront, it will appear here instantly!
                </div>
              ) : (
                orders.map((ord, idx) => (
                  <div key={`${ord.id}-${idx}`} className="bg-[#03110E] p-6 rounded-2xl border border-[#0D2d20] flex flex-col md:flex-row md:items-center md:justify-between gap-6 font-sans">
                    
                    {/* Customer overview details block */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-black text-[#0DFF92] px-2 py-0.5 rounded bg-[#0DFF92]/10 border border-[#0DFF92]/20">
                          {ord.id}
                        </span>
                        <h3 className="font-manrope font-black text-stone-100 text-sm">
                          {ord.customerName}
                        </h3>
                        <span className="text-[10px] text-stone-500 font-mono">({ord.timestamp})</span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-stone-400 mt-2 font-mono">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#0DFF92]" /> {ord.customerPhone}</span>
                        {ord.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-400" /> {ord.location}</span>}
                      </div>

                      {/* Items list */}
                      <div className="mt-3 bg-[#061813] p-3 rounded-xl border border-stone-800/40 text-[11px]">
                        <span className="block text-stone-500 font-mono uppercase text-[9px] mb-1">Ordered Items:</span>
                        <div className="flex flex-wrap gap-2">
                          {ord.items.map((item, index) => (
                            <span key={index} className="bg-stone-900 border border-stone-800/80 px-2 py-1 rounded text-stone-300">
                              {item.quantity} x {item.productName} (₹{item.price})
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Special Notes */}
                      {ord.specialInstructions && (
                        <p className="text-[10px] text-amber-400 mt-2.5 font-bold italic leading-none">
                          * Note: {ord.specialInstructions}
                        </p>
                      )}
                    </div>

                    {/* Operational controls */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-[#0D2d20] pt-4 md:pt-0 gap-3 shrink-0">
                      
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-stone-500 uppercase font-mono block">Order value</span>
                        <span className="font-manrope font-black text-base text-[#0DFF92]">₹{ord.totalPrice}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Selector Segmented status */}
                        <select
                          value={ord.status}
                          onChange={(e: any) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-[#061813] border border-[#0D2d20] focus:border-[#0DFF92]/40 text-stone-300 px-3 py-1.5 rounded-lg text-xs font-bold leading-tight uppercase outline-none focus:ring-0 cursor-pointer"
                        >
                          <option value="pending" className="bg-[#061813] text-stone-300">⏳ Pending</option>
                          <option value="preparing" className="bg-[#061813] text-amber-500">🔥 Preparing</option>
                          <option value="delivered" className="bg-[#061813] text-emerald-400">✓ Delivered</option>
                          <option value="cancelled" className="bg-[#061813] text-red-400">🚫 Cancelled</option>
                        </select>
                      </div>

                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* Tab 4: Store profile Settings */}
        {activeTab === "settings" && (
          <div className="flex flex-col gap-6 animate-fade-in text-left max-w-3xl">
            <div>
              <span className="text-[#0DFF92] font-mono text-xs uppercase tracking-widest font-black">Website Metadata</span>
              <h1 className="text-2xl sm:text-3xl font-manrope font-black text-stone-100 tracking-tight mt-1">
                Store Settings & Profile Configuration
              </h1>
              <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
                Tweak cafe timings, phone numbers, WhatsApp, street address, and Chef Suresh&apos;s biography. Updates apply immediately app-wide.
              </p>
            </div>

            <form onSubmit={handleSaveStoreSettings} className="bg-[#03110E] p-6 sm:p-8 rounded-2xl border border-[#0D2d20] flex flex-col gap-6 text-xs font-sans">
              
              {/* Timing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-stone-400 font-extrabold uppercase font-mono tracking-wider">Cafe Timings</label>
                  <input
                    type="text"
                    value={settingsOpeningHours}
                    onChange={(e) => setSettingsOpeningHours(e.target.value)}
                    className="bg-[#061813] border border-[#0D2d20] focus:border-[#0DFF92]/50 text-stone-100 p-3 rounded-xl focus:outline-none"
                    placeholder="Mon - Sun: 6:00 AM - 11:00 PM"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-stone-400 font-extrabold uppercase font-mono tracking-wider">Contact Phone</label>
                  <input
                    type="text"
                    value={settingsShopPhone}
                    onChange={(e) => setSettingsShopPhone(e.target.value)}
                    className="bg-[#061813] border border-[#0D2d20] focus:border-[#0DFF92]/50 text-stone-100 p-3 rounded-xl focus:outline-none"
                    placeholder="+91 63015 22101"
                  />
                </div>
              </div>

              {/* Direct WhatsApp link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-stone-400 font-extrabold uppercase font-mono tracking-wider">Chef WhatsApp Hot-Line (No spaces)</label>
                  <input
                    type="text"
                    value={settingsShopWhatsApp}
                    onChange={(e) => setSettingsShopWhatsApp(e.target.value)}
                    className="bg-[#061813] border border-[#0D2d20] focus:border-[#0DFF92]/50 text-stone-100 p-3 rounded-xl focus:outline-none"
                    placeholder="+916301522101"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-stone-400 font-extrabold uppercase font-mono tracking-wider">Instagram Link</label>
                  <input
                    type="text"
                    value={settingsInstagramLink}
                    onChange={(e) => setSettingsInstagramLink(e.target.value)}
                    className="bg-[#061813] border border-[#0D2d20] focus:border-[#0DFF92]/50 text-stone-100 p-3 rounded-xl focus:outline-none"
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>

              {/* Instagram tag */}
              <div className="flex flex-col gap-2">
                <label className="text-stone-400 font-extrabold uppercase font-mono tracking-wider">Instagram Handle</label>
                <input
                  type="text"
                  value={settingsInstagramHandle}
                  onChange={(e) => setSettingsInstagramHandle(e.target.value)}
                  className="bg-[#061813] border border-[#0D2d20] focus:border-[#0DFF92]/50 text-stone-100 p-3 rounded-xl focus:outline-none"
                  placeholder="@refresh_tasteofheaven"
                />
              </div>

              {/* Physical Street Location */}
              <div className="flex flex-col gap-2">
                <label className="text-stone-400 font-extrabold uppercase font-mono tracking-wider">Shop Physical Address</label>
                <textarea
                  value={settingsShopAddress}
                  onChange={(e) => setSettingsShopAddress(e.target.value)}
                  className="bg-[#061813] border border-[#0D2d20] focus:border-[#0DFF92]/50 text-stone-100 p-3 rounded-xl focus:outline-none h-20 resize-none leading-relaxed"
                  placeholder="23-5-325/2, opp.mahila university, mahila university road, tirupati-517502"
                />
              </div>

              {/* Chef profile information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#0D2d20] pt-6 mt-2">
                <div className="flex flex-col gap-2">
                  <label className="text-stone-400 font-extrabold uppercase font-mono tracking-wider">Chef Name</label>
                  <input
                    type="text"
                    value={settingsOwnerName}
                    onChange={(e) => setSettingsOwnerName(e.target.value)}
                    className="bg-[#061813] border border-[#0D2d20] focus:border-[#0DFF92]/50 text-stone-100 p-3 rounded-xl focus:outline-none"
                    placeholder="Chef Suresh Kumar Challa"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-stone-400 font-extrabold uppercase font-mono tracking-wider">Chef Title</label>
                  <input
                    type="text"
                    value={settingsOwnerTitle}
                    onChange={(e) => setSettingsOwnerTitle(e.target.value)}
                    className="bg-[#061813] border border-[#0D2d20] focus:border-[#0DFF92]/50 text-stone-100 p-3 rounded-xl focus:outline-none"
                    placeholder="Founder & Master Blend Artisan"
                  />
                </div>
              </div>

              {/* Chef Bio */}
              <div className="flex flex-col gap-2">
                <label className="text-stone-400 font-extrabold uppercase font-mono tracking-wider">Chef Biography Profile</label>
                <textarea
                  value={settingsOwnerBio}
                  onChange={(e) => setSettingsOwnerBio(e.target.value)}
                  className="bg-[#061813] border border-[#0D2d20] focus:border-[#0DFF92]/50 text-stone-100 p-3 rounded-xl focus:outline-none h-24 resize-none leading-relaxed"
                  placeholder="At Shiva Refresh, we believe that good health..."
                />
              </div>

              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-[#061813] text-xs font-manrope font-black p-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/15 uppercase font-bold cursor-pointer mt-2"
              >
                <Save className="w-4 h-4 stroke-[2.5px]" />
                Compile & Save Store Settings
              </button>

            </form>
          </div>
        )}

      </main>

      {/* Product Add/Edit Dialog modal overlay */}
      {(isAddMode || editingProduct) && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center px-4 font-sans text-stone-900">
          <div
            onClick={() => {
              setEditingProduct(null);
              setIsAddMode(false);
            }}
            className="absolute inset-0 bg-[#061813]/85 backdrop-blur-sm transition-opacity"
          ></div>

          <div className="relative bg-white text-stone-800 rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full z-10 border border-stone-100 animate-fade-in text-left max-h-[90vh] flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0A261D] text-[#0DFF92] flex items-center justify-between shrink-0">
              <span className="font-manrope font-black tracking-wide uppercase text-xs flex items-center gap-1.5">
                <ChefHat className="w-4 h-4" />
                {isAddMode ? "Add New MenuItem" : `Edit Catalog: ${formName}`}
              </span>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddMode(false);
                }}
                className="p-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scroll Area */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col gap-4 text-xs scrollbar">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Item Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-stone-500 font-extrabold uppercase font-mono tracking-wider text-[10px]">Item Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="border border-stone-300 focus:border-emerald-500 p-2.5 rounded-lg text-xs leading-none outline-none font-bold"
                    placeholder="e.g. Avocado Spinach Boost"
                  />
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-stone-500 font-extrabold uppercase font-mono tracking-wider text-[10px]">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="border border-stone-300 focus:border-emerald-500 p-2.5 rounded-lg text-xs leading-none outline-none font-black font-manrope"
                    placeholder="e.g. 149"
                    min={0}
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Category Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-stone-500 font-extrabold uppercase font-mono tracking-wider text-[10px]">Category placement</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="border border-stone-300 focus:border-emerald-500 p-2.5 rounded-lg text-xs leading-none outline-none bg-white font-extrabold"
                  >
                    {categories.map((cat, idx) => (
                      <option key={`${cat.id}-${idx}`} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calories */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-stone-500 font-extrabold uppercase font-mono tracking-wider text-[10px]">Serving Size</label>
                    <input
                      type="text"
                      value={formServingSize}
                      onChange={(e) => setFormServingSize(e.target.value)}
                      className="border border-stone-300 focus:border-emerald-500 p-2.5 rounded-lg text-xs leading-none outline-none"
                      placeholder="e.g. 250ml"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-stone-500 font-extrabold uppercase font-mono tracking-wider text-[10px]">Calories (kcal)</label>
                    <input
                      type="number"
                      value={formCalories || ""}
                      onChange={(e) => setFormCalories(e.target.value ? Number(e.target.value) : undefined)}
                      className="border border-stone-300 focus:border-emerald-500 p-2.5 rounded-lg text-xs leading-none outline-none"
                      placeholder="e.g. 180"
                    />
                  </div>
                </div>

              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-stone-500 font-extrabold uppercase font-mono tracking-wider text-[10px]">Item Description</label>
                <textarea
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="border border-stone-300 focus:border-emerald-500 p-2.5 rounded-lg text-xs outline-none h-16 resize-none leading-relaxed"
                  placeholder="Describe health values and taste profiles..."
                />
              </div>

              {/* Health attributes matrix flags */}
              <div className="flex flex-col gap-2 bg-stone-50 p-4 rounded-xl border border-stone-100">
                <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-[#0D2d20] block">Special Nutrition Accents:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-medium font-sans">
                  
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isSugarFree}
                      onChange={(e) => setIsSugarFree(e.target.checked)}
                      className="rounded border-stone-300 accent-[#0D2d20] w-4 h-4 cursor-pointer"
                    />
                    🚫 Sugar-free / Organic
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isPcodFriendly}
                      onChange={(e) => setIsPcodFriendly(e.target.checked)}
                      className="rounded border-stone-300 accent-[#0D2d20] w-4 h-4 cursor-pointer"
                    />
                    🌸 PCOS / Hormonal Glow
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isHighProtein}
                      onChange={(e) => setIsHighProtein(e.target.checked)}
                      className="rounded border-stone-300 accent-[#0D2d20] w-4 h-4 cursor-pointer"
                    />
                    💪 Muscle Protein
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isGymFriendly}
                      onChange={(e) => setIsGymFriendly(e.target.checked)}
                      className="rounded border-stone-300 accent-[#0D2d20] w-4 h-4 cursor-pointer"
                    />
                    🏋️ Gym / Fitness Diet
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isDiabeticFriendly}
                      onChange={(e) => setIsDiabeticFriendly(e.target.checked)}
                      className="rounded border-stone-300 accent-[#0D2d20] w-4 h-4 cursor-pointer"
                    />
                    🩸 Diabetic-safe
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none text-rose-600 font-extrabold">
                    <input
                      type="checkbox"
                      checked={isMostOrdered}
                      onChange={(e) => setIsMostOrdered(e.target.checked)}
                      className="rounded border-stone-300 accent-rose-600 w-4 h-4 cursor-pointer"
                    />
                    🔥 Chef's Recommended
                  </label>

                </div>
              </div>

              {/* Product Thumbnail custom image picker or preset */}
              <div className="flex flex-col gap-2">
                <label className="text-stone-500 font-extrabold uppercase font-mono tracking-wider text-[10px]">Product Image URL</label>
                <input
                  type="text"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="border border-stone-300 p-2.5 rounded-lg font-mono text-[10px]"
                  placeholder="https://images.unsplash.com/..."
                />
                
                {/* Visual Preset Selector */}
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[9px] text-stone-400 font-mono">Or select a professional wellness cafe image template:</span>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {PRESET_IMAGES.map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormImage(preset.url)}
                        className={`flex-none p-1 rounded-lg border transition-all ${
                          formImage === preset.url
                            ? "border-emerald-500 bg-emerald-500/5"
                            : "border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-12 h-12 object-cover rounded" />
                        <span className="text-[8px] text-stone-500 mt-1 block truncate max-w-[50px]">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </form>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddMode(false);
                }}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-lg text-xs font-bold transition-all cursor-pointer text-stone-700"
              >
                Cancel change
              </button>
              <button
                type="button"
                onClick={handleSaveProduct}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black font-manrope transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
              >
                ✓ {isAddMode ? "Compile & Create Item" : "Save Selected Item"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
