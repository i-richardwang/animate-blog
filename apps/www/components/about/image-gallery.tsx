'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@workspace/ui/lib/utils';

interface ImageGalleryProps {
  images?: string[];
  className?: string;
}

export const ImageGallery = ({ images, className }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className={cn('grid grid-cols-3 gap-3', className)}>
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="rounded-lg bg-neutral-200 dark:bg-neutral-700/50 aspect-[4/3] flex items-center justify-center"
          >
            <div className="text-center text-muted-foreground text-xs">
              <p>Image {idx}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className={cn('grid grid-cols-3 gap-3', className)}>
        {images.slice(0, 3).map((image, idx) => (
          <motion.div
            key={idx}
            className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedImage(image)}
          >
            {/* Replace with actual <img> tag when you have images */}
            <div className="size-full flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
              <span className="text-sm">Image {idx + 1}</span>
            </div>
            {idx === 2 && images.length > 3 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold">
                +{images.length - 3}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-neutral-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="size-8" />
            </button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-5xl max-h-[90vh] bg-neutral-200 dark:bg-neutral-800 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Replace with actual <img> when you have images */}
              <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
                <span>Image: {selectedImage}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

