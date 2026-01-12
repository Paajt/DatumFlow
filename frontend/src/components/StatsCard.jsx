const StatsCard = ({ urgency, count, label }) => {
    const colors = {
        red: 'text-red-600',
        orange: 'text-orange-600',
        yellow: 'text-yellow-600',
        green: 'text-green-600',
    };

    return (
        <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className={`text-3xl font-bold ${colors[urgency]}`}>
                {count}
            </p>
        </div>
    );
};

export default StatsCard;