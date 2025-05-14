interface StoreGridProps {
    stores: string[]
  }
  
  export default function StoreGrid({ stores }: StoreGridProps) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {stores.map((store, index) => (
          <div key={index} className="border rounded p-4 flex items-center justify-center h-20">
            <div className="text-center font-semibold">{store}</div>
          </div>
        ))}
      </div>
    )
  }
  
  