import Link from "next/link";

const navigation = [
  { name: "Work", href: "/work" },
  { name: "Play", href: "/play" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Fly5 ↗", href: "https://fly5.live" },
];

export const Nav = () => {
  return (
    <div className="nav flex items-center">
      {navigation.map((item) => (
        <Link
          key={crypto.randomUUID()}
          href={item.href}
          className="h-full hover:text-splash duration-400 transition-colors p-1 px-2"
          {...(item.href.startsWith("http") ? { target: "_blank" } : {})}
        >
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Nav;
