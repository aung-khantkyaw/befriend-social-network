import Header from "@/components/Header";
import Loading from "@/components/ui/loading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCreator from "@/features/befriend/PostCreator";
import PostPage from "@/features/befriend/PostPage";
import { beFriendService } from "@/services/beFriendService";

export default function Newsfeed() {
  const { isLoading, getPosts, posts } = beFriendService();

  isLoading && <Loading />;

  function handleGetPosts() {
    getPosts();
    window.scrollTo(0, 0);
  }

  // const posts = [
  //   {
  //     id: 1,
  //     user: { name: "John Doe", avatar: "/placeholder-user.jpg" },
  //     content:
  //       "Just finished a great workout! 💪 Feeling energized and ready to tackle the day. How's everyone else's morning going?",
  //     timestamp: "2 hours ago",
  //     likes: 15,
  //     comments: 3,
  //   },
  //   {
  //     id: 2,
  //     user: { name: "Jane Smith", avatar: "/placeholder-user.jpg" },
  //     content:
  //       "Excited to announce that I've just launched my new website! 🎉 Check it out and let me know what you think. Your feedback is always appreciated!",
  //     timestamp: "4 hours ago",
  //     likes: 32,
  //     comments: 8,
  //     media: [{ type: "image", url: "https://placehold.co/600x400/png" }],
  //   },
  //   {
  //     id: 3,
  //     user: { name: "Alex Johnson", avatar: "/placeholder-user.jpg" },
  //     content:
  //       "Beautiful sunset at the beach tonight. Sometimes you need to pause and appreciate the little things in life. 🌅",
  //     timestamp: "Yesterday at 8:30 PM",
  //     likes: 64,
  //     comments: 12,
  //     media: [
  //       { type: "image", url: "https://placehold.co/600x400/png" },
  //       { type: "image", url: "https://placehold.co/600x400/png" },
  //       { type: "image", url: "https://placehold.co/600x400/png" },
  //       { type: "image", url: "https://placehold.co/600x400/png" },
  //       { type: "image", url: "https://placehold.co/600x400/png" },
  //       { type: "image", url: "https://placehold.co/600x400/png" },
  //       { type: "image", url: "https://placehold.co/600x400/png" },
  //     ],
  //   },
  //   {
  //     id: 4,
  //     user: { name: "Emily Brown", avatar: "/placeholder-user.jpg" },
  //     content:
  //       "Just watched this amazing video on sustainable living. It's inspiring to see how small changes can make a big difference. What are your thoughts on sustainability?",
  //     timestamp: "2 days ago",
  //     likes: 45,
  //     comments: 20,
  //     media: [
  //       { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  //     ],
  //   },
  // ];

  return (
    <div>
      <Header page="Newsfeed" />
      <div className="container mx-auto px-6">
        <Tabs defaultValue="following" className="max-w-4xl mx-auto">
          <div className="mb-4 flex justify-between">
            <TabsList>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="for_you" onClick={handleGetPosts}>
                For You
              </TabsTrigger>
            </TabsList>
            <PostCreator />
          </div>
          <TabsContent value="following">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Following</h2>
            </div>
          </TabsContent>
          <TabsContent value="for_you">
            <ScrollArea className="h-[53rem] p-5 border rounded-md">
              {posts?.map((post) => (
                <PostPage key={post.id} post={post} />
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
