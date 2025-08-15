import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { url } from "../../mainurl";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Dashboard = () => {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ add: false, edit: false });
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [currentPage, setcurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchtext, setsearchtext] = useState("");

  useEffect(() => {
    fetchPosts()
  }, [currentPage, searchtext]);

  const handleFirst = () => setcurrentPage(1);
  const handlePrev = () => setcurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setcurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleLast = () => setcurrentPage(totalPages);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${url}/posts/my-posts?page=${currentPage}&search=${searchtext}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data?.results || []);
      setTotalPages(res.data?.pages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleModal = (type) => setModal((prev) => ({ ...prev, [type]: !prev[type] }));

  const handleEditClick = (post) => {
    setCurrentPost(post);
    setFormData({ title: post.title, content: post.content });
    toggleModal('edit');
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
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchtext}
            onChange={(e) => setsearchtext(e.target.value)}
            placeholder="Search by Title"
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
          <button
            onClick={() => toggleModal('add')}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            + Add Post
          </button>
        </div>
      </div>

      {/* Loading */}

      {loading && (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
        </div>
      )}

      {/* Grid of cards */}

      {!loading && (
        <>
          {posts?.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 min-h-[50vh]">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <img
                      src=""
                      alt=""
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}

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
                      className="rounded-lg border border-transparent bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-200 transition"
                    >
                      Read more
                    </button>
                    <button
                      onClick={() => handleEditClick(post)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-gray-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-rose-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="rounded-2xl p-10 text-center text-gray-600">
              No posts found
            </div>
          </div>
          )}

          {/* Pagination */}

          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={handleFirst}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 transition"
            >
              First
            </button>
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 transition"
            >
              Prev
            </button>
            <span className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 transition"
            >
              Next
            </button>
            <button
              onClick={handleLast}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 transition"
            >
              Last
            </button>
          </div>
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

            <Formik
              initialValues={{ title: "", content: "", image: null }}
              validationSchema={Yup.object({
                title: Yup.string()
                .required("Title is required")
                .min(3, "Title too short"),
                content: Yup.string()
                .required("Content is required")
                .min(10, "Content too short"),
              })}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  const fd = new FormData();
                  fd.append("title", values.title);
                  fd.append("content", values.content);
                  if (values.image) fd.append("image", values.image);

                  const res = await axios.post(`${url}/posts/`, fd, {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
                  });
                  toast.success(res.data.message);
                  toggleModal("add");
                  fetchPosts();
                  resetForm();
                } catch (err) {
                  toast.error(err.response?.data?.error || "Something went wrong!");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ setFieldValue, values, isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Title
                      </label>
                    <Field
                      type="text"
                      name="title"
                      placeholder="Enter title"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                    <ErrorMessage 
                    name="title" 
                    component="div" 
                    className="text-red-500 text-xs text-start italic mt-1" 
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Content
                      </label>
                    <Field
                      as="textarea"
                      rows={5}
                      name="content"
                      placeholder="Enter content"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                    <ErrorMessage 
                    name="content" 
                    component="div" 
                    className="text-red-500 text-xs text-start italic mt-1"
                     />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFieldValue("image", e.currentTarget.files[0])}
                      className="w-full"
                    />
                    {values.image && (
                      <img
                        src={URL.createObjectURL(values.image)}
                        alt="Preview"
                        className="mt-2 w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => toggleModal("add")}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Save
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
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
                onClick={() => toggleModal("edit")}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <Formik
              enableReinitialize
              initialValues={{ title: formData.title, content: formData.content, image: null }}
              validationSchema={Yup.object({
                title: Yup.string()
                .required("Title is required")
                .min(3, "Title too short"),
                content: Yup.string()
                .required("Content is required")
                .min(10, "Content too short"),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const fd = new FormData();
                  fd.append("title", values.title);
                  fd.append("content", values.content);
                  if (values.image) fd.append("image", values.image);

                  const res = await axios.put(
                    `${url}/posts/${currentPost._id}`,
                     fd, 
                     {headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
                  });
                  toast.success(res.data.message);
                  toggleModal("edit");
                  fetchPosts();
                } catch (err) {
                  toast.error(err.response?.data?.error || "Something went wrong!");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ setFieldValue, values, isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Title
                      </label>
                    <Field
                      type="text"
                      name="title"
                      placeholder="Enter title"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                    <ErrorMessage 
                    name="title" 
                    component="div" 
                    className="text-red-500 text-xs text-start italic mt-1"
                     />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Content
                      </label>
                    <Field
                      as="textarea"
                      rows={5}
                      name="content"
                      placeholder="Enter content"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                    <ErrorMessage 
                    name="content" 
                    component="div" 
                    className="text-red-500 text-xs text-start italic mt-1"
                     />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFieldValue("image", e.currentTarget.files[0])}
                      className="w-full"
                    />
                    {values.image ? (
                      <img src={URL.createObjectURL(values.image)} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                    ) : currentPost.image ? (
                      <img src={currentPost.image} alt="Current" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                    ) : null}
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => toggleModal("edit")}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Update
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
export default Dashboard