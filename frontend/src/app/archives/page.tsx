'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, ChevronLeft, ChevronRight, Search, Filter, Tag, ExternalLink } from 'lucide-react';
import { LambdaClient } from '@/api/lambdaClient';
import { ArchiveDto } from '@/api/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const ArchiveCard = ({ archive, index }: { archive: ArchiveDto; index: number }) => {
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

const SkeletonCard = () => (
  <Card className="h-full overflow-hidden bg-white border border-sage-200">
    <Skeleton className="w-full h-48 bg-sage-100" />
    <CardContent className="p-5">
      <Skeleton className="h-6 w-3/4 mb-3 bg-sage-100" />
      <Skeleton className="h-4 w-1/2 mb-3 bg-sage-100" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 bg-sage-100" />
        <Skeleton className="h-6 w-16 bg-sage-100" />
        <Skeleton className="h-6 w-16 bg-sage-100" />
      </div>
    </CardContent>
    <CardFooter className="p-5 pt-0">
      <Skeleton className="h-5 w-32 bg-sage-100" />
    </CardFooter>
  </Card>
);

export default function ArchivesList() {
  const [archives, setArchives] = useState<ArchiveDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        setLoading(true);
        
        const searchResult = await LambdaClient.callArchiveSearchFunction({
          page: currentPage,
          pageSize: pageSize
        });
        setArchives(searchResult.items || []);
        setTotalCount(searchResult.totalCount);
        setHasMore(searchResult.hasMore);
        setLoading(false);
      } catch (err) {
        setError('アーカイブの取得に失敗しました。');
        setLoading(false);
        console.error('Error fetching archives:', err);
      }
    };

    fetchArchives();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-100/30 to-sage-200/50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            配信アーカイブ
          </h1>
          <p className="text-sage-300">過去の配信を振り返ろう</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex flex-wrap gap-4"
        >
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-300 w-5 h-5" />
            <input
              type="text"
              placeholder="タイトルで検索..."
              className="w-full pl-10 pr-4 py-3 border border-sage-200 rounded-lg bg-white focus:ring-2 focus:ring-sage-300 focus:border-sage-300 transition-all duration-200 shadow-sm text-gray-800 placeholder-sage-300/70"
              disabled
            />
          </div>
          <button className="px-6 py-3 bg-white border border-sage-200 rounded-lg flex items-center gap-2 hover:bg-sage-100 transition-all duration-200 shadow-sm" disabled>
            <Filter className="w-5 h-5 text-sage-300" />
            <span className="text-sage-300">フィルター</span>
          </button>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">😢</div>
            <p className="text-xl text-red-500">{error}</p>
          </motion.div>
        ) : archives.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-600">アーカイブが見つかりませんでした。</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {archives.map((archive, index) => (
                <ArchiveCard key={archive.id} archive={archive} index={index} />
              ))}
            </div>

            {totalCount > pageSize && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center mt-12 gap-2"
              >
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    currentPage === 1
                      ? "bg-sage-200 text-sage-100 cursor-not-allowed opacity-50"
                      : "bg-white border border-sage-200 hover:bg-sage-100 hover:shadow-md text-sage-300"
                  )}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-1">
                  {(() => {
                    const pages = [];
                    const startPage = Math.max(1, currentPage - 2);
                    const endPage = Math.min(totalPages, currentPage + 2);
                    
                    if (startPage > 1) {
                      pages.push(
                        <button
                          key={1}
                          onClick={() => setCurrentPage(1)}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white border border-sage-200 hover:bg-sage-100 text-sage-300"
                        >
                          1
                        </button>
                      );
                      if (startPage > 2) {
                        pages.push(<span key="dots1" className="px-2">...</span>);
                      }
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <motion.button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                            i === currentPage
                              ? "bg-sage-300 text-white shadow-lg shadow-sage-300/30"
                              : "bg-white border border-sage-200 hover:bg-sage-100 text-sage-300"
                          )}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {i}
                        </motion.button>
                      );
                    }
                    
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(<span key="dots2" className="px-2">...</span>);
                      }
                      pages.push(
                        <button
                          key={totalPages}
                          onClick={() => setCurrentPage(totalPages)}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white border border-sage-200 hover:bg-sage-100 text-sage-300"
                        >
                          {totalPages}
                        </button>
                      );
                    }
                    
                    return pages;
                  })()}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!hasMore}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    !hasMore
                      ? "bg-sage-200 text-sage-100 cursor-not-allowed opacity-50"
                      : "bg-white border border-sage-200 hover:bg-sage-100 hover:shadow-md text-sage-300"
                  )}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {totalCount > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-sm text-sage-300 mt-6"
              >
                {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalCount)} / {totalCount} 件
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}