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
import { MessageCircle, MoreHorizontal, ThumbsUp, Trash2 } from "lucide-react";
import { beFriendService } from "@/services/beFriendService";
import { authService } from "@/services/authService";
import { useEffect, useState } from "react";
import { diffForHumans } from "@/lib/utils";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { ButtonDelete } from "@/components/button-delete";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

export default function PostPage({ post, updatePost }) {
  const { user } = authService();
  const {
    deletePost,
    likePost,
    unlikePost,
    addComment,
    successType,
    successMessage,
  } = beFriendService();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes?.length);
  // const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  useEffect(() => {
    const hasLiked = post.likes.some((like) => like.userId === user.id);
    setIsLiked(hasLiked);
  }, [post.likes, user.id]);

  const like = async () => {
    try {
      await likePost(post.id, user.id);
      setIsLiked(true);
      setLikes((prevLikes) => prevLikes + 1);
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  const unlike = async () => {
    try {
      await unlikePost(post.id, user.id);
      setIsLiked(false);
      setLikes((prevLikes) => prevLikes - 1);
    } catch (error) {
      console.error("Error unliking the post:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      updatePost();
    } catch (error) {
      console.error("Error deleting the post:", error);
    }
  };

  const handleCommentChange = (e) => {
    setContent(e.target.value);
  };

  // const handleCommentSubmit = async () => {
  //   if (!content.trim()) return; // Prevent empty comments
  //   try {
  //     const newComment = await addComment(post.id, user.id, content);
  //     // Update the comments state with the new comment
  //     setComments((prevComments) => [...prevComments, newComment]);
  //     setContent(""); // Clear the input
  //   } catch (error) {
  //     console.error("Error adding a comment:", error);
  //   }
  // };

  const handleCommentSubmit = async () => {
    if (!content.trim()) return;
    const newComment = {
      id: Date.now(),
      user: { id: user.id, name: user.name, profile: user.profile },
      content,
      createdAt: new Date().toISOString(),
    };

    setComments((prevComments) => [...prevComments, newComment]);
    setContent("");

    try {
      await addComment(post.id, user.id, content);
    } catch (error) {
      console.error("Error adding a comment:", error);
    }
  };

  const api = import.meta.env.VITE_API_URL;

  if (successType === "deletePost") {
    toast({
      title: "Post deleted",
      description: successMessage,
      duration: 3000,
    });
  }

  return (
    <Card key={post.id} className="mb-6 max-w-xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Avatar>
              <AvatarImage
                src={api + "/" + post.user?.profile}
                alt={post.user?.name}
              />
              <AvatarFallback>{post.user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.user?.name}</p>
              <p className="text-sm text-gray-500">
                {diffForHumans(post.createdAt)}
              </p>
            </div>
          </div>
          {post.user.id === user.id && (
            // <Button
            //   className="bg-red-500 text-white"
            //   onClick={handleDelete}
            // >
            //   <Trash2 color="#fff" className="w-10 h-10" />
            // </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 size={20} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the post.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleDelete();
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            // <Popover open={isOpen} onOpenChange={setIsOpen}>
            //   <PopoverTrigger asChild>
            //     <Button
            //       variant="ghost"
            //       size="icon"
            //       className="h-7 w-7 data-[state=open]:bg-accent"
            //     >
            //       <MoreHorizontal />
            //     </Button>
            //   </PopoverTrigger>
            //   <PopoverContent
            //     className="w-24 overflow-hidden rounded-lg p-0"
            //     align="start"
            //   >
            //     <Sidebar collapsible="none" className="bg-transparent">
            //       <SidebarContent>
            //         <SidebarGroup className="border-b last:border-none">
            //           <SidebarGroupContent className="gap-0">
            //             <SidebarMenu>
            //               <SidebarMenuItem className="space-y-2">
            //                 <SidebarMenuButton
            //                   className="bg-red-500 text-white"
            //                   onClick={handleDelete} // Call handleDelete on click
            //                 >
            //                   <span>Delete</span>
            //                 </SidebarMenuButton>
            //               </SidebarMenuItem>
            //             </SidebarMenu>
            //           </SidebarGroupContent>
            //         </SidebarGroup>
            //       </SidebarContent>
            //     </Sidebar>
            //   </PopoverContent>
            // </Popover>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </p>
        {post.medias && <MediaGalleryComponent media={post.medias} />}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button
          variant="ghost"
          className={`w-52 flex items-center space-x-2 ${
            isLiked ? "text-blue-600" : ""
          }`}
          onClick={isLiked ? unlike : like}
        >
          <ThumbsUp size={20} />
          <span>{likes > 0 && `Likes (${likes})`}</span>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-52 flex items-center space-x-2"
            >
              <MessageCircle size={20} />
              <span>
                {post.comments.length > 0 &&
                  `Comments (${post.comments.length})`}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={api + "/" + post.user?.profile}
                      alt={post.user?.name}
                    />
                    <AvatarFallback>{post.user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.user?.name}</p>
                    <p className="text-sm text-gray-500">
                      {diffForHumans(post.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </DialogHeader>
            <p className="mb-4">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </p>
            {post.medias && <MediaGalleryComponent media={post.medias} />}
            <DialogFooter>
              <Input
                placeholder="Add a comment"
                type="text"
                value={content}
                onChange={handleCommentChange}
              />
              <Button variant="primary" onClick={handleCommentSubmit}>
                Comment
              </Button>
            </DialogFooter>

            {comments.map((comment) => (
              <div key={comment?.id} className="flex items-center space-x-4">
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={api + "/" + comment?.user?.profile}
                    alt={comment?.user?.name}
                  />
                  <AvatarFallback>
                    {comment?.user?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {comment?.user?.name}{" "}
                    <span className="text-sm text-gray-500">
                      | {diffForHumans(comment?.createdAt)}
                    </span>
                  </p>
                  <p>{comment?.content}</p>
                </div>
              </div>
            ))}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

PostPage.propTypes = {
  post: PropTypes.object.isRequired,
  updatePost: PropTypes.func.isRequired, // Add prop type for updatePost
};
