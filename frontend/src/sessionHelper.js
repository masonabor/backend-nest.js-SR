// export function setUserSession(userData, expiryTimeInDays) {
//   const expiryTimestamp = Date.now() + expiryTimeInDays * 24 * 60 * 6000;
//   const sessionData = {
//     user: userData,
//     expiry: expiryTimestamp
//   };
//   sessionStorage.setItem("userSession", JSON.stringify(sessionData));
// }
//
// export function getUserSession() {
//   const sessionData = sessionStorage.getItem("userSession");
//   if (sessionData) {
//     const parsedData = JSON.parse(sessionData);
//     const currentTime = Date.now();
//
//     if (currentTime < parsedData.expiry) {
//       return parsedData.user;
//     } else {
//       sessionStorage.removeItem("userSession");
//       return null;
//     }
//   }
//   return null;
// }
//
// export function clearUserSession() {
//   sessionStorage.removeItem("userSession");
// }
//
// export function isAdmin() {
//   const user = getUserSession()
//   return user && user.isAdmin;
// }
