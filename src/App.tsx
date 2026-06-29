/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Leaf,
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Phone,
  Clock,
  Instagram,
  Menu,
  X,
  Send,
  Heart,
  Activity,
  Flame,
  Check,
  ArrowRight,
  Sparkles,
  Apple,
  CupSoda,
  Snowflake,
  Grid,
  Cookie,
  ChevronRight,
  Maximize2,
  Lock,
  Unlock,
  ChefHat
} from "lucide-react";
import { CATEGORIES, PRODUCTS, BUSINESS_INFO } from "./data";
import { Product, OrderItem } from "./types";
import heroSmoothieImage from "./assets/images/regenerated_image_1780114980123.png";
import AdminDashboard, { SimulatedOrder } from "./components/AdminDashboard";

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.705 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function App() {
  const isDevMode = typeof window !== "undefined" && (
    window.location.hostname.includes("-dev-") || 
    window.location.hostname.includes("localhost") || 
    window.location.hostname.includes("127.0.0.1")
  );

  // Hidden Chef Portal visibility state
  const [showChefButton, setShowChefButton] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (params.has("chef") || params.has("admin") || params.has("owner")) {
          return true;
        }
        return localStorage.getItem("shiva_refresh_show_chef_button") === "true";
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  const logoClicksRef = useRef(0);
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    logoClicksRef.current += 1;
    if (logoClicksRef.current >= 5) {
      setShowChefButton(true);
      try {
        localStorage.setItem("shiva_refresh_show_chef_button", "true");
      } catch (err) {
        console.error(err);
      }
      logoClicksRef.current = 0;
    }
  };

  // Navigation / Scroll state
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter and Search states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Cart state
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);

  // Quick View Product state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Form states
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  // Admin / Chef Management State
  const [isAdminView, setIsAdminView] = useState(false);
  const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  // Persistent Products and Business State
  const [productsState, setProductsState] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("shiva_refresh_products");
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  const [businessState, setBusinessState] = useState(() => {
    try {
      const saved = localStorage.getItem("shiva_refresh_business");
      return saved ? JSON.parse(saved) : BUSINESS_INFO;
    } catch {
      return BUSINESS_INFO;
    }
  });

  // Sold out items dynamic map tracking
  const [soldOutIds, setSoldOutIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("shiva_refresh_soldout_ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load soldout list on state change to stay reactive
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("shiva_refresh_soldout_ids");
        if (saved) setSoldOutIds(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    // Interval check as well since storage event only fires on other tabs
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const [orders, setOrders] = useState<SimulatedOrder[]>(() => {
    try {
      const saved = localStorage.getItem("shiva_refresh_orders");
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {}
    return [];
  });

  const saveProducts = (updated: Product[]) => {
    setProductsState(updated);
    try {
      localStorage.setItem("shiva_refresh_products", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const saveBusiness = (updated: typeof BUSINESS_INFO) => {
    setBusinessState(updated);
    try {
      localStorage.setItem("shiva_refresh_business", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const saveOrders = (updated: SimulatedOrder[]) => {
    setOrders(updated);
    try {
      localStorage.setItem("shiva_refresh_orders", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const decrementStock = (orderedItems: { productId: string; quantity: number }[]) => {
    let updatedProducts = [...productsState];
    let newSoldOutIds = [...soldOutIds];
    let changed = false;

    orderedItems.forEach(({ productId, quantity }) => {
      const idx = updatedProducts.findIndex((p) => p.id === productId);
      if (idx !== -1) {
        const p = updatedProducts[idx];
        if (p.availableQuantity !== undefined) {
          const newQty = Math.max(0, p.availableQuantity - quantity);
          updatedProducts[idx] = { ...p, availableQuantity: newQty };
          changed = true;
          
          if (newQty === 0 && !newSoldOutIds.includes(productId)) {
            newSoldOutIds.push(productId);
          }
        }
      }
    });

    if (changed) {
      saveProducts(updatedProducts);
      setSoldOutIds(newSoldOutIds);
      try {
        localStorage.setItem("shiva_refresh_soldout_ids", JSON.stringify(newSoldOutIds));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const renderStockLevel = (p: Product) => {
    const isSoldOut = soldOutIds.includes(p.id);
    if (isSoldOut) {
      return <span className="text-red-500 font-mono font-extrabold text-[10px] uppercase block tracking-wider mt-1 select-none">● Out of Stock</span>;
    }
    if (p.availableQuantity !== undefined) {
      if (p.availableQuantity === 0) {
        return <span className="text-red-500 font-mono font-extrabold text-[10px] uppercase block tracking-wider mt-1 select-none">● Out of Stock</span>;
      }
      if (p.availableQuantity <= 5) {
        return <span className="text-orange-cta font-mono font-extrabold text-[10px] uppercase block tracking-wider mt-1 select-none">⚠️ Only {p.availableQuantity} left!</span>;
      }
      return <span className="text-stone-400 font-mono font-extrabold text-[10px] uppercase block tracking-wider mt-1 select-none">{p.availableQuantity} available</span>;
    }
    return <span className="text-stone-400 font-mono font-extrabold text-[10px] uppercase block tracking-wider mt-1 select-none">In Stock</span>;
  };

  // Passcode login verification
  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === "6301") {
      setIsAdminView(true);
      setPasscodeModalOpen(false);
      setPasscodeInput("");
      setPasscodeError("");
    } else {
      setPasscodeError("Invalid Administrative Passcode.");
    }
  };

  // Trigger scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set the category and smooth scroll to menu section
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const element = document.getElementById("menu-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Cart management functions
  const addToCart = (product: Product, event?: React.MouseEvent) => {
    if (!product) return;
    if (event) {
      event.stopPropagation();
    }
    
    const latestProduct = productsState.find(p => p.id === product.id) || product;
    // Guard against sold out items
    if (soldOutIds.includes(product.id) || latestProduct.availableQuantity === 0) {
      return;
    }
    const inCart = cart.find((item) => item.product.id === product.id)?.quantity || 0;
    if (latestProduct.availableQuantity !== undefined && inCart >= latestProduct.availableQuantity) {
      alert(`Sorry, only ${latestProduct.availableQuantity} units of "${product.name}" are currently available in stock.`);
      return;
    }
    
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });

    // Provide visual feedback
    setLastAddedItem(product.id);
    setTimeout(() => setLastAddedItem(null), 1000);
  };

  const removeFromCart = (productId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter((item) => item.product.id !== productId);
    });
  };

  const deleteFromCart = (productId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Derived Values
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  const totalItemsCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsState.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, productsState]);

  // Health Zone items (for highlight section)
  const healthZoneProducts = useMemo(() => {
    return productsState.filter((p) => p.category === "health-zone");
  }, [productsState]);

  // Women Health items (for highlight section)
  const womenHealthProducts = useMemo(() => {
    return productsState.filter((p) => p.category === "women-health");
  }, [productsState]);

  // WhatsApp Order Handlers
  const generateSingleItemWhatsAppLink = (product: Product) => {
    const message = encodeURIComponent(
      `Hello Shiva Refresh! I would like to order:\n- 1 x ${product.name} (₹${product.price})\n\nPlease deliver it to my address. Thank you!`
    );
    return `https://wa.me/${businessState.shopWhatsApp.replace(/\s+/g, "")}?text=${message}`;
  };

  const handleOrderSingleProduct = (product: Product, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Create a simulated order in real-time
    const newOrder: SimulatedOrder = {
      id: `SR-${Math.floor(Math.random() * 9000 + 1000)}`,
      customerName: "WhatsApp Customer",
      customerPhone: "+91 (Direct Order)",
      items: [{ productName: product.name, price: product.price, quantity: 1 }],
      totalPrice: product.price,
      status: "pending",
      timestamp: "Just now",
      location: "Tirupati Region (Direct Order)"
    };
    saveOrders([newOrder, ...orders]);
    decrementStock([{ productId: product.id, quantity: 1 }]);

    // Open WhatsApp
    const message = encodeURIComponent(
      `Hello Shiva Refresh! I would like to order:\n- 1 x ${product.name} (₹${product.price})\n\nPlease deliver it to my address. Thank you!`
    );
    const cleanNumber = businessState.shopWhatsApp.replace(/[+\s-]/g, "");
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank");
  };

  const sendCartToWhatsApp = () => {
    if (cart.length === 0) return;
    
    // Create a simulated order in real-time
    const orderItems = cart.map(item => ({
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }));
    const newOrder: SimulatedOrder = {
      id: `SR-${Math.floor(Math.random() * 9000 + 1000)}`,
      customerName: "WhatsApp Cart Customer",
      customerPhone: "+91 (Cart Order)",
      items: orderItems,
      totalPrice: cartTotal,
      status: "pending",
      timestamp: "Just now",
      location: "Tirupati Region (Cart Order)"
    };
    saveOrders([newOrder, ...orders]);
    decrementStock(cart.map(item => ({ productId: item.product.id, quantity: item.quantity })));

    // Clear cart as the customer placed the order
    setCart([]);

    let messageText = `*Hello Shiva Refresh!*%0A`;
    messageText += `I would like to place an order via WhatsApp:%0A%0A`;
    
    cart.forEach((item, index) => {
      messageText += `${index + 1}. *${item.product.name}* (Qty: ${item.quantity}) - ₹${item.product.price * item.quantity}%0A`;
    });
    
    messageText += `%0A*Grand Total:* ₹${cartTotal}%0A%0A`;
    messageText += `Please send estimated delivery time. Thank you!`;

    const cleanNumber = businessState.shopWhatsApp.replace(/[+\s-]/g, "");
    window.open(`https://wa.me/${cleanNumber}?text=${messageText}`, "_blank");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contactMessageText = encodeURIComponent(
      `Hello Shiva Refresh!\n\nName: ${contactName}\nPhone: ${contactPhone}\nMessage: ${contactMessage}`
    );
    const cleanNumber = businessState.shopWhatsApp.replace(/[+\s-]/g, "");
    window.open(`https://wa.me/${cleanNumber}?text=${contactMessageText}`, "_blank");
  };

  // Category Icon Mapper
  const renderCategoryIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case "Sparkles": return <Sparkles className={className} />;
      case "Apple": return <Apple className={className} />;
      case "Activity": return <Activity className={className} />;
      case "FlameKindling": return <Flame className={className} />;
      case "Flame": return <Flame className={className} />;
      case "CupSoda": return <CupSoda className={className} />;
      case "Snowflake": return <Snowflake className={className} />;
      case "Grid": return <Grid className={className} />;
      case "Cookie": return <Cookie className={className} />;
      case "Heart": return <Heart className={className} />;
      default: return <Leaf className={className} />;
    }
  };

  if (isAdminView) {
    return (
      <AdminDashboard
        products={productsState}
        onSaveProducts={saveProducts}
        categories={CATEGORIES}
        businessInfo={businessState}
        onSaveBusiness={saveBusiness}
        orders={orders}
        onSaveOrders={saveOrders}
        onBack={() => setIsAdminView(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-cream-white font-sans text-dark-greenish-black selection:bg-fresh-green selection:text-white">
      
      {/* 1. NAV BAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-cream-white/95 backdrop-blur-md border-b border-deep-green/10 shadow-sm py-3 text-deep-green"
            : "bg-transparent py-5 text-deep-green"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="#" onClick={handleLogoClick} className="flex items-center gap-2 group">
              <div className="bg-deep-green text-cream-white p-2.5 rounded-full group-hover:rotate-12 transition-transform duration-300 shadow-sm">
                <Leaf className="w-5 h-5 text-lime-green" />
              </div>
              <span className="text-xl font-manrope font-extrabold tracking-tight">
                Shiva<span className="text-fresh-green">Refresh</span>
              </span>
            </a>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
              <a
                href="#"
                onClick={() => setSelectedCategory("all")}
                className="hover:text-fresh-green transition-colors py-2 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fresh-green group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#menu-pills" className="hover:text-fresh-green transition-colors py-2 relative group">
                Menu
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fresh-green group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#health-zone"
                onClick={() => setSelectedCategory("all")}
                className="hover:text-fresh-green transition-colors py-2 relative group flex items-center gap-1.5"
              >
                Health Zone
                <span className="bg-lime-green text-deep-green text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border border-deep-green/10">Special</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fresh-green group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#about" className="hover:text-fresh-green transition-colors py-2 relative group">
                About Owner
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fresh-green group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#contact" className="hover:text-fresh-green transition-colors py-2 relative group">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fresh-green group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>

            {/* Actions Panel */}
            <div className="flex items-center gap-4">
              {/* Cart Toggle button */}
              <button
                id="cart-toggle-btn"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full transition-all duration-300 flex items-center gap-2 group bg-deep-green/5 hover:bg-deep-green/10 text-deep-green"
                title="View Order Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-orange-cta text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                      {totalItemsCount}
                    </span>
                  )}
                </div>
                {totalItemsCount > 0 && (
                  <span className="text-xs font-bold font-manrope hidden sm:inline">
                    ₹{cartTotal}
                  </span>
                )}
              </button>

              {/* Chef Portal Toggle button */}
              {showChefButton && (
                <button
                  id="chef-portal-toggle"
                  onClick={() => setPasscodeModalOpen(true)}
                  className="relative p-2.5 rounded-full transition-all duration-300 flex items-center gap-1.5 group bg-deep-green/5 hover:bg-deep-green/10 text-deep-green cursor-pointer"
                  title="Chef Portal"
                >
                  <Lock className="w-5 h-5 group-hover:scale-110 transition-transform text-deep-green" />
                  <span className="text-xs font-bold font-manrope hidden xl:inline">Chef Portal</span>
                </button>
              )}

              {/* Sticky WhatsApp Header Button */}
              <a
                href={`https://wa.me/${businessState.shopWhatsApp.replace(/[+\s-]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="hidden lg:flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-manrope text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-md shadow-green-500/20"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                Order on WhatsApp
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl md:hidden transition-colors hover:bg-deep-green/10 text-deep-green"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[60px] bg-[#0A261D] z-40 flex flex-col justify-between p-8 md:hidden text-cream-white overflow-y-auto">
          <div className="flex flex-col gap-6 text-xl font-manrope font-medium mt-4">
            <a
              href="#"
              onClick={() => {
                setSelectedCategory("all");
                setMobileMenuOpen(false);
              }}
              className="hover:text-lime-green transition-colors flex items-center justify-between border-b border-white/5 pb-3"
            >
              <span>Home</span>
              <ChevronRight className="w-5 h-5 text-fresh-green" />
            </a>
            <a
              href="#menu-pills"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-lime-green transition-colors flex items-center justify-between border-b border-white/5 pb-3"
            >
              <span>Browse Menu</span>
              <ChevronRight className="w-5 h-5 text-fresh-green" />
            </a>
            {showChefButton && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setPasscodeModalOpen(true);
                }}
                className="hover:text-lime-green text-left w-full transition-colors flex items-center justify-between border-b border-white/5 pb-3 text-xl font-manrope font-medium cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-lime-green" />
                  Chef's Portal
                </span>
                <ChevronRight className="w-5 h-5 text-fresh-green" />
              </button>
            )}
            <a
              href="#health-zone"
              onClick={() => {
                setSelectedCategory("all");
                setMobileMenuOpen(false);
              }}
              className="hover:text-lime-green transition-colors flex items-center justify-between border-b border-white/5 pb-3"
            >
              <span className="flex items-center gap-2">
                Health Zone <span className="bg-lime-green text-deep-green text-[9px] px-2 py-0.5 rounded font-bold uppercase">Must-Try</span>
              </span>
              <ChevronRight className="w-5 h-5 text-fresh-green" />
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-lime-green transition-colors flex items-center justify-between border-b border-white/5 pb-3"
            >
              <span>About Our Chef</span>
              <ChevronRight className="w-5 h-5 text-fresh-green" />
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-lime-green transition-colors flex items-center justify-between border-b border-white/5 pb-3"
            >
              <span>Shop Location / Hours</span>
              <ChevronRight className="w-5 h-5 text-fresh-green" />
            </a>
          </div>

          <div className="flex flex-col gap-4 mt-8 pb-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-stone-300">
              <span className="block font-bold text-cream-white mb-1">⏰ Cafe Timing:</span>
              {businessState.openingHours}
            </div>
            <a
              href={`https://wa.me/${businessState.shopWhatsApp.replace(/[+\s-]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-center py-4 rounded-full font-manrope font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-green-500/25"
            >
              <WhatsAppIcon className="w-5 h-5" />
              ORDER ON WHATSAPP NOW
            </a>
          </div>
        </div>
      )}

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-28 pb-16 md:py-36 bg-gradient-to-br from-cream-white via-cream-white to-beige text-dark-greenish-black">
        
        {/* Abstract Floating Vegetables and organic background illustrations */}
        <div className="absolute inset-0 z-0 opacity-15 overflow-hidden pointer-events-none">
          <div className="absolute top-12 left-10 w-44 h-44 rounded-full bg-lime-green blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-fresh-green blur-3xl animate-float-reverse"></div>
          
          {/* Mock Floating elements */}
          <div className="absolute top-1/4 right-[8%] animate-float max-w-xs text-xs text-fresh-green font-mono">
            🥦 Premium Broccoli Bowl
          </div>
          <div className="absolute bottom-1/4 left-[5%] animate-float-reverse max-w-xs text-xs text-fresh-green font-mono">
            🥑 Creamy Avocado Smoothies
          </div>
          <div className="absolute top-[45%] left-[45%] animate-pulse text-xs text-fresh-green font-mono">
            🍓 Fresh High-Mountain Berries
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              
              {/* Dynamic Badges */}
              <div className="flex flex-wrap gap-2.5 items-center">
                <span className="bg-lime-green text-deep-green font-manrope text-xs font-bold tracking-wide uppercase px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs border border-deep-green/10">
                  <Sparkles className="w-3.5 h-3.5" /> Certified Organic
                </span>
                <span className="bg-white/80 text-dark-greenish-black font-manrope text-xs font-bold tracking-wide uppercase px-3.5 py-1.5 rounded-full flex items-center gap-1 border border-deep-green/10">
                  🌿 Clean Living
                </span>
                <span className="bg-orange-cta/15 text-orange-cta font-manrope text-xs font-bold tracking-wide uppercase px-3.5 py-1.5 rounded-full flex items-center gap-1 border border-orange-cta/20">
                  ⚡ Sugar Free Specials
                </span>
              </div>

              {/* Title with styling */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-manrope font-extrabold leading-tight tracking-tight text-deep-green">
                Fresh Healthy Food <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fresh-green to-deep-green drop-shadow-xs">
                  Delivered To Your Door
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-soft-gray max-w-xl font-sans leading-relaxed">
                Healthy smoothies, bowls, desserts, and sugar-free specials crafted for your lifestyle. Browse our fresh menu of nutrition-packed superfoods and order instantly on WhatsApp.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 mt-2">
                <a
                  href="#menu-pills"
                  className="bg-orange-cta hover:bg-orange-cta/90 hover:scale-[1.02] transition-all text-white font-manrope font-bold px-8 py-4 rounded-full flex items-center gap-2 shadow-lg shadow-orange-cta/30 text-sm cursor-pointer animate-pulse-soft"
                >
                  Explore Full Menu
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${businessState.shopWhatsApp.replace(/[+\s-]/g, "")}?text=Hi!%20I%20want%20to%20know%20more%20about%20the%20meals%20and%20order.`}
                  target="_blank"
                  rel="noreferrer"
                  className="border-1.5 border-[#25D366] hover:bg-[#25D366]/5 hover:scale-[1.02] transition-all text-deep-green font-manrope font-bold px-8 py-4 rounded-full flex items-center gap-2 text-sm cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  Inquire on WhatsApp
                </a>
              </div>

              {/* Mini Info */}
              <p className="text-stone-500 text-xs font-mono mt-2 flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-fresh-green animate-pulse"></span>
                Order directly on WhatsApp for quick, fresh delivery to your doorstep.
              </p>
            </div>

            {/* Hero Right Visual Column - Premium Bento Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[420px] lg:max-w-none">
                
                {/* Visual Backdrop Frame */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-lime-green to-fresh-green rounded-3xl blur-md opacity-25"></div>
                
                {/* Real Bento Grid Cards mockup */}
                <div className="relative bg-deep-green border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
                  
                  {/* Top card showing Smoothie */}
                  <div className="flex items-center gap-4 bg-white/5 p-3.5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <img
                      src={heroSmoothieImage}
                      alt="Super Smoothie"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover ring-2 ring-lime-green"
                    />
                    <div className="flex-1">
                      <span className="text-[10px] text-lime-green uppercase tracking-widest font-mono font-bold block">Most Ordered</span>
                      <h4 className="font-manrope font-bold text-sm text-white">Berry Mix Smoothie</h4>
                      <p className="text-xs text-stone-300">₹199</p>
                    </div>
                    <button 
                      onClick={() => addToCart(productsState.find(p => p.id === "bs-1") || productsState[7])}
                      className="bg-lime-green text-deep-green hover:bg-lime-green/90 p-2.5 rounded-full transition-all"
                      title="Add to order"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mid Row with split widgets */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Stat Widget 1 */}
                    <div className="bg-gradient-to-tr from-deep-green/90 to-deep-green p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
                      <div className="bg-lime-green/20 text-lime-green w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[20px] font-manrope font-black text-lime-green block">100%</span>
                        <span className="text-[10px] text-stone-300 uppercase tracking-wider block font-mono">Organic Ingredients</span>
                      </div>
                    </div>
                    {/* Stat Widget 2 */}
                    <div className="bg-gradient-to-tr from-deep-green/90 to-deep-green p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
                      <div className="bg-orange-cta/20 text-orange-cta w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                        <Heart className="w-4 h-4 fill-orange-cta text-orange-cta" />
                      </div>
                      <div>
                        <span className="text-[20px] font-manrope font-black text-orange-cta block">Zero</span>
                        <span className="text-[10px] text-stone-300 uppercase tracking-wider block font-mono">Refined Sugar Used</span>
                      </div>
                    </div>
                  </div>

                  {/* Main featured bowl card bottom */}
                  <div className="relative overflow-hidden bg-gradient-to-r from-deep-green/80 to-deep-green rounded-2xl border border-white/5 hover:border-lime-green/35 transition-all group">
                    <img
                      src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80"
                      alt="Salad Bowl"
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-greenish-black via-dark-greenish-black/50 to-transparent p-4 flex flex-col justify-end">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="inline-block bg-lime-green text-deep-green text-[9px] font-extrabold px-2 py-0.5 rounded uppercase mb-1">Health Zone Highlight</span>
                          <h4 className="font-manrope font-bold text-base text-white">High Protein Salad</h4>
                        </div>
                        <span className="bg-white text-deep-green font-manrope font-bold text-xs px-2.5 py-1 rounded-lg">₹119</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CATAGORIES PILL SCROLL BAR & LIVE SEARCH */}
      <section id="menu-pills" className="bg-cream-white/95 py-6 sticky top-[58px] z-30 backdrop-blur-md border-y border-deep-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Real Search Box */}
            <div className="relative w-full lg:max-w-xs group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-500">
                <Search className="w-4 h-4 group-focus-within:text-deep-green transition-colors" />
              </span>
              <input
                type="text"
                placeholder="Search smoothies, bowls, healthy specials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-deep-green/10 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-deep-green focus:ring-1 focus:ring-deep-green shadow-sm text-dark-greenish-black font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-deep-green"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category selection horizontal scroller */}
            <div className="w-full flex-1 overflow-x-auto no-scrollbar py-1">
              <div className="flex gap-2 min-w-max px-1">
                {/* "All" tab */}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4.5 py-2 rounded-full text-xs font-manrope font-extrabold transition-all duration-200 ${
                    selectedCategory === "all"
                      ? "bg-deep-green text-white shadow-md shadow-deep-green/20"
                      : "bg-white hover:bg-stone-100 text-deep-green border border-deep-green/10 hover:shadow-xs"
                  }`}
                >
                  🌟 All Menus
                </button>

                {CATEGORIES.map((cat, idx) => (
                  <button
                    key={`${cat.id}-${idx}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4.5 py-2 rounded-full text-xs font-manrope font-extrabold flex items-center gap-1.5 transition-all duration-200 ${
                      selectedCategory === cat.id
                        ? "bg-deep-green text-white shadow-md shadow-deep-green/20"
                        : cat.id === "health-zone"
                        ? "bg-lime-green/35 hover:bg-lime-green/50 text-deep-green border border-lime-green/50 shadow-xs"
                        : "bg-white hover:bg-cream-white text-deep-green border border-deep-green/10 hover:shadow-xs"
                    }`}
                  >
                    {renderCategoryIcon(cat.iconName, "w-3.5 h-3.5")}
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. HEALTH ZONE SECTION (MOST IMPORTANT - DRAMATIC VISUAL) */}
      {selectedCategory === "all" && (
        <section id="health-zone" className="relative py-20 px-4 bg-gradient-to-br from-cream-white via-cream-white/50 to-beige/40 text-dark-greenish-black overflow-hidden border-b border-deep-green/10">
        
        {/* Glow Effects */}
        <div className="absolute top-24 left-1/4 w-96 h-96 bg-lime-green rounded-full opacity-[0.08] blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-fresh-green rounded-full opacity-[0.06] blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 mb-12 border-b border-deep-green/10 pb-6">
            <div>
              <span className="text-fresh-green hover:scale-105 transition-transform inline-flex items-center gap-1.5 font-manrope text-xs font-black tracking-widest uppercase mb-1">
                <Sparkles className="w-4 h-4 text-fresh-green" /> THE CRITICAL ADRENALINE
              </span>
              <h2 className="text-3xl md:text-5xl font-manrope font-extrabold tracking-tight text-deep-green">
                Workout <span className="text-transparent bg-clip-text bg-gradient-to-r from-fresh-green to-deep-green drop-shadow-sm">Health Zone</span>
              </h2>
              <p className="text-soft-gray text-sm max-w-xl mt-1.5 leading-relaxed font-sans">
                Chemically & nutritiously perfect wellness bowls, stevia-sweetened berry drinks, and fiber mixtures formatted meticulously for Gym enthusiasts, PCOD solutions, and Diabetes defense.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 rounded-full bg-lime-green/30 border border-lime-green/50 text-[11px] font-bold tracking-wider uppercase text-deep-green">
                🌱 Sugar Free
              </span>
              <span className="inline-block px-3 py-1 rounded-full bg-orange-cta/10 border border-orange-cta/20 text-[11px] font-bold tracking-wider uppercase text-orange-cta">
                ⚡ High Protein
              </span>
            </div>
          </div>

          {/* Bento-Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {healthZoneProducts.map((p, idx) => {
              // Custom indicators
              const isHighlight = p.id === "hz-1" || p.id === "hz-6";
              const isSoldOut = soldOutIds.includes(p.id) || p.availableQuantity === 0;
              const inCartCount = cart.find(item => item.product.id === p.id)?.quantity || 0;
              
              return (
                <div
                  key={`${p.id}-${idx}`}
                  onClick={() => setQuickViewProduct(p)}
                  className={`relative flex flex-col justify-between overflow-hidden rounded-[24px] border transition-all duration-300 card-glow ${
                    isSoldOut
                      ? "opacity-75 cursor-pointer"
                      : "hover:-translate-y-2 cursor-pointer"
                  } ${
                    isHighlight
                      ? "bg-gradient-to-b from-deep-green to-dark-greenish-black border-lime-green/40 shadow-xl text-white lg:col-span-1"
                      : "bg-white border-deep-green/5 hover:border-deep-green/15 shadow-md shadow-deep-green/5 text-dark-greenish-black"
                  } group`}
                >
                  
                  {/* Image Header */}
                  <div className="relative h-56 overflow-hidden bg-stone-900">
                    <img
                      src={p.bentoImage || p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-transform duration-500 opacity-90 ${
                        isSoldOut ? "grayscale contrast-75" : "group-hover:scale-105"
                      }`}
                    />
                    
                    {/* Floating Badges inside Card Image */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                      {p.isMostOrdered && (
                        <span className="bg-orange-cta text-white text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                          🔥 Most Ordered
                        </span>
                      )}
                      {p.isSugarFree && (
                        <span className="bg-deep-green text-lime-green border border-lime-green/20 text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                          Sugar Free
                        </span>
                      )}
                      {p.isPcodFriendly && (
                        <span className="bg-purple-600 text-white text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                          ♀️ PCOD Friendly
                        </span>
                      )}
                    </div>

                    <div className={`absolute bottom-4 right-4 backdrop-blur-sm px-3 py-1 rounded-xl text-right border ${
                      isHighlight 
                        ? "bg-dark-greenish-black/80 border-white/10" 
                        : "bg-cream-white/85 border-deep-green/5"
                    }`}>
                      <span className={`text-[9px] font-mono font-bold block ${isHighlight ? "text-stone-300" : "text-stone-500"}`}>Calories</span>
                      <span className={`text-xs font-bold ${isHighlight ? "text-lime-green" : "text-deep-green"}`}>{p.calories} kcal ({p.servingSize})</span>
                    </div>

                    {/* Sold out overlay banner */}
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-600 text-white font-manrope font-black text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md border border-red-500/35 animate-pulse">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-baseline gap-2 mb-2">
                        <h3 className={`font-manrope font-extrabold text-base transition-colors ${
                          isSoldOut
                            ? "text-stone-400 line-through"
                            : isHighlight
                            ? "text-cream-white group-hover:text-lime-green"
                            : "text-dark-greenish-black group-hover:text-deep-green"
                        }`}>
                          {p.name}
                        </h3>
                        <div className="text-right shrink-0">
                          <span className={`font-manrope font-black text-base block ${
                            isSoldOut
                              ? "text-stone-400"
                              : isHighlight
                              ? "text-lime-green"
                              : "text-deep-green"
                          }`}>
                            ₹{p.price}
                          </span>
                          {renderStockLevel(p)}
                        </div>
                      </div>
                      
                      <p className={`text-xs leading-relaxed font-sans mt-1.5 ${
                        isHighlight ? "text-stone-300" : "text-soft-gray"
                      }`}>
                        {p.description}
                      </p>
                    </div>

                    {/* Features Tag Grid */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {p.isGymFriendly && (
                        <span className="text-[10px] font-extrabold font-mono text-fresh-green px-2.5 py-0.5 rounded-full bg-fresh-green/10 uppercase">
                          Gym Friendly
                        </span>
                      )}
                      {p.isHighProtein && (
                        <span className="text-[10px] font-extrabold font-mono text-orange-600 px-2.5 py-0.5 rounded-full bg-[#FF9B42]/10 uppercase">
                          High Protein
                        </span>
                      )}
                      {p.isDiabeticFriendly && (
                        <span className="text-[10px] font-extrabold font-mono text-amber-600 px-2.5 py-0.5 rounded-full bg-amber-500/10 uppercase">
                          Sugar Controlled
                        </span>
                      )}
                    </div>

                    {/* Quick Order Buttons for Health Zone */}
                    <div className={`grid grid-cols-2 gap-3 pt-4 border-t ${isHighlight ? "border-white/10" : "border-deep-green/5"}`} onClick={(e) => e.stopPropagation()}>
                      {isSoldOut ? (
                        <div className="col-span-2 py-2.5 text-center text-xs font-bold font-manrope bg-stone-100/10 border border-stone-200/20 text-stone-400 rounded-full select-none">
                          Temporarily Unavailable
                        </div>
                      ) : (
                        <>
                          {inCartCount > 0 ? (
                            <div className={`flex items-center justify-between rounded-full px-2 py-1 select-none border ${
                              isHighlight
                                ? "bg-white/10 border-white/20"
                                : "bg-fresh-green/10 border-fresh-green/20"
                            }`}>
                              <button
                                onClick={(e) => { e.stopPropagation(); removeFromCart(p.id, e); }}
                                className={`p-1 hover:bg-beige/40 rounded-full ${isHighlight ? "text-cream-white" : "text-deep-green"}`}
                                title="Reduce Quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className={`text-[10px] font-black font-manrope ${isHighlight ? "text-cream-white" : "text-deep-green"}`}>✓ {inCartCount} Added</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); addToCart(p, e); }}
                                className={`p-1 hover:bg-beige/40 rounded-full ${isHighlight ? "text-cream-white" : "text-deep-green"}`}
                                title="Increase Quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(p)}
                              className={`text-xs font-bold font-manrope px-3 py-2.5 rounded-full transition-all ${
                                lastAddedItem === p.id 
                                  ? "bg-fresh-green text-white animate-pulse-soft" 
                                  : isHighlight 
                                  ? "bg-white/10 hover:bg-white/20 text-cream-white"
                                  : "bg-deep-green/5 hover:bg-deep-green/10 text-deep-green"
                              }`}
                            >
                              {lastAddedItem === p.id ? "✓ Added" : "+ Add to Order"}
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => handleOrderSingleProduct(p, e)}
                            className={`font-manrope text-xs font-extrabold px-3 py-2.5 rounded-full flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                              isHighlight
                                ? "bg-lime-green hover:bg-lime-green/90 text-deep-green"
                                : "bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-md shadow-green-500/15"
                            }`}
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                            Order Now
                          </button>
                        </>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}

          </div>

          {/* Large Standout Health Promo Box */}
          <div className="mt-12 bg-gradient-to-r from-deep-green to-[#124B39] rounded-[24px] border border-lime-green/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden text-white mb-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-green rounded-full blur-3xl opacity-10"></div>
            
            <div className="flex items-center gap-4">
              <div className="bg-lime-green/20 text-lime-green p-4 rounded-2xl shrink-0">
                <Leaf className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-manrope font-extrabold text-white">Custom Fitness Meal Planning?</h4>
                <p className="text-xs text-stone-200 max-w-lg mt-1 font-sans leading-relaxed">
                  Are you preparing for a training program, or battling distinct metabolism markers? Text Suresh on WhatsApp. We custom build sugar-free nutrition packs exactly according to clinical stats.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${businessState.shopWhatsApp.replace(/[+\s-]/g, "")}?text=Hi!%20I%20want%20to%20discuss%20a%20custom%20fitness%20meal%20plan%20for%20my%20goals.`}
              target="_blank"
              rel="noreferrer"
              className="bg-orange-cta hover:bg-orange-cta/90 text-white font-manrope text-xs font-bold px-6 py-3.5 rounded-full flex items-center gap-2 shrink-0 shadow-lg shadow-orange-cta/25"
            >
              Consult Chef on WhatsApp
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </section>
      )}

      {/* 4.5 WOMEN HEALTH SECTION (PREMIUM BENTO DESIGN) */}
      {selectedCategory === "all" && (
        <section id="women-health" className="relative py-20 px-4 bg-gradient-to-br from-cream-white via-rose-50/10 to-rose-100/20 text-dark-greenish-black overflow-hidden border-b border-deep-green/10">
        
        {/* Glow Effects */}
        <div className="absolute top-24 left-1/4 w-96 h-96 bg-rose-300 rounded-full opacity-[0.08] blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-300 rounded-full opacity-[0.06] blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 mb-12 border-b border-deep-green/10 pb-6">
            <div>
              <span className="text-pink-600 hover:scale-105 transition-transform inline-flex items-center gap-1.5 font-manrope text-xs font-black tracking-widest uppercase mb-1">
                <Heart className="w-4 h-4 text-pink-600 fill-pink-600/10" /> HORMONE & VITALITY WELLNESS
              </span>
              <h2 className="text-3xl md:text-5xl font-manrope font-extrabold tracking-tight text-deep-green">
                Nourishing <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-800 drop-shadow-sm">Women Health Zone</span>
              </h2>
              <p className="text-soft-gray text-sm max-w-xl mt-1.5 leading-relaxed font-sans">
                Formulations meticulously structured for hormonal sync, PCOS/PCOD defense, prenatal nutrients, biotin & collagen skin glow, and active organic vitality.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-[11px] font-bold tracking-wider uppercase text-pink-700">
                ♀️ PCOS Friendly
              </span>
              <span className="inline-block px-3 py-1 rounded-full bg-rose-100 border border-rose-200 text-[11px] font-bold tracking-wider uppercase text-rose-700">
                ✨ Biotin-Rich
              </span>
            </div>
          </div>

          {/* Bento-Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {womenHealthProducts.map((p, idx) => {
              // Custom indicators
              const isHighlight = p.id === "wh-1" || p.id === "wh-3";
              const isSoldOut = soldOutIds.includes(p.id) || p.availableQuantity === 0;
              const inCartCount = cart.find(item => item.product.id === p.id)?.quantity || 0;
              
              return (
                <div
                  key={`${p.id}-${idx}`}
                  onClick={() => setQuickViewProduct(p)}
                  className={`relative flex flex-col justify-between overflow-hidden rounded-[24px] border transition-all duration-300 card-glow ${
                    isSoldOut
                      ? "opacity-75 cursor-pointer"
                      : "hover:-translate-y-2 cursor-pointer"
                  } ${
                    isHighlight
                      ? "bg-gradient-to-b from-[#3b121c] to-[#1a050a] border-rose-900/40 shadow-xl text-white lg:col-span-1"
                      : "bg-white border-deep-green/5 hover:border-deep-green/15 shadow-md shadow-deep-green/5 text-dark-greenish-black"
                  } group`}
                >
                  
                  {/* Image Header */}
                  <div className="relative h-56 overflow-hidden bg-stone-900">
                    <img
                      src={p.bentoImage || p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-transform duration-500 opacity-90 ${
                        isSoldOut ? "grayscale contrast-75" : "group-hover:scale-105"
                      }`}
                    />
                    
                    {/* Floating Badges inside Card Image */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                      {p.isMostOrdered && (
                        <span className="bg-orange-cta text-white text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                          🔥 Most Ordered
                        </span>
                      )}
                      {p.isSugarFree && (
                        <span className={`text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                          isHighlight 
                            ? "bg-[#1a050a] text-pink-300 border border-pink-900/50" 
                            : "bg-pink-50 text-pink-700 border border-pink-100"
                        }`}>
                          Sugar Free
                        </span>
                      )}
                      {p.isPcodFriendly && (
                        <span className="bg-pink-600 text-white text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                          ♀️ PCOS Friendly
                        </span>
                      )}
                    </div>

                    <div className={`absolute bottom-4 right-4 backdrop-blur-sm px-3 py-1 rounded-xl text-right border ${
                      isHighlight 
                        ? "bg-[#1a050a]/80 border-white/10" 
                        : "bg-cream-white/85 border-deep-green/5"
                    }`}>
                      <span className={`text-[9px] font-mono font-bold block ${isHighlight ? "text-stone-300" : "text-stone-500"}`}>Calories</span>
                      <span className={`text-xs font-bold ${isHighlight ? "text-pink-300" : "text-deep-green"}`}>{p.calories} kcal ({p.servingSize})</span>
                    </div>

                    {/* Sold out overlay banner */}
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-600 text-white font-manrope font-black text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md border border-red-500/35 animate-pulse">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-baseline gap-2 mb-2">
                        <h3 className={`font-manrope font-extrabold text-base transition-colors ${
                          isSoldOut
                            ? "text-stone-400 line-through"
                            : isHighlight
                            ? "text-cream-white group-hover:text-pink-300"
                            : "text-dark-greenish-black group-hover:text-pink-600"
                        }`}>
                          {p.name}
                        </h3>
                        <div className="text-right shrink-0">
                          <span className={`font-manrope font-black text-base block ${
                            isSoldOut
                              ? "text-stone-400"
                              : isHighlight ? "text-pink-300" : "text-deep-green"
                          }`}>
                            ₹{p.price}
                          </span>
                          {renderStockLevel(p)}
                        </div>
                      </div>
                      
                      <p className={`text-xs leading-relaxed font-sans mt-1.5 ${
                        isHighlight ? "text-stone-300" : "text-soft-gray"
                      }`}>
                        {p.description}
                      </p>
                    </div>

                    {/* Features Tag Grid */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {p.isPcodFriendly && (
                        <span className="text-[10px] font-extrabold font-mono text-pink-600 px-2.5 py-0.5 rounded-full bg-pink-100 uppercase font-bold">
                          Hormone Friendly
                        </span>
                      )}
                      {p.id === "wh-3" && (
                        <span className="text-[10px] font-extrabold font-mono text-rose-600 px-2.5 py-0.5 rounded-full bg-rose-100 uppercase font-bold">
                          Biotin Support
                        </span>
                      )}
                      {p.id === "wh-4" && (
                        <span className="text-[10px] font-extrabold font-mono text-red-600 px-2.5 py-0.5 rounded-full bg-red-100 uppercase font-bold">
                          Iron Booster
                        </span>
                      )}
                      {p.id === "wh-5" && (
                        <span className="text-[10px] font-extrabold font-mono text-purple-600 px-2.5 py-0.5 rounded-full bg-purple-100 uppercase font-bold">
                          Prenatal Care
                        </span>
                      )}
                    </div>

                    {/* Quick Order Buttons */}
                    <div className={`grid grid-cols-2 gap-3 pt-4 border-t ${isHighlight ? "border-white/10" : "border-deep-green/5"}`} onClick={(e) => e.stopPropagation()}>
                      {isSoldOut ? (
                        <div className="col-span-2 py-2.5 text-center text-xs font-bold font-manrope bg-stone-100/10 border border-stone-200/20 text-stone-400 rounded-full select-none">
                          Temporarily Unavailable
                        </div>
                      ) : (
                        <>
                          {inCartCount > 0 ? (
                            <div className={`flex items-center justify-between rounded-full px-2 py-1 select-none border ${
                              isHighlight
                                ? "bg-white/10 border-white/20"
                                : "bg-fresh-green/10 border-fresh-green/20"
                            }`}>
                              <button
                                onClick={(e) => { e.stopPropagation(); removeFromCart(p.id, e); }}
                                className={`p-1 hover:bg-beige/40 rounded-full ${isHighlight ? "text-cream-white" : "text-deep-green"}`}
                                title="Reduce Quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className={`text-[10px] font-black font-manrope ${isHighlight ? "text-cream-white" : "text-deep-green"}`}>✓ {inCartCount} Added</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); addToCart(p, e); }}
                                className={`p-1 hover:bg-beige/40 rounded-full ${isHighlight ? "text-cream-white" : "text-deep-green"}`}
                                title="Increase Quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => addToCart(p, e)}
                              className={`text-xs font-bold font-manrope px-3 py-2.5 rounded-full transition-all ${
                                lastAddedItem === p.id 
                                  ? "bg-pink-600 text-white animate-pulse-soft" 
                                  : isHighlight 
                                  ? "bg-white/10 hover:bg-white/20 text-cream-white"
                                  : "bg-deep-green/5 hover:bg-deep-green/10 text-deep-green"
                              }`}
                            >
                              {lastAddedItem === p.id ? "✓ Added" : "+ Add to Order"}
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => handleOrderSingleProduct(p, e)}
                            className={`font-manrope text-xs font-extrabold px-3 py-2.5 rounded-full flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                              isHighlight
                                ? "bg-pink-500 hover:bg-pink-600 text-white"
                                : "bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-md shadow-green-500/15"
                            }`}
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                            Order Now
                          </button>
                        </>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}

          </div>

          {/* Large Standout Women Health Promo Box */}
          <div className="mt-12 bg-gradient-to-r from-[#2B0E15] to-[#120508] rounded-[24px] border border-rose-900/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden text-white mb-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500 rounded-full blur-3xl opacity-10"></div>
            
            <div className="flex items-center gap-4">
              <div className="bg-pink-500/20 text-pink-400 p-4 rounded-2xl shrink-0">
                <Heart className="w-8 h-8 fill-pink-400/20" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-manrope font-extrabold text-white">Concierge Hormone & Fertility Consultation?</h4>
                <p className="text-xs text-stone-200 max-w-lg mt-1 font-sans leading-relaxed">
                  Tailoring high-potency diets for postpartum recovery, PCOS relief protocols, or optimal prenatal wellness? Text Chef Suresh to coordinate dairy-free, sugar-controlled, plant-derived customized packs based on dietary stats.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${businessState.shopWhatsApp.replace(/[+\s-]/g, "")}?text=Hi!%20I%20want%20to%20discuss%20a%20custom%20wellness%20plan%20for%20women%20health%20goals.`}
              target="_blank"
              rel="noreferrer"
              className="bg-pink-600 hover:bg-pink-700 text-white font-manrope text-xs font-bold px-6 py-3.5 rounded-full flex items-center gap-2 shrink-0 shadow-lg shadow-pink-600/25"
            >
              Consult Chef on WhatsApp
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </section>
      )}

      {/* 5. MENU CARD DESIGN / GENERAL MENU SECTION */}
      <section id="menu-section" className="py-20 px-4 max-w-7xl mx-auto">
        
        {/* Category Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-fresh-green inline-block font-manrope text-xs font-black tracking-widest uppercase mb-1">
            🌱 PREMIUM SELECTIONS
          </span>
          <h2 className="text-3xl md:text-5xl font-manrope font-extrabold tracking-tight text-deep-green">
            {selectedCategory === "all" ? "The Full Healthy Menu" : CATEGORIES.find(c => c.id === selectedCategory)?.name}
          </h2>
          <p className="text-soft-gray text-sm mt-3 font-sans leading-relaxed">
            {selectedCategory === "all" 
              ? "Healthy high-quality smoothies, natural delights, and brownies cooked with organic milk products and healthy alternate sweeteners." 
              : CATEGORIES.find(c => c.id === selectedCategory)?.description}
          </p>

          {/* Quick results indicator */}
          <div className="mt-4 text-xs font-mono text-soft-gray">
            Showing <span className="text-deep-green font-bold">{filteredProducts.length}</span> items in the catalog
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-deep-green/10 shadow-sm max-w-lg mx-auto">
            <Search className="w-10 h-10 text-stone-300 mx-auto mb-4" />
            <h4 className="font-manrope font-bold text-lg text-deep-green">No match found</h4>
            <p className="text-xs text-soft-gray mt-1 px-4">There are no smoothies or organic desserts matching &quot;{searchQuery}&quot;.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 inline-block bg-deep-green hover:bg-deep-green/90 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-sm"
            >
              Clear Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p, idx) => {
              const inCartCount = cart.find(item => item.product.id === p.id)?.quantity || 0;
              const isAddedJustNow = lastAddedItem === p.id;
              const isSoldOut = soldOutIds.includes(p.id) || p.availableQuantity === 0;

              return (
                <div
                  key={`${p.id}-${idx}`}
                  onClick={() => setQuickViewProduct(p)}
                  className={`bg-white rounded-[24px] border border-deep-green/15 shadow-md shadow-deep-green/5 ${
                    isSoldOut
                      ? "opacity-75"
                      : "hover:shadow-lg hover:border-fresh-green/35 transition-all duration-300 hover:-translate-y-1"
                  } group flex flex-col justify-between overflow-hidden cursor-pointer`}
                >
                  
                  {/* Card Thumbnail Image */}
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        isSoldOut ? "grayscale contrast-75" : "group-hover:scale-105"
                      }`}
                    />
                    
                    {/* Badge Category label */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-deep-green/10 px-3 py-0.5 rounded-full text-[9px] font-extrabold font-mono text-deep-green uppercase shadow-xs">
                      {CATEGORIES.find(c => c.id === p.category)?.name.split(" ")[0]}
                    </div>
                    
                    {/* Add visual count notification if in-cart */}
                    {inCartCount > 0 && (
                      <div className="absolute top-3 right-3 bg-orange-cta text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                        {inCartCount} in order
                      </div>
                    )}

                    {/* Sold out overlay banner */}
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-600 text-white font-manrope font-black text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md border border-red-500/35 animate-pulse">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info Column */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-3 text-left">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className={`font-manrope font-extrabold text-sm ${
                          isSoldOut 
                            ? "text-stone-400 line-through" 
                            : "text-dark-greenish-black group-hover:text-fresh-green"
                        } transition-colors leading-snug line-clamp-2`}>
                          {p.name}
                        </h3>
                        <div className="text-right shrink-0">
                          <span className={`font-manrope font-black text-sm block ${
                            isSoldOut ? "text-stone-400" : "text-deep-green"
                          }`}>
                            ₹{p.price}
                          </span>
                          {renderStockLevel(p)}
                        </div>
                      </div>
                      
                      <p className="text-xs text-soft-gray leading-relaxed font-sans line-clamp-2 mt-1.5">
                        {p.description}
                      </p>
                    </div>

                    {/* Button Operations */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-deep-green/5" onClick={(e) => e.stopPropagation()}>
                      {isSoldOut ? (
                        <div className="col-span-2 py-2 text-center text-xs font-bold font-manrope bg-stone-100 text-stone-400 rounded-full border border-stone-200 select-none">
                          Temporarily Unavailable
                        </div>
                      ) : (
                        <>
                          {inCartCount > 0 ? (
                            <div className="flex items-center justify-between bg-fresh-green/10 border border-fresh-green/20 rounded-full px-2 py-1 select-none">
                              <button
                                onClick={(e) => removeFromCart(p.id, e)}
                                className="p-1 hover:bg-beige/40 rounded-full text-deep-green"
                                title="Reduce Quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-[10px] font-black font-manrope text-deep-green">✓ {inCartCount} Added</span>
                              <button
                                onClick={(e) => addToCart(p, e)}
                                className="p-1 hover:bg-beige/40 rounded-full text-deep-green"
                                title="Increase Quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => addToCart(p, e)}
                              className={`text-xs font-bold font-manrope px-3 py-2 rounded-full transition-all ${
                                isAddedJustNow
                                  ? "bg-fresh-green text-white"
                                  : "bg-deep-green/5 text-deep-green hover:bg-deep-green/10"
                              }`}
                            >
                              {isAddedJustNow ? "✓ Added" : "+ Add"}
                            </button>
                          )}

                          <button
                            onClick={(e) => handleOrderSingleProduct(p, e)}
                            className="bg-lime-green hover:bg-lime-green/95 text-deep-green font-manrope text-xs font-extrabold px-3 py-2 rounded-full flex items-center justify-center gap-1 transition-all text-center cursor-pointer"
                          >
                            <WhatsAppIcon className="w-3 h-3" />
                            Order
                          </button>
                        </>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. INSTANT WHATSAPP FLOATING ORDER ALERT BOARD */}
      <section className="bg-gradient-to-r from-deep-green to-deep-green/90 py-14 px-4 text-cream-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-lime-green rounded-full opacity-[0.05] blur-3xl"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
          <div className="bg-lime-green/25 text-lime-green p-3.5 rounded-full animate-bounce">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-2xl sm:text-4xl font-manrope font-extrabold leading-tight tracking-tight">
            Order Directly on WhatsApp for Super-Fast Delivery!
          </h3>
          <p className="text-sm text-stone-300 max-w-xl -mt-2 leading-relaxed font-sans">
            There is no complex logins, password resets, or checking out. Choose your items, tap order, and finalize payment and delivery instantly directly with Chef Suresh Kumar Challa on WhatsApp.
          </p>
          <a
            href={`https://wa.me/${businessState.shopWhatsApp.replace(/[+\s-]/g, "")}?text=Hello!%20I%20am%20browsing%20your%20website%20and%20want%20to%20order%20delicious%20smoothies.`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-manrope font-extrabold px-8 py-4 rounded-full shadow-lg shadow-green-500/25 text-sm"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Quick Order on WhatsApp
          </a>
        </div>
      </section>

      {/* 7. ABOUT SECTION (Suresh Kumar Challa exclusive - strictly singular owner) */}
      <section id="about" className="py-20 px-4 bg-cream-white border-b border-deep-green/10">
        <div className="max-w-6xl mx-auto font-sans">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Owner Image */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-fresh-green to-lime-green rounded-[24px] blur-md opacity-25"></div>
              <div className="relative bg-stone-100 rounded-[28px] overflow-hidden shadow-xl aspect-square lg:aspect-[4/5]">
                <img
                  src={businessState.ownerImage}
                  alt={businessState.ownerName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Decorative overlay tag */}
                <div className="absolute bottom-6 left-6 right-6 bg-deep-green/95 backdrop-blur-md p-4 rounded-[20px] border border-white/10 shadow-lg text-left">
                  <h4 className="font-manrope font-bold text-base text-cream-white">{businessState.ownerName}</h4>
                  <p className="text-xs text-lime-green font-mono">{businessState.ownerTitle}</p>
                </div>
              </div>
            </div>

            {/* Owner Details */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <div>
                <span className="text-fresh-green inline-block font-manrope text-xs font-black tracking-widest uppercase mb-1">
                  👨‍🍳 MEET THE CHEF & OWNER
                </span>
                <h2 className="text-3xl md:text-5xl font-manrope font-extrabold tracking-tight text-deep-green">
                  Crafting Nutrition <br />With High Culinary Passion
                </h2>
              </div>

              <div className="text-soft-gray text-sm leading-relaxed space-y-6 font-sans max-w-xl">
                {((businessState as any).aboutParagraphs || []).map((para: string, idx: number) => {
                  const hasWomenMention = para.includes("women") || para.includes("PCOD") || para.includes("cramps");
                  
                  if (hasWomenMention) {
                    return (
                      <div
                        key={idx}
                        className="bg-rose-50/50 border border-rose-100/85 p-6 rounded-[24px] shadow-sm relative overflow-hidden text-left"
                      >
                        {/* Soft heart pattern decoration in corner */}
                        <div className="absolute -right-4 -bottom-4 text-rose-100/45 pointer-events-none">
                          <Heart className="w-24 h-24 stroke-[1.5]" />
                        </div>
                        
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="p-2.5 bg-rose-100/80 text-rose-600 rounded-xl mt-0.5 shrink-0 flex items-center justify-center">
                            <Heart className="w-5 h-5 fill-rose-500/10 stroke-[2.5]" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-manrope font-black tracking-widest text-rose-500 block mb-1">
                              Special Focus: Women’s Wellness Support
                            </span>
                            <p className="text-stone-800 font-medium text-sm leading-relaxed">
                              {para.split(/(women dealing with PCOD and menstrual cramps)/i).map((part, i) => {
                                if (part.toLowerCase() === "women dealing with PCOD and menstrual cramps".toLowerCase()) {
                                  return (
                                    <span key={i} className="text-rose-700 bg-rose-100/50 px-1.5 py-0.5 rounded font-extrabold">
                                      {part}
                                    </span>
                                  );
                                }
                                return part;
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <p key={idx} className="text-stone-600">
                      {para}
                    </p>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md pt-4 border-t border-deep-green/10 font-sans">
                <div className="p-4 bg-beige/35 rounded-[16px] border border-deep-green/5 text-left">
                  <span className="block font-extrabold text-sm text-deep-green font-manrope">100% Personal</span>
                  <span className="text-xs text-soft-gray mt-0.5 block leading-tight">Every item blended and prepared by Chef Suresh Kumar Challa.</span>
                </div>
                <div className="p-4 bg-beige/35 rounded-[16px] border border-deep-green/5 text-left">
                  <span className="block font-extrabold text-sm text-deep-green font-manrope">Local Produce</span>
                  <span className="text-xs text-soft-gray mt-0.5 block leading-tight">Berries and greens fetched daily from urban organic fields.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. CONTACT SECTION WITH GOOGLE MAP EMBED */}
      <section id="contact" className="py-20 px-4 bg-cream-white/70">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 font-sans">
          
          {/* Info Card Column */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6 text-left">
            <div>
              <span className="text-fresh-green inline-block font-manrope text-xs font-black tracking-widest uppercase mb-1">
                📍 VISIT OUR CAFE
              </span>
              <h2 className="text-3xl md:text-4xl font-manrope font-extrabold tracking-tight text-deep-green">
                Have A Chat Over <br />Healthy Pure Smoothies
              </h2>
              <p className="text-soft-gray text-xs mt-2 max-w-sm leading-relaxed">
                Drop by our physical organic kitchen layouts. We offer fresh seating layouts and clinical health advice.
              </p>
            </div>

            {/* Address details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1 gap-4">
              
              <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-deep-green/5">
                <div className="bg-fresh-green/10 text-fresh-green p-2.5 rounded-xl shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-manrope font-extrabold text-xs text-deep-green uppercase tracking-wide">Physical Address</span>
                  <p className="text-xs text-stone-600 font-sans mt-0.5 leading-relaxed">{businessState.shopAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-deep-green/5">
                <div className="bg-fresh-green/10 text-fresh-green p-2.5 rounded-xl shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-manrope font-extrabold text-xs text-deep-green uppercase tracking-wide">Opening Hours</span>
                  <p className="text-xs text-stone-600 font-sans mt-0.5">{businessState.openingHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-deep-green/5">
                <div className="bg-[#25D366]/10 text-[#25D366] p-2.5 rounded-xl shrink-0">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-manrope font-extrabold text-xs text-deep-green uppercase tracking-wide">Inquiry & Chat</span>
                  <p className="text-xs text-stone-600 font-sans mt-0.5">Phone: {businessState.shopPhone}</p>
                  <p className="text-xs text-stone-600 font-sans">WhatsApp: {businessState.shopWhatsApp}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-deep-green/5">
                <div className="bg-fresh-green/10 text-fresh-green p-2.5 rounded-xl shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-manrope font-extrabold text-xs text-deep-green uppercase tracking-wide">Follow Lifestyle</span>
                  <a href={businessState.instagramLink} target="_blank" rel="noreferrer" className="text-xs text-fresh-green font-bold font-sans hover:underline mt-0.5 block">
                    {businessState.instagramHandle}
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Form and Map embed */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6">
            
            {/* Simple Form redirecting to WhatsApp */}
            <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-deep-green/10 shadow-sm text-left">
              <h3 className="font-manrope font-extrabold text-lg text-deep-green mb-1">Send a Message (Submit to WhatsApp)</h3>
              <p className="text-xs text-soft-gray mb-6">Need a bulk event menu or special allergy customized meals? Complete the details below.</p>
              
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-deep-green font-manrope font-extrabold uppercase">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Chef Suresh Kumar Challa"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="bg-cream-white border border-deep-green/10 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-deep-green"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-deep-green font-manrope font-extrabold uppercase">Phone Number</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 99999 88888"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="bg-cream-white border border-deep-green/10 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-deep-green"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-deep-green font-manrope font-extrabold uppercase">Your Message</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your organic food queries, sweet level adjustment, bulk event catering questions, etc..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="bg-cream-white border border-deep-green/10 px-4 py-3 text-xs rounded-xl focus:outline-none focus:border-deep-green resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-orange-cta hover:bg-orange-cta/90 text-white font-manrope font-bold text-xs py-3.5 rounded-full flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-cta/20 cursor-pointer mt-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit to WhatsApp Directly
                </button>
              </form>
            </div>

            {/* Google Maps embed with safe features */}
            <div className="rounded-[24px] overflow-hidden border border-deep-green/10 shadow-sm h-64 bg-stone-100">
              <iframe
                title="Shiva Refresh physical location"
                src={businessState.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

      {/* 9. CART SLIDE-OVER DRAWER FOR MULTI-ITEM ORDERING */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Overlay */}
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-dark-greenish-black/45 backdrop-blur-sm transition-opacity"
          ></div>

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white text-dark-greenish-black shadow-2xl flex flex-col justify-between">
              
              {/* Drawer Header */}
              <div className="px-6 py-5 bg-deep-green text-cream-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-lime-green" />
                  <h3 className="text-base font-manrope font-extrabold uppercase tracking-wide">
                    Your Order Cart ({totalItemsCount})
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-full text-cream-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body - Items list */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar">
                {cart.length === 0 ? (
                  <div className="my-auto text-center py-10">
                    <div className="bg-cream-white w-16 h-16 rounded-full flex items-center justify-center text-stone-400 mx-auto mb-4 border border-deep-green/5">
                      <ShoppingBag className="w-7 h-7 text-deep-green" />
                    </div>
                    <h4 className="font-manrope font-bold text-deep-green text-lg">Your cart is empty</h4>
                    <p className="text-xs text-soft-gray mt-1.5 max-w-xs mx-auto">
                      Add delicious organic super-berry smoothies, wellness bowls or gym salads from our menu card layout.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 bg-deep-green text-white font-manrope text-xs font-bold px-5 py-2.5 rounded-full"
                    >
                      Browse Healthy Food
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-soft-gray font-mono">Select multiple items to build a WhatsApp package</span>
                      <button
                        onClick={clearCart}
                        className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                      </button>
                    </div>

                    <div className="flex flex-col gap-3.5">
                      {cart.map((item, idx) => (
                        <div
                           key={`${item.product.id}-${idx}`}
                           className="flex items-center gap-3 bg-cream-white/75 p-3 rounded-[16px] border border-deep-green/5 hover:border-deep-green/15 transition-colors text-left"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-lg object-cover ring-1 ring-stone-200"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-manrope font-bold text-xs text-dark-greenish-black truncate">
                              {item.product.name}
                            </h4>
                            <p className="text-xs text-stone-500 font-mono mt-0.5">
                              ₹{item.product.price} x {item.quantity}
                            </p>
                          </div>

                          {/* Control */}
                          <div className="flex items-center gap-2 border border-deep-green/5 rounded-full p-1 bg-white">
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-1 hover:bg-stone-100 rounded-full text-stone-600"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold px-1">{item.quantity}</span>
                            <button
                              onClick={() => addToCart(item.product)}
                              className="p-1 hover:bg-stone-100 rounded-full text-stone-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => deleteFromCart(item.product.id)}
                            className="text-stone-400 hover:text-red-500 p-1 rounded"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="px-6 py-5 border-t border-deep-green/10 bg-cream-white/60 flex flex-col gap-4">
                  <div className="flex justify-between items-baseline">
                    <span className="font-manrope font-extrabold text-sm text-deep-green">Estimated Total:</span>
                    <span className="font-manrope font-black text-xl text-deep-green">₹{cartTotal}</span>
                  </div>
                  
                  <div className="bg-white p-3 rounded-xl border border-deep-green/10 text-[11px] text-stone-600 leading-relaxed font-sans text-left">
                    🌱 <span className="font-bold text-deep-green">Note:</span> Tapping below will compile all products in your cart into a single message and route you directly to Chef Suresh&apos;s WhatsApp!
                  </div>

                  <button
                    onClick={sendCartToWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] hover:scale-[1.01] transition-transform text-white text-center py-3.5 rounded-full font-manrope font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    SEND ORDER ON WHATSAPP (₹{cartTotal})
                  </button>
                  <p className="text-[10px] text-soft-gray text-center font-mono mt-1">
                    Order directly with local shop for super fast organic delivery
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 10. PRODUCT QUICK VIEW MODAL COMPONENT */}
      {quickViewProduct && (() => {
        const inCartCount = cart.find(item => item.product.id === quickViewProduct.id)?.quantity || 0;
        const isSoldOut = soldOutIds.includes(quickViewProduct.id) || quickViewProduct.availableQuantity === 0;
        
        return (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center px-4">
            <div
              onClick={() => setQuickViewProduct(null)}
              className="absolute inset-0 bg-[#0F3D2E]/50 backdrop-blur-xs transition-opacity"
            ></div>

            <div className="relative bg-white text-dark-greenish-black rounded-[28px] overflow-hidden shadow-2xl max-w-lg w-full z-10 border border-deep-green/10 animate-fade-in text-left">
              
              {/* Thumbnail Image */}
              <div className="relative h-64 bg-stone-100">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute top-4 left-4">
                  <span className="bg-deep-green text-lime-green text-[10px] uppercase font-mono font-bold px-3 py-1 rounded-full border border-white/5">
                    {CATEGORIES.find(c => c.id === quickViewProduct.category)?.name}
                  </span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 flex flex-col gap-4">
                <div>
                  <div className="flex justify-between items-baseline gap-4">
                    <h3 className="font-manrope font-extrabold text-xl text-deep-green">
                      {quickViewProduct.name}
                    </h3>
                    <div className="text-right">
                      <span className="font-manrope font-black text-xl text-fresh-green block">
                        ₹{quickViewProduct.price}
                      </span>
                      {renderStockLevel(quickViewProduct)}
                    </div>
                  </div>
                  {quickViewProduct.calories && (
                    <span className="text-xs font-mono text-soft-gray mt-1.5 block">
                      ⚡ Serving: {quickViewProduct.servingSize} • Calories: {quickViewProduct.calories} kcal
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {quickViewProduct.description}
                </p>

                {/* Tag Details */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(quickViewProduct.isSugarFree || quickViewProduct.category === "health-zone") && (
                    <span className="bg-lime-green/25 text-deep-green text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-deep-green/10">
                      🚫 No Sugar
                    </span>
                  )}
                  {quickViewProduct.isHighProtein && (
                    <span className="bg-orange-cta/10 text-orange-cta text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                      💪 High Protein
                    </span>
                  )}
                  {quickViewProduct.isPcodFriendly && (
                    <span className="bg-purple-50 text-purple-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-purple-550/10">
                      ♀️ PCOD Friendly
                    </span>
                  )}
                  {quickViewProduct.isGymFriendly && (
                    <span className="bg-fresh-green/10 text-fresh-green text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                      🏋️ Gym Friendly
                    </span>
                  )}
                </div>

                {/* Action Operations inside Quick view */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-100 mt-2">
                  {isSoldOut ? (
                    <div className="col-span-2 text-center py-3.5 bg-red-50 text-red-600 font-manrope text-xs font-black rounded-full border border-red-100/50 select-none uppercase tracking-wider animate-pulse-soft">
                      ⚠️ Currently Out of Stock
                    </div>
                  ) : (
                    <>
                      {inCartCount > 0 ? (
                        <div className="flex items-center justify-between bg-fresh-green/10 border border-fresh-green/20 rounded-full px-3 py-1.5 select-none">
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFromCart(quickViewProduct.id, e); }}
                            className="p-1 hover:bg-beige/40 rounded-full text-deep-green"
                            title="Reduce Quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black font-manrope text-deep-green">✓ {inCartCount} Added</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); addToCart(quickViewProduct, e); }}
                            className="p-1 hover:bg-beige/40 rounded-full text-deep-green"
                            title="Increase Quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            addToCart(quickViewProduct);
                            setIsCartOpen(true);
                          }}
                          className="bg-deep-green/5 hover:bg-deep-green/10 text-deep-green font-manrope text-xs font-bold py-3.5 rounded-full transition-all text-center"
                        >
                          Add & View Cart
                        </button>
                      )}
                      
                      <button
                        onClick={(e) => {
                          handleOrderSingleProduct(quickViewProduct, e);
                          setQuickViewProduct(null);
                        }}
                        className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-manrope text-xs font-black py-3.5 rounded-full flex items-center justify-center gap-1.5 transition-all text-center shadow-md shadow-green-500/25 cursor-pointer"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                        Order on WhatsApp
                      </button>
                    </>
                  )}
                </div>

              </div>

            </div>
          </div>
        );
      })()}

      {/* 11. FOOTER SECTION */}
      <footer className="bg-deep-green text-cream-white pt-16 pb-8 border-t border-white/10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Logo & Slogan Column */}
          <div className="md:col-span-4 flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2">
              <div className="bg-lime-green/15 text-lime-green p-2.5 rounded-xl border border-lime-green/20">
                <Leaf className="w-5 h-5 text-lime-green" />
              </div>
              <span className="text-lg font-manrope font-extrabold tracking-tight">
                Shiva<span className="text-fresh-green">Refresh</span>
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              We craft cold organic smoothies, fitness fruit bowls, traditional baked Kunafas, and whipped mousse cups tailored beautifully for metabolic wellness. No refined sugars, no chemical binders.
            </p>
          </div>

          {/* Categories Jump links column */}
          <div className="md:col-span-4 text-left">
            <h4 className="font-manrope font-extrabold text-xs uppercase tracking-wider text-lime-green mb-4">
              Our Fresh Categories
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-300">
              <a href="#menu-pills" onClick={() => handleSelectCategory("health-zone")} className="hover:text-fresh-green transition-colors">⚡ Health Zone</a>
              <a href="#menu-pills" onClick={() => handleSelectCategory("berry-smoothies")} className="hover:text-fresh-green transition-colors">🍓 Berry smoothies</a>
              <a href="#menu-pills" onClick={() => handleSelectCategory("dryfruit-smoothies")} className="hover:text-fresh-green transition-colors">🥜 Dryfruit smoothies</a>
              <a href="#menu-pills" onClick={() => handleSelectCategory("fruit-smoothies")} className="hover:text-fresh-green transition-colors">🍍 Fruit Smoothies</a>
              <a href="#menu-pills" onClick={() => handleSelectCategory("kunafa")} className="hover:text-fresh-green transition-colors">🥮 Baked Kunafa</a>
              <a href="#menu-pills" onClick={() => handleSelectCategory("women-health")} className="hover:text-fresh-green transition-colors">🌸 Women Health</a>
            </div>
          </div>

          {/* Timing Column */}
          <div className="md:col-span-4 text-left">
            <h4 className="font-manrope font-extrabold text-xs uppercase tracking-wider text-lime-green mb-4">
              Shiva Refresh
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              ⏰ Daily: {businessState.openingHours} <br />
              📞 Call / WhatsApp: {businessState.shopPhone} <br />
              🏢 Address: {businessState.shopAddress}
            </p>
          </div>

        </div>

        {/* License & Bottom Line */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/5 text-center text-[11px] text-stone-400 font-sans flex flex-col sm:flex-row justify-between gap-4">
          <p>© 2026 Shiva Refresh. All rights reserved. Personally blended by Suresh Kumar Challa.</p>
          <p className="flex items-center justify-center gap-1">
            Made for <span className="text-lime-green font-bold text-xs">Vibe Coding WhatsApp Ordering</span>
          </p>
        </div>
      </footer>

      {/* Persistent Sticky Order Bar for Mobile */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-deep-green border-t border-white/10 p-4 z-40 md:hidden flex justify-between items-center text-cream-white animate-fade-in text-left">
          <div>
            <span className="text-[10px] font-mono text-stone-300 uppercase tracking-widest block">Your Order Qty</span>
            <span className="font-manrope font-black text-sm">{totalItemsCount} items • ₹{cartTotal}</span>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-orange-cta hover:bg-orange-cta/90 text-white font-manrope text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-1 animate-pulse-whatsapp"
          >
            <ShoppingBag className="w-4 h-4" />
            Check Cart
          </button>
        </div>
      )}

      {/* Floating Global Circular WhatsApp Button */}
      <a
        href={`https://wa.me/${businessState.shopWhatsApp.replace(/[+\s-]/g, "")}?text=Hi!%20I%20visited%20your%20website%20and%20want%20to%20place%20an%20order.`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-white animate-pulse-whatsapp"
        title="Direct Chat & Order on WhatsApp"
      >
        <WhatsAppIcon className="w-6 h-6" />
      </a>

      {/* 13. ADMINISTRATIVE PASSCODE PROMPT MODAL */}
      {passcodeModalOpen && (
        <div className="fixed inset-0 z-55 overflow-hidden flex items-center justify-center px-4 font-sans text-stone-900">
          <div
            onClick={() => setPasscodeModalOpen(false)}
            className="absolute inset-0 bg-dark-greenish-black/45 backdrop-blur-xs transition-opacity"
          ></div>

          <form
            onSubmit={handleVerifyPasscode}
            className="relative bg-white text-dark-greenish-black rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full z-10 border border-deep-green/10 animate-fade-in text-left p-6 sm:p-8"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-deep-green/5 text-deep-green p-2.5 rounded-xl border border-deep-green/10">
                  <Lock className="w-5 h-5 text-deep-green" />
                </div>
                <div>
                  <h3 className="font-manrope font-black text-sm uppercase tracking-wider text-deep-green">
                    Chef Portal Access
                  </h3>
                  <span className="text-[10px] text-soft-gray font-mono">Administrative verification required</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed font-sans mt-1">
                Enter the master chef passcode below to access active order streams, menu catalogue CRUD editor, and cafe profile settings.
              </p>

              <div className="flex flex-col gap-1 mt-2">
                <input
                  type="password"
                  required
                  placeholder="Master Passcode"
                  value={passcodeInput}
                  onChange={(e) => {
                    setPasscodeInput(e.target.value);
                    setPasscodeError("");
                  }}
                  className="w-full border border-stone-300 p-3 rounded-xl font-mono text-center tracking-widest text-lg outline-none focus:border-[#0A261D]"
                  maxLength={4}
                  autoFocus
                />
                {passcodeError && (
                  <span className="text-[10px] text-red-500 font-mono mt-1 font-bold text-center">
                    ❌ {passcodeError}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setPasscodeModalOpen(false);
                    setPasscodeInput("");
                    setPasscodeError("");
                  }}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-manrope text-xs font-bold py-3 rounded-xl transition-all text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-deep-green hover:bg-deep-green/90 text-white font-manrope text-xs font-black py-3 rounded-xl transition-all text-center cursor-pointer shadow-md shadow-deep-green/10"
                >
                  Verify Ingress ✓
                </button>
              </div>

            </div>
          </form>
        </div>
      )}

    </div>
  );
}
