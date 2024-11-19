import Header from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { beFriendService } from "@/services/beFriendService";

export default function FriendList() {
  const { friends } = beFriendService();

  console.log(friends);

  return (
    <div>
      <Header page="Friends" />
      <div className="container mx-auto px-6">
        <Tabs defaultValue="following" className="max-w-4xl mx-auto">
          <div className="mb-4 flex justify-between">
            <TabsList>
              <TabsTrigger value="following">Friend Requests</TabsTrigger>
              <TabsTrigger value="for_you">Friends</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="following">
            <ScrollArea className="h-[53rem] p-5 border rounded-md">
              Frinend Requests
            </ScrollArea>
          </TabsContent>
          <TabsContent value="for_you">
            <ScrollArea className="h-[53rem] p-5 border rounded-md">
              Friends
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
