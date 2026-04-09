import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Reviews.module.css';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Refs for direct DOM manipulation (Critical for iOS Safari Performance)
    const scrollContainerRef = useRef(null);
    const trackRef = useRef(null);
    const progressRef = useRef(null);
    const posRef = useRef(0); // Current X position
    const isPausedRef = useRef(false);
    const isDraggingRef = useRef(false);

    // UI State
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollPosX, setScrollPosX] = useState(0);

    // Synchronize state with refs to keep the animation loop stable
    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        isDraggingRef.current = isDragging;
    }, [isDragging]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('/api/reviews');
                const data = await response.json();
                if (data.reviews) setReviews(data.reviews);
                else setError(true);
            } catch (err) {
                console.error('Error fetching reviews:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    // High-performance animation loop
    useEffect(() => {
        const track = trackRef.current;
        const progress = progressRef.current;
        const container = scrollContainerRef.current;
        if (!track || !container || loading || error || reviews.length === 0) return;

        let animationFrameId;
        const scrollSpeed = 0.2; // Constant speed (slower for better readability)

        const animate = () => {
            if (!isPausedRef.current && !isDraggingRef.current) {
                const halfWidth = track.scrollWidth / 2;

                posRef.current += scrollSpeed;
                if (posRef.current >= halfWidth) {
                    posRef.current = 0;
                }

                // Apply GPU-accelerated transform directly
                track.style.transform = `translate3d(${-posRef.current}px, 0, 0)`;

                // Update indicator progress directly (bypass React re-render)
                if (progress) {
                    const percentage = (posRef.current / halfWidth) * 100;
                    progress.style.width = `${percentage}%`;
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [loading, error, reviews]);

    // Unified interaction handlers
    const startInteraction = (clientX) => {
        setIsDragging(true);
        setIsPaused(true);
        setStartX(clientX);
        setScrollPosX(posRef.current);
    };

    const stopInteraction = () => {
        setIsDragging(false);
        setIsPaused(false);
    };

    const handleInteractionMove = (clientX) => {
        if (!isDraggingRef.current) return;

        const track = trackRef.current;
        const progress = progressRef.current;
        if (!track) return;

        const deltaX = clientX - startX;
        const halfWidth = track.scrollWidth / 2;

        // Multiplier for drag speed
        let newPos = scrollPosX - deltaX;

        // Wrapping logic for infinite feel during drag
        if (newPos < 0) newPos = halfWidth + (newPos % halfWidth);
        if (newPos >= halfWidth) newPos = newPos % halfWidth;

        posRef.current = newPos;
        track.style.transform = `translate3d(${-newPos}px, 0, 0)`;

        if (progress) {
            const percentage = (newPos / halfWidth) * 100;
            progress.style.width = `${percentage}%`;
        }
    };

    // Event Handlers for UI
    const handleMouseDown = (e) => startInteraction(e.pageX);
    const handleMouseMove = (e) => {
        if (isDraggingRef.current) {
            e.preventDefault();
            handleInteractionMove(e.pageX);
        }
    };

    const handleTouchStart = (e) => {
        // Prevent default to avoid iOS Safari scroll interference
        e.preventDefault();
        startInteraction(e.touches[0].pageX);
    };
    const handleTouchMove = (e) => {
        if (isDraggingRef.current) {
            e.preventDefault(); // Critical for iOS Safari
            handleInteractionMove(e.touches[0].pageX);
        }
    };

    const handleIndicatorInteraction = (clientX) => {
        const track = trackRef.current;
        const progress = progressRef.current;
        const indicator = progress?.parentElement;
        if (!track || !indicator) return;

        const rect = indicator.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percentage = x / rect.width;
        const halfWidth = track.scrollWidth / 2;

        posRef.current = halfWidth * percentage;
        track.style.transform = `translate3d(${-posRef.current}px, 0, 0)`;
        progress.style.width = `${percentage * 100}%`;
    };

    const handleStars = (rating) => (
        <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={s <= rating ? styles.starFilled : styles.starEmpty}>★</span>
            ))}
        </div>
    );

    const allReviews = [...reviews, ...reviews];

    if (loading) return (
        <section className={styles.reviewsSection}>
            <div className={styles.container}><div className={styles.header}><h2>What Our Clients Say</h2><p>Loading reviews...</p></div></div>
        </section>
    );

    return (
        <section className={styles.reviewsSection}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>What Our Clients Say</h2>
                    <p>Real reviews from real customers</p>
                </div>

                <div
                    className={styles.reviewsWrapper}
                    ref={scrollContainerRef}
                    onMouseEnter={() => { if (window.matchMedia('(hover: hover)').matches) setIsPaused(true); }}
                    onMouseLeave={stopInteraction}
                    onMouseDown={handleMouseDown}
                    onMouseUp={stopInteraction}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={stopInteraction}
                    onTouchCancel={stopInteraction}
                >
                    <div className={styles.reviewsTrack} ref={trackRef}>
                        {allReviews.map((review, index) => (
                            <div key={`${review.id}-${index}`} className={styles.reviewCard}>
                                <div className={styles.reviewHeader}>
                                    <div className={styles.avatarSection}>
                                        <div className={styles.avatar}>{review.avatar}</div>
                                        <div className={styles.reviewerInfo}>
                                            <h4>{review.name}</h4>
                                            <span className={styles.date}>{review.date}</span>
                                        </div>
                                    </div>
                                    <span className={`${styles.platformBadge} ${styles[review.platform.toLowerCase()]}`}>
                                        {review.platform}
                                    </span>
                                </div>
                                {handleStars(review.rating)}
                                <p className={styles.reviewText}>{review.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className={styles.scrollIndicator}
                    onMouseDown={(e) => { setIsPaused(true); setIsDragging(true); handleIndicatorInteraction(e.pageX); }}
                    onMouseMove={(e) => { if (isDragging && isPaused) handleIndicatorInteraction(e.pageX); }}
                    onMouseUp={stopInteraction}
                    onMouseLeave={stopInteraction}
                    onTouchStart={(e) => { setIsPaused(true); setIsDragging(true); handleIndicatorInteraction(e.touches[0].pageX); }}
                    onTouchMove={(e) => handleIndicatorInteraction(e.touches[0].pageX)}
                    onTouchEnd={stopInteraction}
                    style={{ cursor: 'pointer' }}
                >
                    <div ref={progressRef} className={styles.scrollProgress} />
                </div>
            </div>
        </section>
    );
};

export default Reviews;
