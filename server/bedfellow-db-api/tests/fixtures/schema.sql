CREATE TABLE IF NOT EXISTS artist(
    artist_id INT UNSIGNED AUTO_INCREMENT,
    artist_name VARCHAR(500) NOT NULL,
    PRIMARY KEY (artist_id)
);

CREATE TABLE IF NOT EXISTS track(
    track_id INT UNSIGNED AUTO_INCREMENT,
    artist_id INT UNSIGNED NOT NULL,
    track_name VARCHAR(500) NOT NULL,
    track_year YEAR,
    track_image BLOB NOT NULL,
    PRIMARY KEY (track_id, artist_id, track_name, track_year),
    FOREIGN KEY (artist_id) REFERENCES artist (artist_id),
    CONSTRAINT UC_Track UNIQUE (artist_id, track_name, track_year)
);

CREATE TABLE IF NOT EXISTS sample(
    sample_id INT UNSIGNED AUTO_INCREMENT,
    track_name VARCHAR(500) NOT NULL,
    track_artist INT UNSIGNED NOT NULL,
    track_year YEAR,
    track_image BLOB,
    sample_artist_id INT UNSIGNED NOT NULL,
    sample_track_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (
        sample_id,
        track_name,
        track_artist,
        sample_track_id,
        sample_artist_id
    ),
    FOREIGN KEY (sample_artist_id) REFERENCES artist (artist_id),
    FOREIGN KEY (track_artist) REFERENCES artist (artist_id),
    CONSTRAINT UC_Sample UNIQUE (
        track_name,
        track_artist,
        track_year,
        sample_artist_id,
        sample_track_id
    )
);