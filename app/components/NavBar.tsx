"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // in Next.js 13 app router, use 'next/navigation'
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const navLinks = [
  { label: "Home", onClick: () => alert("Home clicked") },
  { label: "Mods", onClick: () => alert("Mods clicked") },
  { label: "About", onClick: () => alert("About clicked") },
];

export default function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // For now, we assume user is NOT signed in
  const isSignedIn = false;

  const onAvatarClick = () => {
    if (!isSignedIn) {
      router.push("/api/login");
    }
  };

  const avatarUrl =
    "https://avatars.githubusercontent.com/u/9919?s=200&v=4"; // Replace with your avatar URL or user data

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 flex items-center justify-between px-6 py-3 transition-shadow duration-500
          bg-gray-900/95 backdrop-blur-sm
          ${scrolled ? "shadow-lg" : "shadow-none"}`}
      >
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer select-none"
          aria-label="KimDog Studios Logo"
          style={{ width: 180, height: 100, position: "relative" }}
        >
          <Image
            src="/logo.png"
            alt="KimDog Studios Logo"
            fill
            style={{ objectFit: "contain" }}
            priority
            sizes="180px"
          />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map(({ label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="text-gray-300 hover:text-purple-400 font-medium px-3 py-2 rounded-md
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 transition-colors duration-200"
            >
              {label}
            </button>
          ))}

          {/* Avatar on far right */}
          <Avatar
            alt="User Avatar"
            src={avatarUrl}
            sx={{ width: 56, height: 56, cursor: "pointer", ml: 4 }}
            onClick={onAvatarClick}
          />
        </div>

        {/* Mobile Hamburger */}
        <IconButton
          aria-label="open menu"
          onClick={() => setDrawerOpen(true)}
          className="text-gray-300 md:hidden"
          size="large"
        >
          <MenuIcon fontSize="inherit" />
        </IconButton>
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#121212",
            width: 260,
            paddingTop: 4,
            color: "white",
          },
        }}
      >
        <IconButton
          onClick={() => setDrawerOpen(false)}
          sx={{ color: "white", position: "absolute", top: 8, right: 8 }}
          aria-label="close menu"
          size="large"
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>

        <List>
          {navLinks.map(({ label, onClick }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton
                onClick={() => {
                  onClick();
                  setDrawerOpen(false);
                }}
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(124, 58, 237, 0.2)", // soft purple highlight
                  },
                }}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
