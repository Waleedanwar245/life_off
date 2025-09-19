import { convertToSecureUrl } from "../utils/convertToSecureUrl";

export default function CategoryBanner({ data }: any) {
  const category = data || {}; // Use `list` as primary source
  return (
    <div className="md:max-w-[70%] mx-auto p-4 mt-[250px] md:mt-6">
      <div className="flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <div style={{width:'clamp(119px, 18vw, 119px)',height:'clamp(119px, 18vw, 119px)'}} className="w-[200px] h-[200px] rounded-full border-4 border-[#a3e635] flex items-center justify-center bg-[#232F3E]">

              <img
                  src={convertToSecureUrl(category.image )|| "/placeholder.svg"}
                  alt={category.title}
                  
                  className= " rounded-full w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <h1 className="text-[33.9px] font-bold tracking-tight text-gray-800" style={{fontSize:'clamp(24px, 2vw, 33.9px)'}}>
            {category.categoryName || "Category"}
          </h1>

        </div>
      </div>
    </div>
  );
}
