
interface SettingsItemProps {
    itemTitle: string;
    itemDescription?: string;
    children: React.ReactNode
}

const SettingsItem: React.FC<SettingsItemProps> =  ({
    itemTitle,
    itemDescription,
    children
}) => {
  return (
    <>
      <div className="flex items-center justify-between w-full mt-2">
          <div className="text-left">
                  <h3 className="text-md text-gray-500">{itemTitle}</h3>
                  {itemDescription && (
                    <p className="text-sm text-gray-400 mt-2">{itemDescription}</p>
                  )}
          </div>
          {/* Can be different Items */}
          {children}
      </div>
    </>
  )
}

export default SettingsItem
