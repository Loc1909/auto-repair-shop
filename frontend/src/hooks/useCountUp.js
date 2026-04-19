import { useState, useEffect } from "react";

function useCountUp(target, duration = 2000, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        const num = parseFloat(target.replace(/[^0-9.]/g, ""));
        const increment = num / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= num) { setCount(num); clearInterval(timer); }
            else setCount(current);
        }, 16);
        return () => clearInterval(timer);
    }, [start, target, duration]);
    const suffix = target.replace(/[0-9.,]/g, "");
    const prefix = "";
    return prefix + (Number.isInteger(parseFloat(target)) ? Math.floor(count).toLocaleString() : count.toFixed(0)) + suffix;
}
export default useCountUp;