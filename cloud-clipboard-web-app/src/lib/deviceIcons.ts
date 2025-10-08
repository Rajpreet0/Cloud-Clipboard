import ChromeIcon from "../../public/icons/chrome.png";
import FirefoxIcon from "../../public/icons/firefox.png";
import SafariIcon from "../../public/icons/safari.png";
import EdgeIcon from "../../public/icons/microsoft.png";
import OperaIcon from "../../public/icons/opera.png";
import DefaultBrowserIcon from "../../public/icons/web.png";
import { AiOutlineWindows } from "react-icons/ai";
import { FaApple, FaLinux  } from "react-icons/fa";
import { IoLogoAndroid } from "react-icons/io";
import { VscServerProcess } from "react-icons/vsc";
import { CiMobile1 } from "react-icons/ci";
import { FaDesktop } from "react-icons/fa";

export const getBrowserIcon = (browser: string | undefined) => {
    if (!browser) return DefaultBrowserIcon;

    const name = browser?.toLowerCase();

    if (name.includes("chrome")) return ChromeIcon;
    if (name.includes("firefox")) return FirefoxIcon;
    if (name.includes("safari")) return SafariIcon;
    if (name.includes("edge")) return EdgeIcon;
    if (name.includes("opera")) return OperaIcon;
    return DefaultBrowserIcon;
}

export const getOsIcon = (os: string | undefined) => {
    if (!os) return VscServerProcess;
    const name = os.toLowerCase();

    if (name.includes("windows")) return AiOutlineWindows;
    if (name.includes("mac")) return FaApple;
    if (name.includes("android")) return IoLogoAndroid;
    if (name.includes("ios")) return FaApple;
    if (name.includes("linux")) return FaLinux;
    return VscServerProcess;
}

export const getDeviceIcon = (device: string | undefined) => {
    if (!device) return FaDesktop;

    const name = device.toLowerCase();

    if (name.includes("desktop")) return FaDesktop;
    if (name.includes("mobile")) return CiMobile1;
    return FaDesktop;
}