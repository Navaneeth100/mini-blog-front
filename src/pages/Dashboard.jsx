import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { url } from "../../mainurl";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const Dashboard = () => {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setmodal] = useState({ add: false, edit: false })
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${url}/posts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data?.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const toggleModal = (type) => { setmodal((prev) => ({ ...prev, [type]: !prev[type] })) };

  const resetForm = () => {
    setFormData({ title: "", content: "" });
  }

  const handleAdd = async () => {
    try {
      const res = await axios.post(`${url}/posts/`, formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      toggleModal('add');
      resetForm()
      fetchPosts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditClick = (post) => {
    setCurrentPost(post);
    setFormData({ title: post.title, content: post.content });
    toggleModal('edit');
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${url}/posts/${currentPost._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message);
      toggleModal('edit');
      resetForm()
      fetchPosts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#54d630ff",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`${url}/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(res.data.message);
        fetchPosts();
      } catch (e) {
        console.error(e);
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="container px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">My Posts</h2>
        <button
          onClick={() => toggleModal('add')}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          + Add Post
        </button>
      </div>

      {/* Loading */}

      {loading && (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
        </div>
      )}

      {/* Grid of cards (responsive) */}

      {!loading && (
        <>
          {posts?.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-3">
                    <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                      {post.content}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/posts/${post._id}`)}
                      className="rounded-lg border border-transparent bg-white px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-sky-700"
                    >
                      Read more
                    </button>
                    <button
                      onClick={() => handleEditClick(post)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-600">
              No posts found
            </div>
          )}
        </>
      )}

      {/* Add Modal */}

      {modal.add && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Post</h3>
              <button
                onClick={() => toggleModal('add')}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  rows={5}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Enter content"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => toggleModal('add')}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}

      {modal.edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Post</h3>
              <button
                onClick={() => toggleModal('edit')}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  rows={5}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Enter content"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => toggleModal('edit')}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Dashboard