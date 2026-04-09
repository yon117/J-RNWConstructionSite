import { useRouter } from 'next/router';
import { X } from 'lucide-react';
import styles from './Modal.module.css';
import { useEffect } from 'react';

export default function Modal({ children, title, onClose }) {
    const router = useRouter();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            const query = { ...router.query };
            delete query.modal;
            router.push({ pathname: router.pathname, query }, undefined, { scroll: false });
        }
    };

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>{title}</h2>
                    <button onClick={handleClose} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
}
