'use client';

import {
    useEffect,
    useRef,
    useState,
    ReactNode,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
    mediaType?: 'video' | 'image';
    mediaSrc: string;
    posterSrc?: string;
    bgImageSrc: string;
    title?: string;
    date?: string;
    scrollToExpand?: string;
    textBlend?: boolean;
    children?: ReactNode;
}

const ScrollExpandMedia = ({
    mediaType = 'video',
    mediaSrc,
    posterSrc,
    bgImageSrc,
    title,
    date,
    scrollToExpand,
    textBlend,
    children,
}: ScrollExpandMediaProps) => {
    const [scrollProgress, setScrollProgress] = useState<number>(0);
    const [showContent, setShowContent] = useState<boolean>(false);
    const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
    const [touchStartY, setTouchStartY] = useState<number>(0);
    const [isMobileState, setIsMobileState] = useState<boolean>(false);

    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setScrollProgress(0);
        setShowContent(false);
        setMediaFullyExpanded(false);
    }, [mediaType]);

    useEffect(() => {
        const handleWheel = (e: Event) => {
            const we = e as unknown as WheelEvent;
            if (mediaFullyExpanded && we.deltaY < 0 && window.scrollY <= 5) {
                setMediaFullyExpanded(false);
                we.preventDefault();
            } else if (!mediaFullyExpanded) {
                we.preventDefault();
                const scrollDelta = we.deltaY * 0.0009;
                const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
                setScrollProgress(newProgress);
                if (newProgress >= 1) {
                    setMediaFullyExpanded(true);
                    setShowContent(true);
                } else if (newProgress < 0.75) {
                    setShowContent(false);
                }
            }
        };

        const handleTouchStart = (e: Event) => {
            const te = e as unknown as TouchEvent;
            setTouchStartY(te.touches[0].clientY);
        };

        const handleTouchMove = (e: Event) => {
            const te = e as unknown as TouchEvent;
            if (!touchStartY) return;
            const touchY = te.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
                setMediaFullyExpanded(false);
                te.preventDefault();
            } else if (!mediaFullyExpanded) {
                te.preventDefault();
                const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
                const scrollDelta = deltaY * scrollFactor;
                const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
                setScrollProgress(newProgress);
                if (newProgress >= 1) {
                    setMediaFullyExpanded(true);
                    setShowContent(true);
                } else if (newProgress < 0.75) {
                    setShowContent(false);
                }
                setTouchStartY(touchY);
            }
        };

        const handleTouchEnd = (): void => {
            setTouchStartY(0);
        };

        const handleScroll = (): void => {
            if (!mediaFullyExpanded) {
                window.scrollTo(0, 0);
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [scrollProgress, mediaFullyExpanded, touchStartY]);

    useEffect(() => {
        const checkIfMobile = (): void => {
            setIsMobileState(window.innerWidth < 768);
        };
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
    const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
    const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

    const firstWord = title ? title.split(' ')[0] : '';
    const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

    return (
        <div
            ref={sectionRef}
            className="transition-colors duration-700 ease-in-out overflow-x-hidden"
        >
            <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
                <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
                    <motion.div
                        className="absolute inset-0 z-0 h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 - scrollProgress }}
                        transition={{ duration: 0.1 }}
                    >
                        <Image
                            src={bgImageSrc}
                            alt="Background"
                            width={1920}
                            height={1080}
                            className="w-screen h-screen"
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                            priority
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </motion.div>

                    <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
                        <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">
                            {/* Expanding Media */}
                            <div
                                className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl"
                                style={{
                                    width: `${mediaWidth}px`,
                                    height: `${mediaHeight}px`,
                                    maxWidth: '95vw',
                                    maxHeight: '85vh',
                                    boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
                                }}
                            >
                                {mediaType === 'video' ? (
                                    mediaSrc.includes('youtube.com') ? (
                                        <div className="relative w-full h-full pointer-events-none">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={
                                                    mediaSrc.includes('embed')
                                                        ? mediaSrc + (mediaSrc.includes('?') ? '&' : '?') + 'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                                                        : mediaSrc.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' + mediaSrc.split('v=')[1]
                                                }
                                                className="w-full h-full rounded-xl"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                            <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }} />
                                            <motion.div
                                                className="absolute inset-0 bg-black/30 rounded-xl"
                                                initial={{ opacity: 0.7 }}
                                                animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-full pointer-events-none">
                                            <video
                                                src={mediaSrc}
                                                poster={posterSrc}
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                preload="auto"
                                                className="w-full h-full object-cover rounded-xl"
                                                controls={false}
                                                disablePictureInPicture
                                                disableRemotePlayback
                                            />
                                            <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }} />
                                            <motion.div
                                                className="absolute inset-0 bg-black/30 rounded-xl"
                                                initial={{ opacity: 0.7 }}
                                                animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        </div>
                                    )
                                ) : (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={mediaSrc}
                                            alt={title || 'Media content'}
                                            width={1280}
                                            height={720}
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                        <motion.div
                                            className="absolute inset-0 bg-black/50 rounded-xl"
                                            initial={{ opacity: 0.7 }}
                                            animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col items-center text-center relative z-10 mt-4 transition-none">
                                    {date && (
                                        <p className="text-2xl text-blue-200" style={{ transform: `translateX(-${textTranslateX}vw)` }}>
                                            {date}
                                        </p>
                                    )}
                                    {scrollToExpand && (
                                        <p className="text-blue-200 font-medium text-center" style={{ transform: `translateX(${textTranslateX}vw)` }}>
                                            {scrollToExpand}
                                        </p>
                                    )}
                                </div>
                                {/* Overlay text ON TOP of video */}
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                                    {/* Dark gradient for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 rounded-xl" />
                                    <div className="relative z-10 flex flex-col items-center gap-3">
                                        <h1
                                            className="font-black text-white"
                                            style={{
                                                fontSize: 'clamp(2.5rem, 8vw, 7rem)',
                                                textShadow: '0 4px 24px rgba(0,0,0,0.7)',
                                                letterSpacing: '-0.02em',
                                                lineHeight: 1.1,
                                                transform: `translateX(-${textTranslateX * 0.3}vw)`,
                                            }}
                                        >
                                            Agriculture
                                        </h1>
                                        <h1
                                            className="font-black text-emerald-300"
                                            style={{
                                                fontSize: 'clamp(2.5rem, 8vw, 7rem)',
                                                textShadow: '0 4px 24px rgba(0,0,0,0.7)',
                                                letterSpacing: '-0.02em',
                                                lineHeight: 1.1,
                                                transform: `translateX(${textTranslateX * 0.3}vw)`,
                                            }}
                                        >
                                            Doctor
                                        </h1>
                                        {date && (
                                            <p className="text-white/90 font-semibold mt-2" style={{ fontSize: 'clamp(1rem,2vw,1.4rem)', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                                                {date}
                                            </p>
                                        )}
                                        {scrollToExpand && (
                                            <p className="text-white/70 font-medium mt-1 animate-pulse" style={{ fontSize: 'clamp(0.85rem,1.5vw,1.1rem)' }}>
                                                {scrollToExpand}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Hidden original title block — kept for layout but invisible */}
                            <div className="hidden">
                                <motion.h2
                                    className="text-6xl md:text-7xl lg:text-9xl font-black text-blue-200 transition-none"
                                    style={{ transform: `translateX(-${textTranslateX}vw)` }}
                                >
                                    {firstWord}
                                </motion.h2>
                                <motion.h2
                                    className="text-6xl md:text-7xl lg:text-9xl font-black text-center text-blue-200 transition-none"
                                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                                >
                                    {restOfTitle}
                                </motion.h2>
                            </div>
                        </div>

                        {/* Children revealed after full expansion */}
                        <motion.section
                            className="flex flex-col w-full px-8 py-10 md:px-16 lg:py-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: showContent ? 1 : 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            {children}
                        </motion.section>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ScrollExpandMedia;
