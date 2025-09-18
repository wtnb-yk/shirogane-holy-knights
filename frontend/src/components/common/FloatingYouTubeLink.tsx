

export const FloatingYouTubeLink: React.FC = () => {
  const channelUrl = "https://www.youtube.com/@shiroganenoel";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center w-14 h-14 bg-accent-youtube rounded-full shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-xl"
        aria-label="Noel Ch. 白銀ノエル"
      >
        <svg 
          className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        
        {/* ホバー時のツールチップ */}
        <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            Noel Ch. 白銀ノエル
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </a>
    </div>
  );
};
