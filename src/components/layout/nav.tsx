import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
  SpeakerLoudIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { FacebookIcon, SpeakerIcon } from "lucide-react";
import Link from "next/link";

type Props = {};

const navigation = [
  { name: "Work", href: "/work" },
  { name: "Play", href: "/play" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Fly5 ↗", href: "https://fly5.live" },
];

export const Nav = (props: Props) => {
  return (
    <div className="nav flex items-center gap-4">
      {navigation.map((item) => (
        <Link
          key={crypto.randomUUID()}
          href={item.href}
          className="hover:text-splash duration-400 transition-colors"
          {...(item.href.startsWith("http") ? { target: "_blank" } : {})}
        >
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Nav;
