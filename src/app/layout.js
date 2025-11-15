import "./globals.css";
import ClientLayout from "@/client-layout";
import TopBar from "@/components/TopBar/TopBar";
import Nav from "@/components/Nav/Nav";
import ConditionalFooter from "@/components/ConditionalFooter/ConditionalFooter";

export const metadata = {
  title: "Terrene | MWT by Codegrid ",
  description: "Monthly Website Template by Codegrid | August 2025",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          <TopBar />
          <Nav />
          {children}
          <ConditionalFooter />
        </ClientLayout>
      </body>
    </html>
  );
}
