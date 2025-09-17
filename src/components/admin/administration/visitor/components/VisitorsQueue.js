import React, { useState, useEffect, useRef } from 'react';
import { postData } from '../../../../../services/request';

const VisitorsQueue = () => {
  const awaitedRef = useRef(null);
  const inMeetingRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const [inMeetings, setInMeetings] = useState([]);
  const [meetingsAwaited, setMeetingsAwaited] = useState([]);
  const [nextTicketNum, setNextTicketNum] = useState("-");
  const [displayTicketNum, setDisplayTicketNum] = useState("-");
  console.log(displayTicketNum , "displayTicketNum");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);

  const loadData = async () => {
    const parsedId = JSON.parse(sessionStorage.getItem("user")).userId;
    const obj = { maxResults: 100, userId: parsedId };

    const [awaited, inMeeting] = await Promise.allSettled([
      postData('/services/app/PrisonerSearch/SearchVisitAwaiting?checkedIn=false', obj, false),
      postData('/services/app/PrisonerSearch/SearchInVisitMeeting?checkedIn=false', obj, false)
    ]);

    if (awaited.status === 'fulfilled') {
      setMeetingsAwaited(awaited.value.result.data);
      if (awaited.value.result.data.length > 0) {
        setNextTicketNum(awaited.value.result.data[0].queueNumber);
      }
    }

    if (inMeeting.status === 'fulfilled') {
      setInMeetings(inMeeting.value.result.data);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    startScroll(awaitedRef, 1);
    startScroll(inMeetingRef, 1);
  }, [meetingsAwaited, inMeetings]);

  useEffect(() => {
    // Only update the display ticket number, don't simulate moving tickets
    if (meetingsAwaited.length === 0 || nextTicketNum === "-") {
      setDisplayTicketNum("No Tickets");
      return;
    }

    const interval = setInterval(() => {
      setDisplayTicketNum(nextTicketNum);
    }, 10000);

    return () => clearInterval(interval);
  }, [nextTicketNum, meetingsAwaited.length]);

  const generateTickets = (tickets, className = "") => {
    if (!tickets.length)
      return <div style={{ padding: "20px", textAlign: "center", color:"#999" }}>No tickets</div>;

    return tickets.map(ticket => (
      <div key={ticket.queueNumber} className={`ticket ${className}`}>
        {ticket.queueNumber}
      </div>
    ));
  };

  const startScroll = (ref, speed) => {
    let y = 0;
    const el = ref.current;
    if (!el) return;
    const spacerHeight = el.querySelector('.spacer')?.offsetHeight || 0;
    const cycleHeight = (el.scrollHeight - spacerHeight) / 2;

    const step = () => {
      y -= speed;
      if (-y >= cycleHeight + spacerHeight) y += cycleHeight + spacerHeight;
      el.style.transform = `translateY(${y}px)`;
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullScreen(!isFullScreen);
  };

  const handleMouseMove = () => {
    setButtonVisible(true);
    clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setButtonVisible(false), 3000);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    hideTimeoutRef.current = setTimeout(() => setButtonVisible(false), 3000);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);



  return (
    <div style={styles.body}>
      <style>{cssStyles}</style>
      <div style={styles.container}>
        <div style={styles.column}>
          <div style={styles.title} className="nastaliq">قطار برائے انتظار</div>
          <div style={styles.scrollWrapper}>
            <div ref={awaitedRef} className="ticket-list">
              {generateTickets(meetingsAwaited)}
              <div className="spacer"></div>
              {generateTickets(meetingsAwaited)}
            </div>
          </div>
        </div>

        <div style={styles.column}>
          <div style={styles.title2} className="nastaliq">جاری ملاقاتیں</div>
          <div style={styles.scrollWrapper}>
            <div ref={inMeetingRef} className="ticket-list">
              {generateTickets(inMeetings, 'in-meeting')}
              <div className="spacer"></div>
              {generateTickets(inMeetings, 'in-meeting')}
            </div>
          </div>
        </div>

        <div style={styles.column}>
          <div style={styles.title3} className="nastaliq">نئی ملاقات</div>
        <div style={styles.column2}>
          <div style={styles.newCircle} className='animate-pulse'>
            {(meetingsAwaited.length > 0 && nextTicketNum !== "-") ? displayTicketNum : "No Tickets"}
          </div>
        </div>
        </div>
      </div>
      <button
        style={{ 
          ...styles.fullscreenButton, 
          opacity: buttonVisible ? 1 : 0, 
          pointerEvents: buttonVisible ? 'auto' : 'none' 
        }}
        onClick={toggleFullScreen}
      >
        {isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      </button>
    </div>
  );
};

const cssStyles = `
@font-face {
  font-family: 'Mehr Nastaleeq Web';
  src: url('https://cdn.jsdelivr.net/gh/alif-type/mehr-nastaleeq-web/MMehrNastaleeqWeb.woff2') format('woff2'),
       url('https://cdn.jsdelivr.net/gh/alif-type/mehr-nastaleeq-web/MMehrNastaleeqWeb.ttf') format('truetype');
}
.nastaliq { font-family: 'Mehr Nastaleeq Web', serif; }
.ticket {
  font-size: 5.5rem; font-weight: bold; text-align: center; margin: 15px; marginLeft: "-310px !important"; padding: 20px;
  border-radius: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); color: #fff;
  background: linear-gradient(to right, #42a5f5, #1e88e5); 
}
.ticket.in-meeting { background: linear-gradient(to right, #ff7043, #f4511e); }
.spacer { height: 400px; }

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
`;

const styles = {
  body: {
    margin: "0 !important",
    marginLeft: "-310px !important",
    padding: 0, 
    fontFamily: "'Segoe UI', sans-serif",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "#f0f4f8", height: "100vh"
  },
  container: {
    display: "flex", width: "95%", height: "95vh",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)", borderRadius: "20px",
    background: "#fff", padding: "10px",
    marginLeft: "-310px !important",
  },
  column: {
    flex: 1, margin: "0 10px", display: "flex", flexDirection: "column",
    overflow: "hidden", borderRadius: "20px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)", background: "#fff",
  },
  column2: {
    flex: 1, display: "flex", flexDirection: "column",
    overflow: "hidden", borderRadius: "20px",
   background: "#fff",
    alignItems: "center", justifyContent: "center",contentAlign:"center", alignContent:"center",  },
  newMeeting: {
    flex: 1, margin: "0 10px", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", overflow: "hidden",
    borderRadius: "20px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", background: "#fff",
  },
  title: {
    background: "linear-gradient(to right, #42a5f5, #1e88e5)", color: "#fff",
    fontSize: "2rem", padding: "10px", borderRadius: "12px 12px 0 0",
    textAlign: "center", marginBottom: "10px"
  },
  title2: {
    background: "linear-gradient(to right, #ff7043, #f4511e)", color: "#fff",
    fontSize: "2rem", padding: "10px", borderRadius: "12px 12px 0 0",
    textAlign: "center", marginBottom: "10px"
  },
  title3: {
    background: "linear-gradient(to right, #43a047, #66bb6a)", color: "#fff",
    fontSize: "2rem", padding: "10px", borderRadius: "12px 12px 0 0",
    textAlign: "center", marginBottom: "10px"
  },
  scrollWrapper: { flex: 1, position: "relative", overflow: "hidden" },
  newCircle: {
    width: "80%", aspectRatio: "1/1", borderRadius: "50%", color: "#fff",
    background: "linear-gradient(135deg, #43a047, #66bb6a)", fontSize: "5.5rem",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)", alignSelf:"center", contentAlign:"center", 
  },
  fullscreenButton: { position:"fixed", bottom:"20px", right:"20px", padding:"15px 25px", fontSize:"18px", zIndex:99999, transition:"opacity 0.5s ease" , backgroundColor:"#405189", color:"#fff", borderRadius:"10px", border:"none" },
};

export default VisitorsQueue;
