import React from "react";
import { useState, createContext, useContext } from "react";
import { faker } from "@faker-js/faker";
const PostContext = createContext([]);
function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}
function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 20 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 2
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toUpperCase()
            .includes(searchQuery.toUpperCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [...posts, post]);
  }

  function handleClearPosts() {
    setPosts([]);
  }
  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
function usePost() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("PostContext was out side the provider");
  return context;
}
export { PostProvider, usePost };
