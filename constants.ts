
import { Province, FeaturedAttraction, Shop } from './types';
import { provinceImages, attractionImages, shopImages } from './image_assets';

export const PROVINCES: Province[] = [
  // Central
  { name: 'Bangkok', description: 'The vibrant capital, a city of contrasts with action at every turn.', imageUrl: provinceImages.Bangkok, region: 'Central', lat: 13.7563, lng: 100.5018 },
  { name: 'Ayutthaya', description: 'The former capital, rich in history with impressive ancient ruins.', imageUrl: provinceImages.Ayutthaya, region: 'Central', lat: 14.3524, lng: 100.5694 },
  { name: 'Ang Thong', description: 'Known for its handicrafts and the large reclining Buddha at Wat Pa Mok.', imageUrl: provinceImages['Ang Thong'], region: 'Central', lat: 14.588, lng: 100.4552 },
  { name: 'Chai Nat', description: 'A peaceful province on the Chao Phraya River basin, known for its large bird park.', imageUrl: provinceImages['Chai Nat'], region: 'Central', lat: 15.1856, lng: 100.1264 },
  { name: 'Lopburi', description: 'Famous for its ancient Khmer temples and the hordes of monkeys that roam the city.', imageUrl: provinceImages.Lopburi, region: 'Central', lat: 14.7983, lng: 100.6533 },
  { name: 'Nakhon Nayok', description: 'A gateway to Khao Yai National Park, offering waterfalls and nature.', imageUrl: provinceImages['Nakhon Nayok'], region: 'Central', lat: 14.2072, lng: 101.2131 },
  { name: 'Nakhon Pathom', description: 'Home to the giant Phra Pathom Chedi, the tallest stupa in the world.', imageUrl: provinceImages['Nakhon Pathom'], region: 'Central', lat: 13.818, lng: 100.062 },
  { name: 'Nonthaburi', description: 'A bustling province bordering Bangkok, known for its floating markets.', imageUrl: provinceImages.Nonthaburi, region: 'Central', lat: 13.861, lng: 100.518 },
  { name: 'Pathum Thani', description: 'An important center for education and research, with many universities.', imageUrl: provinceImages['Pathum Thani'], region: 'Central', lat: 14.020, lng: 100.531 },
  { name: 'Samut Prakan', description: 'Features the Erawan Museum and the impressive Ancient City outdoor museum.', imageUrl: provinceImages['Samut Prakan'], region: 'Central', lat: 13.599, lng: 100.597 },
  { name: 'Samut Sakhon', description: 'A major fishing port known for its abundance of fresh seafood.', imageUrl: provinceImages['Samut Sakhon'], region: 'Central', lat: 13.548, lng: 100.276 },
  { name: 'Samut Songkhram', description: 'Famous for the Maeklong Railway Market and Amphawa Floating Market.', imageUrl: provinceImages['Samut Songkhram'], region: 'Central', lat: 13.414, lng: 100.002 },
  { name: 'Saraburi', description: 'Known for its beautiful national parks and the revered Wat Phra Phutthabat.', imageUrl: provinceImages.Saraburi, region: 'Central', lat: 14.530, lng: 100.910 },
  { name: 'Sing Buri', description: 'A historic province known for its brave villagers who fought against Burmese invaders.', imageUrl: provinceImages['Sing Buri'], region: 'Central', lat: 14.891, lng: 100.404 },
  { name: 'Suphan Buri', description: 'A province with a long history, mentioned in ancient Thai legends.', imageUrl: provinceImages['Suphan Buri'], region: 'Central', lat: 14.471, lng: 100.119 },

  // North
  { name: 'Chiang Mai', description: 'The northern hub of culture, temples, and lush mountains.', imageUrl: provinceImages['Chiang Mai'], region: 'North', lat: 18.7883, lng: 98.9853 },
  { name: 'Chiang Rai', description: 'The gateway to the Golden Triangle, with the stunning White Temple.', imageUrl: provinceImages['Chiang Rai'], region: 'North', lat: 19.9095, lng: 99.8325 },
  { name: 'Kamphaeng Phet', description: 'Home to a UNESCO World Heritage historical park with ancient ruins.', imageUrl: provinceImages['Kamphaeng Phet'], region: 'North', lat: 16.483, lng: 99.522 },
  { name: 'Lampang', description: 'A charming city known for its horse-drawn carriages and unique temples.', imageUrl: provinceImages.Lampang, region: 'North', lat: 18.291, lng: 99.493 },
  { name: 'Lamphun', description: 'One of Thailand\'s oldest cities, with a rich history and beautiful temples.', imageUrl: provinceImages.Lamphun, region: 'North', lat: 18.577, lng: 99.009 },
  { name: 'Mae Hong Son', description: 'A mountainous province known for its mist-shrouded valleys and unique culture.', imageUrl: provinceImages['Mae Hong Son'], region: 'North', lat: 19.302, lng: 97.965 },
  { name: 'Nakhon Sawan', description: 'The "Heavenly City" where four major rivers converge.', imageUrl: provinceImages['Nakhon Sawan'], region: 'North', lat: 15.698, lng: 100.124 },
  { name: 'Nan', description: 'A quiet and remote province with stunning scenery and a slow pace of life.', imageUrl: provinceImages.Nan, region: 'North', lat: 18.777, lng: 100.779 },
  { name: 'Phayao', description: 'Known for the large and beautiful Kwan Phayao lake.', imageUrl: provinceImages.Phayao, region: 'North', lat: 19.163, lng: 99.904 },
  { name: 'Phetchabun', description: 'Features dramatic mountain scenery and cool climates.', imageUrl: provinceImages.Phetchabun, region: 'North', lat: 16.417, lng: 101.157 },
  { name: 'Phichit', description: 'The "Land of Crocodiles," with a rich history in Thai folklore.', imageUrl: provinceImages.Phichit, region: 'North', lat: 16.444, lng: 100.349 },
  { name: 'Phitsanulok', description: 'Home to the famous Phra Phuttha Chinnarat, one of Thailand\'s most beautiful Buddha images.', imageUrl: provinceImages.Phitsanulok, region: 'North', lat: 16.822, lng: 100.259 },
  { name: 'Phrae', description: 'A city with a rich Lanna heritage and many traditional teakwood houses.', imageUrl: provinceImages.Phrae, region: 'North', lat: 18.144, lng: 100.139 },
  { name: 'Sukhothai', description: 'The birthplace of the Thai nation, with a stunning historical park.', imageUrl: provinceImages.Sukhothai, region: 'North', lat: 17.009, lng: 99.824 },
  { name: 'Tak', description: 'A mountainous province bordering Myanmar, known for its trekking and nature.', imageUrl: provinceImages.Tak, region: 'North', lat: 16.861, lng: 99.125 },
  { name: 'Uthai Thani', description: 'A tranquil province known for its floating houses and natural beauty.', imageUrl: provinceImages['Uthai Thani'], region: 'North', lat: 15.378, lng: 100.027 },
  { name: 'Uttaradit', description: 'The "Port of the North," known for its delicious durian and long-history.', imageUrl: provinceImages.Uttaradit, region: 'North', lat: 17.625, lng: 100.093 },
  
  // Northeast (Isan)
  { name: 'Amnat Charoen', description: 'A peaceful province known for its Buddhist amulets.', imageUrl: provinceImages['Amnat Charoen'], region: 'Northeast', lat: 15.860, lng: 104.629 },
  { name: 'Bueng Kan', description: 'Thailand\'s newest province, with stunning Mekong River scenery.', imageUrl: provinceImages['Bueng Kan'], region: 'Northeast', lat: 18.361, lng: 103.652 },
  { name: 'Buriram', description: 'A province famous for its ancient Khmer ruins and modern international racing circuit.', imageUrl: provinceImages.Buriram, region: 'Northeast', lat: 14.995, lng: 103.102 },
  { name: 'Chaiyaphum', description: 'Known for its fields of Siamese tulips and beautiful national parks.', imageUrl: provinceImages.Chaiyaphum, region: 'Northeast', lat: 15.807, lng: 102.031 },
  { name: 'Kalasin', description: 'A major center for dinosaur fossils in Thailand.', imageUrl: provinceImages.Kalasin, region: 'Northeast', lat: 16.432, lng: 103.504 },
  { name: 'Khon Kaen', description: 'One of the major cities in Isan, known for its silk production.', imageUrl: provinceImages['Khon Kaen'], region: 'Northeast', lat: 16.447, lng: 102.833 },
  { name: 'Loei', description: 'A mountainous province with a cool climate, often called the "Switzerland of Thailand."', imageUrl: provinceImages.Loei, region: 'Northeast', lat: 17.486, lng: 101.729 },
  { name: 'Maha Sarakham', description: 'A center for education in the Isan region.', imageUrl: provinceImages['Maha Sarakham'], region: 'Northeast', lat: 16.182, lng: 103.303 },
  { name: 'Mukdahan', description: 'A province bordering Laos, known for the Ho Kaeo tower with panoramic views.', imageUrl: provinceImages.Mukdahan, region: 'Northeast', lat: 16.545, lng: 104.723 },
  { name: 'Nakhon Phanom', description: 'A charming province on the banks of the Mekong River.', imageUrl: provinceImages['Nakhon Phanom'], region: 'Northeast', lat: 17.407, lng: 104.781 },
  { name: 'Nakhon Ratchasima (Korat)', description: 'The largest province in Thailand and a gateway to the Isan region.', imageUrl: provinceImages['Nakhon Ratchasima (Korat)'], region: 'Northeast', lat: 14.972, lng: 102.099 },
  { name: 'Nong Bua Lamphu', description: 'A small province known for its archaeological sites.', imageUrl: provinceImages['Nong Bua Lamphu'], region: 'Northeast', lat: 17.207, lng: 102.443 },
  { name: 'Nong Khai', description: 'Famous for the mysterious Naga fireballs on the Mekong River.', imageUrl: provinceImages['Nong Khai'], region: 'Northeast', lat: 17.881, lng: 102.742 },
  { name: 'Roi Et', description: 'Known for its 101-meter-tall standing Buddha image.', imageUrl: provinceImages['Roi Et'], region: 'Northeast', lat: 16.054, lng: 103.652 },
  { name: 'Sakon Nakhon', description: 'A province with a rich history and strong Buddhist traditions.', imageUrl: provinceImages['Sakon Nakhon'], region: 'Northeast', lat: 17.159, lng: 104.148 },
  { name: 'Sisaket', description: 'Home to the stunning Preah Vihear sanctuary on the Cambodian border.', imageUrl: provinceImages.Sisaket, region: 'Northeast', lat: 15.119, lng: 104.323 },
  { name: 'Surin', description: 'Famous for its annual Elephant Round-up festival.', imageUrl: provinceImages.Surin, region: 'Northeast', lat: 14.883, lng: 103.493 },
  { name: 'Ubon Ratchathani', description: 'Known for its beautiful Candle Festival and stunning national parks.', imageUrl: provinceImages['Ubon Ratchathani'], region: 'Northeast', lat: 15.231, lng: 104.856 },
  { name: 'Udon Thani', description: 'A major commercial center and home to the Ban Chiang archaeological site.', imageUrl: provinceImages['Udon Thani'], region: 'Northeast', lat: 17.414, lng: 102.791 },
  { name: 'Yasothon', description: 'Famous for its spectacular Rocket Festival.', imageUrl: provinceImages.Yasothon, region: 'Northeast', lat: 15.794, lng: 104.141 },

  // South
  { name: 'Phuket', description: 'Thailand\'s largest island with stunning beaches and lively nightlife.', imageUrl: provinceImages.Phuket, region: 'South', lat: 7.9519, lng: 98.3381 },
  { name: 'Krabi', description: 'Home to iconic limestone karsts, clear waters, and beautiful islands.', imageUrl: provinceImages.Krabi, region: 'South', lat: 8.085, lng: 98.906 },
  { name: 'Chumphon', description: 'A gateway to the southern islands, with long, quiet beaches.', imageUrl: provinceImages.Chumphon, region: 'South', lat: 10.493, lng: 99.180 },
  { name: 'Nakhon Si Thammarat', description: 'One of the oldest cities in the south, with a rich cultural heritage.', imageUrl: provinceImages['Nakhon Si Thammarat'], region: 'South', lat: 8.437, lng: 99.963 },
  { name: 'Narathiwat', description: 'A culturally rich province in the deep south.', imageUrl: provinceImages.Narathiwat, region: 'South', lat: 6.426, lng: 101.822 },
  { name: 'Pattani', description: 'A province with a strong Malay cultural influence.', imageUrl: provinceImages.Pattani, region: 'South', lat: 6.868, lng: 101.253 },
  { name: 'Phang Nga', description: 'Famous for its stunning bay with hundreds of limestone cliffs and islands.', imageUrl: provinceImages['Phang Nga'], region: 'South', lat: 8.450, lng: 98.525 },
  { name: 'Phatthalung', description: 'A province known for its vast lake and wetland ecosystems.', imageUrl: provinceImages.Phatthalung, region: 'South', lat: 7.618, lng: 100.076 },
  { name: 'Ranong', description: 'Known for its long rainy season and natural hot springs.', imageUrl: provinceImages.Ranong, region: 'South', lat: 9.966, lng: 98.635 },
  { name: 'Satun', description: 'Home to the stunning Tarutao National Marine Park.', imageUrl: provinceImages.Satun, region: 'South', lat: 7.073, lng: 99.789 },
  { name: 'Songkhla', description: 'A major port and commercial hub in the south.', imageUrl: provinceImages.Songkhla, region: 'South', lat: 7.203, lng: 100.595 },
  { name: 'Surat Thani', description: 'The gateway to the popular islands of Koh Samui, Koh Phangan, and Koh Tao.', imageUrl: provinceImages['Surat Thani'], region: 'South', lat: 9.136, lng: 99.333 },
  { name: 'Trang', description: 'Known for its beautiful, unspoiled islands and delicious local food.', imageUrl: provinceImages.Trang, region: 'South', lat: 7.558, lng: 99.613 },
  { name: 'Yala', description: 'The southernmost province, known for its unique blend of cultures.', imageUrl: provinceImages.Yala, region: 'South', lat: 6.541, lng: 101.280 },
  
  // West
  { name: 'Kanchanaburi', description: 'Known for the River Kwai and its World War II history.', imageUrl: provinceImages.Kanchanaburi, region: 'West', lat: 14.021, lng: 99.531 },
  { name: 'Phetchaburi', description: 'A historic city with royal palaces, ancient temples, and beaches.', imageUrl: provinceImages.Phetchaburi, region: 'West', lat: 13.111, lng: 99.945 },
  { name: 'Prachuap Khiri Khan', description: 'Home to the popular resort town of Hua Hin.', imageUrl: provinceImages['Prachuap Khiri Khan'], region: 'West', lat: 11.808, lng: 99.794 },
  { name: 'Ratchaburi', description: 'Famous for its floating markets and beautiful caves.', imageUrl: provinceImages.Ratchaburi, region: 'West', lat: 13.537, lng: 99.818 },
  
  // East
  { name: 'Chachoengsao', description: 'A province with a large and revered Ganesha statue.', imageUrl: provinceImages.Chachoengsao, region: 'East', lat: 13.687, lng: 101.071 },
  { name: 'Chanthaburi', description: 'The "City of Gems," famous for its gem markets and fruit farming.', imageUrl: provinceImages.Chanthaburi, region: 'East', lat: 12.609, lng: 102.103 },
  { name: 'Chonburi', description: 'Home to the famous beach city of Pattaya.', imageUrl: provinceImages.Chonburi, region: 'East', lat: 13.361, lng: 100.985 },
  { name: 'Prachinburi', description: 'A province with abundant natural beauty and ancient ruins.', imageUrl: provinceImages.Prachinburi, region: 'East', lat: 14.050, lng: 101.371 },
  { name: 'Rayong', description: 'Known for its quiet beaches and as the gateway to Koh Samet.', imageUrl: provinceImages.Rayong, region: 'East', lat: 12.671, lng: 101.277 },
  { name: 'Sa Kaeo', description: 'A province bordering Cambodia, known for its cross-border markets.', imageUrl: provinceImages['Sa Kaeo'], region: 'East', lat: 13.818, lng: 102.072 },
  { name: 'Trat', description: 'The easternmost province, and the gateway to Koh Chang.', imageUrl: provinceImages.Trat, region: 'East', lat: 12.243, lng: 102.518 },
];

export const REGION_KEYS = [
  'Central',
  'North',
  'Northeast',
  'South',
  'West',
  'East'
] as const;

export const INTEREST_KEYS = [
  'culture',
  'adventure',
  'beaches',
  'food',
  'nightlife',
  'nature',
  'relaxation',
] as const;

export const FEATURED_ATTRACTIONS: FeaturedAttraction[] = [
  { key: 'monJam', name: 'Mon Jam', province: 'Chiang Mai', description: 'A stunning viewpoint with beautiful flower gardens and a cool mountain breeze.', imageUrl: attractionImages.monJam, lat: 18.9333, lng: 98.8167 },
  { key: 'roiEtTower', name: 'Roi Et Tower', province: 'Roi Et', description: 'A modern, 101-meter tall observation tower offering panoramic views of the city.', imageUrl: attractionImages.roiEtTower, lat: 16.058, lng: 103.655 },
  { key: 'grandPalace', name: 'The Grand Palace', province: 'Bangkok', description: 'A complex of stunning buildings that served as the official residence of the Kings of Siam.', imageUrl: attractionImages.grandPalace, lat: 13.749, lng: 100.492 },
  { key: 'mayaBay', name: 'Maya Bay', province: 'Krabi', description: 'A breathtakingly beautiful bay, famous for its turquoise water and white sand beach.', imageUrl: attractionImages.mayaBay, lat: 7.678, lng: 98.765 },
  { key: 'sukhothaiHistoricalPark', name: 'Sukhothai Historical Park', province: 'Sukhothai', description: 'The ruins of the first capital of Siam, a UNESCO World Heritage site.', imageUrl: attractionImages.sukhothaiHistoricalPark, lat: 17.017, lng: 99.704 },
  { key: 'whiteTemple', name: 'White Temple (Wat Rong Khun)', province: 'Chiang Rai', description: 'A unique, contemporary, and unconventional Buddhist temple designed in white.', imageUrl: attractionImages.whiteTemple, lat: 19.824, lng: 99.763 },
  { key: 'phanomRung', name: 'Phanom Rung', province: 'Buriram', description: 'A magnificent Khmer temple complex set on the rim of an extinct volcano.', imageUrl: attractionImages.phanomRung, lat: 14.532, lng: 102.939 },
  { key: 'doiInthanon', name: 'Doi Inthanon National Park', province: 'Chiang Mai', description: 'Home to the highest peak in Thailand, with beautiful pagodas and lush nature trails.', imageUrl: attractionImages.doiInthanon, lat: 18.588, lng: 98.487 },
  { key: 'jamesBondIsland', name: 'James Bond Island (Khao Phing Kan)', province: 'Phang Nga', description: 'Famous for its needle-like limestone karst that featured in a James Bond movie.', imageUrl: attractionImages.jamesBondIsland, lat: 8.274, lng: 98.500 },
  { key: 'erawanFalls', name: 'Erawan Falls', province: 'Kanchanaburi', description: 'A stunning seven-tiered waterfall with emerald green ponds in a lush national park.', imageUrl: attractionImages.erawanFalls, lat: 14.368, lng: 99.145 },
  { key: 'redLotusSea', name: 'Red Lotus Sea (Talay Bua Daeng)', province: 'Udon Thani', description: 'A spectacular lake where thousands of red lotus flowers bloom from December to February.', imageUrl: attractionImages.redLotusSea, lat: 17.183, lng: 103.050 },
  { key: 'railayBeach', name: 'Railay Beach', province: 'Krabi', description: 'A pristine beach accessible only by boat, framed by towering limestone cliffs.', imageUrl: attractionImages.railayBeach, lat: 8.012, lng: 98.837 },
];

export const LOCAL_SHOPS: Shop[] = [
  {
    id: 'jim-thompson-house-shop',
    name: 'Jim Thompson House Shop',
    province: 'Bangkok',
    description: 'Exquisite Thai silk products, from scarves to home decor, reflecting a rich heritage.',
    imageUrl: shopImages.jimThompsonHouseShop,
    tags: ['Thai Silk', 'Luxury', 'Souvenirs'],
    likeCount: 0,
    contact: {
      facebook: 'facebook.com/JimThompsonSilk',
      website: 'jimthompson.com'
    },
    products: [
        { 
          name: 'Heritage Silk Scarf', 
          price: '฿2,400', 
          description: 'A masterpiece of traditional Thai weaving. This scarf features an intricate heritage pattern, hand-woven from the finest locally sourced silk. Durable, luxurious, and timeless.',
          imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800',
          likeCount: 0
        },
        { 
          name: 'Classic Silk Tie', 
          price: '฿1,800', 
          description: 'Elevate your formal attire with this 100% Thai silk tie. Hand-crafted with a focus on vibrant color and a smooth finish that resists wrinkling.',
          imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800',
          likeCount: 0
        },
        { 
          name: 'Silk Cushion Cover', 
          price: '฿1,200', 
          description: 'Bring the luxury of the Jim Thompson house into your own home. These cushion covers feature traditional motifs and a hidden zipper for a clean look.',
          imageUrl: 'https://images.unsplash.com/photo-1584100996541-118817730e61?q=80&w=800',
          likeCount: 0
        }
    ]
  },
  {
    id: 'chiang-mai-night-bazaar',
    name: 'Chiang Mai Night Bazaar',
    province: 'Chiang Mai',
    description: 'A vibrant, sprawling market famous for its Lanna-style handicrafts, art, and clothing.',
    imageUrl: shopImages.chiangMaiNightBazaar,
    tags: ['Handicrafts', 'Art', 'Bargains'],
    likeCount: 0,
    contact: {
      phone: '081-123-4567'
    },
    products: [
        { 
          name: 'Hand-woven Hill Tribe Bag', 
          price: '฿850', 
          description: 'Unique shoulder bag created by Hmong artisans using traditional cross-stitch and indigo dyes. Each pattern tells a story of the high mountain villages.',
          imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800',
          likeCount: 0
        },
        { 
          name: 'Carved Teakwood Box', 
          price: '฿1,200', 
          description: 'Made from sustainable Thai teak, these boxes are hand-carved with floral Lanna motifs. Perfect for jewelry or small keepsakes.',
          imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=800',
          likeCount: 0
        }
    ]
  },
  {
    id: 'pranom-thai-herbal',
    name: 'Pranom Thai Herbal',
    province: 'Phuket',
    description: 'Authentic, locally-made herbal balms, essential oils, and spa products perfect for wellness.',
    imageUrl: shopImages.pranomThaiHerbal,
    tags: ['Herbal Goods', 'Wellness', 'Organic'],
    likeCount: 0,
    contact: {
      whatsapp: '+66891234567',
      facebook: 'facebook.com/PranomHerbalPhuket'
    },
    products: [
        { 
          name: 'Thai Massage Balm Set', 
          price: '฿450', 
          description: 'A set of three organic balms: Ginger (for muscle pain), Lemongrass (for energy), and Lavender (for sleep). Used by professional Thai massage therapists.',
          imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800',
          likeCount: 0
        },
        { 
          name: 'Lemon Grass Essential Oil', 
          price: '฿320', 
          description: 'Pure, concentrated lemongrass oil steam-distilled in Phuket. Perfect for aromatherapy or as a natural insect repellent.',
          imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9831168?q=80&w=800',
          likeCount: 0
        }
    ]
  },
  {
    id: 'otop-center',
    name: 'OTOP Center',
    province: 'Ayutthaya',
    description: 'Showcasing "One Tambon One Product" goods, from woven baskets to delicious local snacks.',
    imageUrl: shopImages.otopCenter,
    tags: ['Local Products', 'Crafts', 'Food'],
    likeCount: 0,
    contact: {
      phone: '035-123-456'
    }
  },
  {
    id: 'siam-celadon-chiang-mai',
    name: 'Siam Celadon',
    province: 'Chiang Mai',
    description: 'Masterfully crafted traditional Thai celadon ceramics with a unique cracked glaze finish.',
    imageUrl: shopImages.siamCeladon,
    tags: ['Ceramics', 'Lanna Style', 'Art'],
    likeCount: 0,
    contact: {
      facebook: 'facebook.com/SiamCeladon',
      website: 'siamceladon.com'
    },
    products: [
        { 
          name: 'Cracked Glaze Dinner Set', 
          price: '฿4,500', 
          description: 'A 4-piece set including a dinner plate, side plate, bowl, and mug. Features the signature Lanna green color and high-durability finish.',
          imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800',
          likeCount: 0
        },
        { 
          name: 'Lotus Petal Bowl', 
          price: '฿850', 
          description: 'A beautiful decorative bowl shaped like a lotus flower. Each petal is hand-carved before the final glaze is applied.',
          imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800',
          likeCount: 0
        }
    ]
  },
  {
    id: 'or-tor-kor-delicacies',
    name: 'Or Tor Kor Market Gourmet',
    province: 'Bangkok',
    description: 'The finest selection of Thai premium fruits, ready-to-eat meals, and rare ingredients.',
    imageUrl: shopImages.orTorKorMarket,
    tags: ['Premium Food', 'Fruit', 'Market'],
    likeCount: 0,
    contact: {
      phone: '02-279-2080',
      website: 'ortorkor.com'
    },
    products: [
        { 
          name: 'Premium Monthong Durian', 
          price: 'Seasonal', 
          description: 'Selected from the best orchards in Rayong. Each segment is checked for perfect ripeness and texture. Only the "Grade A" fruit makes it to our market.',
          imageUrl: 'https://images.unsplash.com/photo-1598449334855-6b64004291e0?q=80&w=800',
          likeCount: 0
        },
        { 
          name: 'Thai Mango Sticky Rice Kit', 
          price: '฿350', 
          description: 'Everything you need to make the perfect dessert: Thai glutinous rice, coconut cream, palm sugar, and dried mung beans. Mangos included in-store.',
          imageUrl: 'https://images.unsplash.com/photo-1621234714152-32a76f236e71?q=80&w=800',
          likeCount: 0
        }
    ]
  },
  {
    id: 'bo-sang-umbrella-center',
    name: 'Bo Sang Umbrella Centre',
    province: 'Chiang Mai',
    description: 'Watch artisans create famous hand-painted paper umbrellas and buy them as unique gifts.',
    imageUrl: shopImages.boSangUmbrellaMakingCentre,
    tags: ['Umbrellas', 'Hand-painted', 'Tradition'],
    likeCount: 0,
    contact: {
      facebook: 'facebook.com/BoSangHandicrafts',
      phone: '053-338-357'
    }
  },
  {
    id: 'ko-kret-terracotta',
    name: 'Ko Kret Mon Pottery',
    province: 'Nonthaburi',
    description: 'Hand-carved terracotta pottery made using ancient Mon techniques on the island of Ko Kret.',
    imageUrl: shopImages.koKretPottery,
    tags: ['Pottery', 'Mon Culture', 'Handmade'],
    likeCount: 0,
    contact: {
      whatsapp: '+66845678901',
      phone: '02-583-0000'
    }
  }
];
