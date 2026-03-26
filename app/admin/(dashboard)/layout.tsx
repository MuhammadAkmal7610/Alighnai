import { Sidebar } from "@/components/cms/ModernSidebar";

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      {children}
    </Sidebar>
  );
}
