# Foto-Owl-Assignment
It is a new assignment
# Foto Owl — React Native Gallery App

A React Native (Expo) + TypeScript app with local registration/login, a Picsum image gallery
(infinite scroll, pull-to-refresh, debounced search, A–M / N–Z filter), favorites, full-screen
viewing with download-to-gallery, sharing, and an editable profile. Dark mode follows the device setting.

## Setup & Running Instructions

Requirements: Node.js 18+ and npm. Expo Go on a phone, or an Android emulator / iOS simulator.

```bash
git clone <repo-url>
cd GalleryApp
npm install
npx expo start        # or: npm start
```

Press `a` for the Android emulator, `i` for the iOS simulator, or scan the QR code with Expo Go.

> The project targets **Expo SDK 57**. Expo Go must be a version that supports SDK 57
> (update it from the store). If you need a different SDK, run `npx expo install --fix` after changing the `expo` version.

Other scripts:

```bash
npm test            # unit tests (jest-expo)
npm run typecheck   # tsc --noEmit
```

### Saving images to the gallery
Saving uses `expo-media-library`. On Android, Expo Go has limited media-library support,
so if saving fails there, test with the APK / a development build (below) — that is the reliable path.

### Build an Android APK

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview   # produces an installable .apk
```

## Key Libraries Used
- **React Navigation** (`native-stack`, `bottom-tabs`): Auth stack, main tabs, and the image-detail screen.
- **Zustand**: centralized state (`useAuthStore`, `useGalleryStore`).
- **@react-native-async-storage/async-storage**: users, session, and per-user favorites.
- **expo-file-system + expo-media-library**: download an image and save it to the device gallery.
- **expo-crypto**: SHA-256 (salted) hashing so passwords are not stored in plain text.
- **@expo/vector-icons**, **react-native-safe-area-context**, **react-native-screens**.
- **jest-expo**: unit tests.

## Architecture & Assumptions
- **Auth & persistence:** users are stored as a map keyed by lower-cased email under one AsyncStorage key.
  Only a salted SHA-256 hash of the password is stored. The active session is the logged-in email; on launch
  `loadSession()` restores it and the root navigator opens Home directly. This is a **local-only demo**;
  a real app would authenticate against a backend.
- **Registration** validates all fields (email regex, digits-only and exactly 10-digit mobile, password ≥ 6, matching
  passwords). After registering, the user is sent to Login.
- **Profile:** name, mobile, gender, address and city are editable and update the UI immediately.
  Email is read-only because it is the login identifier.
- **Gallery pagination:** `https://picsum.photos/v2/list?page=N&limit=20`; the next page loads on `onEndReached`.
  Pagination stops when a page returns fewer than 20 items.
- **Pull-to-refresh / duplicate calls:** `useFetchImages` uses a `useRef` in-flight guard, so refresh, end-reached,
  and retry can never run concurrent requests. Pages are de-duplicated by image id.
- **Search & filter:** `filterImages()` combines a case-insensitive author search with the All / A–M / N–Z first-letter
  filter in one memoized pass. Search is debounced (300 ms). Filters apply to the images loaded so far;
  if nothing matches while more pages exist, the empty state offers "Load more images".
- **Favorites:** stored per user (whole image object) so the Favorites screen works offline and after restart.
  Favorites search reuses the same filter function.
- **Images:** thumbnails/detail views use resized Picsum URLs (`/id/{id}/{w}/{h}.jpg`) instead of the original
  `download_url`, which can be several MB. The saved gallery copy is capped at 2400 px on the long edge (`DOWNLOAD_MAX_WIDTH`).
- **Errors/offline:** every request has a 15 s timeout, failures show a retry state (or a "tap to retry" footer if
  some images are already loaded), and download/permission errors are shown in an alert.
- **Navigation:** `@react-navigation/native-stack` is used instead of `@react-navigation/stack` (native transitions,
  no gesture-handler dependency).

## Folder Structure
```
src/
├── api/          picsumApi.ts (fetch + validation of API responses)
├── assets/       static assets
├── components/   Button, InputField, Dropdown, RadioGroup, ImageCard, SearchBar, FilterChips,
│                 EmptyState, LoadingSpinner, FullScreenImageViewer
├── constants/    cities, page size, timeouts
├── hooks/        useFetchImages, useDebounce, useAuth, useFavorites, useTheme
├── navigation/   RootNavigator (session switch), AuthNavigator, MainTabNavigator
├── screens/      Auth/ (Login, Register)  Main/ (Home, Favorites, ImageDetail, Profile)
├── store/        useAuthStore, useGalleryStore (Zustand + AsyncStorage)
├── theme/        light/dark palettes
├── types/        auth, gallery, navigation
└── utils/        storage, validation, filterImages, images, download, security
__tests__/        validation, filterImages, auth store, gallery store
```

## Bonus Features Implemented
Dark mode · debounced search · reusable components · custom hooks · unit tests · image sharing · pull-to-refresh optimization.
(Profile avatar selection is not implemented; the profile shows initials.)
