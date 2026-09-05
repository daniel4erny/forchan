import Image from "next/image";
import GooeyNav from "./src/component/GooeyNav";

interface GooeyNavItem {
  label: string;
  href: string;
}

export default function Nav() {
  const items: GooeyNavItem[] = [
    {
      label: "Home", 
      href: "/"
    },
    {
      label: "Login", 
      href: "/"
    },
    {
      label: "Home", 
      href: "/"
    },
    {
      label: "Home", 
      href: "/"
    }, 
  ]
  return (
    <GooeyNav items={items}></GooeyNav>
  );
}
