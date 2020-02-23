const express = require("express");
const Playlist = require("./models/playlist");
const Artist = require("./models/artist");
const Album = require("./models/album");
const Track = require("./models/track");
const Sequelize = require("sequelize");

const app = express();
app.use(express.json());

const { Op } = Sequelize;

Artist.hasMany(Album, {
  foreignKey: "ArtistId"
});

Album.belongsTo(Artist, {
  foreignKey: "ArtistId"
});

Playlist.belongsToMany(Track, {
  through: "playlist_track",
  foreignKey: "PlaylistId",
  timestamps: false
});

Track.belongsToMany(Playlist, {
  through: "playlist_track",
  foreignKey: "TrackId",
  timestamps: false
});

app.patch("/api/playlists/:id", async (req, res) => {
  let { id } = req.params;
  let { name } = req.body;
  try {
    const playlist = await Playlist.findByPk(id);
    if (playlist) {
      playlist
        .update({
          name
        })
        .save();
      res.send(playlist);
    }
  } catch (err) {
    res.send(err);
  }
});

app.delete("/api/playlists/:id", (req, res) => {
  let { id } = req.params;
  Playlist.findByPk(id).then(playlist => {
    if (playlist) {
      return playlist.setTracks([]).then(() => {
        return playlist.destroy().then(() => {
          res.status(204).send();
        });
      });
    } else {
      res.status(404).send();
    }
  });
});

app.post("/api/artists", (req, res) => {
  Artist.create({
    name: req.body.name
  })
    .then(artist => {
      res.send(artist);
    })
    .catch(e => {
      res.status(422).send({
        errors: e.errors.map(error => {
          return {
            attribute: error.path,
            message: error.message
          };
        })
      });
    });
});

app.get("/api/playlists", (req, res) => {
  let filter = {};
  const { q } = req.query;
  if (q) {
    filter = {
      where: {
        name: {
          [Op.like]: `${q}%`
        }
      }
    };
  }
  Playlist.findAll(filter).then(playlists => {
    if (playlists) {
      res.json(playlists);
    } else {
      res.status(400).send();
    }
  });
});

app.get("/api/playlists/:id", (req, res) => {
  let { id } = req.params;
  Playlist.findByPk(id, {
    include: [Track]
  }).then(playlists => {
    if (playlists) {
      res.json(playlists);
    }
    res.status(404).send();
  });
});

app.get("/api/artists/:id", (req, res) => {
  let { id } = req.params;
  Artist.findByPk(id, {
    include: [Album]
  }).then(artist => {
    if (artist) {
      res.json(artist);
    }
    res.status(404).send();
  });
});

app.get("/api/albums/:id", (req, res) => {
  let { id } = req.params;
  Album.findByPk(id, {
    // include: [Album]
  }).then(album => {
    if (album) {
      res.json(album);
    }
    res.status(404).send();
  });
});

app.get("/api/tracks/:id", (req, res) => {
  let { id } = req.params;
  Track.findByPk(id, {
    include: [Playlist]
  }).then(track => {
    if (track) {
      res.json(track);
    }
    res.status(404).send();
  });
});

app.listen(8000, () => {
  console.log("listening");
});
