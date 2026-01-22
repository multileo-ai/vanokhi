import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Ensure this points to your firebase.js
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import "./InstagramGrid.css";

export default function InstagramGrid() {
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    // Reference the 'instagramPosts' collection
    const q = query(
      collection(db, "instagramPosts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGalleryItems(posts);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="grid-section">
      <h2 className="instagram-heading">Our Story</h2>
      <main>
        <div className="gallery-full-width">
          <div className="gallery">
            {galleryItems.map((item) => (
              <a
                href={item.instalink}
                target="_blank"
                rel="noopener noreferrer"
                key={item.id}
                className="gallery-item-link"
              >
                <div className="gallery-item" tabIndex="0">
                  <img
                    src={item.img}
                    className="gallery-image"
                    alt="Instagram Post"
                  />

                  {item.type && (
                    <div className="gallery-item-type">
                      <i
                        className={`fas fa-${
                          item.type === "video" ? "video" : "clone"
                        }`}
                      ></i>
                    </div>
                  )}

                  <div className="gallery-item-info">
                    <ul>
                      <li className="gallery-item-likes">
                        <i className="fas fa-heart"></i> {item.likes || 0}
                      </li>
                      <li className="gallery-item-comments">
                        <i className="fas fa-comment"></i> {item.comments || 0}
                      </li>
                    </ul>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </section>
  );
}
