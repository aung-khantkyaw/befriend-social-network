import Header from "@/components/Header";
import Loading from "@/components/ui/loading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCreator from "@/features/befriend/PostCreator";
import PostPage from "@/features/befriend/PostPage";
import { authService } from "@/services/authService";
import { beFriendService } from "@/services/beFriendService";

export default function Newsfeed() {
  const { user } = authService();
  const { isLoading, getPosts, getFriendPosts, allPosts, friendPosts } =
    beFriendService();

  if (isLoading) {
    return <Loading />;
  }

  async function handleGetPosts() {
    await getFriendPosts(user?.id);
    await getPosts();
  }

  console.log(allPosts);
  return (
    <div>
      <Header page="Newsfeed" />
      <div className="container mx-auto px-6">
        <Tabs defaultValue="for_you" className="max-w-4xl mx-auto">
          <div className="mb-4 flex justify-between">
            <TabsList>
              <TabsTrigger value="for_you" onClick={handleGetPosts}>
                For You
              </TabsTrigger>
              <TabsTrigger value="following" onClick={handleGetPosts}>
                Following
              </TabsTrigger>
            </TabsList>
            <PostCreator />
          </div>
          <TabsContent value="following">
            <ScrollArea className="h-[53rem] p-5 border rounded-md">
              {friendPosts?.map((post) => (
                <PostPage
                  key={post.id}
                  post={post}
                  updatePost={handleGetPosts}
                />
              ))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="for_you">
            <ScrollArea className="h-[53rem] p-5 border rounded-md">
              {allPosts?.map((post) => (
                <PostPage
                  key={post.id}
                  post={post}
                  updatePost={handleGetPosts}
                />
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
