import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { useState } from "react";
import PropTypes from "prop-types";
import ImageViewerPage from "./ImageViewerComponent";

export default function MediaGalleryComponent({ media }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (media.length === 1) {
    const item = media[0];
    return (
      <div>
        {item.type === "image" ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <div className="rounded-lg overflow-hidden cursor-pointer">
                <img
                  src={item.url}
                  alt="Post image"
                  className="w-full h-auto"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <ImageViewerPage images={media} />
            </DialogContent>
          </Dialog>
        ) : (
          <video
            controls
            className="w-full h-auto"
            style={{ maxHeight: "400px" }}
          >
            <source
              src={item.url}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer">
          <div className="grid grid-cols-2 gap-1">
            {media.slice(0, 4).map((item, index) => (
              <div
                key={index}
                className={`relative ${
                  index === 3 && media.length > 4
                    ? 'after:content-["+"] after:absolute after:inset-0 after:bg-black after:bg-opacity-50 after:flex after:items-center after:justify-center after:text-white after:text-4xl'
                    : ""
                }`}
              >
                <img
                  src={item.url}
                  alt={`Post image ${index + 1}`}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          {media.length > 4 && (
            <div className="absolute bottom-2 right-2 bg-white bg-opacity-75 px-2 py-1 rounded text-sm">
              +{media.length - 4} more
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <ImageViewerPage images={media} />
      </DialogContent>
    </Dialog>
  );
}

MediaGalleryComponent.propTypes = {
  media: PropTypes.array.isRequired,
};
