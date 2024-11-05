import React from 'react';
import './features.css';
import { Canvas } from '@react-three/fiber';
import { ExperienceLanding } from '../3DModel/Dancing/Experience';
import { FaBrain, FaHeart, FaRobot, FaVolumeUp, FaEye } from 'react-icons/fa';

export default function Features() {
    return (
        <div className="Features-Section">
            <div className="container mt-5">
                {/* Header Section */}
                <div className="row text-center mb-5">
                    <h1 className="display-4">Unlock the Full Potential of Tech-E</h1>
                    <p className="lead">Discover smart tools to enhance your Tech-E experience.</p>
                </div>

                {/* Features Section */}
                <div className="row">
                    {/* Features Left Column */}
                    <div className="col-lg-4 col-md-6 col-sm-12 feature-section">
                        <div className="features-container">
                            <div className="features-icon"><FaBrain /></div>
                            <h5 className="heading">Natural Language Processing</h5>
                            <p className="features-container-p">Interact naturally with a chatbot that understands you.</p>
                        </div>
                        <div className="features-container">
                            <div className="features-icon"><FaHeart /></div>
                            <h5 className="heading">Companionship</h5>
                            <p className="features-container-p">Enjoy meaningful interactions that reduce loneliness.</p>
                        </div>
                        <div className="features-container">
                            <div className="features-icon"><FaRobot /></div>
                            <h5 className="heading">Personal Assisting</h5>
                            <p className="features-container-p">Get personalized assistance with reminders and tasks.</p>
                        </div>
                    </div>

                    {/* 3D Model Column */}
                    <div className="col-lg-4 col-md-12 text-center mb-4">
                        <Canvas className="canvas-container">
                            <ExperienceLanding />
                        </Canvas>
                    </div>

                    {/* Features Right Column */}
                    <div className="col-lg-4 col-md-6 col-sm-12 feature-section">
                        <div className="features-container-Right">
                            <div className="features-icon"><FaVolumeUp /></div>
                            <h5 className="heading">Text to Speech</h5>
                            <p className="features-container-p">Hear responses for a more interactive experience.</p>
                        </div>
                        <div className="features-container-Right">
                            <div className="features-icon"><FaRobot /></div>
                            <h5 className="heading">AI Model</h5>
                            <p className="features-container-p">Engage with a powerful AI for accurate responses.</p>
                        </div>
                        <div className="features-container-Right">
                            <div className="features-icon"><FaEye /></div>
                            <h5 className="heading">Visuality</h5>
                            <p className="features-container-p">See your companion with a physical presence.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
