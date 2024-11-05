import React, { useEffect, useState } from 'react';
import Typed from 'typed.js';
import { Link } from 'react-router-dom';
import './Home.css';
import Features from '../Features/features';
import Demo from '../Demo/Demo.js';
import Packages from '../Packages/packages.js';
import Question from '../QuestionBox/qu.js';
import avaterStanding from './imageTE.png'
import UserAvailablePackages from '../AvailablePackages/UserAvailablePackages.js'; // Import the modal component

export default function Home() {
    const [showPackagesModal, setShowPackagesModal] = useState(false); // State to control modal visibility

    useEffect(() => {
        const options = {
            strings: ["Companion", "Personal Assistance"],
            typeSpeed: 50,
            backSpeed: 25,
            backDelay: 1500,
            startDelay: 500,
            loop: true,
            showCursor: true,
        };

        const typed = new Typed(".text", options);

        return () => {
            typed.destroy();
        };
    }, []);

    const handleStartClick = () => {
        setShowPackagesModal(true); 
    };

    return (
        <div>
            <div className="hero">
                <main className="flex-fill container mt-4">
                    <div className="row align-items-center justify-content-center">
                        <div className="intro-section col-md-6 text-center text-md-left">
                            <h3 className="Hello">Hello It's Me</h3>
                            <h3 className="Tech-E">Tech-E</h3>
                            <h3><span className="text"></span></h3>
                            <p>I'm Your Friend</p>
                            <div className="btn-group">
                                <button onClick={handleStartClick} className="btn-home">Start</button>
                                <a href="#video" className="btn-home">Explore</a>
                            </div>
                        </div>
                        {/* Replace Canvas with an Image */}
                        <div className="AvaterHome col-md-6 text-center">
                            <img 
                                src={avaterStanding} // Replace with the actual path to your image
                                alt="Tech-E Avatar" 
                                style={{ height: '100vh', width: '120%', objectFit: 'cover' }} 
                            />
                        </div>
                    </div>
                </main>
            </div>

            <Features />
            <Packages />
            <div id="video">
                <Demo />
            </div>
            <Question />

            <UserAvailablePackages show={showPackagesModal} handleClose={() => setShowPackagesModal(false)} />
        </div>
    );
}
