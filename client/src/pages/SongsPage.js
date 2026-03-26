import { useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, Grid, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { NavLink } from 'react-router-dom';

import SongCard from '../components/SongCard';
import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);

  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState([60, 660]);
  const [plays, setPlays] = useState([0, 1100000000]);
  const [danceability, setDanceability] = useState([0, 1]);
  const [energy, setEnergy] = useState([0, 1]);
  const [valence, setValence] = useState([0, 1]);
  const [explicit, setExplicit] = useState(false);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_songs`)
      .then(res => res.json())
      .then(resJson => {
        const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
        setData(songsWithId);
      });
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_songs?title=${title}` +
      `&duration_low=${duration[0]}&duration_high=${duration[1]}` +
      `&plays_low=${plays[0]}&plays_high=${plays[1]}` +
      `&danceability_low=${danceability[0]}&danceability_high=${danceability[1]}` +
      `&energy_low=${energy[0]}&energy_high=${energy[1]}` +
      `&valence_low=${valence[0]}&valence_high=${valence[1]}` +
      `&explicit=${explicit}`
    )
      .then(res => res.json())
      .then(resJson => {
        const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
        setData(songsWithId);
      })
      .catch(() => {
        alert('Search failed. Please try again.');
      });
  };

  const surpriseMe = () => {
    const randomRange = () => {
      const a = Math.random();
      const b = Math.random();
      return [Math.min(a, b), Math.max(a, b)];
    };
    const d = randomRange();
    const e = randomRange();
    const v = randomRange();
    setDanceability(d);
    setEnergy(e);
    setValence(v);
    fetch(`http://${config.server_host}:${config.server_port}/search_songs?title=${title}` +
      `&duration_low=${duration[0]}&duration_high=${duration[1]}` +
      `&plays_low=${plays[0]}&plays_high=${plays[1]}` +
      `&danceability_low=${d[0]}&danceability_high=${d[1]}` +
      `&energy_low=${e[0]}&energy_high=${e[1]}` +
      `&valence_low=${v[0]}&valence_high=${v[1]}` +
      `&explicit=${explicit}`
    )
      .then(res => res.json())
      .then(resJson => {
        const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
        setData(songsWithId);
      })
      .catch(() => {
        alert('Search failed. Please try again.');
      });
  };

  const columns = [
    {
      field: 'title', headerName: 'Title', width: 280,
      renderCell: (params) => (
        <span className="sw-link" onClick={() => setSelectedSongId(params.row.song_id)} style={{ cursor: 'pointer' }}>
          {params.value}
        </span>
      ),
    },
    { field: 'duration', headerName: 'Duration', width: 100 },
    { field: 'plays', headerName: 'Plays', width: 120 },
    { field: 'danceability', headerName: 'Dance', width: 90 },
    { field: 'energy', headerName: 'Energy', width: 90 },
    { field: 'valence', headerName: 'Valence', width: 90 },
    { field: 'tempo', headerName: 'Tempo', width: 80 },
    { field: 'key_mode', headerName: 'Key', width: 100 },
    { field: 'explicit', headerName: 'Explicit', width: 80 },
  ];

  const sliderSx = {
    color: '#ec4899',
    '& .MuiSlider-thumb': { background: '#f472b6' },
    '& .MuiSlider-rail': { background: 'rgba(249,168,212,0.2)' },
  };

  return (
    <div className="sw-page">
      {selectedSongId && (
        <SongCard songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />
      )}

      <h1 className="sw-heading">Search Songs</h1>

      {/* Search Panel */}
      <div className="sw-search-panel">
        <Grid container spacing={3} alignItems="center">
          {/* Title input */}
          <Grid item xs={12} sm={8}>
            <p className="sw-slider-label">Title</p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              placeholder="Search by title..."
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(249,168,212,0.2)',
                borderRadius: '10px',
                padding: '0.65rem 1rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#ec4899'}
              onBlur={e => e.target.style.borderColor = 'rgba(249,168,212,0.2)'}
            />
          </Grid>

          {/* Explicit checkbox */}
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              label={<span style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)', fontSize: '0.9rem' }}>Include Explicit</span>}
              control={
                <Checkbox
                  checked={explicit}
                  onChange={(e) => setExplicit(e.target.checked)}
                  sx={{ color: '#ec4899', '&.Mui-checked': { color: '#ec4899' } }}
                />
              }
            />
          </Grid>

          {/* Duration */}
          <Grid item xs={12} sm={6}>
            <p className="sw-slider-label">Duration</p>
            <Slider
              value={duration}
              min={60} max={660} step={10}
              onChange={(e, v) => setDuration(v)}
              valueLabelDisplay="auto"
              valueLabelFormat={v => <div>{formatDuration(v)}</div>}
              sx={sliderSx}
            />
          </Grid>

          {/* Plays */}
          <Grid item xs={12} sm={6}>
            <p className="sw-slider-label">Plays (millions)</p>
            <Slider
              value={plays}
              min={0} max={1100000000} step={10000000}
              onChange={(e, v) => setPlays(v)}
              valueLabelDisplay="auto"
              valueLabelFormat={v => <div>{(v / 1000000).toFixed(0)}M</div>}
              sx={sliderSx}
            />
          </Grid>

          {/* Danceability */}
          <Grid item xs={12} sm={4}>
            <p className="sw-slider-label">Danceability</p>
            <Slider value={danceability} min={0} max={1} step={0.01}
              onChange={(e, v) => setDanceability(v)}
              valueLabelDisplay="auto" sx={sliderSx}
            />
          </Grid>

          {/* Energy */}
          <Grid item xs={12} sm={4}>
            <p className="sw-slider-label">Energy</p>
            <Slider value={energy} min={0} max={1} step={0.01}
              onChange={(e, v) => setEnergy(v)}
              valueLabelDisplay="auto" sx={sliderSx}
            />
          </Grid>

          {/* Valence */}
          <Grid item xs={12} sm={4}>
            <p className="sw-slider-label">Valence</p>
            <Slider value={valence} min={0} max={1} step={0.01}
              onChange={(e, v) => setValence(v)}
              valueLabelDisplay="auto" sx={sliderSx}
            />
          </Grid>

          {/* Buttons */}
          <Grid item xs={12} style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="sw-btn sw-btn-primary" onClick={search}>
              ✦ Search
            </button>
            <button className="sw-btn sw-btn-surprise" onClick={surpriseMe}>
              ✦ Surprise Me
            </button>
          </Grid>
        </Grid>
      </div>

      {/* Results */}
      <h2 className="sw-subheading">Results — {data.length} songs</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </div>
  );
}
