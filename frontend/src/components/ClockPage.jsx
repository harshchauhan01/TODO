import { useEffect, useRef, useState } from "react";

// Analog Clock Component with 3D Effect
const AnalogClock = ({ time }) => {
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  // Generate hour markers
  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const x = 50 + 38 * Math.cos(angle);
    const y = 50 + 38 * Math.sin(angle);
    return { x, y, hour: i === 0 ? 12 : i };
  });

  // Generate minute markers
  const minuteMarkers = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const outerRadius = 44;
    const innerRadius = i % 5 === 0 ? 40 : 42;
    return {
      x1: 50 + innerRadius * Math.cos(angle),
      y1: 50 + innerRadius * Math.sin(angle),
      x2: 50 + outerRadius * Math.cos(angle),
      y2: 50 + outerRadius * Math.sin(angle),
      isHour: i % 5 === 0,
    };
  });

  return (
    <div className="relative">
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 blur-2xl opacity-50 scale-110" />
      
      {/* Clock container with 3D effect */}
      <div
        className="relative w-72 h-72 md:w-96 md:h-96 rounded-full"
        style={{
          background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
          boxShadow: `
            20px 20px 60px #c9c9c9,
            -20px -20px 60px #ffffff,
            inset 2px 2px 5px rgba(255,255,255,0.9),
            inset -2px -2px 5px rgba(0,0,0,0.1)
          `,
        }}
      >
        {/* Inner bezel */}
        <div
          className="absolute inset-4 rounded-full"
          style={{
            background: "linear-gradient(145deg, #f0f0f0, #ffffff)",
            boxShadow: `
              inset 8px 8px 16px #d1d1d1,
              inset -8px -8px 16px #ffffff
            `,
          }}
        >
          {/* Clock face */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Minute markers */}
              {minuteMarkers.map((marker, i) => (
                <line
                  key={i}
                  x1={marker.x1}
                  y1={marker.y1}
                  x2={marker.x2}
                  y2={marker.y2}
                  stroke={marker.isHour ? "#374151" : "#9ca3af"}
                  strokeWidth={marker.isHour ? "1" : "0.5"}
                  strokeLinecap="round"
                />
              ))}

              {/* Hour numbers */}
              {hourMarkers.map((marker) => (
                <text
                  key={marker.hour}
                  x={marker.x}
                  y={marker.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-gray-700 font-semibold"
                  style={{ fontSize: "6px", fontFamily: "system-ui" }}
                >
                  {marker.hour}
                </text>
              ))}

              {/* Hour hand */}
              <g
                style={{
                  transform: `rotate(${hourDeg}deg)`,
                  transformOrigin: "50px 50px",
                  transition: "transform 0.5s cubic-bezier(0.4, 2.3, 0.3, 1)",
                }}
              >
                <line
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="28"
                  stroke="url(#hourGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  style={{
                    filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))",
                  }}
                />
              </g>

              {/* Minute hand */}
              <g
                style={{
                  transform: `rotate(${minuteDeg}deg)`,
                  transformOrigin: "50px 50px",
                  transition: "transform 0.3s cubic-bezier(0.4, 2.3, 0.3, 1)",
                }}
              >
                <line
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="20"
                  stroke="url(#minuteGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{
                    filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.2))",
                  }}
                />
              </g>

              {/* Second hand */}
              <g
                style={{
                  transform: `rotate(${secondDeg}deg)`,
                  transformOrigin: "50px 50px",
                }}
              >
                <line
                  x1="50"
                  y1="55"
                  x2="50"
                  y2="16"
                  stroke="#ef4444"
                  strokeWidth="1"
                  strokeLinecap="round"
                  style={{
                    filter: "drop-shadow(1px 1px 2px rgba(239,68,68,0.5))",
                  }}
                />
                <circle cx="50" cy="16" r="2" fill="#ef4444" />
              </g>

              {/* Center cap */}
              <circle
                cx="50"
                cy="50"
                r="4"
                fill="url(#centerGradient)"
                style={{
                  filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.3))",
                }}
              />

              {/* Gradients */}
              <defs>
                <linearGradient id="hourGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1f2937" />
                  <stop offset="100%" stopColor="#4b5563" />
                </linearGradient>
                <linearGradient id="minuteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#374151" />
                  <stop offset="100%" stopColor="#6b7280" />
                </linearGradient>
                <radialGradient id="centerGradient" cx="30%" cy="30%">
                  <stop offset="0%" stopColor="#9ca3af" />
                  <stop offset="100%" stopColor="#374151" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Brand name */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-gray-400 font-light tracking-widest mt-16 text-xs md:text-sm"
            style={{ fontFamily: "system-ui" }}
          >
            PRECISION
          </span>
        </div>
      </div>
    </div>
  );
};

// Digital Display Component
const DigitalDisplay = ({ time }) => {
  const formatTime = (num) => num.toString().padStart(2, "0");

  return (
    <div
      className="mt-8 px-8 py-4 rounded-2xl"
      style={{
        background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
        boxShadow: `
          10px 10px 30px #c9c9c9,
          -10px -10px 30px #ffffff,
          inset 1px 1px 2px rgba(255,255,255,0.9),
          inset -1px -1px 2px rgba(0,0,0,0.05)
        `,
      }}
    >
      <div className="flex items-center space-x-2">
        {[
          formatTime(time.getHours()),
          ":",
          formatTime(time.getMinutes()),
          ":",
          formatTime(time.getSeconds()),
        ].map((segment, i) =>
          segment === ":" ? (
            <span key={i} className="text-3xl md:text-4xl font-light text-gray-400 animate-pulse">
              :
            </span>
          ) : (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-50 to-gray-100 px-3 py-2 rounded-lg"
              style={{
                boxShadow: "inset 2px 2px 4px #d1d1d1, inset -2px -2px 4px #ffffff",
              }}
            >
              <span
                className="text-3xl md:text-4xl font-mono font-bold bg-gradient-to-br from-gray-700 to-gray-500 bg-clip-text text-transparent"
                style={{ fontFamily: "'SF Mono', 'Roboto Mono', monospace" }}
              >
                {segment}
              </span>
            </div>
          )
        )}
      </div>
      <div className="text-center mt-2 text-gray-400 text-sm tracking-wider">
        {time.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
};

// Live Clock Component
const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <AnalogClock time={time} />
      <DigitalDisplay time={time} />
    </div>
  );
};

// Stopwatch Component
const StopWatch = () => {
  const [milliseconds, setMilliseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  const start = () => {
    if (intervalRef.current) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setMilliseconds((prev) => prev + 10);
    }, 10);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  };

  const reset = () => {
    stop();
    setMilliseconds(0);
    setLaps([]);
  };

  const lap = () => {
    setLaps((prev) => [milliseconds, ...prev]);
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return {
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
      centiseconds: centiseconds.toString().padStart(2, "0"),
    };
  };

  const time = formatTime(milliseconds);

  // Calculate progress for circular indicator
  const progress = (milliseconds % 60000) / 60000;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="mt-16">
      <h3 className="text-center text-gray-400 text-sm tracking-widest mb-8 uppercase">
        Stopwatch
      </h3>

      {/* Circular Progress Display */}
      <div className="flex justify-center mb-8">
        <div
          className="relative w-64 h-64 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
            boxShadow: `
              15px 15px 40px #c9c9c9,
              -15px -15px 40px #ffffff
            `,
          }}
        >
          {/* Progress Ring */}
          <svg className="absolute w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="115"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            <circle
              cx="128"
              cy="128"
              r="115"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 115}
              strokeDashoffset={2 * Math.PI * 115 - progress * 2 * Math.PI * 115}
              style={{ transition: "stroke-dashoffset 0.1s linear" }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#0f766e" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner circle with time */}
          <div
            className="absolute w-48 h-48 rounded-full flex flex-col items-center justify-center"
            style={{
              background: "linear-gradient(145deg, #f0f0f0, #ffffff)",
              boxShadow: "inset 5px 5px 15px #d1d1d1, inset -5px -5px 15px #ffffff",
            }}
          >
            <div className="flex items-baseline">
              <span className="text-5xl font-light text-gray-700 font-mono">
                {time.minutes}
              </span>
              <span className="text-5xl font-light text-gray-400 mx-1">:</span>
              <span className="text-5xl font-light text-gray-700 font-mono">
                {time.seconds}
              </span>
            </div>
            <span className="text-2xl text-gray-400 font-mono">.{time.centiseconds}</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        {!isRunning ? (
          <button
            onClick={start}
            className="group relative w-16 h-16 rounded-full transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
              boxShadow: "8px 8px 20px #c9c9c9, -8px -8px 20px #ffffff",
            }}
          >
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        ) : (
          <button
            onClick={stop}
            className="group relative w-16 h-16 rounded-full transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
              boxShadow: "8px 8px 20px #c9c9c9, -8px -8px 20px #ffffff",
            }}
          >
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            </div>
          </button>
        )}

        <button
          onClick={lap}
          disabled={!isRunning}
          className="group relative w-16 h-16 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50"
          style={{
            background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
            boxShadow: "8px 8px 20px #c9c9c9, -8px -8px 20px #ffffff",
          }}
        >
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </button>

        <button
          onClick={reset}
          className="group relative w-16 h-16 rounded-full transition-all duration-300 hover:scale-105"
          style={{
            background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
            boxShadow: "8px 8px 20px #c9c9c9, -8px -8px 20px #ffffff",
          }}
        >
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </button>
      </div>

      {/* Lap Times */}
      {laps.length > 0 && (
        <div
          className="mx-auto max-w-md rounded-2xl p-6"
          style={{
            background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
            boxShadow: "10px 10px 30px #c9c9c9, -10px -10px 30px #ffffff",
          }}
        >
          <h4 className="text-gray-400 text-sm tracking-wider mb-4 uppercase">Lap Times</h4>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {laps.map((lapTime, index) => {
              const lapFormatted = formatTime(lapTime);
              const lapDiff = index < laps.length - 1 ? lapTime - laps[index + 1] : lapTime;
              const diffFormatted = formatTime(lapDiff);
              return (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 px-4 rounded-lg"
                  style={{
                    background: "linear-gradient(145deg, #f5f5f5, #ffffff)",
                    boxShadow: "inset 2px 2px 5px #e0e0e0, inset -2px -2px 5px #ffffff",
                  }}
                >
                  <span className="text-gray-500 font-medium">Lap {laps.length - index}</span>
                  <span className="font-mono text-gray-600">
                    +{diffFormatted.minutes}:{diffFormatted.seconds}.{diffFormatted.centiseconds}
                  </span>
                  <span className="font-mono text-gray-800 font-semibold">
                    {lapFormatted.minutes}:{lapFormatted.seconds}.{lapFormatted.centiseconds}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Clock Page
const ClockPage = () => {
  const [activeTab, setActiveTab] = useState("clock");

  return (
    <div className="page-wrap min-h-screen py-10 sm:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1
          className="text-4xl md:text-5xl font-medium tracking-wide bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 bg-clip-text text-transparent"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          CHRONOGRAPH
        </h1>
        <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Tabs */}
        <div
          className="mx-auto mb-10 w-full max-w-md rounded-2xl p-2"
          style={{
            background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
            boxShadow: "10px 10px 30px #c9c9c9, -10px -10px 30px #ffffff",
          }}
        >
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab("clock")}
              className="rounded-xl px-4 py-3 text-sm md:text-base font-medium tracking-wide transition-all duration-300"
              style={
                activeTab === "clock"
                  ? {
                      background: "linear-gradient(145deg, #dbeafe, #bfdbfe)",
                      boxShadow: "inset 2px 2px 5px #93c5fd, inset -2px -2px 5px #eff6ff",
                      color: "#1e3a8a",
                    }
                  : {
                      background: "linear-gradient(145deg, #f8fafc, #e2e8f0)",
                      color: "#475569",
                    }
              }
              aria-pressed={activeTab === "clock"}
            >
              Live Clock
            </button>
            <button
              onClick={() => setActiveTab("stopwatch")}
              className="rounded-xl px-4 py-3 text-sm md:text-base font-medium tracking-wide transition-all duration-300"
              style={
                activeTab === "stopwatch"
                  ? {
                      background: "linear-gradient(145deg, #fee2e2, #fecaca)",
                      boxShadow: "inset 2px 2px 5px #fca5a5, inset -2px -2px 5px #fff1f2",
                      color: "#991b1b",
                    }
                  : {
                      background: "linear-gradient(145deg, #f8fafc, #e2e8f0)",
                      color: "#475569",
                    }
              }
              aria-pressed={activeTab === "stopwatch"}
            >
              Stopwatch
            </button>
          </div>
        </div>

        {activeTab === "clock" ? <LiveClock /> : <StopWatch />}
      </div>

      {/* Footer */}
      <div className="text-center mt-16 text-gray-500 text-sm">
        <p className="tracking-wider">PRECISION TIMEKEEPING</p>
      </div>
    </div>
  );
};

export default ClockPage;