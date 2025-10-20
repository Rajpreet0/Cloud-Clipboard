import TooltipAbstract from '@/components/tooltipAbstract';
import { Card, CardContent } from '@/components/ui/card';
import { LogOut, ShieldAlert } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { getBrowserIcon, getDeviceIcon, getOsIcon } from '@/lib/deviceIcons';

interface DeviceCardProps {
  browser: string;
  os: string;
  device: string;
  ip: string;
  fingerprint: string;
  isOnline: boolean;
  lastSeenAt?: string;
  onLogout?: () => void;
}

/**
 ** Displays information about a registered user device in a styled card.
 *
 * - Shows browser, OS, device type, IP address, and fingerprint.
 * - Highlights the card with green if the device is currently online, red if offline.
 * - Displays warning banner for pending device pairings (fingerprint = "PENDING").
 * - Includes interactive tooltips for OS, device, and logout actions.
 *
 * @param {DeviceCardProps} props - Device information and UI state.
 * @returns {JSX.Element} A styled card with detailed device information.
 */
const DeviceCard: React.FC<DeviceCardProps> = ({
  browser,
  os,
  device,
  ip,
  fingerprint,
  isOnline,
  lastSeenAt,
  onLogout
}) => {

    const browserIcon = getBrowserIcon(browser);
    const OsIcon = getOsIcon(os);
    const DeviceIcon = getDeviceIcon(device);

  return (
    <Card
      className={`w-full max-w-3xl transition-all duration-200 hover:shadow-lg ${
        isOnline
          ? "border-green-500 shadow-green-500/50"
          : "border-red-500 shadow-red-500/50"
      } border rounded-2xl`}
    >
      <CardContent className="p-4 sm:p-6">
        {/* Pending pairing alert */}
        {fingerprint === "PENDING" && (
          <div className='flex items-center gap-2 w-fit border-2 border-amber-300 p-2 rounded-md mb-8 bg-amber-200/20'>
            <ShieldAlert className='text-amber-400'/>
            <p className='text-xs text-amber-400 font-bold'>Awaiting Pair Confirmation</p>
          </div>
        )}
        {/* Main layout */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-4 text-center sm:text-left">
          {/* Browser Icon */}
          <div className="flex justify-center sm:justify-start mb-3 sm:mb-0 sm:w-[20%]">
            <Image
              src={browserIcon}
              height={50}
              width={50}
              alt={browser}
              priority
              quality={100}
              className="h-12 w-12 sm:h-14 sm:w-14"
            />
          </div>

          {/* Text + Icons */}
          <div className="flex flex-col w-full gap-2 sm:gap-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
              <p className="font-semibold text-lg sm:text-xl tracking-wide">
                {browser || "Unbekannter Browser"}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">
                Last Login At: {lastSeenAt || "N/A"}
              </p>
            </div>

            {/* IP Address */}
            <a
              href={`https://tools.keycdn.com/geo?host=${ip}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-base text-gray-700"
            >
              IP address:{" "}
              <span className="font-semibold hover:underline cursor-pointer">
                {ip}
              </span>
            </a>

            {/* Fingerprint + Icons */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
              <p className="text-gray-400 text-xs sm:text-sm truncate">
                D-Fingerprint: {fingerprint}
              </p>

              {/* Icons */}
              <div className="flex gap-3 justify-center sm:justify-end items-center">
                <TooltipAbstract content={os}>
                    <OsIcon
                      size={22}
                      className="cursor-pointer text-gray-700 hover:text-gray-900"
                    />
                </TooltipAbstract>
                
                <TooltipAbstract content={device}>
                    <DeviceIcon
                      size={20}
                      className="cursor-pointer text-gray-700 hover:text-gray-900"
                    />
                </TooltipAbstract>
                
                <TooltipAbstract content="Logout the Device">
                  <LogOut
                    size={18}
                    onClick={onLogout}
                    className="text-red-700 cursor-pointer hover:text-red-800"
                  />
                </TooltipAbstract>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
