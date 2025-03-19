import ProfileSidenav from "@/components/ProfileSideNav";


export default function InvestLayout({ children }: { children: React.ReactNode }) {

    return (
          <>
          <div className="flex h-screen flex-col">
              <div className="flex">
              <ProfileSidenav />
              <main className="flex">{children}</main>
              </div>
          </div>
          </>
      );
  };