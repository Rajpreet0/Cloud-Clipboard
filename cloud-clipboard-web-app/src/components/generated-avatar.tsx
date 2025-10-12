import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {cn} from "@/lib/utils";

interface GeneratedAvatarProps {
    seed: string;
    className?: string;
    variant: "botttsNeutral" | "initials";
}

/**
 ** React component that generates a unique avatar image using DiceBar
 * 
 * - Supports two styles: `botttsNeutral` (robot style) and `initials` (text-based).
 * - Uses a seed string to ensure deterministic avatar generation
 * - Provides a fallback with the first letter of the seed in case the image fails to load
 * 
 * @param {GeneratedAvatarProps} props - Avatar configuration options. 
 * @returns {JSX.Element} Rendered avatar component.
 */
export const GeneratedAvatar = ({ seed, className, variant}: GeneratedAvatarProps) => {
    let avatar;

    // Generate avatar SVG based on selected variant
    if (variant === "botttsNeutral") {
        avatar = createAvatar(botttsNeutral, {
            seed,
        });
    } else {
        avatar = createAvatar(initials, {
            seed,
            fontWeight: 500,
            fontSize: 42,
        });
    }

  return (
    <Avatar className={cn(className)}>
        {/* Convert avatar to a data URI and render it as an image */}
        <AvatarImage src={avatar.toDataUri()} alt="Avatar"/>
        {/* Fallback: show first letter of seed if image fails */}
        <AvatarFallback>{seed.charAt(0).toLocaleUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

export default GeneratedAvatar