import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  url: string;
  icon: React.ElementType;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  activeSection?: string;
  onNavClick?: (e: React.MouseEvent, targetId: string | null) => void;
}

export function NavBar({ items, className, activeSection = 'home', onNavClick }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === '/faq') {
      setActiveTab('FAQ');
      return;
    } else if (location.pathname === '/about') {
      setActiveTab('About');
      return;
    } else if (location.pathname === '/services-info') {
      setActiveTab('Services');
      return;
    }
    
    const matchingItem = items.find(item => {
      if (item.name === 'Home' && activeSection === 'home') {
        return true;
      }
      return item.url === `#${activeSection}` || item.url === `/#${activeSection}`;
    });
    
    if (matchingItem) {
      setActiveTab(matchingItem.name);
    }
  }, [activeSection, items, location.pathname]);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNavItemClick = (e: React.MouseEvent, item: NavItem) => {
    setActiveTab(item.name);
    
    if (item.name === 'FAQ' && location.pathname === '/faq') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    if (item.name === 'About' && location.pathname === '/about') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    if (onNavClick) {
      if (item.name === 'Home') {
        onNavClick(e, null);
        return;
      } 
      
      if (item.url.startsWith('/#')) {
        onNavClick(e, item.url.substring(2));
        return;
      }
      
      if (item.url.startsWith('#')) {
        onNavClick(e, item.url.substring(1));
        return;
      }
    }
  };

  return (
    <div className={cn("z-50", className)}>
      <div className={cn(
        "flex items-center bg-background/5 backdrop-blur-lg rounded-full shadow-lg max-w-full overflow-x-auto no-scrollbar",
        isMobile ? "justify-around w-full gap-0 py-1.5 px-1.5" : "gap-1 sm:gap-2 py-0.5 px-1"
      )}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          
          const LinkComponent = item.url.startsWith('/') && !item.url.includes('#') 
            ? Link 
            : 'a';

          return (
            <LinkComponent
              key={item.name}
              to={item.url.startsWith('/') && !item.url.includes('#') ? item.url : undefined}
              href={!item.url.startsWith('/') || item.url.includes('#') ? item.url : undefined}
              onClick={(e) => handleNavItemClick(e, item)}
              className={cn(
                "relative cursor-pointer tracking-wider font-medium rounded-full transition-colors whitespace-nowrap flex items-center justify-center",
                isMobile ? "flex-1 flex-col py-1.5 px-1" : "px-1.5 sm:px-2 py-0.5",
                "text-white/80 hover:text-white",
                isActive && "bg-white/10 text-white",
                !isMobile && "text-xs"
              )}
              style={isMobile ? {
                fontSize: '0.96rem',
                transform: 'scale(1.2)',
                transformOrigin: 'center center'
              } : {
                fontSize: '0.8rem',
                transform: 'scale(0.8)',
                transformOrigin: 'center center'
              }}
            >
              {isMobile ? (
                <>
                  <Icon size={16} strokeWidth={2} className="mb-1" />
                  <span className="text-[11px]">{item.name}</span>
                </>
              ) : (
                <>
                  <span className="hidden md:inline text-xs">{item.name}</span>
                  <span className="md:hidden">
                    <Icon size={13} strokeWidth={2} />
                  </span>
                </>
              )}
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-white/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  {!isMobile && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-white rounded-t-full">
                      <div className="absolute w-4 h-2.5 bg-white/20 rounded-full blur-md -top-1 -left-0.5" />
                      <div className="absolute w-3 h-2.5 bg-white/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-1.5 h-2 bg-white/20 rounded-full blur-sm top-0 left-1" />
                    </div>
                  )}
                </motion.div>
              )}
            </LinkComponent>
          );
        })}
      </div>
    </div>
  );
}