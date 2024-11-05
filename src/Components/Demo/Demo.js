import React from 'react';
import './Demo.css';
import video from "./chatvideo.mp4";

export default function Demo() {
  return (
    <div className="demo-section01">
      <section>
        <div className="demo-section">
          <video className="demo-video" controls muted loop autoPlay>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
    </div>
  );
}
