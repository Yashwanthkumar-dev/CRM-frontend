import { CameraIcon, UserCircle, Mail, Phone, ShieldCheck, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchEmployeeProfile, uploadImageApi } from "../Api/api";
import toast, { Toaster } from "react-hot-toast";

function EmployeeProfile() {
  const [user, setUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await fetchEmployeeProfile();
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) { // 2MB limit
        toast.error("Image size should be less than 2MB");
        return;
      }
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image first");
      return;
    }

    const loadingToast = toast.loading("Uploading your photo...");
    try {
      await uploadImageApi(imageFile);
      toast.success("Profile picture updated!", { id: loadingToast });
      fetchUser();
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      toast.error("Upload failed. Try again.", { id: loadingToast });
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

          <div className="px-8 pb-12">
            <div className="relative -mt-16 flex flex-col sm:flex-row items-end gap-6 mb-10">
              
              {/* Profile Image Section */}
              <div className="relative group">
                <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  ) : user?.imageData ? (
                    <img 
                      src={`data:${user.imageType};base64,${user.imageData}`} 
                      alt="profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <UserCircle size={100} className="text-gray-300" />
                  )}
                </div>
                
                <button
                  onClick={() => document.getElementById("fileInput").click()}
                  className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-xl shadow-lg hover:scale-110 transition-transform"
                >
                  <CameraIcon size={20} />
                </button>
                <input type="file" id="fileInput" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>

              {/* Basic Info */}
              <div className="flex-1 pb-2">
                <h2 className="text-3xl font-bold text-gray-900">{user?.name || "Employee Name"}</h2>
                <p className="text-blue-600 font-medium flex items-center gap-2 capitalize">
                  <ShieldCheck size={18} /> {user?.role || "Employee"}
                </p>
              </div>

              {/* Action Button */}
              {imageFile && (
                <button
                  onClick={handleUpload}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:bg-green-700 transition-all mb-2"
                >
                  Save New Photo
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Detail Cards */}
              <div className="space-y-6">
                <div className="group p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <div className="flex items-center gap-3 text-gray-500 mb-1">
                    <Mail size={18} /> <span className="text-sm font-medium">Email Address</span>
                  </div>
                  <p className="text-gray-900 font-semibold pl-7">{user?.email || "N/A"}</p>
                </div>

                <div className="group p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <div className="flex items-center gap-3 text-gray-500 mb-1">
                    <Phone size={18} /> <span className="text-sm font-medium">Phone Number</span>
                  </div>
                  <p className="text-gray-900 font-semibold pl-7">{user?.number || "N/A"}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="group p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <div className="flex items-center gap-3 text-gray-500 mb-1">
                    <MapPin size={18} /> <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-gray-900 font-semibold pl-7">{user?.location || "Not Updated"}</p>
                </div>

                <div className="group p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <div className="flex items-center gap-3 text-gray-500 mb-1">
                    <ShieldCheck size={18} /> <span className="text-sm font-medium">Account Access</span>
                  </div>
                  <p className="text-gray-900 font-semibold pl-7 capitalize">{user?.role} Level Access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;