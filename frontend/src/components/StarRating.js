import React from 'react';

function StarRating({ rating, onRate, size = 18, interactive = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="stars">
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''}`}
          style={{ fontSize: `${size}px`, cursor: interactive ? 'pointer' : 'default' }}
          onClick={() => interactive && onRate && onRate(star)}
          role={interactive ? 'button' : 'presentation'}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
