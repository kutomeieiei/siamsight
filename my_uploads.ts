import { UserUpload } from './types';
import { userUploadImages } from './image_assets';

/**
 * Add your own images here!
 * To add a new image:
 * 1. Add your image URL to the `userUploadImages` object in `image_assets.ts`.
 *    Give it a descriptive key (e.g., `myCoolVacationPhoto`).
 * 2. Create a new object in the array below.
 * 3. Set the `imageUrl` to `userUploadImages.yourKey`.
 * 4. Fill in the title, province, and a short description.
 * 
 * Example:
 * {
 *   imageUrl: userUploadImages.myCoolVacationPhoto,
 *   title: 'My Awesome Vacation Photo',
 *   province: 'Phuket',
 *   description: 'This was the best trip ever!'
 * }
 */
export const MY_UPLOADS: UserUpload[] = [
  // This is a placeholder. Replace it with your own photos!
  {
    imageUrl: userUploadImages.railaySunset,
    title: 'Sunset over Railay',
    province: 'Krabi',
    description: 'A beautiful sunset captured from the beach.',
  },
  {
    imageUrl: userUploadImages.bangkokStreetFood,
    title: 'Street Food Stall',
    province: 'Bangkok',
    description: 'Delicious local food found in a night market.',
  },
  {
    imageUrl: userUploadImages.chiangMaiElephants,
    title: 'Elephant Sanctuary',
    province: 'Chiang Mai',
    description: 'Meeting gentle giants in the northern mountains.',
  },
  {
    imageUrl: userUploadImages.phangNgaBay,
    title: 'Island Hopping',
    province: 'Phang Nga',
    description: 'Exploring the stunning limestone karsts.',
  },
];
