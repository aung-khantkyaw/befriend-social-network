"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authService } from "@/services/authService";
import { beFriendService } from "@/services/beFriendService";

export default function PostCreator() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const fileInputRef = useRef(null);
  const { user } = authService();
  const { createPost, successType, successMessage, errorType, errorMessage } =
    beFriendService();
  const api = import.meta.env.VITE_API_URL;

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const newMediaFiles = [];

    if (files.length > 6) {
      toast({
        title: "Too many files",
        description: "You can upload a maximum of 6 photos or 1 video.",
        variant: "destructive",
      });
      return;
    }

    for (const file of files) {
      const fileType = file.type.split("/")[0];
      if (fileType === "image" || fileType === "video") {
        if (
          fileType === "video" &&
          (mediaFiles.length > 0 || newMediaFiles.length > 0)
        ) {
          toast({
            title: "Invalid selection",
            description:
              "You can only upload 1 video or up to 6 photos, not both.",
            variant: "destructive",
          });
          return;
        }
        if (fileType === "video" && files.length > 1) {
          toast({
            title: "Invalid selection",
            description: "You can only upload 1 video at a time.",
            variant: "destructive",
          });
          return;
        }
        const url = URL.createObjectURL(file);
        newMediaFiles.push({ type: fileType, url, file });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select only image or video files.",
          variant: "destructive",
        });
      }
    }

    if (newMediaFiles.length > 0) {
      if (newMediaFiles[0].type === "video") {
        setMediaFiles(newMediaFiles);
      } else {
        setMediaFiles((prevFiles) =>
          [...prevFiles, ...newMediaFiles].slice(0, 6)
        );
      }
    }
  };

  const removeMedia = (index) => {
    setMediaFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("content", content);
    mediaFiles.forEach((media) => {
      formData.append("mediaFiles", media.file);
    });
    formData.append("userId", user.id);

    try {
      await createPost(formData);
      setContent("");
      setMediaFiles([]);
    } catch (error) {
      toast({
        title: "Post creation failed",
        description: error.message,
      });
    }
  };

  if (successType === "createPost") {
    toast({
      title: "Post created",
      description: successMessage,
    });
  }

  if (errorType === "createPost") {
    toast({
      title: "Post creation failed",
      description: errorMessage,
      variant: "destructive",
    });
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Create Post</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogTitle>Create Post</DialogTitle>
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={api + "/" + user.profile} alt="User" />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow space-y-4">
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={handleContentChange}
                  className="min-h-[100px]"
                />
                {mediaFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {mediaFiles.map((media, index) => (
                      <div key={index} className="relative">
                        {media.type === "image" ? (
                          <img
                            src={media.url}
                            alt={`Selected image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <video
                            src={media.url}
                            className="w-full h-32 object-cover rounded-lg"
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeMedia(index)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove media</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,video/*"
              multiple
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2"
            >
              <Image className="w-4 h-4" />
              <Video className="w-4 h-4" />
              <span>Photo/Video</span>
            </Button>
            <Button
              onClick={handlePost}
              disabled={!content && mediaFiles.length === 0}
            >
              Post
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
