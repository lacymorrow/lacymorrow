import dynamic from "next/dynamic";
import { StaticLanding } from "./static-landing";

const MorrowFieldClient = dynamic(
  () => import("./client").then((m) => m.MorrowFieldClient),
  { ssr: false },
);

export const MorrowField = () => (
  <>
    <StaticLanding reason="loading" />
    <MorrowFieldClient />
  </>
);

export default MorrowField;
