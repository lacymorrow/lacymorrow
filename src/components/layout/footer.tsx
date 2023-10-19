import Nav from "@/components/layout/nav";
import Socials from "@/components/layout/socials";
import { $app } from "@/config/strings";
import Link from "next/link";

export const Footer = () => {
  return (
    <>
      <div className="flex w-full justify-between text-xs">
        <div className="hidden justify-start gap-4 md:flex">
          <div className="flex items-center">
            MIT {new Date().getFullYear()} ©{" "}
            <Link href="https://lacymorrow.com" target="_blank" rel="noopener">
              {$app.full_name}
            </Link>
          </div>
          <div className="hidden md:block">
            <Socials />
          </div>
        </div>
        <Nav />
      </div>
    </>
  );
};

export default Footer;
