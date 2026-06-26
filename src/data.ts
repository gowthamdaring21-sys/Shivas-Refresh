import { Product, Category } from "./types";

import hz1Image from "./assets/images/regenerated_image_1780112461347.png";
import hz2Image from "./assets/images/regenerated_image_1780112463398.png";
import hz5Image from "./assets/images/regenerated_image_1780112465240.png";
import hz6Image from "./assets/images/regenerated_image_1780112466974.png";
import hz8Image from "./assets/images/regenerated_image_1780120343904.png";
import hz8MenuImage from "./assets/images/regenerated_image_1780125474360.jpg";
import hz8BentoImage from "./assets/images/regenerated_image_1780125479947.jpg";
import wh4Image from "./assets/images/regenerated_image_1780121707837.jpg";
import wh2Image from "./assets/images/regenerated_image_1780121937562.jpg";
import wh3Image from "./assets/images/regenerated_image_1780121939521.jpg";
import wh5Image from "./assets/images/regenerated_image_1780125337055.jpg";
import ownerChefImage from "./assets/images/regenerated_image_1780126479249.jpg";
import bs1Image from "./assets/images/regenerated_image_1780113144491.png";
import bs2Image from "./assets/images/regenerated_image_1780113148275.png";
import bentoHz1 from "./assets/images/regenerated_image_1780112451663.png";
import bentoHz2 from "./assets/images/regenerated_image_1780112454379.png";
import bentoHz5 from "./assets/images/regenerated_image_1780112456738.png";
import bentoHz6 from "./assets/images/regenerated_image_1780112458994.png";
import bs3Image from "./assets/images/regenerated_image_1780113314577.png";
import bs4Image from "./assets/images/regenerated_image_1780113318044.png";
import bs5Image from "./assets/images/regenerated_image_1780113321119.png";
import bs6Image from "./assets/images/regenerated_image_1780113324296.png";
import dfs1Image from "./assets/images/regenerated_image_1780113674912.png";
import dfs2Image from "./assets/images/regenerated_image_1781240327444.png";
import dfs3Image from "./assets/images/regenerated_image_1781240330899.png";
import dfs4Image from "./assets/images/regenerated_image_1781240332550.png";
import dfs5Image from "./assets/images/regenerated_image_1781240337187.png";
import dfs6Image from "./assets/images/regenerated_image_1781240340838.png";

import fs1Image from "./assets/images/regenerated_image_1780114983826.png";
import fs2Image from "./assets/images/regenerated_image_1781240344679.png";
import fs3Image from "./assets/images/regenerated_image_1781240347515.png";
import fs4Image from "./assets/images/regenerated_image_1781240350185.jpg";
import fs5Image from "./assets/images/regenerated_image_1781240352003.png";
import fs6Image from "./assets/images/regenerated_image_1781240354649.png";
import fs7Image from "./assets/images/regenerated_image_1781240357377.png";

import de1Image from "./assets/images/regenerated_image_1780115003792.png";
import de2Image from "./assets/images/regenerated_image_1780115008051.png";
import de3Image from "./assets/images/regenerated_image_1780115012006.png";
import de4Image from "./assets/images/regenerated_image_1780115016193.png";

import kf1Image from "./assets/images/regenerated_image_1780115020390.png";
import kf2Image from "./assets/images/regenerated_image_1780115024078.png";
import kf3Image from "./assets/images/regenerated_image_1780115027773.png";
import kf4Image from "./assets/images/regenerated_image_1780115031557.png";
import kf5Image from "./assets/images/regenerated_image_1780115035271.png";
import kf6Image from "./assets/images/regenerated_image_1780115039026.jpg";

import ml1Image from "./assets/images/regenerated_image_1780115050258.jpg";
import ml2Image from "./assets/images/regenerated_image_1780115040355.jpg";
import ml3Image from "./assets/images/regenerated_image_1780115052039.jpg";
import ml4Image from "./assets/images/regenerated_image_1780115041989.png";
import ml5Image from "./assets/images/regenerated_image_1780115053154.jpg";

import bc1Image from "./assets/images/regenerated_image_1780122756048.png";
import bc2Image from "./assets/images/regenerated_image_1780122758215.png";
import bc3Image from "./assets/images/regenerated_image_1780122760168.png";
import bc4Image from "./assets/images/regenerated_image_1780122761939.png";
import bc5Image from "./assets/images/regenerated_image_1780122763523.png";
import bc6Image from "./assets/images/regenerated_image_1780122912749.png";
import bc7Image from "./assets/images/regenerated_image_1780123019899.jpg";

export const CATEGORIES: Category[] = [
  {
    id: "health-zone",
    name: "HEALTH ZONE",
    description: "Premium fitness bowls, low-sugar and high-protein creations curated for high performance & lifestyle.",
    iconName: "Sparkles"
  },
  {
    id: "women-health",
    name: "WOMEN HEALTH",
    description: "Nourishing formulations optimized for hormonal balance, PCOS/PCOD wellness, prenatal care, hair & skin glow, and active vitality.",
    iconName: "Heart"
  },
  {
    id: "berry-smoothies",
    name: "BERRY SMOOTHIES",
    description: "Antioxidant-packed super-berry blends made with 100% organic berries & fresh natural yogurt.",
    iconName: "Apple"
  },
  {
    id: "dryfruit-smoothies",
    name: "DRYFRUIT SMOOTHIES",
    description: "Powerhouse smoothies packed with premium nuts, almonds, dates, and rich natural bases.",
    iconName: "Nut"
  },
  {
    id: "fruit-smoothies",
    name: "FRUIT SMOOTHIES",
    description: "Lively, sun-ripened local and exotic fresh fruits blended to perfection without artificial syrups.",
    iconName: "Citrus"
  },
  {
    id: "delights",
    name: "DELIGHTS",
    description: "Sweet delicate pulpy purees layered beautifully with fresh cream and natural textures.",
    iconName: "Grape"
  },
  {
    id: "kunafa",
    name: "KUNAFA",
    description: "Artisan vermicelli nested delicacies baked golden-crisp with sweet cheesy or nutty infusions.",
    iconName: "FlameKindling"
  },
  {
    id: "malai",
    name: "MALAI",
    description: "Traditional slow-simmered rich clotted cream layers mixed with fresh fruit compotes.",
    iconName: "CupSoda"
  },
  {
    id: "brownies-cakes",
    name: "BROWNIES & CAKES",
    description: "Decadent organic chocolate fudge squares and whipped mousse cups crafted for fine cheat-days.",
    iconName: "Cookie"
  }
];

const ALL_PRODUCTS: Product[] = [
  // HEALTH ZONE (MOST IMPORTANT)
  {
    id: "hz-1",
    name: "Dry Fruits Bowl",
    price: 139,
    category: "health-zone",
    description: "Premium power bowl containing activated walnuts, organic almonds, dates, dried figs, and wild forest honey.",
    image: hz1Image,
    bentoImage: bentoHz1,
    isGymFriendly: true,
    isHighProtein: true,
    isMostOrdered: true,
    servingSize: "280g",
    calories: 340
  },
  {
    id: "hz-2",
    name: "Oat Meal (Weight Gain)",
    price: 129,
    category: "health-zone",
    description: "Slow-cooked rolled steel-cut oats in organic almond milk, loaded with chia seeds, flax seeds & fresh apple slivers.",
    image: hz2Image,
    bentoImage: bentoHz2,
    isGymFriendly: true,
    isSugarFree: true,
    servingSize: "300g",
    calories: 280
  },
  {
    id: "hz-8",
    name: "Oat Meal (Weight Loss)",
    price: 119,
    category: "health-zone",
    description: "Low-calorie organic oats simmered in light almond milk and water, topped with antioxidant-rich fresh raspberries, chia seeds, and a hint of organic stevia.",
    image: hz8MenuImage,
    bentoImage: hz8BentoImage,
    isGymFriendly: true,
    isSugarFree: true,
    servingSize: "300g",
    calories: 180
  },
  {
    id: "hz-3",
    name: "High Protein Salad",
    price: 119,
    category: "health-zone",
    description: "Tossed local green sprouts, soft paneer cubes, boiled chickpeas, and organic veggies in an olive oil herb dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
    isHighProtein: true,
    isGymFriendly: true,
    isSugarFree: true,
    servingSize: "250g",
    calories: 220
  },
  {
    id: "hz-4",
    name: "Bowl for Gym Freaks",
    price: 139,
    category: "health-zone",
    description: "Ultimate post-workout bowl with broccoli, boiled chickpea clusters, pumpkin seeds, peanut dressing, and organic greens.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80",
    isGymFriendly: true,
    isHighProtein: true,
    isMostOrdered: true,
    servingSize: "320g",
    calories: 390
  },
  {
    id: "hz-5",
    name: "Strawberry & Mulberry Smoothie (Sugar Free)",
    price: 159,
    category: "health-zone",
    description: "Fresh high-mountain strawberry, wild mulberry pulp, stevia leaf sweetener, and low-fat unsweetened Greek yogurt.",
    image: hz5Image,
    bentoImage: bentoHz5,
    isSugarFree: true,
    isGymFriendly: true,
    servingSize: "350ml",
    calories: 140
  },
  {
    id: "hz-6",
    name: "Blue Berry for PCOD",
    price: 189,
    category: "health-zone",
    description: "Highly focused wellness blend crafted with premium blueberries, spearmint extracts, flaxseeds, and sugar-free almond milk.",
    image: hz6Image,
    bentoImage: bentoHz6,
    isPcodFriendly: true,
    isSugarFree: true,
    isMostOrdered: true,
    servingSize: "350ml",
    calories: 165
  },
  {
    id: "hz-7",
    name: "Diabetic Free Bowl",
    price: 169,
    category: "health-zone",
    description: "Diabetic-friendly blend featuring organic raw cucumber, fresh mint, chia seeds, apple cider dressing, and crisp fiber greens.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
    isDiabeticFriendly: true,
    isSugarFree: true,
    servingSize: "280g",
    calories: 110
  },

  // WOMEN HEALTH
  {
    id: "wh-1",
    name: "Blueberry for PCOD (Sugar Free)",
    price: 189,
    category: "women-health",
    description: "Highly focused wellness blend of premium wild blueberries, antioxidants, organic spearmint flakes, sugar-free almond milk, flaxseeds, and prebiotic fiber.",
    image: hz6Image,
    bentoImage: bentoHz6,
    isPcodFriendly: true,
    isSugarFree: true,
    isMostOrdered: true,
    servingSize: "350ml",
    calories: 165
  },
  {
    id: "wh-2",
    name: "Avocado Smoothie (Sugar Free)",
    price: 179,
    category: "women-health",
    description: "Creamy organic Hass avocados whipped with organic Maca root, baby spinach, pumpkin seeds, and clean chia seeds to support active endocrine health.",
    image: wh2Image,
    isPcodFriendly: true,
    isSugarFree: true,
    servingSize: "320ml",
    calories: 220
  },
  {
    id: "wh-3",
    name: "Berry Smoothie (Sugar Free)",
    price: 169,
    category: "women-health",
    description: "Vibrant high-vitamin beauty bowl of red raspberries, fresh strawberries, organic aloe vera pulp, pure coconut water, and a sprinkle of organic hemp hearts.",
    image: wh3Image,
    isPcodFriendly: true,
    isSugarFree: true,
    isMostOrdered: true,
    servingSize: "300g",
    calories: 195
  },
  {
    id: "wh-4",
    name: "Berries Mix (Sugar Free)",
    price: 179,
    category: "women-health",
    description: "An antioxidant-rich, hormone-balancing luxury blend of organic strawberries, red raspberries, wild blackberries, and unsweetened Greek yogurt topped with pumpkin seeds.",
    image: wh4Image,
    isPcodFriendly: true,
    isSugarFree: true,
    servingSize: "320g",
    calories: 180
  },
  {
    id: "wh-5",
    name: "Cramp Buster",
    price: 169,
    category: "women-health",
    description: "A comforting womb-friendly blend of warm ginger infusion, magnesium-rich dark cocoa, sweet cherries, flaxseeds, and unsweetened almond milk to gently soothe cramps and lift spirits.",
    image: wh5Image,
    isPcodFriendly: true,
    isSugarFree: true,
    servingSize: "350ml",
    calories: 145
  },

  // BERRY SMOOTHIES
  {
    id: "bs-1",
    name: "Berry Mix Smoothie",
    price: 199,
    category: "berry-smoothies",
    description: "Super antioxidant blend of frozen blackberries, blue forest berries, strawberries, and sweetened organic curd.",
    image: bs1Image
  },
  {
    id: "bs-2",
    name: "Blackberry Smoothie",
    price: 179,
    category: "berry-smoothies",
    description: "Rich dark high-flavor blackberry pulp thoroughly whipped with fresh chilled dairy and organic mountain honey.",
    image: bs2Image
  },
  {
    id: "bs-3",
    name: "Blueberry Smoothie",
    price: 179,
    category: "berry-smoothies",
    description: "Vibrant wild blueberry clusters blended silky smooth with nutritious oats and dairy base.",
    image: bs3Image
  },
  {
    id: "bs-4",
    name: "Mulberry Smoothie",
    price: 139,
    category: "berry-smoothies",
    description: "Sweet and crisp indigenous mulberry juice pulp slow-whipped with creamy unsweetened Greek yogurt.",
    image: bs4Image
  },
  {
    id: "bs-5",
    name: "Raspberry Smoothie",
    price: 179,
    category: "berry-smoothies",
    description: "Zesty-tangy raspberry nectar blended perfectly with chilled fresh cream and a drop of real vanilla bean extract.",
    image: bs5Image
  },
  {
    id: "bs-6",
    name: "Strawberry Smoothie",
    price: 129,
    category: "berry-smoothies",
    description: "An absolute evergreen favorite featuring succulent Mahabaleshwar strawberries blended into ice-cold premium cream.",
    image: bs6Image
  },

  // DRYFRUIT SMOOTHIES
  {
    id: "dfs-1",
    name: "Anjeer Smoothie",
    price: 129,
    category: "dryfruit-smoothies",
    description: "Gourmet sun-dried figs (Anjeer) softened overnight and double blended with dynamic low-fat honeyed milk.",
    image: dfs1Image
  },
  {
    id: "dfs-2",
    name: "Badam Bliss Smoothie",
    price: 129,
    category: "dryfruit-smoothies",
    description: "Rich traditional dry fruit blend with crushed blanched almonds, sweet dates, and a pinch of aromatic saffron.",
    image: dfs2Image
  },
  {
    id: "dfs-3",
    name: "Cashew Smoothie",
    price: 129,
    category: "dryfruit-smoothies",
    description: "Thick luxury textured shake showcasing raw and roasted Konkan cashews whipped with organic dates.",
    image: dfs3Image
  },
  {
    id: "dfs-4",
    name: "Coconut Smoothie",
    price: 119,
    category: "dryfruit-smoothies",
    description: "Rich hydrated tropical blend of sweet tender coconut pulp and cold-pressed fresh coconut cream.",
    image: dfs4Image
  },
  {
    id: "dfs-5",
    name: "Nutty Powder Smoothie",
    price: 149,
    category: "dryfruit-smoothies",
    description: "Supercharged nutrition powerhouse made of hand-ground walnut, almond, pecan, and cashew multi-nut powder.",
    image: dfs5Image
  },
  {
    id: "dfs-6",
    name: "Pistachio Smoothie",
    price: 139,
    category: "dryfruit-smoothies",
    description: "Irresistible emerald pistachio nut cream emulsion, rich, buttery, and incredibly velvety.",
    image: dfs6Image
  },

  // FRUIT SMOOTHIES
  {
    id: "fs-1",
    name: "Avacado Smoothie",
    price: 189,
    category: "fruit-smoothies",
    description: "Buttery green fresh Hass avocados whipped with ice and a touch of light liquid cane sugar helper.",
    image: fs1Image
  },
  {
    id: "fs-2",
    name: "Dragonfruit Smoothie",
    price: 169,
    category: "fruit-smoothies",
    description: "Vibrant neon pink organic dragon fruit (pitaya) blended with tropical banana chunks and fresh curd.",
    image: fs2Image
  },
  {
    id: "fs-3",
    name: "Kiwi Smoothie",
    price: 129,
    category: "fruit-smoothies",
    description: "Refreshing and tangy emerald kiwi fruit pulp high in vitamin C, custom blended with honey.",
    image: fs3Image
  },
  {
    id: "fs-4",
    name: "Mango Smoothie",
    price: 129,
    category: "fruit-smoothies",
    description: "Golden delicious premium Alphonso mango chunks blended to a thick, sun-kissed, creamy smoothie.",
    image: fs4Image
  },
  {
    id: "fs-5",
    name: "Papaya Smoothie",
    price: 129,
    category: "fruit-smoothies",
    description: "Mellow-flavored sunrise papaya cubes whipped with a light organic milk base and dates for sweet texture.",
    image: fs5Image
  },
  {
    id: "fs-6",
    name: "Pineapple Smoothie",
    price: 129,
    category: "fruit-smoothies",
    description: "Tangy-sweet fresh pineapple chunks blended icy-cold for an instant refreshing breeze.",
    image: fs6Image
  },
  {
    id: "fs-7",
    name: "Promogranate Smoothie",
    price: 139,
    category: "fruit-smoothies",
    description: "Cold-pressed ruby pomegranate pearls whipped with a yogurt cream base for a tart-sweet antioxidant booster.",
    image: fs7Image
  },

  // DELIGHTS
  {
    id: "de-1",
    name: "Apricot Delight",
    price: 129,
    category: "delights",
    description: "Beautiful dessert layers showing authentic Moroccan dried apricot compote and luxurious whipped cream.",
    image: de1Image
  },
  {
    id: "de-2",
    name: "Coconut Delight",
    price: 119,
    category: "delights",
    description: "Exquisite layered mix of sweet tender coconut shavings, raw coconut gelatin pulp, and dynamic thick cream.",
    image: de2Image
  },
  {
    id: "de-3",
    name: "Mango Delight",
    price: 139,
    category: "delights",
    description: "Delicious sundae featuring layered mango pieces, mango pureed extract, and thick sweet whipped cream droplets.",
    image: de3Image
  },
  {
    id: "de-4",
    name: "Pineapple Delight",
    price: 129,
    category: "delights",
    description: "Sweet caramelized high-flavor pineapple rings diced and folded into rich dairy custard and cream foam.",
    image: de4Image
  },
 
  // KUNAFA
  {
    id: "kf-1",
    name: "Caramel Kunafa",
    price: 189,
    category: "kunafa",
    description: "Golden baked pastry vermicelli nest filled with cheese and generously drizzled with artisan warm caramel sauce.",
    image: kf1Image
  },
  {
    id: "kf-2",
    name: "Creamy Kunafa",
    price: 159,
    category: "kunafa",
    description: "Baked middle-eastern delicacy with premium crispy pastry threads enveloping a light whipped milk cream.",
    image: kf2Image
  },
  {
    id: "kf-3",
    name: "Nutty Kunafa",
    price: 179,
    category: "kunafa",
    description: "Perfect golden-orange vermicelli layer loaded with chopped roasted almonds, cashews, and dates.",
    image: kf3Image
  },
  {
    id: "kf-4",
    name: "Classic Chessy Kunafa",
    price: 179,
    category: "kunafa",
    description: "Hot baked Kunafa containing premium melted elastic Akkawi cheese, drizzled lightly with orange blossom sugar syrup.",
    image: kf4Image
  },
  {
    id: "kf-5",
    name: "Pistachio Kunafa",
    price: 189,
    category: "kunafa",
    description: "Delectable baked vermicelli nest loaded with premium ground emerald pistachios and custom condensed cream.",
    image: kf5Image
  },
  {
    id: "kf-6",
    name: "Chocolate Kunafa",
    price: 199,
    category: "kunafa",
    description: "Modern fusion of crisp roasted vermicelli threads layered over warm melted Belgian dark chocolate sauce.",
    image: kf6Image
  },

  // MALAI
  {
    id: "ml-1",
    name: "Mango Malai",
    price: 129,
    category: "malai",
    description: "Lively rich, slow-cooked clotted milk cream (Malai) cup layered beautifully with Alfonso mango chunks.",
    image: ml1Image
  },
  {
    id: "ml-2",
    name: "Coconut Malai",
    price: 119,
    category: "malai",
    description: "Indulgent natural recipe containing sweetened heavy clotted farm cream layered with raw tender coconut gelatin.",
    image: ml2Image
  },
  {
    id: "ml-3",
    name: "Strawberry Malai",
    price: 139,
    category: "malai",
    description: "Tart fresh mountain strawberries sliced and mixed into sweet slow-simmered rich creamy malai layers.",
    image: ml3Image
  },
  {
    id: "ml-4",
    name: "Pineapple Malai",
    price: 119,
    category: "malai",
    description: "Mouth-watering sweet pineapple cubes infused in premium dynamic cold clotted milk malai.",
    image: ml4Image
  },
  {
    id: "ml-5",
    name: "Berries Malai",
    price: 149,
    category: "malai",
    description: "Velvety clotted cream bowl loaded with forest-picked sweet raspberries, mulberries, and blueberries.",
    image: ml5Image
  },

  // BROWNIES & CAKES
  {
    id: "bc-1",
    name: "Brownie",
    price: 89,
    category: "brownies-cakes",
    description: "Gourmet dark cocoa classic chocolate brownie baked with a soft, dense chewy fudgy core.",
    image: bc1Image
  },
  {
    id: "bc-2",
    name: "Chocolate Brownie",
    price: 99,
    category: "brownies-cakes",
    description: "Double chocolate fudge brownie with chocolate chips baked in, covered with warm fudge coat.",
    image: bc2Image
  },
  {
    id: "bc-3",
    name: "Triple Chocolate Brownie",
    price: 129,
    category: "brownies-cakes",
    description: "Decadent creation featuring layers of dark cocoa chips, milk chocolate base, and white chocolate swirls.",
    image: bc3Image
  },
  {
    id: "bc-4",
    name: "Chocolate Mousse",
    price: 119,
    category: "brownies-cakes",
    description: "Fluffy, light whipped premium eggless cocoa mousse served beautifully in a clear crystal cup.",
    image: bc4Image
  },
  {
    id: "bc-5",
    name: "Brownie Beast Chocolate",
    price: 145,
    category: "brownies-cakes",
    description: "Exquisite giant warm fudge brownie laced heavily with chocolate shavings and artisan sweet cocoa syrup.",
    image: bc5Image
  },
  {
    id: "bc-6",
    name: "Chocolate Tiramisu",
    price: 149,
    category: "brownies-cakes",
    description: "Premium coffee-soaked organic ladyfinger layers structured elegantly with whipped sweet mascarpone.",
    image: bc6Image
  },
  {
    id: "bc-7",
    name: "Mango Tiramisu",
    price: 159,
    category: "brownies-cakes",
    description: "Chilled ladyfinger layers soaked in sweet mango puree, beautifully layered with whipped mascarpone and fresh ripe mango pieces.",
    image: bc7Image
  }
];

export const PRODUCTS: Product[] = ALL_PRODUCTS.map(product => {
  const isSmoothieOrDrink = 
    product.category === "berry-smoothies" ||
    product.category === "dryfruit-smoothies" ||
    product.category === "fruit-smoothies" ||
    product.name.toLowerCase().includes("smoothie") ||
    product.name.toLowerCase().includes("shake") ||
    (product.servingSize && product.servingSize.toLowerCase().endsWith("ml"));

  if (isSmoothieOrDrink) {
    return {
      ...product,
      servingSize: "250ml"
    };
  }
  return product;
});

export const BUSINESS_INFO = {
  ownerName: "Chef Suresh Kumar Challa",
  ownerTitle: "Founder & Master Blend Artisan",
  ownerBio: "At Shiva Refresh, we believe that good health starts with the right nutrition. Our journey began with a simple mission: to provide fresh, healthy, and natural refreshments that support overall well-being.",
  aboutParagraphs: [
    "At Shiva Refresh, we believe that good health starts with the right nutrition. Our journey began with a simple mission: to provide fresh, healthy, and natural refreshments that support overall well-being.",
    "The inspiration behind Shiva Refresh came from recognizing the daily health challenges many people face, especially women dealing with PCOD and menstrual cramps. We wanted to create refreshing and nourishing options that not only taste great but also contribute to a healthier lifestyle. Our goal is to offer carefully selected ingredients that help promote wellness, energy, and comfort.",
    "Through this initiative, we aim to encourage healthier choices and make nutritious refreshments easily accessible to everyone. Every product is prepared with a focus on quality, freshness, and health benefits, helping our customers take a step toward a better and healthier life.",
    "At Shiva Refresh, health is not just our business—it's our purpose."
  ],
  ownerImage: ownerChefImage,
  shopAddress: "23-5-325/2, opp.mahila university, mahila university road, tirupati-517502",
  shopPhone: "+91 63015 22101",
  shopWhatsApp: "+916301522101", // for direct links
  instagramLink: "https://instagram.com/refresh_tasteofheaven",
  instagramHandle: "@refresh_tasteofheaven",
  openingHours: "Mon - Sun: 6:00 AM - 11:00 PM",
  mapsEmbedUrl: "https://maps.google.com/maps?q=23-5-325/2,%20opp.%20mahila%20university,%20mahila%20university%20road,%20tirupati%20517502&t=&z=15&ie=UTF8&iwloc=&output=embed"
};
