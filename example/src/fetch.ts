// Example using one of google apps script's global objects.
function useUrlFetchApp() {
  const response = UrlFetchApp.fetch("https://google.com")
  return response;
}