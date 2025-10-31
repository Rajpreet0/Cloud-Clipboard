export function getDeviceInfo() {
  const ua = navigator.userAgent.toLowerCase();

  let os = "Unknown OS";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("iphone") || ua.includes("ios")) os = "iOS";
  else if (ua.includes("android")) os = "Android";

  let browser = "Unknown Browser";
  if (ua.includes("chrome")) browser = "Chrome";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("edg")) browser = "Edge";

  let deviceType = "Desktop";
  if (ua.includes("mobile")) deviceType = "Mobile";
  else if (ua.includes("tablet")) deviceType = "Tablet";

  return { os, browser, deviceType };
}
