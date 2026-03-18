import React from 'react';

const FilmStrip = () => {
  const items = Array(12).fill("CREATIVE VISION · CLOUD ARCHITECTURE").map((text, i) => (
    <div key={i} className="film-item">
      <div className="film-dot"></div>
      <span>{text}</span>
    </div>
  ));

  return (
    <div className="film-strip">
      <div className="film-track">
        {items}
        {items}
      </div>
    </div>
  );
};

export default FilmStrip;
