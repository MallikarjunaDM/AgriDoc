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
    const textShift = scrollProgress * (isMobileState ? 12 : 10); // vw units for split effect

    const firstWord = title ? title.split(' ')[0] : '';
    const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

    return (
        <div ref={sectionRef} className="transition-colors duration-700 ease-in-out overflow-x-hidden">
            <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
                <div className="relative w-full flex flex-col items-center min-h-[100dvh]">

                    {/* ── Full-screen background image (fades out as video expands) ── */}
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
                        <div className="absolute inset-0 bg-black/20" />
                    </motion.div>

                    <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
                        <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">

                            {/* ── Expanding video / image card ── */}
                            <div
                                className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl overflow-hidden"
                                style={{
                                    width: `${mediaWidth}px`,
                                    height: `${mediaHeight}px`,
                                    maxWidth: '95vw',
                                    maxHeight: '85vh',
                                    boxShadow: '0px 0px 60px rgba(0,0,0,0.45)',
                                }}
                            >
                                {/* Video / Image */}
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
                                                className="w-full h-full"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
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
                                                className="w-full h-full object-cover"
                                                controls={false}
                                                disablePictureInPicture
                                                disableRemotePlayback
                                            />
                                        </div>
                                    )
                                ) : (
                                    <Image
                                        src={mediaSrc}
                                        alt={title || 'Media content'}
                                        width={1280}
                                        height={720}
                                        className="w-full h-full object-cover"
                                    />
                                )}

                                {/* Dark gradient overlay for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 pointer-events-none" />

                                {/* ── Text overlaid ON the video ── */}
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
                                    {/* Title — split words drift apart on scroll */}
                                    <div className="flex flex-wrap items-center justify-center gap-x-4">
                                        <span
                                            className="font-black text-white drop-shadow-2xl"
                                            style={{
                                                fontSize: 'clamp(2.8rem, 9vw, 7.5rem)',
                                                letterSpacing: '-0.03em',
                                                lineHeight: 1,
                                                textShadow: '0 2px 30px rgba(0,0,0,0.8)',
                                                transform: `translateX(-${textShift}vw)`,
                                                transition: 'transform 0.05s linear',
                                            }}
                                        >
                                            {firstWord}
                                        </span>
                                        <span
                                            className="font-black drop-shadow-2xl"
                                            style={{
                                                fontSize: 'clamp(2.8rem, 9vw, 7.5rem)',
                                                letterSpacing: '-0.03em',
                                                lineHeight: 1,
                                                color: '#4ade80', /* bright emerald-400 — matches vibe */
                                                textShadow: '0 2px 30px rgba(0,0,0,0.7), 0 0 40px rgba(74,222,128,0.35)',
                                                transform: `translateX(${textShift}vw)`,
                                                transition: 'transform 0.05s linear',
                                            }}
                                        >
                                            {restOfTitle}
                                        </span>
                                    </div>

                                    {/* Subtitle */}
                                    {date && (
                                        <p
                                            className="mt-5 font-semibold tracking-wide"
                                            style={{
                                                fontSize: 'clamp(0.9rem, 2vw, 1.3rem)',
                                                color: 'rgba(255,255,255,0.92)',
                                                textShadow: '0 1px 10px rgba(0,0,0,0.7)',
                                            }}
                                        >
                                            {date}
                                        </p>
                                    )}

                                    {/* Scroll hint */}
                                    {scrollToExpand && (
                                        <p
                                            className="mt-3 font-medium animate-pulse"
                                            style={{
                                                fontSize: 'clamp(0.8rem, 1.4vw, 1rem)',
                                                color: 'rgba(167,243,208,0.85)', /* emerald-200 */
                                                textShadow: '0 1px 8px rgba(0,0,0,0.6)',
                                            }}
                                        >
                                            {scrollToExpand}
                                        </p>
                                    )}
                                </div>
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
