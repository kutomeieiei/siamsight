
import { Shop } from './types';
import { shopImages } from './image_assets';

/**
 * ==============================================================================
 * SIAM SIGHT: MARKETPLACE CONFIGURATION ("THE BACKEND")
 * ==============================================================================
 * 
 * This file acts as your marketplace database. 
 */

export const INITIAL_SHOPS: Shop[] = [
  {
    id: 'Kanghan-Nam',
    nameEn: 'Kanghan Nam',
    nameTh: 'ร้านกังหันน้ำ',
    province: 'Khon Kaen',
    descriptionEn: 'The best restaurant in Khon Kaen. Lakeside atmosphere at Bueng Nong Khot.',
    descriptionTh: 'สุดยอดร้านอาหารในขอนแก่น บรรยากาศริมบึงหนองโคตรที่ผ่อนคลาย',
    imageUrl: 'https://ร้านกังหันน้ํา.com/wp-content/uploads/2024/07/DSC04104-1.png',
    tags: ['Food', 'Outdoor seating'],
    likeCount: 8,
    contact: {
      website: 'https://xn--12cm6cca9c1c4bcei0yja0d.com/',
      phone: '085-922-2584'
    },
    products: [
      { 
        nameEn: 'Salt-Crusted Grilled Fish',
        nameTh: 'ปลาช่อนเผาเกลือ', 
        price: '฿120', 
        descriptionEn: 'Signature grilled fish coated in salt for a perfectly moist and flavorful experience.',
        descriptionTh: 'เมนูซิกเนเจอร์ ปลาช่อนเผาเกลือเนื้อนุ่มรสชาติกลมกล่อม',
        imageUrl: 'https://ร้านกังหันน้ํา.com/wp-content/uploads/2024/06/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%81%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%82%E0%B8%AD%E0%B8%99%E0%B9%81%E0%B8%81%E0%B9%88%E0%B8%99-MainDishes17062024-640x640-1.png',
        likeCount: 3
      },
      { 
        nameEn: 'Deep-Fried Sea Bass with Fish Sauce',
        nameTh: 'ปลากะพงทอดน้ำปลา', 
        price: '฿140', 
        descriptionEn: 'Crispy golden sea bass drizzled with premium savory fish sauce.',
        descriptionTh: 'ปลากะพงทอดจนเหลืองทอง กรอบนอกนุ่มใน ราดด้วยซอสน้ำปลาสูตรเข้มข้น',
        imageUrl: 'https://ร้านกังหันน้ํา.com/wp-content/uploads/2024/06/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%81%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%82%E0%B8%AD%E0%B8%99%E0%B9%81%E0%B8%81%E0%B9%88%E0%B8%99-Appetizers17062024-640x640-1.png',
        likeCount: 3
      }
    ]
  },
  {
    id: 'krua-suwimol',
    nameEn: 'Krua Suwimol',
    nameTh: 'ครัวสุวิมล',
    province: 'Nakhon Ratchasima (Korat)',
    descriptionEn: 'Authentic local Thai restaurant in Korat known for fresh ingredients and traditional Isan flavors.',
    descriptionTh: 'ร้านอาหารไทยดั้งเดิมในโคราช ขึ้นชื่อเรื่องวัตถุดิบที่สดใหม่และรสชาติสไตล์อีสานแท้ๆ',
    imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyiAGBtAb3EGiO4eq7QEDAVKUQf78vpwsozXdMfGttbviWCPDuzNzuTvL7NHoGJv6mk7NpxWX-d1XcMhGrr35PpEX4lJHsmil9S9kwveB13X38FxnHDfUPHZDwJM2A0oAAmoDdJAxZwzSZt=w408-h306-k-no',
    tags: ['Traditional', 'Local Food'],
    likeCount: 4,
    contact: {
      phone: '081-071-5448'
    },
    products: [
      { 
        nameEn: 'Thai Omelet with Oyster',
        nameTh: 'ไข่เจียวหอยนางรม', 
        price: '฿79', 
        descriptionEn: 'Crispy and fluffy Thai-style omelet loaded with fresh, juicy oysters.',
        descriptionTh: 'ไข่เจียวกรอบฟูสไตล์ไทย อัดแน่นด้วยหอยนางรมสดรสหวาน',
        imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyPLZZ8rySw8u4SJSYTVxFE2QwXq2or7oFwH4hrmou3H9REHVM3zUuWEQEnAGBu5pchsOSQEdrIevvLZhjW5kFiUNPiRC76xtmEbqaxv2r6R9Ok4Z6K9f0kgbPfB9OHS4WMRvF3=w172-h224-p-k-no',
        likeCount: 4
      }
    ]
  },
  {
    id: 'juuat-cafe',
    nameEn: 'Jûuat Cafe',
    nameTh: 'จ๊วด คาเฟ่',
    province: 'Khon Kaen',
    descriptionEn: 'A trendy cafe in Khon Kaen with a relaxing atmosphere, great coffee, and delicious homemade desserts.',
    descriptionTh: 'คาเฟ่สุดชิคในขอนแก่น บรรยากาศน่านั่งพักผ่อน พร้อมกาแฟคุณภาพและขนมหวานโฮมเมดรสเยี่ยม',
    imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwt3VxNGkzyCvRy-L862yc_CXwwjd9-eRDcQFc7lED_C10sNYpz0XRfL-Kh1k1hToOkpBN0YifKEM9fTkGCbYVFpk-IFimfJxVSNSSNoh5yjnQSELN5lbOvLgtz124fgLCk2nizeA=w408-h306-k-no',
    tags: ['Cafe', 'Outdoor seating'],
    likeCount: 7,
    contact: {
      facebook: 'https://web.facebook.com/Juadcafe/?locale=th_TH&_rdc=1&_rdr#',
      phone: '091-063-4589'
    },
    products: [
      { 
        nameEn: 'Banana Sundae Ice Cream',
        nameTh: 'ไอศกรีมกล้วยซันเดย์', 
        price: '฿70', 
        descriptionEn: 'Creamy vanilla ice cream topped with fresh bananas, chocolate syrup, and whipped cream.',
        descriptionTh: 'ไอศกรีมวานิลลาเนื้อเนียน เสิร์ฟพร้อมกล้วยหอมสด ราดซอสช็อกโกแลตและวิปครีม',
        imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwM6kaKtKV8-j5DAcqfbZuwq0-q0v7fCB_9TZlgMTwKdYRX6oeeFiP7CcECI2K2N8MkgAx7n58wEPqWEIhBerFRpt82AO-EInhX5fajpIvttYAozjs3G5YDpmRu8eNm-zWMbrWb=w172-h224-p-k-no',
        likeCount: 4
      },
      { 
        nameEn: 'Butterfly Pea Honey Lemon',
        nameTh: 'อัญชันน้ำผึ้งมะนาว', 
        price: '฿40', 
        descriptionEn: 'Refreshing herbal drink made from butterfly pea flowers, wild honey, and fresh lime.',
        descriptionTh: 'เครื่องดื่มสมุนไพรคลายร้อนจากดอกอัญชัน ผสมน้ำผึ้งป่าและมะนาวสดรสเปรี้ยวหวานลงตัว',
        imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwRYLiCfC1WveVT2Fsj4KgZHvUge5xxZ615NcfPEuTFV5uf0641zU6wIKElx1BHm_fYFLrEp4C-fiXBN9jOzRwY2eE_4dKeCo7Lcp13cUFLUCZRk91Y72IUx13Svn1G-gooyaCF=w172-h224-p-k-no',
        likeCount: 5
      }
    ]
  },
  {
    id: 'top-stationery',
    nameEn: 'Top Stationery',
    nameTh: 'ท็อปเครื่องเขียน',
    province: 'Khon Kaen',
    descriptionEn: 'A comprehensive stationery store in Khon Kaen providing high-quality office supplies and school equipment.',
    descriptionTh: 'ร้านเครื่องเขียนครบวงจรในขอนแก่น จำหน่ายอุปกรณ์สำนักงานและเครื่องเขียนนักเรียนคุณภาพดี',
    imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSy-DxeAC4lyElhokri0bXRhLOj113MfwIZovF-JcSKU0IfgOS_Go2uplWBB9OOOolut5fFnO4bLaMz3y_IqaeOdMB7CysLeUpy_97VyxYKNHkjWjd9Ro7r_mktphsjtu2J5OeLecVZIj4G0=w408-h544-k-no',
    tags: ['Stationery', 'Office Supplies'],
    likeCount: 5,
    contact: {
      phone: '043-202-662'
    },
    products: [
    ]
  },
  {
    id: 'thai-rung',
    nameEn: 'Thai Rung',
    nameTh: 'ร้านไทยรุ่ง',
    province: 'Khon Kaen',
    descriptionEn: 'A reliable local store specializing in various tools and hardware for all your needs.',
    descriptionTh: 'ร้านขายอุปกรณ์เครื่องมือและฮาร์ดแวร์ท้องถิ่นที่เชื่อถือได้ พร้อมบริการที่ครอบคลุมทุกความต้องการ',
    imageUrl: 'https://scontent.fbkk12-5.fna.fbcdn.net/v/t39.30808-1/304756369_459990652853397_1886838849083454809_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=2d3e12&_nc_eui2=AeE00x1bxNAD2QTYW0PRyYJ8M0DtnWFnEZAzQO2dYWcRkOj7dZJPAIqS2T9LN3yrau1V9UgVzRANJfKmv4A3Sba-&_nc_ohc=xCCxCms-Sf0Q7kNvwHAMPht&_nc_oc=AdkprZatd6GvLGg1gyM1PthNUMjwQKOol-e-HTkqe8PFdns1D1-NfvIyKn-0m1lops__KLESsWVByyyv10_dVZxE&_nc_zt=24&_nc_ht=scontent.fbkk12-5.fna&_nc_gid=409DunZ80jw-208fxUkLmw&oh=00_AfqQIks8buDvv09wTr0IQkYJ00rEgtF259duXSNmjGskSw&oe=69613BD2',
    tags: ['Hardware', 'Tools'],
    likeCount: 4,
    contact: {
      facebook: 'https://www.facebook.com/thairungkk/',
      phone: '043-227-986'
    },
    products: [
    ]
  },
  {
    id: 'ava-minimart',
    nameEn: 'Ava Minimart',
    nameTh: 'ร้านเอวามินิมาร์ท',
    province: 'Khon Kaen',
    descriptionEn: 'A convenient local minimart in Khon Kaen offering a wide range of daily essentials and snacks.',
    descriptionTh: 'ร้านมินิมาร์ทท้องถิ่นในขอนแก่น จำหน่ายสินค้าอุปโภคบริโภคที่จำเป็นและขนมขบเคี้ยวหลากหลาย',
    imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipOcj45BhB1jRCp5dWwMZCzX0slbfM3IDDky9X5Z=w408-h543-k-no',
    tags: ['Minimart', 'Convenience Store'],
    likeCount: 4,
    contact: {
      phone: '087-951-0441'
    },
    products: [
    ]
  },
  {
    id: '22',
    nameEn: 'Porjai minimart',
    nameTh: 'พอใจ มินิมาร์ท',
    province: 'Khon Kaen',
    descriptionEn: '',
    descriptionTh: '',
    imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwkvl5jLfUD2C62KiHkmt-d81GNVHsmIYL95QoQLl01mPWR5ItScrt_WbXGKfA8QWxrP6wSFsjEENE3_PobIlClicHeoVEHhkgqhEdv_IK3_ygkyH2VM0baZXaZWxEY25b76PFD=w408-h723-k-no',
    tags: [],
    likeCount: 6,
    contact: {
      phone: '082 345 8109'
    },
    products: [
    ]
  },
  {
    id: '23',
    nameEn: 'Ruang Charoen',
    nameTh: 'เรืองเจริญ',
    province: 'Khon Kaen',
    descriptionEn: '',
    descriptionTh: '',
    imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipNa4J5dCEXNilGioBz5ph_PypiCZBRrALa8zLJn=w426-h240-k-no',
    tags: [],
    likeCount: 7,
    contact: {
      phone: '084 791 4224'
    },
    products: [
    ]
  },
  {
    id: '24',
    nameEn: 'Rattanaphan',
    nameTh: 'รัตนภัณฑ์',
    province: 'Khon Kaen',
    descriptionEn: '',
    descriptionTh: '',
    imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxr_0t9vJzDIkkYI_LaOhcixbz_Xx5PJAI8KFFXvZGa08_8vj_RQhEur5_KkWampmtL5qYlKrLFfwH1WIwNVCiR-o6rUIw7uGNp5XDKY3M-X_POWGqM5LL-F4D-0faMRCXU8r0=w408-h306-k-no',
    tags: [],
    likeCount: 4,
    contact: {
      phone: '043 237 087'
    },
    products: [
    ]
  },
  {
    id: '25',
    nameEn: 'Ta Kiat',
    nameTh: 'ตาเกียรติ',
    province: 'Khon Kaen',
    descriptionEn: '',
    descriptionTh: '',
    imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSy31QxYfE01PHFbZI1wxtJcbfpZB8EOL5F4RU9IFVlGSGdf4K3yc138qSBeodiHEqHPKFY3GLRC4Eqvw7xcIaO_yEG6Je0gMoNr61UdiV1_Yvn3GmVDSSYQl8ZSr9h_1Qmn3nP7=w408-h306-k-no',
    tags: [],
    likeCount: 5,
    contact: {
      phone: '089 604 0217'
    },
    products: [
    ]
  }
];
