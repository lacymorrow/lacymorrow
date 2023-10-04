import Nav from "@/components/layout/nav";
import Socials from "@/components/layout/socials";

type Props = {};

export const Footer = (props: Props) => {
  return (
    <>
      <div className="flex w-full justify-between text-xs">
        <div className="flex justify-start gap-4">
          <div className="flex items-center">
            MIT {new Date().getFullYear()} ©{" "}
            <a href="https://lacymorrow.com" target="_blank" rel="noopener">
              Lacy Morrow
            </a>
          </div>
          <Socials />
        </div>
        <Nav />
      </div>
    </>
  );
};

export default Footer;
