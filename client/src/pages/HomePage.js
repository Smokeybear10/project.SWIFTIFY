import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
const config = require('../config.json');

export default function HomePage() {
  const [songOfTheDay, setSongOfTheDay] = useState({});
  const [authorName, setAuthorName] = useState('');
  const [selectedSongId, setSelectedSongId] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/random`)
      .then(res => res.json())
      .then(resJson => setSongOfTheDay(resJson));

    fetch(`http://${config.server_host}:${config.server_port}/author/name`)
      .then(res => res.json())
      .then(resJson => setAuthorName(resJson.data));
  }, []);

  const songColumns = [
    {
      field: 'title',
      headerName: 'Song Title',
      renderCell: (row) => (
        <span className="sw-link" onClick={() => setSelectedSongId(row.song_id)}>
          {row.title}
        </span>
      ),
    },
    {
      field: 'album',
      headerName: 'Album',
      renderCell: (row) => (
        <NavLink className="sw-link" to={`/albums/${row.album_id}`}>{row.album}</NavLink>
      ),
    },
    { field: 'plays', headerName: 'Plays' },
  ];

  const albumColumns = [
    {
      field: 'title',
      headerName: 'Album Title',
      renderCell: (row) => (
        <NavLink className="sw-link" to={`/albums/${row.album_id}`}>{row.title}</NavLink>
      ),
    },
    { field: 'plays', headerName: 'Plays' },
  ];

  return (
    <div className="sw-page">
      {selectedSongId && (
        <SongCard songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />
      )}

      {/* Hero */}
      <div className="sw-hero">
        <h1 className="sw-hero__title">Welcome to Swiftify</h1>
        <p className="sw-hero__sotd-label">✦ Song of the Day ✦</p>
        <span
          className="sw-hero__song-link"
          onClick={() => setSelectedSongId(songOfTheDay.song_id)}
        >
          {songOfTheDay.title}
        </span>
      </div>

      <hr className="sw-divider" />

      {/* Top Songs */}
      <h2 className="sw-heading">Top Songs</h2>
      <LazyTable
        route={`http://${config.server_host}:${config.server_port}/top_songs`}
        columns={songColumns}
      />

      <hr className="sw-divider" />

      {/* Top Albums */}
      <h2 className="sw-heading">Top Albums</h2>
      <LazyTable
        route={`http://${config.server_host}:${config.server_port}/top_albums`}
        columns={albumColumns}
        defaultPageSize={5}
        rowsPerPageOptions={[5, 10]}
      />

      <hr className="sw-divider" />
      <p className="sw-created-by">Created by {authorName}</p>
    </div>
  );
}
