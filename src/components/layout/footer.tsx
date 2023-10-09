import Nav from "@/components/layout/nav";
import Socials from "@/components/layout/socials";

type Props = {};

export const Footer = (props: Props) => {
  return (
    <>
      <div className="flex w-full justify-between text-xs">
        <div className="hidden justify-start gap-4 md:flex">
          <div className="flex items-center">
            MIT {new Date().getFullYear()} ©{" "}
            <a href="https://lacymorrow.com" target="_blank" rel="noopener">
              Lacy Morrow
            </a>
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
