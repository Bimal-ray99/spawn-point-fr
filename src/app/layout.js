import "./globals.css";
import ClientLayout from "@/client-layout";
import { GlobalNav } from "@/components/GlobalNav";
import { GlobalBackground } from "@/components/GlobalBackground";
import ConditionalFooter from "@/components/ConditionalFooter/ConditionalFooter";

export const metadata = {
  title: "Spawn Point",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#E0F2FE] min-h-screen">
        <ClientLayout>
          <GlobalBackground />
          <div className="relative z-10">
            <GlobalNav />
            {children}
          </div>
        </ClientLayout>
        <ConditionalFooter />
      </body>
    </html>
  );
}
