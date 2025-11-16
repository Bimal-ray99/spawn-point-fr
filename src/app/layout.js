import "./globals.css";
import ClientLayout from "@/client-layout";
import TopBar from "@/components/TopBar/TopBar";
import Nav from "@/components/Nav/Nav";
import ConditionalFooter from "@/components/ConditionalFooter/ConditionalFooter";

export const metadata = {
  title: "Sapwn Point",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          <TopBar />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
