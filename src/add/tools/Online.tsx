import { useEffect, useState } from "react";
import { firestore } from "./Firebase";
import {
    doc,
    setDoc,
    collection,
    onSnapshot,
    serverTimestamp,
    query,
    where,
} from "firebase/firestore";
import { UAParser } from "ua-parser-js";
import "../css/online.css";
import { FaSpinner } from 'react-icons/fa';


interface UserStatus {
    state: string;
    last_changed: any;
    browser: string;
    os: string;
    device: string;
    ip: string;
}

function Online() {
    const [onlineUsers, setOnlineUsers] = useState<UserStatus[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isDetailVisible] = useState<boolean>(false);

    useEffect(() => {
        const parser = new UAParser();
        const uaResult = parser.getResult();
        const browser = uaResult.browser.name || "unknown";
        const os = uaResult.os.name || "unknown";
        const device = uaResult.device.model || "Desktop";

        const fetchIpAndUpdate = async () => {
            try {
                let ip: string = localStorage.getItem("userIP") ?? "";

                if (!ip) {
                    const response = await fetch("https://api.ipify.org?format=json");
                    const data = await response.json();
                    ip = data.ip;
                    localStorage.setItem("userIP", ip);
                }

                if (!ip) return;

                const docId = `${ip}-${browser}-${device}-${os}`.toLowerCase().replace(/ /g, "-");
                const userStatusDocRef = doc(firestore, "ielts", docId);

                const isOfflineForFirestore = { state: "offline", last_changed: serverTimestamp() };
                const isOnlineForFirestore = {
                    state: "online",
                    last_changed: serverTimestamp(),
                    browser,
                    os,
                    device,
                    ip,
                };

                const updateStatus = async (isOnline: boolean) => {
                    const status = isOnline ? isOnlineForFirestore : isOfflineForFirestore;
                    await setDoc(userStatusDocRef, status, { merge: true });
                };

                const userStatusCollectionRef = collection(firestore, "ielts");
                const onlineUsersQuery = query(userStatusCollectionRef, where("state", "==", "online"));

                const unsubscribe = onSnapshot(onlineUsersQuery, (snapshot) => {
                    setOnlineUsers(snapshot.docs.map((doc) => doc.data() as UserStatus));
                    setTimeout(() => setLoading(false), 2000);
                });

                await updateStatus(true);

                const handleVisibilityChange = () => {
                    if (document.visibilityState === "hidden") {
                        updateStatus(false);
                    } else {
                        updateStatus(true);
                    }
                };

                document.addEventListener("visibilitychange", handleVisibilityChange);

                return () => {
                    updateStatus(false);
                    unsubscribe();
                    document.removeEventListener("visibilitychange", handleVisibilityChange);
                };
            } catch (error) {
                console.error("Error fetching IP:", error);
            }
        };

        fetchIpAndUpdate();
    }, []);

    if (loading) {
        return (
            <div className="container-online-users">
                <h1>
                    <FaSpinner className="spinner-online-users" /> Loading...
                </h1>
            </div>
        );
    }

    return (
        <div className="container-online-users">
            <h1>🟢 Online: {onlineUsers.length}</h1>
            {/* <h5>
                <button onClick={toggleDetails}>
                    <FontAwesomeIcon icon={isDetailVisible ? faChevronUp : faChevronDown} />
                    {isDetailVisible ? " Hide" : " Show"}
                </button>
            </h5> */}

            {isDetailVisible && (
                <ul>
                    {onlineUsers.map((user, index) => (
                        <li key={index}>
                            <p>Browser: {user.browser}</p>
                            <p>IP Address: {user.ip}</p>
                            <p>OS: {user.os}</p>
                            <p>Device: {user.device}</p>
                            <p>
                                Last Changed:{" "}
                                {user.last_changed ? new Date(user.last_changed.toDate()).toLocaleString() : "N/A"}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Online;
