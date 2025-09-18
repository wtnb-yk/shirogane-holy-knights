

interface PageTitleProps {
  title: string;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ 
  title, 
  description, 
  children,
  className = ''
}) => {
  return (
    <div className={`page-header mb-6 ${className}`}>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-surface-primary to-accent-blue bg-clip-text text-transparent mb-4 tracking-wider">
        {title}
      </h1>
      
      {description && (
        <div className="hidden sm:flex items-start justify-between gap-4 mb-4">
          {typeof description === 'string' ? (
            <p className="text-base text-gray-600 leading-relaxed flex-1">
              {description}
            </p>
          ) : (
            description
          )}
          
          {children && (
            <>
              {children}
            </>
          )}
        </div>
      )}
      
      {/* モバイル用のchildren表示 */}
      {children && (
        <div className="sm:hidden mb-4 flex gap-2">
          {children}
        </div>
      )}
    </div>
  );
};