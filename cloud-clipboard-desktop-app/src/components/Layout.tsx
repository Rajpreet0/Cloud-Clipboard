import SideMenuBar from "./SideMenuBar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <div className="flex h-screen bg-[#F8FAFC]/20">
      <div className="fixed left-0 top-0 h-screen w-[80px] ">
        <SideMenuBar/>
      </div>
      <main className="ml-[80px] flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
