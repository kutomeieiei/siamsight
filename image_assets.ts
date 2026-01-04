/**
 * ==============================================================================
 * SIAM SIGHT: GLOBAL IMAGE CONFIGURATION
 * ==============================================================================
 * 
 * You can now paste raw Google Drive links directly into any of the objects below.
 * The system will automatically convert them into direct, high-res image URLs.
 * 
 * IMPORTANT: Ensure the Google Drive file is set to "Anyone with the link can view".
 */

/**
 * Robust Google Drive Link Resolver.
 */
const resolveDriveUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/d\/(.+?)([\/?]|$)/) || url.match(/id=(.+?)(&|$)/);
    const id = match ? match[1] : null;
    return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1600` : url;
  }
  return url;
};

/**
 * Helper to apply the Drive resolver to every value in an object automatically.
 */
const autoResolve = <T extends Record<string, string>>(obj: T): T => {
  const result = {} as T;
  for (const key in obj) {
    result[key] = resolveDriveUrl(obj[key]) as any;
  }
  return result;
};

// Branding settings
export const branding = {
  logo: resolveDriveUrl('https://drive.google.com/file/d/1C2dAfLMmoi5-S5ZVik0IRiTWwv3Sdc0v/view?usp=drive_link'), 
  mainGradientTop: '#4a2c5a',
  mainBackground: '#160f29',
};

// UI and Avatars
export const uiAssets = {
  nongSiamAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=NongSiam&backgroundColor=ffd60a',
  kruSiamAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=KruSiam&backgroundColor=3a86ff',
  placeholder: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000',
};

// Province Images - PASTE DRIVE LINKS HERE DIRECTLY
export const provinceImages = autoResolve({
  Bangkok: 'https://drive.google.com/file/d/1NCZ95B4J2YaWecsBs52ElIQQ7bIU-wKq/view?usp=drive_link',
  Ayutthaya: 'https://drive.google.com/file/d/1uqQDXnM2zZzXLbGd3sFCYQOxTlA5bS9v/view?usp=drive_link',
  'Ang Thong': 'https://drive.google.com/file/d/18YIF7H5BHArzCWD98FnibaE5fxckUesW/view?usp=drive_link',
  'Chai Nat': 'https://drive.google.com/file/d/1Pmr-mO7mb7W3fZohHMRrBcOkLHNziJFX/view?usp=drive_link',
  Lopburi: 'https://drive.google.com/file/d/1yOHseN7hAlfcN8m1VxtPFHrF7Ec_sI5a/view?usp=drive_link',
  'Nakhon Nayok': 'https://drive.google.com/file/d/1d9wfEHP6rSYuVO0_MvaXxi7zfk1un1pK/view?usp=drive_link',
  'Nakhon Pathom': 'https://drive.google.com/file/d/15KT73vnFhk7oWuQRo_Yz0EFiAhzNxmFU/view?usp=drive_link',
  Nonthaburi: 'https://drive.google.com/file/d/14Cdr9hPX2YvWGUFnzRTSdhbu2BA4fcMe/view?usp=drive_link',
  'Pathum Thani': 'https://drive.google.com/file/d/1Tgo4j1sC4LlTMWn-wiSRDkWj3V9VnIMz/view?usp=drive_link',
  'Samut Prakan': 'https://drive.google.com/file/d/1V7cg3DhFlrknF-_BGSY0HffPle69_nRN/view?usp=drive_link',
  'Samut Sakhon': 'https://drive.google.com/file/d/1zEa-uKbNa4ZLVwqd90qqsAHhRoYpMG8m/view?usp=drive_link',
  'Samut Songkhram': 'https://drive.google.com/file/d/1fmex2Q5fF_ALItHoMvr8F9NJZKfp57aF/view?usp=drive_link',
  Saraburi: 'https://drive.google.com/file/d/1XWw_O749F8yhGSyeqe-YW-ddUSBeO5pj/view?usp=drive_link',
  'Sing Buri': 'https://drive.google.com/file/d/1if8iIYF8wRfM4xwY_roWE02zcd1zf6D_/view?usp=drive_link',
  'Suphan Buri': 'https://drive.google.com/file/d/1PU1ZviulVcH0tNMwE9zQPvAWv7hQGhdU/view?usp=drive_link',
  
  // Northern Region
  'Chiang Mai': 'https://drive.google.com/file/d/15h1uiUW-hhxTLcQIeoXytAjPoARyOyRL/view?usp=drive_link',
  'Chiang Rai': 'https://drive.google.com/file/d/1c-ORvVcupNmV0djMNS1N_HdwlrXzK5Hq/view?usp=drive_link',
  'Kamphaeng Phet': 'https://drive.google.com/file/d/1nCIDBjWl3yOypbY_NUQcHL81tOQPhMOQ/view?usp=drive_link',
  Lampang: 'https://drive.google.com/file/d/1s6vNvTjmYmgZL_4Yi0IhNKSuwnd5gjy_/view?usp=drive_link',
  Lamphun: 'https://drive.google.com/file/d/1qZ7XoqhL4X8dis1ajA5n6goQfB7GsZVe/view?usp=drive_link',
  'Mae Hong Son': 'https://drive.google.com/file/d/1yjrUjmDDiEfpYp9oEEnitgMWcX0lXfay/view?usp=drive_link',
  'Nakhon Sawan': 'https://drive.google.com/file/d/1rWH4QHsOEC1D5ZPdJCzV9xoT0n0K6lX1/view?usp=drive_link',
  Nan: 'https://drive.google.com/file/d/1RnSn_JSRu6UOrXrsaIX-oJAyqMfrf9Sa/view?usp=drive_link',
  Phayao: 'https://drive.google.com/file/d/1b-Ea289LtN1BmmGB_0628YMCDfvzbJIR/view?usp=drive_link',
  Phetchabun: 'https://drive.google.com/file/d/1V3WFRIfW6f-kRXH0LKEnC9T8QSW1Mk7t/view?usp=drive_link',
  Phichit: 'https://drive.google.com/file/d/1mJOJZ9Q0YfFBs-4vXN64DREhY2DioAu3/view?usp=drive_link',
  Phitsanulok: 'https://drive.google.com/file/d/1i-wFNx5gouX4KDmAkAtB9Ppi2vjucpCq/view?usp=drive_link',
  Phrae: 'https://drive.google.com/file/d/1ho71ruDg3vqrPIQlDzp9OyxjvbQ916uT/view?usp=drive_link',
  Sukhothai: 'https://drive.google.com/file/d/1Y6xMLL3-mWItIqENhRri4--0djAE-lQH/view?usp=drive_link',
  Tak: 'https://drive.google.com/file/d/17hdqIdaMChH7-iskglYLCnKoeb9KlHKL/view?usp=drive_link',
  'Uthai Thani': 'https://drive.google.com/file/d/1HlZTmS2p9apZJSiIhSEnfg2evPDN7CIH/view?usp=drive_link',
  Uttaradit: 'https://drive.google.com/file/d/1C6HsxoNTWjk2D0xQb55v2TFov1bZhbL4/view?usp=drive_link',

  // Northeast Region
  'Amnat Charoen': 'https://drive.google.com/file/d/1ds503cs6Z-lzPno0-Qa7RjUFftmArGWd/view?usp=drive_link',
  'Bueng Kan': 'https://drive.google.com/file/d/1QvsVHPK3d1rKB6Ejlt-8-jsfwVm1qE2Y/view?usp=drive_link',
  Buriram: 'https://drive.google.com/file/d/1jFh1XnZIqwwYfKAj4FLhkGQd3SocDC_b/view?usp=drive_link',
  Chaiyaphum: 'https://drive.google.com/file/d/10ErKmmwVjMvxQdx8r_VfX6Xjl7J4Lxhx/view?usp=drive_link',
  Kalasin: 'https://drive.google.com/file/d/18HwsX6cvHVeFhACjyjPEEwmhO5odIkkR/view?usp=drive_link',
  'Khon Kaen': 'https://drive.google.com/file/d/1fd4xt6bDjluGmTmLpvjTFzQFsOQU8GwQ/view?usp=drive_link',
  Loei: 'https://drive.google.com/file/d/1oktabcXGUqHq2d4upeYfY0U6dNfbmE8P/view?usp=drive_link',
  'Maha Sarakham': 'https://drive.google.com/file/d/1RkqOPERECANI239R5o9M_79_8LhWc8Os/view?usp=drive_link',
  Mukdahan: 'https://drive.google.com/file/d/12fc8RQ3W14eiE_GNupfLOs839hw1ttXa/view?usp=drive_link',
  'Nakhon Phanom': 'https://drive.google.com/file/d/1O-IM7aVRzFvCc9mN_9ybcVJWnLLVVS_a/view?usp=drive_link',
  'Nakhon Ratchasima (Korat)': 'https://drive.google.com/file/d/16BivmPtvP0sMwuAXSGN2z8C0lCJUHTxd/view?usp=drive_link',
  'Nong Bua Lamphu': 'https://drive.google.com/file/d/1UBhnQPP1ygh-7HRjRilr_IBbppBFgrTw/view?usp=drive_link',
  'Nong Khai': 'https://drive.google.com/file/d/1evgoOqMnyOz6agXSsvdWu_wILR1r5g8o/view?usp=drive_link',
  'Roi Et': 'https://drive.google.com/file/d/1NgnfK5Ln82URp99xkhPjfkX7XKGDg5J_/view?usp=drive_link',
  'Sakon Nakhon': 'https://drive.google.com/file/d/1gPEK5XdN_BMVDHmHzEcEDQq5NbOzTffy/view?usp=drive_link',
  Sisaket: 'https://drive.google.com/file/d/13V2ayN3mkBPw6r5cLtGk2K4p1QCv3P5a/view?usp=drive_link',
  Surin: 'https://drive.google.com/file/d/1fE6dm_H9aU74v4_kEoBPV1L5q9vGvHou/view?usp=drive_link',
  'Ubon Ratchathani': 'https://drive.google.com/file/d/1D104x1ApvUqPR8L3lISoOjFNx4FD24ur/view?usp=drive_link',
  'Udon Thani': 'https://drive.google.com/file/d/1sKgmC3SVN0sQappPTd8Pu5cHBNe1JYxz/view?usp=drive_link',
  Yasothon: 'https://drive.google.com/file/d/1zKR41wYnpZUgTK5WvxBcYTdLEu6S0xPc/view?usp=drive_link',

  // Southern Region
  Phuket: 'https://drive.google.com/file/d/1xNKuCX_4sqJpzD98da7fka3nx-fX6Tqn/view?usp=drive_link',
  Krabi: 'https://drive.google.com/file/d/1PNjEHewamZwu1hjwWEQRBucqu2GCx6j2/view?usp=drive_link',
  Chumphon: 'https://drive.google.com/file/d/1RyRAKRFCTZUcSEeOKCc1Nr6Wpzy6ogg8/view?usp=drive_link',
  'Nakhon Si Thammarat': 'https://drive.google.com/file/d/1uAPuW-KwPMqAq_SrQ8LNzvAw7W7zPNkv/view?usp=drive_link',
  Narathiwat: 'https://drive.google.com/file/d/1IVTSXb5vByZgxqISSkHvuxINbgX2QgVw/view?usp=drive_link',
  Pattani: 'https://drive.google.com/file/d/1cEP5QExhWytV2v-ojk7K-LmFpIRFlIx0/view?usp=drive_link',
  'Phang Nga': 'https://drive.google.com/file/d/1FUYkRK4V8phvOEJkSZ6T8P-2hp7Qezc4/view?usp=drive_link',
  Phatthalung: 'https://drive.google.com/file/d/1GlEf8-aMdSLvcccHAAqV9bc3-vvqzgBC/view?usp=drive_link',
  Ranong: 'https://drive.google.com/file/d/1p9zH_lWIa000iCtQU-m8eejrBeyZR7Vo/view?usp=drive_link',
  Satun: 'https://drive.google.com/file/d/1AxZQPF0C0v6gXazu9it1Nnbl3zo5aOCx/view?usp=drive_link',
  Songkhla: 'https://drive.google.com/file/d/1_YtpOgLN_8GRaZdFmOnOcSV5kh1Drhep/view?usp=drive_link',
  'Surat Thani': 'https://drive.google.com/file/d/1ySl6sX_ieuzaqoqzcY4xtAm2VPF1VdGB/view?usp=drive_link',
  Trang: 'https://drive.google.com/file/d/1W-j_UWygFSuJd-rtFOkAiD94VSq2UxST/view?usp=drive_link',
  Yala: 'https://drive.google.com/file/d/1NxOt0uBDNCmI7JlyqXYdPbWqslOOyzr5/view?usp=drive_link',

  // Western Region
  Kanchanaburi: 'https://drive.google.com/file/d/10v_6b843l0CRL4zIFUUzxPXNMlj8qFu-/view?usp=drive_link',
  Phetchaburi: 'https://drive.google.com/file/d/1YEEC8nEHwnjGTh6a0ObuYi-EWklqIc8T/view?usp=drive_link',
  'Prachuap Khiri Khan': 'https://drive.google.com/file/d/1lBPKBC8jb2ATxPnz9q6RqUhZuudDY2mB/view?usp=drive_link',
  Ratchaburi: 'https://drive.google.com/file/d/1qXooOx3MgS48S8nmj7VmnW2s7Z1I4uBt/view?usp=drive_link',

  // Eastern Region
  Chachoengsao: 'https://drive.google.com/file/d/13o70Ab2gv-o6kG0jbPMS49InQHAvlt2q/view?usp=drive_link',
  Chanthaburi: 'https://drive.google.com/file/d/1FVRQ-CL7dQDNdN4Vt5GKFGRiPYGy3QDW/view?usp=drive_link',
  Chonburi: 'https://drive.google.com/file/d/1SlJ016pS7Tdo6mH_EHWRs_1TyZ9PrVF3/view?usp=drive_link',
  Prachinburi: 'https://drive.google.com/file/d/1vsEox-YoNjM0OjrkOUYynxQp8uYn6-AM/view?usp=drive_link',
  Rayong: 'https://drive.google.com/file/d/1U47hfjaJv5OgshGN5j3GsBQAJPFqrvc0/view?usp=drive_link',
  'Sa Kaeo': 'https://drive.google.com/file/d/1tZxDpB7qb3E9bNWIc3VsxtCTTXjaa-Yf/view?usp=drive_link',
  Trat: 'https://drive.google.com/file/d/16_idAVL22uLGt7kGsdI9KLOXiguVshTf/view?usp=drive_link',
});

// Attraction Images
export const attractionImages = autoResolve({
  monJam: 'https://guide2thailand.com/wp-content/uploads/2020/01/Mon-Jam-Mon-Cham-Chiang-Mai-Thailand.jpg',
  roiEtTower: 'https://drive.google.com/file/d/1VXCyVqU0LT6nY4vm45fDV8sagoHtnQ0y/view?usp=drive_link',
  grandPalace: 'https://drive.google.com/file/d/1-5i6ihFmIndQOxaNK1pCwzO8vug4pSh8/view?usp=drive_link',
  mayaBay: 'https://drive.google.com/file/d/18D_raBtfa0-JywY4MMyMZcpd2cAeWdtb/view?usp=drive_link',
  sukhothaiHistoricalPark: 'https://drive.google.com/file/d/1Hnu3eOskSYf1cwMUBK1mlA36gquHs2Qw/view?usp=drive_link',
  whiteTemple: 'https://drive.google.com/file/d/1Yydyxq-zMkno6N5u4m06JcTwokt9LcuP/view?usp=drive_link',
  phanomRung: 'https://drive.google.com/file/d/1Qjurg7leAQlwGsUL2Aq3o1nVs5JOXTiV/view?usp=drive_link',
  doiInthanon: 'https://drive.google.com/file/d/1E3ZSceTsCz4hklWuLmjdR62mrraf48V6/view?usp=drive_link',
  jamesBondIsland: 'https://drive.google.com/file/d/1omoalr7D1S6gZBO-wrqzBnfFwCgi4Jy-/view?usp=drive_link',
  erawanFalls: 'https://drive.google.com/file/d/13J62PM1s3Pa8n5Ms_K4zAZyI6nMBYXU-/view?usp=drive_link',
  redLotusSea: 'https://drive.google.com/file/d/1ciUyuURMWZBH21COyVz8XDPyR-nHZPZs/view?usp=drive_link',
  railayBeach: 'https://drive.google.com/file/d/1Y3rov3dBpfvjyM500rdPf3lJIiSM5AL2/view?usp=drive_link',
});

// Shop Images
export const shopImages = autoResolve({
  jimThompsonHouseShop: 'https://images.unsplash.com/photo-1558811352-5a0a3a411e75?q=80&w=1200',
  chiangMaiNightBazaar: 'https://images.unsplash.com/photo-1547933261-8b39c03795b5?q=80&w=1200',
  pranomThaiHerbal: 'https://images.unsplash.com/photo-1598453492331-955a188a6d44?q=80&w=1200',
  otopCenter: 'https://images.unsplash.com/photo-1587372951924-f7610a5976e1?q=80&w=1200',
  siamCeladon: 'https://images.unsplash.com/photo-1593495101977-119c9e883f3a?q=80&w=1200',
  orTorKorMarket: 'https://images.unsplash.com/photo-1516594798947-7b71231e51b6?q=80&w=1200',
  boSangUmbrellaMakingCentre: 'https://images.unsplash.com/photo-1589182373726-e4f62fa94222?q=80&w=1200',
  koKretPottery: 'https://images.unsplash.com/photo-1558213233-bfb65b5b4a1b?q=80&w=1200',
});

// Learning Content Images
export const learningImages = autoResolve({
  silk: 'https://drive.google.com/file/d/1ZO68bXSiFYY_v_5e-Eo_ftN4z-WFqeEX/view?usp=drive_link',
  ceramics: 'https://drive.google.com/file/d/1YVAuyHh_I3yiAsPIxUJFP9sl_w4y-Fr1/view?usp=drive_link',
  teak: 'https://i.pinimg.com/474x/0d/45/21/0d45217b938358fd2b5ee1ae79aa1371.jpg',
  silverware: 'https://image.makewebcdn.com/makeweb/m_1920x0/eukao6Dro/DefaultData/1_4.jpg',
  wickerwork: 'https://culture55520089.wordpress.com/wp-content/uploads/2015/03/k.jpg',
  durian_chips: 'https://pornthipphuket.com/wp-content/uploads/2022/04/30-%E0%B8%97%E0%B8%B8%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%97%E0%B8%AD%E0%B8%94-5.jpg',
});

// User Upload Placeholders
export const userUploadImages = autoResolve({
  railaySunset: 'https://images.unsplash.com/photo-1518544393443-c35a8c1f5a54?q=80&w=1200',
  bangkokStreetFood: 'https://images.unsplash.com/photo-1565516334208-f719b0d6a2f4?q=80&w=1200',
  chiangMaiElephants: 'https://images.unsplash.com/photo-1506313190538-411a5ab2c123?q=80&w=1200',
  phangNgaBay: 'https://images.unsplash.com/photo-1589714152331-561b4f42e342?q=80&w=1200',
});
