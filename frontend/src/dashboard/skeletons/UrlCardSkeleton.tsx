import TagSkeleton from "./TagSkeleton";

const UrlCardSkeleton = () => {
    return (
      <div className="p-4 border-2 border-white animate-pulse">
        {/* Header con URL corta y botones */}
        <div className="flex justify-between items-start mb-2">
          <div>
            {/* URL corta y botones de acción */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-32 h-4 bg-white"></div>
              <div className="w-4 h-4 bg-white"></div>
              <div className="w-4 h-4 bg-white"></div>
            </div>
            {/* URL larga */}
            <div className="w-48 h-3 bg-white"></div>
            {/* Descripción */}
            <div className="w-40 h-3 bg-white mt-1"></div>
          </div>
          <div className="flex items-center gap-4">
            {/* Clicks y fecha */}
            <div className="text-right ">
              <div className="w-16 h-4 bg-white"></div>
              <div className="w-24 h-3 bg-white mt-1"></div>
            </div>
            {/* Botones de editar y eliminar */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white"></div>
              <div className="w-5 h-5 bg-white"></div>
            </div>
          </div>
        </div>
        {/* Etiquetas */}
        <div className="flex flex-wrap gap-2 mt-2">
          <TagSkeleton />
        </div>
      </div>
    );
  };

export default UrlCardSkeleton;