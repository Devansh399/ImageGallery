import { ImagePlus, FolderOpen, Database } from "lucide-react";
import ImageUpload from "./components/ImageUpload";
import ImageGallery from "./components/ImageGallery";
import { useEffect, useState } from "react";
import { getAllImage } from "./services/app";


function App() {


  const [refereshGallery, setRefereshGallery] = useState(0);
  const [storageState, setStorageState] = useState({
    used:0,
    total: 5 * 1024 * 1024, // 5GB in bytes

  });

  // calculate total size
  const updateStorageStats = async ()=>{
    try{
        const result = await getAllImage();
        const totalUsed = result.images.reduce((acc, img)=> acc + (img.size || 0),
      0,
    );

    setStorageState((prev)=>({...prev, used: totalUsed}))

    }catch(err){
           console.log("Failed to update storage", err);
    }
  }


  // update image whenever a upload happes

  useEffect(()=>{
    updateStorageStats();
  }, [refereshGallery]);

  const handleUploadSuccess = ()=>{
    setRefereshGallery((prev)=> prev + 1);
  };


  // Helper to formate bytes to human readable

  const formatBytes = (bytes)=>{
             if(bytes === 0)return "0 B";
             const k = 1024;
             const size = ["B", "KB", "MB", "GB"];
             
             
             const i = Math.floor(Math.log(bytes)/Math.log(k));
             return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + size[i];
  };

  const usedPercentage = storageState.total
    ? Math.min((storageState.used / storageState.total) * 100, 100)
    : 0;



  return (
    <>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900">
        <div className="max-w-[1600px] mx-auto p-4 lg:p-8">
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Digital Assets
              </h1>
              <p className="text-slate-500 text-sm">
                Manage and deploy your media library
              </p>
            </div>
          </header>

          <div className="grid lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                {/* Upload card */}

                <div className="bg-white p-1 rounded-3xl shadow-sm border border-slate-200">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-indigo-600 rounded-lg shadow-lg">
                        <ImagePlus className="w-5 h-5 text-white" />
                      </div>

                      <h2 className="font-bold text-slate-800">Quick Upload</h2>
                    </div>

                    <ImageUpload  onUplaadSuccess={handleUploadSuccess}/>
                  </div>
                </div>

                {/* Dynamic States Card */}
                <div className="bg-indigo-500 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                  <Database className="w-24 h-24 absolute -right-4 -bottom-4 text-white/10 rotate-12" />

                  <p className="text-indigo-100 text-sm font-bold uppercase tracking-wider mb-1">
                    Storage Used
                  </p>

                  <h3>
                    {formatBytes(storageState.used)} /{" "}
                    <span className="text-indigo-300 text-sm font-medium">
                      / {formatBytes(storageState.total)}   
                    </span>
                  </h3>

                  {/* Progress bar */}
                  <div className="w-full bg-indigo-800 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{width:`${usedPercentage}%`}}></div>
                    <p className="text-[10px] text-indigo-200 font-medium">
                      {usedPercentage.toFixed(1)}% of your capacity reached
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 min-h-[600px]">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <FolderOpen className="w-6 h-6 text-indigo-500" />

                    <h2 className="text-xl font-black text-slate-800">
                      Media Library
                    </h2>
                  </div>
                  <ImageGallery refereshTrigger={refereshGallery} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
