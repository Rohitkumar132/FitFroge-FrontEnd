import Layout from "@/components/layout/Layout";
import { ChallengeCard } from "@/components/FitnessCards";
import { useChallenges, useCommunity } from "@/hooks/useApi";

const CommunityPage = () => {
  const { data: posts } = useCommunity();
  const { data: challenges } = useChallenges();
  return (
    <Layout>
      <section className="section-padding fit-container">
        <p className="kicker">Community</p>
        <h1 className="mt-2 text-4xl font-black md:text-6xl">Stories, challenges, leaderboard</h1>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <div className="grid gap-4">
            {posts?.data.map(post => (
              <article key={post._id} className="glass-card rounded-lg p-5">
                <p className="kicker">{post.type}</p>
                <h2 className="mt-2 text-2xl font-black">{post.title}</h2>
                <p className="mt-3 text-muted-foreground">{post.content}</p>
                {(post.beforeImage || post.afterImage) && <div className="mt-5 grid grid-cols-2 gap-3"><img src={post.beforeImage} className="h-64 rounded-lg object-cover" /><img src={post.afterImage} className="h-64 rounded-lg object-cover" /></div>}
                <p className="mt-4 text-sm font-bold text-primary">{post.likes.length} likes · {post.comments.length} comments</p>
              </article>
            ))}
          </div>
          <aside>
            <h2 className="mb-4 text-2xl font-black">Active challenges</h2>
            <div className="grid gap-4">
              {challenges?.data.map(challenge => <ChallengeCard key={challenge._id} challenge={challenge} />)}
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default CommunityPage;
