import React from "react";
import "./InstagramGrid.css";

export default function InstagramGrid() {
  const galleryItems = [
    {
      img: "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=500&h=500&fit=crop",
      likes: 56,
      comments: 2,
    },
    {
      img: "https://images.unsplash.com/photo-1497445462247-4330a224fdb1?w=500&h=500&fit=crop",
      likes: 89,
      comments: 5,
    },
    {
      img: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=500&h=500&fit=crop",
      likes: 42,
      comments: 1,
      type: "gallery",
    },
    {
      img: "https://images.unsplash.com/photo-1502630859934-b3b41d18206c?w=500&h=500&fit=crop",
      likes: 38,
      comments: 0,
      type: "video",
    },
    {
      img: "https://images.unsplash.com/photo-1498471731312-b6d2b8280c61?w=500&h=500&fit=crop",
      likes: 47,
      comments: 1,
      type: "gallery",
    },
    {
      img: "https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=500&h=500&fit=crop",
      likes: 94,
      comments: 3,
    },
    {
      img: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=500&h=500&fit=crop",
      likes: 52,
      comments: 4,
      type: "gallery",
    },
    {
      img: "https://images.unsplash.com/photo-1515814472071-4d632dbc5d4a?w=500&h=500&fit=crop",
      likes: 66,
      comments: 2,
    },
    {
      img: "https://images.unsplash.com/photo-1511407397940-d57f68e81203?w=500&h=500&fit=crop",
      likes: 45,
      comments: 0,
      type: "gallery",
    },
    {
      img: "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?w=500&h=500&fit=crop",
      likes: 34,
      comments: 1,
    },
    {
      img: "https://images.unsplash.com/photo-1505058707965-09a4469a87e4?w=500&h=500&fit=crop",
      likes: 41,
      comments: 0,
    },
    {
      img: "https://images.unsplash.com/photo-1423012373122-fff0a5d28cc9?w=500&h=500&fit=crop",
      likes: 30,
      comments: 2,
      type: "video",
    },
  ];

  return (
    <>
      <section className="grid-section">
        {/* Instagram Header */}
        <header>
          <div className="container">
            <div className="profile">
              {/* Profile Image */}
              <div className="profile-image">
                <img src="/logobg.png" alt="Vanokhi Logo" />
              </div>

              {/* Profile Settings */}
              <div className="profile-user-settings">
                <h1 className="profile-user-name">Vanokhi</h1>
              </div>

              {/* Stats */}
              <div className="profile-stats">
                <ul>
                  <li>
                    <span className="profile-stat-count">164</span> posts
                  </li>
                  <li>
                    <span className="profile-stat-count">188</span> followers
                  </li>
                  <li>
                    <span className="profile-stat-count">206</span> following
                  </li>
                </ul>
              </div>

              {/* Bio */}
              <div className="profile-bio">
                <p>
                  Each collection reflects a new perspective — where Indian
                  identity meets modern expression.{" "}
                  <span className="profile-real-name">Vaanokhi</span> is for
                  those who don’t follow trends, but set their own rhythm.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Gallery */}
        <main>
          <div className="container">
            <div className="gallery">
              {galleryItems.map((item, i) => (
                <div className="gallery-item" tabIndex="0" key={i}>
                  <img src={item.img} className="gallery-image" alt="" />

                  {/* Badges */}
                  {item.type && (
                    <div className="gallery-item-type">
                      <i
                        className={`fas fa-${
                          item.type === "video" ? "video" : "clone"
                        }`}
                      ></i>
                    </div>
                  )}

                  {/* Likes + Comments */}
                  <div className="gallery-item-info">
                    <ul>
                      <li className="gallery-item-likes">
                        <i className="fas fa-heart"></i> {item.likes}
                      </li>
                      <li className="gallery-item-comments">
                        <i className="fas fa-comment"></i> {item.comments}
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </section>
    </>
  );
}
