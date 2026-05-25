import { useEffect, useState } from 'react';
import styles from '../styles/Reviews.module.css';
import { useLang } from '../context/LanguageContext';

const duplicateRow = (items) => [...items, ...items];
const stopKeys = ['Escape'];

const Reviews = ({ sectionId }) => {
    const { t } = useLang();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeReview, setActiveReview] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('/api/reviews');
                const data = await response.json();
                if (data.reviews) {
                    setReviews(data.reviews);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Error fetching reviews:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (activeReview && stopKeys.includes(event.key)) {
                setActiveReview(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeReview]);

    if (loading) {
        return (
            <section id={sectionId} className={styles.reviewsSection}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h2>{t.whatClientsSay || 'What Our Clients Say'}</h2>
                        <p>{t.loadingReviews || 'Loading reviews...'}</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error || reviews.length === 0) {
        return null;
    }

    const midpoint = Math.ceil(reviews.length / 2);
    const topRow = duplicateRow(reviews.slice(0, midpoint));
    const bottomRow = duplicateRow(reviews.slice(midpoint));

    const handleOpenReview = (review) => {
        setActiveReview(review);
    };

    const handleCloseReview = () => {
        setActiveReview(null);
    };

    const handleStars = (rating) => (
        <div className={styles.stars} aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={star <= rating ? styles.starFilled : styles.starEmpty}
                    aria-hidden="true"
                >
                    {"\u2605"}
                </span>
            ))}
        </div>
    );

    const renderCard = (review, index, rowName) => (
        <button
            key={`${rowName}-${review.id}-${index}`}
            className={styles.reviewCard}
            type="button"
            onClick={() => handleOpenReview(review)}
            aria-label={`Read full review from ${review.name}`}
        >
            <div className={styles.reviewCardTop}>
                <span className={`${styles.platformBadge} ${styles[review.platform.toLowerCase()]}`}>
                    {review.platform}
                </span>
                {handleStars(review.rating)}
            </div>
            <div className={styles.reviewQuoteWrap}>
                <p className={styles.reviewText}>{review.text}</p>
            </div>
            <div className={styles.reviewMeta}>
                <div className={styles.avatar}>{review.avatar}</div>
                <div className={styles.reviewerInfo}>
                    <h4>{review.name}</h4>
                    <p className={styles.designation}>{review.date}</p>
                </div>
            </div>
        </button>
    );

    return (
        <section id={sectionId} className={styles.reviewsSection}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>{t.whatClientsSay || 'What Our Clients Say'}</h2>
                    <p>{t.realReviews || 'Real reviews from real customers'}</p>
                </div>

                <div className={`${styles.marqueeStack} ${activeReview ? styles.isPaused : ''}`}>
                    <div className={styles.marqueeViewport}>
                        <div className={`${styles.marqueeTrack} ${styles.marqueeTrackTop}`}>
                            {topRow.map((review, index) => renderCard(review, index, 'top'))}
                        </div>
                    </div>

                    {bottomRow.length > 0 && (
                        <div className={styles.marqueeViewport}>
                            <div className={`${styles.marqueeTrack} ${styles.marqueeTrackBottom}`}>
                                {bottomRow.map((review, index) => renderCard(review, index, 'bottom'))}
                            </div>
                        </div>
                    )}
                </div>

                {activeReview && (
                    <div
                        className={styles.reviewOverlay}
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Full review from ${activeReview.name}`}
                        onClick={handleCloseReview}
                    >
                        <div
                            className={styles.reviewModal}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className={styles.reviewModalTop}>
                                <span className={`${styles.platformBadge} ${styles[activeReview.platform.toLowerCase()]}`}>
                                    {activeReview.platform}
                                </span>
                                <button
                                    type="button"
                                    className={styles.closeButton}
                                    onClick={handleCloseReview}
                                    aria-label="Close full review"
                                >
                                    ×
                                </button>
                            </div>

                            <div className={styles.reviewQuoteWrap}>
                                {handleStars(activeReview.rating)}
                                <p className={`${styles.reviewText} ${styles.reviewTextFull}`}>
                                    {activeReview.text}
                                </p>
                            </div>

                            <div className={styles.reviewMeta}>
                                <div className={styles.avatar}>{activeReview.avatar}</div>
                                <div className={styles.reviewerInfo}>
                                    <h4>{activeReview.name}</h4>
                                    <p className={styles.designation}>{activeReview.date}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Reviews;
