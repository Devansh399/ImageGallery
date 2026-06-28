import { useState, useEffect, useCallback } from "react";
import {
  ImageIcon,
  Maximize2,
  Trash2,
  X,
  Monitor,
  Database,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { getAllImage, deleteImage } from "../services/app";

const ImageGallery = ({ refereshTrigger }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAllImage();
      setImages(result?.images || []);
    } catch (error) {
      setError("failed to synac with library");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [refereshTrigger, fetchImages]);

  const handleDelete = async (id) => {
    if (!window.confirm("Permanent deletion cannot be undone. Proceed?")) {
      return;
    }

    try {
      await deleteImage(id);
      setImages((prevImages) => prevImages.filter((img) => img.id !== id));
      if (selectedImage?.id === id) setSelectedImage(null);
    } catch (error) {
      alert("Error deleting file");
      console.error(error);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + "B";
    const k = 1024;
    const size = ["B", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + size[i];
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-medium tracking-wide">
          Fetching assests...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-2xl border border-red-100  px-6">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-red-700 font-bold text-lg">{error}</p>

        <button
          onClick={fetchImages}
          className="mt-4 text-sm text-red-600 underline"
        >
          Try agian
        </button>
      </div>
    );

  return (
    <div>
      {/* Conditional Rendering */}
      {images.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-slate-100 rounded-3xl">
          <ImageIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-700">
            Gallery is Empty
          </h3>

          <p className="text-slate-400">
            your uploaded assests will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Map method */}
          {images.map((image) => (
            <div
              className="group relative bg-white border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10"
              key={image.id}
            >
              {/* Image container */}
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img
                  src={`${import.meta.env.VITE_API_URL.replace("/api/v2", "")}${image.url}`}
                  alt={image.originalName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-slate-900/40 opacity-0 flex items-center justify-center gap-3 transition-opacity duration-300 group-hover:opacity-100">
                  <button className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-indigo-600 transition-all shadow-lg" onClick={()=> setSelectedImage(image)}>
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-red-500/80 backdrop-blur-md rounded-full text-white hover:bg-red-600 transition-all shadow-lg" onClick={()=> handleDelete(image.id)}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Info area */}

              <div className="p-4 bg-white">
                <p className="font-bold text-slate-800 truncate text-sm mb-1">
                  {image.originalName}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  <span>{image.dimensions.width}*{image.dimensions.height}</span>
                  <span>.</span>
                  <span>{formatSize(image.size)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Model / Lightbox */}
      {/* Conditional Rendering */}
  {selectedImage && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10">
        {/* overlay */}

<div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setSelectedImage(null)}></div>

        <div className="relative w-full max-w-5xl bg-white rounded-4xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh] shadow-2xl" >
          {/* Close Button */}
          <button className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 text-white lg:hidden rounded-full"
          onClick={()=> setSelectedImage(null)} >
            <X />
          </button>

          {/* Left Image Side */}
          <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
            <img
             src={`${import.meta.env.VITE_API_URL.replace("/api/v2", "")}${selectedImage.url}`}
              alt=""
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Right Side */}
          <div className="w-full lg:w-80 bg-slate-50 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 truncate pr-4">
                  Details
                </h3>

                <button className="hidden lg:block p-2 hover:bg-slate-200 rounded-xl transition-colors"
                onClick={()=> setSelectedImage(null)}
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-indigo-500 mt-1" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">
                      Dimensions
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {" "}
                      {selectedImage.dimensions.width} px width
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-indigo-500 mt-1" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">
                      Size
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {" "}
                      {formatSize(selectedImage.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-indigo-500 mt-1" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">
                      Created
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {" "}
                      {new Date(
                        selectedImage.uploadedAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-8 w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2" onClick={()=>handleDelete(selectedImage.id)}>
              <Trash2 className="w-4 h-4" />
              Delete Asset
            </button>
          </div>
        </div>
      </div>
  )}
    </div>
  );
};

export default ImageGallery;
