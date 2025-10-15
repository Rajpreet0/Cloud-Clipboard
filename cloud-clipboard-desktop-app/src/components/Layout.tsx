import SideMenuBar from "./SideMenuBar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <div className="flex h-screen w-[100vw]">
      <SideMenuBar/>
      <main className="p-4">
        {children}
      </main>
    </div>
  )
}

export default Layout
