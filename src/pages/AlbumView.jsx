import { useState, useEffect, useRef } from "react";
import { Sparkles, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { Upload, Heart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { UserSearch } from "lucide-react";
import { Download } from "lucide-react";
import { api } from "../api/axiosInstance.js";
import { Spinner } from "../components/Spinner.jsx";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export const AlbumView = () => {
  const { albumId } = useParams();
  const fileInputRef = useRef(null);

  const [album, setAlbum] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchAlbum = async () => {
    try {
      const res = await api.get(`/albums/${albumId}`);
      setAlbum(res.data.album);
      setMedia(res.data.media);
    } catch (error) {
      toast.error("Couldn't load album");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbum();
  }, [albumId]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await api.post(`/albums/${albumId}/media`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMedia((prev) => [res.data.media, ...prev]);
      toast.success("Uploaded!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDownloadSingle = async (url, index, type) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.setAttribute(
        "download",
        `keep-memory-${index + 1}.${type === "video" ? "mp4" : "jpg"}`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      toast.error("Couldn't download");
    }
  };

  const handleRecognizeFaces = async (mediaId) => {
    try {
      const res = await api.post(`/media/${mediaId}/recognize-faces`);
      if (res.data.matchedUserIds.length === 0) {
        toast("No matches found", { icon: "🤷" });
      } else {
        toast.success(`Found ${res.data.matchedUserIds.length} match(es)!`);
      }
    } catch (error) {
      toast.error("Face recognition failed");
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get(`/media/album/${albumId}/export`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${album?.title || "album"}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (error) {
      toast.error("Couldn't export album");
    }
  };

  const handleReact = async (mediaId, emoji) => {
    try {
      const res = await api.post(`/media/${mediaId}/react`, { emoji });
      setMedia((prev) =>
        prev.map((item) =>
          item._id === mediaId
            ? { ...item, reactions: res.data.reactions }
            : item,
        ),
      );
    } catch (error) {
      toast.error("Couldn't react");
    }
  };

  const handleDelete = async (mediaId) => {
    try {
      await api.delete(`/media/${mediaId}`);
      setMedia((prev) => prev.filter((item) => item._id !== mediaId));
      toast.success("Deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't delete");
    }
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      await api.post(`/media/album/${albumId}/detect-duplicates`);
      toast.success("Analysis complete! Refreshing...");
      await fetchAlbum();
    } catch (error) {
      toast.error(error.response?.data?.message || "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTagPhoto = async (mediaId) => {
    try {
      const res = await api.post(`/media/${mediaId}/auto-tag`);
      setMedia((prev) =>
        prev.map((item) =>
          item._id === mediaId ? { ...item, tags: res.data.tags } : item,
        ),
      );
      toast.success("Tagged!");
    } catch (error) {
      toast.error("Couldn't tag photo");
    }
  };

  // const handleRecognizeFaces = async (mediaId) => {
  //   try {
  //     const res = await api.post(`/media/${mediaId}/recognize-faces`);
  //     if (res.data.matchedUserIds.length === 0) {
  //       toast("No matches found", { icon: "🤷" });
  //     } else {
  //       toast.success(`Found ${res.data.matchedUserIds.length} match(es)!`);
  //     }
  //   } catch (error) {
  //     toast.error("Face recognition failed");
  //   }
  // };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            to={`/groups/${album?.group}`}
            className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">
              {album?.title}
            </h1>
            {album?.eventDate && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(album.eventDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="flex items-center gap-2 border border-primary text-primary rounded-lg px-4 py-2 font-medium disabled:opacity-50"
          >
            <Sparkles size={18} />{" "}
            {analyzing ? "Analyzing..." : "Find Duplicates"}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-primary text-white rounded-lg px-4 py-2 font-medium disabled:opacity-50"
          >
            <Upload size={18} /> {uploading ? "Uploading..." : "Upload"}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleExport}
            className="flex items-center gap-2 border border-primary text-primary rounded-lg px-4 py-2 font-medium"
          >
            <Download size={18} /> Export
          </motion.button>
        </div>

        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {media.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            No memories here yet.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            Upload the first photo or video.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {media.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-xl overflow-hidden group"
            >
              {item.type === "video" ? (
                <video
                  src={item.url}
                  className="w-full h-40 object-cover"
                  controls
                />
              ) : (
                <img
                  src={item.url}
                  alt="memory"
                  className="w-full h-40 object-cover"
                />
              )}

              {item.isDuplicateOf && (
                <span className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Duplicate
                </span>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end max-w-[70%]">
                  {item.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleReact(item._id, "❤️")}
                  className="text-white"
                >
                  <Heart
                    size={16}
                    fill={item.reactions?.["❤️"]?.length ? "white" : "none"}
                  />
                </button>

                {item.type === "image" &&
                  (!item.tags || item.tags.length === 0) && (
                    <button
                      onClick={() => handleTagPhoto(item._id)}
                      className="text-white"
                      aria-label="Auto-tag"
                    >
                      <Tag size={16} />
                    </button>
                  )}

                {item.type === "image" && (
                  <button
                    onClick={() => handleRecognizeFaces(item._id)}
                    className="text-white"
                    aria-label="Recognize faces"
                  >
                    <UserSearch size={16} />
                  </button>
                )}

                <button
                  onClick={() =>
                    handleDownloadSingle(
                      item.url,
                      media.indexOf(item),
                      item.type,
                    )
                  }
                  className="text-white"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
