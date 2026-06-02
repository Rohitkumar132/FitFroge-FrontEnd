import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useBlog } from "@/hooks/useApi";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const { data } = useBlog(slug);
  const blog = data?.data;

  useEffect(() => {
    if (blog) {
      document.title = blog.seoTitle;
      document.querySelector('meta[name="description"]')?.setAttribute("content", blog.seoDescription);
    }
  }, [blog]);

  if (!blog) return <Layout><div className="section-padding fit-container">Loading article...</div></Layout>;

  return (
    <Layout>
      <article className="section-padding fit-container max-w-4xl">
        <p className="kicker">{blog.category}</p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">{blog.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{blog.excerpt}</p>
        <img src={blog.coverImage} alt={blog.title} className="mt-8 max-h-[520px] w-full rounded-lg object-cover" />
        <div className="prose prose-invert mt-8 max-w-none text-foreground">
          {blog.content.split(". ").map(paragraph => <p key={paragraph}>{paragraph}.</p>)}
        </div>
      </article>
    </Layout>
  );
};

export default BlogDetailPage;
