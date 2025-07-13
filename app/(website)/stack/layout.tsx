import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://yunfei07.github.io"),
  title: "Stack",
  description: "Products & Tools used by Fei.",
  openGraph: {
    title: "Stack",
    description: "Products & Tools used by Fei.",
  },
};

export default function LettersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
