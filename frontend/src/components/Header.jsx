import icaLogo from '../assets/images/ica-logo.svg';
import house from '../assets/images/house.svg';
import apps from '../assets/images/apps.svg';
import shortcut from '../assets/images/shortcut.svg';

const Header = () => {
    return (
        <header className="bg-white border-b-2 border-gray-200 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex gap-2 mr-10">
                        <img src={icaLogo} alt="ICA logo" className="w-16 h-10" />
                        <div className="text-3xl">MinButik</div>
                    </div>
                    <nav className="flex gap-8">
                        <div className="flex gap-1">
                            <img src={house} alt="Hem-knapp" className="w-10 h-10" />
                            <button className="text-xl text-red-600 font-medium">HEM</button>
                        </div>
                        <div className="flex gap-2">
                            <img src={apps} alt="Appar-knapp" className="w-8 h-10" />
                            <button className="text-xl text-red-600 font-medium border-b-4 border-red-600">
                                APPAR
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <img src={shortcut} alt="Genväg-knapp" className="w-8 h-10" />
                            <button className="text-xl text-red-600 font-medium">GENVÄG</button>
                        </div>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-700 text-sm font-medium">Hej, John Doe!</span>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-full text-sm">
                        Logga ut
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;