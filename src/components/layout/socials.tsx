import LastFmIcon from "@/components/images/lastfm-icon";
import { cn } from "@/lib/utils";
import {
  GitHubLogoIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { FacebookIcon } from "lucide-react";
import Link from "next/link";

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
    name: "Facebook",
    href: "https://www.facebook.com/lacy.morrow",
    icon: <FacebookIcon className="size-3.5" />,
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
    name: "Github",
    href: "https://www.github.com/lacymorrow",
    icon: <GitHubLogoIcon className="h-3.5 w-3.5" />,
  },
];

export const Socials = () => {
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
