import Layout from "@/components/layout/Layout";
import { useVideos } from "@/hooks/useApi";

const VideosPage = () => {
  const { data } = useVideos();
  return (
    <Layout>
      <section className="section-padding fit-container">
        <p className="kicker">Free video coaching</p>
        <h1 className="mt-2 text-4xl font-black md:text-6xl">YouTube and Cloudinary-ready sessions</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {data?.data.map(video => (
            <div key={video._id} className="fitness-card">
              <div className="aspect-video bg-black">
                {video.provider === "youtube" ? <iframe src={video.url} title={video.title} className="h-full w-full" allowFullScreen /> : <video src={video.url} poster={video.thumbnail} controls className="h-full w-full" />}
              </div>
              <div className="p-4">
                <p className="kicker">{video.provider}</p>
                <h2 className="text-xl font-black">{video.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{video.durationMinutes} min · {video.difficulty} · {video.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default VideosPage;
