import { useEffect, useState } from "react";
import { firestore } from "./Firebase";
import { TfiStatsUp } from "react-icons/tfi";
import { FaUsersViewfinder } from "react-icons/fa6";
import { FaUserSecret } from "react-icons/fa";
import { RiLoader2Fill } from "react-icons/ri";
import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  getDoc,
  deleteDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import "../css/online.css";
import { UAParser } from "ua-parser-js";

interface UserStatus {
  state: string;
  last_changed: any;
  browser: string;
  os: string;
  device: string;
  ip: string;
  city: string;
  country: string;
}

function Online() {
  const [onlineUsers, setOnlineUsers] = useState<UserStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [allTimeVisitors, setAllTimeVisitors] = useState<number>(0);

  useEffect(() => {
    const fetchIpAndUpdate = async () => {
      try {
        const parser = new UAParser();
        const uaResult = parser.getResult();
        const browser = uaResult.browser.name || "unknown";
        const os = uaResult.os.name || "unknown";
        const device = uaResult.device.model || "Desktop";

        let ip: string = localStorage.getItem("userIP") ?? "";
        let city: string = localStorage.getItem("userCity") ?? "";
        let country: string = localStorage.getItem("userCountry") ?? "";

        if (!ip || !city || !country) {
          const geoResponse = await fetch(
            "https://get.geojs.io/v1/ip/geo.json"
          );
          const geoData = await geoResponse.json();
          ip = geoData.ip || "unknown";
          city = geoData.city || "Unknown";
          country = geoData.country || "Unknown";

          localStorage.setItem("userIP", ip);
          localStorage.setItem("userCity", city);
          localStorage.setItem("userCountry", country);
        }

        const docId = `${ip}-${browser}-${device}-${os}`
          .toLowerCase()
          .replace(/ /g, "-");
        const userStatusDocRef = doc(firestore, "ielts", docId);

        const isOfflineForFirestore = {
          state: "offline",
          last_changed: serverTimestamp(),
        };
        const isOnlineForFirestore = {
          state: "online",
          last_changed: serverTimestamp(),
          browser,
          os,
          device,
          ip,
          city,
          country,
        };

        const updateStatus = async (isOnline: boolean) => {
          const status = isOnline
            ? isOnlineForFirestore
            : isOfflineForFirestore;
          await setDoc(userStatusDocRef, status, { merge: true });
        };

        updateStatus(true);

        const userStatusCollectionRef = collection(firestore, "ielts");
        const onlineUsersQuery = query(
          userStatusCollectionRef,
          where("state", "==", "online")
        );

        const unsubscribe = onSnapshot(onlineUsersQuery, (snapshot) => {
          setOnlineUsers(snapshot.docs.map((doc) => doc.data() as UserStatus));
        });

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
          document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange
          );
        };
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    const updateAllTimeVisitors = async () => {
      try {
        const visitorsDocRef = doc(
          firestore,
          "alltimeVisitors",
          "IELTSvisitorCount"
        );
        const visitorDoc = await getDoc(visitorsDocRef);

        if (visitorDoc.exists()) {
          const visitorsData = visitorDoc.data();
          const currentVisitors = visitorsData?.count || 0;

          await setDoc(
            visitorsDocRef,
            { count: currentVisitors + 1 },
            { merge: true }
          );
        } else {
          await setDoc(visitorsDocRef, { count: 1 });
        }

        const updatedVisitorCount = await getDoc(visitorsDocRef);
        setAllTimeVisitors(updatedVisitorCount.data()?.count || 0);
      } catch (error) {
        console.error("Error updating all-time visitors:", error);
      }
    };

    const deleteOldOnlineUserData = async () => {
      try {
        const twoWeeksAgo = Timestamp.fromDate(
          new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
        ); // 6months ago
        const userStatusCollectionRef = collection(firestore, "ielts");
        const oldUsersQuery = query(
          userStatusCollectionRef,
          where("last_changed", "<", twoWeeksAgo)
        );

        const snapshot = await getDocs(oldUsersQuery);
        snapshot.forEach((doc) => {
          deleteDoc(doc.ref);
        });
      } catch (error) {
        console.error("Error deleting old online user data:", error);
      }
    };

    const fetchData = async () => {
      await fetchIpAndUpdate();
      await updateAllTimeVisitors();
      await deleteOldOnlineUserData();

      setTimeout(() => {
        setLoading(false);
      }, 0);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container-online-users">
        <p>
          <FaUserSecret />
          Total visitors: <RiLoader2Fill className="loading-icon" />
        </p>

        <p>
          <FaUsersViewfinder />
          Online: <RiLoader2Fill className="loading-icon" />
        </p>
      </div>
    );
  }

  return (
    <div className="container-online-users">
      <TfiStatsUp />
      <p>
        <FaUserSecret />
        Total visitors: {allTimeVisitors}
      </p>
      <p>
        <FaUsersViewfinder />
        Online: {onlineUsers.length}
      </p>
    </div>
  );
}

export default Online;
