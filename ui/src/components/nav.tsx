import React from 'react';
import Link from 'next/link';

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <button className="btn">
    <Link href={href}>{children}</Link>
  </button>
);

const Nav = () => (
  <nav>
    <NavLink href="/">Home</NavLink>
    <NavLink href="/about">About</NavLink>
    <NavLink href="/venues">Venues</NavLink>
    <NavLink href="/events">Events</NavLink>
  </nav>
);

export default Nav;
