import Layout from "@/components/layout/Layout";
import { BlogCard } from "@/components/FitnessCards";
import { useBlogs } from "@/hooks/useApi";

const BlogPage = () => {
  const { data } = useBlogs();
  return (
    <Layout>
      <section className="section-padding fit-container">
        <p className="kicker">SEO fitness blog</p>
        <h1 className="mt-2 text-4xl font-black md:text-6xl">Training and nutrition intelligence</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data?.data.map(blog => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
