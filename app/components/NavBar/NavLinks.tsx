"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface NavLinksProps {
  activeLink: string;
  onLinkClick: () => void;
}

const links = [
  { name: "Home", href: "https://www.kimdog-modding.co.uk/" },
  { name: "Catalog", href: "https://www.kimdog-modding.co.uk/catalog" },
  { name: "Contact", href: "https://www.kimdog-modding.co.uk/contact" },
  {
    name: "Access Downloads",
    href: "https://downloads.kimdog-modding.co.uk/",
    external: true,
  },
];

export default function NavLinks({ activeLink, onLinkClick }: NavLinksProps) {
  const [currentLink, setCurrentLink] = useState(activeLink);

  useEffect(() => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    if (hostname === "downloads.kimdog-modding.co.uk") {
      setCurrentLink("Access Downloads");
    } else if (pathname === "/") {
      setCurrentLink("Home");
    } else if (pathname.startsWith("/catalog")) {
      setCurrentLink("Catalog");
    } else if (pathname.startsWith("/contact")) {
      setCurrentLink("Contact");
    }
  }, []);

  return (
    <div className="flex space-x-6">
      {links.map(({ name, href, external }) => {
        const isActive = currentLink === name;

        return (
          <Link
            key={name}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            onClick={onLinkClick}
            className={`relative font-semibold text-lg cursor-pointer px-3 py-1
              text-purple-300 hover:text-white
              after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:rounded-full
              after:transition-all after:duration-300
              ${
                isActive
                  ? "after:w-full after:bg-purple-400 after:shadow-[0_0_8px_#9f7aea]"
                  : "after:w-0 after:bg-purple-400 hover:after:w-full hover:after:shadow-[0_0_8px_#9f7aea]"
              }
            `}
          >
            {name}
          </Link>
        );
      })}
    </div>
  );
}
