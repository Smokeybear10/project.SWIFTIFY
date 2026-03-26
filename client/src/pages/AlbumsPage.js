import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
const config = require('../config.json');

export default function AlbumsPage() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/albums`)
      .then(res => res.json())
      .then(resJson => setAlbums(resJson));
  }, []);

  return (
    <div className="sw-page">
      <h1 className="sw-heading">Albums</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
        The complete Taylor Swift discography
      </p>
      <div className="sw-albums-grid">
        {albums.map((album) => (
          <div key={album.album_id} className="sw-album-card">
            <img
              src={album.thumbnail_url}
              alt={`${album.title} album art`}
            />
            <h4>
              <NavLink to={`/albums/${album.album_id}`}>{album.title}</NavLink>
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}
