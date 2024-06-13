CREATE DATABASE IF NOT EXISTS bedfellow;
USE bedfellow;

-- Remove tables
-- DROP TABLE bedfellow.sample;
-- DROP TABLE bedfellow.track;
-- DROP TABLE bedfellow.artist;

CREATE TABLE IF NOT EXISTS artist
(
    artist_id INT UNSIGNED AUTO_INCREMENT,
    artist_name VARCHAR(500) NOT NULL,
    PRIMARY KEY (artist_id)
);

CREATE TABLE IF NOT EXISTS track
(
    track_id INT UNSIGNED AUTO_INCREMENT,
    artist_id INT UNSIGNED NOT NULL,
    track_name VARCHAR(500) NOT NULL,
    track_year YEAR,
    track_image BLOB NOT NULL,
    PRIMARY KEY (track_id, artist_id, track_name, track_year), 
    FOREIGN KEY (artist_id) REFERENCES artist (artist_id),
    CONSTRAINT UC_Track UNIQUE (artist_id, track_name, track_year) -- so we can't insert duplicate rows 
);

CREATE TABLE IF NOT EXISTS sample
(
    sample_id INT UNSIGNED AUTO_INCREMENT,	
    track_name VARCHAR(500) NOT NULL,
    track_artist INT UNSIGNED NOT NULL,
    track_year YEAR,
    track_image BLOB,
    sample_artist_id INT UNSIGNED NOT NULL,
    sample_track_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (sample_id, track_name, track_artist, sample_track_id, sample_artist_id), -- no dupe sample entries
    FOREIGN KEY (sample_artist_id) REFERENCES artist (artist_id), -- sampled artist id
    FOREIGN KEY (track_artist) REFERENCES artist (artist_id), -- track artist
    CONSTRAINT UC_Sample UNIQUE (track_name, track_artist, track_year, sample_artist_id, sample_track_id)
);

-- Indexes
CREATE INDEX track_name_index ON track (track_name);
CREATE INDEX artist_name_index ON artist (artist_name);


-- Pre-populate some data
-- Insert artist who sampled track
-- INSERT INTO artist (artist_name) VALUES("Kanye West");
-- Insert sampled artists for track
-- INSERT INTO artist (artist_name) VALUES("Ponderosa Twins Plus One");
-- INSERT INTO artist (artist_name) VALUES("Brenda Lee");
-- INSERT INTO artist (artist_name) VALUES("Wee");


-- Insert track info for each sample
-- INSERT INTO track (artist_id, track_name, track_year, track_image)
-- VALUES(
-- 	(Select artist_id from artist WHERE artist_name = "Ponderosa Twins Plus One" LIMIT 1),
-- 	"Bound",
-- 	1971,
-- 	"https://www.whosampled.com/static/images/media/track_images_200/lr60124_201393_14349154951.jpg" 
-- );

-- INSERT INTO track (artist_id, track_name, track_year, track_image)
-- VALUES(
-- 	(Select artist_id from artist WHERE artist_name = "Brenda Lee" LIMIT 1),
-- 	"Sweet Nothin's",
-- 	1959,
-- 	"https://www.whosampled.com/static/images/media/track_images_200/lr9591_2011312_14739796772.jpg"
-- );

-- INSERT INTO track (artist_id, track_name, track_year, track_image)
-- VALUES(
-- 	(Select artist_id from artist WHERE artist_name = "Wee" LIMIT 1),
-- 	"Aeroplane (Reprise)",
-- 	1977,
-- 	"https://www.whosampled.com/static/images/media/track_images_200/lr9591_2011312_14739796772.jpg"
-- );

-- Samples

-- SET @artist_id = 0;
-- 
-- SELECT @artist_id := artist_id from artist WHERE artist_name = "Kanye West" LIMIT 1;
-- 
-- INSERT INTO bedfellow.sample (track_name, track_artist, track_year, track_image, sample_artist_id, sample_track_id) VALUES
-- 	("Bound 2", @artist_id, 2013, "image blob", 2, 5), 
-- 	("Bound 2", @artist_id, 2013, "image blob", 3, 6),
-- 	("Bound 2", @artist_id, 2013, "image blob", 4, 7)
-- ;

-- Select * from bedfellow.sample;


-- Get samples for a given track
-- SELECT artist_id from artist WHERE artist_name = @ArtistName LIMIT 1 INTO @artist_id;
-- 
-- SELECT
-- 	-- SAMPLE.track_name as track_name,
-- 	SAMPLE.sample_id,
-- 	ARTIST.artist_name as sampled_artist,
-- 	TRACK.track_name as sampled_track,
-- 	TRACK.track_year as track_year,
-- 	TRACK.track_image as sampled_track_image
-- FROM
-- 	sample SAMPLE
-- -- get track info
-- RIGHT JOIN track TRACK on
-- 	TRACK.track_id = SAMPLE.sample_track_id 
-- -- get artist info
-- RIGHT JOIN artist ARTIST ON
-- 	ARTIST.artist_id = TRACK.artist_id
-- WHERE
-- 	SAMPLE.track_name = "Bound 2"
-- 	AND SAMPLE.track_artist  = @artist_id;


-- Select * from bedfellow.track;
-- Select * from bedfellow.sample;
-- Select * from bedfellow.artist;

-- Flush tables
-- Delete from bedfellow.sample;
-- Delete from bedfellow.track;
-- Delete from bedfellow.artist;

