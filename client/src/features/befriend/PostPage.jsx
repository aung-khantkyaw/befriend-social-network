import PropTypes from "prop-types";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MediaGalleryComponent from "./MediaGalleryComponent";
import { Button } from "@/components/ui/button";
import { MessageCircle, Share2, ThumbsUp } from "lucide-react";

export default function PostPage({ post }) {
  return (
    <Card key={post.id} className="mb-6 max-w-xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
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
        {post.media && <MediaGalleryComponent media={post.media} />}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Button variant="ghost" className="flex items-center space-x-2">
            <ThumbsUp className="w-4 h-4" />
            <span>Like ({post.likes})</span>
          </Button>
          <Button variant="ghost" className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Comment ({post.comments})</span>
          </Button>
          <Button variant="ghost" className="flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

PostPage.propTypes = {
  post: PropTypes.object.isRequired,
};
