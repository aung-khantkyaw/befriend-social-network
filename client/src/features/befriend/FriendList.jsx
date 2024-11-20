const api = import.meta.env.VITE_API_URL;

import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { beFriendService } from "@/services/beFriendService";

export default function FriendList() {
  const { friends, friendsSuggestions } = beFriendService();

  return (
    <div>
      <Header page="Friends" />
      <div className="container mx-auto px-6">
        <Tabs defaultValue="following" className="max-w-4xl mx-auto">
          <div className="mb-4 flex justify-between">
            <TabsList>
              <TabsTrigger value="request" >Friend Requests</TabsTrigger>
              <TabsTrigger value="friend">Friends</TabsTrigger>
              <TabsTrigger value="suggestion">Friend Suggestion</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="request">
            <ScrollArea className="h-[53rem] p-5 border rounded-md">
              {/* {friendsSuggestions?.map((friendSuggestions) => (
                <Card
                  className="max-w-2xl mx-auto mb-2"
                  key={friendSuggestions.id}
                >
                  <CardHeader className="relative">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={`${api}/${friendSuggestions.profile}`}
                            alt={friendSuggestions.name}
                          />
                          <AvatarFallback className="text-4xl font-bold">
                            {friendSuggestions?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left">
                          <CardTitle className="text-xl">
                            {friendSuggestions.name}
                          </CardTitle>
                          <CardDescription>
                            @{friendSuggestions.username}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="space-x-4">
                        <Button>View Porfile</Button>
                        <Button>Add Friend</Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))} */}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="friend">
            <ScrollArea className="h-[53rem] p-5 border rounded-md">
              {friends?.map((friend) => (
                <Card className="max-w-2xl mx-auto mb-2" key={friend.id}>
                  <CardHeader className="relative">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={`${api}/${friend.profile}`}
                            alt={friend.name}
                          />
                          <AvatarFallback className="text-4xl font-bold">
                            {friend?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left">
                          <CardTitle className="text-xl">
                            {friend.name}
                          </CardTitle>
                          <CardDescription>@{friend.username}</CardDescription>
                        </div>
                      </div>
                      <div>
                        <Button variant="destructive">Unfriend</Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="suggestion">
            <ScrollArea className="h-[53rem] p-5 border rounded-md">
              {friendsSuggestions?.map((friendSuggestions) => (
                <Card
                  className="max-w-2xl mx-auto mb-2"
                  key={friendSuggestions.id}
                >
                  <CardHeader className="relative">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={`${api}/${friendSuggestions.profile}`}
                            alt={friendSuggestions.name}
                          />
                          <AvatarFallback className="text-4xl font-bold">
                            {friendSuggestions?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left">
                          <CardTitle className="text-xl">
                            {friendSuggestions.name}
                          </CardTitle>
                          <CardDescription>
                            @{friendSuggestions.username}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="space-x-4">
                        <Button>View Porfile</Button>
                        <Button>Add Friend</Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
