import Klosser from "@/components/klosser/Klosser";
import { lesForside } from "@/lib/sider";

// Forsiden er satt sammen av byggeklosser i content/forside.md (redigeres i Pages CMS).
export const revalidate = 3600;

export default function Home() {
  return <Klosser seksjoner={lesForside().seksjoner} />;
}
