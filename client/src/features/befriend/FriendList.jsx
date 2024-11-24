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
// import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/services/authService";
import { beFriendService } from "@/services/beFriendService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FriendList() {
  const { user } = authService();
  const {
    friends,
    friendsSuggestions,
    friendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    unfriend,
  } = beFriendService();
  const navigate = useNavigate();

  const [filteredFriends, setFilteredFriends] = useState(friends);

  const [filteredFriendRequests, setFilteredFriendRequests] =
    useState(friendRequests);

  const [filteredSuggestions, setFilteredSuggestions] =
    useState(friendsSuggestions);

  useEffect(() => {
    setFilteredSuggestions(friendsSuggestions);
    setFilteredFriends(friends);
    setFilteredFriendRequests(friendRequests);
  }, [friendsSuggestions, friends, friendRequests]);

  const handleUnfriend = (friendshipId) => {
    unfriend(friendshipId);
    setFilteredFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.friendshipId !== friendshipId)
    );
  };

  const handleAcceptFriendRequest = (friendshipId) => {
    acceptFriendRequest(friendshipId);
    setFilteredFriendRequests((prevFriendRequests) =>
      prevFriendRequests.filter(
        (friendRequest) => friendRequest.id !== friendshipId
      )
    );
  };

  const handleAddFriend = (friendId) => {
    sendFriendRequest(user.id, friendId);
    setFilteredSuggestions((prevSuggestions) =>
      prevSuggestions.filter((suggestion) => suggestion.id !== friendId)
    );
  };

  return (
    <div>
      <Header page="Friends" />
      <div className="container mx-auto px-6">
        <Tabs defaultValue="request" className="max-w-4xl mx-auto">
          <div className="mb-4 flex sticky top-16 justify-between z-40 bg-white">
            <TabsList>
              <TabsTrigger value="request">Friend Requests</TabsTrigger>
              <TabsTrigger value="friend">Friends</TabsTrigger>
              <TabsTrigger value="suggestion">Friend Suggestion</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="request">
            {/* <ScrollArea className="h-[53rem] p-5 border rounded-md"> */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredFriendRequests?.map((friendRequest) => (
                <Card className="w-72 mx-auto mb-2" key={friendRequest.user.id}>
                  <CardHeader className="relative">
                    <div className="flex-row items-center">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={`${api}/${friendRequest.user.profile}`}
                            alt={friendRequest.user.name}
                          />
                          <AvatarFallback className="text-4xl font-bold">
                            {friendRequest.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left">
                          <CardTitle className="text-xl">
                            {friendRequest.user.name}
                          </CardTitle>
                          <CardDescription>
                            @{friendRequest.user.username}
                          </CardDescription>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between gap-2">
                        <Button
                          onClick={() =>
                            navigate(`/${friendRequest.user.username}`)
                          }
                        >
                          View Porfile
                        </Button>
                        <Button
                          onClick={() => {
                            handleAcceptFriendRequest(friendRequest.id);
                          }}
                        >
                          Accept Friend
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            {/* </ScrollArea> */}
          </TabsContent>
          <TabsContent value="friend">
            {/* <ScrollArea className="h-[53rem] p-5 border rounded-md"> */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredFriends?.map((friend) => (
                <Card className="w-72 mx-auto mb-2" key={friend.id}>
                  <CardHeader className="relative">
                    <div className="flex-row items-center">
                      <div className="flex items-center space-x-4">
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
                      <Separator />
                      <div className="flex items-center justify-between gap-2">
                        <Button
                          onClick={() => navigate(`/${friend?.username}`)}
                        >
                          View Porfile
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            handleUnfriend(friend.friendshipId);
                          }}
                        >
                          Unfriend
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            {/* </ScrollArea> */}
          </TabsContent>
          <TabsContent value="suggestion">
            {/* <ScrollArea className="h-[53rem] p-5 border rounded-md"> */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredSuggestions?.map((friendSuggestions) => (
                <Card className="w-72 mx-auto mb-2" key={friendSuggestions.id}>
                  <CardHeader className="relative">
                    <div className="flex-row items-center">
                      <div className="flex items-center space-x-4">
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
                      <Separator />
                      <div className="flex items-center justify-between gap-2">
                        <Button
                          onClick={() =>
                            navigate(`/${friendSuggestions?.username}`)
                          }
                        >
                          View Porfile
                        </Button>
                        <Button
                          onClick={() => handleAddFriend(friendSuggestions.id)}
                        >
                          Add Friend
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            {/* </ScrollArea> */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
