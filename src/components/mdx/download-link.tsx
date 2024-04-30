import { nxLink } from "@/utils/classes";
import { DownloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const DownloadLink = ({
  children,
  href,
  icon,
  after,
}: {
  href: string;
  text?: string;
  icon?: JSX.Element;
  after?: JSX.Element;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-1">
      <Link href={href}>{icon ? icon : <DownloadIcon />}</Link>
      <Link href={href} className={`${nxLink}`}>
        <div className="inline">{children || "Download"}</div>
      </Link>
      {after}
    </div>
  );
};

export default DownloadLink;
