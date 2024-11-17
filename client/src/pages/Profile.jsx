const api = import.meta.env.VITE_API_URL;
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  GlobeIcon,
  LogIn,
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  InstagramIcon,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";
import { authService } from "@/services/authService";
import { formatDate, lastLogin, DateFormatter } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ErrorPage from "@/components/ui/error";
import Header from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import Newsfeed from "./Newsfeed";
import PostPage from "@/features/befriend/PostPage";
import MediaGalleryComponent from "@/features/befriend/MediaGalleryComponent";
import { Button } from "@/components/ui/button";

const getLinkIcon = (type) => {
  switch (type) {
    case "website":
      return <GlobeIcon className="w-4 h-4" />;
    case "github":
      return <GithubIcon className="w-4 h-4" />;
    case "linkedin":
      return <LinkedinIcon className="w-4 h-4" />;
    case "twitter":
      return <TwitterIcon className="w-4 h-4" />;
    case "instagram":
      return <InstagramIcon className="w-4 h-4" />;
    default:
      return <GlobeIcon className="w-4 h-4" />;
  }
};

export default function Profile() {
  const { getUserData, likePost, unlikePost } = authService();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const avatar = `${api}/${user?.profile}`;

  const actions = {
    likePost: async (postId, userId) => {
      /* function implementation */
    },
    unlikePost: async (postId, userId) => {
      /* function implementation */
    },
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getUserData(username);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchProfile();
  }, [username]);

  if (!user) {
    return <ErrorPage />;
  }

  return (
    <div>
      <Header page="Profile" />
      <ScrollArea className="h-[53rem]">
        <div className="container mx-auto p-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="relative">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={avatar} alt={user.name} />
                  <AvatarFallback className="text-4xl font-bold">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>@{user.username}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="info">
                <TabsList className="mb-4">
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                <TabsContent value="info">
                  {user.bio && (
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <p>{user.bio}</p>
                    </div>
                  )}
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <p>{user.email}</p>
                    </div>
                    {user.gender && (
                      <div className="grid gap-2">
                        <Label htmlFor="gender">Gender</Label>
                        <p>{user.gender}</p>
                      </div>
                    )}
                    {user.dob && (
                      <div className="grid gap-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <p>{DateFormatter(user.dob)}</p>
                      </div>
                    )}
                    {user.address && (
                      <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <p>{user.address}</p>
                      </div>
                    )}
                    {user.relationship && (
                      <div className="grid gap-2">
                        <Label htmlFor="relationship">
                          Relationship Status
                        </Label>
                        <p>{user.relationship}</p>
                      </div>
                    )}
                    {user.partner && (
                      <div className="grid gap-2">
                        <Label htmlFor="partner">Partner</Label>
                        <p>{user.partner}</p>
                      </div>
                    )}
                  </div>
                  <Separator />
                  {user.links?.length > 0 && (
                    <div className="grid gap-2">
                      <Label>Links</Label>
                      <div className="flex flex-col space-y-2">
                        {user.links?.map((link, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            {getLinkIcon(link.type)}
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link.url}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="activity">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                      <span>Joined {formatDate(user?.created)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LogIn className="w-4 h-4 text-gray-500" />
                      <span>Last login: {lastLogin(user?.lastLogin)}</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {user.posts?.map((post) => (
          <Card key={post.id} className="mb-6 max-w-xl mx-auto">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={api + "/" + user.profile} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{post.content}</p>
              {post.medias && <MediaGalleryComponent media={post.medias} />}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex space-x-4">
                <Button
                  onClick={
                    post.likes.includes(user.id)
                      ? () => actions.unlikePost(post.id, user.id)
                      : () => actions.likePost(post.id, user.id)
                  }
                >
                  {post.likes.includes(user.id) ? "Unlike" : "Like"}
                </Button>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Comment ({post?.comments.length})</span>
                </Button>
                {/* <Button variant="ghost" className="flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </Button> */}
              </div>
            </CardFooter>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
}
