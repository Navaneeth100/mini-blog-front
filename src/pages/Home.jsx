import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../mainurl";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setcurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchtext, setsearchtext] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get(`${url}/posts/?page=${currentPage}&search=${searchtext}`)
      .then((res) => {
        setPosts(res.data?.results || []);
        setTotalPages(res.data?.pages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [currentPage, searchtext]);

  const handleFirst = () => setcurrentPage(1);
  const handlePrev = () => setcurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setcurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleLast = () => setcurrentPage(totalPages);

  return (
    <div className="bg-gray-50 py-10 sm:py-14 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header and Search */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {user ? `Welcome ${user.name}` : "Latest Posts"}
            </h2>
            {!user && (
              <p className="mt-2 text-lg text-gray-600">
                Stay updated with our latest articles and insights.
              </p>
            )}
          </div>
          <div className="mt-4 sm:mt-0">
            <input
              type="text"
              value={searchtext}
              onChange={(e) => setsearchtext(e.target.value)}
              placeholder="Search by Title"
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Posts */}

        <div
          className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 
                      sm:mt-5 sm:pt-10 lg:mx-0 lg:max-w-none lg:grid-cols-3 min-h-[50vh]"
        >
          {loading ? (
            <p className="col-span-full text-center text-gray-500">
              Loading posts...
            </p>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <article
                key={post._id}
                className="flex max-w-xl flex-col items-start justify-between shadow-md hover:shadow-md transition-shadow p-6 rounded-lg bg-white border border-gray-100"
              >
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={post.createdAt} className="text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <div className="group relative grow">
                  <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                    {post.content}
                  </p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4 justify-self-end">
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">
                      {post.author?.name || ""}{" "}
                      <span className="text-gray-500">
                        | {post.author?.email || ""}
                      </span>
                    </p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="flex items-center justify-center text-center w-full min-h-[50vh]">
              <p className="col-span-full text-gray-500">
                No posts found
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}

        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={handleFirst}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-1 bg-white border rounded-md shadow-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={handleLast}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
