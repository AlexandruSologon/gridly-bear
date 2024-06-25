import { useEffect } from 'react';

const LineCreateListener = ({lineRefs, lines}) => {

    const handleLineCreated = (event) => {
        console.log('line created, event details:', event.detail);
        const lineRef = lineRefs.current[(lines.length - 1)];
        console.log(lines, ":", lineRef, ":", (lines.length - 1));
        if(lineRef) lineRef.openPopup();
    };

    useEffect(() => {
        // Add the event listener when the component mounts
        document.addEventListener('line-added', handleLineCreated);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('line-added', handleLineCreated);
        };
    }, []); // Empty dependency array means this effect runs only once (on mount)

    return null;
};

export default LineCreateListener;
