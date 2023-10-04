import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
  SpeakerLoudIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { FacebookIcon, SpeakerIcon } from "lucide-react";
import Link from "next/link";
import LastFmIcon from "@/components/images/lastfm-icon";
import { cn } from "@/lib/utils";

type Props = {};

const socials = [
  {
    name: "Last.fm",
    href: "https://www.last.fm/user/gojukebox00",
    icon: <LastFmIcon />,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/lacybuilds",
    icon: <TwitterLogoIcon />,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/goseethings",
    icon: <InstagramLogoIcon />,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/lacymorrow/",
    icon: <LinkedInLogoIcon />,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/lacy.morrow",
    icon: <FacebookIcon className="h-3.5 w-3.5" />,
  },
];

export const Socials = (props: Props) => {
  return (
    <div className="text-muted-foreground child:fill-muted-foreground flex items-center justify-start gap-2">
      {socials.map((item) => (
        <Link
          key={crypto.randomUUID()}
          href={item.href}
          className={cn(
            "hover:text-splash duration-400 transition-colors",
            item.name.toLowerCase() === "last.fm" && "hover:child:fill-splash"
          )}
        >
          {item.icon}
          <span className="sr-only">{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Socials;
