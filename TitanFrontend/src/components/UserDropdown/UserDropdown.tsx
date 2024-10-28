import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDropdown.css';

interface UserDropdownProps {
    username: string;
    onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ username, onLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Handle click outside the dropdown menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    const handleProfile = () => {
        navigate('/profile');
        setDropdownOpen(false);
    };

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button
                className="dropdown-toggle"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                {username}
                <span className={`arrow ${dropdownOpen ? 'up' : 'down'}`}></span>
            </button>
            {dropdownOpen && (
                <div className="dropdown-menu">
                    <button onClick={handleProfile} className="dropdown-item">
                        Profilo
                    </button>
                    <button onClick={onLogout} className="dropdown-item">
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
