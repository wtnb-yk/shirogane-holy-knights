'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Tag, ExternalLink } from 'lucide-react';
import { ArchiveDto } from '@/api/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ArchiveCardProps {
  archive: ArchiveDto;
  index: number;
}

export const ArchiveCard = ({ archive, index }: ArchiveCardProps) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-sage-200/40 bg-white border border-sage-200">
        {archive.thumbnailUrl && (
          <div className="relative w-full h-48 overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Image 
                src={archive.thumbnailUrl} 
                alt={archive.title} 
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        <CardContent className="p-5">
          <h3 className="text-lg font-bold mb-3 line-clamp-2 text-gray-800 group-hover:text-sage-300 transition-colors duration-200">
            {archive.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-sage-300 mb-3">
            <Calendar className="w-4 h-4" />
            <span>{new Date(archive.publishedAt).toLocaleDateString('ja-JP')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {archive.tags?.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-sage-100 text-sage-300 hover:bg-sage-200 transition-colors duration-200 border-sage-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {archive.tags && archive.tags.length > 3 && (
              <Badge variant="outline" className="text-xs border-sage-200 text-sage-300">
                +{archive.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-5 pt-0">
          <motion.a
            href={archive.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sage-300 hover:text-gray-800 font-medium transition-colors duration-200"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            YouTubeで視聴
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </CardFooter>
      </Card>
    </motion.div>
  );
};