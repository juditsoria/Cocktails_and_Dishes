"use client";
import React, { useState, useEffect } from "react";
import "./styles.css";

interface Post {
  post_id: number;
  content: string;
  user_id: number;
  user?: { username: string }; // Esto es opcional dependiendo de si la información del usuario está disponible
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:5000/api/post");
      const data: Post[] = await response.json();
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const createPost = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Agrega un user_id (puede ser un valor fijo o provenir de un estado/autenticación)
        body: JSON.stringify({ content, user_id: 1 }),
      });
  
      if (response.ok) {
        setContent("");
        fetchPosts(); // Refrescar la lista de posts
      }
    } catch (error) {
      console.error("Error creating post", error);
    }
  };
  

  const deletePost = async (postId: number): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:5000/api/post/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPosts(); // Refrescar la lista de posts
      }
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Formulario de creación de post */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Blog de Cócteles</h1>

        <form onSubmit={createPost}>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-md shadow-md mb-4"
            placeholder="Escribe tu post..."
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
          ></textarea>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
            Publicar
          </button>
        </form>
      </div>

      {/* Lista de posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.post_id}
            className="p-6 border border-gray-200 rounded-lg shadow-lg bg-white"
          >
            <div className="flex justify-between items-center mb-4">
            {post.user?.username || "Usuario desconocido"}
              <button
                onClick={() => deletePost(post.post_id)}
                className="bg-red-500 text-white p-2 rounded-md ml-auto"
              >
                Eliminar
              </button>
            </div>
            <p className="text-gray-700">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
