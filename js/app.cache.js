var appCache = window.applicationCache;

// switch (appCache.status) {
//   case appCache.UNCACHED: // UNCACHED == 0
//     return 'UNCACHED';
//     break;
//   case appCache.IDLE: // IDLE == 1
//     return 'IDLE';
//     break;
//   case appCache.CHECKING: // CHECKING == 2
//     return 'CHECKING';
//     break;
//   case appCache.DOWNLOADING: // DOWNLOADING == 3
//     return 'DOWNLOADING';
//     break;
//   case appCache.UPDATEREADY:  // UPDATEREADY == 4
//     return 'UPDATEREADY';
//     break;
//   case appCache.OBSOLETE: // OBSOLETE == 5
//     return 'OBSOLETE';
//     break;
//   default:
//     return 'UKNOWN CACHE STATUS';
//     break;
// };

appCache.update(); // Attempt to update the user's cache.

if (appCache.status == window.applicationCache.UPDATEREADY) {
  appCache.swapCache();  // The fetch was successful, swap in the new cache.
}
