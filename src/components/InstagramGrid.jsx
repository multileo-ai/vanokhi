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
      // type: "gallery",
    },
    {
      img: "/insta1.jpg",
      likes: 38,
      comments: 0,
      // type: "video",
    },
    {
      img: "/insta2.jpg",
      likes: 47,
      comments: 1,
      // type: "gallery",
    },
    {
      img: "/insta3.jpg",
      likes: 94,
      comments: 3,
    },
  ];

  return (
    <>
      <section className="grid-section">
        {/* Instagram Header */}
        <h2 className="instagram-heading">Our Story</h2>

        {/* Gallery */}
        <main>
          <div className="gallery-full-width">
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
