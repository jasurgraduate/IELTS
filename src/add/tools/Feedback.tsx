import React, { useState, useEffect } from 'react';
import { firestore, feedbackCollection } from './Firebase';
import { setDoc, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import '../css/feedback.css';

interface FeedbackData {
    id: string;
    name: string;
    message: string;
    reply: string;
    likes: number;
    dislikes: number;
    timestamp: any;
    formattedDate: string;
}

const Feedback: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
    const [lastFeedbackTime, setLastFeedbackTime] = useState<Date | null>(null);
    const [userFeedbackActions, setUserFeedbackActions] = useState<{ [key: string]: 'like' | 'dislike' | null }>({});
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isNameLoaded, setIsNameLoaded] = useState<boolean>(false);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            const feedbackSnapshot = await getDocs(feedbackCollection);
            const feedbackList = feedbackSnapshot.docs.map(doc => {
                const data = doc.data() as FeedbackData;
                return { id: doc.id, ...data, formattedDate: new Date(data.timestamp.seconds * 1000).toLocaleString() };
            }).sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
            setFeedbacks(feedbackList);
        };

        fetchFeedbacks();
    }, []);

    useEffect(() => {
        const storedTime = localStorage.getItem('lastFeedbackTime');
        const storedName = localStorage.getItem('userName');
        if (storedTime) {
            const lastTime = new Date(storedTime);
            setLastFeedbackTime(lastTime);
        }
        if (storedName) {
            setName(storedName);
        }
        setIsNameLoaded(true);
    }, []);

    useEffect(() => {
        if (lastFeedbackTime) {
            const interval = setInterval(() => {
                const currentTime = new Date().getTime();
                const timeLeft = 15 * 60 * 1000 - (currentTime - lastFeedbackTime.getTime());
                if (timeLeft <= 0) {
                    setCountdown(null);
                    setLastFeedbackTime(null);
                    localStorage.removeItem('lastFeedbackTime');
                    clearInterval(interval);
                } else {
                    setCountdown(Math.floor(timeLeft / 1000));
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [lastFeedbackTime]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (lastFeedbackTime && (new Date().getTime() - lastFeedbackTime.getTime()) < 15 * 60 * 1000) {
            alert('Please wait 15 minutes before submitting another feedback.');
            return;
        }

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0]; // yyyy-mm-dd
        const formattedTime = currentDate.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
        const formattedName = name.replace(/\s+/g, '-').toLowerCase(); // Format name for consistency
        const docId = `${formattedDate}-${formattedTime}-${formattedName}`; // Ensure uniqueness

        const timestamp = serverTimestamp();

        await setDoc(doc(feedbackCollection, docId), {
            name,
            message,
            reply: '',
            likes: 0,
            dislikes: 0,
            timestamp
        });

        setLastFeedbackTime(currentDate);
        localStorage.setItem('lastFeedbackTime', currentDate.toISOString());
        localStorage.setItem('userName', name);
        setMessage('');
        const feedbackSnapshot = await getDocs(feedbackCollection);
        const feedbackList = feedbackSnapshot.docs.map(doc => {
            const data = doc.data() as FeedbackData;
            return { id: doc.id, ...data, formattedDate: new Date(data.timestamp.seconds * 1000).toLocaleString() };
        }).sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        setFeedbacks(feedbackList);
    };

    const handleLike = async (id: string) => {
        const feedbackDoc = doc(firestore, 'feedback', id);
        const feedback = feedbacks.find(fb => fb.id === id);
        if (feedback) {
            const userAction = userFeedbackActions[id];
            if (userAction === 'like') return;

            const newLikes = userAction === 'dislike' ? feedback.likes + 1 : feedback.likes + 1;
            const newDislikes = userAction === 'dislike' ? feedback.dislikes - 1 : feedback.dislikes;

            await updateDoc(feedbackDoc, { likes: newLikes, dislikes: newDislikes });
            setFeedbacks(feedbacks.map(fb => fb.id === id ? { ...fb, likes: newLikes, dislikes: newDislikes } : fb));
            setUserFeedbackActions({ ...userFeedbackActions, [id]: 'like' });
        }
    };

    const handleDislike = async (id: string) => {
        const feedbackDoc = doc(firestore, 'feedback', id);
        const feedback = feedbacks.find(fb => fb.id === id);
        if (feedback) {
            const userAction = userFeedbackActions[id];
            if (userAction === 'dislike') return;

            const newDislikes = userAction === 'like' ? feedback.dislikes + 1 : feedback.dislikes + 1;
            const newLikes = userAction === 'like' ? feedback.likes - 1 : feedback.likes;

            await updateDoc(feedbackDoc, { likes: newLikes, dislikes: newDislikes });
            setFeedbacks(feedbacks.map(fb => fb.id === id ? { ...fb, likes: newLikes, dislikes: newDislikes } : fb));
            setUserFeedbackActions({ ...userFeedbackActions, [id]: 'dislike' });
        }
    };

    return (
        <div className="feedback-container">
            <div className="feedback-section">
                <h1>Feedback</h1>
                {isNameLoaded && countdown ? (
                    <p>Dear {name}, please wait {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? '0' : ''}{countdown % 60} minutes before submitting another feedback.</p>
                ) : (
                    <div className="feedback-form">
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Your Message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                )}
            </div>
            <div className="messages-section">
                <h1>📩 Messages/Replies:</h1>
                <div className="feedback-list">
                    {feedbacks.map(fb => (
                        <div key={fb.id} className="feedback-item">
                            <p><strong>{fb.name}</strong> wrote: {fb.message}</p>
                            <p className="feedback-date">{fb.formattedDate}</p>
                            {fb.reply && <p className="admin-reply"><strong>Admin:</strong> {fb.reply}</p>}
                            <div className="feedback-actions">
                                <button onClick={() => handleLike(fb.id)}>👍🏻 ({fb.likes})</button>
                                <button onClick={() => handleDislike(fb.id)}>😐 ({fb.dislikes})</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Feedback;
