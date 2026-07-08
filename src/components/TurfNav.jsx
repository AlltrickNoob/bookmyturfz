import React, { useState, useEffect } from "react";
import turfbg from "../images/turfbg.jpg";
import logo from "../images/navlogo.png";
import "../style/turf.css";
import { MdLocationOn } from "react-icons/md";
import { Select, Input } from "@chakra-ui/react";
import { db } from "../firebase-config/config";
import { collection, getDocs } from "firebase/firestore";
import { useUserAuth } from "../context/Authcontext";
import { PopoverProfile } from "./Popover";

export const TurfNav = (prop) => {
  const { setTurf, onSearchChange, search } = prop;
  const [allSports, setAllSports] = useState(["cricket", "football", "basketball", "badminton"]);
  const [selectedSport, setSelectedSport] = useState("All");

  useEffect(() => {
    // Fetch all sports collections and gather all unique sports (one-time fetch)
    const fetchSports = async () => {
      const sportsList = ["cricket", "football", "basketball", "badminton"];
      const sportSet = new Set();
      for (const s of sportsList) {
        const snap = await getDocs(collection(db, s));
        snap.docs.forEach((doc) => {
          const data = doc.data();
          if (s) sportSet.add(s);
          if (data.sport) sportSet.add(data.sport);
        });
      }
      const sportsDropdown = ["All", ...Array.from(sportSet).sort()];
      setAllSports(sportsDropdown);
    };
    fetchSports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { user, logout } = useUserAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <div id="turfnavbg">
        <img src={turfbg} alt="" />
      </div>
      <div id="turfNavContainer">
        <div id="topNavturf">
          <div id="turfNav">
            <img src={logo} alt="" />
          </div>
          <div id="navBtns">
            <PopoverProfile handleLogout={handleLogout} email={user ? user.email : ''} />
          </div>
        </div>
        <div id="midNavTurf">
          <p>IT'S ALL STARTED HERE!</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%', maxWidth: '560px' }}>
            <Input
              placeholder="Search by turf name or location"
              value={search || ""}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              bg="white"
              color="black"
              size="md"
              borderRadius="md"
            />
            <MdLocationOn fontWeight={"bold"} color="white" />
          </div>
        </div>
        <div id="botNavTurf">
          <p id="botNavText">
            
            <span
              style={{
                color: "red",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
             
            </span>
          </p>
          <Select
            value={selectedSport}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedSport(val);
              setTurf(val);
            }}
            width="280px"
            bg="white"
            color="black"
            aria-label="Choose sport"
          >
            {allSports.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Sports" : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
};

// Reset selectedSport if allSports changes and current selectedSport is not present
// (Moved outside the component to avoid unreachable code. If needed, place inside the component above return.)
