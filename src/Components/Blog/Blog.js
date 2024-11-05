import LikeButton from './Button/button.js';
import Explore from './assets/Experince.png';
import Experience from './assets/Experince.png';
import Model from './assets/3D.png';
import General from './assets/General.png';
import './Blog.css'

function Blog() {
  return (
    <div className="App">
      <div className="about-container">
      <section className="about-section ">
        <h1 className="main-title">
          Discover the Future of Interaction with Tech-E
        </h1>
        <p className="description">
           Tech-E is here to redefine your experience with AI by blending intelligent conversation with emotional awareness and an interactive 3D interface. As a user-friendly virtual companion, Tech-E is equipped to engage with you on a deeply personal level, offering an experience that’s not just smart but truly supportive. Explore the three unique packages designed to enhance your journey with Tech-E!        </p>
      </section>
  </div>

  <div class="blog-container">
    <div class="blog-post">
        <img src={Explore} alt="Tech-E Avatar Image" />
        <h3>Introducing Tech-E</h3>
        <p class="date">November 1, 2024</p>
        <p class="content">Unlock a whole new experience with Tech-E. Engage with a virtual companion that listens, understands, and connects through interactive text, voice, and 3D features.</p>
        <LikeButton />
    </div>

    <div class="blog-post">
        <img src={Experience} alt="Tech-E Avatar Image" />
        <h3>Creating a Safe and Supportive Tech-E Experience</h3>
        <p class="date">October 25, 2024</p>
        <p class="content">Learn more about our commitment to creating an emotionally intelligent AI that’s sensitive and user-friendly. We prioritize safety and ethical practices in every interaction.</p>
        <LikeButton />
    </div>

    <div class="blog-post">
        <img src={Model} alt="Tech-E Avatar Image" />
        <h3>Explore the 3D Model Interaction</h3>
        <p class="date">October 20, 2024</p>
        <p class="content">Discover Tech-E’s 3D model feature. Simply type “PROPT” to bring up a responsive 3D avatar that adds a new level of engagement, making each conversation feel real and engaging.</p>
        <LikeButton />
    </div>

    <div class="blog-post">
        <img src={General} alt="Tech-E Avatar Image" />
        <h3>Voice Chat: A Natural Way to Connect</h3>
        <p class="date">October 10, 2024</p>
        <p class="content">With the Voice Chat package, talk to Tech-E naturally. This voice-enabled experience makes every interaction easy and enjoyable, enhancing the connection you feel.</p>
        <LikeButton />
    </div>

    <div class="blog-post">
        <img src={General} alt="Tech-E Avatar Image" />
        <h3>Getting Started with Tech-E’s General Chat Package</h3>
        <p class="date">October 1, 2024</p>
        <p class="content">Jump into the world of AI companionship with the General Chat package. Start engaging with Tech-E through text-based conversations that are smart, insightful, and fun.</p>
        <LikeButton />
    </div>
</div>
    </div>
  );
}

export default Blog;
