'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ResearchMind — Academic Workspace & Grounded RAG Platform</title>
        <meta
          name="description"
          content="Production-grade AI-driven academic research workspace for B.Tech/M.Tech students, PhD scholars, and researchers."
        />
      </head>
      <body className="antialiased min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
