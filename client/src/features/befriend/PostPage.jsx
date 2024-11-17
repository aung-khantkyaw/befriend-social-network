import PropTypes from "prop-types";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MediaGalleryComponent from "./MediaGalleryComponent";
import { Button } from "@/components/ui/button";
import { MessageCircle, Share2, ThumbsUp } from "lucide-react";
import { beFriendService } from "@/services/beFriendService";
import { authService } from "@/services/authService";

export default function PostPage({ post }) {
  const { user } = authService();
  const { likePost, unlikePost } = beFriendService();
  const api = import.meta.env.VITE_API_URL;

  console.log("hell", post.likes[0].userId);
  return (
    <Card key={post.id} className="mb-6 max-w-xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={api + "/" + post.user.profile}
              alt={post.user.name}
            />
            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.user.name}</p>
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
                ? () => unlikePost(post.id, user.id)
                : () => likePost(post.id, user.id)
            }
          >
            {post.likes.includes(user.id) ? "Unlike" : "Like"}
            {post.likes.length > 0 && ` (${post.likes.length})`}
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
  );
}

PostPage.propTypes = {
  post: PropTypes.object.isRequired,
};
