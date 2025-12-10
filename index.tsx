import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

// --- Icons ---
const ArrowRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const ArrowUpRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

const MenuIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

// --- Animation Components ---

interface RevealProps {
    children: ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    className?: string;
}

const Reveal = ({ children, width = "fit-content", delay = 0, className = "" }: RevealProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        
        if (ref.current) observer.observe(ref.current);
        
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} style={{ width }} className={`${className}`}>
            <div 
                style={{ transitionDelay: `${delay}ms` }}
                className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
            >
                {children}
            </div>
        </div>
    );
};

const CustomCursor = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const outlineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            if (dotRef.current && outlineRef.current) {
                const { clientX, clientY } = e;
                dotRef.current.style.left = `${clientX}px`;
                dotRef.current.style.top = `${clientY}px`;
                
                // Add slight delay to outline for fluid feel
                outlineRef.current.animate({
                    left: `${clientX}px`,
                    top: `${clientY}px`
                }, { duration: 500, fill: "forwards" });
            }
        };

        const addHoverState = () => document.body.classList.add('hovering');
        const removeHoverState = () => document.body.classList.remove('hovering');

        document.addEventListener('mousemove', moveCursor);
        
        const interactiveElements = document.querySelectorAll('a, button, .cursor-pointer');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', addHoverState);
            el.addEventListener('mouseleave', removeHoverState);
        });

        return () => {
            document.removeEventListener('mousemove', moveCursor);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', addHoverState);
                el.removeEventListener('mouseleave', removeHoverState);
            });
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot hidden md:block" />
            <div ref={outlineRef} className="cursor-outline hidden md:block" />
        </>
    );
};

const Marquee = ({ text, reverse = false }: { text: string, reverse?: boolean }) => {
    return (
        <div className="relative flex overflow-hidden py-4 border-y border-border bg-surface/30 backdrop-blur-sm select-none">
            <div className={`animate-${reverse ? 'marquee-reverse' : 'marquee'} whitespace-nowrap flex gap-8 items-center`}>
                <span className="text-8xl font-bold uppercase text-transparent text-stroke opacity-30 tracking-tighter">{text}</span>
                <span className="text-8xl font-bold uppercase text-transparent text-stroke opacity-30 tracking-tighter">{text}</span>
                <span className="text-8xl font-bold uppercase text-transparent text-stroke opacity-30 tracking-tighter">{text}</span>
                <span className="text-8xl font-bold uppercase text-transparent text-stroke opacity-30 tracking-tighter">{text}</span>
            </div>
            <div className={`absolute top-0 animate-${reverse ? 'marquee-reverse' : 'marquee'} whitespace-nowrap flex gap-8 items-center ml-8`} aria-hidden="true">
                <span className="text-8xl font-bold uppercase text-transparent text-stroke opacity-30 tracking-tighter">{text}</span>
                <span className="text-8xl font-bold uppercase text-transparent text-stroke opacity-30 tracking-tighter">{text}</span>
                <span className="text-8xl font-bold uppercase text-transparent text-stroke opacity-30 tracking-tighter">{text}</span>
                <span className="text-8xl font-bold uppercase text-transparent text-stroke opacity-30 tracking-tighter">{text}</span>
            </div>
        </div>
    )
}

// --- Layout Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-white py-6">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="text-xl font-bold tracking-widest uppercase hover:text-sapphire transition-colors cursor-pointer">
          Krish
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-12 text-xs font-bold tracking-[0.2em] uppercase">
          {['Work', 'Profile', 'Contact'].map((item) => (
             <a key={item} href={`#${item.toLowerCase()}`} className="relative group overflow-hidden cursor-pointer">
                <span className="block transition-transform duration-300 group-hover:-translate-y-full">{item}</span>
                <span className="absolute top-full left-0 text-sapphire transition-transform duration-300 group-hover:-translate-y-full">{item}</span>
             </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-background z-40 flex flex-col justify-center px-8 transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col space-y-8">
          {['Work', 'Profile', 'Contact'].map((item) => (
             <a key={item} href={`#${item.toLowerCase()}`} className="text-5xl font-bold tracking-tighter uppercase hover:text-sapphire transition-colors" onClick={() => setIsOpen(false)}>
                {item}
             </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-6 flex-grow flex flex-col justify-center relative z-10">
        <Reveal>
            <div className="flex items-center gap-4 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-mono uppercase tracking-widest text-text-muted">Available for new projects</span>
            </div>
        </Reveal>
        
        <div className="space-y-4">
            <Reveal delay={100}>
                <h1 className="text-6xl md:text-[9rem] leading-[0.85] font-bold tracking-tighter">
                DIGITAL
                </h1>
            </Reveal>
            <Reveal delay={200}>
                <div className="flex items-center gap-4 md:gap-12">
                     <div className="hidden md:block h-px bg-white/20 flex-grow"></div>
                     <h1 className="text-6xl md:text-[9rem] leading-[0.85] font-bold tracking-tighter text-right md:text-left">
                     EXPERIENCE
                     </h1>
                </div>
            </Reveal>
            <Reveal delay={300}>
                <h1 className="text-6xl md:text-[9rem] leading-[0.85] font-bold tracking-tighter text-sapphire">
                DESIGNER
                </h1>
            </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-5 text-lg text-text-muted leading-relaxed">
                <Reveal delay={400}>
                    <p>
                        Specialized in building digital products that blend brutalist aesthetics with refined user interactions. currently based in <span className="text-white">Nepal</span>.
                    </p>
                </Reveal>
            </div>
            <div className="md:col-span-7 flex justify-start md:justify-end">
                <Reveal delay={500}>
                    <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center animate-spin-slow cursor-pointer hover:bg-sapphire hover:border-sapphire hover:text-white transition-colors group">
                        <ArrowRight className="w-8 h-8 group-hover:rotate-45 transition-transform duration-300" />
                    </div>
                </Reveal>
            </div>
        </div>
      </div>
      
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sapphire/5 to-transparent pointer-events-none"></div>
    </section>
  );
};

const ProjectListItem = ({ title, category, year, index }: { title: string, category: string, year: string, index: number }) => {
    return (
        <Reveal width="100%" delay={index * 100}>
            <div className="group relative border-t border-border py-12 hover:bg-white/5 transition-colors duration-300 cursor-pointer">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-1 text-xs font-mono text-text-muted">0{index + 1}</div>
                    <div className="md:col-span-6">
                        <h3 className="text-3xl md:text-5xl font-bold tracking-tight group-hover:translate-x-4 transition-transform duration-500 ease-out">{title}</h3>
                    </div>
                    <div className="md:col-span-3 text-sm uppercase tracking-wider text-text-muted group-hover:text-white transition-colors">
                        {category}
                    </div>
                    <div className="md:col-span-2 text-right text-sm font-mono text-text-muted group-hover:text-sapphire transition-colors">
                        {year}
                    </div>
                </div>
                {/* Hover Image Preview (Concept) - in a real app this would follow cursor */}
                <div className="absolute right-20 top-1/2 -translate-y-1/2 w-64 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden lg:block z-10 overflow-hidden">
                     <img src={`https://source.unsplash.com/random/800x600?sig=${index}`} alt="Project Preview" className="w-full h-full object-cover grayscale" />
                </div>
            </div>
        </Reveal>
    )
}

const ProjectCardLarge = ({ title, tags, img, reverse = false }: { title: string, tags: string[], img: string, reverse?: boolean }) => {
    return (
        <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-20 mb-32 group cursor-pointer`}>
            <div className="w-full md:w-3/5 overflow-hidden">
                 <Reveal className="w-full h-full">
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <img 
                            src={img} 
                            alt={title} 
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale group-hover:grayscale-0" 
                        />
                        <div className="absolute inset-0 bg-sapphire/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                    </div>
                 </Reveal>
            </div>
            <div className="w-full md:w-2/5 flex flex-col justify-end pb-8">
                 <Reveal delay={200}>
                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <span key={tag} className="px-3 py-1 border border-border rounded-full text-xs uppercase tracking-wider text-text-muted">{tag}</span>
                            ))}
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold leading-none group-hover:text-sapphire transition-colors duration-300">{title}</h3>
                        <p className="text-text-muted max-w-sm">A comprehensive design system and digital experience overhaul focusing on conversion and brand alignment.</p>
                        <div className="pt-8">
                            <button className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest hover:gap-6 transition-all duration-300">
                                View Case Study <ArrowRight />
                            </button>
                        </div>
                    </div>
                 </Reveal>
            </div>
        </div>
    )
}

const Work = () => {
  return (
    <section id="work" className="py-32 bg-background relative z-10">
      <div className="container mx-auto px-6 mb-24">
        <Reveal>
             <h2 className="text-sm font-mono text-sapphire mb-4 uppercase tracking-widest">Selected Works (2022-2024)</h2>
        </Reveal>
      </div>

      <div className="container mx-auto px-6">
         <ProjectCardLarge 
            title="NEOM BANK"
            tags={['Fintech', 'App Design', 'Strategy']}
            img="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2670&auto=format&fit=crop"
         />
         <ProjectCardLarge 
            title="AERO SPACE"
            tags={['Web Design', '3D', 'Development']}
            img="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"
            reverse
         />
      </div>

      {/* Archive List */}
      <div className="border-t border-border mt-12">
           <ProjectListItem index={2} title="VOGUE MAGAZINE" category="Editorial" year="2023" />
           <ProjectListItem index={3} title="NIKE CAMPAIGN" category="Marketing" year="2022" />
           <ProjectListItem index={4} title="Spotify Wrapped" category="Interaction" year="2022" />
      </div>
      
      <div className="w-full flex justify-center py-20">
          <button className="px-8 py-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300 text-sm font-bold uppercase tracking-widest">
              View All Projects
          </button>
      </div>
    </section>
  );
};

const Profile = () => {
    return (
        <section id="profile" className="py-32 bg-surface relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex justify-center pointer-events-none opacity-10">
                <div className="w-px h-full bg-white mx-auto"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <Reveal>
                            <h2 className="text-6xl font-bold mb-12 tracking-tighter">THE <br/><span className="text-sapphire">PROCESS</span></h2>
                        </Reveal>
                        <Reveal delay={200}>
                            <p className="text-xl leading-relaxed text-gray-400 mb-8">
                                I believe in a research-first approach to design. Every pixel serves a purpose, and every interaction tells a story. My work bridges the gap between functional utility and emotional connection.
                            </p>
                            <p className="text-xl leading-relaxed text-gray-400">
                                With over a decade of experience in the digital space, I've had the privilege of working with startups and Fortune 500 companies alike to define their digital presence.
                            </p>
                        </Reveal>
                        
                        <div className="mt-12 grid grid-cols-2 gap-8">
                             <div>
                                 <h4 className="text-sapphire font-bold mb-2 uppercase tracking-wider text-sm">Skills</h4>
                                 <ul className="space-y-1 text-gray-400">
                                     <li>UI/UX Design</li>
                                     <li>Interaction Design</li>
                                     <li>Front-end Dev</li>
                                     <li>Design Systems</li>
                                 </ul>
                             </div>
                             <div>
                                 <h4 className="text-sapphire font-bold mb-2 uppercase tracking-wider text-sm">Tools</h4>
                                 <ul className="space-y-1 text-gray-400">
                                     <li>Figma</li>
                                     <li>React / Next.js</li>
                                     <li>WebGL / Three.js</li>
                                     <li>Principle</li>
                                 </ul>
                             </div>
                        </div>
                    </div>
                    
                    <div className="relative">
                         <Reveal delay={300} className="h-full w-full">
                            <div className="h-full w-full border border-border bg-background p-8 flex flex-col justify-between group hover:border-sapphire transition-colors duration-500">
                                <GlobeIcon className="w-12 h-12 text-sapphire mb-8" />
                                <div>
                                    <h3 className="text-3xl font-bold mb-4">Worldwide</h3>
                                    <p className="text-text-muted mb-8">
                                        Available for remote work across all timezones. Currently collaborating with clients in London, New York, and Tokyo.
                                    </p>
                                    <div className="w-full h-px bg-border group-hover:bg-sapphire/50 transition-colors duration-500 mb-4"></div>
                                    <div className="flex justify-between items-center text-sm font-mono">
                                        <span>STATUS</span>
                                        <span className="text-green-500 animate-pulse">● ONLINE</span>
                                    </div>
                                </div>
                            </div>
                         </Reveal>
                    </div>
                </div>
            </div>
        </section>
    )
}

const Footer = () => {
  return (
    <footer id="contact" className="bg-background pt-32 pb-12 border-t border-border">
      <div className="container mx-auto px-6">
        <Reveal>
            <div className="mb-20">
                <p className="text-sapphire font-mono text-sm uppercase tracking-widest mb-4">Have an idea?</p>
                <a href="mailto:hello@krishna.com" className="block text-[10vw] font-bold leading-none tracking-tighter hover:text-sapphire transition-colors duration-300">
                    LET'S TALK
                </a>
            </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-border pt-12">
            <div className="md:col-span-2">
                <h4 className="text-2xl font-bold mb-4">Krishna Karki</h4>
                <p className="text-text-muted max-w-xs">
                    Senior Digital Designer crafting experiences for the next generation of web.
                </p>
            </div>
            <div>
                <h5 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Socials</h5>
                <ul className="space-y-2 text-text-muted">
                    <li><a href="#" className="hover:text-sapphire transition-colors">LinkedIn</a></li>
                    <li><a href="#" className="hover:text-sapphire transition-colors">Twitter / X</a></li>
                    <li><a href="#" className="hover:text-sapphire transition-colors">Instagram</a></li>
                    <li><a href="#" className="hover:text-sapphire transition-colors">Dribbble</a></li>
                </ul>
            </div>
            <div>
                 <h5 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Navigation</h5>
                 <ul className="space-y-2 text-text-muted">
                    <li><a href="#work" className="hover:text-sapphire transition-colors">Work</a></li>
                    <li><a href="#profile" className="hover:text-sapphire transition-colors">Profile</a></li>
                    <li><a href="#contact" className="hover:text-sapphire transition-colors">Contact</a></li>
                </ul>
            </div>
        </div>
        
        <div className="mt-20 flex justify-between items-end text-xs text-text-muted font-mono uppercase">
            <span>© 2025 Krishna Karki</span>
            <span>Nepal</span>
            <span>Local Time: {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
    
  return (
    <div className="bg-background text-text min-h-screen selection:bg-sapphire selection:text-white">
      <CustomCursor />
      <Navbar />
      <Hero />
      <Marquee text="Strategy • Design • Development • Branding • " />
      <Work />
      <Marquee text="Creative • Direction • Motion • 3D • " reverse />
      <Profile />
      <Footer />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);