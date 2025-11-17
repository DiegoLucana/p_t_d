import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const ValidationBreadcrumb = () => {
  const location = useLocation();

  const breadcrumbItems = [
    {
      label: 'Validation Laboratory',
      path: '/validation-laboratory',
      icon: 'Video',
      description: 'Upload and manage test footage'
    },
    {
      label: 'Video Analysis',
      path: '/video-analysis-playback',
      icon: 'Play',
      description: 'Frame-by-frame analysis and validation'
    }
  ];

  // Only show breadcrumb on validation pages
  const isValidationPage = breadcrumbItems?.some(item => item?.path === location?.pathname);
  
  if (!isValidationPage) {
    return null;
  }

  const currentItemIndex = breadcrumbItems?.findIndex(item => item?.path === location?.pathname);

  const handleNavigation = (path) => {
    if (path !== location?.pathname) {
      window.location.href = path;
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm" aria-label="Validation workflow breadcrumb">
      <div className="flex items-center space-x-1 text-muted-foreground">
        <Icon name="Workflow" size={16} />
        <span className="font-medium">Validation Workflow</span>
      </div>
      <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
      <div className="flex items-center space-x-2">
        {breadcrumbItems?.map((item, index) => (
          <React.Fragment key={item?.path}>
            <button
              onClick={() => handleNavigation(item?.path)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all duration-200 ${
                index === currentItemIndex
                  ? 'bg-primary/10 text-primary font-medium'
                  : index < currentItemIndex
                  ? 'text-foreground hover:bg-muted hover:text-foreground'
                  : 'text-muted-foreground cursor-not-allowed opacity-60'
              }`}
              disabled={index > currentItemIndex}
              title={item?.description}
            >
              <Icon 
                name={item?.icon} 
                size={14} 
                className={index === currentItemIndex ? 'text-primary' : 'inherit'}
              />
              <span>{item?.label}</span>
              
              {/* Step indicator */}
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                index === currentItemIndex
                  ? 'bg-primary text-primary-foreground'
                  : index < currentItemIndex
                  ? 'bg-success text-success-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {index < currentItemIndex ? (
                  <Icon name="Check" size={12} />
                ) : (
                  index + 1
                )}
              </div>
            </button>
            
            {/* Separator */}
            {index < breadcrumbItems?.length - 1 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className={`${
                  index < currentItemIndex ? 'text-success' : 'text-muted-foreground'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Progress indicator */}
      <div className="hidden sm:flex items-center space-x-2 ml-4 px-3 py-1 bg-muted/50 rounded-full">
        <div className="flex space-x-1">
          {breadcrumbItems?.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index <= currentItemIndex ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {currentItemIndex + 1}/{breadcrumbItems?.length}
        </span>
      </div>
    </nav>
  );
};

export default ValidationBreadcrumb;