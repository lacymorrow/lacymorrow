import MoreByLacy from "@/components/layout/more-by-lacy";
import Nav from "@/components/layout/nav";
import Socials from "@/components/layout/socials";
import { $app } from "@/config/strings";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full justify-between text-xs">
        <div className="hidden justify-start gap-4 md:flex">
          <div className="flex items-center">
            <Link
              className="hover:text-splash"
              href="https://www.lacymorrow.com"
              target="_blank"
              rel="noopener"
            >
              {$app.signature}
            </Link>
          </div>
          <div className="hidden md:block">
            <Socials />
          </div>
        </div>
        <Nav />
      </div>
      <MoreByLacy className="text-xs" />
    </div>
  );
};

export default Footer;
