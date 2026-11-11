import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Katha Chitra | Bill Studio', description: 'Thoughtfully crafted bills for every occasion.' };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
