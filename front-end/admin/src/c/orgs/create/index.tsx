import axios from "axios";
import React from "react";
import { getApiDomain } from "../../../App";

const client = axios.create({
  baseURL: getApiDomain() 
});

export default function Organizations() {
  const [post, setPost] = React.useState(null);

  React.useEffect(() => {
    async function getPost() {
      const response = await client.get("/organization");
      setPost(response.data);
    }
    getPost();
  }, []);

  async function deletePost() {
    await client.delete("/1");
    alert("Post deleted!");
    setPost(null);
  }

  if (!post) return "No post!"

  return (
    <div>

      <button onClick={deletePost}>Delete Post</button>
    </div>
  );
}