import Link from "next/link";

const navigation = [
  { name: "Work", href: "/work" },
  { name: "Play", href: "/play" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Colophon", href: "/about/colophon" },
  { name: "Fly5 ↗", href: "https://fly5.live" },
];

export const Nav = () => {
  return (
    <div className="nav flex items-center">
      {navigation.map((item) => (
        <Link
          key={crypto.randomUUID()}
          href={item.href}
          className="hover:text-splash duration-400 h-full p-1 px-2 transition-colors"
          {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Nav;
