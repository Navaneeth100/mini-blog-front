import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { url } from "../../mainurl";

export default function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${url}/posts/${id}`)
            .then((res) => setPost(res.data))
            .catch((e) => console.error(e))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-12 text-center text-gray-600">
                Post not found.
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <article className="container px-4 py-10">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            >
                ← Back
            </button>

            <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
            <p className="mt-2 text-sm text-gray-500">
                {post.author?.name ? `${post.author.name} • ` : ""}
                {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
            </p>

            <div className="prose prose-indigo mt-6 max-w-none">
                <p className="whitespace-pre-wrap text-gray-800">{post.content}</p>
            </div>
        </article>
    );
}
