const StatsCard = ({ urgency, count, label }) => {
    const colors = {
        red: 'bg-red-400 text-white',
        orange: 'bg-yellow-600 text-white',
        yellow: 'bg-yellow-300 text-white',
        green: 'bg-green-600 text-white',
    };

    return (
        <div className={`${colors[urgency]} rounded-lg drop-shadow-2xl p-6 text-center`}>
            <p className="text-lg drop-shadow-lg font-medium mb-2">{label}</p>
            <p className="text-6xl drop-shadow-lg font-bold">
                {count}
                <span className="text-2xl">st</span>
            </p>
        </div>
    );
};

export default StatsCard;